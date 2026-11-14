import { describe, expect, it } from 'vitest';
import { videoLessonSteps } from '../src/lib/video-lesson-steps';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
import { parseClosedStudio } from '../src/lib/closed-practice-studio';

const correction = { key: 'before_after', type: 'before_after', title: 'Проверка', content: { after: { text: 'Прегледай пробата.' } } };
const oldKey = { key: 'field_diagnostic', type: 'rich_text', title: 'Стара стъпка', content: { mergedInto: 'before_after' }, required: false, points: 0 };

describe('module 1 pilot compatibility', () => {
  it('omits the merged zero-credit step only when its destination exists and counts the visible explanation once', () => {
    expect(videoLessonSteps([correction, oldKey])).toEqual([correction]);
    expect(videoLessonSteps([oldKey])).toEqual([oldKey]);
    for (const change of [{ required: true }, { points: 3 }, { content: { body: 'Оригиналната диагностика.' } }]) {
      const blocks = [correction, { ...oldKey, ...change }];
      expect(videoLessonSteps(blocks)).toBe(blocks);
    }
    const lesson = { moduleId: 's02-m01', title: 'Тест', objective: '', subtitle: '' };
    expect(countVisibleLessonWords({ ...lesson, blocks: [correction, oldKey] })).toBe(countVisibleLessonWords({ ...lesson, blocks: [correction] }));
  });
  it('builds the same document preview from the selected option and its own slot', () => {
    const left = [{ id: 'scope', text: 'Уговорена работа', choices: ['sample'] }];
    const base = { studio: { kind: 'brief' }, left };
    const parse = (document: Record<string, string>) => parseClosedStudio({ ...base, right: [
      { id: 'sample', text: 'Един кратък клип.', preview: { document } },
    ] })?.choices[0].document;
    const legacy = parse({ part: 'scope', title: 'Уговорена работа', text: 'Един кратък клип.' });
    expect(legacy).toEqual({ part: 'scope', title: 'Уговорена работа', text: 'Един кратък клип.' });
    expect(parse({ part: 'scope', slotId: 'scope' })).toEqual(legacy);
    expect(parse({ part: 'scope', slotId: 'different' })).toBeUndefined();
  });
});
