// @vitest-environment jsdom
import React, { useState } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { JSDOM, VirtualConsole } from 'jsdom';
import ClosedPracticeStudio from '../src/components/academy/ClosedPracticeStudio';
import PerfectVideoStartPage from '../src/pages/perfect-video-start/page';
import { VIDEO_LAB_CHALLENGES } from '../src/data/video-lab-challenges';
import { VIDEO_LAB_KINDS, videoLabTitle } from '../src/components/academy/VideoDecisionLab';
import { SILK_PRACTICE_CASES } from '../src/data/silk-road-start';
import { buildSilkWorkbook, type SilkPagePlan } from '../src/lib/silk-road-practice';
import { readSilkLabDraft, saveSilkLabDraft } from '../src/lib/silk-lab-draft';
import { buildVideoLabWorkbook } from '../src/lib/video-lab-workbook';
import { parseClosedStudio, studioComparison, studioComparisonText } from '../src/lib/closed-practice-studio';
import { loadPracticalCandidates } from '../scripts/prepare-practical-video-assets.mjs';
import { loadPracticalSilkCandidates } from '../scripts/prepare-practical-silk-assets.mjs';
import { loadPracticalMarketingCandidates } from '../scripts/prepare-practical-marketing-assets.mjs';

const valid = (price = '25'): SilkPagePlan => ({ price, source: 'current', action: 'request', duplicates: 'same-id', missingContact: 'ask' });
const opened: JSDOM[] = [];
beforeEach(() => { localStorage.clear(); HTMLMediaElement.prototype.pause = vi.fn(); HTMLElement.prototype.scrollIntoView = vi.fn(); });
afterEach(() => { cleanup(); for (const dom of opened) dom.window.close(); opened.length = 0; vi.restoreAllMocks(); });

test.each([
  ['video', () => loadPracticalCandidates()[0]],
  ['silk', () => loadPracticalSilkCandidates()[0]],
  ['marketing', () => loadPracticalMarketingCandidates()[0]],
] as const)('%s compares drafts without changing the grading payload or losing the saved version', (_domain, candidate) => {
  const studio = parseClosedStudio(candidate().practice.content)!;
  const initial = Object.fromEntries(studio.slots.map(slot => [slot.id, slot.choices[0]]));
  const submit = vi.fn();
  function Example() { const [matches, setMatches] = useState(initial); return <ClosedPracticeStudio studio={studio} state={{ matches }} busy={false} completed={false} onChange={value => setMatches(value.matches as Record<string, string>)} onSubmit={submit} />; }
  render(<Example />);
  fireEvent.click(screen.getByRole('button', { name: 'Запази вариант за сравнение' }));
  const slot = studio.slots[0];
  fireEvent.change(screen.getByRole('combobox', { name: slot.text }), { target: { value: slot.choices[1] } });
  const region = within(screen.getByRole('region', { name: 'Сравнение на решенията' }));
  expect(region.getByText(/Променени части: 1\//)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Провери решенията' }));
  expect(submit).toHaveBeenLastCalledWith({ matches: { ...initial, [slot.id]: slot.choices[1] } });
  fireEvent.click(region.getByRole('button', { name: 'Върни запазените избори' }));
  expect((screen.getByRole('combobox', { name: slot.text }) as HTMLSelectElement).value).toBe(slot.choices[0]);
  expect(region.getByText(/Променени части: 0\//)).toBeTruthy();
  expect(submit).toHaveBeenCalledTimes(1);
  const dirty = { ...initial, unknown: 'student-text' };
  expect(studioComparison(studio, dirty, initial).every(row => !row.changed)).toBe(true);
  expect(studioComparisonText(studio, dirty, initial)).not.toContain('student-text');
  expect(studioComparisonText(studio, dirty, initial)).toContain(studio.task);
});

test('the offline workbook executes the learner artifact, then accepts a corrected finite plan', async () => {
  const errors: unknown[] = [], vc = new VirtualConsole(); vc.on('jsdomError', error => errors.push(error));
  const html = buildSilkWorkbook(SILK_PRACTICE_CASES[0], { ...valid('20'), source: 'advert', action: 'confirm', duplicates: 'new-record', missingContact: 'guess' });
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'file:///tmp/tavora-workbook.html', virtualConsole: vc }); opened.push(dom);
  const d = dom.window.document, button = d.getElementById('workbook-check') as HTMLButtonElement;
  button.click(); await waitFor(() => expect(d.querySelectorAll('#workbook-results li')).toHaveLength(8));
  expect(d.querySelectorAll('#workbook-results [data-passed="false"]').length).toBeGreaterThan(0);
  for (const [key, value] of Object.entries(valid())) { const select = d.getElementById('plan-' + key) as HTMLSelectElement; select.value = value; select.dispatchEvent(new dom.window.Event('change')); }
  expect(d.getElementById('record-count')!.textContent).toBe('0');
  expect(d.getElementById('offer-price')!.textContent).toBe('25 €');
  button.click(); await waitFor(() => expect(d.querySelectorAll('#workbook-results [data-passed="true"]')).toHaveLength(8));
  expect(d.querySelectorAll('input,textarea,[contenteditable="true"],script[src],img[src],audio,iframe')).toHaveLength(0);
  expect(errors).toEqual([]);
});

test('the bakery workbook uses its own facts instead of passing a memorised bicycle price', async () => {
  const dom = new JSDOM(buildSilkWorkbook(SILK_PRACTICE_CASES[1], valid()), { runScripts: 'dangerously', url: 'file:///tmp/bakery.html' }); opened.push(dom);
  const d = dom.window.document; (d.getElementById('workbook-check') as HTMLButtonElement).click();
  await waitFor(() => expect(d.querySelectorAll('#workbook-results li')).toHaveLength(8));
  expect(d.querySelectorAll('#workbook-results [data-passed="false"]')).toHaveLength(1);
  expect(d.getElementById('workbook-results')!.textContent).toContain('18 €');
});

test('local Silk drafts retain only supplied choices, never progress or an uploaded value', () => {
  saveSilkLabDraft({ caseIndex: 1, plans: { workshop: { ...valid(), price: '<script>25</script>' }, bakery: valid('18') } });
  const restored = readSilkLabDraft(); expect(restored.restored).toBe(true); expect(restored.caseIndex).toBe(1); expect(restored.plans.workshop.price).toBe(''); expect(restored.plans.bakery).toEqual(valid('18'));
  const raw = localStorage.getItem('tavora:lab:silk:20261016')!;
  expect(raw).not.toMatch(/completed|score|xp|<script>/);
  localStorage.setItem('tavora:lab:silk:20261016', '{broken'); expect(readSilkLabDraft().restored).toBe(false);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('unavailable'); }); expect(saveSilkLabDraft(restored)).toBe(false);
});

test('the portable video exercise retains a finite draft but requires its own fresh check', () => {
  const first = VIDEO_LAB_CHALLENGES.story[0], second = VIDEO_LAB_CHALLENGES.story[1];
  const dom = new JSDOM(buildVideoLabWorkbook({ [first.id]: { choice: 'pour', checked: 'pour' } }), { runScripts: 'dangerously', url: 'file:///tmp/video.html' }); opened.push(dom);
  const d = dom.window.document;
  expect(d.getElementById('workbook-progress')!.textContent).toContain('0/22');
  expect(d.querySelectorAll('fieldset')).toHaveLength(1);
  (d.querySelector('fieldset button') as HTMLButtonElement | null)?.click();
  const check = () => [...d.querySelectorAll('button')].filter(button => button.textContent === 'Провери основанието');
  check()[0].click(); expect(d.querySelectorAll('fieldset')).toHaveLength(2);
  const answer = d.querySelector(`input[name="${second.id}"][value="mark"]`) as HTMLInputElement;
  answer.click(); check()[1].click(); expect(d.getElementById('workbook-progress')!.textContent).toContain('2/22');
  expect(d.activeElement?.id).toBe(second.id + '-check');
  (d.querySelector('[data-lab-theme-choice="dark"]') as HTMLButtonElement).click();
  expect(d.documentElement.dataset.labTheme).toBe('dark'); expect(d.getElementById('workbook-progress')!.textContent).toContain('2/22');
  expect(d.querySelectorAll('textarea,input[type=text],input[type=file],script[src]')).toHaveLength(0);
});

test('a workbook cannot change the plan or run a second check during a delayed submission', async () => {
  const dom = new JSDOM(buildSilkWorkbook(SILK_PRACTICE_CASES[0], valid()), { runScripts: 'dangerously', url: 'file:///tmp/delay.html' }); opened.push(dom);
  const d = dom.window.document;
  (d.getElementById('mode') as HTMLSelectElement).value = 'slow';
  (d.getElementById('send') as HTMLButtonElement).click();
  const choice = d.getElementById('plan-action') as HTMLSelectElement; choice.value = 'confirm'; choice.dispatchEvent(new dom.window.Event('change'));
  expect(choice.value).toBe('request');
  (d.getElementById('workbook-check') as HTMLButtonElement).click(); expect(d.getElementById('workbook-results')!.textContent).toContain('Изчакай');
  await waitFor(() => expect(d.getElementById('record-count')!.textContent).toBe('1'), { timeout: 2000 });
  expect(d.querySelectorAll('#workbook-results li')).toHaveLength(0);
});

test('all eleven video topics require a new decision and accept a different goal without course credit', () => {
  const fetch = vi.spyOn(globalThis, 'fetch');
  render(<MemoryRouter><PerfectVideoStartPage /></MemoryRouter>);
  const navigation = within(screen.getByRole('navigation', { name: 'Избери демонстрация' }));
  for (const [index, kind] of VIDEO_LAB_KINDS.entries()) {
    fireEvent.click(navigation.getAllByRole('button')[index]);
    const region = within(screen.getByRole('region', { name: 'Приложи показаното в нов случай' }));
    const [first, next] = VIDEO_LAB_CHALLENGES[kind];
    expect(region.queryByText(next.context)).toBeNull();
    const wrong = first.options.find(option => !option.meetsGoal)!;
    fireEvent.click(region.getByRole('radio', { name: wrong.label })); fireEvent.click(region.getByRole('button', { name: 'Провери основанието' }));
    expect(region.getByText(wrong.note)).toBeTruthy(); expect(region.queryByText(next.context)).toBeNull();
    const chosen = first.options.find(option => option.meetsGoal)!;
    fireEvent.click(region.getByRole('radio', { name: chosen.label })); fireEvent.click(region.getByRole('button', { name: 'Провери основанието' }));
    expect(region.getByText(next.context)).toBeTruthy();
    const second = next.options.find(option => option.meetsGoal)!;
    fireEvent.click(region.getByRole('radio', { name: second.label })); fireEvent.click(region.getAllByRole('button', { name: 'Провери основанието' })[1]);
    expect(region.getByText(second.note)).toBeTruthy();
    expect(navigation.getAllByRole('button')[index].textContent).toContain('2/2 нови случая');
  }
  expect(screen.getByText('Обосновани решения в тази сесия: 22/22')).toBeTruthy();
  fireEvent.click(navigation.getAllByRole('button')[0]);
  expect((screen.getByRole('radio', { name: VIDEO_LAB_CHALLENGES.story[0].options[0].label }) as HTMLInputElement).checked).toBe(true);
  const preview = screen.getAllByRole('button', { name: 'Виж свързания вариант в демонстрацията' })[1]; fireEvent.click(preview);
  const demo = within(screen.getByRole('group', { name: 'Вариант на демонстрацията' }));
  expect(demo.getByRole('button', { name: 'Първо резултатът' }).getAttribute('aria-pressed')).toBe('true');
  expect(screen.queryByRole('textbox')).toBeNull(); expect(fetch).not.toHaveBeenCalled();
  expect(screen.getByRole('heading', { name: videoLabTitle('story') })).toBeTruthy();
}, 15000);
