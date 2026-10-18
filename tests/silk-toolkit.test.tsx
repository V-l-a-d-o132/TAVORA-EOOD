// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import catalog from '../src/data/silk-tools.json';
import { parseLessonToolkit, parseSilkTool, toolkitHttps, toolkitLessonLink } from '../src/lib/silk-toolkit';
import { hasWebPHeader, providedImageSize } from '../src/lib/silk-image-workbench';
import { parseClosedStudio } from '../src/lib/closed-practice-studio';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
import LessonRichText from '../src/pages/module/components/lesson-v2/LessonRichText';
import { loadPracticalSilkCandidates } from '../scripts/prepare-practical-silk-assets.mjs';

const release = loadPracticalSilkCandidates('toolkit-20261018');
afterEach(cleanup);

test('the approved 59 tools have actionable routes, evidence and valid lesson destinations', () => {
  expect(catalog).toHaveLength(59); expect(new Set(catalog.map(tool => tool.id)).size).toBe(59);
  const ids = new Set(catalog.map(tool => tool.id));
  for (const tool of catalog) {
    expect(parseSilkTool(tool)).toBeTruthy(); expect(tool.steps).toHaveLength(3);
    expect(tool.verification.length).toBeGreaterThan(40); expect(tool.sources.length).toBeGreaterThan(0);
    expect(tool.lessons.every(id => toolkitLessonLink(id))).toBe(true);
    expect(tool.alternatives.every(id => ids.has(id))).toBe(true);
  }
  expect(catalog.find(tool => tool.id === 'stripe')!.access).toBe('transaction');
  for (const id of ['remove-bg', 'elevenlabs']) expect(catalog.find(tool => tool.id === id)!.access).toBe('personal');
  for (const id of ['flow', 'stitch']) expect(catalog.find(tool => tool.id === id)!.access).toBe('check');
});

test('all 51 guides resolve their tools, keep a readable older-build fallback and add only closed checks', () => {
  expect(release).toHaveLength(74);
  const guides = release.flatMap(lesson => lesson.payload.additions.filter(block => block.type === 'rich_text'));
  const checks = release.flatMap(lesson => lesson.payload.additions.filter(block => block.type === 'matching'));
  expect(guides).toHaveLength(51); expect(checks).toHaveLength(11);
  expect(checks.reduce((n, block) => n + block.content.left.length, 0)).toBe(43);
  for (const block of guides) {
    expect(parseLessonToolkit(block.content.toolkit)).toBeTruthy(); expect(block.content.toolkitIntro.length).toBeGreaterThan(150);
    expect(block.content.body).toContain(block.content.toolkitIntro);
    for (const card of block.content.toolkit.cards) { expect(block.content.body).toContain(card.name); expect(block.content.body).toContain(card.steps[0]); }
  }
  for (const block of checks) {
    expect(parseClosedStudio(block.content)).toBeTruthy();
    expect(block.content.left.every(slot => slot.choices.length === 3)).toBe(true);
  }
  const forbidden = new Set(['evaluation', 'answer_key', 'answerKey', 'correct', 'correctAnswer', 'answers', 'feedback', 'scoring']);
  const scan = (value: unknown) => { if (Array.isArray(value)) value.forEach(scan); else if (value && typeof value === 'object') for (const [key, part] of Object.entries(value)) { expect(forbidden.has(key)).toBe(false); scan(part); } };
  scan(release);
});

test('the lesson shows each guide once and keeps full text if enhanced data is invalid', () => {
  const block = release.find(lesson => lesson.lesson === 'l01-02').payload.additions[0];
  render(<LessonRichText content={block.content} />);
  expect(screen.getAllByText((_, node) => node?.tagName === 'P' && node.textContent === block.content.toolkitIntro)).toHaveLength(1);
  expect(screen.getByRole('article', { name: 'Gemini' })).toBeTruthy();
  fireEvent.click(screen.getByText('Стъпки и проверка · Gemini'));
  expect(screen.getByText(block.content.toolkit.cards[0].steps[0])).toBeTruthy();
  expect(document.querySelector('input,textarea,iframe,[contenteditable="true"]')).toBeNull();
  cleanup(); render(<LessonRichText content={{ body: 'Пълният предоставен маршрут остава четим.', toolkitFallback: true, toolkit: { release: 'silk_toolkit_20261018', cards: [] } }} />);
  expect(screen.getByText('Пълният предоставен маршрут остава четим.')).toBeTruthy();
});

test('untrusted links, duplicate cards, remote embeds and unbounded payloads do not become executable UI', () => {
  expect(toolkitHttps('javascript:alert(1)')).toBeNull(); expect(toolkitHttps('https://user:secret@example.invalid/')).toBeNull();
  expect(toolkitLessonLink('l02-99')).toBeNull(); expect(toolkitLessonLink('l01-05')).toBeNull();
  const card = structuredClone(catalog[0]); card.site = 'javascript:alert(1)'; expect(parseSilkTool(card)).toBeNull();
  const valid = { release: 'silk_toolkit_20261018', cards: [catalog[0]] };
  expect(parseLessonToolkit({ ...valid, cards: [catalog[0], catalog[0]] })).toBeNull();
  expect(parseLessonToolkit({ ...valid, cards: Array.from({ length: 13 }, () => catalog[0]) })).toBeNull();
  const unsafe = { ...catalog[0], name: '<script>run()</script>', src: 'https://example.invalid/' };
  render(<LessonRichText content={{ body: 'Учебен текст', toolkit: { ...valid, cards: [unsafe], lab: 'iframe' } }} />);
  expect(document.querySelector('script,iframe')).toBeNull(); expect(screen.getAllByText(/<script>run/).length).toBeGreaterThan(0);
});

test('reading time includes guide and tool instructions once without counting fallback or configuration twice', () => {
  const content = structuredClone(release.find(lesson => lesson.lesson === 'l01-02').payload.additions[0].content);
  const lesson = { moduleId: 's01-m01', title: '', subtitle: '', objective: '', blocks: [{ title: '', content }] };
  const before = countVisibleLessonWords(lesson); expect(before).toBeGreaterThan(200);
  content.body += '\n\n'.repeat(2) + 'Този пълен резервен текст е само за по-стария интерфейс. '.repeat(100);
  expect(countVisibleLessonWords(lesson)).toBe(before);
});

test('image preparation preserves aspect and never upscales or mistakes a renamed JPEG for WebP', () => {
  expect(providedImageSize(720, 406, 480)).toEqual({ width: 480, height: 271 });
  expect(providedImageSize(160, 100, 720)).toEqual({ width: 160, height: 100 });
  expect(() => providedImageSize(0, 100, 240)).toThrow();
  expect(hasWebPHeader(new TextEncoder().encode('RIFF0000WEBPdata'))).toBe(true);
  expect(hasWebPHeader(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe(false);
});
