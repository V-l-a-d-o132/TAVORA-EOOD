// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fixture = vi.hoisted(() => ({
  legacy: [] as Array<Record<string, unknown>>,
  current: [] as Array<Record<string, unknown>>,
  error: null as null | { message: string },
  bookmark: null as unknown,
  homeworkCount: 0,
  fullAccess: true,
  calls: [] as string[],
}));
vi.mock('../src/lib/supabase', () => ({ supabase: {
  rpc: async (name: string) => { fixture.calls.push(name); return { data: fixture.current, error: fixture.error }; },
  from: (table: string) => {
    const response = { data: table === 'profiles' ? { last_opened_lesson: fixture.bookmark } : table === 'pdf_progress' ? fixture.legacy : [], count: fixture.homeworkCount, error: null };
    const query = {
      select: () => query,
      eq: () => query,
      in: () => query,
      maybeSingle: () => Promise.resolve(response),
      then: (resolve: (value: typeof response) => void) => Promise.resolve(response).then(resolve),
    };
    return query;
  },
} }));
vi.mock('../src/contexts/AuthContext', () => ({ useAuth: () => ({ hasFullAccess: fixture.fullAccess, unlockedModules: [] }) }));
import { useLearningProgress } from '../src/hooks/useLearningProgress';
import { bookmarkStorageKey, notifyLearningProgressChanged } from '../src/lib/learning-resume';
import { LEARNING_SECTIONS } from '../src/mocks/learning-platform';

beforeEach(() => { localStorage.clear(); fixture.legacy = []; fixture.current = []; fixture.error = null; fixture.bookmark = null; fixture.homeworkCount = 0; fixture.fullAccess = true; fixture.calls = []; });
afterEach(cleanup);

describe('Unified academy dashboard progress', () => {
  it('uses current results, actual XP and the first unfinished lesson, including out-of-order completion', async () => {
    fixture.legacy = [{ module_id: 's01-m01', lesson_id: 'l01-01', completed: true, quiz_score: 100 }];
    fixture.current = [
      { module_id: 's01-m01', lesson_id: 'l01-01', completed: false, quiz_score: null, xp: 0 },
      { module_id: 's01-m01', lesson_id: 'l01-04', completed: true, quiz_score: 100, xp: 70 },
    ];
    const { result } = renderHook(() => useLearningProgress('report-student-1'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.completedLessons).toBe(1);
    expect(result.current.totalPoints).toBe(70);
    expect(result.current.resumeTarget).toMatchObject({ moduleId: 's01-m01', lessonIndex: 0 });
    expect(result.current.modProgressMap['s01-m01'].completedLessonIds).toEqual(['l01-04']);
    expect(fixture.calls).toContain('academy_get_learning_progress');
  });

  it('reports an error instead of silently trusting legacy completion when the current report fails', async () => {
    fixture.legacy = [{ module_id: 's01-m01', lesson_id: 'l01-01', completed: true }];
    fixture.error = { message: 'offline' };
    const { result } = renderHook(() => useLearningProgress('report-student-2'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe(true);
    expect(result.current.completedLessons).toBe(0);
  });

  it('sums real XP including partial lessons in all three courses, without legacy or homework bonuses', async () => {
    fixture.current = LEARNING_SECTIONS.map((section, index) => ({
      module_id: section.modules[0].id, lesson_id: section.modules[0].lessons[0].id,
      completed: index !== 2, quiz_score: 100, xp: [70, 28, 13][index],
    }));
    fixture.legacy = fixture.current.map(row => ({ ...row, completed: true }));
    fixture.homeworkCount = 4;
    const { result } = renderHook(() => useLearningProgress('real-xp'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.totalPoints).toBe(111);
    expect(result.current.completedLessons).toBe(2);
    expect(result.current.homeworkCount).toBe(4);
  });

  it('resumes the server bookmark on another device even with earlier gaps and zero completed lessons', async () => {
    const mod = LEARNING_SECTIONS[2].modules[5];
    fixture.bookmark = { moduleId: mod.id, lessonId: mod.lessons[7].id, timestamp: '2026-10-01T12:00:00Z' };
    const { result } = renderHook(() => useLearningProgress('bookmark-student'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.completedLessons).toBe(0);
    expect(result.current.resumeTarget).toMatchObject({ moduleId: mod.id, lessonIndex: 7 });
  });

  it('prefers the newer device bookmark and ignores locked or invalid targets', async () => {
    const mod = LEARNING_SECTIONS[2].modules[5];
    fixture.bookmark = { moduleId: mod.id, lessonId: mod.lessons[1].id, timestamp: '2026-10-01T12:00:00Z' };
    localStorage.setItem(bookmarkStorageKey('same-user'), JSON.stringify({ moduleId: mod.id, lessonId: mod.lessons[3].id, timestamp: '2026-10-01T11:00:00Z' }));
    const { result, rerender } = renderHook(() => useLearningProgress('same-user'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.resumeTarget).toMatchObject({ moduleId: mod.id, lessonIndex: 1 });
    fixture.fullAccess = false;
    rerender();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.resumeTarget?.moduleId).toBe('s01-m01');
  });

  it('uses recent activity only as a fallback when no valid bookmark exists', async () => {
    const mod = LEARNING_SECTIONS[1].modules[1];
    fixture.current = [{ module_id: mod.id, lesson_id: mod.lessons[4].id, completed: false, xp: 9, updated_at: '2026-10-01T12:00:00Z' }];
    fixture.bookmark = { moduleId: mod.id, lessonId: 'removed', timestamp: '2026-10-01T13:00:00Z' };
    const { result } = renderHook(() => useLearningProgress('activity-student'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.resumeTarget).toMatchObject({ moduleId: mod.id, lessonIndex: 4 });
  });

  it('refreshes immediately after progress changes and on return, without the old 30-second cache', async () => {
    const { result, unmount } = renderHook(() => useLearningProgress('fresh-student'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    fixture.current = [{ module_id: 's01-m01', lesson_id: 'l01-01', completed: false, xp: 12 }];
    act(() => notifyLearningProgressChanged('fresh-student'));
    await waitFor(() => expect(result.current.totalPoints).toBe(12));
    unmount();
    fixture.current[0].xp = 20;
    const again = renderHook(() => useLearningProgress('fresh-student'));
    await waitFor(() => expect(again.result.current.totalPoints).toBe(20));
  });

  it('never restores a different account or the old shared local bookmark', async () => {
    localStorage.setItem('tavora_last_opened_lesson', JSON.stringify({ moduleId: 's01-m01', lessonIndex: 3, timestamp: '2026-10-01T13:00:00Z' }));
    localStorage.setItem(bookmarkStorageKey('user-a'), JSON.stringify({ moduleId: 's01-m01', lessonId: 'l01-04', timestamp: '2026-10-01T12:00:00Z' }));
    const { result, rerender } = renderHook(({ id }) => useLearningProgress(id), { initialProps: { id: 'user-a' } });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.resumeTarget?.lessonIndex).toBe(3);
    rerender({ id: 'user-b' });
    expect(result.current.totalPoints).toBe(0);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.resumeTarget?.lessonIndex).toBe(0);
  });
});
