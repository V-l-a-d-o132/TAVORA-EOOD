import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { PGlite } from '@electric-sql/pglite';
import { actor, createSilkDatabase, learnerRecords, OTHER, STUDENT } from './helpers/silk-road-db';

type Row = {
  module_id: string; lesson_id: string; completed: boolean; quiz_score: number | null;
  xp: number; updated_at: string | null; quiz_count: number; practice_count: number; activity_dates: string[];
};
const migration = readFileSync('supabase/migrations/20261013053216_academy_dashboard_activity_metrics.sql', 'utf8');
let db: PGlite;
let before: Awaited<ReturnType<typeof learnerRecords>>;
let oldReport: Array<Omit<Row, 'quiz_count' | 'practice_count' | 'activity_dates'>>;
async function report(user = STUDENT) {
  await actor(db, 'authenticated', user);
  return (await db.query<{ report: Row[] }>('SELECT public.academy_get_learning_progress() AS report')).rows[0].report;
}

beforeAll(async () => {
  db = await createSilkDatabase();
  // The minimal fixture predates course_exam; mirror the current block catalog.
  await db.exec('ALTER TABLE public.academy_lesson_blocks DROP CONSTRAINT academy_lesson_blocks_block_type_check');
  const lessons = (await db.query<{ id: string; lesson_id: string; version: string }>(
    "SELECT id,lesson_id,published_version_id AS version FROM public.academy_lessons WHERE module_id='s01-m01' ORDER BY lesson_id")).rows;
  const [main, historical, visited, imported] = lessons;
  await db.query(`INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,required)
    VALUES ($1,'scenario',100,'scenario',true),($1,'matching',101,'matching',true),
      ($1,'sort',102,'sequence_sort',true),($1,'optional',103,'scenario',false),
      ($1,'exam',104,'course_exam',true)`, [main.version]);
  const blocks = (await db.query<{ id: string; block_key: string }>(
    "SELECT id,block_key FROM public.academy_lesson_blocks WHERE version_id=$1", [main.version])).rows;
  async function attempt(lesson: typeof main, key: string, user: string, correct: boolean | null, when: string) {
    const block = blocks.find(b => b.block_key === key)!;
    await db.query(`INSERT INTO public.academy_lesson_attempts_v2
      (id,user_id,academy_lesson_id,version_id,block_id,payload,score,max_score,is_correct,created_at)
      VALUES(gen_random_uuid(),$1,$2,$3,$4,'{}',0,0,$5,$6)`, [user, lesson.id, lesson.version, block.id, correct, when]);
  }
  for (const key of ['quiz_1', 'scenario', 'matching', 'sort', 'optional', 'exam'])
    await attempt(main, key, STUDENT, true, '2026-10-12T19:00:00Z');
  await attempt(main, 'quiz_1', STUDENT, true, '2026-10-12T20:00:00Z');
  await attempt(main, 'quiz_1', STUDENT, false, '2026-10-12T21:30:00Z');
  await attempt(main, 'quiz_2', STUDENT, false, '2026-10-11T12:00:00Z');
  await attempt(main, 'quiz_3', OTHER, true, '2026-10-10T12:00:00Z');
  await attempt(main, 'objective', STUDENT, null, '2026-10-12T12:00:00Z');
  await db.query(`INSERT INTO public.academy_lesson_progress
    (user_id,academy_lesson_id,version_id,completed_block_keys,xp,score_percent,last_activity_at)
    VALUES($1,$2,$3,ARRAY['objective','quiz_1','quiz_2','quiz_3','scenario','matching','sort','optional','exam'],37,50,'2026-10-14T12:00:00Z')`,
  [STUDENT, main.id, main.version]);
  const oldVersion = (await db.query<{ id: string }>(
    "INSERT INTO public.academy_lesson_versions(academy_lesson_id,version_number,title) VALUES($1,1,'Учебна стара версия') RETURNING id", [historical.id])).rows[0].id;
  const oldBlock = (await db.query<{ id: string }>(
    "INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type) VALUES($1,'old_quiz',0,'quiz') RETURNING id", [oldVersion])).rows[0].id;
  await db.query(`INSERT INTO public.academy_lesson_attempts_v2(id,user_id,academy_lesson_id,version_id,block_id,payload,is_correct,created_at)
    VALUES(gen_random_uuid(),$1,$2,$3,$4,'{}',true,'2026-10-09T21:30:00Z')`, [STUDENT, historical.id, oldVersion, oldBlock]);
  await db.query(`INSERT INTO public.academy_lesson_progress(user_id,academy_lesson_id,version_id,completed_block_keys,xp,completed_at,last_activity_at)
    VALUES($1,$2,$3,ARRAY['old_quiz'],99,'2026-10-10T12:00:00Z','2026-10-10T12:00:00Z'),
      ($1,$4,$5,'{}',0,NULL,'2026-10-13T12:00:00Z'),
      ($1,$6,$7,ARRAY['objective'],5,'2026-10-10T12:00:00Z','2026-10-14T12:00:00Z')`,
  [STUDENT, historical.id, oldVersion, visited.id, visited.version, imported.id, imported.version]);
  oldReport = await report(); before = await learnerRecords(db);
  await db.exec(migration);
}, 30000);
afterAll(async () => { await db?.close(); });

describe('Read-only dashboard progress report', () => {
  it('counts successful required current blocks once, independently of attempts and lesson grade', async () => {
    const row = (await report()).find(r => r.lesson_id === 'l01-01')!;
    expect(row).toMatchObject({ completed: false, quiz_score: 50, xp: 37, quiz_count: 2, practice_count: 3 });
    // Repeats, a later wrong answer, another account and optional blocks add no count.
    expect(row.activity_dates).toEqual(['2026-10-11', '2026-10-12', '2026-10-13']);
  });
  it('retains real historic learning days without counting obsolete completion or mere visits', async () => {
    const rows = await report();
    expect(rows.find(r => r.lesson_id === 'l01-02')).toMatchObject({ completed: false, xp: 0, quiz_count: 0, practice_count: 0, activity_dates: ['2026-10-10'] });
    expect(rows.find(r => r.lesson_id === 'l01-03')!.activity_dates).toEqual([]);
    expect(rows.find(r => r.lesson_id === 'l01-04')!.activity_dates).toEqual(['2026-10-10']);
  });
  it('keeps every existing field and all seven learner tables unchanged after reads', async () => {
    const rows = await report();
    expect(rows.map(({ quiz_count: _q, practice_count: _p, activity_dates: _d, ...original }) => original)).toEqual(oldReport);
    expect(await learnerRecords(db)).toEqual(before);
  });
  it('scopes counts to the signed-in user and accessible published lessons, and refuses anonymous access', async () => {
    const rows = await report(OTHER);
    expect(new Set(rows.map(r => r.module_id))).toEqual(new Set(['s01-m01']));
    expect(rows.every(r => r.quiz_count === 0 && r.practice_count === 0 && r.xp === 0)).toBe(true);
    await actor(db, 'anon');
    await expect(db.query('SELECT public.academy_get_learning_progress()')).rejects.toThrow();
    await actor(db, 'authenticated');
    await expect(db.query('SELECT public.academy_get_learning_progress()')).rejects.toThrow(/Authentication required/);
  });
});
