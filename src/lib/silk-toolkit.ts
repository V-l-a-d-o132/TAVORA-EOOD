import type { JsonObject } from '@/lib/lesson-engine-v2';

export type ToolAccess = 'free' | 'local' | 'quota' | 'experiment' | 'personal' | 'transaction' | 'self-host' | 'check';
export type SilkTool = {
  id: string; name: string; site: string; category: string; access: ToolAccess; accessLabel: string;
  role: string; purpose: string; limits: string; lessons: string[]; sources: string[];
  steps: string[]; verification: string; alternatives: string[]; checkedAt: string;
};
export type LessonToolkit = { release: 'silk_toolkit_20261018'; title: string; cards: SilkTool[]; lab: 'webp' | null };

const object = (value: unknown): JsonObject => value && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : {};
const text = (value: unknown, max: number) => typeof value === 'string' ? value.slice(0, max) : '';
const list = (value: unknown, max: number, width: number) => Array.isArray(value) ? value.slice(0, max).map(item => text(item, width)).filter(Boolean) : [];
export function toolkitHttps(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 1600) return null;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export function toolkitLessonLink(id: string): string | null {
  const match = /^l(0[1-9]|1[01])-(\d{2})$/.exec(id);
  if (!match) return null;
  const moduleNumber = Number(match[1]), lessonNumber = Number(match[2]);
  if (lessonNumber < 1 || lessonNumber > ([1, 7, 8, 9, 10, 11].includes(moduleNumber) ? 4 : 10)) return null;
  return `/module/s01-m${match[1]}?lesson=${id}`;
}
export function parseSilkTool(value: unknown): SilkTool | null {
  const v = object(value), site = toolkitHttps(v.site);
  const id = text(v.id, 50), name = text(v.name, 120), purpose = text(v.purpose, 700);
  if (!/^[a-z][a-z0-9-]{1,49}$/.test(id) || !site || !name || !purpose) return null;
  const access = ['free', 'local', 'quota', 'experiment', 'personal', 'transaction', 'self-host', 'check'].includes(String(v.access)) ? v.access as ToolAccess : 'check';
  const sources = list(v.sources, 5, 1600).flatMap(url => toolkitHttps(url) || []);
  const steps = list(v.steps, 6, 1000), verification = text(v.verification, 1000);
  if (steps.length < 3 || !verification || !sources.length) return null;
  return { id, name, site, category: text(v.category, 120), access, accessLabel: text(v.accessLabel, 240),
    role: text(v.role, 120), purpose, limits: text(v.limits, 1600),
    lessons: [...new Set(list(v.lessons, 8, 10).filter(id => toolkitLessonLink(id)))], sources, steps, verification,
    alternatives: list(v.alternatives, 4, 50).filter(id => /^[a-z][a-z0-9-]{1,49}$/.test(id)),
    checkedAt: /^\d{4}-\d{2}-\d{2}$/.test(String(v.checkedAt)) ? String(v.checkedAt) : '',
  };
}

/** Only supplied, escaped data. No remote embeds, uploads, evaluators or learner input. */
export function parseLessonToolkit(value: unknown): LessonToolkit | null {
  const v = object(value);
  if (v.release !== 'silk_toolkit_20261018' || !Array.isArray(v.cards) || !v.cards.length || v.cards.length > 12) return null;
  const cards = v.cards.map(parseSilkTool);
  if (cards.some(card => !card) || new Set(cards.map(card => card!.id)).size !== cards.length) return null;
  return { release: v.release, title: text(v.title, 160) || 'Инструменти за тази задача', cards: cards as SilkTool[], lab: v.lab === 'webp' ? 'webp' : null };
}

/** The same teaching text is counted in the enhanced view and its readable fallback. */
export function toolkitVisibleText(toolkit: LessonToolkit): string[] {
  return [toolkit.title, ...toolkit.cards.flatMap(card => [card.name, card.accessLabel, card.role, card.purpose,
    card.limits, ...card.steps, card.verification])];
}
