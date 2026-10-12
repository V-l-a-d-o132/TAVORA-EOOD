import { LEARNING_SECTIONS, PREVIOUS_MARKETING_LESSONS } from '@/mocks/learning-platform';
import { supabase } from '@/lib/supabase';
import { lessonRoute, locateLesson } from '@/lib/academy-lesson-location';

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
  const stableId = typeof raw.lessonId === 'string' ? raw.lessonId : null;
  const previous = !stableId && Number.isInteger(raw.lessonIndex) && typeof raw.lessonTitle === 'string'
    ? (mod.id.startsWith('s03-') ? PREVIOUS_MARKETING_LESSONS[mod.id] : mod.lessons)?.[raw.lessonIndex as number] : undefined;
  if (!stableId && (!previous || previous.title !== raw.lessonTitle)) return null;
  const lessonId = stableId || previous?.id;
  if (!lessonId) return null;
  const lesson = mod.lessons.find(item => item.id === lessonId);
  const moved = !lesson ? locateLesson(mod.id, lessonId) : null;
  if (!lesson && !moved) return null;
  return { moduleId: moved?.module.id || mod.id, lessonId, timestamp: raw.timestamp };
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

export function resumeTargetRoute(target: ResumeTarget): string {
  const module = LEARNING_SECTIONS.flatMap(section => section.modules).find(item => item.id === target.moduleId);
  const lesson = module?.lessons[target.lessonIndex];
  return lesson ? lessonRoute(target.moduleId, lesson.id, target.lessonIndex) : `/module/${target.moduleId}`;
}

export function recordLessonVisit(userId: string, moduleId: string, lessonId: string): Promise<void> {
  const bookmark = { moduleId, lessonId, timestamp: new Date().toISOString() };
  const displayedBookmark = parseBookmark(bookmark) || bookmark;
  const key = bookmarkStorageKey(userId);
  // Namespaced by user; the old shared localStorage key is intentionally ignored.
  try { localStorage.setItem(key, JSON.stringify(displayedBookmark)); } catch { /* Storage can be disabled. */ }
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
      if (saved && current?.timestamp === bookmark.timestamp && current.lessonId === lessonId && current.moduleId === displayedBookmark.moduleId) {
        localStorage.setItem(key, JSON.stringify(saved));
      }
    } catch { /* Remote bookmark is still saved. */ }
    notifyLearningProgressChanged(userId);
  });
  visitQueue = request;
  return request;
}
