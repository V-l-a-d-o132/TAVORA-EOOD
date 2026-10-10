import { ACADEMY_READING_WORDS } from '@/data/academy-reading-words';

// A planning range, not a promise about how fast any student reads.
// Practice, research, filming and assessment are deliberately outside it.
const FAST_WORDS_PER_MINUTE = 200;
const SLOW_WORDS_PER_MINUTE = 120;

export function readingRange(words: number): { low: number; high: number } | null {
  if (!Number.isFinite(words) || words <= 0) return null;
  return {
    low: Math.max(1, Math.ceil(words / FAST_WORDS_PER_MINUTE)),
    high: Math.max(1, Math.ceil(words / SLOW_WORDS_PER_MINUTE)),
  };
}

function minutesLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours === 0 ? `${rest} мин` : `${hours} ч${rest ? ` ${rest} мин` : ''}`;
}

function rangeLabel(low: number, high: number): string {
  if (low === high) return `≈${minutesLabel(low)} четене`;
  if (high < 60) return `≈${low}–${high} мин четене`;
  return `≈${minutesLabel(low)}–${minutesLabel(high)} четене`;
}

export function lessonReadingDuration(moduleId: string, lessonId: string, liveWords?: number): string {
  const words = liveWords || ACADEMY_READING_WORDS[`${moduleId}/${lessonId}`];
  const range = readingRange(words);
  return range ? rangeLabel(range.low, range.high) : 'Четене със собствено темпо';
}

export function moduleReadingDuration(moduleId: string, lessonIds: readonly string[]): string {
  const ranges = lessonIds.map((lessonId) => readingRange(ACADEMY_READING_WORDS[`${moduleId}/${lessonId}`]));
  if (!ranges.length || ranges.some((range) => range === null)) return 'Четене със собствено темпо';
  return rangeLabel(
    ranges.reduce((sum, range) => sum + range!.low, 0),
    ranges.reduce((sum, range) => sum + range!.high, 0),
  );
}

/** Current lesson text is authoritative if a published version changes after the snapshot. */
export function countVisibleLessonWords(lesson: {
  moduleId?: string;
  title: string;
  subtitle: string;
  objective: string;
  blocks: readonly { title: string; content: unknown }[];
}): number {
  const silkRoad = lesson.moduleId?.startsWith('s01-') === true;
  const hiddenKeys = new Set([
    'id', 'key', 'url', 'imageUrl', 'sources', 'correct', 'correctAnswer',
    'answerKey', 'evaluation', 'scoring', 'feedback', 'version',
  ]);
  const count = (value: unknown): number => {
    if (typeof value === 'string') {
      if (/^https?:\/\//i.test(value) || value.length <= 2) return 0;
      return (value.match(/[\p{L}\p{N}]+/gu) || []).length;
    }
    if (Array.isArray(value)) return value.reduce<number>((total, part) => total + count(part), 0);
    if (value && typeof value === 'object') {
      const fallback = 'codeFallback' in value && value.codeFallback === true;
      const tableFallback = silkRoad && 'tableFallback' in value && value.tableFallback === true;
      const sourceFallback = silkRoad && 'sourceFallback' in value && value.sourceFallback === true;
      return Object.entries(value).reduce((total, [key, part]) => {
        if (hiddenKeys.has(key) || (fallback && key === 'code') || (tableFallback && key === 'body')) return total;
        return total + count(sourceFallback && key === 'body' && typeof part === 'string' ? part.split('\n\n')[0] : part);
      }, 0);
    }
    return 0;
  };
  return count(lesson.title) + count(lesson.subtitle) + count(lesson.objective)
    + lesson.blocks.reduce((total, block) => total + count(block.title) + count(block.content), 0);
}
