import source from '@/data/marketing-ai-tools.json';
import type { JsonObject } from '@/lib/lesson-engine-v2';
import { toolkitHttps } from '@/lib/silk-toolkit';
export const MARKETING_AI_RELEASE = 'marketing_ai_first_five_20261019';
export const MARKETING_AI_MODULES = [
  { id: 's03-m01', number: 1, title: 'Какво е маркетинг и как хората избират' },
  { id: 's03-m02', number: 2, title: 'Хората зад решението: нужди, роли и общности' },
  { id: 's03-m05', number: 3, title: 'Стойност, цена и честно предложение' },
  { id: 's03-m03', number: 4, title: 'Послание, което човек разбира и може да предаде' },
  { id: 's03-m07', number: 5, title: 'Доверие, репутация и доброволна препоръка' },
] as const;
export const MARKETING_AI_LESSONS: Record<string, string> = {
  'lm01-02': 's03-m01', 'lm01-07': 's03-m01', 'lm02-05': 's03-m02', 'lm02-06': 's03-m02', 'lm02-08': 's03-m02',
  'lm05-01': 's03-m05', 'lm05-02': 's03-m05', 'lm05-08': 's03-m05', 'lm03-04': 's03-m03', 'lm03-06': 's03-m03', 'lm03-08': 's03-m03', 'lm07-03': 's03-m07', 'lm07-08': 's03-m07',
};
export type MarketingAiTool = { id: string; name: string; site: string; access: string; purpose: string; limits: string; steps: string[]; sources: string[]; checkedAt: string };
export type MarketingAiGuide = { release: typeof MARKETING_AI_RELEASE; lesson: string; module: string; title: string; intro: string; documents: { label: string; text: string }[]; prompt: string; variants: { id: string; label: string; text: string; review: string; poster: boolean }[]; toolIds: string[]; steps: string[]; calculation?: { cost: number; price: number; changedCost: number } };
const object = (v: unknown): JsonObject => v && typeof v === 'object' && !Array.isArray(v) ? v as JsonObject : {};
const text = (v: unknown, max = 1000) => typeof v === 'string' ? v.slice(0, max).trim() : '';
const strings = (v: unknown, limit: number, width: number) => Array.isArray(v) ? v.slice(0, limit).map(s => text(s, width)).filter(Boolean) : [];
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1e9;
export function parseMarketingAiTool(value: unknown): MarketingAiTool | null {
  const v = object(value), site = toolkitHttps(v.site), id = text(v.id, 40);
  const steps = strings(v.steps, 3, 1600), sources = strings(v.sources, 4, 1600).flatMap(s => toolkitHttps(s) || []);
  if (!/^[a-z][a-z0-9-]{1,39}$/.test(id) || !site || !text(v.name) || steps.length !== 3 || !sources.length || !/^\d{4}-\d{2}-\d{2}$/.test(String(v.checkedAt))) return null;
  return { id, name: text(v.name, 120), site, access: text(v.access, 250), purpose: text(v.purpose), limits: text(v.limits, 1800), steps, sources, checkedAt: String(v.checkedAt) };
}
export const MARKETING_AI_TOOLS = source.map(parseMarketingAiTool).filter((v): v is MarketingAiTool => !!v);
export function marketingAiLessonLink(lesson: string): string | null { return Object.hasOwn(MARKETING_AI_LESSONS, lesson) ? `/module/${MARKETING_AI_LESSONS[lesson]}?lesson=${lesson}` : null; }
export function parseMarketingAiGuide(value: unknown): MarketingAiGuide | null {
  const v = object(value), lesson = text(v.lesson, 10), module = text(v.module, 10);
  if (v.release !== MARKETING_AI_RELEASE || !Object.hasOwn(MARKETING_AI_LESSONS, lesson) || MARKETING_AI_LESSONS[lesson] !== module) return null;
  if (!Array.isArray(v.documents) || v.documents.length < 2 || v.documents.length > 6 || !Array.isArray(v.variants) || v.variants.length < 2 || v.variants.length > 4) return null;
  const documents = v.documents.map(value => { const d = object(value); return { label: text(d.label, 180), text: text(d.text, 3000) }; });
  const variants = v.variants.map(value => { const d = object(value); return { id: text(d.id, 40), label: text(d.label, 160), text: text(d.text, 3000), review: text(d.review, 3000), poster: d.poster === true }; });
  const toolIds = strings(v.toolIds, 6, 40), steps = strings(v.steps, 5, 1600);
  if (documents.some(d => !d.label || !d.text) || variants.some(d => !d.id || !d.label || !d.text || !d.review) || new Set(variants.map(d => d.id)).size !== variants.length || !toolIds.length || new Set(toolIds).size !== toolIds.length || toolIds.some(id => !MARKETING_AI_TOOLS.some(t => t.id === id)) || steps.length < 3 || !text(v.title) || !text(v.intro) || !text(v.prompt)) return null;
  const c = object(v.calculation), calculation = finite(c.cost) && finite(c.price) && finite(c.changedCost) ? { cost: c.cost, price: c.price, changedCost: c.changedCost } : undefined;
  return { release: MARKETING_AI_RELEASE, lesson, module, title: text(v.title, 180), intro: text(v.intro, 6000), documents, prompt: text(v.prompt, 6000), variants, toolIds, steps, calculation };
}
export function marketingAiVisibleText(g: MarketingAiGuide): string[] {
  // The enclosing lesson block already renders and counts its title.
  return [g.intro, 'Предоставени учебни източници', ...g.documents.flatMap(d => [d.label, d.text]), 'Задание за помощника', g.prompt, 'Предварително подготвени учебни версии', ...g.variants.flatMap(v => [v.label, v.text, v.review]), 'Работен подход', ...g.steps, ...g.toolIds.flatMap(id => { const t = MARKETING_AI_TOOLS.find(t => t.id === id)!; return [t.name, t.purpose, t.access, t.limits, ...t.steps]; })];
}
/** Teaching model. A missing denominator never becomes a zero percentage. */
export function marketingAiPrice(cost: number, price: number) { if (!finite(cost) || !finite(price)) return null; const difference = price - cost; return { difference, markup: cost === 0 ? null : difference / cost * 100, margin: price === 0 ? null : difference / price * 100 }; }
