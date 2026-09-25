// @vitest-environment jsdom
import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fixture = vi.hoisted(() => ({
  legacy: [] as Array<Record<string, unknown>>,
  current: [] as Array<Record<string, unknown>>,
  error: null as null | { message: string },
}));
vi.mock('../src/lib/supabase', () => ({ supabase: {
  rpc: async () => ({ data: fixture.current, error: fixture.error }),
  from: (table: string) => {
    const response = { data: table === 'pdf_progress' ? fixture.legacy : [], count: 0, error: null };
    const query = {
      select: () => query,
      eq: () => query,
      in: () => query,
      then: (resolve: (value: typeof response) => void) => Promise.resolve(response).then(resolve),
    };
    return query;
  },
} }));
vi.mock('../src/contexts/AuthContext', () => ({ useAuth: () => ({ hasFullAccess: true, unlockedModules: [] }) }));
import { useLearningProgress } from '../src/hooks/useLearningProgress';

beforeEach(() => { fixture.legacy = []; fixture.current = []; fixture.error = null; });
afterEach(cleanup);

describe('Silk Road dashboard progress', () => {
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
  });

  it('reports an error instead of silently trusting legacy completion when the current report fails', async () => {
    fixture.legacy = [{ module_id: 's01-m01', lesson_id: 'l01-01', completed: true }];
    fixture.error = { message: 'offline' };
    const { result } = renderHook(() => useLearningProgress('report-student-2'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe(true);
    expect(result.current.completedLessons).toBe(0);
  });
});
