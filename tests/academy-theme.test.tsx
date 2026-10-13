// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const auth = vi.hoisted(() => ({ user: { id: 'theme-student' } as { id: string } | null }));
vi.mock('../src/contexts/AuthContext', () => ({ useAuth: () => auth }));
import { AcademyThemeProvider, AcademyThemeScope } from '../src/contexts/AcademyThemeContext';
import { useAcademyTheme } from '../src/contexts/academy-theme-state';
import ThemeSelector from '../src/components/academy/ThemeSelector';
import LessonBlockRenderer from '../src/pages/module/components/lesson-v2/LessonBlockRenderer';
import { academyThemeStorageKey } from '../src/lib/academy-theme';
import type { LessonBlockV2 } from '../src/lib/lesson-engine-v2';
vi.mock('../src/lib/supabase', () => ({ supabase: {} }));

let systemDark = false;
let mediaChanged: (() => void) | undefined;
beforeEach(() => {
  localStorage.clear(); auth.user = { id: 'theme-student' }; systemDark = false;
  vi.stubGlobal('matchMedia', () => ({
    get matches() { return systemDark; },
    addEventListener: (_name: string, callback: () => void) => { mediaChanged = callback; },
    removeEventListener: () => { mediaChanged = undefined; },
  }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

function ThemeProbe() {
  const { preference, theme } = useAcademyTheme();
  return <p data-testid="choice">{preference}/{theme}</p>;
}
function tree(child: React.ReactNode = null, path = '/dashboard') {
  return <MemoryRouter initialEntries={[path]}><AcademyThemeProvider><AcademyThemeScope>
    <ThemeSelector /><ThemeProbe />{child}
  </AcademyThemeScope></AcademyThemeProvider></MemoryRouter>;
}
function choose(label: string) {
  if (!screen.queryByRole('radio', { name: label })) fireEvent.click(screen.getByRole('button', { name: /^Тема:/ }));
  fireEvent.click(screen.getByRole('radio', { name: label }));
}

describe('Academy theme preferences and isolation', () => {
  it('keeps an explicit choice across reload and does not override it when the OS changes', () => {
    render(tree()); choose('Светла');
    expect(screen.getByTestId('choice').textContent).toBe('light/light');
    expect(localStorage.getItem(academyThemeStorageKey(auth.user!.id))).toBe('light');
    act(() => { systemDark = true; mediaChanged?.(); });
    expect(screen.getByTestId('choice').textContent).toBe('light/light');
    cleanup(); render(tree());
    expect(screen.getByTestId('choice').textContent).toBe('light/light');
  });
  it('follows live device changes only in automatic mode', () => {
    render(tree()); choose('По устройството');
    expect(screen.getByTestId('choice').textContent).toBe('system/light');
    act(() => { systemDark = true; mediaChanged?.(); });
    expect(screen.getByTestId('choice').textContent).toBe('system/dark');
    act(() => { systemDark = false; mediaChanged?.(); });
    expect(screen.getByTestId('choice').textContent).toBe('system/light');
  });
  it('keeps guest and different accounts separate without a frame of the previous selection', () => {
    const view = render(tree()); choose('Светла');
    auth.user = { id: 'another-student' }; view.rerender(tree());
    expect(screen.getByTestId('choice').textContent).toBe('dark/dark');
    auth.user = null; view.rerender(tree());
    expect(screen.getByTestId('choice').textContent).toBe('dark/dark');
    auth.user = { id: 'theme-student' }; view.rerender(tree());
    expect(screen.getByTestId('choice').textContent).toBe('light/light');
  });
  it('handles another tab changing or clearing the current selection', () => {
    render(tree());
    const key = academyThemeStorageKey(auth.user!.id);
    localStorage.setItem(key, 'light');
    act(() => window.dispatchEvent(new StorageEvent('storage', { key })));
    expect(screen.getByTestId('choice').textContent).toBe('light/light');
    localStorage.clear(); act(() => window.dispatchEvent(new StorageEvent('storage', { key: null })));
    expect(screen.getByTestId('choice').textContent).toBe('dark/dark');
  });
  it('works with unavailable storage and ignores invalid stored preferences', () => {
    localStorage.setItem(academyThemeStorageKey(auth.user!.id), 'invalid');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage blocked'); });
    render(tree()); choose('Светла');
    expect(screen.getByTestId('choice').textContent).toBe('light/light');
  });
  it('scopes theme colors to learning routes and keeps the menu keyboard dismissible', () => {
    render(tree(null, '/'));
    expect(document.querySelector('[data-academy-theme]')).toBeNull();
    const trigger = screen.getByRole('button', { name: 'Тема: Тъмна' });
    fireEvent.click(trigger); choose('Светла');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('radio', { name: 'Светла' })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('keeps the selected answer and feedback while switching theme, without resubmitting', async () => {
    const block: LessonBlockV2 = { id: 'synthetic-quiz', key: 'demo-quiz', position: 1, type: 'quiz', title: 'Пробна проверка', required: true, points: 0,
      content: { question: 'Кой избор трябва да се провери?', options: [{ id: 'demo-a', label: 'Пробен избор А' }, { id: 'demo-b', label: 'Пробен избор Б' }] } };
    const submit = vi.fn(async () => ({ attemptId: 'synthetic-attempt', correct: false, score: 0, maxScore: 1, feedback: { complete: false, explanation: 'Учебна обратна връзка.' }, progress: null }));
    const state = vi.fn();
    render(tree(<LessonBlockRenderer block={block} lessonId="demo-lesson" completed={false} onStateChange={state} onSubmit={submit} />));
    await act(async () => fireEvent.click(screen.getByRole('button', { name: /Пробен избор А/ })));
    expect(screen.getByRole('status').textContent).toContain('Учебна обратна връзка.');
    choose('Светла'); choose('Тъмна');
    expect(screen.getByRole('button', { name: /Пробен избор А/ }).className).toContain('academy-accent-bg');
    expect(screen.getByRole('status').textContent).toContain('Учебна обратна връзка.');
    expect(submit).toHaveBeenCalledOnce(); expect(state).toHaveBeenCalledOnce();
  });
});
