import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { LEARNING_SECTIONS } from '@/mocks/learning-platform';

/* ─── Types ─── */

export interface FlatModule {
  moduleId: string;
  number: string;
  title: string;
  duration: string;
  sectionTitle: string;
  sectionId: string;
  sectionIcon: string;
  totalLessons: number;
  lessonIds: string[];
}

export interface ModuleProgressData {
  completedLessons: number;
  completedLessonIds?: string[];
  quizCount: number;
  points: number;
  lastActivity: string | null;
}

export interface ResumeTarget {
  moduleId: string;
  lessonIndex: number;
  lessonTitle: string;
  sectionTitle: string;
}

export interface LearningProgress {
  /* raw maps */
  modProgressMap: Record<string, ModuleProgressData>;
  moduleProgressMap: Record<string, { completed: number; total: number }>;
  sectionProgressMap: Record<string, { completed: number; total: number }>;
  /* flat module list */
  allModules: FlatModule[];
  allLessonIds: string[];
  /* aggregates */
  completedLessons: number;
  completedModules: number;
  totalLessons: number;
  totalModules: number;
  totalPoints: number;
  totalQuizCount: number;
  homeworkCount: number;
  overallPercent: number;
  allDates: string[];
  /* access — single source of truth is AuthContext */
  hasFullAccess: boolean;
  unlockedModules: string[];
  /* resume */
  resumeTarget: ResumeTarget | null;
  /* state */
  isLoading: boolean;
  error: boolean;
  refetch: () => void;
}

/* ─── Derived data ─── */

const ALL_MODULES: FlatModule[] = LEARNING_SECTIONS.flatMap((section) =>
  section.modules.map((mod) => ({
    moduleId: mod.id,
    number: mod.number,
    title: mod.title,
    duration: mod.duration,
    sectionTitle: section.title,
    sectionId: section.id,
    sectionIcon: section.icon,
    totalLessons: mod.lessons.length,
    lessonIds: mod.lessons.map((l) => l.id),
  }))
);

const ALL_LESSON_IDS = ALL_MODULES.flatMap((m) => m.lessonIds);

/* ─── Helpers ─── */

function findResumeTarget(
  modProgressMap: Record<string, ModuleProgressData>,
  unlockedModules: string[],
  hasFullAccess: boolean,
): ResumeTarget | null {
  for (const section of LEARNING_SECTIONS) {
    let sectionHasIncomplete = false;
    let firstIncompleteInSection: ResumeTarget | null = null;

    for (const mod of section.modules) {
      // Skip locked modules that the user hasn't unlocked
      if (mod.isLocked && !hasFullAccess && !unlockedModules.includes(mod.id)) continue;

      const prog = modProgressMap[mod.id];
      const isComplete = prog && prog.completedLessons >= mod.lessons.length;

      if (!isComplete) {
        sectionHasIncomplete = true;
        if (!firstIncompleteInSection) {
          const firstIncomplete = prog?.completedLessonIds
            ? mod.lessons.findIndex((lesson) => !prog.completedLessonIds!.includes(lesson.id))
            : prog ? prog.completedLessons : 0;
          const lessonIdx = Math.min(firstIncomplete, mod.lessons.length - 1);
          const lesson = mod.lessons[lessonIdx];
          firstIncompleteInSection = {
            moduleId: mod.id,
            lessonIndex: lessonIdx,
            lessonTitle: lesson?.title || 'Първи урок',
            sectionTitle: section.title,
          };
        }
      }
    }

    // Return the first incomplete module from the first section that has one.
    // This prevents jumping across courses when the user finishes a module.
    if (sectionHasIncomplete) return firstIncompleteInSection;
  }
  return null;
}

/* ─── In-memory cache (progress only — NOT access) ─── */

interface CachedState {
  modProgressMap: Record<string, ModuleProgressData>;
  moduleProgressMap: Record<string, { completed: number; total: number }>;
  sectionProgressMap: Record<string, { completed: number; total: number }>;
  homeworkCount: number;
  fetchedAt: number;
  userId: string;
}

let progressCache: CachedState | null = null;
const FRESH_TTL = 30_000;       // 30s — serve instantly, no loading spinner
const STALE_TTL = 5 * 60_000;   // 5min — serve stale, background refresh

/* ─── Hook ─── */

export function useLearningProgress(userId: string | undefined) {
  // Access comes from AuthContext — the single source of truth.
  // This prevents the "paid but still locked" bug caused by two separate caches.
  const { hasFullAccess, unlockedModules } = useAuth();

  const [modProgressMap, setModProgressMap] = useState<Record<string, ModuleProgressData>>({});
  const [moduleProgressMap, setModuleProgressMap] = useState<Record<string, { completed: number; total: number }>>({});
  const [sectionProgressMap, setSectionProgressMap] = useState<Record<string, { completed: number; total: number }>>({});
  const [homeworkCount, setHomeworkCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fetchKey, setFetchKey] = useState(0);
  const isManualRefetch = useRef(false);

  const refetch = useCallback(() => {
    isManualRefetch.current = true;
    setFetchKey((k) => k + 1);
  }, []);

  /* ─── Apply cached state directly ─── */
  const applyCachedState = useCallback((cached: CachedState) => {
    setModProgressMap(cached.modProgressMap);
    setModuleProgressMap(cached.moduleProgressMap);
    setSectionProgressMap(cached.sectionProgressMap);
    setHomeworkCount(cached.homeworkCount);
  }, []);

  useEffect(() => {
    if (!userId) {
      setModProgressMap({});
      setModuleProgressMap({});
      setSectionProgressMap({});
      setHomeworkCount(0);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    /* ─── Cache check (skip on manual refetch) ─── */
    if (!isManualRefetch.current) {
      const now = Date.now();
      const cached = progressCache;
      const cacheHit = cached && cached.userId === userId;
      const isFresh = cacheHit && (now - cached.fetchedAt) < FRESH_TTL;
      const isStale = cacheHit && (now - cached.fetchedAt) < STALE_TTL;

      if (isFresh) {
        applyCachedState(cached!);
        setIsLoading(false);
        setError(false);
        return;
      }

      if (isStale) {
        applyCachedState(cached!);
        setIsLoading(false);
        setError(false);
        // fall through → background refresh
      } else {
        setIsLoading(true);
      }
    } else {
      setIsLoading(true);
    }

    setError(false);

    (async () => {
      try {
        const [progressRes, homeworkRes, silkRoadRes] = await Promise.all([
          supabase
            .from('pdf_progress')
            .select('module_id, lesson_id, completed, quiz_score, updated_at')
            .eq('user_id', userId)
            .in('lesson_id', ALL_LESSON_IDS),
          supabase
            .from('homework')
            .select('id', { count: 'exact' })
            .eq('user_id', userId),
          supabase.rpc('academy_get_silk_road_progress'),
        ]);
        if (progressRes.error || homeworkRes.error || silkRoadRes.error) throw new Error('Progress unavailable');

        if (cancelled) return;

        /* ---- build progress maps ---- */
        const modRawMap: Record<string, { completed: Set<string>; quizCount: number; dates: string[]; xp: number }> = {};
        const modCompTotal: Record<string, { completed: number; total: number }> = {};
        const secCompTotal: Record<string, { completed: number; total: number }> = {};

        ALL_MODULES.forEach((m) => {
          modRawMap[m.moduleId] = { completed: new Set(), quizCount: 0, dates: [], xp: 0 };
          modCompTotal[m.moduleId] = { completed: 0, total: m.totalLessons };
        });

        LEARNING_SECTIONS.forEach((s) => {
          secCompTotal[s.id] = { completed: 0, total: s.modules.length };
        });

        if (progressRes.data) {
          progressRes.data.forEach((row) => {
            const entry = modRawMap[row.module_id];
            if (!entry || row.module_id >= 's01-m01' && row.module_id <= 's01-m11') return;
            if (row.completed) { entry.completed.add(row.lesson_id); entry.xp += 10; }
            if (row.quiz_score !== null && row.quiz_score !== undefined) entry.quizCount += 1;
            if (row.updated_at) entry.dates.push(row.updated_at);
          });
        }

        if (Array.isArray(silkRoadRes.data)) {
          for (const row of silkRoadRes.data) {
            const entry = modRawMap[row.module_id];
            if (!entry) continue;
            if (row.completed) entry.completed.add(row.lesson_id);
            if (typeof row.quiz_score === 'number') entry.quizCount += 1;
            entry.xp += typeof row.xp === 'number' ? row.xp : 0;
            if (row.updated_at) entry.dates.push(row.updated_at);
          }
        }

        /* final maps */
        const finalModProgress: Record<string, ModuleProgressData> = {};

        Object.entries(modRawMap).forEach(([modId, data]) => {
          finalModProgress[modId] = {
            completedLessons: data.completed.size,
            completedLessonIds: [...data.completed],
            quizCount: data.quizCount,
            points: data.xp,
            lastActivity:
              data.dates.length > 0
                ? data.dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
                : null,
          };

          modCompTotal[modId] = {
            completed: data.completed.size,
            total: modCompTotal[modId]?.total || 0,
          };

          if (data.completed.size >= (modCompTotal[modId]?.total || 1)) {
            LEARNING_SECTIONS.forEach((s) => {
              if (s.modules.some((m) => m.id === modId)) {
                if (secCompTotal[s.id]) secCompTotal[s.id].completed += 1;
              }
            });
          }
        });

        if (cancelled) return;

        const hwCount = homeworkRes.count ?? 0;

        /* ─── Update cache (progress only, no access) ─── */
        progressCache = {
          modProgressMap: finalModProgress,
          moduleProgressMap: modCompTotal,
          sectionProgressMap: secCompTotal,
          homeworkCount: hwCount,
          fetchedAt: Date.now(),
          userId,
        };

        setModProgressMap(finalModProgress);
        setModuleProgressMap(modCompTotal);
        setSectionProgressMap(secCompTotal);
        setHomeworkCount(hwCount);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          isManualRefetch.current = false;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, fetchKey, applyCachedState]);

  /* derived aggregates */
  const totalLessons = ALL_MODULES.reduce((s, m) => s + m.totalLessons, 0);
  const totalModules = ALL_MODULES.length;
  const completedLessons = Object.values(modProgressMap).reduce((s, v) => s + v.completedLessons, 0);
  const completedModules = ALL_MODULES.filter((m) => {
    const prog = modProgressMap[m.moduleId];
    return prog && prog.completedLessons >= m.totalLessons;
  }).length;
  const totalQuizCount = Object.values(modProgressMap).reduce((s, v) => s + v.quizCount, 0);
  const totalPoints = Object.values(modProgressMap).reduce((sum, item) => sum + item.points, 0) + homeworkCount * 15;
  const overallPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const allDates = Object.values(modProgressMap).flatMap((v) => (v.lastActivity ? [v.lastActivity] : []));

  const resumeTarget = findResumeTarget(modProgressMap, unlockedModules, hasFullAccess);

  return {
    modProgressMap,
    moduleProgressMap,
    sectionProgressMap,
    allModules: ALL_MODULES,
    allLessonIds: ALL_LESSON_IDS,
    completedLessons,
    completedModules,
    totalLessons,
    totalModules,
    totalPoints,
    totalQuizCount,
    homeworkCount,
    overallPercent,
    allDates,
    hasFullAccess,
    unlockedModules,
    resumeTarget,
    isLoading,
    error,
    refetch,
  } satisfies LearningProgress;
}