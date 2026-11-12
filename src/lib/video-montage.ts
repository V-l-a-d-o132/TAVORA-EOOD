import { buildVideoSrt } from './video-ai';

export interface MontageShot {
  id: number;
  source: string;
  from: string;
  to: string;
  framing: 'fit' | 'fill';
  caption: string;
}

export interface MontageDraft {
  shots: MontageShot[];
  first: MontageShot[] | null;
  delivered: boolean;
}

export interface MontageSource {
  id: string;
  label: string;
  url: string;
  seconds: number;
}

export const draftKey = 'tavora:perfect-video:montage:v1';
export const coffee: MontageSource = {
  id: 'coffee',
  label: 'Учебен запис · кафемашина',
  url: '/academy-labs/perfect-video/practical/coffee-machine.mp4',
  seconds: 32,
};

export const revisionNote = '„Искам да видя резултата веднага. Сложи последния отрязък от първата версия отпред със същите начало и край. На втория кадър започни с „Преди това“ и кажи какво се случва.“';

export function newMontage(): MontageDraft {
  const shots = [[0, 5], [10, 15], [18, 23], [26, 32]].map(([from, to], id): MontageShot => ({
    id, source: coffee.id, from: String(from), to: String(to), framing: 'fit', caption: '',
  }));
  return { shots, first: null, delivered: false };
}

export function seconds(value: string) {
  return /^\d+(?:[.,]\d+)?$/u.test(value) ? Number(value.replace(',', '.')) : NaN;
}

export function montageLength(shots: MontageShot[]) {
  return shots.reduce((total, shot) => total + seconds(shot.to) - seconds(shot.from), 0);
}

export function sourceLabel(id: string) {
  return id === coffee.id ? coffee.label : id.split(':').slice(3).join(':');
}

export async function localSourceId(file: File) {
  // File pickers can assign a fresh modification time to the same recording.
  let identity = String(file.lastModified);
  if (globalThis.crypto?.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
    identity = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  }
  return `local:${file.size}:${identity}:${file.name}`;
}

export function briefIssues(shots: MontageShot[]) {
  const issues: string[] = [];
  const distinct = new Set<string>();
  for (const [index, shot] of shots.entries()) {
    const from = seconds(shot.from), to = seconds(shot.to);
    if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) {
      issues.push(`Кадър ${index + 1} има нужда от начало и по-късен край.`);
    } else if (shot.source === coffee.id && to > coffee.seconds) {
      issues.push(`Кадър ${index + 1} излиза след края на учебния запис.`);
    }
    if (!shot.caption.trim()) issues.push(`Напиши надпис за кадър ${index + 1}.`);
    distinct.add(JSON.stringify([shot.source, from, to]));
  }
  if (distinct.size !== 4) issues.push('Избери четири различни отрязъка.');
  const duration = montageLength(shots);
  if (Number.isFinite(duration) && (duration < 20 - 0.001 || duration > 30 + 0.001)) issues.push('Събери между 20 и 30 секунди монтаж.');
  return issues;
}

export function revisionIssues(shots: MontageShot[], first: MontageShot[]) {
  const issues: string[] = [];
  const last = first[3], opening = shots[0];
  if (opening.id !== last.id || opening.source !== last.source ||
      seconds(opening.from) !== seconds(last.from) || seconds(opening.to) !== seconds(last.to)) {
    issues.push('Премести последния отрязък от версия 1 най-отпред и запази източника и границите му.');
  }
  if (!/^преди това[\s,.:–—-]+[\p{L}\p{N}]/iu.test(shots[1].caption.trim())) {
    issues.push('Започни втория надпис с „Преди това“ и добави действието.');
  }
  return issues;
}

function validShots(value: unknown): value is MontageShot[] {
  return Array.isArray(value) && value.length === 4 && new Set(value.map(shot => shot?.id)).size === 4 &&
    value.every(shot => shot && Number.isInteger(shot.id) && shot.id >= 0 && shot.id <= 3 &&
      typeof shot.source === 'string' && (shot.source === coffee.id || /^local:\d+:(?:[a-f0-9]{64}|\d+):.{1,255}$/u.test(shot.source)) &&
      typeof shot.from === 'string' && shot.from.length <= 16 && typeof shot.to === 'string' && shot.to.length <= 16 &&
      ['fit', 'fill'].includes(shot.framing) && typeof shot.caption === 'string' && shot.caption.length <= 64);
}

export function restoreMontage(raw: string | null): MontageDraft {
  try {
    if (!raw || raw.length > 12000) return newMontage();
    const draft = JSON.parse(raw);
    if (validShots(draft?.shots)) {
      const first = validShots(draft.first) && !briefIssues(draft.first).length ? draft.first : null;
      const delivered = !!first && draft.delivered === true && !briefIssues(draft.shots).length && !revisionIssues(draft.shots, first).length;
      return { shots: draft.shots, first, delivered };
    }
  } catch { /* An unreadable local draft can be started again. */ }
  return newMontage();
}

export function montageSrt(shots: MontageShot[]) {
  let at = 0;
  return buildVideoSrt(shots.map(shot => {
    const start = at;
    at += seconds(shot.to) - seconds(shot.from);
    return { start, end: at, text: shot.caption.trim() };
  }));
}

export function montagePlan(shots: MontageShot[], version: number) {
  return [`TAVORA · Монтажен лист · версия ${version}`, 'Учебна поръчка · вертикално видео 9:16 · 20–30 секунди',
    ...shots.map((shot, index) => [
      `Кадър ${index + 1} · ${sourceLabel(shot.source)}`,
      `От ${shot.from || '…'} до ${shot.to || '…'} сек. · ${shot.framing === 'fit' ? 'Цял кадър' : 'Запълни вертикалата'}`,
      shot.caption.trim() || '(надписът предстои)',
    ].join('\n')), ...(version === 2 ? ['Клиентска бележка\n' + revisionNote] : []),
  ].join('\n\n');
}
