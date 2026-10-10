import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, expect, test } from 'vitest';
import type { PGlite } from '@electric-sql/pglite';
import { actor, createSilkDatabase, STUDENT } from './helpers/silk-road-db';

const RELEASE = 'silk_road_market_ready_20261009';
const migration = readFileSync('supabase/migrations/20261009190315_silk_road_market_ready_publication.sql', 'utf8');
const [functions, publication] = migration.split('-- PUBLISH_MARKET_CURRICULUM');
let db: PGlite;
let oldProgress: unknown;
let oldVersion: string;

beforeAll(async () => {
  db = await createSilkDatabase(true);
  await db.exec('ALTER TABLE academy_lesson_blocks DROP CONSTRAINT academy_lesson_blocks_block_type_check');
  await db.exec(readFileSync('supabase/migrations/20261009081505_silk_road_market_ready_staging.sql', 'utf8'));
  await db.exec(functions);
  await db.exec(`UPDATE academy_lesson_versions SET change_note='silk_road_closed_learning_20261008';
    UPDATE academy_private.lesson_block_keys SET feedback='{"choices":{"a":"Проверено.","b":"Провери отново."}}';`);
  const lessons = (await db.query<{ id: string; module_id: string; lesson_id: string; published_version_id: string }>(
    "SELECT * FROM academy_lessons WHERE module_id LIKE 's01-%' ORDER BY module_id,lesson_id",
  )).rows;
  for (const l of lessons) {
    const blocks = (await db.query<{ block: Record<string, any> }>(`SELECT jsonb_build_object(
      'key',b.block_key,'position',b.position,'type',b.block_type,'title',b.title,'content',b.content,'required',b.required,'points',b.points)
      || CASE WHEN k.block_id IS NULL THEN '{}'::jsonb ELSE jsonb_build_object('evaluation',k.answer_key,'feedback',k.feedback,'scoring',k.scoring) END AS block
      FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
      WHERE b.version_id=$1 AND b.block_type<>'practical_response' ORDER BY b.position`, [l.published_version_id])).rows.map(r => r.block);
    // Deliberately change public content and private-only evaluation independently.
    blocks.find(b => b.key === 'lesson_section_1')!.content = { body: 'Обновено обяснение.' };
    blocks.find(b => b.key === 'quiz_2')!.evaluation = { correct: 'b' };
    blocks.push({ key: 'new-transfer', position: 500, type: 'scenario', title: 'Ново решение', required: true, points: 10,
      content: { prompt: 'Синтетична проверка.', options: [{ id: 'a', label: 'Условие А' }, { id: 'b', label: 'Условие Б' }] },
      evaluation: { correct: 'a' }, feedback: { choices: { a: 'Проверено.', b: 'Провери отново.' } } });
    if (l.lesson_id === 'l11-04') blocks.push({ key: 'fixture-exam', position: 600, type: 'course_exam', title: 'Синтетичен изпит', required: true, points: 100,
      content: { minimumPercent: 80, minimumGroupPercent: 60, questions: Array.from({ length: 33 }, (_, i) => ({
        id: `fixture-${i}`, moduleId: `s01-m${String(Math.floor(i / 3) + 1).padStart(2, '0')}`,
        prompt: `Синтетичен въпрос ${i}`, options: [{ id: 'a', label: 'Условие А' }, { id: 'b', label: 'Условие Б' }],
      })) }, evaluation: { answers: Object.fromEntries(Array.from({ length: 33 }, (_, i) => [`fixture-${i}`, 'a'])), criticalQuestions: ['fixture-16', 'fixture-21', 'fixture-27'] } });
    const payload = { module: l.module_id, lesson: l.lesson_id, title: 'Синтетична нова версия', subtitle: 'Условия',
      objective: 'Избери действие.', hook: 'Нов случай.', estimated_minutes: 15, change_note: RELEASE, blocks };
    await db.query(`INSERT INTO academy_private.silk_road_market_lessons(release_key,module_id,lesson_id,expected_version_id,expected_fingerprint,payload)
      SELECT $1,l.module_id,l.lesson_id,l.published_version_id,md5(to_jsonb(l)::text||to_jsonb(v)::text||coalesce((SELECT string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id)
      FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=v.id),'')),$2
      FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id WHERE l.id=$3`, [RELEASE, payload, l.id]);
  }
  await actor(db, 'postgres', STUDENT);
  oldVersion = lessons[0].published_version_id;
  for (const [key, payload] of [['objective', { acknowledged: true }], ['lesson_section_1', { acknowledged: true }], ['quiz_1', { answer: 'a' }], ['quiz_2', { answer: 'a' }]] as const) {
    await db.query("SELECT academy_private.complete_lesson_block('s01-m01','l01-01',$1,$2,$3,$4)", [oldVersion, key, payload, randomUUID()]);
  }
  oldProgress = (await db.query('SELECT to_jsonb(p) row FROM academy_lesson_progress p WHERE user_id=$1', [STUDENT])).rows[0].row;
}, 60000);
afterAll(async () => { await db?.close(); });

test('a private-key edit since staging aborts the whole publication', async () => {
  await db.exec('BEGIN');
  await db.exec("UPDATE academy_private.lesson_block_keys SET scoring='{\"changed\":true}' WHERE block_id IN (SELECT b.id FROM academy_lesson_blocks b JOIN academy_lessons l ON l.published_version_id=b.version_id WHERE l.lesson_id='l11-04')");
  await expect(db.exec(publication)).rejects.toThrow(/changed since staging/);
  await db.exec('ROLLBACK');
  expect((await db.query('SELECT count(*)::int n FROM academy_lesson_versions WHERE change_note=$1', [RELEASE])).rows[0].n).toBe(0);
});

test('publication preserves attempts and exact history, carrying only unchanged work', async () => {
  const attempts = (await db.query('SELECT to_jsonb(a) row FROM academy_lesson_attempts_v2 a ORDER BY id')).rows;
  await db.exec(publication);
  expect((await db.query('SELECT to_jsonb(a) row FROM academy_lesson_attempts_v2 a ORDER BY id')).rows).toEqual(attempts);
  expect((await db.query('SELECT snapshot FROM academy_private.lesson_progress_history WHERE version_id=$1', [oldVersion])).rows[0].snapshot).toEqual(oldProgress);
  const p = (await db.query('SELECT * FROM academy_lesson_progress WHERE user_id=$1', [STUDENT])).rows[0];
  expect(p.completed_block_keys).toEqual(['objective', 'quiz_1']);
  expect(Object.keys(p.block_state as object).sort()).toEqual(['objective', 'quiz_1']);
  expect(p.xp).toBe(15); expect(p.completed_at).toBeNull(); expect(p.score_percent).toBeNull();
  expect(p.current_block_key).toBe('lesson_section_1');
  expect(p.version_id).not.toBe(oldVersion);
  await db.exec(publication);
  expect((await db.query('SELECT count(*)::int n FROM academy_lesson_versions WHERE change_note=$1', [RELEASE])).rows[0].n).toBe(74);
});

test('stale writes cannot replace migrated progress and wrong transfer answers do not complete', async () => {
  await expect(db.query('UPDATE academy_lesson_progress SET version_id=$1 WHERE user_id=$2', [oldVersion, STUDENT])).rejects.toThrow(/version changed/);
  const version = (await db.query("SELECT published_version_id FROM academy_lessons WHERE lesson_id='l01-01'")).rows[0].published_version_id;
  await actor(db, 'authenticated', STUDENT);
  const r = (await db.query<{ r: { feedback: unknown } }>("SELECT public.academy_complete_lesson_block('s01-m01','l01-01',$1,'new-transfer',$2,$3) r", [version, { selected: 'b' }, randomUUID()])).rows[0].r;
  expect(r.feedback).toEqual({ complete: false, correct: false, explanation: 'Провери отново.' });
  await expect(db.query('SELECT * FROM academy_private.silk_road_market_lessons')).rejects.toThrow();
  await actor(db);
});
