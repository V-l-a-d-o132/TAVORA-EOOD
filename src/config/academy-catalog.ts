// Public facts verified against published lesson versions in Supabase.
// Update this snapshot when a curriculum release changes the published lesson count.
export const ACADEMY_CATALOG_VERIFIED_ON = '2026-10-16';
export const ACADEMY_FREE_MODULE_ID = 's01-m01';
export const ACADEMY_FREE_ACCESS_DESCRIPTION =
  'Безплатен е само модул 01 — „Първата ти дигитална услуга“ от „Пътят на коприната“, с четири пълни урока. Публичните лаборатории са отделни проби и не отключват платени модули.';

// Public question counts checked against the currently published exam blocks.
export const ACADEMY_EXAM_STATS = {
  silkRoad: { finalQuestions: 33 },
  perfectVideo: { groupQuestions: [12, 12, 12, 12], finalQuestions: 30 },
  marketingBasics: { groupQuestions: [14, 16, 15, 15], finalQuestions: 60 },
} as const;

export const ACADEMY_PROGRAM_STATS = {
  silkRoad: { moduleCount: 11, lessonCount: 74 },
  perfectVideo: { moduleCount: 15, lessonCount: 240 },
  marketingBasics: { moduleCount: 20, lessonCount: 210 },
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
