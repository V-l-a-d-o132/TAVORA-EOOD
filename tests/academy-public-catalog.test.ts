import { describe, expect, it } from 'vitest';
import published from './fixtures/academy-published-catalog.json';
import { LEARNING_SECTIONS } from '../src/mocks/learning-platform';
import { lessonRoute, requestedLessonIndex } from '../src/lib/academy-lesson-location';
import { parseBookmark } from '../src/lib/learning-resume';
import { PRICING_TIERS } from '../src/config/pricing';
import { ACADEMY_CATALOG_VERIFIED_ON, ACADEMY_FREE_MODULE_ID, ACADEMY_TOTAL_STATS } from '../src/config/academy-catalog';
import { MARKETING_BASICS_PUBLIC_GROUPS, PERFECT_VIDEO_PUBLIC_MODULES, SILK_ROAD_PUBLIC_MODULES } from '../src/data/academy-public-programs';

describe('Public catalogue against the published Supabase snapshot', () => {
  it('shows every published module once with its actual lesson count', () => {
    const modules = LEARNING_SECTIONS.flatMap(section => section.modules);
    expect(ACADEMY_CATALOG_VERIFIED_ON).toBe(published.verifiedOn);
    expect(modules.map(module => ({ id: module.id, lessons: module.lessons.length }))).toEqual(published.modules);
    for (const section of LEARNING_SECTIONS) {
      expect(section.totalModules).toBe(section.modules.length);
      expect(section.totalLessons).toBe(section.modules.reduce((total, module) => total + module.lessons.length, 0));
    }
    expect(ACADEMY_TOTAL_STATS.moduleCount).toBe(published.modules.length);
    expect(ACADEMY_TOTAL_STATS.lessonCount).toBe(published.modules.reduce((total, module) => total + module.lessons, 0));
  });

  it('has at least seven Silk Road lessons per module and keeps the original final exam reachable', () => {
    const section = LEARNING_SECTIONS[0];
    expect(section.totalLessons).toBe(92);
    expect(section.modules.every(module => module.lessons.length >= 7)).toBe(true);
    const last = section.modules.at(-1)!;
    const final = last.lessons.at(-1)!;
    expect(final.id).toBe('l11-04');
    expect(last.lessons[requestedLessonIndex(last, '3')]).toBe(final);
    const oldBookmark = parseBookmark({ moduleId: last.id, lessonIndex: 3, lessonTitle: final.title, timestamp: '2026-10-16T09:00:00Z' });
    expect(oldBookmark?.lessonId).toBe(final.id);
    for (const [index, lesson] of last.lessons.entries()) {
      const route = lessonRoute(last.id, lesson.id, index);
      const query = new URL(route, 'https://academy.test').searchParams.get('lesson');
      expect(requestedLessonIndex(last, query)).toBe(index);
    }
  });

  it('does not offer unpublished editing lessons through the navigation', () => {
    const editingModule = LEARNING_SECTIONS[1].modules.find(module => module.id === 's02-m09');
    // Publication identity is independent of the revised teaching order.
    expect(editingModule?.lessons.map(lesson => lesson.id).sort()).toEqual([...published.editingModuleLessonIds].sort());
  });

  it('preserves the six checkout products, prices and purchased module counts', () => {
    expect(PRICING_TIERS.map(tier => ({ tier: tier.checkoutTier, amountCents: tier.price * 100, modules: tier.moduleCount }))).toEqual(published.products);
    expect(PRICING_TIERS.every(tier => tier.currency === 'EUR')).toBe(true);
  });

  it('uses the same module order in the public programmes and marks only the actual free module', () => {
    expect(MARKETING_BASICS_PUBLIC_GROUPS.map(group => group.modules.length)).toEqual([5, 5, 5, 5]);
    expect(MARKETING_BASICS_PUBLIC_GROUPS.flatMap(group => group.modules.map(module => module.num))).toEqual(LEARNING_SECTIONS[2].modules.map(module => module.number));
    expect(ACADEMY_FREE_MODULE_ID).toBe(published.freeModuleId);
    expect(LEARNING_SECTIONS.flatMap(section => section.modules).filter(module => !module.isLocked).map(module => module.id)).toEqual([published.freeModuleId]);
    expect(LEARNING_SECTIONS.flatMap(section => section.modules).filter(module => module.tag === 'FREE').map(module => module.id)).toEqual([published.freeModuleId]);
    expect(SILK_ROAD_PUBLIC_MODULES.filter(module => module.tag === 'FREE').map(module => module.num)).toEqual(['01']);
    expect(PERFECT_VIDEO_PUBLIC_MODULES.some(module => module.tag === 'FREE')).toBe(false);
    expect(MARKETING_BASICS_PUBLIC_GROUPS.some(group => group.modules.some(module => module.tag === 'FREE'))).toBe(false);
  });
});
