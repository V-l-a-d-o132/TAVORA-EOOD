// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { LEARNING_SECTIONS, PREVIOUS_MARKETING_LESSONS } from '../src/mocks/learning-platform';
import { MARKETING_BASICS_PUBLIC_GROUPS } from '../src/data/academy-public-programs';
import { legacyMarketingRoute, lessonRoute, locateLesson, requestedLessonIndex } from '../src/lib/academy-lesson-location';
import { bookmarkTarget, parseBookmark, resumeTargetRoute } from '../src/lib/learning-resume';
import { marketingVisibleWords } from '../src/lib/marketing-reading-count';
import { readFileSync } from 'node:fs';
import { ACADEMY_READING_WORDS } from '../src/data/academy-reading-words';
import { loadPracticalMarketingCandidates } from '../scripts/prepare-practical-marketing-assets.mjs';

vi.mock('../src/lib/supabase', () => ({ supabase: { rpc: vi.fn() } }));

describe('Marketing Basics curriculum and stable lesson locations', () => {
  const course = LEARNING_SECTIONS[2];
  it('covers every lesson exactly once, in the approved order, including the new introduction', () => {
    expect(course.modules.map(module => module.id)).toEqual([
      's03-m01', 's03-m02', 's03-m05', 's03-m03', 's03-m07',
      's03-m10', 's03-m11', 's03-m08', 's03-m06', 's03-m09',
      's03-m04', 's03-m16', 's03-m15', 's03-m12', 's03-m13',
      's03-m14', 's03-m17', 's03-m18', 's03-m19', 's03-m20',
    ]);
    const lessons = course.modules.flatMap(module => module.lessons);
    expect(lessons).toHaveLength(210);
    expect(new Set(lessons.map(lesson => lesson.id)).size).toBe(210);
    expect(course.modules[0].lessons[0].id).toBe('lm01-00');
    expect(course.modules[9].lessons.slice(4, 7).map(lesson => lesson.id)).toEqual(['lm09-05', 'lm01-01', 'lm09-06']);
    expect(MARKETING_BASICS_PUBLIC_GROUPS.map(group => group.modules.length)).toEqual([5, 5, 5, 5]);
  });
  it('keeps every original indexed URL attached to its original lesson', () => {
    for (const [moduleId, lessons] of Object.entries(PREVIOUS_MARKETING_LESSONS)) {
      for (const [index, lesson] of lessons.entries()) {
        const target = locateLesson(moduleId, lesson.id)!;
        expect(legacyMarketingRoute(moduleId, String(index))).toBe(lessonRoute(target.module.id, lesson.id, target.lessonIndex));
        expect(requestedLessonIndex(target.module, lesson.id)).toBe(target.lessonIndex);
      }
    }
    expect(legacyMarketingRoute('s01-m01', '0')).toBeNull();
    expect(legacyMarketingRoute('s03-m01', 'lm01-01')).toBe('/module/s03-m09?lesson=lm01-01');
  });
  it('resumes the moved AI lesson without changing its storage identity or user access', () => {
    const saved = parseBookmark({ moduleId: 's03-m01', lessonId: 'lm01-01', timestamp: '2026-10-11T19:00:00Z' })!;
    expect(saved.moduleId).toBe('s03-m09');
    const target = bookmarkTarget(saved, true, [])!;
    expect(resumeTargetRoute(target)).toBe('/module/s03-m09?lesson=lm01-01');
    expect(bookmarkTarget(saved, false, ['s03-m01'])).toBeNull();
    expect(locateLesson('s03-m01', 'lm01-01')?.lesson.sourceModuleId).toBe('s03-m01');
    const previous = PREVIOUS_MARKETING_LESSONS['s03-m01'][0];
    expect(parseBookmark({ moduleId: 's03-m01', lessonIndex: 0, lessonTitle: previous.title, timestamp: '2026-10-11' })?.lessonId).toBe('lm01-01');
  });
  it('counts the displayed lesson text once and excludes unsupported table fields and metadata', () => {
    const fixture = {
      title: 'Кратък урок', subtitle: '',
      blocks: [
        { title: 'Цел', type: 'objective', content: { body: 'Три ясни думи', outcomes: ['Едно умение'], deliverable: 'Избери', check: 'Провери' } },
        { title: 'Казус', type: 'case_study', content: { body: 'Два факта', columns: ['Непоказана колона'], table: [{ cells: ['Непоказана стойност'] }] } },
        { title: 'Избор', type: 'quiz', content: { question: 'Кой факт', options: [{ id: 'hidden-id', label: 'Един отговор' }] } },
      ],
    };
    expect(marketingVisibleWords(fixture)).toBe(18);
  });
  it('keeps the published first five modules detailed and ties their reading times to their actual text', () => {
    const packet = JSON.parse(readFileSync('scripts/marketing-basics/releases/community-1-5-20261011.json', 'utf8')) as {
      lessons: { lesson_id: string; source_module_id: string; title: string; subtitle: string; blocks: { type: string; title: string; content: Record<string, unknown> }[] }[];
      metrics: { id: string; rendered: { words: number }; first_page: { words: number; lines: number }; baseline: null | { first_page: { words: number; lines: number } } }[];
    };
    expect(packet.lessons).toHaveLength(41);
    for (const lesson of packet.lessons) {
      const first = lesson.blocks[0];
      expect(first.type).toBe('objective');
      for (const field of ['body', 'outcomes', 'deliverable', 'check']) expect(first.content[field]).toBeTruthy();
      const location = locateLesson(lesson.source_module_id, lesson.lesson_id)!;
      expect(location.lesson.title).toBe(lesson.title);
      const words = marketingVisibleWords(lesson);
      expect(words).toBe(packet.metrics.find(metric => metric.id === lesson.lesson_id)!.rendered.words);
      const current = loadPracticalMarketingCandidates().find((item: {lesson:string}) => item.lesson === lesson.lesson_id);
      expect(current).toBeTruthy();
      const currentBlocks = lesson.blocks.map(block => ({ ...block, content: block.type === 'objective' ? current.opening : current.amendments?.find((item: {key:string}) => item.key === (block as {key?:string}).key)?.content || block.content }));
      currentBlocks.push(current.bridge, current.practice);
      const currentWords = marketingVisibleWords({...lesson, blocks: currentBlocks});
      expect(currentWords).toBe(current.wordsAfter);
      expect(ACADEMY_READING_WORDS[`${lesson.source_module_id}/${lesson.lesson_id}`]).toBe(currentWords);
      expect(lesson.blocks.some(block => ['practical_response', 'submission', 'homework', 'reflection'].includes(block.type))).toBe(false);
    }
  });
});

