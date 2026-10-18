import type { JsonObject } from '@/lib/lesson-engine-v2';
import { parseProvidedMaterials, type ProvidedMaterials } from '@/lib/provided-materials';

export type StudioKind = 'cut' | 'frame' | 'colour' | 'sound' | 'diagram' | 'decision' | 'schedule' | 'caption' | 'speed' | 'transition' | 'metrics' | 'budget' | 'storyboard' | 'message' | 'roles' | 'workflow' | 'brief' | 'page' | 'search';
export type StudioDocument = { part: 'goal' | 'facts' | 'scope' | 'checks' | 'handover'; title: string; text: string };
export type StudioPagePart = { part: 'heading' | 'description' | 'terms' | 'action' | 'layout' | 'image' | 'status' | 'navigation'; text: string; font?: 'small' | 'readable'; contrast?: 'muted' | 'clear'; width?: 'mobile' | 'desktop'; image?: 'wide' | 'square' | 'none' };
export type StudioSearchPart = { part: 'title' | 'address' | 'snippet'; text: string };
export type StudioDiagram = { kind: 'light' | 'focus' | 'white-balance' | 'exposure' | 'motion' | 'continuity'; variant: string };
export type StudioSchedule = { start: number; duration: number; label: string };
export type StudioCaption = { text: string; position: 'top' | 'middle' | 'bottom'; size: 'small' | 'normal' | 'large' };
export type StudioCalculation = { label: string; a: number; b: number; operation: 'percent' | 'multiply' | 'divide'; aLabel: string; bLabel: string; unit: string };
export type StudioBudget = { hours: number; hourly: number; external: number; reservePercent: number; price?: number };
export type StudioBoard = { scene: 'choice' | 'order' | 'packing' | 'handover' | 'pickup' | 'crop' | 'missing'; caption: string; seconds: number };
export type StudioReport = { title: string; points: { at: number; value: number }[] };
export type StudioCopy = { part: 'headline' | 'benefit' | 'proof' | 'terms' | 'action' | 'relationship'; text: string };
export type StudioRoleName = 'seeker' | 'user' | 'payer' | 'approver' | 'adviser';
export type StudioRole = { person: string; roles: StudioRoleName[]; detail: string };
export type StudioFlow = { part: 'entry' | 'record' | 'owner' | 'reply' | 'review' | 'outcome'; title: string; detail: string };
export type StudioChoice = { id: string; text: string; clip?: [number, number]; audio?: string; diagram?: StudioDiagram; look?: 'source' | 'warm' | 'cool' | 'dark'; crop?: 'wide' | 'action' | 'edge'; schedule?: StudioSchedule; caption?: StudioCaption; rate?: number; transition?: 'early' | 'sync' | 'tail'; calculation?: StudioCalculation; budget?: StudioBudget; board?: StudioBoard; focus?: [number, number]; copy?: StudioCopy; role?: StudioRole; flow?: StudioFlow; document?: StudioDocument; page?: StudioPagePart; search?: StudioSearchPart };
export type StudioSlot = { id: string; text: string; choices: string[]; preview: boolean; phase: 'base' | 'change' };
export type ClosedStudio = { kind: StudioKind; title: string; context: string; task: string; limit: string; change: string; startHour: number; surface: 'video' | 'poster'; domain: 'video' | 'marketing' | 'silk-road'; report?: StudioReport; materials?: ProvidedMaterials; slots: StudioSlot[]; choices: StudioChoice[] };

const record = (value: unknown): JsonObject => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : {};
const text = (value: unknown) => typeof value === 'string' ? value : '';
const records = (value: unknown) => Array.isArray(value) ? value.map(record) : [];
const kinds: StudioKind[] = ['cut', 'frame', 'colour', 'sound', 'diagram', 'decision', 'schedule', 'caption', 'speed', 'transition', 'metrics', 'budget', 'storyboard', 'message', 'roles', 'workflow', 'brief', 'page', 'search'];
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
    const calculation = record(preview.calculation), budget = record(preview.budget), board = record(preview.board);
    const copy = record(preview.copy), role = record(preview.role), flow = record(preview.flow);
    const document = record(preview.document), page = record(preview.page), search = record(preview.search);
    const focus = Array.isArray(preview.focus) && preview.focus.length === 2 && preview.focus.every(n => finite(n, 0, 3600)) && preview.focus[0] < preview.focus[1] ? preview.focus as [number, number] : undefined;
    const clip = Array.isArray(preview.clip) && preview.clip.length === 2 && preview.clip.every(n => typeof n === 'number' && Number.isFinite(n))
      && preview.clip[0] >= 0 && preview.clip[1] <= 32 && preview.clip[0] < preview.clip[1] ? preview.clip as [number, number] : undefined;
    return { id: text(item.id), text: text(item.text), clip, audio: audioPaths.has(text(preview.audio)) ? text(preview.audio) : undefined,
      diagram: diagramVariants[text(diagram.kind)]?.includes(text(diagram.variant)) ? { kind: diagram.kind as StudioDiagram['kind'], variant: text(diagram.variant) } : undefined,
      look: ['source', 'warm', 'cool', 'dark'].includes(text(preview.look)) ? preview.look as StudioChoice['look'] : undefined,
      crop: ['wide', 'action', 'edge'].includes(text(preview.crop)) ? preview.crop as StudioChoice['crop'] : undefined,
      schedule: finite(timing.start, 0, 1440) && finite(timing.duration, 1, 240) && text(timing.label) ? { start: timing.start, duration: timing.duration, label: text(timing.label) } : undefined,
      caption: text(caption.text).length > 0 && text(caption.text).length <= 120 && ['top', 'middle', 'bottom'].includes(text(caption.position)) && ['small', 'normal', 'large'].includes(text(caption.size)) ? caption as StudioCaption : undefined,
      rate: [0.5, 1, 2].includes(preview.rate as number) ? preview.rate as number : undefined,
      transition: ['early', 'sync', 'tail'].includes(text(preview.transition)) ? preview.transition as StudioChoice['transition'] : undefined,
      calculation: finite(calculation.a, 0, 1e9) && finite(calculation.b, 0, 1e9) && ['percent', 'multiply', 'divide'].includes(text(calculation.operation)) && text(calculation.label).length <= 100 && text(calculation.unit).length <= 40 ? { label: text(calculation.label), a: calculation.a, b: calculation.b, operation: calculation.operation as StudioCalculation['operation'], aLabel: text(calculation.aLabel).slice(0, 100), bLabel: text(calculation.bLabel).slice(0, 100), unit: text(calculation.unit) } : undefined,
      budget: finite(budget.hours, 0, 10000) && finite(budget.hourly, 0, 100000) && finite(budget.external, 0, 1e8) && finite(budget.reservePercent, 0, 100) && (budget.price === undefined || finite(budget.price, 0, 1e9)) ? budget as StudioBudget : undefined,
      board: ['choice', 'order', 'packing', 'handover', 'pickup', 'crop', 'missing'].includes(text(board.scene)) && text(board.caption).length <= 120 && finite(board.seconds, 1, 60) ? board as StudioBoard : undefined, focus,
      document: ['goal', 'facts', 'scope', 'checks', 'handover'].includes(text(document.part)) && text(document.title).length > 0 && text(document.title).length <= 120 && text(document.text).length > 0 && text(document.text).length <= 1000 ? { part: document.part as StudioDocument['part'], title: text(document.title), text: text(document.text) } : undefined,
      page: ['heading', 'description', 'terms', 'action', 'layout', 'image', 'status', 'navigation'].includes(text(page.part)) && text(page.text).length > 0 && text(page.text).length <= 700 ? {
        part: page.part as StudioPagePart['part'], text: text(page.text),
        font: ['small', 'readable'].includes(text(page.font)) ? page.font as StudioPagePart['font'] : undefined,
        contrast: ['muted', 'clear'].includes(text(page.contrast)) ? page.contrast as StudioPagePart['contrast'] : undefined,
        width: ['mobile', 'desktop'].includes(text(page.width)) ? page.width as StudioPagePart['width'] : undefined,
        image: ['wide', 'square', 'none'].includes(text(page.image)) ? page.image as StudioPagePart['image'] : undefined,
      } : undefined,
      search: ['title', 'address', 'snippet'].includes(text(search.part)) && text(search.text).length > 0 && text(search.text).length <= 500 ? { part: search.part as StudioSearchPart['part'], text: text(search.text) } : undefined,
      copy: ['headline', 'benefit', 'proof', 'terms', 'action', 'relationship'].includes(text(copy.part)) && text(copy.text).length > 0 && text(copy.text).length <= 500 ? copy as StudioCopy : undefined,
      flow: ['entry', 'record', 'owner', 'reply', 'review', 'outcome'].includes(text(flow.part)) && text(flow.title).length > 0 && text(flow.title).length <= 120 && text(flow.detail).length > 0 && text(flow.detail).length <= 500 ? flow as StudioFlow : undefined,
      role: Array.isArray(role.roles) && role.roles.length > 0 && role.roles.length <= 5 && new Set(role.roles).size === role.roles.length && role.roles.every(r => ['seeker', 'user', 'payer', 'approver', 'adviser'].includes(text(r))) && text(role.person).length > 0 && text(role.person).length <= 80 && text(role.detail).length <= 240 ? role as StudioRole : undefined };
  });
  const ids = new Set(choices.map(choice => choice.id));
  const slots = records(content.left).map(item => ({ id: text(item.id), text: text(item.text), preview: item.preview === true, phase: item.phase === 'change' ? 'change' as const : 'base' as const,
    choices: Array.isArray(item.choices) ? item.choices.filter((id): id is string => typeof id === 'string' && ids.has(id)) : [...ids] }));
  if (!slots.length || !choices.length || choices.some(choice => !choice.id || !choice.text) || ids.size !== choices.length
    || new Set(slots.map(slot => slot.id)).size !== slots.length || slots.some(slot => !slot.id || !slot.text || !slot.choices.length)) return null;
  const report = record(config.report), points = records(report.points);
  const safeReport = points.length >= 2 && points.length <= 20 && points.every((p, i) => finite(p.at, 0, 3600) && finite(p.value, 0, 300) && (i === 0 || (p.at as number) > (points[i - 1].at as number)))
    ? { title: text(report.title).slice(0, 120), points: points as StudioReport['points'] } : undefined;
  const materials = parseProvidedMaterials(config.materials) || undefined;
  const context = materials && config.materialsFallback === true && text(config.materialsIntro)
    ? text(config.materialsIntro) : text(config.initialContext) || text(config.context);
  return { kind: kind as StudioKind, title: text(config.title), context, task: text(config.task), limit: text(config.limit), change: text(config.change), startHour: finite(config.startHour, 0, 23) ? config.startHour : 9, surface: config.surface === 'poster' ? 'poster' : 'video', domain: config.domain === 'silk-road' ? 'silk-road' : config.domain === 'marketing' ? 'marketing' : 'video', report: safeReport, materials, slots, choices };
}

/** Case arithmetic only. A missing denominator never becomes a zero result. */
export function studioCalculation(value: StudioCalculation) {
  if (value.operation !== 'multiply' && value.b === 0) return null;
  const result = value.operation === 'multiply' ? value.a * value.b : value.a / value.b * (value.operation === 'percent' ? 100 : 1);
  return Number.isFinite(result) ? result : null;
}

export function studioBudget(value: StudioBudget) {
  const labour = value.hours * value.hourly, base = labour + value.external, reserve = base * value.reservePercent / 100, cost = base + reserve;
  const difference = value.price === undefined ? null : value.price - cost;
  return { labour, base, reserve, cost, difference, markup: difference === null || cost === 0 ? null : difference / cost * 100, margin: difference === null || !value.price ? null : difference / value.price * 100 };
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

/** A changed condition replaces the corresponding part, retaining the rest of
 * the learner's draft. All text comes from fixed, provided alternatives. */
export function studioMessage(studio: ClosedStudio, matches: Record<string, string>) {
  const chosen = new Map<StudioCopy['part'], StudioCopy>();
  for (const choice of studioPlaylist(studio, matches)) if (choice.copy) chosen.set(choice.copy.part, choice.copy);
  return (['headline', 'relationship', 'benefit', 'proof', 'terms', 'action'] as const).flatMap(part => chosen.has(part) ? [chosen.get(part)!] : []);
}

export function studioWorkflow(studio: ClosedStudio, matches: Record<string, string>) {
  const chosen = new Map<StudioFlow['part'], StudioFlow>();
  for (const choice of studioPlaylist(studio, matches)) if (choice.flow) chosen.set(choice.flow.part, choice.flow);
  return (['entry', 'record', 'owner', 'reply', 'review', 'outcome'] as const).flatMap(part => chosen.has(part) ? [chosen.get(part)!] : []);
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

/** Compare only provided choices. A comparison is not a grading result. */
export function studioComparison(studio: ClosedStudio, before: Record<string, string>, after: Record<string, string>) {
  const a = studioMatches(studio, { matches: before }), b = studioMatches(studio, { matches: after });
  const description = (id?: string) => studio.choices.find(choice => choice.id === id)?.text || 'Няма избрано решение.';
  return studio.slots.filter(slot => slot.phase !== 'change' || a[slot.id] || b[slot.id]).map(slot => ({
    id: slot.id, label: slot.text, before: description(a[slot.id]), after: description(b[slot.id]), changed: a[slot.id] !== b[slot.id],
  }));
}

export function studioComparisonText(studio: ClosedStudio, before: Record<string, string>, after: Record<string, string>) {
  return ['Сравнение на два учебни варианта', '', studio.context, '', studio.task,
    ...(studio.change ? ['', 'Промяна в задачата', studio.change] : []), '',
    ...studioComparison(studio, before, after).flatMap(row => [row.label, `Запазен вариант: ${row.before}`, `Текущ вариант: ${row.after}`, row.changed ? 'Изборът е променен.' : 'Изборът е запазен.', '']),
    studio.limit, '', 'Сравнението описва избрани части. То не удостоверява оценка, завършен урок или външен резултат.'].join('\n');
}
