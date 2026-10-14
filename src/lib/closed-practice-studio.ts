import type { JsonObject } from '@/lib/lesson-engine-v2';

export type StudioKind = 'cut' | 'frame' | 'colour' | 'sound' | 'diagram' | 'decision';
export type StudioDiagram = { kind: 'light' | 'focus' | 'white-balance' | 'exposure' | 'motion' | 'continuity'; variant: string };
export type StudioChoice = { id: string; text: string; clip?: [number, number]; audio?: string; diagram?: StudioDiagram; look?: 'source' | 'warm' | 'cool' | 'dark'; crop?: 'wide' | 'action' | 'edge' };
export type StudioSlot = { id: string; text: string; choices: string[]; preview: boolean };
export type ClosedStudio = { kind: StudioKind; title: string; context: string; task: string; limit: string; slots: StudioSlot[]; choices: StudioChoice[] };

const record = (value: unknown): JsonObject => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : {};
const text = (value: unknown) => typeof value === 'string' ? value : '';
const records = (value: unknown) => Array.isArray(value) ? value.map(record) : [];
const kinds: StudioKind[] = ['cut', 'frame', 'colour', 'sound', 'diagram', 'decision'];
const diagramVariants: Record<string, string[]> = { light: ['back', 'side', 'front'], focus: ['back', 'front'], 'white-balance': ['cool', 'neutral', 'warm'], exposure: ['dark', 'balanced', 'clipped'], motion: ['short', 'long'], continuity: ['same', 'cross'] };
const audioPaths = new Set(['clean', 'room', 'noise', 'clipped'].map(id => `/academy-labs/perfect-video/closed/voice-${id}.mp3`));

/** Public configuration describes available operations, never a grading key. */
export function parseClosedStudio(content: JsonObject): ClosedStudio | null {
  const config = record(content.studio);
  if (!kinds.includes(config.kind as StudioKind)) return null;
  const choices: StudioChoice[] = records(content.right).map(item => {
    const preview = record(item.preview);
    const diagram = record(preview.diagram);
    const clip = Array.isArray(preview.clip) && preview.clip.length === 2 && preview.clip.every(n => typeof n === 'number' && Number.isFinite(n))
      && preview.clip[0] >= 0 && preview.clip[1] <= 32 && preview.clip[0] < preview.clip[1] ? preview.clip as [number, number] : undefined;
    return { id: text(item.id), text: text(item.text), clip, audio: audioPaths.has(text(preview.audio)) ? text(preview.audio) : undefined,
      diagram: diagramVariants[text(diagram.kind)]?.includes(text(diagram.variant)) ? { kind: diagram.kind as StudioDiagram['kind'], variant: text(diagram.variant) } : undefined,
      look: ['source', 'warm', 'cool', 'dark'].includes(text(preview.look)) ? preview.look as StudioChoice['look'] : undefined,
      crop: ['wide', 'action', 'edge'].includes(text(preview.crop)) ? preview.crop as StudioChoice['crop'] : undefined };
  });
  const ids = new Set(choices.map(choice => choice.id));
  const slots = records(content.left).map(item => ({ id: text(item.id), text: text(item.text), preview: item.preview === true,
    choices: Array.isArray(item.choices) ? item.choices.filter((id): id is string => typeof id === 'string' && ids.has(id)) : [...ids] }));
  if (!slots.length || !choices.length || choices.some(choice => !choice.id || !choice.text) || ids.size !== choices.length
    || new Set(slots.map(slot => slot.id)).size !== slots.length || slots.some(slot => !slot.id || !slot.text || !slot.choices.length)) return null;
  return { kind: config.kind as StudioKind, title: text(config.title), context: text(config.context), task: text(config.task), limit: text(config.limit), slots, choices };
}

/** Recover only finite choices from an old tab or a stored draft. */
export function studioMatches(studio: ClosedStudio, state: JsonObject): Record<string, string> {
  const supplied = record(state.matches);
  return Object.fromEntries(studio.slots.flatMap(slot => typeof supplied[slot.id] === 'string' && slot.choices.includes(supplied[slot.id] as string)
    ? [[slot.id, supplied[slot.id] as string]] : []));
}

export function studioPlaylist(studio: ClosedStudio, matches: Record<string, string>): StudioChoice[] {
  return studio.slots.filter(slot => slot.preview).flatMap(slot => {
    const choice = studio.choices.find(choice => choice.id === matches[slot.id]);
    return choice ? [choice] : [];
  });
}
