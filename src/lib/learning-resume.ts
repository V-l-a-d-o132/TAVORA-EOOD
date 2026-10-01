import { LEARNING_SECTIONS } from '@/mocks/learning-platform';
import { supabase } from '@/lib/supabase';

export const LEARNING_PROGRESS_CHANGED = 'tavora:learning-progress-changed';
export const bookmarkStorageKey = (userId: string) => `tavora:last-lesson:${userId}`;

export interface LessonBookmark {
  moduleId: string;
  lessonId: string;
  timestamp: string;
}

export interface ResumeTarget {
  moduleId: string;
  lessonIndex: number;
  lessonTitle: string;
  sectionTitle: string;
}

export function notifyLearningProgressChanged(userId: string) {
  window.dispatchEvent(new CustomEvent(LEARNING_PROGRESS_CHANGED, { detail: userId }));
}

export function parseBookmark(value: unknown): LessonBookmark | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.moduleId !== 'string' || typeof raw.timestamp !== 'string' || !Number.isFinite(Date.parse(raw.timestamp))) return null;
  const mod = LEARNING_SECTIONS.flatMap(section => section.modules).find(item => item.id === raw.moduleId);
  if (!mod) return null;
  // Legacy profile bookmarks used an array index. Require the matching title
  // so an old index cannot silently point to different, rearranged content.
  const lesson = typeof raw.lessonId === 'string'
    ? mod.lessons.find(item => item.id === raw.lessonId)
    : Number.isInteger(raw.lessonIndex) && typeof raw.lessonTitle === 'string'
      ? mod.lessons[raw.lessonIndex as number] : undefined;
  if (!lesson || (typeof raw.lessonId !== 'string' && lesson.title !== raw.lessonTitle)) return null;
  return { moduleId: mod.id, lessonId: lesson.id, timestamp: raw.timestamp };
}

export function readLocalBookmark(userId: string): LessonBookmark | null {
  try { return parseBookmark(JSON.parse(localStorage.getItem(bookmarkStorageKey(userId)) || 'null')); }
  catch { return null; }
}

export function newestBookmark(values: unknown[], moduleId?: string): LessonBookmark | null {
  return values.map(parseBookmark).filter((value): value is LessonBookmark => !!value && (!moduleId || value.moduleId === moduleId))
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))[0] || null;
}

export function bookmarkTarget(bookmark: LessonBookmark, hasFullAccess: boolean, unlockedModules: string[]): ResumeTarget | null {
  for (const section of LEARNING_SECTIONS) {
    const mod = section.modules.find(item => item.id === bookmark.moduleId);
    if (!mod || (mod.isLocked && !hasFullAccess && !unlockedModules.includes(mod.id))) continue;
    const lessonIndex = mod.lessons.findIndex(lesson => lesson.id === bookmark.lessonId);
    if (lessonIndex < 0) return null;
    return { moduleId: mod.id, lessonIndex, lessonTitle: mod.lessons[lessonIndex].title, sectionTitle: section.title };
  }
  return null;
}

let visitQueue: Promise<unknown> = Promise.resolve();

export function recordLessonVisit(userId: string, moduleId: string, lessonId: string): Promise<void> {
  const bookmark = { moduleId, lessonId, timestamp: new Date().toISOString() };
  const key = bookmarkStorageKey(userId);
  // Namespaced by user; the old shared localStorage key is intentionally ignored.
  try { localStorage.setItem(key, JSON.stringify(bookmark)); } catch { /* Storage can be disabled. */ }
  notifyLearningProgressChanged(userId);
  // Rapid navigation must not let an older, slower response replace a new visit.
  const request = visitQueue.catch(() => {}).then(async () => {
    const { data, error } = await supabase.rpc('academy_record_lesson_visit', {
      p_user: userId, p_module: moduleId, p_lesson: lessonId,
    });
    if (error) throw error;
    const saved = parseBookmark(data);
    try {
      const current = readLocalBookmark(userId);
      if (saved && current?.timestamp === bookmark.timestamp && current.lessonId === lessonId && current.moduleId === moduleId) {
        localStorage.setItem(key, JSON.stringify(saved));
      }
    } catch { /* Remote bookmark is still saved. */ }
    notifyLearningProgressChanged(userId);
  });
  visitQueue = request;
  return request;
}
