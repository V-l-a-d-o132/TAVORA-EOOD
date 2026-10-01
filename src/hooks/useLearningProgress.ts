import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { LEARNING_SECTIONS } from '@/mocks/learning-platform';
import { bookmarkStorageKey, bookmarkTarget, LEARNING_PROGRESS_CHANGED, parseBookmark, readLocalBookmark, type ResumeTarget } from '@/lib/learning-resume';

export type { ResumeTarget } from '@/lib/learning-resume';

export interface FlatModule {
  moduleId: string; number: string; title: string; duration: string;
  sectionTitle: string; sectionId: string; sectionIcon: string;
  totalLessons: number; lessonIds: string[];
}

export interface ModuleProgressData {
  completedLessons: number; completedLessonIds: string[];
  quizCount: number; points: number; lastActivity: string | null;
}

interface ProgressRow {
  module_id: string; lesson_id: string; completed: boolean;
  quiz_score: number | null; xp: number; updated_at: string | null;
}

export interface LearningProgress {
  modProgressMap: Record<string, ModuleProgressData>;
  moduleProgressMap: Record<string, { completed: number; total: number }>;
  sectionProgressMap: Record<string, { completed: number; total: number }>;
  allModules: FlatModule[]; allLessonIds: string[];
  completedLessons: number; completedModules: number; totalLessons: number;
  totalModules: number; totalPoints: number; totalQuizCount: number;
  homeworkCount: number; overallPercent: number; allDates: string[];
  hasFullAccess: boolean; unlockedModules: string[];
  resumeTarget: ResumeTarget | null;
  isLoading: boolean; error: boolean; refetch: () => void;
}

const ALL_MODULES: FlatModule[] = LEARNING_SECTIONS.flatMap(section =>
  section.modules.map(mod => ({
    moduleId: mod.id, number: mod.number, title: mod.title, duration: mod.duration,
    sectionTitle: section.title, sectionId: section.id, sectionIcon: section.icon,
    totalLessons: mod.lessons.length, lessonIds: mod.lessons.map(lesson => lesson.id),
  })),
);
const ALL_LESSON_IDS = ALL_MODULES.flatMap(module => module.lessonIds);

function firstIncomplete(progress: Record<string, ModuleProgressData>, hasFullAccess: boolean, unlocked: string[]): ResumeTarget | null {
  for (const section of LEARNING_SECTIONS) {
    for (const mod of section.modules) {
      if (mod.isLocked && !hasFullAccess && !unlocked.includes(mod.id)) continue;
      const lessonIndex = mod.lessons.findIndex(lesson => !progress[mod.id]?.completedLessonIds.includes(lesson.id));
      if (lessonIndex >= 0) return { moduleId: mod.id, lessonIndex, lessonTitle: mod.lessons[lessonIndex].title, sectionTitle: section.title };
    }
  }
  return null;
}

export function useLearningProgress(userId: string | undefined): LearningProgress {
  const { hasFullAccess, unlockedModules } = useAuth();
  const accessKey = JSON.stringify([hasFullAccess, unlockedModules]);
  const [snapshot, setSnapshot] = useState<{
    userId: string; rows: ProgressRow[]; bookmark: unknown; homeworkCount: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fetchKey, setFetchKey] = useState(0);
  const refetch = useCallback(() => setFetchKey(key => key + 1), []);

  useEffect(() => {
    if (!userId) return;
    const changed = (event: Event) => {
      if ((event as CustomEvent<string>).detail === userId) refetch();
    };
    const visible = () => { if (document.visibilityState === 'visible') refetch(); };
    const storage = (event: StorageEvent) => { if (event.key === bookmarkStorageKey(userId)) refetch(); };
    window.addEventListener(LEARNING_PROGRESS_CHANGED, changed);
    window.addEventListener('focus', refetch);
    window.addEventListener('online', refetch);
    window.addEventListener('storage', storage);
    document.addEventListener('visibilitychange', visible);
    return () => {
      window.removeEventListener(LEARNING_PROGRESS_CHANGED, changed);
      window.removeEventListener('focus', refetch);
      window.removeEventListener('online', refetch);
      window.removeEventListener('storage', storage);
      document.removeEventListener('visibilitychange', visible);
    };
  }, [userId, refetch]);

  useEffect(() => {
    if (!userId) { setSnapshot(null); setIsLoading(false); setError(false); return; }
    let cancelled = false;
    setIsLoading(true);
    setError(false);
    void (async () => {
      try {
        const [progress, homework, profile] = await Promise.all([
          supabase.rpc('academy_get_learning_progress'),
          supabase.from('homework').select('id', { count: 'exact', head: true }).eq('user_id', userId),
          supabase.from('profiles').select('last_opened_lesson').eq('id', userId).maybeSingle(),
        ]);
        if (progress.error || homework.error || profile.error || !Array.isArray(progress.data)) throw new Error('Progress unavailable');
        if (!cancelled) setSnapshot({ userId, rows: progress.data, bookmark: profile.data?.last_opened_lesson, homeworkCount: homework.count ?? 0 });
      } catch { if (!cancelled) setError(true); }
      finally { if (!cancelled) setIsLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [userId, accessKey, fetchKey]);

  // Never display another account's snapshot while its replacement is loading.
  const data = snapshot?.userId === userId ? snapshot : null;
  const modProgressMap: Record<string, ModuleProgressData> = {};
  for (const mod of ALL_MODULES) modProgressMap[mod.moduleId] = {
    completedLessons: 0, completedLessonIds: [], quizCount: 0, points: 0, lastActivity: null,
  };
  const rows: ProgressRow[] = [];
  const seen = new Set<string>();
  for (const row of data?.rows || []) {
    const mod = ALL_MODULES.find(item => item.moduleId === row.module_id);
    const key = row.module_id + ':' + row.lesson_id;
    if (!mod?.lessonIds.includes(row.lesson_id) || seen.has(key)) continue;
    seen.add(key);
    rows.push(row);
    const entry = modProgressMap[mod.moduleId];
    if (row.completed) entry.completedLessonIds.push(row.lesson_id);
    if (typeof row.quiz_score === 'number') entry.quizCount++;
    if (typeof row.xp === 'number' && Number.isFinite(row.xp)) entry.points += Math.max(0, row.xp);
    if (row.updated_at && (!entry.lastActivity || Date.parse(row.updated_at) > Date.parse(entry.lastActivity))) entry.lastActivity = row.updated_at;
    entry.completedLessons = entry.completedLessonIds.length;
  }

  const moduleProgressMap: LearningProgress['moduleProgressMap'] = {};
  for (const mod of ALL_MODULES) moduleProgressMap[mod.moduleId] = { completed: modProgressMap[mod.moduleId].completedLessons, total: mod.totalLessons };
  const sectionProgressMap: LearningProgress['sectionProgressMap'] = {};
  for (const section of LEARNING_SECTIONS) sectionProgressMap[section.id] = {
    completed: section.modules.filter(mod => mod.lessons.length > 0 && modProgressMap[mod.id].completedLessons === mod.lessons.length).length,
    total: section.modules.length,
  };

  // Explicit, user-scoped bookmarks take precedence over activity and gaps.
  const bookmarks = [data?.bookmark, userId ? readLocalBookmark(userId) : null]
    .map(parseBookmark).filter(value => value !== null)
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
  let resumeTarget: ResumeTarget | null = null;
  if (userId) {
    for (const bookmark of bookmarks) {
      resumeTarget = bookmarkTarget(bookmark, hasFullAccess, unlockedModules);
      if (resumeTarget) break;
    }
    if (!resumeTarget) {
      for (const row of [...rows].filter(row => !!row.updated_at).sort((a, b) => Date.parse(b.updated_at!) - Date.parse(a.updated_at!))) {
        resumeTarget = bookmarkTarget({ moduleId: row.module_id, lessonId: row.lesson_id, timestamp: row.updated_at! }, hasFullAccess, unlockedModules);
        if (resumeTarget) break;
      }
    }
    resumeTarget ??= firstIncomplete(modProgressMap, hasFullAccess, unlockedModules);
  }

  const completedLessons = rows.filter(row => row.completed).length;
  const totalLessons = ALL_LESSON_IDS.length;
  return {
    modProgressMap, moduleProgressMap, sectionProgressMap,
    allModules: ALL_MODULES, allLessonIds: ALL_LESSON_IDS,
    completedLessons,
    completedModules: Object.values(sectionProgressMap).reduce((sum, item) => sum + item.completed, 0),
    totalLessons, totalModules: ALL_MODULES.length,
    totalPoints: Object.values(modProgressMap).reduce((sum, item) => sum + item.points, 0),
    totalQuizCount: Object.values(modProgressMap).reduce((sum, item) => sum + item.quizCount, 0),
    homeworkCount: data?.homeworkCount ?? 0,
    overallPercent: totalLessons ? Math.round(100 * completedLessons / totalLessons) : 0,
    allDates: rows.flatMap(row => row.updated_at ? [row.updated_at] : []),
    hasFullAccess, unlockedModules, resumeTarget,
    isLoading: isLoading || (!!userId && !data && !error), error, refetch,
  };
}
