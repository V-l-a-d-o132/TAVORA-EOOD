// @vitest-environment jsdom
import React from 'react';
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PerfectVideoStartPage from '../src/pages/perfect-video-start/page';
import VideoGoalPractice from '../src/pages/perfect-video-start/VideoGoalPractice';
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
  it('keeps the personal brief when changing goals, editing methods and reopening the practice', () => {
    const storage = 'tavora:perfect-video:project-choice:v1';
    localStorage.removeItem(storage);
    const view = render(<VideoGoalPractice />);
    const choose = (name: string) => fireEvent.click(screen.getByRole('button', { name }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Как се поръчва кутия за подарък?' } });
    choose('Видео за моя бизнес');
    choose('ИИ създава нови кадри');
    expect(screen.getByText(/Тема на клипа — Как се поръчва/).textContent).toContain('хартиени кръга');
    expect(screen.getByRole('link', { name: 'Как се създава видео във Firefly' })).toBeTruthy();
    choose('Монтаж за клиент');
    choose('ИИ монтира мои кадри');
    expect(screen.getByText(/Тема на клипа — Как се поръчва/).textContent).toContain('Подбери ясните дубъли');
    view.unmount();
    render(<VideoGoalPractice />);
    expect(screen.getByRole('button', { name: 'Монтаж за клиент' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'ИИ монтира мои кадри' }).getAttribute('aria-pressed')).toBe('true');
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Как се поръчва кутия за подарък?');
    localStorage.removeItem(storage);
  });
  it('keeps the story exercise closed alongside the optional project topic', () => {
    render(<MemoryRouter><PerfectVideoStartPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Първият ти видеопроект' })).toBeTruthy();
    expect(screen.getAllByRole('textbox')).toEqual([screen.getByRole('textbox', { name: /Моята тема/ })]);
    expect(document.querySelector('input[type=file]')).toBeNull();
    expect(screen.getByText('Празната чаша')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Следващ момент' }));
    expect(screen.getByText('Подготовката')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Първо резултатът' }));
    expect(screen.getByText('Човекът отпива')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Първо резултатът' }).getAttribute('aria-pressed')).toBe('true');
  });
  it('adds a public route and scopes the runtime change to only the three video modules and the existing Silk route', () => {
    expect(readFileSync('src/router/config.tsx', 'utf8')).toContain("path: '/academy-labs/perfect-video/start'");
    for (const module of ['s02-m01', 's02-m02', 's02-m03', 's01-m11']) expect(usesIndependentPractice(module)).toBe(true);
    for (const module of ['s02-m04', 's02-m15', 's03-m01']) expect(usesIndependentPractice(module)).toBe(false);
  });
});
