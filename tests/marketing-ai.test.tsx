// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { loadMarketingAiCandidates, loadMarketingAiSource } from '../scripts/prepare-marketing-ai-assets.mjs';
import { MARKETING_AI_MODULES, MARKETING_AI_TOOLS, marketingAiLessonLink, marketingAiPrice, marketingAiVisibleText, parseMarketingAiGuide, parseMarketingAiTool } from '../src/lib/marketing-ai';
import { parseClosedStudio } from '../src/lib/closed-practice-studio';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
import LessonRichText from '../src/pages/module/components/lesson-v2/LessonRichText';
import MarketingAiGuide from '../src/components/academy/MarketingAiGuide';
const rows = loadMarketingAiCandidates();
const guideBlock = r => r.payload.additions.find(b => b.type === 'rich_text');
afterEach(cleanup);

test('the five displayed modules and 13 real lessons resolve correctly; six tools have safe official routes', () => {
  expect(MARKETING_AI_MODULES.map(m => m.id)).toEqual(['s03-m01', 's03-m02', 's03-m05', 's03-m03', 's03-m07']);
  const source = new Set(loadMarketingAiSource().map(l => l.lesson_id));
  expect(rows).toHaveLength(13); expect(MARKETING_AI_TOOLS).toHaveLength(6);
  for (const r of rows) { expect(source.has(r.lesson)).toBe(true); expect(marketingAiLessonLink(r.lesson)).toBe(`/module/${r.module}?lesson=${r.lesson}`); }
  expect(marketingAiLessonLink('lm01-01')).toBeNull(); expect(marketingAiLessonLink('__proto__')).toBeNull();
  for (const t of MARKETING_AI_TOOLS) { expect(parseMarketingAiTool(t)).toEqual(t); expect(t.steps).toHaveLength(3); expect(t.sources.every(url => url.startsWith('https://'))).toBe(true); }
});

test('guides use provided sources and teaching versions; new checks require 52 decisions including 13 changed conditions', () => {
  let decisions = 0;
  for (const r of rows) {
    expect(r.payload.amendments).toEqual([]); expect(r.payload.additions).toHaveLength(2);
    const b = guideBlock(r), g = parseMarketingAiGuide(b.content.marketingAi)!;
    expect(g, r.lesson).toBeTruthy(); expect(g.documents.length).toBeGreaterThanOrEqual(2); expect(g.prompt.length).toBeGreaterThan(100);
    expect(g.variants).toHaveLength(r.lesson === 'lm03-08' ? 4 : 2);
    for (const text of marketingAiVisibleText(g).filter(t => !['Предоставени учебни източници', 'Задание за помощника', 'Предварително подготвени учебни версии', 'Работен подход'].includes(t))) expect(b.content.body).toContain(text);
    const check = r.payload.additions.find(b => b.type === 'matching'), studio = parseClosedStudio(check.content)!;
    expect(studio.domain).toBe('marketing'); expect(studio.slots).toHaveLength(4);
    expect(studio.slots.filter(s => s.phase === 'change')).toHaveLength(1);
    expect(studio.slots.every(s => s.choices.length === 3)).toBe(true);
    decisions += studio.slots.length;
    expect(r.payload.additions.every(b => b.required)).toBe(true);
  }
  expect(decisions).toBe(52);
  expect(JSON.stringify(rows)).not.toMatch(/"(?:evaluation|answer_key|answerKey|answers|correct|scoring|feedback|modelAnswer)"\s*:/);
});

test('comparison uses finite controls, resets review on switching and offers three tool steps without inputs', () => {
  const g = parseMarketingAiGuide(guideBlock(rows[0]).content.marketingAi)!;
  render(<MarketingAiGuide guide={g} />);
  fireEvent.click(screen.getByRole('button', { name: 'Свери с източниците' }));
  expect(screen.getByRole('status').textContent).toBe(g.variants[0].review);
  fireEvent.click(screen.getByRole('button', { name: g.variants[1].label }));
  expect(screen.queryByRole('status')).toBeNull();
  expect(screen.getByRole('article', { name: 'Текст на избраната версия' }).textContent).toBe(g.variants[1].text);
  const t = MARKETING_AI_TOOLS.find(t => t.id === g.toolIds[0])!;
  fireEvent.click(screen.getByText(`Работен маршрут · ${t.name}`)); expect(screen.getByText(t.steps[0])).toBeTruthy();
  expect(document.querySelector('input,textarea,iframe,[contenteditable="true"]')).toBeNull();
});

test('valid enhanced content renders once, invalid guides retain the readable fallback and unsafe routes are rejected', () => {
  const b = guideBlock(rows[0]), g = b.content.marketingAi;
  render(<LessonRichText content={b.content} allowMarketingAi />);
  expect(screen.getAllByText((_, n) => n?.tagName === 'P' && n.textContent === g.intro)).toHaveLength(1);
  cleanup(); render(<LessonRichText content={{ body: 'Запазен резервен текст.', marketingAiFallback: true, marketingAi: { release: g.release } }} allowMarketingAi />);
  expect(screen.getByText('Запазен резервен текст.')).toBeTruthy();
  expect(parseMarketingAiTool({ ...MARKETING_AI_TOOLS[0], site: 'javascript:alert(1)' })).toBeNull();
  expect(parseMarketingAiTool({ ...MARKETING_AI_TOOLS[0], site: 'https://user:pass@example.invalid' })).toBeNull();
  expect(parseMarketingAiGuide({ ...g, toolIds: ['unknown'] })).toBeNull();
  expect(parseMarketingAiGuide({ ...g, variants: [g.variants[0], g.variants[0]] })).toBeNull();
});

test('reading counts visible instructions once, ignoring fallback duplication and an already counted guide title', () => {
  const b = structuredClone(guideBlock(rows[0])), lesson = { moduleId: rows[0].module, title: '', subtitle: '', objective: '', blocks: [b] };
  const before = countVisibleLessonWords(lesson); expect(before).toBeGreaterThan(300);
  b.content.body += ' Резервно повторение.'.repeat(100); expect(countVisibleLessonWords(lesson)).toBe(before);
  b.content.marketingAi.title += ' Заглавие само за идентичност.'.repeat(100); expect(countVisibleLessonWords(lesson)).toBe(before);
});

test('cost changes use actual markup and margin denominators, including zero or invalid values', () => {
  expect(marketingAiPrice(80, 100)).toEqual({ difference: 20, markup: 25, margin: 20 });
  expect(marketingAiPrice(90, 100)?.margin).toBe(10); expect(marketingAiPrice(0, 100)?.markup).toBeNull();
  expect(marketingAiPrice(80, 0)?.margin).toBeNull(); expect(marketingAiPrice(NaN, 100)).toBeNull(); expect(marketingAiPrice(-1, 100)).toBeNull();
});
