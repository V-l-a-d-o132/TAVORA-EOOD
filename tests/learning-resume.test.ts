// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bookmarkStorageKey, parseBookmark, readLocalBookmark, recordLessonVisit } from '../src/lib/learning-resume';
import { LEARNING_SECTIONS } from '../src/mocks/learning-platform';

const api = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('../src/lib/supabase', () => ({ supabase: { rpc: api.rpc } }));
beforeEach(() => { localStorage.clear(); api.rpc.mockReset(); });

describe('stable, account-scoped lesson bookmarks', () => {
  it('resolves stable lesson IDs rather than stale array indices', () => {
    expect(parseBookmark({ moduleId: 's01-m01', lessonId: 'l01-04', lessonIndex: 0, timestamp: '2026-10-01' })).toMatchObject({ lessonId: 'l01-04' });
    const title = LEARNING_SECTIONS[0].modules[0].lessons[2].title;
    expect(parseBookmark({ moduleId: 's01-m01', lessonIndex: 2, lessonTitle: title, timestamp: '2026-10-01' })).toMatchObject({ lessonId: 'l01-03' });
    expect(parseBookmark({ moduleId: 's01-m01', lessonIndex: 2, lessonTitle: 'Old title', timestamp: '2026-10-01' })).toBeNull();
    expect(parseBookmark({ moduleId: 's01-m01', lessonId: 'l01-04', timestamp: 'broken' })).toBeNull();
  });

  it('serializes rapid navigation so an old response cannot overwrite the latest lesson', async () => {
    let resolveFirst!: (value: unknown) => void;
    api.rpc.mockImplementationOnce(() => new Promise(resolve => { resolveFirst = resolve; }))
      .mockResolvedValueOnce({ data: { moduleId: 's01-m01', lessonId: 'l01-04', timestamp: '2026-10-01T13:00:00Z' }, error: null });
    const first = recordLessonVisit('student-a', 's01-m01', 'l01-01');
    await Promise.resolve(); await Promise.resolve();
    const next = recordLessonVisit('student-a', 's01-m01', 'l01-04');
    expect(api.rpc).toHaveBeenCalledTimes(1);
    resolveFirst({ data: { moduleId: 's01-m01', lessonId: 'l01-01', timestamp: '2026-10-01T12:00:00Z' }, error: null });
    await Promise.all([first, next]);
    expect(api.rpc.mock.calls.map(call => call[1].p_lesson)).toEqual(['l01-01', 'l01-04']);
    expect(readLocalBookmark('student-a')?.lessonId).toBe('l01-04');
    expect(readLocalBookmark('student-b')).toBeNull();
    expect(localStorage.getItem(bookmarkStorageKey('student-b'))).toBeNull();
  });

  it('reports a failed remote save, retains only that users local position, and allows a retry', async () => {
    api.rpc.mockResolvedValueOnce({ data: null, error: new Error('offline') }).mockResolvedValueOnce({ data: null, error: null });
    await expect(recordLessonVisit('student', 's01-m01', 'l01-02')).rejects.toThrow('offline');
    expect(readLocalBookmark('student')?.lessonId).toBe('l01-02');
    await expect(recordLessonVisit('student', 's01-m01', 'l01-02')).resolves.toBeUndefined();
    expect(api.rpc).toHaveBeenLastCalledWith('academy_record_lesson_visit', { p_user: 'student', p_module: 's01-m01', p_lesson: 'l01-02' });
  });
});
