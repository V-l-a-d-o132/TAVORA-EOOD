import type { VideoStudyCase } from '@/data/perfect-video-start';

export interface VideoPlan {
  count: string;
  price: string;
  source: string;
  hook: string;
  receiving: string;
  action: string;
  palette: string;
  format: string;
  seconds: string;
}
export interface VideoScene {
  id: string;
  start: number;
  end: number;
  title: string;
  lines: string[];
  shownItems: number;
}
export interface VideoTimeline {
  caseId: string;
  name: string;
  unit: string;
  width: number;
  height: number;
  seconds: number;
  requestedShapeValid: boolean;
  paletteKnown: boolean;
  priceSource: string;
  foreground: string;
  background: string;
  accent: string;
  scenes: VideoScene[];
}
export interface VideoCheck { id: string; label: string; passed: boolean; help: string }
export interface VideoFileMetadata { width: number; height: number; seconds: number | null; bytes: number; mime: string; name?: string }

export const emptyVideoPlan = (): VideoPlan => ({ count: '', price: '', source: '', hook: '', receiving: '', action: '', palette: 'cream', format: 'vertical', seconds: '25' });
export const videoNumber = (value: string): number => value.trim() && /^\d+(?:[.,]\d+)?$/u.test(value.trim()) ? Number(value.replace(',', '.')) : NaN;
const safeText = (value: string) => value.slice(0, 60);

export function buildVideoTimeline(study: VideoStudyCase, plan: VideoPlan): VideoTimeline {
  const count = videoNumber(plan.count);
  const seconds = videoNumber(plan.seconds);
  const length = Number.isFinite(seconds) && seconds > 0 && seconds <= 45 ? seconds : 25;
  const shown = Number.isInteger(count) && count >= 0 && count <= 12 ? count : 0;
  const colors = plan.palette === 'dark' ? ['#f7f0e4', '#17221d', '#d7a764'] : plan.palette === 'washed' ? ['#eee9dd', '#f7f0e4', '#d7a764'] : ['#17221d', '#f7f0e4', '#a15a29'];
  const receiving = plan.receiving === 'pickup' ? 'Вземане от обекта' : plan.receiving === 'clarify' ? 'Получаването се уточнява' : plan.receiving === 'free' ? 'Безплатна доставка' : 'Уточни получаването';
  const hook = plan.hook === 'question' ? study.id === 'bakery' ? `Закуска за ${safeText(plan.count || '…')}?` : `Комплект за ${safeText(plan.count || '…')}?` : plan.hook === 'miracle' ? 'Гарантирано повече поръчки!' : plan.hook === 'logo' ? study.name : 'Избери началото';
  const scene = (id: string, start: number, end: number, title: string, lines: string[], shownItems = 0): VideoScene => ({ id, start: start * length / 25, end: end * length / 25, title, lines, shownItems });
  return {
    caseId: study.id, name: study.name, unit: study.unit, width: plan.format === 'horizontal' ? 1920 : 1080, height: plan.format === 'horizontal' ? 1080 : 1920,
    seconds: length, requestedShapeValid: length === seconds && ['vertical', 'horizontal'].includes(plan.format), paletteKnown: ['cream', 'dark', 'washed'].includes(plan.palette), priceSource: plan.source, foreground: colors[0], background: colors[1], accent: colors[2],
    scenes: [
      scene('hook', 0, 3, hook, ['Какво получаваш и как го вземаш']),
      scene('content', 3, 9, `${safeText(plan.count || '…')} ${study.unit}`, ['Обозначена учебна схема'], shown),
      scene('terms', 9, 16, `${safeText(plan.price || '…')} €`, [receiving]),
      scene('limit', 16, 21, 'Уточни наличността', [study.id === 'ceramics' ? 'Доставката не е включена в цената' : 'Запитването не потвърждава поръчка']),
      scene('action', 21, 25, plan.action === 'ask' ? study.id === 'bakery' ? 'Попитай за свободна кутия' : 'Попитай за комплект и получаване' : plan.action === 'buy' ? 'Купи с гарантирано получаване' : 'Избери следващо действие', ['Учебен бизнес, без реална поръчка']),
    ],
  };
}

export function contrastRatio(foreground: string, background: string): number {
  const light = (color: string) => {
    const values = [1, 3, 5].map(index => parseInt(color.slice(index, index + 2), 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
  };
  const a = light(foreground), b = light(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Check the artifact used by both the preview and recorder, not a separate ideal answer. */
export function checkVideoTimeline(study: VideoStudyCase, timeline: VideoTimeline): VideoCheck[] {
  const all = timeline.scenes.flatMap(scene => [scene.title, ...scene.lines]).join('\n');
  const count = timeline.scenes.find(scene => scene.id === 'content');
  const terms = timeline.scenes.find(scene => scene.id === 'terms');
  const hook = timeline.scenes.find(scene => scene.id === 'hook');
  const action = timeline.scenes.find(scene => scene.id === 'action');
  const checks: [string, string, boolean, string][] = [
    ['count', 'Образът и броят съвпадат с условията', count?.shownItems === study.count && count.title === `${study.count} ${study.unit}`, `Покажи ${study.count} ${study.unit}. Старата или произволна стойност променя офертата.`],
    ['price', 'Цената е от актуалния източник', timeline.priceSource === 'current' && videoNumber((terms?.title || '').replace(' €', '')) === study.price, `Актуалната цена е ${study.price} €. Отбележи утвърдените условия, а не старата бележка или желание от разговор.`],
    ['receiving', 'Получаването не е измислено', !!terms?.lines.includes(study.receiving === 'pickup' ? 'Вземане от обекта' : 'Получаването се уточнява') && !all.includes('Безплатна доставка'), study.receiving === 'pickup' ? 'Тук кутията се взема от обекта. Не обещавай доставка.' : 'За ателието получаването и доставката се уточняват отделно. Не пренасяй автоматично условията на пекарната.'],
    ['hook', 'Началото има отговор в този клип', !!hook?.title.endsWith('?') && !all.includes('Гарантирано повече поръчки'), 'Използвай въпроса за съдържанието. Логото не е отговор, а обещанието за повече поръчки не е установен факт. Това не оценява всички възможни творчески начала.'],
    ['action', 'Краят предлага изпълнимо действие', !!action?.title.startsWith('Попитай') && all.includes('Уточни наличността'), 'Кани за запитване. Нямаме потвърдена наличност, плащане или автоматична поръчка.'],
    ['geometry', 'Форматът и времето изпълняват учебния бриф', timeline.requestedShapeValid && timeline.width * 16 === timeline.height * 9 && timeline.seconds === 25 && timeline.scenes.at(-1)?.end === 25, 'За тази задача брифът е 9:16 и 25 секунди. Това не е задължителен формат за всяко видео.'],
    ['contrast', 'Основният текст има четим контраст', timeline.paletteKnown && contrastRatio(timeline.foreground, timeline.background) >= 4.5, 'Смени бледата палитра. Четливостта е проверимо условие; предпочитан цвят не удостоверява личност или готовност за покупка.'],
  ];
  return checks.map(([id, label, passed, help]) => ({ id, label, passed, help }));
}

export function sceneAt(timeline: VideoTimeline, second: number): VideoScene {
  const clamped = Math.max(0, Math.min(Number.isFinite(second) ? second : 0, timeline.seconds));
  return timeline.scenes.find(scene => clamped >= scene.start && clamped < scene.end) || timeline.scenes[timeline.scenes.length - 1];
}

function linesFor(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []; let line = '';
  for (const word of text.split(' ')) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) { lines.push(line); line = word; } else line = candidate;
  }
  if (line) lines.push(line);
  return lines;
}

export function drawVideoFrame(ctx: CanvasRenderingContext2D, timeline: VideoTimeline, second: number) {
  const { width, height } = ctx.canvas;
  const scale = Math.min(width / 1080, height / 1920);
  ctx.save(); ctx.fillStyle = timeline.background; ctx.fillRect(0, 0, width, height);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = timeline.foreground;
  ctx.font = `500 ${Math.max(16, 38 * scale)}px sans-serif`;
  ctx.fillText('ТАВОРА · УЧЕБНА ГРАФИКА', width / 2, height * 0.12);
  ctx.font = `500 ${Math.max(18, 44 * scale)}px sans-serif`; ctx.fillText(timeline.name, width / 2, height * 0.18);
  const scene = sceneAt(timeline, second);
  ctx.font = `700 ${Math.max(24, 84 * scale)}px sans-serif`;
  const title = linesFor(ctx, scene.title, width * 0.82);
  title.forEach((line, i) => ctx.fillText(line, width / 2, height * 0.33 + i * 100 * scale));
  if (scene.shownItems) {
    const columns = Math.min(scene.shownItems, 3), rows = Math.ceil(scene.shownItems / columns);
    const spacing = Math.min(width / 4, 240 * scale);
    for (let i = 0; i < scene.shownItems; i++) {
      const x = width / 2 + (i % columns - (columns - 1) / 2) * spacing;
      const y = height * 0.55 + (Math.floor(i / columns) - (rows - 1) / 2) * spacing;
      const radius = 65 * scale;
      ctx.fillStyle = timeline.accent; ctx.beginPath(); ctx.roundRect(x - radius, y - radius * 0.7, radius * 2, radius * 1.4, 16 * scale); ctx.fill();
      ctx.fillStyle = timeline.background; ctx.font = `700 ${40 * scale}px sans-serif`; ctx.fillText(String(i + 1), x, y);
    }
  } else {
    ctx.strokeStyle = timeline.accent; ctx.lineWidth = 8 * scale;
    const local = Math.max(0, second - scene.start);
    ctx.beginPath(); ctx.arc(width / 2, height * 0.57, 120 * scale, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, local / (scene.end - scene.start))); ctx.stroke();
  }
  ctx.fillStyle = timeline.foreground; ctx.font = `500 ${Math.max(18, 45 * scale)}px sans-serif`;
  const caption = scene.lines.flatMap(line => linesFor(ctx, line, width * 0.82));
  caption.forEach((line, i) => ctx.fillText(line, width / 2, height * 0.76 + i * 60 * scale));
  ctx.font = `400 ${Math.max(12, 30 * scale)}px sans-serif`; ctx.fillText('Измислен бизнес · без реална поръчка', width / 2, height * 0.91);
  ctx.fillStyle = timeline.accent; ctx.fillRect(width * 0.1, height * 0.95, width * 0.8 * Math.max(0, Math.min(second / timeline.seconds, 1)), Math.max(3, 8 * scale));
  ctx.restore();
}

export function fileChecks(metadata: VideoFileMetadata): VideoCheck[] {
  return [
    { id: 'file-format', label: 'Файлът е вертикален 9:16', passed: metadata.width > 0 && metadata.height > 0 && metadata.width * 16 === metadata.height * 9, help: 'Провери изнесения размер; за този бриф е нужен 9:16. Това не проверява кадриране или закрит надпис.' },
    { id: 'file-time', label: 'Отчетеното време е около 25 секунди', passed: metadata.seconds !== null && Math.abs(metadata.seconds - 25) <= 1, help: metadata.seconds === null ? 'Браузърът не отчита крайна продължителност. Провери файла в редактора; не отбелязваме неполучена стойност като вярна.' : 'Времето е различно от брифа. Прегледай края и повтори експорта.' },
  ];
}

export async function inspectVideoFile(file: File): Promise<VideoFileMetadata> {
  if (!file.size || file.size > 100 * 1024 * 1024) throw new Error('Избери видеофайл до 100 MB. Файлът се проверява само на това устройство.');
  const url = URL.createObjectURL(file), video = document.createElement('video');
  try {
    return await new Promise<VideoFileMetadata>((resolve, reject) => {
      const finish = () => { clearTimeout(timer); video.onloadedmetadata = null; video.onerror = null; };
      const timer = setTimeout(() => { finish(); reject(new Error('Браузърът не прочете файла. Опитай с MP4 или WebM, или провери в своя редактор.')); }, 10000);
      video.onloadedmetadata = () => { finish(); resolve({ width: video.videoWidth, height: video.videoHeight, seconds: Number.isFinite(video.duration) ? video.duration : null, bytes: file.size, mime: file.type, name: file.name }); };
      video.onerror = () => { finish(); reject(new Error('Този видеофайл не се отваря в браузъра. Провери го в редактора и експортирай поддържан формат.')); };
      video.preload = 'metadata'; video.src = url;
    });
  } finally { video.removeAttribute('src'); video.load(); URL.revokeObjectURL(url); }
}

/** Real canvas recording, with no camera, microphone, network, customer files or API key. */
export async function recordVideoTimeline(timeline: VideoTimeline, signal: AbortSignal, onProgress: (second: number) => void): Promise<Blob> {
  if (typeof MediaRecorder === 'undefined') throw new Error('Този браузър няма запис на видео. Изтегли сценария и използвай редактор, който вече имаш.');
  const mime = ['video/mp4', 'video/webm;codecs=vp8', 'video/webm'].find(type => MediaRecorder.isTypeSupported(type));
  if (!mime) throw new Error('Няма поддържан формат за запис. Използвай сценария в свой редактор.');
  const canvas = document.createElement('canvas'); canvas.width = timeline.width; canvas.height = timeline.height;
  if (typeof canvas.captureStream !== 'function') throw new Error('Браузърът не поддържа запис от графиката. Изтегли сценария.');
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Графиката не може да се подготви.');
  drawVideoFrame(ctx, timeline, 0);
  const stream = canvas.captureStream(25);
  try {
    return await new Promise<Blob>((resolve, reject) => {
      const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 3000000 });
      const chunks: Blob[] = []; let frame = 0; let failure: Error | null = null; const started = performance.now();
      const clean = () => { cancelAnimationFrame(frame); signal.removeEventListener('abort', abort); document.removeEventListener('visibilitychange', hidden); };
      const stopWith = (error: Error) => { failure = error; clean(); if (recorder.state !== 'inactive') recorder.stop(); else reject(error); };
      const abort = () => stopWith(new Error('Записът е прекратен. Изборите и сценарият остават налични.'));
      const hidden = () => { if (document.hidden) stopWith(new Error('Разделът беше скрит. Повтори записа с отворено упражнение, за да не пропуснем кадри.')); };
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = () => stopWith(new Error('Браузърът не завърши записа. Пробвай отново или използвай сценария в редактор.'));
      recorder.onstop = () => { clean(); const blob = new Blob(chunks, { type: recorder.mimeType || mime }); if (failure) reject(failure); else if (!blob.size) reject(new Error('Получен е празен запис. Повтори експорта.')); else resolve(blob); };
      const draw = () => { try { const elapsed = (performance.now() - started) / 1000; drawVideoFrame(ctx, timeline, Math.min(elapsed, timeline.seconds)); onProgress(Math.min(elapsed, timeline.seconds)); if (elapsed >= timeline.seconds) recorder.stop(); else frame = requestAnimationFrame(draw); } catch { stopWith(new Error('Браузърът прекъсна обработката на кадър. Повтори записа или използвай сценария.')); } };
      signal.addEventListener('abort', abort, { once: true }); document.addEventListener('visibilitychange', hidden);
      if (signal.aborted) { clean(); reject(new Error('Записът е прекратен.')); return; }
      if (document.hidden) { clean(); reject(new Error('Дръж упражнението отворено, преди да започнеш записа.')); return; }
      try { recorder.start(); frame = requestAnimationFrame(draw); }
      catch { clean(); reject(new Error('Браузърът не стартира записа. Изтегли сценария и използвай свой редактор.')); }
    });
  } finally { stream.getTracks().forEach(track => track.stop()); }
}

export function videoStoryboardCsv(timeline: VideoTimeline): string {
  const field = (text: string | number) => `"${String(text).replaceAll('"', '""')}"`;
  return ['начало,край,образ_и_текст,допълнение,видими_предмети', ...timeline.scenes.map(scene => [scene.start, scene.end, scene.title, scene.lines.join(' / '), scene.shownItems].map(field).join(','))].join('\n');
}
