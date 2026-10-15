import type { JsonObject } from '@/lib/lesson-engine-v2';

export type StudioKind = 'cut' | 'frame' | 'colour' | 'sound' | 'diagram' | 'decision' | 'schedule' | 'caption' | 'speed' | 'transition';
export type StudioDiagram = { kind: 'light' | 'focus' | 'white-balance' | 'exposure' | 'motion' | 'continuity'; variant: string };
export type StudioSchedule = { start: number; duration: number; label: string };
export type StudioCaption = { text: string; position: 'top' | 'middle' | 'bottom'; size: 'small' | 'normal' | 'large' };
export type StudioChoice = { id: string; text: string; clip?: [number, number]; audio?: string; diagram?: StudioDiagram; look?: 'source' | 'warm' | 'cool' | 'dark'; crop?: 'wide' | 'action' | 'edge'; schedule?: StudioSchedule; caption?: StudioCaption; rate?: number; transition?: 'early' | 'sync' | 'tail' };
export type StudioSlot = { id: string; text: string; choices: string[]; preview: boolean; phase: 'base' | 'change' };
export type ClosedStudio = { kind: StudioKind; title: string; context: string; task: string; limit: string; change: string; startHour: number; surface: 'video' | 'poster'; slots: StudioSlot[]; choices: StudioChoice[] };

const record = (value: unknown): JsonObject => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : {};
const text = (value: unknown) => typeof value === 'string' ? value : '';
const records = (value: unknown) => Array.isArray(value) ? value.map(record) : [];
const kinds: StudioKind[] = ['cut', 'frame', 'colour', 'sound', 'diagram', 'decision', 'schedule', 'caption', 'speed', 'transition'];
const diagramVariants: Record<string, string[]> = { light: ['back', 'side', 'front'], focus: ['back', 'front'], 'white-balance': ['cool', 'neutral', 'warm'], exposure: ['dark', 'balanced', 'clipped'], motion: ['short', 'long'], continuity: ['same', 'cross'] };
const audioPaths = new Set([...['clean', 'room', 'noise', 'clipped'].map(id => `/academy-labs/perfect-video/closed/voice-${id}.mp3`), ...['early', 'sync'].map(id => `/academy-labs/perfect-video/closed/cut-${id}.mp3`)]);
const finite = (n: unknown, min: number, max: number): n is number => typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max;

/** Public configuration describes available operations, never a grading key. */
export function parseClosedStudio(content: JsonObject): ClosedStudio | null {
  const config = record(content.studio);
  const kind = kinds.includes(config.productionKind as StudioKind) ? config.productionKind : config.kind;
  if (!kinds.includes(kind as StudioKind)) return null;
  const choices: StudioChoice[] = records(content.right).map(item => {
    const preview = record(item.preview);
    const diagram = record(preview.diagram);
    const timing = record(preview.schedule);
    const caption = record(preview.caption);
    const clip = Array.isArray(preview.clip) && preview.clip.length === 2 && preview.clip.every(n => typeof n === 'number' && Number.isFinite(n))
      && preview.clip[0] >= 0 && preview.clip[1] <= 32 && preview.clip[0] < preview.clip[1] ? preview.clip as [number, number] : undefined;
    return { id: text(item.id), text: text(item.text), clip, audio: audioPaths.has(text(preview.audio)) ? text(preview.audio) : undefined,
      diagram: diagramVariants[text(diagram.kind)]?.includes(text(diagram.variant)) ? { kind: diagram.kind as StudioDiagram['kind'], variant: text(diagram.variant) } : undefined,
      look: ['source', 'warm', 'cool', 'dark'].includes(text(preview.look)) ? preview.look as StudioChoice['look'] : undefined,
      crop: ['wide', 'action', 'edge'].includes(text(preview.crop)) ? preview.crop as StudioChoice['crop'] : undefined,
      schedule: finite(timing.start, 0, 1440) && finite(timing.duration, 1, 240) && text(timing.label) ? { start: timing.start, duration: timing.duration, label: text(timing.label) } : undefined,
      caption: text(caption.text).length > 0 && text(caption.text).length <= 120 && ['top', 'middle', 'bottom'].includes(text(caption.position)) && ['small', 'normal', 'large'].includes(text(caption.size)) ? caption as StudioCaption : undefined,
      rate: [0.5, 1, 2].includes(preview.rate as number) ? preview.rate as number : undefined,
      transition: ['early', 'sync', 'tail'].includes(text(preview.transition)) ? preview.transition as StudioChoice['transition'] : undefined };
  });
  const ids = new Set(choices.map(choice => choice.id));
  const slots = records(content.left).map(item => ({ id: text(item.id), text: text(item.text), preview: item.preview === true, phase: item.phase === 'change' ? 'change' as const : 'base' as const,
    choices: Array.isArray(item.choices) ? item.choices.filter((id): id is string => typeof id === 'string' && ids.has(id)) : [...ids] }));
  if (!slots.length || !choices.length || choices.some(choice => !choice.id || !choice.text) || ids.size !== choices.length
    || new Set(slots.map(slot => slot.id)).size !== slots.length || slots.some(slot => !slot.id || !slot.text || !slot.choices.length)) return null;
  return { kind: kind as StudioKind, title: text(config.title), context: text(config.initialContext) || text(config.context), task: text(config.task), limit: text(config.limit), change: text(config.change), startHour: finite(config.startHour, 0, 23) ? config.startHour : 9, surface: config.surface === 'poster' ? 'poster' : 'video', slots, choices };
}

/** Recover only finite choices from an old tab or a stored draft. */
export function studioMatches(studio: ClosedStudio, state: JsonObject): Record<string, string> {
  const supplied = record(state.matches);
  return Object.fromEntries(studio.slots.flatMap(slot => typeof supplied[slot.id] === 'string' && slot.choices.includes(supplied[slot.id] as string)
    ? [[slot.id, supplied[slot.id] as string]] : []));
}

export function studioPlaylist(studio: ClosedStudio, matches: Record<string, string>): StudioChoice[] {
  const baseComplete = studio.slots.filter(slot => slot.phase !== 'change').every(slot => !!matches[slot.id]);
  return studio.slots.filter(slot => slot.preview && (slot.phase !== 'change' || baseComplete)).flatMap(slot => {
    const choice = studio.choices.find(choice => choice.id === matches[slot.id]);
    return choice ? [choice] : [];
  });
}

/** Times are supplied by the case. These checks expose the selected schedule,
 * not its grading key or a claim about real production capacity. */
export function studioSchedule(studio: ClosedStudio, matches: Record<string, string>) {
  const rows = studioPlaylist(studio, matches).flatMap(choice => choice.schedule ? [{ ...choice.schedule, id: choice.id }] : []).sort((a, b) => a.start - b.start);
  const overlaps = rows.flatMap((a, i) => rows.slice(i + 1).filter(b => b.start < a.start + a.duration && a.start < b.start + b.duration).map(b => [a.label, b.label]));
  return { rows, overlaps, end: Math.max(0, ...rows.map(row => row.start + row.duration)), work: rows.reduce((n, row) => n + row.duration, 0) };
}

export function studioPlanText(studio: ClosedStudio, matches: Record<string, string>): string {
  return ['Учебна снимка на избраните решения', '', studio.context, '', ...studio.slots.flatMap(slot => [
    ...(slot.phase === 'change' ? ['Промяна в задачата', studio.change, ''] : []),
    slot.text, studio.choices.find(choice => choice.id === matches[slot.id])?.text || 'Няма избрано решение.', '',
  ]), studio.limit, '', 'Това е чернова по предоставения учебен случай. Файлът не удостоверява оценка, собствен проект или реален бизнес резултат.'].join('\n');
}
