import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { LEARNING_SECTIONS } from '../src/mocks/learning-platform';
import { actor, createSilkDatabase, learnerRecords, OTHER, STUDENT } from './helpers/silk-road-db';

const release = readFileSync('supabase/migrations/20261003130823_silk_road_m01_m02_editorial_refresh.sql', 'utf8');
let db: PGlite;
let before: Awaited<ReturnType<typeof learnerRecords>>;
let oldBlocks: Record<string, unknown>[];
let identities: Record<string, unknown>[];

beforeAll(async () => {
  db = await createSilkDatabase();
  // A partial lesson retains its exact cursor, drafts, score and activity times.
  await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,
    block_state,completed_block_keys,xp,score_percent,mastery_status,started_at,last_activity_at)
    SELECT $1,l.id,l.published_version_id,'lesson_section_2','{"quiz_2":{"answer":"b"}}',
    ARRAY['objective','lesson_section_1','quiz_1'],20,50,'learning','2026-09-28','2026-10-02'
    FROM academy_lessons l WHERE l.lesson_id='l01-01'`, [STUDENT]);
  // Completed M02 work must stay completed, including after a new zero-XP practice.
  await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,
    completed_block_keys,xp,score_percent,mastery_status,completed_at,started_at,last_activity_at)
    SELECT $1,l.id,l.published_version_id,'summary',array_agg(b.block_key ORDER BY b.position),sum(b.points),100,
    'mastered','2026-10-01','2026-09-28','2026-10-02'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id AND b.required
    WHERE l.lesson_id='l02-01' GROUP BY l.id`, [STUDENT]);
  await db.query(`INSERT INTO academy_lesson_attempts_v2(id,user_id,academy_lesson_id,version_id,block_id,
    payload,score,max_score,is_correct,feedback,created_at)
    SELECT gen_random_uuid(),$1,l.id,l.published_version_id,b.id,jsonb_build_object('answer',
      CASE WHEN l.lesson_id='l01-01' AND b.block_key='quiz_2' THEN 'b' ELSE 'a' END),
      CASE WHEN l.lesson_id='l01-01' AND b.block_key='quiz_2' THEN 0 ELSE 10 END,10,
      NOT(l.lesson_id='l01-01' AND b.block_key='quiz_2'),'{}','2026-10-02'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id
    WHERE (l.lesson_id='l01-01' AND b.block_key IN ('quiz_1','quiz_2'))
      OR (l.lesson_id='l02-01' AND b.block_type='quiz')`, [STUDENT]);
  await db.query(`UPDATE profiles SET last_opened_lesson='{"moduleId":"s01-m01","lessonId":"l01-01","timestamp":"2026-10-02T00:00:00Z"}' WHERE id=$1`, [STUDENT]);
  before = await learnerRecords(db);
  identities = (await db.query('SELECT id,module_id,lesson_id,published_version_id,draft_version_id FROM academy_lessons ORDER BY module_id,lesson_id')).rows;
  oldBlocks = (await db.query(`SELECT b.*,k.answer_key,k.feedback,k.scoring FROM academy_lesson_blocks b
    LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id ORDER BY b.id`)).rows;
  await db.exec(release);
}, 60000);

afterAll(async () => { await db?.close(); });

describe('M01/M02 editorial continuation', () => {
  it('keeps every learner record, bookmark, grant, score and timestamp byte-for-byte', async () => {
    expect(await learnerRecords(db)).toEqual(before);
    expect((await db.query('SELECT id,module_id,lesson_id,published_version_id,draft_version_id FROM academy_lessons ORDER BY module_id,lesson_id')).rows).toEqual(identities);
  });

  it('preserves the original arguments and all assessment identities and rules', async () => {
    const blocks = (await db.query<Record<string, unknown>>(`SELECT b.*,k.answer_key,k.feedback,k.scoring FROM academy_lesson_blocks b
      LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id ORDER BY b.id`)).rows;
    for (const original of oldBlocks) {
      const current = blocks.find(b => b.id === original.id)!;
      for (const key of ['id','version_id','block_key','block_type','required','points','created_at','answer_key','feedback','scoring']) {
        expect(current[key], `${original.block_key}/${key}`).toEqual(original[key]);
      }
      if (original.block_type === 'quiz') {
        expect(current.title).toEqual(original.title);
        expect(current.content).toEqual(original.content);
      } else {
        const neutral = (value: unknown) => JSON.parse(JSON.stringify(value).replaceAll('Readdy AI', 'избрания редактор').replaceAll('Readdy', 'избрания редактор'));
        expect(current.content).toEqual(neutral(original.content));
      }
    }
  });

  it('adds 14 checkable activities without increasing requirements or marking them completed', async () => {
    expect((await db.query("SELECT count(*)::int n FROM academy_lesson_blocks WHERE block_key='practice_20261003' AND NOT required AND points=0")).rows).toEqual([{ n: 14 }]);
    expect((await db.query("SELECT count(*)::int n FROM academy_lesson_progress WHERE 'practice_20261003'=ANY(completed_block_keys)")).rows).toEqual([{ n: 0 }]);
    expect((await db.query(`SELECT count(*)::int n FROM academy_lesson_audit WHERE details->>'release'='silk_road_editorial_20261003' AND details ? 'before'`)).rows).toEqual([{ n: 14 }]);
  });

  it('keeps the catalogue titles aligned with all 14 updated published lessons', async () => {
    const expected = LEARNING_SECTIONS[0].modules.slice(0, 2).flatMap(m => m.lessons.map(l => ({ module_id: m.id, lesson_id: l.id, title: l.title })));
    const current = (await db.query(`SELECT l.module_id,l.lesson_id,v.title FROM academy_lessons l
      JOIN academy_lesson_versions v ON v.id=l.published_version_id ORDER BY l.module_id,l.lesson_id`)).rows;
    expect(current).toEqual(expected);
  });

  it('is idempotent and refuses a partial or changed base publication', async () => {
    await actor(db);
    const contentBefore = (await db.query('SELECT count(*)::int n FROM academy_lesson_blocks')).rows;
    await db.exec(release);
    expect((await db.query('SELECT count(*)::int n FROM academy_lesson_blocks')).rows).toEqual(contentBefore);
    await db.exec('BEGIN');
    try {
      await db.exec("DELETE FROM academy_lesson_audit WHERE academy_lesson_id=(SELECT id FROM academy_lessons WHERE lesson_id='l01-01')");
      await expect(db.exec(release)).rejects.toThrow('Partial editorial release');
    } finally {
      await db.exec('ROLLBACK');
    }
    await db.exec('BEGIN');
    try {
      await db.exec("DELETE FROM academy_lesson_audit; UPDATE academy_lesson_versions SET change_note='silk_road_final_20260924'; UPDATE academy_lesson_versions SET change_note='changed' WHERE id=(SELECT published_version_id FROM academy_lessons WHERE lesson_id='l01-01')");
      await expect(db.exec(release)).rejects.toThrow('Expected all 14 base lessons');
    } finally {
      await db.exec('ROLLBACK');
    }
  });

  it('resumes the exact partial step and keeps the completed lesson visible in reports', async () => {
    await actor(db, 'authenticated', STUDENT);
    const partial = (await db.query<{ lesson: { versionChanged: boolean; progress: Record<string, unknown> } }>("SELECT academy_get_lesson_v2('s01-m01','l01-01') lesson")).rows[0].lesson;
    expect(partial.versionChanged).toBe(false);
    expect(partial.progress.current_block_key).toBe('lesson_section_2');
    expect(partial.progress.block_state).toEqual({ quiz_2: { answer: 'b' } });
    const report = (await db.query<{ report: { module_id: string; lesson_id: string; completed: boolean }[] }>('SELECT academy_get_learning_progress() report')).rows[0].report;
    expect(report.find(l => l.module_id === 's01-m02' && l.lesson_id === 'l02-01')?.completed).toBe(true);
  });

  it('does not expose private keys or the content backup to an unpaid account', async () => {
    await actor(db, 'authenticated', OTHER);
    await expect(db.exec("SELECT academy_get_lesson_v2('s01-m02','l02-01')")).rejects.toThrow('Access denied');
    await expect(db.exec('SELECT * FROM academy_private.lesson_block_keys')).rejects.toThrow();
    expect((await db.query('SELECT count(*)::int n FROM academy_lesson_audit')).rows).toEqual([{ n: 0 }]);
    const preview = JSON.stringify((await db.query("SELECT academy_get_lesson_v2('s01-m01','l01-01') lesson")).rows);
    expect(preview).not.toContain('"evaluation"');
    expect(preview).not.toContain('"answer_key"');
  });

  it('grades new practice independently while retaining the completed score, XP and date', async () => {
    await actor(db);
    const lesson = (await db.query<{ id: string; published_version_id: string }>("SELECT id,published_version_id FROM academy_lessons WHERE lesson_id='l02-01'")).rows[0];
    const snapshot = (await db.query<Record<string, unknown>>('SELECT * FROM academy_lesson_progress WHERE academy_lesson_id=$1', [lesson.id])).rows[0];
    await actor(db, 'authenticated', STUDENT);
    const result = (await db.query<{ result: { correct: boolean; maxScore: number; progress: Record<string, unknown> } }>(
      "SELECT academy_complete_lesson_block('s01-m02','l02-01',$1,'practice_20261003','{\"selected\":\"ask\"}',gen_random_uuid()) result", [lesson.published_version_id],
    )).rows[0].result;
    expect(result.correct).toBe(true); expect(result.maxScore).toBe(0);
    for (const key of ['xp','score_percent','mastery_status']) expect(result.progress[key]).toEqual(snapshot[key]);
    for (const key of ['completed_at','started_at']) {
      expect(new Date(result.progress[key] as string).toISOString()).toBe((snapshot[key] as Date).toISOString());
    }
    expect(result.progress.completed_block_keys).toContain('practice_20261003');
  });

  it('gives a checked answer and explanation for every new activity without awarding XP', async () => {
    await actor(db);
    const activities = (await db.query<{
      module_id: string; lesson_id: string; version_id: string; block_type: string;
      content: { options?: { id: string }[] }; answer_key: { correct?: string; value?: number; order?: string[]; matches?: Record<string, string> };
    }>(`SELECT l.module_id,l.lesson_id,b.version_id,b.block_type,b.content,k.answer_key
      FROM academy_lesson_blocks b JOIN academy_lessons l ON l.published_version_id=b.version_id
      JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
      WHERE b.block_key='practice_20261003' ORDER BY l.module_id,l.lesson_id`)).rows;
    expect(activities).toHaveLength(14);
    await db.exec('BEGIN');
    try {
      const freshStudent = '00000000-0000-4000-8000-000000000093';
      await db.query("INSERT INTO auth.users(id,email) VALUES($1,'fresh@example.invalid')", [freshStudent]);
      await db.query("INSERT INTO academy_access_grants(user_id,source,full_access) VALUES($1,'test-practice',true)", [freshStudent]);
      await actor(db, 'authenticated', freshStudent);
      for (const activity of activities) {
        const key = activity.answer_key;
        let correct: Record<string, unknown>;
        let incorrect: Record<string, unknown>;
        if (activity.block_type === 'scenario') {
          correct = { selected: key.correct };
          incorrect = { selected: activity.content.options!.find(option => option.id !== key.correct)!.id };
        } else if (activity.block_type === 'calculator') {
          correct = { value: String(key.value) };
          incorrect = { value: String(key.value! + 1) };
        } else if (activity.block_type === 'sequence_sort') {
          correct = { order: key.order };
          incorrect = { order: [...key.order!].reverse() };
        } else {
          correct = { matches: key.matches };
          const values = Object.values(key.matches!);
          incorrect = { matches: Object.fromEntries(Object.keys(key.matches!).map((id, i) => [id, values[(i + 1) % values.length]])) };
        }
        for (const [payload, expected] of [[incorrect, false], [correct, true]] as const) {
          const result = (await db.query<{ result: {
            correct: boolean; score: number; maxScore: number;
            feedback: { complete: boolean; explanation: string }; progress: { xp: number };
          } }>("SELECT academy_complete_lesson_block($1,$2,$3,'practice_20261003',$4,gen_random_uuid()) result",
          [activity.module_id, activity.lesson_id, activity.version_id, payload])).rows[0].result;
          expect(result.correct, activity.lesson_id).toBe(expected);
          expect(result.feedback.complete).toBe(expected);
          expect(result.feedback.explanation.length).toBeGreaterThan(20);
          expect([result.score, result.maxScore, result.progress.xp]).toEqual([0, 0, 0]);
        }
      }
    } finally {
      await db.exec('ROLLBACK');
      await actor(db);
    }
  });
});
