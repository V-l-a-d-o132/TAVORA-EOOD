// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import tools from '../src/data/video-ai-tools.json';
import { loadVideoAiCandidates, loadVideoAiSource } from '../scripts/prepare-video-ai-assets.mjs';
import { parseVideoAiGuide, parseVideoAiTool, videoAiLessonLink, videoAiSrt, VIDEO_AI_CAPTIONS } from '../src/lib/video-ai';
import { parseClosedStudio } from '../src/lib/closed-practice-studio';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
import LessonRichText from '../src/pages/module/components/lesson-v2/LessonRichText';
const rows = loadVideoAiCandidates();
afterEach(cleanup);

test('all approved routes resolve to actual lessons, including module 9 with its retired third ID', () => {
  expect(tools).toHaveLength(15); expect(new Set(tools.map(t => t.id)).size).toBe(15);
  const source = new Set(loadVideoAiSource().map(l => l.lesson_id));
  for (const t of tools) { expect(parseVideoAiTool(t)).toBeTruthy(); expect(t.steps).toHaveLength(3); expect(t.verification.length).toBeGreaterThan(40); for (const id of t.lessons) { expect(source.has(id)).toBe(true); expect(videoAiLessonLink(id)).toBeTruthy(); } }
  expect(videoAiLessonLink('pv09-03')).toBeNull(); expect(videoAiLessonLink('pv12-09')).toBeNull(); expect(videoAiLessonLink('pv09-12')).toContain('s02-m09');
  expect(tools.find(t => t.id === 'elevenlabs')!.access).toBe('noncommercial');
  for (const id of ['flow', 'kling', 'seedance', 'luma', 'descript', 'capcut']) expect(tools.find(t => t.id === id)!.access).toBe('check');
});

test('60 additive guides and 15 independent checks cover all modules without publishing grading keys', () => {
  expect(rows).toHaveLength(69); expect(new Set(rows.map(r => r.lesson)).size).toBe(69);
  const all = rows.flatMap(r => r.payload.additions), guides = all.filter(b => b.type === 'rich_text'), cases = all.filter(b => b.type === 'matching');
  expect(guides).toHaveLength(60); expect(cases).toHaveLength(15); expect(cases.reduce((n, b) => n + b.content.left.length, 0)).toBe(61);
  expect(guides.filter(b => b.content.videoAi.demo)).toHaveLength(16);
  for (const r of rows) { expect(r.payload.amendments).toEqual([]); for (const b of r.payload.additions) { expect(b.required).toBe(true); if (b.type === 'rich_text') { expect(parseVideoAiGuide(b.content.videoAi)).toBeTruthy(); expect(b.content.body).toContain(b.content.videoAi.intro); for (const t of b.content.videoAi.tools) expect(b.content.body).toContain(t.steps[0]); } else { expect(parseClosedStudio(b.content)).toBeTruthy(); expect(b.content.left.every(s => s.choices.length === 3)).toBe(true); } } }
  expect(JSON.stringify(rows)).not.toMatch(/"(?:evaluation|answer_key|answerKey|answers|feedback|correct|scoring|modelAnswer)"\s*:/);
});

test('enhanced lesson rendering shows the route once, preserves readable fallback and rejects executable links', () => {
  const b = rows.find(r => r.lesson === 'pv01-11').payload.additions[0];
  render(<LessonRichText content={b.content} allowVideoLab />);
  expect(screen.getAllByText((_, node) => node?.tagName === 'P' && node.textContent === b.content.videoAi.intro)).toHaveLength(1);
  expect(screen.getByRole('article', { name: 'Gemini' })).toBeTruthy();
  fireEvent.click(screen.getByText('Работен маршрут · Gemini'));
  expect(screen.getByText(b.content.videoAi.tools[0].steps[0])).toBeTruthy();
  expect(document.querySelector('input,textarea,iframe,[contenteditable="true"]')).toBeNull();
  cleanup(); render(<LessonRichText content={{ body: 'Пълният резервен текст е четим.', videoAiFallback: true, videoAi: { release: 'video_ai_20261019', tools: [] } }} allowVideoLab />);
  expect(screen.getByText('Пълният резервен текст е четим.')).toBeTruthy();
  expect(parseVideoAiTool({ ...tools[0], site: 'javascript:alert(1)' })).toBeNull();
  expect(parseVideoAiTool({ ...tools[0], site: 'https://user:pass@example.invalid/' })).toBeNull();
  expect(parseVideoAiGuide({ ...b.content.videoAi, tools: [tools[0], tools[0]] })).toBeNull();
});

test('reading words count visible tool instructions once and SRT exports preserve Bulgarian, timing and deliberate defects', () => {
  const content = structuredClone(rows.find(r => r.lesson === 'pv01-11').payload.additions[0].content);
  const l = { moduleId: 's02-m01', title: '', subtitle: '', objective: '', blocks: [{ title: '', type: 'rich_text', content }] };
  const count = countVisibleLessonWords(l); expect(count).toBeGreaterThan(200);
  content.body += ' Допълнителен резервен текст.'.repeat(100); expect(countVisibleLessonWords(l)).toBe(count);
  expect(videoAiSrt('source')).toContain('00:00:00,000 --> 00:00:02,200\nПърво провери звука.');
  expect(videoAiSrt('changed')).toContain('Отдалечи'); expect(videoAiSrt('source')).toContain('Доближи');
  expect(videoAiSrt('late')).toContain('00:00:01,600'); expect(videoAiSrt('unknown')).toBeNull();
  for (const v of VIDEO_AI_CAPTIONS) expect(v.cues.every(c => c.start >= 0 && c.end > c.start)).toBe(true);
});
