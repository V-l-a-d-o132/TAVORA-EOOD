import { afterEach, describe, expect, it, vi } from 'vitest';
import { LessonDraftQueue } from '../src/lib/lesson-draft-queue';

afterEach(() => vi.useRealTimers());

describe('lesson draft persistence', () => {
  it('keeps edits from every block when navigation happens before the debounce', async () => {
    vi.useFakeTimers();
    const persist = vi.fn().mockResolvedValue({});
    const queue = new LessonDraftQueue(persist, vi.fn());
    queue.enqueue('notes', { text: 'Моето решение' });
    queue.enqueue('next');
    await queue.flush();
    expect(persist).toHaveBeenCalledExactlyOnceWith('next', { notes: { text: 'Моето решение' } });
    await vi.runAllTimersAsync();
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('serializes in-flight writes so the newest edit is persisted last', async () => {
    vi.useFakeTimers();
    let finish!: () => void;
    const persist = vi.fn().mockImplementationOnce(() => new Promise<void>((resolve) => { finish = resolve; })).mockResolvedValue({});
    const queue = new LessonDraftQueue(persist, vi.fn());
    queue.enqueue('notes', { text: 'Първи вариант' });
    const first = queue.flush();
    queue.enqueue('notes', { text: 'Втори вариант' });
    const second = queue.flush();
    expect(persist).toHaveBeenCalledTimes(1);
    finish();
    await Promise.all([first, second]);
    expect(persist).toHaveBeenLastCalledWith('notes', { notes: { text: 'Втори вариант' } });
  });

  it('retains failed text and retries the latest edit', async () => {
    const persist = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue({});
    const status = vi.fn();
    const queue = new LessonDraftQueue(persist, status);
    queue.enqueue('notes', { text: 'Първи вариант' });
    expect(await queue.flush()).toBe(false);
    expect(status).toHaveBeenLastCalledWith('error');
    queue.enqueue('notes', { text: 'Поправен вариант' });
    queue.enqueue('next');
    expect(await queue.flush()).toBe(true);
    expect(persist).toHaveBeenLastCalledWith('next', { notes: { text: 'Поправен вариант' } });
  });

  it('flushes rather than cancelling a pending note when leaving the lesson', async () => {
    const persist = vi.fn().mockResolvedValue({});
    const queue = new LessonDraftQueue(persist, vi.fn());
    queue.enqueue('notes', { text: 'Запази и при излизане' });
    queue.dispose();
    await Promise.resolve();
    expect(persist).toHaveBeenCalledExactlyOnceWith('notes', { notes: { text: 'Запази и при излизане' } });
  });
});
