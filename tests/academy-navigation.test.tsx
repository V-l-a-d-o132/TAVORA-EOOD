// @vitest-environment jsdom
import React, { Profiler, Suspense, lazy } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';

const api = vi.hoisted(() => ({
  rpc: vi.fn(),
  updateProfile: vi.fn(),
  unlockedModules: [] as string[],
  user: { id: 'student', email: 'student@example.com', user_metadata: { full_name: 'Ученик' } } as Record<string, unknown> | null,
  access: true,
  accessError: false,
  progress: [] as Array<Record<string, unknown>>,
  progressRequest: null as null | Promise<{ data: unknown[]; error: null }>,
}));
vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: api.user, loading: false, signOut: vi.fn(), hasFullAccess: true, unlockedModules: api.unlockedModules, refreshProfile: vi.fn() }),
}));
vi.mock('../src/lib/supabase', () => ({
  supabase: {
    rpc: api.rpc,
    from: () => ({ update: (payload: unknown) => ({ eq: () => { api.updateProfile(payload); return Promise.resolve({ error: null }); } }) }),
    storage: { from: () => ({ createSignedUrl: async () => ({ data: { signedUrl: '' }, error: null }) }) },
  },
}));
vi.mock('../src/lib/metaPixel', () => ({ academyPixel: { viewContent: vi.fn() } }));
vi.mock('../src/pages/module/components/PdfPresentationViewer', () => ({ default: () => null }));
vi.mock('../src/hooks/useLearningProgress', () => ({ useLearningProgress: () => ({
  completedLessons: 0, completedModules: 0, totalLessons: 74, totalModules: 11,
  totalPoints: 0, totalQuizCount: 0, homeworkCount: 0, allDates: [], resumeTarget: null,
  isLoading: false, error: false, refetch: vi.fn(),
}) }));

import ModulePage from '../src/pages/module/page';
import DashboardPage from '../src/pages/dashboard/page';
import ProtectedRoute from '../src/components/feature/ProtectedRoute';
import { findModule } from '../src/pages/module/utils';

const student = { id: 'student', email: 'student@example.com', user_metadata: { full_name: 'Ученик' } };
function lessonTitle(moduleId: string, index: number) { return findModule(moduleId)!.mod.lessons[index].title; }
function RouterControls() {
  const navigate = useNavigate();
  return <aside aria-label="Test controls">
    <button onClick={() => navigate(-1)}>History back</button>
    <button onClick={() => navigate(1)}>History forward</button>
    <button onClick={() => navigate('/module/s01-m02')}>Other module</button>
  </aside>;
}
function setup(path = '/module/s01-m01', dashboard: React.ReactNode = <DashboardPage />) {
  let commits = 0;
  render(<MemoryRouter initialEntries={[path]}><Profiler id="academy" onRender={() => {
    commits += 1;
    // Fail immediately if the old progress callback loop returns, instead of hanging the test run.
    if (commits > 80) throw new Error('Lesson progress caused an endless render loop');
  }}><Suspense fallback={<p>Зареждане на таблото</p>}><Routes>
    <Route path="/module/:moduleId" element={<ProtectedRoute><ModulePage /></ProtectedRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute>{dashboard}</ProtectedRoute>} />
    <Route path="/kurs" element={<main>Всички учебни модули</main>} />
    <Route path="/login" element={<main>Вход в акаунта</main>} />
  </Routes></Suspense></Profiler><RouterControls /></MemoryRouter>);
  return { commits: () => commits };
}

beforeEach(() => {
  vi.clearAllMocks();
  api.user = student;
  api.access = true;
  api.accessError = false;
  api.progress = [];
  api.progressRequest = null;
  window.scrollTo = vi.fn();
  HTMLElement.prototype.scrollIntoView = vi.fn();
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
  api.rpc.mockImplementation(async (name: string, params: Record<string, string>) => {
    if (name === 'academy_has_module_access') return { data: api.access, error: api.accessError ? { message: 'offline' } : null };
    if (name === 'academy_get_module_progress') return api.progressRequest || { data: api.progress, error: null };
    if (name === 'academy_get_lesson_v2') {
      const metadata = findModule(params.p_module)!.mod.lessons.find(lesson => lesson.id === params.p_lesson)!;
      return { data: {
        id: metadata.id, moduleId: params.p_module, lessonId: metadata.id, versionId: `v-${metadata.id}`, version: 1,
        title: metadata.title, subtitle: 'Учебен пример', duration: 'Четене и задача', objective: 'Подготви проверим резултат.',
        blocks: [{ id: 'reading', key: 'reading', type: 'rich_text', title: 'Работен пример', points: 5, required: true, content: { body: 'Подготви инструкция и сравни резултата с източника.' } }],
        progress: null,
      }, error: null };
    }
    return { data: [], error: null };
  });
});
afterEach(() => { cleanup(); document.body.style.overflow = ''; });

describe('real academy lesson navigation', () => {
  it.each(['s01-m01', 's02-m01', 's03-m01'])('settles progress in %s and leaves the real lesson for the dashboard', async (moduleId) => {
    const page = setup(`/module/${moduleId}`);
    await screen.findByRole('heading', { level: 1, name: lessonTitle(moduleId, 0) });
    await act(async () => { await Promise.resolve(); });
    const settled = page.commits();
    await act(async () => { await Promise.resolve(); });
    expect(page.commits()).toBe(settled);
    fireEvent.click(screen.getByRole('link', { name: 'Табло', exact: true }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Ученик' })).toBeTruthy();
    expect(screen.queryByTestId('lesson-engine-v2')).toBeNull();
  });

  it('does not open lessons on a quick touch scroll; selecting the current lesson closes the sheet', async () => {
    setup();
    const heading = await screen.findByRole('heading', { level: 1 });
    fireEvent.touchStart(heading, { touches: [{ clientY: 600 }] });
    fireEvent.touchEnd(heading, { changedTouches: [{ clientY: 120 }] });
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Уроци в модула' }));
    const sheet = screen.getByRole('dialog');
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.click(within(sheet).getByRole('button', { name: new RegExp(lessonTitle('s01-m01', 0)) }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('exits to the dashboard from the sheet and releases the page scroll', async () => {
    setup();
    await screen.findByRole('heading', { level: 1 });
    fireEvent.click(screen.getByRole('button', { name: 'Уроци в модула' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('link', { name: 'Към таблото' }));
    await screen.findByRole('heading', { level: 1, name: 'Ученик' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('honors a direct lesson link for an anonymous preview', async () => {
    api.user = null;
    setup('/module/s01-m01?lesson=2');
    await screen.findByRole('heading', { level: 1, name: lessonTitle('s01-m01', 2) });
    fireEvent.click(screen.getByRole('link', { name: 'Табло' }));
    await screen.findByText('Вход в акаунта');
    expect(screen.queryByTestId('lesson-engine-v2')).toBeNull();
  });

  it('keeps displayed lessons in sync with browser Back and Forward', async () => {
    setup('/module/s01-m01?lesson=0');
    await screen.findByRole('heading', { level: 1, name: lessonTitle('s01-m01', 0) });
    fireEvent.click(within(screen.getByRole('complementary', { name: '' })).getByRole('button', { name: new RegExp(lessonTitle('s01-m01', 1)) }));
    await screen.findByRole('heading', { level: 1, name: lessonTitle('s01-m01', 1) });
    fireEvent.click(screen.getByRole('button', { name: 'History back' }));
    await screen.findByRole('heading', { level: 1, name: lessonTitle('s01-m01', 0) });
    fireEvent.click(screen.getByRole('button', { name: 'History forward' }));
    await screen.findByRole('heading', { level: 1, name: lessonTitle('s01-m01', 1) });
  });

  it('resumes independently when switching to another module', async () => {
    setup('/module/s01-m01?lesson=3');
    await screen.findByRole('heading', { level: 1, name: lessonTitle('s01-m01', 3) });
    api.progress = [{ lessonId: 'l02-01', completed: true }];
    fireEvent.click(screen.getByRole('button', { name: 'Other module' }));
    await screen.findByRole('heading', { level: 1, name: lessonTitle('s01-m02', 1) });
  });

  it('does not override an explicit lesson selection when progress arrives late', async () => {
    let resolve!: (value: { data: unknown[]; error: null }) => void;
    api.progressRequest = new Promise(done => { resolve = done; });
    setup();
    await screen.findByRole('heading', { level: 1 });
    fireEvent.click(within(screen.getByRole('complementary', { name: '' })).getByRole('button', { name: new RegExp(lessonTitle('s01-m01', 2)) }));
    await screen.findByRole('heading', { level: 1, name: lessonTitle('s01-m01', 2) });
    await act(async () => { resolve({ data: [{ lessonId: 'l01-01', completed: true }], error: null }); });
    expect(screen.getByRole('heading', { level: 1, name: lessonTitle('s01-m01', 2) })).toBeTruthy();
  });

  it('does not let a profile menu cover the dashboard link', async () => {
    setup();
    await screen.findByRole('heading', { level: 1 });
    fireEvent.click(screen.getByRole('button', { name: 'Меню на профила' }));
    expect(screen.getByRole('button', { name: 'Излез от акаунта' })).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: 'Табло' }));
    await screen.findByRole('heading', { level: 1, name: 'Ученик' });
    expect(screen.queryByRole('button', { name: 'Излез от акаунта' })).toBeNull();
  });

  it('can render a lazily loaded dashboard after leaving the real lesson', async () => {
    let finish!: (value: { default: typeof DashboardPage }) => void;
    const LazyDashboard = lazy(() => new Promise<{ default: typeof DashboardPage }>(resolve => { finish = resolve; }));
    setup('/module/s01-m01', <LazyDashboard />);
    await screen.findByRole('heading', { level: 1 });
    fireEvent.click(screen.getByRole('link', { name: 'Табло' }));
    await waitFor(() => expect(finish).toBeTypeOf('function'));
    await act(async () => { finish({ default: DashboardPage }); });
    await screen.findByRole('heading', { level: 1, name: 'Ученик' });
    expect(screen.queryByTestId('lesson-engine-v2')).toBeNull();
  });

  it('shows an access-check error instead of selling access again when the request fails', async () => {
    api.accessError = true;
    setup('/module/s01-m02');
    await screen.findByText('Не успяхме да проверим достъпа ти. Опитай отново.');
    expect(screen.getByRole('button', { name: 'Опитай отново' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Отключи/ })).toBeNull();
  });

  it('dismisses the lesson dialog on native Escape cancellation', async () => {
    setup();
    await screen.findByRole('heading', { level: 1 });
    fireEvent.click(screen.getByRole('button', { name: 'Уроци в модула' }));
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { bubbles: false }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it.each([['s01-m10', 's01-m11'], ['s02-m01', 's02-m02'], ['s03-m01', 's03-m02']])('offers the next module within the same course after completing %s', async (moduleId, nextModuleId) => {
    api.progress = findModule(moduleId)!.mod.lessons.map(lesson => ({ lessonId: lesson.id, completed: true }));
    setup(`/module/${moduleId}`);
    const link = await screen.findByRole('link', { name: `Следващ модул: ${findModule(nextModuleId)!.mod.title}` });
    expect(link.getAttribute('href')).toBe(`/module/${nextModuleId}`);
    fireEvent.click(link);
    await screen.findByRole('heading', { level: 1, name: lessonTitle(nextModuleId, 0) });
  });

  it.each(['s01-m11', 's02-m15', 's03-m20'])('finishes %s at the dashboard without sending the learner into a different paid program', async (moduleId) => {
    api.progress = findModule(moduleId)!.mod.lessons.map(lesson => ({ lessonId: lesson.id, completed: true }));
    setup(`/module/${moduleId}`);
    const link = await screen.findByRole('link', { name: 'Към таблото с напредъка' });
    expect(link.getAttribute('href')).toBe('/dashboard');
    expect(screen.queryByRole('link', { name: /Следващ модул/ })).toBeNull();
  });
});
