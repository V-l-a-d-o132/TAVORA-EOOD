// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const api = vi.hoisted(() => ({
  rpc: vi.fn(),
  getUser: vi.fn(),
  upload: vi.fn(),
}));

vi.mock('../src/lib/supabase', () => ({
  supabase: {
    rpc: api.rpc,
    auth: { getUser: api.getUser },
    storage: { from: () => ({ upload: api.upload }) },
  },
}));

import {
  LESSON_BLOCK_TYPES,
  createBlock,
  type JsonObject,
  type LessonBlockV2,
  type LessonV2,
} from '../src/lib/lesson-engine-v2';
import LessonBlockRenderer from '../src/pages/module/components/lesson-v2/LessonBlockRenderer';
import LessonEngineV2 from '../src/pages/module/components/lesson-v2/LessonEngineV2';

const result = {
  attemptId: 'attempt', correct: null, score: 0, maxScore: 0,
  feedback: { complete: true }, progress: null,
};

function lesson(blocks: LessonBlockV2[], progress: LessonV2['progress'] = null): LessonV2 {
  return {
    id: 'lesson-uuid', moduleId: 's01-m01', lessonId: 'l01-01', status: 'published',
    versionId: 'version-uuid', version: 2, title: 'Интерактивен урок', subtitle: 'Практика',
    duration: '10 мин', objective: 'да приложиш принципа', hook: 'Реален проблем', estimatedMinutes: 10,
    sourceKind: 'reference', validation: { errors: [], warnings: [] }, blocks, progress, versionChanged: false,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  api.rpc.mockImplementation(async (name: string) => {
    if (name === 'academy_complete_lesson_block') return { data: result, error: null };
    if (name === 'academy_autosave_lesson') return { data: { saved: true }, error: null };
    return { data: null, error: null };
  });
  api.getUser.mockResolvedValue({ data: { user: { id: 'student' } } });
  api.upload.mockResolvedValue({ error: null });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Lesson Engine V2 block registry', () => {
  it.each(LESSON_BLOCK_TYPES)('renders the %s block with an accessible heading', (type) => {
    const block = createBlock(type, 0);
    render(<LessonBlockRenderer block={block} lessonId="lesson" completed={false} onStateChange={vi.fn()} onSubmit={vi.fn(async () => result)} />);
    expect(screen.getByRole('heading', { name: block.title })).toBeTruthy();
  });

  it('submits a quiz choice and shows immediate server feedback', async () => {
    const block = {
      ...createBlock('quiz', 0),
      content: { question: 'Кой отговор е проверим?', options: [{ id: 'a', label: 'С критерий' }, { id: 'b', label: 'По усещане' }] },
    };
    const submit = vi.fn(async (_payload: JsonObject) => ({ ...result, correct: true, score: 10, maxScore: 10, feedback: { complete: true, explanation: 'Критерият позволява проверка.' } }));
    render(<LessonBlockRenderer block={block} lessonId="lesson" completed={false} onStateChange={vi.fn()} onSubmit={submit} />);
    fireEvent.click(screen.getByRole('button', { name: /С критерий/ }));
    await screen.findByText('Точно така');
    expect(submit).toHaveBeenCalledWith({ answer: 'a' });
    expect(screen.getByText('Критерият позволява проверка.')).toBeTruthy();
  });
});

describe('Lesson Engine V2 learning flow', () => {
  it('resumes on the exact server-saved block', () => {
    const blocks = [createBlock('objective', 0), createBlock('reflection', 1), createBlock('summary', 2)];
    const progress = {
      currentBlockKey: blocks[1].key, blockState: { [blocks[1].key]: { text: 'Запазен отговор' } },
      completedBlockKeys: [blocks[0].key], xp: 5, scorePercent: null, masteryStatus: 'learning' as const,
      completedAt: null, lastActivityAt: '2026-09-20T00:00:00Z',
    };
    render(<LessonEngineV2 moduleId="s01-m01" lessonId="l01-01" userId="student" lessonOverride={lesson(blocks, progress)} />);
    expect(screen.getByRole('heading', { name: blocks[1].title })).toBeTruthy();
    expect(screen.getByDisplayValue('Запазен отговор')).toBeTruthy();
  });

  it('autosaves drafts and supports Alt+Arrow keyboard navigation after completion', async () => {
    vi.useFakeTimers();
    const first = { ...createBlock('reflection', 0), content: { prompt: 'Отговор', minLength: 3 } };
    const second = createBlock('summary', 1);
    render(<LessonEngineV2 moduleId="s01-m01" lessonId="l01-01" userId="student" lessonOverride={lesson([first, second])} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Достатъчно конкретен отговор' } });
    await vi.advanceTimersByTimeAsync(700);
    expect(api.rpc).toHaveBeenCalledWith('academy_autosave_lesson', expect.objectContaining({ p_current_block: first.key }));
    fireEvent.click(screen.getByRole('button', { name: 'Предай отговора' }));
    await vi.runAllTimersAsync();
    fireEvent.keyDown(window, { key: 'ArrowRight', altKey: true });
    expect(screen.getByRole('heading', { name: second.title })).toBeTruthy();
  });

  it('exposes a mobile bottom navigation with visible progress', () => {
    const blocks = [createBlock('objective', 0), createBlock('summary', 1)];
    render(<LessonEngineV2 moduleId="s01-m01" lessonId="l01-01" lessonOverride={lesson(blocks)} />);
    const navigation = screen.getByLabelText('Навигация в урока');
    expect(navigation.className).toContain('fixed');
    expect(screen.getByText('1 / 2')).toBeTruthy();
  });

  it('shows a retry state after a network error and recovers without fallback content', async () => {
    const blocks = [createBlock('objective', 0), createBlock('summary', 1)];
    api.rpc
      .mockResolvedValueOnce({ data: null, error: { message: 'offline' } })
      .mockResolvedValueOnce({ data: lesson(blocks), error: null });
    render(<LessonEngineV2 moduleId="s01-m01" lessonId="l01-01" />);
    await screen.findByText('Връзката прекъсна');
    fireEvent.click(screen.getByRole('button', { name: 'Опитай отново' }));
    await waitFor(() => expect(screen.getByText('Интерактивен урок')).toBeTruthy());
    expect(screen.queryByText('Урок')).toBeNull();
  });

  it('uses a controlled preparing state when published content is missing', () => {
    render(<LessonEngineV2 moduleId="s01-m01" lessonId="missing" lessonOverride={null} />);
    expect(screen.getByText('Урокът се подготвя')).toBeTruthy();
    expect(screen.getByText(/Няма да ти показваме измислен/)).toBeTruthy();
  });
});
