import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, expect, test } from 'vitest';
import type { PGlite } from '@electric-sql/pglite';
import { actor, createSilkDatabase, learnerRecords, STUDENT } from './helpers/silk-road-db';

// Synthetic assessment fixtures only. Production questions and keys are private.
const RELEASE = 'silk_road_closed_learning_20261008';
const migration = readFileSync('supabase/migrations/20261008104748_silk_road_publish_closed_curriculum.sql', 'utf8');
const [functions, publication] = migration.split('-- PUBLISH_CLOSED_CURRICULUM');
let db: PGlite;
let final: { id: string; published_version_id: string };
const answerSet = () => Object.fromEntries(Array.from({ length: 33 }, (_, i) => [`fixture-${i}`, 'chosen']));
const exam = async (answers = answerSet(), attempt = randomUUID()) => (await db.query<{ result: Record<string, unknown> }>(
  `SELECT public.academy_submit_course_exam('s01-m11','l11-04',$1,'fixture-exam',$2,$3) AS result`,
  [final.published_version_id, { answers }, attempt],
)).rows[0].result;

beforeAll(async () => {
  db = await createSilkDatabase(true);
  // The base helper predates the exam type. Mirror the already deployed enum extension.
  await db.exec('ALTER TABLE academy_lesson_blocks DROP CONSTRAINT academy_lesson_blocks_block_type_check');
  await db.exec(readFileSync('supabase/migrations/20261008104746_silk_road_closed_learning_release.sql', 'utf8'));
  await db.exec(functions);
  await db.exec(`CREATE FUNCTION public.academy_submit_course_exam(text,text,uuid,text,jsonb,uuid) RETURNS jsonb
    LANGUAGE sql SECURITY INVOKER SET search_path='' AS
    $$ SELECT academy_private.submit_course_exam($1,$2,$3,$4,$5,$6) $$;
    GRANT EXECUTE ON FUNCTION academy_private.submit_course_exam(text,text,uuid,text,jsonb,uuid) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.academy_submit_course_exam(text,text,uuid,text,jsonb,uuid) TO authenticated;`);
  const lessons = (await db.query<{ id: string; module_id: string; lesson_id: string; published_version_id: string }>(
    "SELECT id,module_id,lesson_id,published_version_id FROM academy_lessons WHERE module_id LIKE 's01-%' ORDER BY module_id,lesson_id",
  )).rows;
  for (const l of lessons) {
    const blocks = ['objective', 'hook', 'rich_text', 'example', 'quiz', 'scenario', 'matching', 'summary'].map((type, i) => ({
      key: `fixture-${type}`, position: i * 10, type, title: `Учебен ${type}`, required: true, points: 1,
      content: ['quiz', 'scenario'].includes(type) ? { options: [{ id: 'chosen', label: 'Условие А' }, { id: 'other', label: 'Условие Б' }] }
        : type === 'matching' ? { left: [{ id: 'left', text: 'Първо' }], right: [{ id: 'right', text: 'Второ' }] } : { body: 'Синтетична проверка.' },
      ...(['quiz', 'scenario'].includes(type) ? {
        evaluation: { correct: 'chosen' }, feedback: { choices: { chosen: 'Избраният довод е точен.', other: 'Провери условието отново.' }, success: 'Точно.' },
      } : type === 'matching' ? { evaluation: { matches: { left: 'right' } }, feedback: { success: 'Свързано.', retry: 'Провери връзката.' } } : {}),
    }));
    const payload: Record<string, unknown> = { module: l.module_id, lesson: l.lesson_id, title: 'Нова учебна версия',
      subtitle: 'Условия', objective: 'Избери действие.', hook: 'Нов случай.', estimated_minutes: 10, change_note: RELEASE, blocks };
    if (l.lesson_id === 'l11-04') (payload.blocks as unknown[]).push({ key: 'fixture-exam', type: 'course_exam', title: 'Проверка', position: 100,
      required: true, points: 100, content: { minimumPercent: 80, minimumGroupPercent: 60,
        questions: Array.from({ length: 33 }, (_, i) => ({ id: `fixture-${i}`, moduleId: `s01-m${String(Math.floor(i / 3) + 1).padStart(2, '0')}`,
          prompt: `Синтетичен въпрос ${i}`, options: [{ id: 'chosen', label: 'Условие А' }, { id: 'other', label: 'Условие Б' }] })) },
      evaluation: { answers: answerSet(), criticalQuestions: ['fixture-16', 'fixture-21', 'fixture-27'] },
    });
    await db.query(`INSERT INTO academy_private.silk_road_release_lessons(release_key,module_id,lesson_id,expected_version_id,payload)
      VALUES($1,$2,$3,$4,$5)`, [RELEASE, l.module_id, l.lesson_id, l.published_version_id, payload]);
  }
}, 60000);
afterAll(async () => { await db?.close(); });

test('publication fails atomically on a changed version and preserves learner rows', async () => {
  await actor(db, 'postgres', STUDENT);
  await db.exec(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,completed_block_keys,xp,completed_at)
    SELECT '${STUDENT}',id,published_version_id,ARRAY['objective'],7,now() FROM academy_lessons WHERE lesson_id='l01-01';`);
  const before = await learnerRecords(db);
  await db.exec('BEGIN');
  await db.exec("UPDATE academy_lessons SET draft_version_id=NULL WHERE lesson_id='l11-04'");
  await expect(db.exec(publication)).rejects.toThrow(/changed since audit/);
  await db.exec('ROLLBACK');
  expect((await db.query(`SELECT count(*)::int n FROM academy_lesson_versions WHERE change_note=$1`, [RELEASE])).rows[0]).toEqual({ n: 0 });
  await db.exec(publication);
  expect(await learnerRecords(db)).toEqual(before);
  expect((await db.query(`SELECT count(*)::int n FROM academy_lesson_versions WHERE change_note=$1`, [RELEASE])).rows[0]).toEqual({ n: 74 });
  await db.exec(publication); // Idempotent publication.
  expect((await db.query(`SELECT count(*)::int n FROM academy_lesson_versions WHERE change_note=$1`, [RELEASE])).rows[0]).toEqual({ n: 74 });
  final = (await db.query<{ id: string; published_version_id: string }>("SELECT id,published_version_id FROM academy_lessons WHERE lesson_id='l11-04'")).rows[0];
});

test('new lesson responses expose only selected feedback and keep old progress as history', async () => {
  await actor(db);
  const l = (await db.query<{ id: string; published_version_id: string }>("SELECT id,published_version_id FROM academy_lessons WHERE lesson_id='l01-01'")).rows[0];
  await actor(db, 'authenticated', STUDENT);
  const run = async (key: string, payload: unknown) => (await db.query<{ result: { correct: boolean; feedback: Record<string, unknown> } }>(
    "SELECT public.academy_complete_lesson_block('s01-m01','l01-01',$1,$2,$3,$4) result", [l.published_version_id, key, payload, randomUUID()],
  )).rows[0].result;
  const wrong = await run('fixture-quiz', { answer: 'other' });
  expect(wrong.correct).toBe(false);
  expect(wrong.feedback).toEqual({ complete: false, correct: false, explanation: 'Провери условието отново.' });
  const right = await run('fixture-quiz', { answer: 'chosen' });
  expect(right.feedback).toEqual({ complete: true, correct: true, explanation: 'Избраният довод е точен.' });
  expect((await run('fixture-matching', {})).correct).toBe(false);
  await expect(run('fixture-quiz', { answer: 'unknown' })).rejects.toThrow(/Invalid choice/);
  const read = (await db.query<{ result: Record<string, unknown> }>("SELECT public.academy_get_lesson_v2('s01-m01','l01-01') result")).rows[0].result;
  expect(JSON.stringify(read)).not.toContain('evaluation');
  expect(read.priorProgress).toMatchObject({ xp: 7 });
  await expect(db.query('SELECT * FROM academy_private.silk_road_release_lessons')).rejects.toThrow();
  await actor(db);
});

test('final exam requires 73 current completed versions and enforces coverage and critical decisions', async () => {
  await actor(db, 'authenticated', STUDENT);
  await expect(exam()).rejects.toThrow(/73/);
  await actor(db);
  await db.exec(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,completed_at)
    SELECT '${STUDENT}',id,published_version_id,now() FROM academy_lessons WHERE module_id LIKE 's01-%' AND lesson_id<>'l11-04'
    ON CONFLICT(user_id,academy_lesson_id) DO UPDATE SET version_id=EXCLUDED.version_id,completed_at=EXCLUDED.completed_at;`);
  await actor(db, 'authenticated', STUDENT);
  const incomplete = answerSet(); delete incomplete['fixture-0'];
  await expect(exam(incomplete)).rejects.toThrow(/incomplete/);
  const oneWeak = answerSet(); oneWeak['fixture-0'] = 'other'; oneWeak['fixture-1'] = 'other';
  expect((await exam(oneWeak)).correct).toBe(false); // 31/33 overall, but one group fails.
  const critical = answerSet(); critical['fixture-16'] = 'other';
  expect((await exam(critical)).feedback).toMatchObject({ criticalPassed: false, complete: false, criticalModules: ['s01-m06'] });
  const below = answerSet(); [0,3,6,9,12,15,18].forEach(i => { below[`fixture-${i}`] = 'other'; });
  expect((await exam(below)).correct).toBe(false); // 26/33, each group otherwise passes.
  const boundary = answerSet(); [0,3,6,9,12,15].forEach(i => { boundary[`fixture-${i}`] = 'other'; });
  const id = randomUUID(); const passed = await exam(boundary, id);
  expect(passed.correct).toBe(true); expect(passed.feedback).toMatchObject({ correctCount: 27, criticalPassed: true });
  expect(JSON.stringify(passed)).not.toContain('criticalQuestions');
  expect(await exam(boundary, id)).toEqual(passed);
  await expect(exam(answerSet(), id)).rejects.toThrow(/Attempt conflict/);
  await expect(exam()).rejects.toThrow(/already passed/);
  await actor(db);
});
