// @vitest-environment jsdom
import React from 'react';
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PerfectVideoStartPage from '../src/pages/perfect-video-start/page';
import { VIDEO_STUDY_CASES } from '../src/data/perfect-video-start';
import { buildVideoTimeline, checkVideoTimeline, contrastRatio, emptyVideoPlan, fileChecks, recordVideoTimeline, sceneAt, videoStoryboardCsv, type VideoPlan } from '../src/lib/perfect-video-practice';
import { usesIndependentPractice } from '../src/lib/lesson-option-order';

const valid = (changes: Partial<VideoPlan> = {}): VideoPlan => ({ ...emptyVideoPlan(), count: '6', price: '9', source: 'current', hook: 'question', receiving: 'pickup', action: 'ask', ...changes });
beforeEach(() => { vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('first video project checks the artifact that is rendered and recorded', () => {
  it('builds a real 25-second timeline with five connected scenes and exact conditions', () => {
    const timeline = buildVideoTimeline(VIDEO_STUDY_CASES[0], valid());
    expect(checkVideoTimeline(VIDEO_STUDY_CASES[0], timeline).every(check => check.passed)).toBe(true);
    expect(timeline.width).toBe(1080); expect(timeline.height).toBe(1920); expect(timeline.scenes).toHaveLength(5);
    expect(sceneAt(timeline, 4).shownItems).toBe(6); expect(sceneAt(timeline, 25).id).toBe('action');
    expect(sceneAt(timeline, 10).title).toBe('9 €'); expect(sceneAt(timeline, 10).lines).toContain('Вземане от обекта');
    expect(videoStoryboardCsv(timeline)).toContain('"21","25"');
  });
  it.each([
    ['count', { count: '4' }], ['price', { price: '8' }], ['price', { source: 'old' }],
    ['receiving', { receiving: 'free' }], ['hook', { hook: 'miracle' }], ['action', { action: 'buy' }],
    ['contrast', { palette: 'washed' }], ['geometry', { format: 'horizontal' }], ['geometry', { seconds: '20' }],
    ['geometry', { seconds: '' }], ['geometry', { seconds: 'nonsense' }], ['geometry', { format: 'unknown' }], ['contrast', { palette: 'unknown' }],
  ] as const)('detects %s when the corresponding visible artifact changes', (id, change) => {
    const timeline = buildVideoTimeline(VIDEO_STUDY_CASES[0], valid(change));
    expect(checkVideoTimeline(VIDEO_STUDY_CASES[0], timeline).find(check => check.id === id)?.passed).toBe(false);
  });
  it('requires different facts in the second case and accepts the Bulgarian decimal comma', () => {
    const second = VIDEO_STUDY_CASES[1];
    expect(checkVideoTimeline(second, buildVideoTimeline(second, valid())).some(check => !check.passed)).toBe(true);
    expect(checkVideoTimeline(second, buildVideoTimeline(second, valid({ count: '4', price: '24,00', receiving: 'clarify' }))).every(check => check.passed)).toBe(true);
    expect(contrastRatio('#17221d', '#f7f0e4')).toBeGreaterThan(4.5);
  });
  it('does not accept unknown file duration or treat metadata as a creative or business evaluation', () => {
    expect(fileChecks({ width: 1080, height: 1920, seconds: null, bytes: 100, mime: 'video/webm' }).map(check => check.passed)).toEqual([true, false]);
    expect(fileChecks({ width: 1920, height: 1080, seconds: 25, bytes: 100, mime: 'video/mp4' }).map(check => check.passed)).toEqual([false, true]);
  });
  it('permits local video playback without expanding script or network sources', () => {
    const html = readFileSync('index.html', 'utf8');
    const sources = (directive: string) => html.match(new RegExp(`\\b${directive} ([^;]+);`))?.[1].trim().split(/\s+/u);
    expect(sources('media-src')).toEqual(["'self'", 'blob:', 'https://storage.readdy-site.link']);
    expect(sources('default-src')).toEqual(["'self'"]);
    expect(sources('script-src')).not.toContain('blob:');
    expect(sources('connect-src')).not.toContain('blob:');
    expect(sources('object-src')).toEqual(["'none'"]);
  });
  it('fails with a usable fallback when the browser cannot record', async () => {
    vi.stubGlobal('MediaRecorder', undefined);
    await expect(recordVideoTimeline(buildVideoTimeline(VIDEO_STUDY_CASES[0], valid()), new AbortController().signal, vi.fn())).rejects.toThrow('Изтегли сценария');
    vi.unstubAllGlobals();
  });
});

describe('a beginner can correct a project without an account or grader', () => {
  it('offers three routes, terms and a gated second case; editing invalidates the check', () => {
    render(<MemoryRouter><PerfectVideoStartPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'От една идея до проверен файл' })).toBeTruthy();
    const next = () => screen.getByRole('button', { name: 'Приложи наученото към ателието' }) as HTMLButtonElement;
    expect(next().disabled).toBe(true);
    fireEvent.change(screen.getByRole('textbox', { name: 'Колко броя показваш?' }), { target: { value: '6' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Каква цена показваш в евро?' }), { target: { value: '9' } });
    for (const [label, value] of [['Източник на цената', 'current'], ['Начало на клипа', 'question'], ['Условие за получаване', 'pickup'], ['Последно действие', 'ask']]) fireEvent.change(screen.getByRole('combobox', { name: label }), { target: { value } });
    fireEvent.click(screen.getByRole('button', { name: 'Провери моята версия' }));
    expect(next().disabled).toBe(false); expect(screen.getByRole('status').textContent).toContain('успешен план не удостоверява успешен запис');
    fireEvent.change(screen.getByRole('textbox', { name: 'Каква цена показваш в евро?' }), { target: { value: '8' } });
    expect(next().disabled).toBe(true);
    expect(screen.getByText(/Проверени учебни планове в тази сесия/).textContent).toContain('0/2');
  });
  it('adds a public route and scopes the runtime change to only the three video modules and the existing Silk route', () => {
    expect(readFileSync('src/router/config.tsx', 'utf8')).toContain("path: '/academy-labs/perfect-video/start'");
    for (const module of ['s02-m01', 's02-m02', 's02-m03', 's01-m11']) expect(usesIndependentPractice(module)).toBe(true);
    for (const module of ['s02-m04', 's02-m15', 's03-m01']) expect(usesIndependentPractice(module)).toBe(false);
  });
});
