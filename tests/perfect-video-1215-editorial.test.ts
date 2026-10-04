import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createVideo1215Database } from './helpers/perfect-video-1215-db';
import { actor, learnerRecords, OTHER, STUDENT } from './helpers/silk-road-db';

const migration = readFileSync('supabase/migrations/20261004101702_perfect_video_modules_12_15_clear_practice.sql', 'utf8');
const release = 'perfect_video_modules_12_15_clear_practice_20261004';
const delivery = JSON.parse(execFileSync('python3', ['scripts/perfect-video/build_perfect_video_1215_delivery.py', '--json'], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })) as { stages: string[]; apply: string; cleanup: string; parts: number };
let db: PGlite;
let before: Awaited<ReturnType<typeof learnerRecords>>;
let identity: Record<string, unknown>[];
let original: Record<string, unknown>[];
let outside: Record<string, unknown>[];
let warnings: Map<string, unknown[]>;
type LearnerLesson = { versionChanged: boolean; blocks: { key: string }[]; progress: { current_block_key: string; completed_block_keys: string[]; block_state: Record<string, unknown>; xp: number; score_percent: number | null; mastery_status: string; completed_at: string | null } };

beforeAll(async () => {
  db = await createVideo1215Database();
  await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys,xp,score_percent,mastery_status,completed_at)
    SELECT $1,l.id,l.published_version_id,'summary','{"scenario_2":{"selected":"b"}}',array_agg(b.block_key ORDER BY b.position),sum(b.points),100,'mastered','2026-10-02'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id WHERE l.lesson_id='pv15-08' GROUP BY l.id`, [STUDENT]);
  await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys,xp,mastery_status)
    SELECT $1,l.id,l.published_version_id,'quiz_1','{"quiz_1":{"answer":"c"}}',ARRAY['objective','hook','principle'],4,'learning'
    FROM academy_lessons l WHERE l.lesson_id='pv12-01'`, [STUDENT]);
  await db.query(`INSERT INTO academy_lesson_attempts_v2(id,user_id,academy_lesson_id,version_id,block_id,payload,score,max_score,is_correct,feedback)
    SELECT gen_random_uuid(),$1,l.id,l.published_version_id,b.id,'{"answer":"c"}',0,2,false,'{"explanation":"Историческа обратна връзка, която не пренаписваме."}'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id WHERE l.lesson_id='pv12-01' AND b.block_key='quiz_1'`, [STUDENT]);
  await db.query(`INSERT INTO academy_private.lesson_progress_history(user_id,academy_lesson_id,version_id,snapshot,reason)
    SELECT user_id,academy_lesson_id,version_id,to_jsonb(p),'test-preserved-history' FROM academy_lesson_progress p WHERE user_id=$1 AND academy_lesson_id=(SELECT id FROM academy_lessons WHERE lesson_id='pv15-08')`, [STUDENT]);
  await db.query("INSERT INTO pdf_progress(user_id,module_id,lesson_id,page_number,total_pages,completed) VALUES($1,'s02-m15','pv15-08',1,1,true)", [STUDENT]);
  await db.query("INSERT INTO profiles(id,full_name,last_opened_lesson) VALUES($1,'Test Student','{\"moduleId\":\"s02-m12\",\"lessonId\":\"pv12-01\"}') ON CONFLICT(id) DO UPDATE SET full_name=EXCLUDED.full_name,last_opened_lesson=EXCLUDED.last_opened_lesson", [STUDENT]);
  await db.query("INSERT INTO academy_user_badges(user_id,badge_key,evidence) VALUES($1,'first-practice','{\"preserved\":true}') ON CONFLICT DO NOTHING", [STUDENT]);
  await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys,xp,score_percent,mastery_status,completed_at)
    SELECT $1,l.id,l.published_version_id,'exam','{}',array_agg(b.block_key ORDER BY b.position),sum(b.points),100,'mastered','2026-10-02'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id WHERE l.lesson_id='pv15-12' GROUP BY l.id`, [STUDENT]);
  before = await learnerRecords(db);
  identity = (await db.query('SELECT l.*,v.version_number FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id ORDER BY l.id')).rows;
  original = (await db.query('SELECT b.*,k.answer_key,k.scoring FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id ORDER BY b.id')).rows;
  warnings = new Map((await db.query<{ lesson_id: string; warnings: unknown[] }>("SELECT lesson_id,academy_private.lesson_validation(published_version_id)->'warnings' warnings FROM academy_lessons WHERE module_id IN ('s02-m12','s02-m13','s02-m14','s02-m15')")).rows.map(row => [row.lesson_id, row.warnings]));
  outside = (await db.query("SELECT to_jsonb(v) version,to_jsonb(b) block,to_jsonb(k) key FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id NOT IN ('s02-m12','s02-m13','s02-m14','s02-m15') ORDER BY b.id")).rows;
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

describe('compatible editorial publication of video modules 12–15', () => {
  it('preserves all seven populated learner tables, all pointers and grading identities, and lessons outside the release', async () => {
    for (const rows of Object.values(before)) expect(rows.length).toBeGreaterThan(0);
    expect(await learnerRecords(db)).toEqual(before);
    expect((await db.query('SELECT l.*,v.version_number FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id ORDER BY l.id')).rows).toEqual(identity);
    const now = new Map((await db.query<Record<string, unknown>>('SELECT b.*,k.answer_key,k.scoring FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id')).rows.map(row => [row.id, row]));
    expect(now.size).toBe(original.length);
    for (const old of original) {
      for (const key of ['id', 'version_id', 'block_key', 'position', 'block_type', 'required', 'points', 'answer_key', 'scoring']) expect(now.get(old.id)?.[key], `${old.block_key}/${key}`).toEqual(old[key]);
      if (['course_exam', 'submission'].includes(old.block_type as string)) expect(now.get(old.id)?.content).toEqual(old.content);
    }
    expect((await db.query("SELECT to_jsonb(v) version,to_jsonb(b) block,to_jsonb(k) key FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id NOT IN ('s02-m12','s02-m13','s02-m14','s02-m15') ORDER BY b.id")).rows).toEqual(outside);
    const archives = (await db.query<{ details: { before: { blocks: unknown[] }; publication_receipt?: Record<string, unknown> } }>("SELECT details FROM academy_lesson_audit WHERE details->>'release'=$1", [release])).rows;
    expect(archives).toHaveLength(57);
    expect(archives.reduce((n, a) => n + a.details.before.blocks.length, 0)).toBe(930);
    expect(archives.find(a => a.details.publication_receipt)?.details.publication_receipt).toMatchObject({ published_lessons: 57, blocks: 930, graded_checks: 265, learner_records_unchanged: true, lesson_identity_unchanged: true, grading_identity_unchanged: true });
  });

  it('keeps a partial cursor and completed lesson intact through the actual learner RPC, without a version reset', async () => {
    await actor(db, 'authenticated', STUDENT);
    const partial = (await db.query<{ lesson: LearnerLesson }>("SELECT academy_get_lesson_v2('s02-m12','pv12-01') lesson")).rows[0].lesson;
    const completed = (await db.query<{ lesson: LearnerLesson }>("SELECT academy_get_lesson_v2('s02-m15','pv15-08') lesson")).rows[0].lesson;
    const completedExam = (await db.query<{ lesson: LearnerLesson }>("SELECT academy_get_lesson_v2('s02-m15','pv15-12') lesson")).rows[0].lesson;
    expect(partial.versionChanged).toBe(false);
    expect(partial.progress).toMatchObject({ current_block_key: 'quiz_1', completed_block_keys: ['objective', 'hook', 'principle'], block_state: { quiz_1: { answer: 'c' } }, xp: 4, mastery_status: 'learning', completed_at: null });
    expect(completed.versionChanged).toBe(false);
    expect(completed.progress.completed_block_keys).toHaveLength(17);
    expect(completed.progress).toMatchObject({ current_block_key: 'summary', score_percent: 100, mastery_status: 'mastered' });
    expect(completed.progress.completed_at).toBeTruthy();
    expect(completedExam.versionChanged).toBe(false);
    expect(completedExam.progress).toMatchObject({ current_block_key: 'exam', score_percent: 100, mastery_status: 'mastered' });
    expect(completedExam.progress.completed_at).toBeTruthy();
    for (const bundle of [partial, completed, completedExam]) {
      expect(bundle.blocks.length).toBeGreaterThanOrEqual(7);
      expect(JSON.stringify(bundle)).not.toContain('answer_key');
      expect(JSON.stringify(bundle)).not.toContain('"evaluation"');
      expect(JSON.stringify(bundle)).not.toContain('"scoring"');
    }
    expect(await learnerRecords(db)).toEqual(before);
  });

  it('grades wrong and corrected attempts in all 260 retained checks and returns the revised explanation', async () => {
    type Check = { module_id: string; lesson_id: string; version_id: string; block_key: string; block_type: string; points: number; content: { options?: { id: string }[] }; answer_key: { correct?: string; order?: string[] }; feedback: { explanation: string } };
    const checks = (await db.query<Check>("SELECT l.module_id,l.lesson_id,b.version_id,b.block_key,b.block_type,b.points,b.content,k.answer_key,k.feedback FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id IN ('s02-m12','s02-m13','s02-m14','s02-m15') AND b.block_type<>'course_exam' ORDER BY l.lesson_id,b.position")).rows;
    expect(checks).toHaveLength(260);
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

  it('preserves the five exam contracts, threshold, final prerequisites and private answers through the real endpoints', async () => {
    type Exam = { lesson_id: string; version_id: string; points: number; content: { questions: { id: string; options: { id: string }[] }[] }; answer_key: { answers: Record<string, string> } };
    await actor(db);
    const exams = (await db.query<Exam>("SELECT l.lesson_id,b.version_id,b.points,b.content,k.answer_key FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.block_type='course_exam' ORDER BY l.lesson_id")).rows;
    expect(exams.map(exam => exam.content.questions.length)).toEqual([12, 12, 12, 12, 30]);
    const final = exams[4];
    await actor(db, 'authenticated', OTHER);
    await expect(db.query("SELECT academy_submit_course_exam('s02-m15',$1,$2,'exam',$3,$4)", [exams[0].lesson_id, exams[0].version_id, { answers: exams[0].answer_key.answers }, crypto.randomUUID()])).rejects.toThrow('Access denied');
    await actor(db, 'authenticated', STUDENT);
    await expect(db.query("SELECT academy_complete_lesson_block('s02-m15',$1,$2,'exam',$3,$4)", [exams[0].lesson_id, exams[0].version_id, { acknowledged: true }, crypto.randomUUID()])).rejects.toThrow('course exam endpoint');
    await expect(db.query("SELECT academy_submit_course_exam('s02-m15',$1,$2,'exam',$3,$4)", [final.lesson_id, final.version_id, { answers: final.answer_key.answers }, crypto.randomUUID()])).rejects.toThrow('12 previous module 15 lessons');
    await actor(db);
    await db.exec('BEGIN');
    try {
      await db.query("DELETE FROM academy_lesson_progress WHERE user_id=$1 AND academy_lesson_id IN (SELECT id FROM academy_lessons WHERE lesson_id BETWEEN 'pv15-09' AND 'pv15-13')", [STUDENT]);
      type Preparation = { lesson_id: string; version_id: string; block_key: string; block_type: string; answer_key: { correct?: string; order?: string[] } | null };
      const preparation = (await db.query<Preparation>("SELECT l.lesson_id,b.version_id,b.block_key,b.block_type,k.answer_key FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id='s02-m15' AND l.lesson_id BETWEEN 'pv15-01' AND 'pv15-13' AND b.required AND b.block_type<>'course_exam' ORDER BY l.lesson_id,b.position")).rows;
      await actor(db, 'authenticated', STUDENT);
      for (const block of preparation) {
        const payload = block.block_type === 'sequence_sort' ? { order: block.answer_key!.order } : block.block_type === 'scenario' ? { selected: block.answer_key!.correct } : block.block_type === 'quiz' ? { answer: block.answer_key!.correct } : { acknowledged: true };
        await db.query("SELECT academy_complete_lesson_block('s02-m15',$1,$2,$3,$4,$5)", [block.lesson_id, block.version_id, block.block_key, payload, crypto.randomUUID()]);
      }
      for (const exam of exams) {
        const total = exam.content.questions.length;
        const minimum = Math.ceil(total * 0.8);
        for (const passed of [minimum - 1, minimum]) {
          const answers = { ...exam.answer_key.answers };
          for (const q of exam.content.questions.slice(passed)) answers[q.id] = q.options.find(option => option.id !== answers[q.id])!.id;
          const result = (await db.query<{ result: { correct: boolean; score: number; maxScore: number; feedback: { complete: boolean; correctCount: number; totalQuestions: number; weakModules: string[] } } }>("SELECT academy_submit_course_exam('s02-m15',$1,$2,'exam',$3,$4) result", [exam.lesson_id, exam.version_id, { answers }, crypto.randomUUID()])).rows[0].result;
          expect(result.correct, exam.lesson_id).toBe(passed >= minimum);
          expect(result.feedback.complete).toBe(passed >= minimum);
          expect(result.feedback.correctCount).toBe(passed);
          expect(result.feedback.totalQuestions).toBe(total);
          expect(result.maxScore).toBe(exam.points);
          expect(result.score).toBe(Math.round(exam.points * passed / total));
          expect(result.feedback.weakModules.length).toBeGreaterThan(0);
          expect(result.feedback).not.toHaveProperty('answers');
          expect(result.feedback).not.toHaveProperty('answer_key');
          expect(result.feedback).not.toHaveProperty('questions');
        }
      }
      await actor(db);
      const completions = (await db.query<{ n: number }>("SELECT count(*)::int n FROM academy_lesson_progress p JOIN academy_lessons l ON l.id=p.academy_lesson_id WHERE p.user_id=$1 AND l.module_id='s02-m15' AND p.completed_at IS NOT NULL", [STUDENT])).rows[0].n;
      expect(completions).toBe(13);
    } finally { await db.exec('ROLLBACK'); await actor(db); }
    expect(await learnerRecords(db)).toEqual(before);
  }, 60000);

  it('validates every lesson and denies unpaid access to content, keys and audit snapshots', async () => {
    const validations = (await db.query<{ lesson_id: string; result: { errors: unknown[]; warnings: unknown[] } }>("SELECT l.lesson_id,academy_private.lesson_validation(l.published_version_id) result FROM academy_lessons l WHERE l.module_id IN ('s02-m12','s02-m13','s02-m14','s02-m15')")).rows;
    expect(validations).toHaveLength(57);
    expect([...warnings.entries()].filter(([, value]) => value.length)).toEqual([['pv15-07', ['retired_open_answer_block']]]);
    for (const { lesson_id, result } of validations) { expect(result.errors).toEqual([]); expect(result.warnings).toEqual(warnings.get(lesson_id)); }
    await actor(db, 'authenticated', OTHER);
    await expect(db.query("SELECT academy_get_lesson_v2('s02-m12','pv12-01')")).rejects.toThrow('Access denied');
    await expect(db.query('SELECT answer_key FROM academy_private.lesson_block_keys')).rejects.toThrow(/permission denied/);
    expect((await db.query('SELECT details FROM academy_lesson_audit')).rows).toEqual([]);
    await actor(db);
  });

  it('is repeatable without duplicate archives and rejects incomplete publication history', async () => {
    await db.exec(migration);
    await db.exec(delivery.apply);
    expect((await db.query<{ n: number }>("SELECT count(*)::int n FROM academy_lesson_audit WHERE details->>'release'=$1", [release])).rows[0].n).toBe(57);
    expect(await learnerRecords(db)).toEqual(before);
    await db.exec('BEGIN');
    try {
      await db.exec(`DELETE FROM academy_lesson_audit WHERE details->>'release'='${release}' AND academy_lesson_id=(SELECT id FROM academy_lessons WHERE lesson_id='pv15-13')`);
      await expect(db.exec(migration)).rejects.toThrow('Partial video modules 12–15 archive');
    } finally { await db.exec('ROLLBACK'); }
  });

  it('rejects source drift in the last lesson without partially publishing earlier lessons', async () => {
    const driftDb = await createVideo1215Database();
    try {
      await driftDb.exec("UPDATE academy_lesson_blocks SET content=jsonb_set(content,'{body}','\"Changed outside this release\"') WHERE block_key='objective' AND version_id=(SELECT published_version_id FROM academy_lessons WHERE lesson_id='pv15-13')");
      for (const stage of delivery.stages) await driftDb.exec(stage);
      const snapshot = async () => (await driftDb.query('SELECT (SELECT jsonb_agg(to_jsonb(b) ORDER BY id) FROM academy_lesson_blocks b) blocks,(SELECT jsonb_agg(to_jsonb(v) ORDER BY id) FROM academy_lesson_versions v) versions,(SELECT jsonb_agg(to_jsonb(a) ORDER BY id) FROM academy_lesson_audit a) audit')).rows;
      const prior = await snapshot();
      const students = await learnerRecords(driftDb);
      await expect(driftDb.exec(delivery.apply)).rejects.toThrow('Video source drift for pv15-13');
      expect(await snapshot()).toEqual(prior);
      expect(await learnerRecords(driftDb)).toEqual(students);
    } finally { await driftDb.close(); }
  }, 60000);

  it('rejects changed staged payload before altering any lesson or learner row', async () => {
    const stagedDb = await createVideo1215Database();
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
