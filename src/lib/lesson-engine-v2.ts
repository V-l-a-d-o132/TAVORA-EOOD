import { supabase } from '@/lib/supabase';

export const LESSON_BLOCK_TYPES = [
  'objective', 'hook', 'concept', 'rich_text', 'step_reveal', 'before_after',
  'flip_cards', 'sequence_sort', 'matching', 'image_hotspot', 'decision_tree',
  'case_study', 'scenario', 'client_simulation', 'calculator', 'prompt_builder',
  'practical_response', 'reflection', 'checklist', 'quiz', 'homework',
  'submission', 'example', 'summary',
] as const;

export type LessonBlockType = (typeof LESSON_BLOCK_TYPES)[number];
export type JsonObject = Record<string, unknown>;

export interface LessonBlockV2 {
  id: string;
  key: string;
  position: number;
  type: LessonBlockType;
  title: string;
  content: JsonObject;
  required: boolean;
  points: number;
  evaluation?: JsonObject;
  feedback?: JsonObject;
  scoring?: JsonObject;
}

export interface LessonProgressV2 {
  currentBlockKey: string | null;
  blockState: Record<string, JsonObject>;
  completedBlockKeys: string[];
  xp: number;
  scorePercent: number | null;
  masteryStatus: 'learning' | 'practicing' | 'mastered';
  completedAt: string | null;
  lastActivityAt: string | null;
}

export interface LessonV2 {
  id: string;
  moduleId: string;
  lessonId: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  versionId: string;
  version: number;
  title: string;
  subtitle: string;
  duration: string;
  objective: string;
  hook: string;
  estimatedMinutes: number;
  sourceKind: string;
  validation: { errors: string[]; warnings: string[]; [key: string]: unknown };
  blocks: LessonBlockV2[];
  progress: LessonProgressV2 | null;
  versionChanged: boolean;
  preview?: boolean;
  versions?: LessonVersionSummary[];
  audit?: LessonAuditEntry[];
  publishedVersionId?: string | null;
  draftVersionId?: string | null;
}

export interface LessonListItem {
  id: string;
  moduleId: string;
  lessonId: string;
  status: LessonV2['status'];
  updatedAt: string;
  publishedVersionId: string | null;
  draftVersionId: string | null;
  title: string;
  version: number;
  validation: LessonV2['validation'];
  blockCount: number;
  hasQuiz: boolean;
  hasAssignment: boolean;
  hasInteraction: boolean;
}

export interface LessonVersionSummary {
  id: string;
  version: number;
  sourceKind: string;
  changeNote: string;
  createdBy: string | null;
  createdAt: string;
  validation: LessonV2['validation'];
}

export interface LessonAuditEntry {
  action: string;
  versionId: string | null;
  actorId: string | null;
  details: JsonObject;
  createdAt: string;
}

export interface BlockAttemptResult {
  attemptId: string;
  correct: boolean | null;
  score: number;
  maxScore: number;
  feedback: JsonObject & { complete?: boolean; explanation?: string };
  progress: Record<string, unknown> | null;
  preview?: boolean;
}

const asObject = (value: unknown): JsonObject =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : {};

const asStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

function normalizeProgress(value: unknown): LessonProgressV2 | null {
  const raw = asObject(value);
  if (!Object.keys(raw).length) return null;
  return {
    currentBlockKey: typeof raw.current_block_key === 'string' ? raw.current_block_key : null,
    blockState: asObject(raw.block_state) as Record<string, JsonObject>,
    completedBlockKeys: asStringArray(raw.completed_block_keys),
    xp: typeof raw.xp === 'number' ? raw.xp : 0,
    scorePercent: typeof raw.score_percent === 'number' ? raw.score_percent : null,
    masteryStatus: raw.mastery_status === 'mastered' || raw.mastery_status === 'practicing' ? raw.mastery_status : 'learning',
    completedAt: typeof raw.completed_at === 'string' ? raw.completed_at : null,
    lastActivityAt: typeof raw.last_activity_at === 'string' ? raw.last_activity_at : null,
  };
}

function normalizeLesson(value: unknown): LessonV2 | null {
  if (!value || typeof value !== 'object') return null;
  const lesson = value as LessonV2 & { progress?: unknown };
  return {
    ...lesson,
    blocks: Array.isArray(lesson.blocks) ? lesson.blocks : [],
    progress: normalizeProgress(lesson.progress),
    validation: lesson.validation || { errors: [], warnings: [] },
  };
}

async function rpc<T>(name: string, params: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await supabase.rpc(name, params);
  if (error) throw error;
  return data as T;
}

export async function fetchLessonV2(moduleId: string, lessonId: string) {
  return normalizeLesson(await rpc<unknown>('academy_get_lesson_v2', {
    p_module: moduleId,
    p_lesson: lessonId,
  }));
}

export async function autosaveLessonV2(
  moduleId: string,
  lessonId: string,
  versionId: string,
  currentBlockKey: string,
  state: Record<string, JsonObject>,
) {
  return rpc<{ saved: boolean }>('academy_autosave_lesson', {
    p_module: moduleId,
    p_lesson: lessonId,
    p_version: versionId,
    p_current_block: currentBlockKey,
    p_state: state,
  });
}

export async function completeLessonBlock(
  lesson: LessonV2,
  block: LessonBlockV2,
  payload: JsonObject,
  attemptId = crypto.randomUUID(),
) {
  return rpc<BlockAttemptResult>('academy_complete_lesson_block', {
    p_module: lesson.moduleId,
    p_lesson: lesson.lessonId,
    p_version: lesson.versionId,
    p_block_key: block.key,
    p_payload: payload,
    p_attempt: attemptId,
  });
}

export async function listAdminLessons() {
  return rpc<LessonListItem[]>('academy_admin_list_lessons');
}

export async function getAdminLesson(lessonId: string, versionId?: string) {
  return normalizeLesson(await rpc<unknown>('academy_admin_get_lesson', {
    p_lesson: lessonId,
    p_version: versionId || null,
  }));
}

export async function previewAdminLesson(lessonId: string, versionId?: string) {
  return normalizeLesson(await rpc<unknown>('academy_admin_preview_lesson', {
    p_lesson: lessonId,
    p_version: versionId || null,
  }));
}

export interface SaveLessonInput {
  id?: string | null;
  moduleId: string;
  lessonId: string;
  title: string;
  subtitle: string;
  duration: string;
  objective: string;
  hook: string;
  estimatedMinutes: number;
  blocks: LessonBlockV2[];
  changeNote: string;
}

export async function saveAdminLesson(input: SaveLessonInput) {
  return normalizeLesson(await rpc<unknown>('academy_admin_save_lesson', {
    p_lesson: input.id || null,
    p_module: input.moduleId,
    p_lesson_key: input.lessonId,
    p_title: input.title,
    p_subtitle: input.subtitle,
    p_duration: input.duration,
    p_objective: input.objective,
    p_hook: input.hook,
    p_estimated_minutes: input.estimatedMinutes,
    p_blocks: input.blocks.map(({ key, type, title, content, required, points, evaluation, feedback, scoring }) => ({
      key, type, title, content, required, points, evaluation, feedback, scoring,
    })),
    p_change_note: input.changeNote,
  }));
}

export async function setAdminLessonStatus(lessonId: string, status: LessonV2['status'], versionId?: string) {
  return normalizeLesson(await rpc<unknown>('academy_admin_set_lesson_status', {
    p_lesson: lessonId,
    p_status: status,
    p_version: versionId || null,
  }));
}

export async function rollbackAdminLesson(lessonId: string, versionId: string) {
  return normalizeLesson(await rpc<unknown>('academy_admin_rollback_lesson', {
    p_lesson: lessonId,
    p_version: versionId,
  }));
}

export async function duplicateAdminLesson(lessonId: string, moduleId: string, lessonKey: string) {
  return normalizeLesson(await rpc<unknown>('academy_admin_duplicate_lesson', {
    p_lesson: lessonId,
    p_module: moduleId,
    p_lesson_key: lessonKey,
  }));
}

export const BLOCK_LABELS: Record<LessonBlockType, string> = {
  objective: 'Учебна цел', hook: 'Реален проблем', concept: 'Интерактивна концепция',
  rich_text: 'Съдържание', step_reveal: 'Стъпково разкриване', before_after: 'Преди / след',
  flip_cards: 'Flip cards', sequence_sort: 'Правилна последователност', matching: 'Свързване',
  image_hotspot: 'Hotspot върху изображение', decision_tree: 'Decision tree', case_study: 'Казус',
  scenario: 'Сценарий', client_simulation: 'Клиентска симулация', calculator: 'Калкулатор',
  prompt_builder: 'Prompt builder', practical_response: 'Практически отговор', reflection: 'Рефлексия',
  checklist: 'Checklist', quiz: 'Тест', homework: 'Домашна работа', submission: 'Файл или линк',
  example: 'Практически пример', summary: 'Обобщение и следваща стъпка',
};

export function createBlock(type: LessonBlockType, index: number): LessonBlockV2 {
  const key = `${type}-${Date.now().toString(36)}-${index}`;
  const base = { id: key, key, position: index, type, title: BLOCK_LABELS[type], required: true, points: 5 };
  const content: JsonObject = { body: '' };
  if (type === 'step_reveal') content.steps = [{ id: 'step-1', title: 'Стъпка 1', text: '' }];
  if (type === 'before_after') Object.assign(content, { before: { label: 'Преди', text: '' }, after: { label: 'След', text: '' } });
  if (type === 'flip_cards') content.cards = [{ id: 'card-1', front: '', back: '' }];
  if (type === 'sequence_sort') content.items = [{ id: 'one', text: '' }, { id: 'two', text: '' }];
  if (type === 'matching') Object.assign(content, { left: [{ id: 'one', text: '' }], right: [{ id: 'a', text: '' }] });
  if (type === 'image_hotspot') Object.assign(content, { imageUrl: '', alt: '', hotspots: [{ id: 'one', label: '', x: 50, y: 50 }] });
  if (['decision_tree', 'scenario', 'client_simulation'].includes(type)) content.options = [{ id: 'a', label: '' }, { id: 'b', label: '' }];
  if (type === 'calculator') Object.assign(content, { label: 'Твоят отговор', unit: '', hint: '' });
  if (type === 'prompt_builder') Object.assign(content, { fields: [{ id: 'role', label: 'Роля', placeholder: '' }, { id: 'goal', label: 'Цел', placeholder: '' }], minFields: 2 });
  if (['practical_response', 'reflection', 'homework'].includes(type)) Object.assign(content, { prompt: '', minLength: 40 });
  if (type === 'checklist') content.items = [{ id: 'one', text: '', required: true }];
  if (type === 'quiz') Object.assign(content, { question: '', options: [{ id: 'a', label: '' }, { id: 'b', label: '' }] });
  if (type === 'submission') Object.assign(content, { prompt: '', accept: 'link,file' });
  if (type === 'summary') Object.assign(content, { takeaways: [''], nextStep: '' });
  return { ...base, content };
}
