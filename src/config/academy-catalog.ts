// Public facts verified against published lesson versions in Supabase.
// Update this snapshot when a curriculum release changes the published lesson count.
export const ACADEMY_CATALOG_VERIFIED_ON = '2026-10-01';
export const ACADEMY_FREE_MODULE_ID = 's01-m01';
export const ACADEMY_FREE_ACCESS_DESCRIPTION =
  'Безплатният пробен модул на Академията е AI Advantage от „Пътят на коприната“.';

export const ACADEMY_PROGRAM_STATS = {
  silkRoad: { moduleCount: 11, lessonCount: 74 },
  perfectVideo: { moduleCount: 15, lessonCount: 240 },
  marketingBasics: { moduleCount: 20, lessonCount: 209 },
} as const;

export const ACADEMY_STARTER_STATS = { moduleCount: 10, lessonCount: 70 } as const;

export const ACADEMY_TOTAL_STATS = Object.values(ACADEMY_PROGRAM_STATS).reduce(
  (total, program) => ({
    moduleCount: total.moduleCount + program.moduleCount,
    lessonCount: total.lessonCount + program.lessonCount,
  }),
  { moduleCount: 0, lessonCount: 0 },
);

export const ACADEMY_CERTIFICATE_DESCRIPTION =
  'Сертификатът е за завършено обучение, а не държавно призната професионална квалификация.';
