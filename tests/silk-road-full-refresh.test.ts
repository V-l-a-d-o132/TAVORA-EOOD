import { PGlite } from '@electric-sql/pglite';
import { readFileSync, writeFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import historicalCatalog from './fixtures/silk-road-catalog-20261003.json';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
import { actor, createSilkDatabase, learnerRecords, OTHER, STUDENT } from './helpers/silk-road-db';

const firstRelease = readFileSync('supabase/migrations/20261003130823_silk_road_m01_m02_editorial_refresh.sql', 'utf8');
const fullRelease = readFileSync('supabase/migrations/20261003143002_silk_road_all_modules_outcomes_and_practice.sql', 'utf8');
let db: PGlite;
let before: Awaited<ReturnType<typeof learnerRecords>>;
let identities: Record<string, unknown>[];
let originalBlocks: Record<string, unknown>[];

beforeAll(async () => {
  db = await createSilkDatabase(true);
  await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,
    block_state,completed_block_keys,xp,score_percent,mastery_status,started_at,last_activity_at)
    SELECT $1,id,published_version_id,'lesson_section_2','{"quiz_2":{"answer":"b"}}',
    ARRAY['objective','lesson_section_1','quiz_1'],20,50,'learning','2026-09-28','2026-10-02'
    FROM academy_lessons WHERE lesson_id='l09-03'`, [STUDENT]);
  await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,
    completed_block_keys,xp,score_percent,mastery_status,completed_at,started_at,last_activity_at)
    SELECT $1,l.id,l.published_version_id,'summary',array_agg(b.block_key ORDER BY b.position),sum(b.points),100,
    'mastered','2026-10-01','2026-09-28','2026-10-02'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id AND b.required
    WHERE l.lesson_id='l10-03' GROUP BY l.id`, [STUDENT]);
  await db.query(`INSERT INTO academy_lesson_attempts_v2(id,user_id,academy_lesson_id,version_id,block_id,
    payload,score,max_score,is_correct,feedback,created_at)
    SELECT gen_random_uuid(),$1,l.id,l.published_version_id,b.id,'{"answer":"a"}',10,10,true,'{}','2026-10-02'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id
    WHERE l.lesson_id='l10-03' AND b.block_type='quiz'`, [STUDENT]);
  await db.query(`INSERT INTO academy_private.lesson_progress_history(user_id,academy_lesson_id,version_id,snapshot,archived_at,reason)
    SELECT user_id,academy_lesson_id,version_id,to_jsonb(p),'2026-09-28','existing_history'
    FROM academy_lesson_progress p WHERE current_block_key='summary'`);
  await db.query(`INSERT INTO pdf_progress(user_id,module_id,lesson_id,page_number,total_pages,completed,quiz_score,quiz_total,page_times)
    VALUES($1,'s01-m11','l11-01',12,12,true,3,3,'{"1":30}')`, [STUDENT]);
  await db.query(`UPDATE profiles SET last_opened_lesson='{"moduleId":"s01-m09","lessonId":"l09-03","timestamp":"2026-10-02T00:00:00Z"}' WHERE id=$1`, [STUDENT]);
  before = await learnerRecords(db);
  identities = (await db.query('SELECT id,module_id,lesson_id,published_version_id,draft_version_id FROM academy_lessons ORDER BY module_id,lesson_id')).rows;
  originalBlocks = (await db.query(`SELECT b.*,k.answer_key,k.feedback,k.scoring FROM academy_lesson_blocks b
    LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id ORDER BY b.id`)).rows;
  await db.exec(firstRelease);
  await db.exec(fullRelease);

  // Optional, reproducible catalogue count from the real read-only content snapshot.
  if (process.env.SILK_ROAD_WORD_COUNT_OUTPUT) {
    const words: Record<string, number> = {};
    await actor(db, 'authenticated', STUDENT);
    for (const module of LEARNING_SECTIONS[0].modules) for (const lesson of module.lessons) {
      const live = (await db.query<{ lesson: Parameters<typeof countVisibleLessonWords>[0] }>(
        'SELECT academy_get_lesson_v2($1,$2) lesson', [module.id, lesson.id])).rows[0].lesson;
      words[`${module.id}/${lesson.id}`] = countVisibleLessonWords(live);
    }
    writeFileSync(process.env.SILK_ROAD_WORD_COUNT_OUTPUT, JSON.stringify(words, null, 2));
    await actor(db);
  }
}, 60000);

afterAll(async () => { await db?.close(); });

describe('all 74 Silk Road lessons continue without resetting students', () => {
  it('retains learner history, attempts, bookmarks, access, scores and version pointers exactly', async () => {
    expect(await learnerRecords(db)).toEqual(before);
    expect((await db.query('SELECT id,module_id,lesson_id,published_version_id,draft_version_id FROM academy_lessons ORDER BY module_id,lesson_id')).rows).toEqual(identities);
  });

  it('preserves original arguments and every existing assessment contract', async () => {
    await actor(db);
    const current = new Map((await db.query<Record<string, unknown>>(`SELECT b.*,k.answer_key,k.feedback,k.scoring FROM academy_lesson_blocks b
      LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id`)).rows.map(b => [b.id, b]));
    const assessed = new Set(['quiz','scenario','client_simulation','decision_tree','matching','sequence_sort','calculator','image_hotspot','course_exam']);
    const neutral = (text: string) => text.replace(/\breaddy(?: ai)?\b(?![./])/gi, 'избрания редактор');
    for (const old of originalBlocks) {
      const block = current.get(old.id)!;
      for (const key of ['id','version_id','block_key','block_type','required','points','created_at','answer_key','feedback','scoring']) {
        expect(block[key], `${old.block_key}/${key}`).toEqual(old[key]);
      }
      if (old.block_type === 'objective') continue;
      if (assessed.has(String(old.block_type))) {
        expect(block.content).toEqual(old.content);
        expect(block.title).toEqual(old.title);
      } else {
        const firstModules = identities.some(l => ['s01-m01','s01-m02'].includes(String(l.module_id)) && l.published_version_id === old.version_id);
        const expected = firstModules ? JSON.parse(JSON.stringify(old.content).replaceAll('Readdy AI', 'избрания редактор').replaceAll('Readdy', 'избрания редактор'))
          : { ...(old.content as Record<string, unknown>) };
        if (typeof expected.body === 'string') expected.body = neutral(expected.body);
        expect(block.content, String(old.block_key)).toEqual(expected);
        expect(block.title).toEqual(neutral(String(old.title)));
      }
    }
  });

  it('adds useful openings and optional zero-XP activities in all modules with valid publications', async () => {
    await actor(db);
    expect((await db.query(`SELECT count(*)::int n FROM academy_lesson_blocks WHERE block_key='objective'
      AND title='Какво ще можеш след урока' AND jsonb_array_length(content->'outcomes')=3
      AND length(content->>'body')>60 AND length(content->>'deliverable')>25 AND length(content->>'check')>30`)).rows).toEqual([{ n: 74 }]);
    expect((await db.query(`SELECT count(*)::int n FROM academy_lesson_blocks WHERE block_key='practice_20261003' AND NOT required AND points=0`)).rows).toEqual([{ n: 74 }]);
    expect((await db.query(`SELECT count(*)::int n FROM academy_lesson_audit WHERE details->>'release'='silk_road_full_20261003' AND details ? 'before'`)).rows).toEqual([{ n: 74 }]);
    expect((await db.query(`SELECT count(*)::int n FROM academy_lesson_versions WHERE jsonb_array_length(validation->'errors')>0`)).rows).toEqual([{ n: 0 }]);
    expect((await db.query(`SELECT count(*)::int n FROM academy_lesson_progress WHERE 'practice_20261003'=ANY(completed_block_keys)`)).rows).toEqual([{ n: 0 }]);
  });

  it('aligns the historical release with its October 3 catalogue', async () => {
    await actor(db);
    const expected = historicalCatalog;
    expect((await db.query(`SELECT l.module_id,l.lesson_id,v.title FROM academy_lessons l
      JOIN academy_lesson_versions v ON v.id=l.published_version_id ORDER BY l.module_id,l.lesson_id`)).rows).toEqual(expected);
  });

  it('is idempotent and atomically refuses a partial or changed base', async () => {
    await actor(db);
    const blocksBefore = (await db.query('SELECT count(*)::int n FROM academy_lesson_blocks')).rows;
    await db.exec(fullRelease);
    expect((await db.query('SELECT count(*)::int n FROM academy_lesson_blocks')).rows).toEqual(blocksBefore);
    await db.exec('BEGIN');
    try {
      await db.exec("DELETE FROM academy_lesson_audit WHERE details->>'release'='silk_road_full_20261003' AND academy_lesson_id=(SELECT id FROM academy_lessons WHERE lesson_id='l09-03')");
      await expect(db.exec(fullRelease)).rejects.toThrow('Partial full-course editorial release');
    } finally { await db.exec('ROLLBACK'); }
    await db.exec('BEGIN');
    try {
      await db.exec(`DELETE FROM academy_lesson_audit WHERE details->>'release'='silk_road_full_20261003';
        UPDATE academy_lesson_versions SET change_note=CASE WHEN academy_lesson_id IN
          (SELECT id FROM academy_lessons WHERE module_id IN ('s01-m01','s01-m02')) THEN 'silk_road_editorial_20261003'
          WHEN academy_lesson_id IN (SELECT id FROM academy_lessons WHERE lesson_id IN ('l10-01','l11-04')) THEN 'silk_road_practical_review_20260925'
          ELSE 'silk_road_final_20260924' END;
        UPDATE academy_lesson_versions SET change_note='unexpected' WHERE academy_lesson_id=(SELECT id FROM academy_lessons WHERE lesson_id='l11-03')`);
      await expect(db.exec(fullRelease)).rejects.toThrow('Expected 74 source lessons');
    } finally { await db.exec('ROLLBACK'); }
    expect(await learnerRecords(db)).toEqual(before);
  });

  it('resumes the exact later-module cursor and reports the completed lesson without migration', async () => {
    await actor(db, 'authenticated', STUDENT);
    const partial = (await db.query<{ lesson: { versionChanged: boolean; progress: Record<string, unknown> } }>("SELECT academy_get_lesson_v2('s01-m09','l09-03') lesson")).rows[0].lesson;
    expect(partial.versionChanged).toBe(false);
    expect(partial.progress.current_block_key).toBe('lesson_section_2');
    expect(partial.progress.block_state).toEqual({ quiz_2: { answer: 'b' } });
    const report = (await db.query<{ report: { module_id: string; lesson_id: string; completed: boolean }[] }>('SELECT academy_get_learning_progress() report')).rows[0].report;
    expect(report.find(l => l.module_id === 's01-m10' && l.lesson_id === 'l10-03')?.completed).toBe(true);
  });

  it('keeps paid content, answer keys and audit backups private', async () => {
    await actor(db, 'authenticated', OTHER);
    await expect(db.exec("SELECT academy_get_lesson_v2('s01-m10','l10-03')")).rejects.toThrow('Access denied');
    await expect(db.exec('SELECT * FROM academy_private.lesson_block_keys')).rejects.toThrow();
    expect((await db.query('SELECT count(*)::int n FROM academy_lesson_audit')).rows).toEqual([{ n: 0 }]);
    const preview = JSON.stringify((await db.query("SELECT academy_get_lesson_v2('s01-m01','l01-01') lesson")).rows);
    expect(preview).not.toContain('"evaluation"');
    expect(preview).not.toContain('"answer_key"');
  });

  it('checks incorrect and corrected answers for all 74 new activities without extra XP or grading requirements', async () => {
    await actor(db);
    const activities = (await db.query<{
      module_id: string; lesson_id: string; version_id: string; block_type: string;
      content: { options?: { id: string }[] }; answer_key: { correct?: string; value?: number; order?: string[]; matches?: Record<string, string> };
    }>(`SELECT l.module_id,l.lesson_id,b.version_id,b.block_type,b.content,k.answer_key
      FROM academy_lesson_blocks b JOIN academy_lessons l ON l.published_version_id=b.version_id
      JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
      WHERE b.block_key='practice_20261003' ORDER BY l.module_id,l.lesson_id`)).rows;
    expect(activities).toHaveLength(74);
    await db.exec('BEGIN');
    try {
      const fresh = '00000000-0000-4000-8000-000000000093';
      await db.query("INSERT INTO auth.users(id,email) VALUES($1,'fresh@example.invalid')", [fresh]);
      await db.query("INSERT INTO academy_access_grants(user_id,source,full_access) VALUES($1,'test-full-practice',true)", [fresh]);
      await actor(db, 'authenticated', fresh);
      for (const activity of activities) {
        const key = activity.answer_key;
        let correct: Record<string, unknown>, incorrect: Record<string, unknown>;
        if (activity.block_type === 'scenario') {
          correct = { selected: key.correct }; incorrect = { selected: activity.content.options!.find(o => o.id !== key.correct)!.id };
        } else if (activity.block_type === 'calculator') {
          correct = { value: String(key.value) }; incorrect = { value: String(key.value! + 1) };
        } else if (activity.block_type === 'sequence_sort') {
          correct = { order: key.order }; incorrect = { order: [...key.order!].reverse() };
        } else {
          correct = { matches: key.matches };
          const values = Object.values(key.matches!);
          incorrect = { matches: Object.fromEntries(Object.keys(key.matches!).map((id, i) => [id, values[(i + 1) % values.length]])) };
        }
        for (const [payload, expected] of [[incorrect, false], [correct, true]] as const) {
          const result = (await db.query<{ result: { correct: boolean; score: number; maxScore: number;
            feedback: { complete: boolean; explanation: string }; progress: { xp: number } } }>(
            "SELECT academy_complete_lesson_block($1,$2,$3,'practice_20261003',$4,gen_random_uuid()) result",
            [activity.module_id, activity.lesson_id, activity.version_id, payload])).rows[0].result;
          expect(result.correct, activity.lesson_id).toBe(expected);
          expect(result.feedback.complete, activity.lesson_id).toBe(expected);
          expect(result.feedback.explanation.length).toBeGreaterThan(20);
          expect([result.score,result.maxScore,result.progress.xp]).toEqual([0,0,0]);
        }
      }
    } finally { await db.exec('ROLLBACK'); await actor(db); }
  });

  it('keeps the completed later-module result when a student chooses the new practice', async () => {
    await actor(db);
    const task = (await db.query<{ version_id: string; answer_key: { correct: string } }>(`SELECT b.version_id,k.answer_key FROM academy_lessons l
      JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id
      JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
      WHERE l.lesson_id='l10-03' AND b.block_key='practice_20261003'`)).rows[0];
    const old = (await db.query<Record<string, unknown>>(`SELECT p.* FROM academy_lesson_progress p
      JOIN academy_lessons l ON l.id=p.academy_lesson_id WHERE l.lesson_id='l10-03' AND p.user_id=$1`, [STUDENT])).rows[0];
    await db.exec('BEGIN');
    try {
      await actor(db, 'authenticated', STUDENT);
      const result = (await db.query<{ result: { correct: boolean; maxScore: number; progress: Record<string, unknown> } }>(
        "SELECT academy_complete_lesson_block('s01-m10','l10-03',$1,'practice_20261003',$2,gen_random_uuid()) result",
        [task.version_id, { selected: task.answer_key.correct }])).rows[0].result;
      expect(result.correct).toBe(true);
      expect(result.maxScore).toBe(0);
      for (const key of ['xp','score_percent','mastery_status']) expect(result.progress[key]).toEqual(old[key]);
      for (const key of ['completed_at','started_at']) expect(new Date(result.progress[key] as string).toISOString()).toBe((old[key] as Date).toISOString());
      expect(result.progress.completed_block_keys).toContain('practice_20261003');
    } finally { await db.exec('ROLLBACK'); await actor(db); }
  });
});
