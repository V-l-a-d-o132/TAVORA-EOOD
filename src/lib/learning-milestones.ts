/** Dashboard milestones describe recorded learning, rather than qualifications. */
const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000];

export function learningLevel(points: number) {
  const xp = Number.isFinite(points) ? Math.max(0, points) : 0;
  const index = LEVEL_THRESHOLDS.reduce((latest, threshold, i) => xp >= threshold ? i : latest, 0);
  const level = index + 1;
  const maxed = level === LEVEL_THRESHOLDS.length;
  const required = maxed ? 0 : LEVEL_THRESHOLDS[index + 1] - LEVEL_THRESHOLDS[index];
  const current = maxed ? 0 : xp - LEVEL_THRESHOLDS[index];
  return {
    level, maxed, current, required,
    remaining: maxed ? 0 : required - current,
    progress: maxed ? 100 : Math.round(100 * current / required),
  };
}

const sofiaDay = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Sofia', year: 'numeric', month: '2-digit', day: '2-digit',
});
const DAY_MS = 86_400_000;

function calendarDay(date: Date): string {
  const parts = sofiaDay.formatToParts(date);
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)!.value).join('-');
}

function dayNumber(value: string): number | null {
  let day = value;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return null;
    day = calendarDay(date);
  }
  const ms = Date.parse(`${day}T00:00:00Z`);
  if (!Number.isFinite(ms) || new Date(ms).toISOString().slice(0, 10) !== day) return null;
  return ms / DAY_MS;
}

/** One count per Sofia calendar day; yesterday's run can still continue today. */
export function learningStreak(dates: string[], now = new Date()): number {
  if (!Number.isFinite(now.getTime())) return 0;
  const today = dayNumber(calendarDay(now))!;
  const days = new Set(dates.map(dayNumber).filter((day): day is number => day !== null && day <= today));
  let next = days.has(today) ? today : today - 1;
  let streak = 0;
  while (days.has(next)) { streak++; next--; }
  return streak;
}

type Milestone = {
  id: string; name: string; icon: string; desc: string;
  condition: (lessons: number, checks: number, modules: number, total: number) => boolean;
};
export const LEARNING_BADGES: Milestone[] = [
  { id: 'first-lesson', name: 'Първи урок', icon: 'ri-footprint-line', desc: 'Завърши 1 урок', condition: lessons => lessons >= 1 },
  { id: 'five-lessons', name: '5 урока', icon: 'ri-seedling-line', desc: 'Завърши 5 урока', condition: lessons => lessons >= 5 },
  { id: 'ten-lessons', name: '10 урока', icon: 'ri-book-open-line', desc: 'Завърши 10 урока', condition: lessons => lessons >= 10 },
  { id: 'twenty-lessons', name: '20 урока', icon: 'ri-fire-line', desc: 'Завърши 20 урока', condition: lessons => lessons >= 20 },
  { id: 'first-quiz', name: 'Първа проверка', icon: 'ri-brain-line', desc: 'Реши 1 проверка', condition: (_lessons, checks) => checks >= 1 },
  { id: 'half-modules', name: 'Половината модули', icon: 'ri-trophy-line', desc: 'Завърши половината от всички модули', condition: (_lessons, _checks, modules, total) => total > 0 && modules >= Math.ceil(total / 2) },
  { id: 'all-modules', name: 'Всички модули', icon: 'ri-award-line', desc: 'Завърши всички модули', condition: (_lessons, _checks, modules, total) => total > 0 && modules >= total },
];
