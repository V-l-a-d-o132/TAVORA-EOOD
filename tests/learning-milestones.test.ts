import { describe, expect, it } from 'vitest';
import { LEARNING_BADGES, learningLevel, learningStreak } from '../src/lib/learning-milestones';

describe('Learning days in Bulgarian time', () => {
  it('counts each day once, including several lessons or timestamps on that day', () => {
    expect(learningStreak(['2026-10-12', '2026-10-12', '2026-10-11', '2026-10-10', '2026-10-12T18:00:00Z'], new Date('2026-10-12T19:00:00Z'))).toBe(3);
  });
  it('keeps yesterday’s run available today, but ends it after a missed day', () => {
    const days = ['2026-10-12', '2026-10-11', '2026-10-10'];
    expect(learningStreak(days, new Date('2026-10-13T12:00:00Z'))).toBe(3);
    expect(learningStreak(days, new Date('2026-10-14T12:00:00Z'))).toBe(0);
  });
  it('uses Sofia midnight and calendar days across the daylight-saving change', () => {
    expect(learningStreak(['2026-10-12T21:30:00Z', '2026-10-11T21:30:00Z'], new Date('2026-10-12T21:45:00Z'))).toBe(2);
    expect(learningStreak(['2026-10-26', '2026-10-25', '2026-10-24'], new Date('2026-10-26T12:00:00Z'))).toBe(3);
  });
  it('ignores missing, invalid and future days without inventing activity', () => {
    expect(learningStreak([], new Date('2026-10-13T12:00:00Z'))).toBe(0);
    expect(learningStreak(['invalid', '2026-02-31', '2026-10-14', '2026-10-13', '2026-10-11'], new Date('2026-10-13T12:00:00Z'))).toBe(1);
  });
});

describe('XP and recorded milestones', () => {
  it('shows progress within the current level, while preserving existing thresholds', () => {
    expect(learningLevel(2)).toMatchObject({ level: 1, current: 2, required: 50, remaining: 48, progress: 4 });
    expect(learningLevel(50)).toMatchObject({ level: 2, current: 0, required: 100, remaining: 100, progress: 0 });
    expect(learningLevel(125)).toMatchObject({ level: 2, current: 75, required: 100, remaining: 25, progress: 75 });
    expect(learningLevel(150)).toMatchObject({ level: 3, current: 0, required: 150 });
  });
  it('handles the maximum level and invalid XP', () => {
    expect(learningLevel(4000)).toMatchObject({ level: 10, maxed: true, remaining: 0, progress: 100 });
    expect(learningLevel(-10).level).toBe(1);
    expect(learningLevel(NaN).progress).toBe(0);
  });
  it('does not award completion badges for an empty catalog or an unsuccessful check', () => {
    expect(LEARNING_BADGES.filter(b => b.condition(0, 0, 0, 0))).toEqual([]);
    expect(LEARNING_BADGES.filter(b => b.condition(0, 1, 0, 46)).map(b => b.id)).toEqual(['first-quiz']);
    expect(LEARNING_BADGES.find(b => b.id === 'half-modules')!.condition(0, 0, 22, 46)).toBe(false);
  });
});
