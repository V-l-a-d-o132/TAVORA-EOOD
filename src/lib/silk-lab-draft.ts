import { SILK_PLAN_FIELDS, emptySilkPlan, type SilkPagePlan } from './silk-road-practice';

const key = 'tavora:lab:silk:20261016';
export type SilkLabDraft = { caseIndex: number; plans: { workshop: SilkPagePlan; bakery: SilkPagePlan }; restored: boolean };
const empty = (): SilkLabDraft => ({ caseIndex: 0, plans: { workshop: emptySilkPlan(), bakery: emptySilkPlan() }, restored: false });
const record = (value: unknown): Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
function finitePlan(value: unknown): SilkPagePlan {
  const supplied = record(value);
  return Object.fromEntries(SILK_PLAN_FIELDS.map(field => [field.key, field.options.some(([id]) => id === supplied[field.key]) ? supplied[field.key] : ''])) as unknown as SilkPagePlan;
}
export function readSilkLabDraft(): SilkLabDraft {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw || raw.length > 4000) return empty();
    const saved = record(JSON.parse(raw)), plans = record(saved.plans);
    return { caseIndex: saved.caseIndex === 1 ? 1 : 0, plans: { workshop: finitePlan(plans.workshop), bakery: finitePlan(plans.bakery) }, restored: true };
  } catch { return empty(); }
}
export function saveSilkLabDraft(draft: Pick<SilkLabDraft, 'caseIndex' | 'plans'>): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify({ caseIndex: draft.caseIndex === 1 ? 1 : 0, plans: { workshop: finitePlan(draft.plans.workshop), bakery: finitePlan(draft.plans.bakery) } }));
    return true;
  } catch { return false; }
}
