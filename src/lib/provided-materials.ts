import type { JsonObject } from '@/lib/lesson-engine-v2';

export type ProvidedItem = {
  label: string; body: string; code: string; columns: string[]; rows: string[][];
  view: 'document' | 'phone' | 'contrast' | 'clip';
  foreground: string; background: string; variant: string;
};
export type ProvidedMaterials = { title: string; instruction: string; items: ProvidedItem[]; toolLab: boolean };
const object = (v: unknown): JsonObject => v && typeof v === 'object' && !Array.isArray(v) ? v as JsonObject : {};
const string = (v: unknown, max: number) => typeof v === 'string' ? v.slice(0, max) : '';
const strings = (v: unknown, max: number, length: number) => Array.isArray(v) ? v.slice(0, max).map(s => string(s, length)) : [];

/** Render only bounded, escaped teaching data. No HTML, remote embeds or learner files. */
export function parseProvidedMaterials(value: unknown): ProvidedMaterials | null {
  const v = object(value);
  if (!Array.isArray(v.items) || !v.items.length || v.items.length > 8) return null;
  const items = v.items.map(raw => {
    const item = object(raw), columns = strings(item.columns, 8, 160);
    const rows = Array.isArray(item.rows) ? item.rows.slice(0, 24).map(row => strings(row, 8, 600)) : [];
    return {
      label: string(item.label, 100), body: string(item.body, 4000), code: string(item.code, 5000),
      columns, rows: columns.length && rows.every(row => row.length === columns.length) ? rows : [],
      view: ['phone', 'contrast', 'clip'].includes(String(item.view)) ? item.view as ProvidedItem['view'] : 'document' as const,
      foreground: /^#[0-9a-f]{6}$/i.test(String(item.foreground)) ? String(item.foreground) : '#111827',
      background: /^#[0-9a-f]{6}$/i.test(String(item.background)) ? String(item.background) : '#ffffff',
      variant: ['cropped', 'complete', 'small', 'readable', 'opening', 'action', 'result'].includes(String(item.variant)) ? String(item.variant) : 'complete',
    };
  });
  if (items.some(item => !item.label)) return null;
  return { title: string(v.title, 160), instruction: string(v.instruction, 1200), items, toolLab: v.toolLab === true };
}

/** WCAG relative luminance for the two provided sRGB colours. */
export function materialContrast(foreground: string, background: string): number {
  const luminance = (hex: string) => {
    const rgb = [1, 3, 5].map(at => parseInt(hex.slice(at, at + 2), 16) / 255)
      .map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  };
  const a = luminance(foreground), b = luminance(background);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}

export type ToolAction = 'read' | 'create' | 'inspect' | 'repeat' | 'send';
export type ToolLabState = { inspected: boolean; created: boolean; messages: string[] };
export const initialToolLab = (): ToolLabState => ({ inspected: false, created: false, messages: [] });
/** A local teaching queue: a timeout does not undo the server-side operation. */
export function applyToolAction(state: ToolLabState, action: ToolAction): ToolLabState {
  let message: string;
  if (action === 'read') message = 'read_conditions О-2 → Диагностика преди ремонт. Техник потвърждава цена и час.';
  else if (action === 'send') message = 'send_reply D-41 → denied: това разрешение липсва. Няма изпратено съобщение.';
  else if (action === 'inspect') message = state.created ? 'get_draft D-41 → exists; status: awaiting_review; записите са 1.' : 'get_draft D-41 → not_found; записите са 0.';
  else if (action === 'repeat') message = state.created ? 'create_draft D-41 → existing; същият ключ връща същия запис. Записите остават 1.' : 'create_draft D-41 → created; status: awaiting_review; записите са 1.';
  else message = state.created ? 'create_draft D-41 → existing; записите остават 1.' : 'create_draft D-41 → връзката прекъсна преди отговора. Провери състоянието по D-41.';
  return { inspected: action === 'inspect' || state.inspected, created: ['create', 'repeat'].includes(action) || state.created, messages: [...state.messages, message].slice(-12) };
}
