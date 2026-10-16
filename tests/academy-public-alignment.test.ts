import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import snapshot from './fixtures/academy-public-facts-20261016.json';
import { LEARNING_SECTIONS } from '../src/mocks/learning-platform';
import { ACADEMY_EXAM_STATS, ACADEMY_TOTAL_STATS } from '../src/config/academy-catalog';
import { PRICING_TIERS } from '../src/config/pricing';
import { MARKETING_BASICS_FAQ, PERFECT_VIDEO_FAQ, SILK_ROAD_FAQ } from '../src/data/academy-public-faq';
import { MARKETING_BASICS_PUBLIC_GROUPS } from '../src/data/academy-public-programs';

describe('Public promises against the independently read published catalogue of 16 October', () => {
  it('resolves all 524 navigation entries to published lesson identities and titles, including the moved AI lesson', () => {
    const navigation = LEARNING_SECTIONS.flatMap(section => section.modules.flatMap(module => module.lessons.map(lesson => ({
      module_id: lesson.sourceModuleId || module.id, lesson_id: lesson.id, title: lesson.title,
    }))));
    const sort = (rows: typeof navigation) => [...rows].sort((a, b) => `${a.module_id}/${a.lesson_id}`.localeCompare(`${b.module_id}/${b.lesson_id}`));
    expect(navigation).toHaveLength(524);
    expect(sort(navigation)).toEqual(sort(snapshot.lessons));
    expect(ACADEMY_TOTAL_STATS.lessonCount).toBe(snapshot.programmes.reduce((sum, course) => sum + course.lessons, 0));
  });

  it('keeps checkout prices and access counts equal to the read-only database snapshot', () => {
    expect(PRICING_TIERS.map(tier => ({ tier_id: tier.checkoutTier, amount_cents: tier.price * 100, currency: tier.currency.toLowerCase(), module_count: tier.moduleCount, full_access: ['full', 'strategic'].includes(tier.type) })))
      .toEqual(snapshot.products);
    expect(snapshot.anonymous_access).toEqual({ 's01-m01': true, 's01-m02': false, 's02-m01': false, 's03-m01': false });
  });

  it('describes the currently published group and final exams rather than the old 40-question final', () => {
    for (const [prefix, key] of [['s01', 'silkRoad'], ['s02', 'perfectVideo'], ['s03', 'marketingBasics']] as const) {
      const exams = snapshot.exams.filter(exam => exam.module_id.startsWith(prefix));
      expect(exams.at(-1)?.questions).toBe(ACADEMY_EXAM_STATS[key].finalQuestions);
      if (key !== 'silkRoad') expect(exams.slice(0, -1).map(exam => exam.questions)).toEqual(ACADEMY_EXAM_STATS[key].groupQuestions);
    }
    expect(MARKETING_BASICS_FAQ.find(item => item.q.includes('финал'))?.a).toContain('финален изпит с 60 въпроса');
    expect(MARKETING_BASICS_FAQ.map(item => item.a).join(' ')).not.toContain('40 въпроса');
  });

  it('uses the displayed 5+5+5+5 order in Marketing FAQs and retains the no-upload format', () => {
    const answer = MARKETING_BASICS_FAQ.find(item => item.q.includes('подредена'))?.a;
    for (const group of MARKETING_BASICS_PUBLIC_GROUPS) expect(answer).toContain(group.description);
    for (const faq of [MARKETING_BASICS_FAQ, PERFECT_VIDEO_FAQ, SILK_ROAD_FAQ]) {
      const text = faq.map(item => item.a).join(' ');
      expect(text).toMatch(/качва[шн]|качват/);
      expect(text).toMatch(/свободни писмени отговори|свободни отговори/);
    }
  });

  it('gives search and AI readers the same current programme counts and exam scope', () => {
    for (const path of ['public/ai.txt', 'public/llms.txt']) {
      const text = readFileSync(path, 'utf8');
      expect(text).toContain('210 публикувани урока');
      expect(text).toMatch(/524 (?:публикувани )?урока/);
      expect(text).not.toMatch(/209 публикувани|523 (?:публикувани )?урока|AI Advantage/);
      expect(text).toContain('без свободни писмени отговори');
    }
  });
});
