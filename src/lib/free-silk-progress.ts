import { closedLessonState } from '@/lib/closed-lesson-state';
import type { JsonObject, LessonV2 } from '@/lib/lesson-engine-v2';

export const FREE_SILK_LESSONS = ['l01-01', 'l01-02', 'l01-03', 'l01-04'] as const;
export const FREE_SILK_PROGRESS_EVENT = 'academy:free-silk-progress';
const prefix = 'academy:free-silk:20261016:';
type Snapshot = { versionId: string; currentBlockKey: string | null; blockState: Record<string, JsonObject>; completedBlockKeys: string[]; xp: number; lessonComplete: boolean };
const object = (v: unknown): Record<string, unknown> => v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {};

function read(lessonId: string) {
  try { const raw = localStorage.getItem(prefix + lessonId); return raw && raw.length < 65536 ? object(JSON.parse(raw)) : {}; } catch { return {}; }
}

/** Device-only practice memory. It never grants account XP, access or a certificate. */
export function readFreeSilkProgress(lesson: LessonV2): Snapshot | null {
  if (lesson.moduleId !== 's01-m01' || !FREE_SILK_LESSONS.some(id => id === lesson.lessonId)) return null;
  const saved = read(lesson.lessonId);
  if (saved.versionId !== lesson.versionId) {
    try { localStorage.removeItem(prefix + lesson.lessonId); window.dispatchEvent(new Event(FREE_SILK_PROGRESS_EVENT)); } catch { /* Storage is optional. */ }
    return null;
  }
  const allowed = new Set(lesson.blocks.map(b => b.key));
  const completed = Array.isArray(saved.completedBlockKeys) ? [...new Set(saved.completedBlockKeys.filter((key): key is string => typeof key === 'string' && allowed.has(key)))] : [];
  return { versionId: lesson.versionId, currentBlockKey: typeof saved.currentBlockKey === 'string' && allowed.has(saved.currentBlockKey) ? saved.currentBlockKey : null,
    blockState: closedLessonState(lesson.blocks, saved.blockState), completedBlockKeys: completed,
    xp: lesson.blocks.filter(b => completed.includes(b.key)).reduce((sum, b) => sum + b.points, 0),
    lessonComplete: lesson.blocks.some(b => b.required) && lesson.blocks.filter(b => b.required).every(b => completed.includes(b.key)) };
}

export function saveFreeSilkProgress(lesson: LessonV2, currentBlockKey: string | null, blockState: Record<string, JsonObject>, completedBlockKeys: Set<string>) {
  if (lesson.moduleId !== 's01-m01' || !FREE_SILK_LESSONS.some(id => id === lesson.lessonId)) return;
  const completed = lesson.blocks.filter(b => completedBlockKeys.has(b.key));
  const snapshot: Snapshot = { versionId: lesson.versionId, currentBlockKey,
    blockState: closedLessonState(lesson.blocks, blockState), completedBlockKeys: completed.map(b => b.key),
    xp: completed.reduce((sum, b) => sum + b.points, 0),
    lessonComplete: lesson.blocks.some(b => b.required) && lesson.blocks.filter(b => b.required).every(b => completedBlockKeys.has(b.key)) };
  try { localStorage.setItem(prefix + lesson.lessonId, JSON.stringify(snapshot)); window.dispatchEvent(new Event(FREE_SILK_PROGRESS_EVENT)); } catch { /* Guest practice also works without storage. */ }
}

export function freeSilkDeviceSummary() {
  const rows = FREE_SILK_LESSONS.map(id => ({ id, value: read(id) }));
  return { completedLessonIds: rows.filter(r => r.value.lessonComplete === true && typeof r.value.versionId === 'string').map(r => r.id),
    xp: rows.reduce((sum, r) => sum + (typeof r.value.xp === 'number' && Number.isInteger(r.value.xp) && r.value.xp >= 0 && r.value.xp <= 10000 ? r.value.xp : 0), 0) };
}

export function clearFreeSilkProgress(lesson: LessonV2) {
  if (lesson.moduleId !== 's01-m01' || read(lesson.lessonId).versionId !== lesson.versionId) return;
  try { localStorage.removeItem(prefix + lesson.lessonId); window.dispatchEvent(new Event(FREE_SILK_PROGRESS_EVENT)); } catch { /* The account copy is already confirmed. */ }
}
