import source from '@/data/marketing-ai-tools.json';
import nextSource from '@/data/marketing-ai-next-tools.json';
import workbenchSource from '@/data/marketing-ai-workbenches.json';
import type { JsonObject } from '@/lib/lesson-engine-v2';
import { toolkitHttps } from '@/lib/silk-toolkit';
export const MARKETING_AI_RELEASE = 'marketing_ai_first_five_20261019';
export const MARKETING_AI_NEXT_RELEASE = 'marketing_ai_next_five_20261020';
export const MARKETING_AI_MODULES = [
  { id: 's03-m01', number: 1, title: 'Какво е маркетинг и как хората избират' },
  { id: 's03-m02', number: 2, title: 'Хората зад решението: нужди, роли и общности' },
  { id: 's03-m05', number: 3, title: 'Стойност, цена и честно предложение' },
  { id: 's03-m03', number: 4, title: 'Послание, което човек разбира и може да предаде' },
  { id: 's03-m07', number: 5, title: 'Доверие, репутация и доброволна препоръка' },
] as const;
export const MARKETING_AI_NEXT_MODULES = [
  { id: 's03-m10', number: 6, title: 'Полезно съдържание, което си струва да препратиш' },
  { id: 's03-m11', number: 7, title: 'Социални мрежи и разговори в общности' },
  { id: 's03-m08', number: 8, title: 'Сайтът като проверка на обещанието' },
  { id: 's03-m06', number: 9, title: 'Google профилът: как хората проверяват местния бизнес' },
  { id: 's03-m09', number: 10, title: 'Търсене, SEO и ИИ: от съвета до проверката' },
] as const;
export const MARKETING_AI_ALL_MODULES = [...MARKETING_AI_MODULES, ...MARKETING_AI_NEXT_MODULES];
export const MARKETING_AI_LESSONS: Record<string, string> = {
  'lm01-02': 's03-m01', 'lm01-07': 's03-m01', 'lm02-05': 's03-m02', 'lm02-06': 's03-m02', 'lm02-08': 's03-m02',
  'lm05-01': 's03-m05', 'lm05-02': 's03-m05', 'lm05-08': 's03-m05', 'lm03-04': 's03-m03', 'lm03-06': 's03-m03', 'lm03-08': 's03-m03', 'lm07-03': 's03-m07', 'lm07-08': 's03-m07',
};
export const MARKETING_AI_NEXT_LESSONS: Record<string, string> = {
  'lm10-03': 's03-m10', 'lm10-05': 's03-m10', 'lm10-08': 's03-m10',
  'lm11-01': 's03-m11', 'lm11-03': 's03-m11', 'lm11-06': 's03-m11', 'lm11-10': 's03-m11',
  'lm08-03': 's03-m08', 'lm08-08': 's03-m08', 'lm08-11': 's03-m08',
  'lm06-04': 's03-m06', 'lm06-05': 's03-m06', 'lm06-09': 's03-m06',
  'lm01-01': 's03-m01', 'lm09-07': 's03-m09', 'lm09-08': 's03-m09', 'lm09-12': 's03-m09',
};
const workbenchLessons: Record<string, string> = { queue: 'lm11-10', page: 'lm08-03', entrance: 'lm06-05', report: 'lm09-07' };
export type MarketingAiWorkbenchId = keyof typeof workbenchSource;
export type MarketingAiTool = { id: string; name: string; site: string; access: string; purpose: string; limits: string; steps: string[]; sources: string[]; checkedAt: string };
export type MarketingAiGuide = { release: typeof MARKETING_AI_RELEASE | typeof MARKETING_AI_NEXT_RELEASE; lesson: string; module: string; title: string; intro: string; documents: { label: string; text: string }[]; prompt: string; variants: { id: string; label: string; text: string; review: string; poster: boolean }[]; toolIds: string[]; steps: string[]; calculation?: { cost: number; price: number; changedCost: number }; workbench?: MarketingAiWorkbenchId };
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
export const MARKETING_AI_TOOLS = [...source, ...nextSource].map(parseMarketingAiTool).filter((v): v is MarketingAiTool => !!v);
export function marketingAiDisplayModule(lesson: string): string | null {
  if (lesson === 'lm01-01') return 's03-m09';
  return Object.hasOwn(MARKETING_AI_LESSONS, lesson) ? MARKETING_AI_LESSONS[lesson] : Object.hasOwn(MARKETING_AI_NEXT_LESSONS, lesson) ? MARKETING_AI_NEXT_LESSONS[lesson] : null;
}
export function marketingAiLessonLink(lesson: string): string | null { const module = marketingAiDisplayModule(lesson); return module ? `/module/${module}?lesson=${lesson}` : null; }
export function parseMarketingAiGuide(value: unknown): MarketingAiGuide | null {
  const v = object(value), lesson = text(v.lesson, 10), module = text(v.module, 10);
  const lessons = v.release === MARKETING_AI_RELEASE ? MARKETING_AI_LESSONS : v.release === MARKETING_AI_NEXT_RELEASE ? MARKETING_AI_NEXT_LESSONS : null;
  if (!lessons || !Object.hasOwn(lessons, lesson) || lessons[lesson] !== module) return null;
  const workbench = typeof v.workbench === 'string' && Object.hasOwn(workbenchLessons, v.workbench) && workbenchLessons[v.workbench] === lesson && v.release === MARKETING_AI_NEXT_RELEASE ? v.workbench as MarketingAiWorkbenchId : undefined;
  if (v.workbench !== undefined && !workbench) return null;
  if (!Array.isArray(v.documents) || v.documents.length < 2 || v.documents.length > 6 || !Array.isArray(v.variants) || v.variants.length < 2 || v.variants.length > 4) return null;
  const documents = v.documents.map(value => { const d = object(value); return { label: text(d.label, 180), text: text(d.text, 3000) }; });
  const variants = v.variants.map(value => { const d = object(value); return { id: text(d.id, 40), label: text(d.label, 160), text: text(d.text, 3000), review: text(d.review, 3000), poster: d.poster === true }; });
  const toolIds = strings(v.toolIds, 6, 40), steps = strings(v.steps, 5, 1600);
  if (documents.some(d => !d.label || !d.text) || variants.some(d => !d.id || !d.label || !d.text || !d.review) || new Set(variants.map(d => d.id)).size !== variants.length || !toolIds.length || new Set(toolIds).size !== toolIds.length || toolIds.some(id => !MARKETING_AI_TOOLS.some(t => t.id === id)) || steps.length < 3 || !text(v.title) || !text(v.intro) || !text(v.prompt)) return null;
  const c = object(v.calculation), calculation = finite(c.cost) && finite(c.price) && finite(c.changedCost) ? { cost: c.cost, price: c.price, changedCost: c.changedCost } : undefined;
  return { release: v.release as MarketingAiGuide['release'], lesson, module, title: text(v.title, 180), intro: text(v.intro, 6000), documents, prompt: text(v.prompt, 6000), variants, toolIds, steps, calculation, workbench };
}
export function marketingAiWorkbenchText(id: MarketingAiWorkbenchId): string[] {
  const collect = (v: unknown): string[] => typeof v === 'string' || typeof v === 'number' ? [String(v)] : Array.isArray(v) ? v.flatMap(collect) : v && typeof v === 'object' ? Object.entries(v).filter(([key]) => key !== 'id').flatMap(([, value]) => collect(value)) : [];
  return collect(workbenchSource[id]);
}
export function marketingAiReport(scope: string) { const row = workbenchSource.report.scopes.find(s => s.id === scope); return row ? { ...row, share: row.total ? row.genai / row.total * 100 : null } : null; }
export function marketingAiVisibleText(g: MarketingAiGuide): string[] {
  // The enclosing lesson block already renders and counts its title.
  return [g.intro, 'Предоставени учебни източници', ...g.documents.flatMap(d => [d.label, d.text]), 'Задание за помощника', g.prompt, 'Предварително подготвени учебни версии', ...g.variants.flatMap(v => [v.label, v.text, v.review]), ...(g.workbench ? marketingAiWorkbenchText(g.workbench) : []), 'Работен подход', ...g.steps, ...g.toolIds.flatMap(id => { const t = MARKETING_AI_TOOLS.find(t => t.id === id)!; return [t.name, t.purpose, t.access, t.limits, ...t.steps]; })];
}
/** Teaching model. A missing denominator never becomes a zero percentage. */
export function marketingAiPrice(cost: number, price: number) { if (!finite(cost) || !finite(price)) return null; const difference = price - cost; return { difference, markup: cost === 0 ? null : difference / cost * 100, margin: price === 0 ? null : difference / price * 100 }; }
