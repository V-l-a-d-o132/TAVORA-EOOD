// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

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
import { readFileSync } from 'node:fs';
import LessonOutcomes from '../src/pages/module/components/lesson-v2/LessonOutcomes';

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
  localStorage.clear();
  HTMLElement.prototype.scrollIntoView = vi.fn();
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
  it('renders all 53 AI and MCP Marketing Basics opening pages with three skills, deliverable and check', () => {
    const specs = JSON.parse(readFileSync('scripts/marketing-basics/releases/modules-11-15-20261007.json','utf8')) as {
      blocks:{type:string;content:JsonObject}[];
    }[];
    expect(specs).toHaveLength(53);
    for (const spec of specs) {
      const content = spec.blocks.find(b=>b.type==='objective')!.content;
      const page = render(<LessonOutcomes content={content} />);
      expect(page.container.textContent).toContain(content.body);
      expect(page.getAllByRole('listitem')).toHaveLength(3);
      expect(page.getByRole('heading',{name:'Практически резултат'})).toBeTruthy();
      expect(page.container.textContent).toContain(content.deliverable);
      expect(page.container.textContent).toContain(content.check);
      page.unmount();
    }
  });
  it('renders all 62 Marketing Basics opening pages with skills, a practical result and a check', () => {
    const specs = JSON.parse(readFileSync('scripts/marketing-basics/releases/modules-6-10-20261007.json','utf8')) as {
      module:string; blocks:{type:string;content:JsonObject}[];
    }[];
    const lessons = specs.filter(s=>Number(s.module.slice(-2))>=6);
    expect(lessons).toHaveLength(62);
    for (const spec of lessons) {
      const content = spec.blocks.find(b=>b.type==='objective')!.content;
      const page = render(<LessonOutcomes content={content} />);
      expect(page.container.textContent).toContain(content.body);
      expect(page.getAllByRole('listitem')).toHaveLength(3);
      expect(page.getByRole('heading',{name:'Практически резултат'})).toBeTruthy();
      expect(page.container.textContent).toContain(content.deliverable);
      expect(page.container.textContent).toContain(content.check);
      page.unmount();
    }
  });
  it('shows the opening once with practical outcomes and a check, including legacy paragraphs', () => {
    const block = { ...createBlock('objective', 0), key: 'objective', title: 'Какво ще можеш след урока', content: {
      body: 'Разбираш каква е задачата.\n\nПроверяваш действителния резултат.',
      outcomes: ['Описваш проблема.', 'Проверяваш условията.', 'Разпознаваш грешката.'],
      deliverable: 'План и проверен учебен запис.', check: 'Сравняваш обещанието с получения запис.',
    } };
    render(<LessonEngineV2 moduleId="s01-m01" lessonOverride={{ ...lesson([block]), objective: 'Разбираш каква е задачата.' }} onNextLesson={vi.fn()} hasNextLesson={false} />);
    expect(screen.getAllByRole('heading', { name: 'Какво ще можеш след урока' })).toHaveLength(1);
    expect(screen.getAllByText('Разбираш каква е задачата.')).toHaveLength(1);
    expect(screen.getByRole('list', { name: 'Умения в този урок' }).querySelectorAll('li')).toHaveLength(3);
    expect(screen.getByText('План и проверен учебен запис.')).toBeTruthy();
    expect(screen.getByText('Сравняваш обещанието с получения запис.')).toBeTruthy();
    expect(screen.getByText('Проверяваш действителния резултат.').tagName).toBe('P');
  });

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

  it.each(['s01-m11', 's02-m01', 's02-m02', 's02-m03'])('accepts a Bulgarian decimal comma in %s without changing the resumed input', async (moduleId) => {
    const block = { ...createBlock('calculator', 0), content: { label: 'Принос в евро', prompt: 'Изчисли приноса.' } };
    const save = vi.fn();
    const submit = vi.fn(async () => result);
    render(<LessonBlockRenderer block={block} moduleId={moduleId} lessonId="l11-04" completed={false} onStateChange={save} onSubmit={submit} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Принос в евро' }), { target: { value: '1320,00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Изчисли и провери' }));
    await waitFor(() => expect(submit).toHaveBeenCalledWith({ value: '1320.00' }));
    expect(save).toHaveBeenCalledWith({ value: '1320,00' });
  });
});

describe('compatible first video practice', () => {
  it('keeps old completion and XP while showing the new check as not yet passed', () => {
    const opening = { ...createBlock('objective', 0), key: 'objective' };
    const check = { ...createBlock('scenario', 1), key: 'checkpoint_video_handoff_20261003', title: 'Нова проверка', required: false, points: 0 };
    const progress = { currentBlockKey: opening.key, blockState: {}, completedBlockKeys: [opening.key], xp: 28, scorePercent: 100, masteryStatus: 'mastered' as const, completedAt: '2026-10-02', lastActivityAt: null };
    render(<LessonEngineV2 moduleId="s02-m03" lessonOverride={{ ...lesson([opening, check], progress), moduleId: 's02-m03', lessonId: 'pv03-21' }} />);
    expect(screen.getByText('28 XP')).toBeTruthy();
    expect(screen.getByText('100% · 1/1 задължителни стъпки')).toBeTruthy();
    expect(screen.getByText('още няма премината проверка')).toBeTruthy();
    expect(screen.getByText('Задължителните стъпки са преминати. Новите проверки по избор се отчитат отделно.')).toBeTruthy();
    expect(screen.queryByText('премината учебна проверка')).toBeNull();
    expect(screen.getByRole('link', { name: 'Първи клип: учебна папка и проверка на файла' }).getAttribute('href')).toBe('/academy-labs/perfect-video/start');
  });
  it('resumes a quiz by its grading ID with stable unordered choices', async () => {
    const block = { ...createBlock('quiz', 0), id: 'stable-video-quiz', content: { question: 'Избери проверимото.', options: [{ id: 'a', label: 'Първо твърдение' }, { id: 'b', label: 'Запазен избор' }, { id: 'c', label: 'Трето твърдение' }] } };
    const props = { block, moduleId: 's02-m02', lessonId: 'pv02-03', completed: false, initialState: { answer: 'b' }, onStateChange: vi.fn(), onSubmit: vi.fn(async () => result) };
    const { rerender } = render(<LessonBlockRenderer {...props} />);
    const order = screen.getAllByRole('button').map(button => button.textContent);
    rerender(<LessonBlockRenderer {...props} initialState={{ answer: 'b' }} />);
    expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(order);
    expect(screen.getByRole('button', { name: /Запазен избор/ }).className).toContain('border-red-400');
    fireEvent.click(screen.getByRole('button', { name: /Запазен избор/ }));
    await waitFor(() => expect(props.onSubmit).toHaveBeenCalledWith({ answer: 'b' }));
  });
  it('keeps original matching choices unchanged and resumes new shuffled matches by ID', async () => {
    const block = { ...createBlock('matching', 0), id: 'stable-video-match', key: 'checkpoint_video_hook_20261003', content: { left: [{ id: 'hook', text: 'Първо обещание' }, { id: 'fact', text: 'Втори факт' }], right: [{ id: 'a', text: 'Първа връзка' }, { id: 'b', text: 'Запазена връзка' }] } };
    const props = { block, moduleId: 's02-m02', lessonId: 'pv02-03', completed: false, initialState: { matches: { hook: 'b', fact: 'a' } }, onStateChange: vi.fn(), onSubmit: vi.fn(async () => result) };
    const { rerender } = render(<LessonBlockRenderer {...props} />);
    const select = () => screen.getByRole('combobox', { name: 'Свържи Първо обещание' }) as HTMLSelectElement;
    const order = [...select().options].map(option => option.value);
    expect(select().value).toBe('b');
    rerender(<LessonBlockRenderer {...props} />);
    expect([...select().options].map(option => option.value)).toEqual(order);
    fireEvent.click(screen.getByRole('button', { name: 'Провери връзките' }));
    await waitFor(() => expect(props.onSubmit).toHaveBeenCalledWith({ matches: { hook: 'b', fact: 'a' } }));
    rerender(<LessonBlockRenderer {...props} block={{ ...block, key: 'original_matching' }} />);
    expect([...select().options].map(option => option.value)).toEqual(['', 'a', 'b']);
  });
});

describe('graded choice retries', () => {
  it.each(['quiz', 'scenario'] as const)('keeps %s available after a wrong answer and accepts a correction', async (type) => {
    const block = {
      ...createBlock(type, 0),
      content: {
        question: 'Кой ход можеш да провериш?',
        prompt: 'Кой ход можеш да провериш?',
        options: [{ id: 'a', label: 'Провери с тест' }, { id: 'b', label: 'Предположи резултата' }],
      },
    };
    const submit = vi.fn(async (payload: JsonObject) => {
      const chosen = type === 'quiz' ? payload.answer : payload.selected;
      const correct = chosen === 'a';
      return { ...result, correct, score: correct ? 2 : 0, maxScore: 2, feedback: { complete: correct, explanation: correct ? 'Провери и запиши резултата.' : 'Направи проверка и опитай пак.' } };
    });
    render(<LessonBlockRenderer block={block} lessonId="lesson" completed={false} onStateChange={vi.fn()} onSubmit={submit} />);
    fireEvent.click(screen.getByRole('button', { name: /Предположи резултата/ }));
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    await waitFor(() => expect((screen.getByRole('button', { name: /Провери с тест/ }) as HTMLButtonElement).disabled).toBe(false));
    fireEvent.click(screen.getByRole('button', { name: /Провери с тест/ }));
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(2));
    await waitFor(() => expect((screen.getByRole('button', { name: /Провери с тест/ }) as HTMLButtonElement).disabled).toBe(true));
  });
});

describe('course exam feedback', () => {
  it('requires all answers and explains a failed thematic minimum with review links', async () => {
    const block = { ...createBlock('course_exam', 0), content: {
      introduction: 'Synthetic exam', minimumPercent: 80, minimumGroupPercent: 60,
      reviewMap: { 's03-m01': 'Позициониране' },
      questions: [
        { id: 'q1', prompt: 'Synthetic question one', options: [{ id: 'a', label: 'Choice one' }] },
        { id: 'q2', prompt: 'Synthetic question two', options: [{ id: 'b', label: 'Choice two' }] },
      ],
    } };
    const submit = vi.fn(async () => ({ ...result, correct: false, score: 90, maxScore: 100,
      feedback: { complete: false, scorePercent: 90, correctCount: 36, totalQuestions: 40,
        weakModules: ['s03-m01'], groupResults: [
          { label: 'Основи · 01–04', correctCount: 4, totalQuestions: 8, scorePercent: 50, minimumPercent: 60, passed: false },
        ], explanation: 'Повтори темите с грешки.' } }));
    render(<LessonBlockRenderer block={block} lessonId="synthetic-exam" completed={false} onStateChange={vi.fn()} onSubmit={submit} />);
    const button = screen.getByRole('button', { name: 'Предай целия изпит' }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fireEvent.click(screen.getByRole('radio', { name: 'Choice one' }));
    expect(button.disabled).toBe(true);
    fireEvent.click(screen.getByRole('radio', { name: 'Choice two' }));
    expect(button.disabled).toBe(false);
    fireEvent.click(button);
    await screen.findByText('Резултат: 90%');
    expect(submit).toHaveBeenCalledWith({ answers: { q1: 'a', q2: 'b' } });
    expect(screen.getByText(/4\/8 · 50% · нужни са поне 60%/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Модул 01 · Позициониране' }).getAttribute('href')).toBe('/module/s03-m01');
    expect(screen.getByRole('button', { name: 'Нов опит' })).toBeTruthy();
  });
});

describe('Lesson Engine V2 learning flow', () => {
  it('shows reading time from the visible lesson instead of its old duration metadata', () => {
    const reading = { ...createBlock('concept', 0), content: { body: 'Кратък учебен текст за прочит.' } };
    render(<LessonEngineV2 moduleId="s01-m01" userId="student" lessonOverride={lesson([reading])} />);
    expect(screen.getByText('≈1 мин четене')).toBeTruthy();
    expect(screen.getByText(/Ориентир само за четене/)).toBeTruthy();
    expect(screen.queryByText('10 мин')).toBeNull();
  });

  it('flushes a pending answer when the page is hidden, without waiting for debounce', async () => {
    vi.useFakeTimers();
    const note = { ...createBlock('reflection', 0), content: { prompt: 'Отговор', minLength: 3 } };
    render(<LessonEngineV2 moduleId="s01-m01" userId="student" lessonOverride={lesson([note])} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Отговор преди излизане' } });
    await act(async () => { fireEvent(window, new Event('pagehide')); });
    expect(api.rpc).toHaveBeenCalledWith('academy_autosave_lesson', expect.objectContaining({
      p_current_block: note.key, p_state: { [note.key]: { text: 'Отговор преди излизане' } },
    }));
  });

  it('does not replace a student bookmark from an admin preview', async () => {
    render(<LessonEngineV2 moduleId="s01-m01" userId="student" previewMode lessonOverride={lesson([createBlock('objective', 0)])} />);
    await act(async () => {});
    expect(api.rpc.mock.calls.some(([name]) => name === 'academy_record_lesson_visit')).toBe(false);
    expect(localStorage.getItem('tavora:last-lesson:student')).toBeNull();
  });

  it.each(['s01-m01', 's02-m01', 's03-m01'])('records reading and advances without claiming mastery in %s', async (moduleId) => {
    const reading = { ...createBlock('concept', 0), points: 0, content: { body: 'Съществуващ учебен текст.' } };
    const task = { ...createBlock('practical_response', 1), content: { prompt: 'Съществуваща задача.', minLength: 60 } };
    const summary = createBlock('summary', 2);
    const data = { ...lesson([reading, task, summary]), moduleId };
    render(<LessonEngineV2 moduleId={moduleId} userId="student" lessonOverride={data} />);
    expect(screen.getByText('Учебен материал')).toBeTruthy();
    expect(screen.getByText('Съществуващ учебен текст.')).toBeTruthy();
    expect(screen.queryByText('Разбрах и мога да го приложа')).toBeNull();
    expect(screen.queryByLabelText('0 XP')).toBeNull();
    expect((screen.getByRole('button', { name: 'Следваща' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Прочетох' }));
    await waitFor(() => expect((screen.getByRole('button', { name: 'Следваща' }) as HTMLButtonElement).disabled).toBe(false));
    expect(api.rpc).toHaveBeenCalledWith('academy_complete_lesson_block', expect.objectContaining({ p_module: moduleId, p_block_key: reading.key, p_payload: { acknowledged: true } }));
    expect(screen.queryByText('Проверките на знанията в урока са преминати.')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Следваща' }));
    expect(screen.getByText('Съществуваща задача.')).toBeTruthy();
    expect(screen.getByText('0 / минимум 60 знака')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Предай отговора' })).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Следваща' }) as HTMLButtonElement).disabled).toBe(true);
  });

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
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Предай отговора' }));
      await vi.runAllTimersAsync();
    });
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
    expect(screen.getByText(/Можеш да продължиш с друг урок/)).toBeTruthy();
  });
});


describe('updated Silk Road lessons', () => {
  it('does not reuse answers, completion or XP from an older edition', () => {
    const blocks = [createBlock('objective', 0), createBlock('quiz', 1)];
    const previous = { currentBlockKey: blocks[1].key, blockState: {}, completedBlockKeys: blocks.map((b) => b.key), xp: 20, scorePercent: 100, masteryStatus: 'mastered' as const, completedAt: '2026-09-20', lastActivityAt: null };
    render(<LessonEngineV2 moduleId="s01-m01" lessonOverride={{ ...lesson(blocks, previous), versionChanged: true, priorProgress: { version: 1, completedBlocks: 2, xp: 20, scorePercent: 100, completedAt: '2026-09-20' } }} />);
    expect(screen.getByText(/Урокът е обновен/)).toBeTruthy();
    expect(screen.getByText(/Предишен резултат: версия 1, 2 завършени стъпки, 20 XP/)).toBeTruthy();
    expect(screen.getByText('0% · 0/2 задължителни стъпки')).toBeTruthy();
    expect(screen.getByText('0 XP')).toBeTruthy();
    expect(screen.getByRole('heading', { name: blocks[0].title })).toBeTruthy();
  });

  it.each(['s01-m01', 's02-m01', 's03-m01'])('saves a note in %s even when the learner immediately opens the next step', async (moduleId) => {
    const note = { ...createBlock('practical_response', 0), required: false, points: 0 };
    const next = createBlock('summary', 1);
    render(<LessonEngineV2 moduleId={moduleId} userId="student" lessonOverride={{ ...lesson([note, next]), moduleId }} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Решението ми остава запазено' } });
    fireEvent.click(screen.getByRole('button', { name: /Стъпка 2:/ }));
    await waitFor(() => expect(api.rpc).toHaveBeenCalledWith('academy_autosave_lesson', expect.objectContaining({ p_current_block: next.key, p_state: { [note.key]: { text: 'Решението ми остава запазено' } } })));
  });

  it('uses the same required-step denominator in the header and parent progress', () => {
    const done = createBlock('objective', 0);
    const note = { ...createBlock('practical_response', 1), required: false, points: 0 };
    const progress = { currentBlockKey: done.key, blockState: {}, completedBlockKeys: [done.key, note.key], xp: 5, scorePercent: null, masteryStatus: 'learning' as const, completedAt: '2026-09-20', lastActivityAt: null };
    const report = vi.fn();
    render(<LessonEngineV2 moduleId="s01-m01" lessonOverride={lesson([done, note], progress)} onSlideProgress={report} />);
    expect(screen.getByText('100% · 1/1 задължителни стъпки')).toBeTruthy();
    expect(report).toHaveBeenLastCalledWith(1, 1);
  });

  it('shows optional notes and hides zero XP in module 11', () => {
    const note = { ...createBlock('practical_response', 0), required: false, points: 0 };
    render(<LessonBlockRenderer block={note} moduleId="s01-m11" lessonId="l11-04" completed={false} onStateChange={vi.fn()} onSubmit={vi.fn(async () => result)} />);
    expect(screen.getByRole('button', { name: 'Запази бележките' })).toBeTruthy();
    expect(screen.getByText('0 знака · по избор')).toBeTruthy();
    expect(screen.queryByText(/минимум/)).toBeNull();
    expect(screen.queryByLabelText('0 XP')).toBeNull();
  });
});

describe('video audit choice presentation and prerequisite guides', () => {
  it('shuffles video exam options independently and resumes the same answer IDs', async () => {
    const block = { ...createBlock('course_exam', 0), id: 'video-exam-block', content: {
      minimumPercent: 80,
      questions: Array.from({ length: 12 }, (_, i) => ({ id: `q${i}`, prompt: `Казус ${i}`,
        options: ['a','b','c'].map(id => ({ id, label: `${i}-${id}` })),
      })),
    } };
    const answers = Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`q${i}`, ['a','b','c'][i % 3]]));
    const submit = vi.fn(async () => result);
    const state = { answers };
    const props = { block,moduleId:'s02-m15',lessonId:'pv15-13',initialState:state,completed:false,onStateChange:vi.fn(),onSubmit:submit };
    const { rerender } = render(<LessonBlockRenderer {...props} />);
    const orders = () => screen.getAllByRole('group').map(group => [...group.querySelectorAll<HTMLInputElement>('input')].map(input => input.value));
    const first = orders();
    expect(first.some(order => order.join('') !== 'abc')).toBe(true);
    const rightPositions = first.map((order,i) => order.indexOf(answers[`q${i}`]));
    expect(new Set(rightPositions).size).toBe(3);
    expect(screen.getAllByRole('radio').filter(r => (r as HTMLInputElement).checked)).toHaveLength(12);
    rerender(<LessonBlockRenderer {...props} initialState={{ answers:{ ...answers } }} />);
    expect(orders()).toEqual(first);
    fireEvent.click(screen.getByRole('button',{name:'Предай целия изпит'}));
    await waitFor(() => expect(submit).toHaveBeenCalledWith({answers}));
    // Other courses keep their current exam presentation.
    rerender(<LessonBlockRenderer {...props} moduleId="s03-m20" />);
    expect(orders().every(order => order.join('') === 'abc')).toBe(true);
  });

  it.each(['quiz','scenario'] as const)('keeps saved %s IDs valid after shuffling in modules 13–14', async type => {
    const block = { ...createBlock(type,0),id:'video-choice',content:{question:'Кой ход?',prompt:'Кой ход?',options:[
      {id:'a',label:'Проверка А'},{id:'b',label:'Проверка Б'},{id:'c',label:'Проверка В'},
    ]} };
    const field = type === 'quiz' ? 'answer' : 'selected';
    const submit = vi.fn(async () => result);
    const props = {block,moduleId:'s02-m14',lessonId:'pv14-01',initialState:{[field]:'b'},completed:false,onStateChange:vi.fn(),onSubmit:submit};
    const {rerender}=render(<LessonBlockRenderer {...props} />);
    const saved=screen.getByRole('button',{name:/Проверка Б/});
    expect(saved.className).toContain('border-red');
    const before=screen.getAllByRole('button').map(b=>b.textContent);
    rerender(<LessonBlockRenderer {...props} initialState={{[field]:'b'}} />);
    expect(screen.getAllByRole('button').map(b=>b.textContent)).toEqual(before);
    fireEvent.click(saved);
    await waitFor(()=>expect(submit).toHaveBeenCalledWith({[field]:'b'}));
  });

  it('shows a compact editing bridge, an early channel decision and honest exam scope without adding graded steps', () => {
    const block=createBlock('concept',0);
    const props={lessonOverride:lesson([block])};
    const {rerender}=render(<LessonEngineV2 {...props} moduleId="s02-m04" />);
    const summary=screen.getByText('Преди първата монтажна задача');
    expect(summary.closest('details')?.open).toBe(false);
    expect(screen.getByText(/Проектът и готовият видеофайл са различни неща/)).toBeTruthy();
    rerender(<LessonEngineV2 {...props} moduleId="s02-m10" />);
    expect(screen.getByText('Първо избери къде ще се гледа видеото')).toBeTruthy();
    rerender(<LessonEngineV2 {...props} moduleId="s02-m15" />);
    expect(screen.getByText(/не удостоверява авторството или качеството/)).toBeTruthy();
    expect(screen.getAllByRole('heading',{name:block.title})).toHaveLength(1);
    rerender(<LessonEngineV2 {...props} moduleId="s03-m01" />);
    expect(screen.queryByText(/не удостоверява авторството/)).toBeNull();
  });
});
