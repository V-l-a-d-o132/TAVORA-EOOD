/** Stable across resume, independent of grading IDs and restricted to unordered choices. */
export function usesIndependentPractice(moduleId?: string): boolean {
  return !!moduleId && (moduleId.startsWith('s01-') || ['s02-m01', 's02-m02', 's02-m03'].includes(moduleId));
}

/** Choice presentation can change without changing saved answer IDs or grading. */
export function usesShuffledChoices(moduleId?: string): boolean {
  return usesIndependentPractice(moduleId) || /^s02-m(?:0[4-9]|1[0-5])$/.test(moduleId || '');
}

export function lessonOptionOrder<T>(items: readonly T[], seed: string): T[] {
  let state = 2166136261;
  for (const char of seed) state = Math.imul(state ^ char.charCodeAt(0), 16777619);
  const next = () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  const ordered = [...items];
  for (let index = ordered.length - 1; index > 0; index--) {
    const target = Math.floor(next() * (index + 1));
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
  }
  return ordered;
}
