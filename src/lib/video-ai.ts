import type { JsonObject } from '@/lib/lesson-engine-v2';
import { toolkitHttps } from '@/lib/silk-toolkit';

export type VideoAiMode = 'story' | 'captions' | 'sound' | 'gap' | 'versions';
export type VideoAiTool = { id: string; name: string; site: string; category: string; access: string; accessLabel: string; purpose: string; limits: string; sources: string[]; steps: string[]; verification: string; checkedAt: string; lessons: string[] };
export type VideoAiGuide = { release: 'video_ai_20261019'; title: string; intro: string; tools: VideoAiTool[]; demo: VideoAiMode | null };
export const VIDEO_AI_MODES: { id: VideoAiMode; label: string }[] = [{ id: 'story', label: 'История' }, { id: 'captions', label: 'Субтитри' }, { id: 'sound', label: 'Звук' }, { id: 'gap', label: 'Липсващ кадър' }, { id: 'versions', label: 'Два формата' }];
const object = (v: unknown): JsonObject => v && typeof v === 'object' && !Array.isArray(v) ? v as JsonObject : {};
const text = (v: unknown, max: number) => typeof v === 'string' ? v.slice(0, max) : '';
const strings = (v: unknown, max: number, width: number) => Array.isArray(v) ? v.slice(0, max).map(x => text(x, width)).filter(Boolean) : [];
export function videoAiLessonLink(id: string): string | null {
  const m = /^pv(0[1-9]|1[0-5])-(\d{2})$/.exec(id); if (!m) return null;
  const module = Number(m[1]), lesson = Number(m[2]);
  if (lesson < 1 || lesson > [24, 20, 21, 17, 8, 18, 16, 16, 12, 16, 16, 8, 18, 18, 13][module - 1] || (module === 9 && lesson === 3)) return null;
  return `/module/s02-m${m[1]}?lesson=${id}`;
}
export function parseVideoAiTool(value: unknown): VideoAiTool | null {
  const v = object(value), id = text(v.id, 40), name = text(v.name, 120), site = toolkitHttps(v.site);
  const steps = strings(v.steps, 6, 1400), sources = strings(v.sources, 5, 1600).flatMap(url => toolkitHttps(url) || []);
  if (!/^[a-z][a-z0-9-]{1,39}$/.test(id) || !name || !site || steps.length < 3 || !sources.length || !text(v.verification, 1000)) return null;
  return { id, name, site, category: text(v.category, 100), access: ['free', 'limited', 'paid', 'check', 'local', 'noncommercial'].includes(String(v.access)) ? String(v.access) : 'check', accessLabel: text(v.accessLabel, 240), purpose: text(v.purpose, 1000), limits: text(v.limits, 1800), sources, steps, verification: text(v.verification, 1000), checkedAt: /^\d{4}-\d{2}-\d{2}$/.test(String(v.checkedAt)) ? String(v.checkedAt) : '', lessons: [...new Set(strings(v.lessons, 80, 10).filter(x => videoAiLessonLink(x)))] };
}
export function parseVideoAiGuide(value: unknown): VideoAiGuide | null {
  const v = object(value); if (v.release !== 'video_ai_20261019' || !Array.isArray(v.tools) || !v.tools.length || v.tools.length > 15) return null;
  const tools = v.tools.map(parseVideoAiTool); if (tools.some(x => !x) || new Set(tools.map(x => x!.id)).size !== tools.length) return null;
  const intro = text(v.intro, 10000); if (!intro) return null;
  return { release: v.release, title: text(v.title, 180) || 'От брифа до проверения файл', intro, tools: tools as VideoAiTool[], demo: VIDEO_AI_MODES.some(x => x.id === v.demo) ? v.demo as VideoAiMode : null };
}
export function videoAiVisibleText(value: VideoAiGuide) {
  return [value.title, value.intro, ...value.tools.flatMap(x => [x.name, x.accessLabel, x.purpose, x.limits, ...x.steps, x.verification])];
}

export const VIDEO_AI_CAPTIONS = [
  { id: 'source', label: 'Проверен текст', cues: [{ start: 0, end: 2.2, text: 'Първо провери звука.' }, { start: 2.2, end: 6.229, text: 'Доближи микрофона и чуй дали думите се разбират.' }], note: 'Този текст е източникът на предоставената синтетична реплика. Свери думите и времето чрез слушане.' },
  { id: 'changed', label: 'Чернова с променен смисъл', cues: [{ start: 0, end: 2.2, text: 'Първо провери звука.' }, { start: 2.2, end: 6.229, text: 'Отдалечи микрофона и чуй дали думите се разбират.' }], note: 'Това е предварително подготвена учебна грешка. Сравни действието в текста с действието в чутата реплика.' },
  { id: 'late', label: 'Същите думи с изместено време', cues: [{ start: 1.6, end: 3.8, text: 'Първо провери звука.' }, { start: 3.8, end: 7.829, text: 'Доближи микрофона и чуй дали думите се разбират.' }], note: 'Думите са същите, но времевите граници са преместени. Наличието на верен текст не доказва синхрон.' },
] as const;
const timestamp = (seconds: number) => { const ms = Math.round(seconds * 1000); return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
export function videoAiSrt(id: string) { const variant = VIDEO_AI_CAPTIONS.find(x => x.id === id); if (!variant) return null; return variant.cues.map((x, i) => `${i + 1}\n${timestamp(x.start)} --> ${timestamp(x.end)}\n${x.text}\n`).join('\n'); }
export const VIDEO_AI_SHOTS = [{ id: 'before', label: 'Преди действието', from: 0, to: 3 }, { id: 'start', label: 'Началото е видимо', from: 10, to: 13 }, { id: 'action', label: 'Действието продължава', from: 16, to: 19 }, { id: 'end', label: 'Действието е спряло', from: 26, to: 29 }] as const;
export function videoAiShot(id: string) { return VIDEO_AI_SHOTS.find(x => x.id === id) || null; }
