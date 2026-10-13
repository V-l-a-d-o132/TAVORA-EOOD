// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fixture = vi.hoisted(() => ({
  user: { id: 'dashboard-student', email: 'student@example.invalid', user_metadata: { full_name: 'Ученик' } },
  progress: {
    completedLessons: 0, completedModules: 0, totalLessons: 524, totalModules: 46,
    totalPoints: 2, totalQuizCount: 0, totalPracticeCount: 0, allDates: [] as string[],
    resumeTarget: { moduleId: 's01-m01', lessonIndex: 0, lessonTitle: 'Първи урок', sectionTitle: 'Пътят на коприната' },
    isLoading: false, error: false, refetch: vi.fn(),
  },
  levelUp: vi.fn(),
}));
vi.mock('../src/contexts/AuthContext', () => ({ useAuth: () => ({ user: fixture.user }) }));
vi.mock('../src/hooks/useLearningProgress', () => ({ useLearningProgress: () => fixture.progress }));
vi.mock('../src/pages/dashboard/components/DashboardNav', () => ({ default: () => <nav aria-label="Навигация" /> }));
vi.mock('../src/components/feature/LevelUpToast', () => ({ dispatchLevelUp: fixture.levelUp }));
import DashboardPage from '../src/pages/dashboard/page';

function setup() {
  return render(<MemoryRouter initialEntries={['/dashboard']}><Routes>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/module/:moduleId" element={<p>Отворен е запазеният урок</p>} />
    <Route path="/kurs" element={<p>Всички модули</p>} />
  </Routes></MemoryRouter>);
}
beforeEach(() => {
  Object.assign(fixture.progress, { completedLessons: 0, completedModules: 0, totalLessons: 524, totalModules: 46, totalPoints: 2, totalQuizCount: 0, totalPracticeCount: 0, allDates: [], isLoading: false, error: false });
  fixture.user.id = 'dashboard-student';
  fixture.progress.refetch.mockClear(); fixture.levelUp.mockClear();
});
afterEach(cleanup);

describe('Dashboard actions and honest counts', () => {
  it('shows the two successful activity counts without invented percentage bars or homework', () => {
    fixture.progress.totalQuizCount = 7; fixture.progress.totalPracticeCount = 4;
    setup();
    const results = screen.getByRole('region', { name: 'Учебни резултати' });
    expect(within(results).getAllByRole('progressbar')).toHaveLength(2);
    expect(within(results).getByRole('heading', { name: 'Решени проверки' }).parentElement?.textContent).toContain('7');
    expect(within(results).getByRole('heading', { name: 'Практически задачи' }).parentElement?.textContent).toContain('4');
    expect(screen.queryByText('Домашни')).toBeNull();
    expect(screen.getByText('Остават 48 XP до следващото ниво.')).toBeTruthy();
  });
  it('provides a focusable real resume link with the stable lesson and current cursor route', () => {
    setup();
    const resume = screen.getByRole('link', { name: 'Продължи: Първи урок' });
    expect(resume.getAttribute('href')).toBe('/module/s01-m01?lesson=0');
    resume.focus(); expect(document.activeElement).toBe(resume);
    fireEvent.click(resume);
    expect(screen.getByText('Отворен е запазеният урок')).toBeTruthy();
  });
  it('matches the level bar and caption, and only celebrates a new level for the same account', () => {
    fixture.progress.totalPoints = 125;
    const view = render(<MemoryRouter><DashboardPage /></MemoryRouter>);
    const bar = screen.getByRole('progressbar', { name: 'XP в текущото ниво' });
    expect(bar.getAttribute('aria-valuenow')).toBe('75');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
    expect(fixture.levelUp).not.toHaveBeenCalled();
    fixture.progress.totalPoints = 150; view.rerender(<MemoryRouter><DashboardPage /></MemoryRouter>);
    expect(fixture.levelUp).toHaveBeenCalledWith(3, 150);
    fixture.user.id = 'another-student'; fixture.progress.totalPoints = 500;
    view.rerender(<MemoryRouter><DashboardPage /></MemoryRouter>);
    expect(fixture.levelUp).toHaveBeenCalledTimes(1);
  });
  it('makes a failed load retryable and hides result claims during loading', () => {
    fixture.progress.error = true; setup();
    fireEvent.click(screen.getByRole('button', { name: 'Опитай пак' }));
    expect(fixture.progress.refetch).toHaveBeenCalledOnce();
    expect(screen.queryByRole('link', { name: /Продължи:/ })).toBeNull();
    cleanup(); fixture.progress.error = false; fixture.progress.isLoading = true; setup();
    expect(screen.getByRole('status', { name: 'Зареждане на напредъка' })).toBeTruthy();
    expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
    expect(screen.queryByRole('heading', { name: 'Твоите значки' })).toBeNull();
  });
});
