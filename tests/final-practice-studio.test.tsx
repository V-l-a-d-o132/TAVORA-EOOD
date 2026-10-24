// @vitest-environment jsdom
import React, { useState } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ClosedPracticeStudio from '../src/components/academy/ClosedPracticeStudio';
import { parseClosedStudio, studioBudget, studioCalculation, studioMatches, studioPlanText } from '../src/lib/closed-practice-studio';
import { loadFinalCandidates } from '../scripts/prepare-final-video-assets.mjs';
import { ACADEMY_READING_WORDS } from '../src/data/academy-reading-words';
import { loadVideoCompletionLessons } from '../scripts/prepare-video-completion-assets.mjs';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
const lessons = loadFinalCandidates();
const currentLessons = new Map(loadVideoCompletionLessons().map(l => [l.lessonId,l]));
const lesson = (id: string) => lessons.find(l => l.lesson === id)!;
const parsed = (id: string) => parseClosedStudio(lesson(id).practice.content)!;
const props = { busy: false, completed: false, onChange: vi.fn(), onSubmit: vi.fn() };
beforeEach(() => { HTMLMediaElement.prototype.pause = vi.fn(); HTMLMediaElement.prototype.play = vi.fn(async () => {}); });
afterEach(cleanup);

test('all 73 new cases preserve older rendering, finite choices, text capacity and a separate transfer question', () => {
  expect(lessons).toHaveLength(73);
  for (const l of lessons) {
    const studio = parsed(l.lesson), fallback = structuredClone(l.practice.content);
    expect(studio.slots.filter(s => s.phase === 'change')).toHaveLength(1);
    expect(studio.slots.every(s => s.choices.length >= 3)).toBe(true);
    expect(l.wordsAfter).toBeGreaterThan(l.wordsBefore);
    const current = currentLessons.get(l.lesson)!;
    expect(current).toBeDefined();
    expect(ACADEMY_READING_WORDS[`${l.module}/${l.lesson}`]).toBe(countVisibleLessonWords(current));
    delete fallback.studio.productionKind; delete fallback.studio.initialContext; delete fallback.studio.change;
    const old = parseClosedStudio(fallback)!;
    expect(['decision','cut','frame','colour','sound','diagram']).toContain(old.kind);
    expect(old.context).toContain(studio.change);
    const matches = Object.fromEntries(studio.slots.map(s => [s.id, s.choices[0]]));
    expect(studioMatches(studio, { matches: { ...matches, text: 'pasted' }, file: 'data:file' })).toEqual(matches);
    const exported = studioPlanText(studio, matches);
    expect(exported).toContain(studio.change); expect(exported).toContain('не удостоверява оценка');
    for (const id of Object.values(matches)) expect(exported).not.toContain(id);
  }
});

test('case calculations retain units and do not turn missing denominators into zero', () => {
  expect(studioCalculation({ label: '', a: 60, b: 150, operation: 'percent', aLabel: '', bLabel: '', unit: '%' })).toBe(40);
  expect(studioCalculation({ label: '', a: 120, b: 50, operation: 'multiply', aLabel: '', bLabel: '', unit: 'сек.' })).toBe(6000);
  expect(studioCalculation({ label: '', a: 10, b: 0, operation: 'divide', aLabel: '', bLabel: '', unit: '' })).toBeNull();
  const studio = parsed('pv11-09'), first = studio.slots[0];
  const choice = studio.choices.find(c => first.choices.includes(c.id) && c.calculation?.a === 60 && c.calculation?.b === 150)!;
  render(<ClosedPracticeStudio {...props} studio={studio} state={{ matches: { [first.id]: choice.id } }} />);
  expect(screen.getByRole('list', { name: 'Избрани сметки' }).textContent).toContain('40 %');
  expect(screen.getByRole('list', { name: 'Избрани сметки' }).textContent).toContain('дължина в секунди');
});

test('retention marks a selected interval without attributing a cause', () => {
  const studio = parsed('pv11-05'), first = studio.slots[0];
  const choice = studio.choices.find(c => first.choices.includes(c.id) && c.focus?.[0] === 40)!;
  render(<ClosedPracticeStudio {...props} studio={studio} state={{ matches: { [first.id]: choice.id } }} />);
  expect(screen.getByRole('img').getAttribute('aria-label')).toContain('Учебна крива');
  expect(screen.getByText(/Избран за преглед интервал/).textContent).toContain('40–60');
  expect(screen.getByText(/Избран за преглед интервал/).textContent).toContain('не установява причината');
  expect(screen.getByText(/0 сек.: 100%/)).toBeTruthy();
});

test('a budget recomputes labour, reserve, margin and markup after a changed condition', () => {
  expect(studioBudget({ hours: 10, hourly: 20, external: 60, reservePercent: 10 })).toMatchObject({ labour: 200, base: 260, reserve: 26, cost: 286, margin: null });
  expect(studioBudget({ hours: 10, hourly: 30, external: 100, reservePercent: 0, price: 500 })).toMatchObject({ cost: 400, difference: 100, markup: 25, margin: 20 });
  expect(studioBudget({ hours: 0, hourly: 0, external: 0, reservePercent: 0, price: 0 })).toMatchObject({ markup: null, margin: null });
  const studio = parsed('pv13-12'), first = studio.slots[0], changed = studio.slots.at(-1)!;
  const initial = studio.choices.find(c => first.choices.includes(c.id) && c.budget?.price === 500)!;
  const next = studio.choices.find(c => changed.choices.includes(c.id) && c.budget?.price === 562.5)!;
  const matches = { [first.id]: initial.id, [studio.slots[1].id]: studio.slots[1].choices[0], [changed.id]: next.id };
  render(<ClosedPracticeStudio {...props} studio={studio} state={{ matches }} />);
  expect(screen.getByLabelText('Учебен разчет').textContent).toContain('562,5');
  expect(screen.getByLabelText('Учебен разчет').textContent).toContain('20%');
});

test('storyboard shows the selected concrete actions and unlocks a new scene without open inputs', () => {
  const studio = parsed('pv15-02');
  function Harness() { const [state, change] = useState({}); return <ClosedPracticeStudio {...props} studio={studio} state={state} onChange={change} />; }
  render(<Harness />);
  expect(screen.queryByText(studio.change)).toBeNull();
  const scenes = ['choice','order','handover','pickup'];
  for (const [i, slot] of studio.slots.entries()) {
    const choice = studio.choices.find(c => slot.choices.includes(c.id) && c.board?.scene === scenes[i])!;
    fireEvent.change(screen.getByRole('combobox', { name: slot.text }), { target: { value: choice.id } });
  }
  expect(screen.getByText(studio.change)).toBeTruthy();
  expect(screen.getByRole('list', { name: 'Избран разкадровъчен план' }).querySelectorAll('svg')).toHaveLength(4);
  expect(screen.getByRole('list', { name: 'Избран разкадровъчен план' }).textContent).toContain('4. Място за получаване');
  expect(document.querySelector('input,textarea')).toBeNull();
  expect((screen.getByRole('button', { name: 'Провери решенията' }) as HTMLButtonElement).disabled).toBe(false);
});

test('invalid graphs, unknown scenes, arbitrary URLs and nonfinite preview operands are not accepted', () => {
  const content = structuredClone(lesson('pv11-09').practice.content);
  content.studio.report = { title: 'Invalid', points: [{ at: 10, value: 50 }, { at: 5, value: 100 }] };
  content.right[0].preview = { calculation: { label: 'bad', a: Infinity, b: 2, operation: 'multiply', unit: '' }, board: { scene: 'https://example.invalid/file', caption: '', seconds: 4 }, audio: 'https://example.invalid/audio' };
  const studio = parseClosedStudio(content)!;
  expect(studio.report).toBeUndefined();
  expect(studio.choices[0].calculation).toBeUndefined(); expect(studio.choices[0].board).toBeUndefined(); expect(studio.choices[0].audio).toBeUndefined();
});
