import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createVideo711Database } from './helpers/perfect-video-711-db';
import { actor, learnerRecords, OTHER, STUDENT } from './helpers/silk-road-db';

const migration = readFileSync('supabase/migrations/20261004083926_perfect_video_modules_7_11_clear_practice.sql', 'utf8');
const release = 'perfect_video_modules_7_11_clear_practice_20261004';
const delivery = JSON.parse(execFileSync('python3', ['scripts/perfect-video/build_perfect_video_711_delivery.py', '--json'], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })) as { stages: string[]; apply: string; cleanup: string; parts: number };
let db: PGlite;
let before: Awaited<ReturnType<typeof learnerRecords>>;
let identity: Record<string, unknown>[];
let original: Record<string, unknown>[];
let outside: Record<string, unknown>[];
type LearnerLesson = { versionChanged: boolean; blocks: { key: string }[]; progress: { current_block_key: string; completed_block_keys: string[]; block_state: Record<string, unknown>; xp: number; score_percent: number | null; mastery_status: string; completed_at: string | null } };

beforeAll(async () => {
  db = await createVideo711Database();
  await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys,xp,score_percent,mastery_status,completed_at)
    SELECT $1,l.id,l.published_version_id,'summary','{"scenario_2":{"selected":"b"}}',array_agg(b.block_key ORDER BY b.position),sum(b.points),100,'mastered','2026-10-02'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id WHERE l.lesson_id='pv11-16' GROUP BY l.id`, [STUDENT]);
  await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys,xp,mastery_status)
    SELECT $1,l.id,l.published_version_id,'quiz_1','{"quiz_1":{"answer":"c"}}',ARRAY['objective','hook','principle'],4,'learning'
    FROM academy_lessons l WHERE l.lesson_id='pv07-01'`, [STUDENT]);
  await db.query(`INSERT INTO academy_lesson_attempts_v2(id,user_id,academy_lesson_id,version_id,block_id,payload,score,max_score,is_correct,feedback)
    SELECT gen_random_uuid(),$1,l.id,l.published_version_id,b.id,'{"answer":"c"}',0,2,false,'{"explanation":"Историческа обратна връзка, която не пренаписваме."}'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id WHERE l.lesson_id='pv07-01' AND b.block_key='quiz_1'`, [STUDENT]);
  await db.query(`INSERT INTO academy_private.lesson_progress_history(user_id,academy_lesson_id,version_id,snapshot,reason)
    SELECT user_id,academy_lesson_id,version_id,to_jsonb(p),'test-preserved-history' FROM academy_lesson_progress p WHERE user_id=$1 AND academy_lesson_id=(SELECT id FROM academy_lessons WHERE lesson_id='pv11-16')`, [STUDENT]);
  await db.query("INSERT INTO pdf_progress(user_id,module_id,lesson_id,page_number,total_pages,completed) VALUES($1,'s02-m11','pv11-16',1,1,true)", [STUDENT]);
  await db.query("INSERT INTO profiles(id,full_name,last_opened_lesson) VALUES($1,'Test Student','{\"moduleId\":\"s02-m07\",\"lessonId\":\"pv07-01\"}') ON CONFLICT(id) DO UPDATE SET full_name=EXCLUDED.full_name,last_opened_lesson=EXCLUDED.last_opened_lesson", [STUDENT]);
  await db.query("INSERT INTO academy_user_badges(user_id,badge_key,evidence) VALUES($1,'first-practice','{\"preserved\":true}') ON CONFLICT DO NOTHING", [STUDENT]);
  before = await learnerRecords(db);
  identity = (await db.query('SELECT l.*,v.version_number FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id ORDER BY l.id')).rows;
  original = (await db.query('SELECT b.*,k.answer_key,k.scoring FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id ORDER BY b.id')).rows;
  outside = (await db.query("SELECT to_jsonb(v) version,to_jsonb(b) block,to_jsonb(k) key FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id NOT IN ('s02-m07','s02-m08','s02-m09','s02-m10','s02-m11') ORDER BY b.id")).rows;
  for (const stage of delivery.stages) await db.exec(stage);
  for (const user of [STUDENT, OTHER]) {
    await actor(db, 'authenticated', user);
    expect((await db.query('SELECT details FROM academy_lesson_audit')).rows).toEqual([]);
  }
  await actor(db);
  await db.exec(delivery.apply);
  await db.exec(delivery.cleanup);
}, 60000);
afterAll(async () => { await db?.close(); });

describe('compatible editorial publication of video modules 7–11', () => {
  it('preserves all seven populated learner tables, all pointers and grading identities, and lessons outside the release', async () => {
    for (const rows of Object.values(before)) expect(rows.length).toBeGreaterThan(0);
    expect(await learnerRecords(db)).toEqual(before);
    expect((await db.query('SELECT l.*,v.version_number FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id ORDER BY l.id')).rows).toEqual(identity);
    const now = new Map((await db.query<Record<string, unknown>>('SELECT b.*,k.answer_key,k.scoring FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id')).rows.map(row => [row.id, row]));
    expect(now.size).toBe(original.length);
    for (const old of original) {
      for (const key of ['id', 'version_id', 'block_key', 'position', 'block_type', 'required', 'points', 'answer_key', 'scoring']) expect(now.get(old.id)?.[key], `${old.block_key}/${key}`).toEqual(old[key]);
    }
    expect((await db.query("SELECT to_jsonb(v) version,to_jsonb(b) block,to_jsonb(k) key FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id NOT IN ('s02-m07','s02-m08','s02-m09','s02-m10','s02-m11') ORDER BY b.id")).rows).toEqual(outside);
    const archives = (await db.query<{ details: { before: { blocks: unknown[] }; publication_receipt?: Record<string, unknown> } }>("SELECT details FROM academy_lesson_audit WHERE details->>'release'=$1", [release])).rows;
    expect(archives).toHaveLength(75);
    expect(archives.reduce((n, a) => n + a.details.before.blocks.length, 0)).toBe(1282);
    expect(archives.find(a => a.details.publication_receipt)?.details.publication_receipt).toMatchObject({ published_lessons: 75, blocks: 1282, graded_checks: 375, learner_records_unchanged: true, lesson_identity_unchanged: true, grading_identity_unchanged: true });
  });

  it('keeps a partial cursor and completed lesson intact through the actual learner RPC, without a version reset', async () => {
    await actor(db, 'authenticated', STUDENT);
    const partial = (await db.query<{ lesson: LearnerLesson }>("SELECT academy_get_lesson_v2('s02-m07','pv07-01') lesson")).rows[0].lesson;
    const completed = (await db.query<{ lesson: LearnerLesson }>("SELECT academy_get_lesson_v2('s02-m11','pv11-16') lesson")).rows[0].lesson;
    expect(partial.versionChanged).toBe(false);
    expect(partial.progress).toMatchObject({ current_block_key: 'quiz_1', completed_block_keys: ['objective', 'hook', 'principle'], block_state: { quiz_1: { answer: 'c' } }, xp: 4, mastery_status: 'learning', completed_at: null });
    expect(completed.versionChanged).toBe(false);
    expect(completed.progress.completed_block_keys).toHaveLength(18);
    expect(completed.progress).toMatchObject({ current_block_key: 'summary', score_percent: 100, mastery_status: 'mastered' });
    expect(completed.progress.completed_at).toBeTruthy();
    for (const bundle of [partial, completed]) {
      expect(bundle.blocks.length).toBeGreaterThanOrEqual(13);
      expect(JSON.stringify(bundle)).not.toContain('answer_key');
      expect(JSON.stringify(bundle)).not.toContain('"evaluation"');
      expect(JSON.stringify(bundle)).not.toContain('"scoring"');
    }
    expect(await learnerRecords(db)).toEqual(before);
  });

  it('grades wrong and corrected attempts in all 375 retained checks and returns the revised explanation', async () => {
    type Check = { module_id: string; lesson_id: string; version_id: string; block_key: string; block_type: string; points: number; content: { options?: { id: string }[] }; answer_key: { correct?: string; order?: string[] }; feedback: { explanation: string } };
    const checks = (await db.query<Check>("SELECT l.module_id,l.lesson_id,b.version_id,b.block_key,b.block_type,b.points,b.content,k.answer_key,k.feedback FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id IN ('s02-m07','s02-m08','s02-m09','s02-m10','s02-m11') ORDER BY l.lesson_id,b.position")).rows;
    expect(checks).toHaveLength(375);
    await db.exec('BEGIN');
    try {
      await actor(db, 'authenticated', STUDENT);
      for (const check of checks) {
        const correct = check.block_type === 'sequence_sort' ? { order: check.answer_key.order } : check.block_type === 'scenario' ? { selected: check.answer_key.correct } : { answer: check.answer_key.correct };
        const wrongId = check.content.options?.find(option => option.id !== check.answer_key.correct)?.id;
        const wrong = check.block_type === 'sequence_sort' ? { order: [...check.answer_key.order!].reverse() } : check.block_type === 'scenario' ? { selected: wrongId } : { answer: wrongId };
        for (const [payload, expected] of [[wrong, false], [correct, true]] as const) {
          const result = (await db.query<{ result: { correct: boolean; score: number; maxScore: number; feedback: { complete: boolean; explanation: string } } }>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) result', [check.module_id, check.lesson_id, check.version_id, check.block_key, payload, crypto.randomUUID()])).rows[0].result;
          expect(result.correct, `${check.lesson_id}/${check.block_key}`).toBe(expected);
          expect(result.feedback.complete).toBe(expected);
          expect(result.maxScore).toBe(check.points);
          expect(result.score).toBe(expected ? check.points : 0);
          expect(result.feedback.explanation).toBe(check.feedback.explanation);
          expect(result.feedback.explanation.trim()).toBeTruthy();
        }
      }
    } finally { await db.exec('ROLLBACK'); await actor(db); }
    expect(await learnerRecords(db)).toEqual(before);
  }, 60000);

  it('validates every lesson and denies unpaid access to content, keys and audit snapshots', async () => {
    const validations = (await db.query<{ result: { errors: unknown[]; warnings: unknown[] } }>("SELECT academy_private.lesson_validation(l.published_version_id) result FROM academy_lessons l WHERE l.module_id IN ('s02-m07','s02-m08','s02-m09','s02-m10','s02-m11')")).rows;
    expect(validations).toHaveLength(75);
    for (const { result } of validations) { expect(result.errors).toEqual([]); expect(result.warnings).toEqual([]); }
    await actor(db, 'authenticated', OTHER);
    await expect(db.query("SELECT academy_get_lesson_v2('s02-m07','pv07-01')")).rejects.toThrow('Access denied');
    await expect(db.query('SELECT answer_key FROM academy_private.lesson_block_keys')).rejects.toThrow(/permission denied/);
    expect((await db.query('SELECT details FROM academy_lesson_audit')).rows).toEqual([]);
    await actor(db);
  });

  it('is repeatable without duplicate archives and rejects incomplete publication history', async () => {
    await db.exec(migration);
    await db.exec(delivery.apply);
    expect((await db.query<{ n: number }>("SELECT count(*)::int n FROM academy_lesson_audit WHERE details->>'release'=$1", [release])).rows[0].n).toBe(75);
    expect(await learnerRecords(db)).toEqual(before);
    await db.exec('BEGIN');
    try {
      await db.exec(`DELETE FROM academy_lesson_audit WHERE details->>'release'='${release}' AND academy_lesson_id=(SELECT id FROM academy_lessons WHERE lesson_id='pv11-16')`);
      await expect(db.exec(migration)).rejects.toThrow('Partial video modules 7–11 archive');
    } finally { await db.exec('ROLLBACK'); }
  });

  it('rejects source drift in the last lesson without partially publishing earlier lessons', async () => {
    const driftDb = await createVideo711Database();
    try {
      await driftDb.exec("UPDATE academy_lesson_blocks SET content=jsonb_set(content,'{body}','\"Changed outside this release\"') WHERE block_key='objective' AND version_id=(SELECT published_version_id FROM academy_lessons WHERE lesson_id='pv11-16')");
      for (const stage of delivery.stages) await driftDb.exec(stage);
      const snapshot = async () => (await driftDb.query('SELECT (SELECT jsonb_agg(to_jsonb(b) ORDER BY id) FROM academy_lesson_blocks b) blocks,(SELECT jsonb_agg(to_jsonb(v) ORDER BY id) FROM academy_lesson_versions v) versions,(SELECT jsonb_agg(to_jsonb(a) ORDER BY id) FROM academy_lesson_audit a) audit')).rows;
      const prior = await snapshot();
      const students = await learnerRecords(driftDb);
      await expect(driftDb.exec(delivery.apply)).rejects.toThrow('Video source drift for pv11-16');
      expect(await snapshot()).toEqual(prior);
      expect(await learnerRecords(driftDb)).toEqual(students);
    } finally { await driftDb.close(); }
  }, 60000);

  it('rejects changed staged payload before altering any lesson or learner row', async () => {
    const stagedDb = await createVideo711Database();
    try {
      for (const stage of delivery.stages) await stagedDb.exec(stage);
      await stagedDb.query("UPDATE academy_lesson_audit SET details=jsonb_set(details,'{payload_text}',to_jsonb((details->>'payload_text')||' ')) WHERE details->>'delivery_for'=$1 AND (details->>'delivery_part')::integer=$2", [release, delivery.parts]);
      const snapshot = async () => (await stagedDb.query('SELECT (SELECT jsonb_agg(to_jsonb(b) ORDER BY id) FROM academy_lesson_blocks b) blocks,(SELECT jsonb_agg(to_jsonb(v) ORDER BY id) FROM academy_lesson_versions v) versions,(SELECT jsonb_agg(to_jsonb(a) ORDER BY id) FROM academy_lesson_audit a) audit')).rows;
      const prior = await snapshot();
      const students = await learnerRecords(stagedDb);
      await expect(stagedDb.exec(delivery.apply)).rejects.toThrow('Video delivery payload hash mismatch');
      expect(await snapshot()).toEqual(prior);
      expect(await learnerRecords(stagedDb)).toEqual(students);
    } finally { await stagedDb.close(); }
  }, 60000);
});
