import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createVideoDatabase } from './helpers/perfect-video-start-db';
import { actor, learnerRecords, STUDENT } from './helpers/silk-road-db';

const migration = readFileSync('supabase/migrations/20261003191939_perfect_video_m01_m03_results_and_practice.sql', 'utf8');
let db: PGlite;
let before: Awaited<ReturnType<typeof learnerRecords>>;
let identity: Record<string, unknown>[];
let original: Record<string, unknown>[];
let resumed: { versionChanged: boolean; blocks: { key: string }[]; progress: { current_block_key: string; completed_block_keys: string[]; block_state: Record<string, unknown> } };

beforeAll(async () => {
  db = await createVideoDatabase();
  await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys,xp,score_percent,mastery_status,completed_at)
    SELECT $1,l.id,l.published_version_id,'field_note','{"scenario_transfer":{"selected":"b"}}',array_agg(b.block_key ORDER BY b.position),sum(b.points),100,'mastered','2026-10-02'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id WHERE l.lesson_id='pv03-21' GROUP BY l.id`, [STUDENT]);
  await db.query(`INSERT INTO academy_lesson_attempts_v2(id,user_id,academy_lesson_id,version_id,block_id,payload,score,max_score,is_correct,feedback)
    SELECT gen_random_uuid(),$1,l.id,l.published_version_id,b.id,'{"answer":"a"}',2,2,true,'{"explanation":"Историческа обратна връзка, която не пренаписваме."}'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id WHERE l.lesson_id='pv03-02' AND b.block_key='knowledge_check'`, [STUDENT]);
  before = await learnerRecords(db);
  identity = (await db.query('SELECT l.id,l.module_id,l.lesson_id,l.published_version_id,l.draft_version_id,v.version_number FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id ORDER BY l.id')).rows;
  original = (await db.query(`SELECT b.*,k.answer_key,k.feedback,k.scoring FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id ORDER BY b.id`)).rows;
  await db.exec(migration);
  await actor(db, 'authenticated', STUDENT);
  resumed = (await db.query<{ lesson: typeof resumed }>("SELECT academy_get_lesson_v2('s02-m03','pv03-21') lesson")).rows[0].lesson;
  await actor(db);
}, 60000);
afterAll(async () => { await db?.close(); });

describe('compatible video modules 1–3 release', () => {
  it('preserves all seven learner tables and all original identities, requirements, points and correct answers', async () => {
    expect(await learnerRecords(db)).toEqual(before);
    expect((await db.query('SELECT l.id,l.module_id,l.lesson_id,l.published_version_id,l.draft_version_id,v.version_number FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id ORDER BY l.id')).rows).toEqual(identity);
    const now = new Map((await db.query<Record<string, unknown>>(`SELECT b.*,k.answer_key,k.feedback,k.scoring FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id`)).rows.map(row => [row.id, row]));
    for (const old of original) {
      for (const key of ['id', 'version_id', 'block_key', 'position', 'block_type', 'required', 'points', 'answer_key', 'scoring']) expect(now.get(old.id)?.[key], `${old.block_key}/${key}`).toEqual(old[key]);
      const revisedProse = ['objective', 'field_note'].includes(old.block_key as string) ||
        ['core', 'summary'].includes(old.block_key as string) && original.some(candidate => candidate.id === old.id && JSON.stringify(candidate.content).includes('два пъти по-дълга от кадъра'));
      if (!revisedProse) expect(now.get(old.id)?.content).toEqual(old.content);
      if (!(old.block_key === 'knowledge_check' && JSON.stringify(old.feedback).includes('два пъти по-дълга от кадъра'))) expect(now.get(old.id)?.feedback).toEqual(old.feedback);
    }
    expect((await db.query("SELECT count(*)::int n FROM academy_lesson_audit WHERE details->>'release'='perfect_video_results_20261003' AND details?'before'")).rows).toEqual([{ n: 65 }]);
    expect((await db.query("SELECT count(*)::int n FROM academy_lesson_blocks WHERE block_key LIKE 'checkpoint_video_%_20261003' AND NOT required AND points=0")).rows).toEqual([{ n: 10 }]);
  });
  it('adds authored outputs to all 65 openings and repairs every occurrence of the inverted shutter explanation', async () => {
    const openings = (await db.query<{ content: { body: string; deliverable: string; check: string } }>(`SELECT b.content FROM academy_lesson_blocks b JOIN academy_lessons l ON l.published_version_id=b.version_id WHERE l.module_id IN ('s02-m01','s02-m02','s02-m03') AND b.block_key='objective'`)).rows;
    expect(openings).toHaveLength(65);
    for (const { content } of openings) { expect(content.body).toMatch(/^Ще /); expect(content.body.length).toBeGreaterThan(100); expect(content.deliverable.length).toBeGreaterThan(80); expect(content.check.length).toBeGreaterThan(70); expect(content.body).not.toContain('в два случая'); }
    const shutter = (await db.query(`SELECT b.content,k.feedback FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id JOIN academy_lessons l ON l.published_version_id=b.version_id WHERE l.lesson_id='pv03-02'`)).rows;
    expect(JSON.stringify(shutter)).not.toContain('два пъти по-дълга от кадъра');
    expect(JSON.stringify(shutter)).toContain('половината от времето на един кадър');
    const receipt = (await db.query<{ details: { publication_receipt: Record<string, unknown> } }>("SELECT details FROM academy_lesson_audit WHERE details->>'release'='perfect_video_results_20261003' AND details?'publication_receipt'")).rows[0].details.publication_receipt;
    expect(receipt).toMatchObject({ published_lessons: 65, optional_blocks: 16, independent_checks: 10, learner_records_unchanged: true, lesson_identity_unchanged: true, correct_answers_unchanged: true });
  });
  it('grades a wrong and corrected attempt in each new checkpoint, while old completed XP and mastery remain unchanged', async () => {
    const prior = (await db.query("SELECT xp,score_percent,mastery_status,completed_at FROM academy_lesson_progress WHERE academy_lesson_id=(SELECT id FROM academy_lessons WHERE lesson_id='pv03-21')")).rows;
    const external = (await learnerRecords(db));
    const checks = (await db.query<{ module_id: string; lesson_id: string; version_id: string; block_key: string; block_type: string; content: { options?: { id: string }[] }; answer_key: Record<string, unknown> }>(`SELECT l.module_id,l.lesson_id,b.version_id,b.block_key,b.block_type,b.content,k.answer_key FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.block_key LIKE 'checkpoint_video_%_20261003' ORDER BY b.block_key`)).rows;
    await actor(db, 'authenticated', STUDENT);
    for (const b of checks) {
      const correct = b.block_type === 'matching' ? { matches: b.answer_key.matches } : b.block_type === 'calculator' ? { value: String(b.answer_key.value) } : { selected: b.answer_key.correct };
      const wrong = b.block_type === 'matching' ? { matches: {} } : b.block_type === 'calculator' ? { value: '-1' } : { selected: b.content.options?.find(option => option.id !== b.answer_key.correct)?.id };
      for (const [payload, expected] of [[wrong, false], [correct, true]] as const) {
        const result = (await db.query<{ result: { correct: boolean; score: number; maxScore: number; feedback: { complete: boolean } } }>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) result', [b.module_id, b.lesson_id, b.version_id, b.block_key, payload, crypto.randomUUID()])).rows[0].result;
        expect(result.correct, b.block_key).toBe(expected); expect(result.feedback.complete).toBe(expected); expect(result.score).toBe(0); expect(result.maxScore).toBe(0);
      }
    }
    await actor(db);
    expect((await db.query("SELECT xp,score_percent,mastery_status,completed_at FROM academy_lesson_progress WHERE academy_lesson_id=(SELECT id FROM academy_lessons WHERE lesson_id='pv03-21')")).rows).toEqual(prior);
    const after = await learnerRecords(db);
    for (const key of ['public.pdf_progress', 'public.profiles', 'public.academy_access_grants', 'public.academy_user_badges', 'academy_private.lesson_progress_history']) expect(after[key as keyof typeof after]).toEqual(external[key as keyof typeof external]);
  });
  it('does not expose private keys through the real learner RPC or mark a new checkpoint passed by old completion', async () => {
    expect(resumed.versionChanged).toBe(false);
    expect(resumed.progress.current_block_key).toBe('field_note');
    expect(resumed.progress.block_state).toEqual({ scenario_transfer: { selected: 'b' } });
    expect(resumed.blocks.some(block => block.key === 'checkpoint_video_handoff_20261003')).toBe(true);
    expect(resumed.progress.completed_block_keys).not.toContain('checkpoint_video_handoff_20261003');
    expect(JSON.stringify(resumed)).not.toContain('answer_key'); expect(JSON.stringify(resumed)).not.toContain('"evaluation"');
  });
  it('is repeatable without duplicates and rejects a partial archive atomically', async () => {
    const counts = (await db.query('SELECT count(*)::int n FROM academy_lesson_blocks')).rows;
    await db.exec(migration); expect((await db.query('SELECT count(*)::int n FROM academy_lesson_blocks')).rows).toEqual(counts);
    await db.exec('BEGIN');
    try {
      await db.exec("DELETE FROM academy_lesson_audit WHERE details->>'release'='perfect_video_results_20261003' AND academy_lesson_id=(SELECT id FROM academy_lessons WHERE lesson_id='pv01-01')");
      await expect(db.exec(migration)).rejects.toThrow('Partial video results release');
    } finally { await db.exec('ROLLBACK'); }
  });
  it('rejects a changed source late in the release without leaving early lessons partially updated', async () => {
    const driftDb = await createVideoDatabase();
    try {
      await driftDb.exec("UPDATE academy_lesson_blocks SET content=jsonb_set(content,'{body}','\"Changed outside this release\"') WHERE block_key='objective' AND version_id=(SELECT published_version_id FROM academy_lessons WHERE lesson_id='pv03-21')");
      const snapshot = async () => (await driftDb.query('SELECT (SELECT jsonb_agg(to_jsonb(b) ORDER BY id) FROM academy_lesson_blocks b) blocks,(SELECT jsonb_agg(to_jsonb(v) ORDER BY id) FROM academy_lesson_versions v) versions,(SELECT jsonb_agg(to_jsonb(a) ORDER BY id) FROM academy_lesson_audit a) audit')).rows;
      const prior = await snapshot();
      const students = await learnerRecords(driftDb);
      await expect(driftDb.exec(migration)).rejects.toThrow('Video source drift for pv03-21');
      expect(await snapshot()).toEqual(prior);
      expect(await learnerRecords(driftDb)).toEqual(students);
      const definition = (await driftDb.query<{ definition: string }>("SELECT pg_get_functiondef('academy_private.refresh_lesson_progress(uuid,uuid)'::regprocedure) definition")).rows[0].definition;
      await driftDb.exec(definition.replace('BEGIN\n', 'BEGIN\n  -- Synthetic changed-function fixture\n'));
      await expect(driftDb.exec(migration)).rejects.toThrow('Video progress function drift');
      expect(await snapshot()).toEqual(prior);
    } finally { await driftDb.close(); }
  }, 60000);
});
