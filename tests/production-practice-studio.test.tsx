// @vitest-environment jsdom
import React, { useState } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ClosedPracticeStudio from '../src/components/academy/ClosedPracticeStudio';
import { parseClosedStudio, studioMatches, studioPlanText, studioSchedule } from '../src/lib/closed-practice-studio';
import { loadProductionCandidates } from '../scripts/prepare-production-video-assets.mjs';
const lessons = loadProductionCandidates();
const lesson = (id: string) => lessons.find(l => l.lesson === id)!;
const parsed = (id: string) => parseClosedStudio(lesson(id).practice.content)!;
const props = { busy: false, completed: false, onChange: vi.fn(), onSubmit: vi.fn() };
beforeEach(() => { HTMLMediaElement.prototype.pause = vi.fn(); HTMLMediaElement.prototype.play = vi.fn(async () => {}); });
afterEach(cleanup);

test('all 77 cases contain a separate changed condition and reject pasted state', () => {
  expect(lessons).toHaveLength(77);
  for (const l of lessons) {
    const studio = parsed(l.lesson);
    expect(studio.change.length, l.lesson).toBeGreaterThan(30);
    expect(studio.slots.filter(s => s.phase === 'change'), l.lesson).toHaveLength(1);
    expect(studio.slots.every(s => s.choices.length >= 3)).toBe(true);
    const matches = Object.fromEntries(studio.slots.map(s => [s.id, s.choices[0]]));
    expect(studioMatches(studio, { matches: { ...matches, invented: 'private text' }, file: 'private file' })).toEqual(matches);
    const exported = studioPlanText(studio, matches);
    expect(exported).toContain(studio.change);
    expect(exported).toContain('не удостоверява оценка');
    expect(exported).not.toContain('private text');
    for (const value of Object.values(matches)) expect(exported).not.toContain(value);
  }
});

test('older studio rendering still receives all conditions and finite alternatives', () => {
  for (const l of lessons) {
    const content = structuredClone(l.practice.content);
    const change = content.studio.change;
    delete content.studio.productionKind; delete content.studio.initialContext; delete content.studio.change;
    const oldView = parseClosedStudio(content)!;
    expect(['decision', 'cut', 'frame', 'colour', 'sound', 'diagram']).toContain(oldView.kind);
    expect(oldView.context).toContain(change);
    expect(oldView.slots.length).toBe(l.practice.content.left.length);
  }
});

test('selected schedules compute actual intervals and reveal conflicts for a single operator', () => {
  const studio = parsed('pv06-06');
  const timed = studio.slots.filter(s => s.preview);
  const pick = (i: number, start: number) => studio.choices.find(c => timed[i].choices.includes(c.id) && c.schedule?.start === start)!.id;
  const matches = { [timed[0].id]: pick(0, 0), [timed[1].id]: pick(1, 15), [timed[2].id]: pick(2, 35) };
  expect(studioSchedule(studio, matches)).toMatchObject({ overlaps: [], end: 50, work: 50 });
  expect(studioSchedule(studio, { ...matches, [timed[1].id]: pick(1, 10) }).overlaps).toContainEqual(['Подготовка', 'Демонстрация']);
  render(<ClosedPracticeStudio {...props} studio={studio} state={{ matches }} />);
  expect(screen.getByRole('list', { name: 'Сглобен снимачен график' }).textContent).toContain('09:35–09:50');
});

test('changed condition appears after the initial finite decisions, with no open inputs', () => {
  const studio = parsed('pv08-09');
  function Harness() { const [state, change] = useState({}); return <ClosedPracticeStudio {...props} studio={studio} state={state} onChange={change} />; }
  render(<Harness />);
  expect(screen.queryByText(studio.change)).toBeNull();
  for (const slot of studio.slots.filter(s => s.phase === 'base')) fireEvent.change(screen.getByRole('combobox', { name: slot.text }), { target: { value: slot.choices[0] } });
  expect(screen.getByText(studio.change)).toBeTruthy();
  expect((screen.getByRole('button', { name: 'Провери решенията' }) as HTMLButtonElement).disabled).toBe(true);
  const changed = studio.slots.find(s => s.phase === 'change')!;
  fireEvent.change(screen.getByRole('combobox', { name: changed.text }), { target: { value: changed.choices[0] } });
  expect((screen.getByRole('button', { name: 'Провери решенията' }) as HTMLButtonElement).disabled).toBe(false);
  expect(screen.queryByRole('textbox')).toBeNull();
  expect(document.querySelector('input,textarea')).toBeNull();
});

test('caption variants change a real frame composition rather than only a label', () => {
  const studio = parsed('pv09-04'), slot = studio.slots[0];
  const top = studio.choices.find(c => slot.choices.includes(c.id) && c.caption?.position === 'top' && c.caption.size === 'normal')!;
  const middle = studio.choices.find(c => slot.choices.includes(c.id) && c.caption?.position === 'middle')!;
  const { rerender } = render(<ClosedPracticeStudio {...props} studio={studio} state={{ matches: { [slot.id]: top.id } }} />);
  expect(screen.getByTestId('studio-caption').className).not.toContain('absolute');
  expect(screen.getByRole('img').getAttribute('src')).toContain('coffee-poster.jpg');
  rerender(<ClosedPracticeStudio {...props} studio={studio} state={{ matches: { [slot.id]: middle.id } }} />);
  expect(screen.getByTestId('studio-caption').className).toContain('absolute');
  expect(screen.getByTestId('studio-caption').style.top).toBe('40%');
});

test('speed playback uses the selected rate and source range', async () => {
  const studio = parsed('pv09-10'), slot = studio.slots[0];
  const choice = studio.choices.find(c => slot.choices.includes(c.id) && c.rate === 2)!;
  render(<ClosedPracticeStudio {...props} studio={studio} state={{ matches: { [slot.id]: choice.id } }} />);
  const player = screen.getByLabelText('Скорост на предоставения фрагмент') as HTMLVideoElement;
  fireEvent.click(screen.getByRole('button', { name: 'Пусни избраната скорост' }));
  await waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalled());
  expect(player.playbackRate).toBe(2); expect(player.currentTime).toBe(10);
  player.currentTime = 14; fireEvent.timeUpdate(player);
  expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
});

test('sound transition picture follows audio time and changes from J-cut to L-cut', () => {
  const studio = parsed('pv09-09'), first = studio.slots[0], changed = studio.slots.at(-1)!;
  const early = studio.choices.find(c => first.choices.includes(c.id) && c.transition === 'early')!;
  const tail = studio.choices.find(c => changed.choices.includes(c.id) && c.transition === 'tail')!;
  const { rerender } = render(<ClosedPracticeStudio {...props} studio={studio} state={{ matches: { [first.id]: early.id } }} />);
  let player = screen.getByLabelText('Синтетичен звук за прехода') as HTMLAudioElement;
  player.currentTime = 2.5; fireEvent.timeUpdate(player); expect(screen.getByText('Помещението')).toBeTruthy();
  player.currentTime = 3.2; fireEvent.timeUpdate(player); expect(screen.getByText('Говорещият')).toBeTruthy();
  rerender(<ClosedPracticeStudio {...props} studio={studio} state={{ matches: { [first.id]: early.id, [studio.slots[1].id]: studio.slots[1].choices[0], [changed.id]: tail.id } }} />);
  player = screen.getByLabelText('Синтетичен звук за прехода') as HTMLAudioElement;
  player.currentTime = 4.2; fireEvent.timeUpdate(player); expect(screen.getByText('Ръцете и работната маса')).toBeTruthy();
});

test('a result-first assembly visibly marks its return to the earlier source fragment', async () => {
  const studio = parsed('pv10-14'), slots = studio.slots.filter(s => s.preview);
  const times = [26, 0, 10, 16];
  const matches = Object.fromEntries(slots.map((s, i) => [s.id, studio.choices.find(c => s.choices.includes(c.id) && c.clip?.[0] === times[i])!.id]));
  render(<ClosedPracticeStudio {...props} studio={studio} state={{ matches }} />);
  fireEvent.click(screen.getByRole('button', { name: 'Прегледай подредбата' }));
  await waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalled());
  const player = screen.getByLabelText('Преглед на подредената сцена') as HTMLVideoElement;
  player.currentTime = 29; fireEvent.timeUpdate(player);
  expect(screen.getByText('Преди това', { exact: true })).toBeTruthy();
});
