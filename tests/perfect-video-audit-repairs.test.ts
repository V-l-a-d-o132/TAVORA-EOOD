import { PGlite } from '@electric-sql/pglite';
import { readFileSync, writeFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createVideoAuditDatabase } from './helpers/perfect-video-audit-db';
import { actor, learnerRecords, STUDENT, OTHER } from './helpers/silk-road-db';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
import { ACADEMY_READING_WORDS } from '../src/data/academy-reading-words';

const migration = readFileSync('supabase/migrations/20261004131422_perfect_video_audit_repairs.sql', 'utf8');
const release = 'perfect_video_audit_repairs_20261004';
const specs = JSON.parse(readFileSync('scripts/perfect-video/releases/audit-repairs-20261004.json', 'utf8')) as { module: string; lesson: string; title: string; blocks: { key: string; type: string; content: unknown; evaluation?: unknown }[] }[];
let db: PGlite;
let learners: Awaited<ReturnType<typeof learnerRecords>>;
let identities: Record<string, unknown>[];
let originals: Record<string, unknown>[];
let outside: Record<string, unknown>[];
let warnings: Record<string, unknown>[];

beforeAll(async () => {
  db = await createVideoAuditDatabase();
  await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys,xp,mastery_status)
    SELECT $1,l.id,l.published_version_id,'quiz_1','{"quiz_1":{"answer":"a"}}',ARRAY['objective','hook','principle'],4,'learning'
    FROM academy_lessons l WHERE l.lesson_id='pv13-02'`, [STUDENT]);
  await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys,xp,score_percent,mastery_status,completed_at)
    SELECT $1,l.id,l.published_version_id,'summary','{"scenario_2":{"selected":"c"}}',array_agg(b.block_key ORDER BY b.position),sum(b.points),100,'mastered','2026-10-02'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id WHERE l.lesson_id='pv14-01' GROUP BY l.id`, [STUDENT]);
  await db.query(`INSERT INTO academy_lesson_attempts_v2(id,user_id,academy_lesson_id,version_id,block_id,payload,score,max_score,is_correct,feedback)
    SELECT gen_random_uuid(),$1,l.id,l.published_version_id,b.id,'{"answer":"a"}',2,2,true,'{"explanation":"Запазено старо обяснение."}'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id WHERE l.lesson_id='pv13-02' AND b.block_key='quiz_1'`, [STUDENT]);
  await db.query(`INSERT INTO academy_private.lesson_progress_history(user_id,academy_lesson_id,version_id,snapshot,reason)
    SELECT user_id,academy_lesson_id,version_id,to_jsonb(p),'preserved-audit-history' FROM academy_lesson_progress p WHERE user_id=$1`, [STUDENT]);
  await db.query("INSERT INTO pdf_progress(user_id,module_id,lesson_id,page_number,total_pages,completed) VALUES($1,'s02-m14','pv14-01',1,1,true)", [STUDENT]);
  await db.query("INSERT INTO profiles(id,full_name,last_opened_lesson) VALUES($1,'Test Student','{\"moduleId\":\"s02-m13\",\"lessonId\":\"pv13-02\"}') ON CONFLICT(id) DO UPDATE SET last_opened_lesson=EXCLUDED.last_opened_lesson", [STUDENT]);
  await db.query("INSERT INTO academy_user_badges(user_id,badge_key,evidence) VALUES($1,'first-practice','{\"preserved\":true}') ON CONFLICT DO NOTHING", [STUDENT]);
  learners = await learnerRecords(db);
  identities = (await db.query('SELECT l.*,v.version_number,v.subtitle,v.duration,v.estimated_minutes FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id ORDER BY l.id')).rows;
  originals = (await db.query('SELECT b.*,k.answer_key,k.scoring FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id ORDER BY b.id')).rows;
  outside = (await db.query('SELECT to_jsonb(v) version,to_jsonb(b) block,to_jsonb(k) key FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE NOT(l.lesson_id=ANY($1)) ORDER BY b.id', [specs.map(s => s.lesson)])).rows;
  warnings = (await db.query("SELECT lesson_id,academy_private.lesson_validation(published_version_id)->'warnings' warnings FROM academy_lessons ORDER BY lesson_id")).rows;
  await db.exec(migration);
}, 60000);
afterAll(async () => { await db?.close(); });

describe('narrow video audit repairs', () => {
  it('ships only public choices and no private grading mappings in the new release', () => {
    const check = (value: unknown) => {
      if(Array.isArray(value)) value.forEach(check);
      else if(value && typeof value === 'object') {
        for(const [key,part] of Object.entries(value)) {
          expect(['evaluation','answer_key','answerKey','correct','answers','scoring']).not.toContain(key);
          check(part);
        }
      }
    };
    check(specs);
    check(JSON.parse(readFileSync('scripts/perfect-video/editorial/audit-public-choices-20261004.json','utf8')));
  });
  it('preserves all seven learner tables, all identities, keys, scores and content outside the 39 lessons', async () => {
    for (const rows of Object.values(learners)) expect(rows.length).toBeGreaterThan(0);
    expect(await learnerRecords(db)).toEqual(learners);
    expect((await db.query('SELECT l.*,v.version_number,v.subtitle,v.duration,v.estimated_minutes FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id ORDER BY l.id')).rows).toEqual(identities);
    const now = new Map((await db.query<Record<string, unknown>>('SELECT b.*,k.answer_key,k.scoring FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id')).rows.map(r => [r.id, r]));
    expect(now.size).toBe(originals.length);
    for (const old of originals) {
      for (const key of ['id','version_id','block_key','position','block_type','required','points','answer_key','scoring']) expect(now.get(old.id)?.[key]).toEqual(old[key]);
      if (['course_exam','submission'].includes(old.block_type as string)) expect(now.get(old.id)?.content).toEqual(old.content);
      if (['quiz','scenario'].includes(old.block_type as string)) {
        const content = (r: Record<string, unknown>) => (r.content as { options: { id: string }[] }).options.map(o => o.id);
        expect(content(now.get(old.id)!)).toEqual(content(old));
      }
    }
    expect((await db.query('SELECT to_jsonb(v) version,to_jsonb(b) block,to_jsonb(k) key FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE NOT(l.lesson_id=ANY($1)) ORDER BY b.id', [specs.map(s => s.lesson)])).rows).toEqual(outside);
    expect((await db.query("SELECT lesson_id,academy_private.lesson_validation(published_version_id)->'warnings' warnings FROM academy_lessons ORDER BY lesson_id")).rows).toEqual(warnings);
    const receipt = (await db.query<{ receipt: Record<string, unknown> }>("SELECT details->'publication_receipt' receipt FROM academy_lesson_audit WHERE details->>'release'=$1 AND details?'publication_receipt'", [release])).rows[0].receipt;
    expect(receipt).toMatchObject({ published_lessons:39,archived_blocks:671,changed_blocks:164,learner_records_unchanged:true,lesson_identity_unchanged:true,grading_identity_unchanged:true });
  });

  it('resumes partial and completed work with the same saved IDs, no version reset and no private keys', async () => {
    await actor(db, 'authenticated', STUDENT);
    type Lesson = { versionChanged: boolean; progress: { current_block_key: string; block_state: unknown; completed_block_keys: string[]; score_percent: number; mastery_status: string }; blocks: unknown[] };
    const get = async (module: string, lesson: string) => (await db.query<{ lesson: Lesson }>('SELECT academy_get_lesson_v2($1,$2) lesson',[module,lesson])).rows[0].lesson;
    const partial = await get('s02-m13','pv13-02');
    const completed = await get('s02-m14','pv14-01');
    expect(partial.versionChanged).toBe(false);
    expect(partial.progress).toMatchObject({ current_block_key:'quiz_1',block_state:{quiz_1:{answer:'a'}},completed_block_keys:['objective','hook','principle'] });
    expect(completed.versionChanged).toBe(false);
    expect(completed.progress).toMatchObject({ score_percent:100,mastery_status:'mastered' });
    expect((await db.query('SELECT details FROM academy_lesson_audit')).rows).toEqual([]);
    expect(JSON.stringify(partial.blocks)).not.toMatch(/"(?:answer_key|evaluation|scoring)":/);
    await actor(db);
  });

  it('grades correct and plausible wrong choices through the actual RPC for all 144 rewritten checks', async () => {
    type Check = { module_id:string;lesson_id:string;version_id:string;block_key:string;block_type:string;content:{options:{id:string;label:string}[]};answer_key:{correct:string} };
    const checks = (await db.query<Check>("SELECT l.module_id,l.lesson_id,b.version_id,b.block_key,b.block_type,b.content,k.answer_key FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id IN ('s02-m13','s02-m14') AND b.block_type IN ('quiz','scenario') ORDER BY l.lesson_id,b.position")).rows;
    expect(checks).toHaveLength(144);
    await actor(db,'authenticated',OTHER);
    const first = checks[0];
    await expect(db.query('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6)',[first.module_id,first.lesson_id,first.version_id,first.block_key,{answer:first.answer_key.correct},crypto.randomUUID()])).rejects.toThrow('Access denied');
    await actor(db,'authenticated',STUDENT);
    for (const c of checks) {
      const submit = async (answer: string) => (await db.query<{ result:{correct:boolean} }>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) result',[c.module_id,c.lesson_id,c.version_id,c.block_key,{[c.block_type==='quiz'?'answer':'selected']:answer},crypto.randomUUID()])).rows[0].result;
      expect((await submit(c.content.options.find(o=>o.id!==c.answer_key.correct)!.id)).correct).toBe(false);
      expect((await submit(c.answer_key.correct)).correct).toBe(true);
      const lengths = c.content.options.map(o=>o.label.length);
      expect(Math.max(...lengths)/Math.min(...lengths)).toBeLessThan(1.6);
    }
    await actor(db);
  }, 30000);

  it('uses comparative analytics, aligned reading times and idempotent protected archives', async () => {
    await actor(db,'authenticated',STUDENT);
    for (const spec of specs) {
      const lesson = (await db.query<{ lesson: Parameters<typeof countVisibleLessonWords>[0] }>('SELECT academy_get_lesson_v2($1,$2) lesson',[spec.module,spec.lesson])).rows[0].lesson;
      expect(lesson.title).toBe(spec.title);
      expect(countVisibleLessonWords(lesson),spec.lesson).toBe(ACADEMY_READING_WORDS[`${spec.module}/${spec.lesson}`]);
      if(spec.lesson==='pv11-13') expect(JSON.stringify(lesson)).toMatch(/60%.*30%/);
    }
    await actor(db);
    if (process.env.PERFECT_VIDEO_AUDIT_VERIFY_OUTPUT) {
      const fingerprints = (await db.query<{ lesson_id: string }>(readFileSync('scripts/perfect-video/audit-fingerprints.sql','utf8'))).rows.filter(row => specs.some(s => s.lesson === row.lesson_id));
      writeFileSync(process.env.PERFECT_VIDEO_AUDIT_VERIFY_OUTPUT,JSON.stringify(fingerprints,null,2));
    }
    const before = (await db.query("SELECT details FROM academy_lesson_audit WHERE details->>'release'=$1 ORDER BY id",[release])).rows;
    expect(before).toHaveLength(39);
    await db.exec(migration);
    expect((await db.query("SELECT details FROM academy_lesson_audit WHERE details->>'release'=$1 ORDER BY id",[release])).rows).toEqual(before);
  });

  it('rolls back every repair if the source changes before publication', async () => {
    const fresh = await createVideoAuditDatabase();
    try {
      await fresh.exec("UPDATE academy_lesson_blocks SET content=content||'{\"drift\":true}' WHERE version_id=(SELECT published_version_id FROM academy_lessons WHERE lesson_id='pv14-18') AND block_key='principle'");
      const before = (await fresh.query('SELECT to_jsonb(v) version,to_jsonb(b) block,to_jsonb(k) key FROM academy_lesson_versions v JOIN academy_lesson_blocks b ON b.version_id=v.id LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id ORDER BY b.id')).rows;
      await expect(fresh.exec(migration)).rejects.toThrow('Video source drift for pv14-18');
      expect((await fresh.query('SELECT to_jsonb(v) version,to_jsonb(b) block,to_jsonb(k) key FROM academy_lesson_versions v JOIN academy_lesson_blocks b ON b.version_id=v.id LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id ORDER BY b.id')).rows).toEqual(before);
      expect((await fresh.query("SELECT id FROM academy_lesson_audit WHERE details->>'release'=$1",[release])).rows).toEqual([]);
    } finally { await fresh.close(); }
  },60000);
});
