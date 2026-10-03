import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { actor, createSilkDatabase, learnerRecords, STUDENT } from './helpers/silk-road-db';

const first = readFileSync('supabase/migrations/20261003130823_silk_road_m01_m02_editorial_refresh.sql', 'utf8');
const full = readFileSync('supabase/migrations/20261003143002_silk_road_all_modules_outcomes_and_practice.sql', 'utf8');
const start = readFileSync('supabase/migrations/20261003164254_silk_road_independent_practice_start.sql', 'utf8');
let db: PGlite;
let before: Awaited<ReturnType<typeof learnerRecords>>;
let identities: Record<string, unknown>[];
let original: Record<string, unknown>[];

beforeAll(async () => {
  db = await createSilkDatabase(true);
  await db.exec(first); await db.exec(full);
  if (!process.env.SILK_ROAD_SOURCE_SNAPSHOT) {
    // The existing generic fixture receives the precise three defects this release repairs.
    await db.query(`UPDATE academy_private.lesson_block_keys SET feedback='{"explanation":"Първите две са междинни действия."}'
      WHERE block_id=(SELECT b.id FROM academy_lesson_blocks b JOIN academy_lessons l ON l.published_version_id=b.version_id WHERE l.lesson_id='l02-06' AND b.block_key='quiz_2')`);
    await db.query(`UPDATE academy_lesson_blocks SET content='{"body":"Глави: 0:00 обещание; 0:30 цел и очаквания; 1:20 дрехи; 2:20 кадри; 3:20 време; 4:15 подбор; 5:15 обобщение. пакет. призив за действие: списък за проверкаа"}' WHERE version_id=(SELECT published_version_id FROM academy_lessons WHERE lesson_id='l05-06') AND block_key='model_solution'`);
    await db.query(`UPDATE academy_lesson_blocks SET content='{"body":"Например source=newsletter, medium=email, campaign=esen_portfolio."}' WHERE version_id=(SELECT published_version_id FROM academy_lessons WHERE lesson_id='l09-01') AND block_key='lesson_section_4'`);
    for (const [lesson, key, correct, labels] of [
      ['l05-06', 'quiz_1', 'a', ['Правилен запазен извод.', 'Гарантирани продажби.', 'Че видеото трябва да стане по-дълго.']],
      ['l09-01', 'quiz_3', 'c', ['Аналитиката винаги премахва точно 20%.', 'Шестте заявки задължително са спам.', 'Част може да не е проследена.']],
    ] as const) {
      await db.query(`UPDATE academy_lesson_blocks SET content=$1 WHERE version_id=(SELECT published_version_id FROM academy_lessons WHERE lesson_id=$2) AND block_key=$3`, [{ question: 'Запазен въпрос', options: labels.map((label, i) => ({ id: ['a', 'b', 'c'][i], label })) }, lesson, key]);
      await db.query(`UPDATE academy_private.lesson_block_keys SET answer_key=$1 WHERE block_id=(SELECT b.id FROM academy_lesson_blocks b JOIN academy_lessons l ON l.published_version_id=b.version_id WHERE l.lesson_id=$2 AND b.block_key=$3)`, [{ correct }, lesson, key]);
    }
  }
  await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys,xp,score_percent,mastery_status,completed_at)
    SELECT $1,l.id,l.published_version_id,'summary','{"quiz_2":{"answer":"b"}}',array_agg(b.block_key ORDER BY b.position),sum(b.points),100,'mastered','2026-10-02'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id AND b.required WHERE l.lesson_id='l11-04' GROUP BY l.id`, [STUDENT]);
  await db.query(`INSERT INTO academy_lesson_attempts_v2(id,user_id,academy_lesson_id,version_id,block_id,payload,score,max_score,is_correct,feedback)
    SELECT gen_random_uuid(),$1,l.id,l.published_version_id,b.id,'{"answer":"a"}',10,10,true,'{"explanation":"исторически резултат"}'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id WHERE l.lesson_id='l11-04' AND b.block_type='quiz'`, [STUDENT]);
  before = await learnerRecords(db);
  identities = (await db.query('SELECT id,module_id,lesson_id,published_version_id,draft_version_id FROM academy_lessons ORDER BY id')).rows;
  original = (await db.query(`SELECT b.id,b.block_key,b.version_id,b.block_type,b.required,b.points,b.content,k.answer_key,k.scoring FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id ORDER BY b.id`)).rows;
  await db.exec(start);
}, 60000);
afterAll(async () => { await db?.close(); });

describe('beginner release preserves all existing student results', () => {
  it('retains learner records, course identities, old correct answers and completion requirements exactly', async () => {
    expect(await learnerRecords(db)).toEqual(before);
    expect((await db.query('SELECT id,module_id,lesson_id,published_version_id,draft_version_id FROM academy_lessons ORDER BY id')).rows).toEqual(identities);
    const now = new Map((await db.query<Record<string, unknown>>(`SELECT b.*,k.answer_key,k.scoring FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id`)).rows.map(b => [b.id, b]));
    for (const old of original) for (const key of ['id', 'block_key', 'version_id', 'block_type', 'required', 'points', 'answer_key', 'scoring']) expect(now.get(old.id)?.[key], `${old.block_key}/${key}`).toEqual(old[key]);
    expect((await db.query(`SELECT count(*)::int n FROM academy_lesson_blocks WHERE block_key LIKE 'checkpoint_%_20261003' AND NOT required AND points=0`)).rows).toEqual([{ n: 6 }]);
    expect((await db.query(`SELECT count(*)::int n FROM academy_lesson_audit WHERE details->>'release'='silk_road_start_20261003' AND details?'before'`)).rows).toEqual([{ n: 10 }]);
  });
  it('repairs the source contradictions and uses correct UTM names without changing the original correct choices', async () => {
    const body = (await db.query<{ content: { body: string } }>(`SELECT content FROM academy_lesson_blocks WHERE version_id=(SELECT published_version_id FROM academy_lessons WHERE lesson_id='l05-06') AND block_key='model_solution'`)).rows[0].content.body;
    expect(body).not.toContain('проверкаа'); expect(body).not.toContain('0:30 цел');
    expect((body.match(/\d:\d\d/g) || []).length).toBe(6);
    const feedback = (await db.query<{ feedback: { explanation: string } }>(`SELECT k.feedback FROM academy_private.lesson_block_keys k JOIN academy_lesson_blocks b ON b.id=k.block_id JOIN academy_lessons l ON l.published_version_id=b.version_id WHERE l.lesson_id='l02-06' AND b.block_key='quiz_2'`)).rows[0].feedback;
    expect(feedback.explanation).toContain('след потвърдено приемане');
    const utm = (await db.query<{ content: { body: string } }>(`SELECT content FROM academy_lesson_blocks WHERE version_id=(SELECT published_version_id FROM academy_lessons WHERE lesson_id='l09-01') AND block_key='lesson_section_4'`)).rows[0].content.body;
    expect(utm).toContain('?utm_source=newsletter&utm_medium=email&utm_campaign=esen_portfolio');
  });
  it('is idempotent and rejects drift atomically instead of half-publishing', async () => {
    const count = (await db.query('SELECT count(*) n FROM academy_lesson_blocks')).rows;
    await db.exec(start); expect((await db.query('SELECT count(*) n FROM academy_lesson_blocks')).rows).toEqual(count);
    await db.exec('BEGIN');
    try {
      await db.exec("DELETE FROM academy_lesson_audit WHERE details->>'release'='silk_road_start_20261003' AND academy_lesson_id=(SELECT id FROM academy_lessons WHERE lesson_id='l01-01')");
      await expect(db.exec(start)).rejects.toThrow('Partial beginner release');
    } finally { await db.exec('ROLLBACK'); }
  });
  it('grades wrong and corrected attempts for all six new checks on the existing server evaluator, without changing completed-course XP', async () => {
    const checkpoints = (await db.query<{ module_id: string; lesson_id: string; version_id: string; block_key: string; block_type: string; answer_key: Record<string, unknown> }>(`SELECT l.module_id,l.lesson_id,b.version_id,b.block_key,b.block_type,k.answer_key FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.block_key LIKE 'checkpoint_%_20261003' ORDER BY b.block_key`)).rows;
    const prior = (await db.query(`SELECT xp,score_percent,mastery_status,completed_at FROM academy_lesson_progress WHERE academy_lesson_id=(SELECT id FROM academy_lessons WHERE lesson_id='l11-04')`)).rows;
    await actor(db, 'authenticated', STUDENT);
    for (const b of checkpoints) {
      const correct = b.block_type === 'matching' ? { matches: b.answer_key.matches } : b.block_type === 'calculator' ? { value: String(b.answer_key.value) } : { selected: b.answer_key.correct };
      const wrong = b.block_type === 'matching' ? { matches: {} } : b.block_type === 'calculator' ? { value: '-1' } : { selected: 'fixed' };
      for (const [payload, expected] of [[wrong, false], [correct, true]] as const) {
        const result = (await db.query<{ result: { correct: boolean; score: number; maxScore: number; feedback: { complete: boolean } } }>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) result', [b.module_id, b.lesson_id, b.version_id, b.block_key, payload, crypto.randomUUID()])).rows[0].result;
        expect(result.correct, b.block_key).toBe(expected); expect(result.feedback.complete).toBe(expected); expect(result.score).toBe(0); expect(result.maxScore).toBe(0);
      }
    }
    await actor(db);
    expect((await db.query(`SELECT xp,score_percent,mastery_status,completed_at FROM academy_lesson_progress WHERE academy_lesson_id=(SELECT id FROM academy_lessons WHERE lesson_id='l11-04')`)).rows).toEqual(prior);
  });
});
