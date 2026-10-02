import { describe, expect, it } from 'vitest';
import { LEARNING_SECTIONS } from '../src/mocks/learning-platform';
import { ACADEMY_READING_WORDS } from '../src/data/academy-reading-words';
import { countVisibleLessonWords, lessonReadingDuration, moduleReadingDuration } from '../src/lib/academy-reading-time';

describe('reading-only estimates for published academy lessons', () => {
  it('covers all 523 published lessons and every module without claiming practice time', () => {
    const modules = LEARNING_SECTIONS.flatMap((section) => section.modules);
    const keys = modules.flatMap((module) => module.lessons.map((lesson) => `${module.id}/${lesson.id}`));
    expect(keys).toHaveLength(523);
    expect(Object.keys(ACADEMY_READING_WORDS).sort()).toEqual(keys.sort());
    for (const module of modules) {
      expect(module.duration).toBe(moduleReadingDuration(module.id, module.lessons.map((lesson) => lesson.id)));
      expect(module.duration).toMatch(/^≈.+ четене$/);
      for (const lesson of module.lessons) {
        expect(lesson.duration).toBe(lessonReadingDuration(module.id, lesson.id));
        expect(lesson.duration).toMatch(/^≈.+ четене$/);
      }
    }
  });

  it('counts learner-facing text without private answer keys, URL strings or retired blocks', () => {
    const lesson = {
      title: 'Кратък урок', subtitle: '', objective: 'Провери верния факт',
      blocks: [{ title: 'Пример', content: { body: 'Малък бизнес във Велико Търново', answerKey: 'скрит верен отговор', url: 'https://example.com/long-secret', options: [{ id: 'a', label: 'Първи избор' }] } }],
    };
    expect(countVisibleLessonWords(lesson)).toBe(13);
    expect(lessonReadingDuration('s01-m01', 'l01-01', 1151)).toBe('≈6–10 мин четене');
  });
});
