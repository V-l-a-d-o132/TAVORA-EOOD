import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import type { PGlite } from '@electric-sql/pglite';
import { createMarketing1115Database, marketing1115Migration, marketing1115FingerprintSQL } from './helpers/marketing-basics-1115-db';
import { actor, learnerRecords, STUDENT, OTHER } from './helpers/silk-road-db';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
import { ACADEMY_READING_WORDS } from '../src/data/academy-reading-words';
import { LEARNING_SECTIONS } from '../src/mocks/learning-platform';

const release = 'marketing_basics_modules_11_15_ai_mcp_practice_20261007';
type Spec = { module: string; lesson: string; title: string; blocks: { key: string; type: string; title: string; content: Record<string, unknown>; feedback?: { explanation: string } }[] };
const specs = JSON.parse(readFileSync('scripts/marketing-basics/releases/modules-11-15-20261007.json', 'utf8')) as Spec[];
let db: PGlite;
let sql: string;
let learners: Awaited<ReturnType<typeof learnerRecords>>;
let identities: Record<string, unknown>[];
let originals: Record<string, unknown>[];
let outside: Record<string, unknown>[];
let warnings: Record<string, unknown>[];
const allContent = 'SELECT to_jsonb(v) version,to_jsonb(b) block,to_jsonb(k) key FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id';

beforeAll(async () => {
  db = await createMarketing1115Database();
  sql = await marketing1115Migration(db);
  await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys,xp,mastery_status)
    SELECT $1,l.id,l.published_version_id,'check_2','{"check_2":{"selected":"a"}}',ARRAY['objective','principle','case'],4,'learning'
    FROM academy_lessons l WHERE l.lesson_id='lm11-01'`, [STUDENT]);
  await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys,xp,score_percent,mastery_status,completed_at)
    SELECT $1,l.id,l.published_version_id,'summary','{"check_2":{"selected":"c"}}',array_agg(b.block_key ORDER BY b.position),sum(b.points),100,'mastered','2026-10-04'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id WHERE l.lesson_id='lm15-09' GROUP BY l.id`, [STUDENT]);
  await db.query(`INSERT INTO academy_lesson_attempts_v2(id,user_id,academy_lesson_id,version_id,block_id,payload,score,max_score,is_correct,feedback)
    SELECT gen_random_uuid(),$1,l.id,l.published_version_id,b.id,'{"selected":"a"}',0,2,false,'{"explanation":"Запазено старо обяснение."}'
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id WHERE l.lesson_id='lm11-01' AND b.block_key='check_2'`, [STUDENT]);
  await db.query(`INSERT INTO academy_private.lesson_progress_history(user_id,academy_lesson_id,version_id,snapshot,reason)
    SELECT user_id,academy_lesson_id,version_id,to_jsonb(p),'preserved-marketing-history' FROM academy_lesson_progress p WHERE user_id=$1`, [STUDENT]);
  await db.query("INSERT INTO pdf_progress(user_id,module_id,lesson_id,page_number,total_pages,completed) VALUES($1,'s03-m15','lm15-09',1,1,true)", [STUDENT]);
  await db.query("INSERT INTO profiles(id,full_name,last_opened_lesson) VALUES($1,'Test Student','{\"moduleId\":\"s03-m01\",\"lessonId\":\"lm01-01\"}') ON CONFLICT(id) DO UPDATE SET last_opened_lesson=EXCLUDED.last_opened_lesson", [STUDENT]);
  await db.query("INSERT INTO academy_user_badges(user_id,badge_key,evidence) VALUES($1,'first-practice','{\"preserved\":true}') ON CONFLICT DO NOTHING", [STUDENT]);
  learners = await learnerRecords(db);
  identities = (await db.query('SELECT l.*,v.version_number,v.subtitle,v.duration,v.estimated_minutes FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id ORDER BY l.id')).rows;
  originals = (await db.query('SELECT b.*,k.answer_key,k.scoring FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id ORDER BY b.id')).rows;
  outside = (await db.query(`${allContent} WHERE NOT(l.lesson_id=ANY($1)) ORDER BY b.id`, [specs.map(s => s.lesson)])).rows;
  warnings = (await db.query("SELECT lesson_id,academy_private.lesson_validation(published_version_id)->'warnings' warnings FROM academy_lessons ORDER BY lesson_id")).rows;
  await db.exec(sql);
}, 60000);
afterAll(async () => { await db?.close(); });

describe('Marketing Basics researched modules 11–15 with AI and MCP', () => {
  it('ships public content, independent tasks and worked solutions for all 53 lessons', () => {
    const check = (value: unknown) => {
      if (Array.isArray(value)) value.forEach(check);
      else if (value && typeof value === 'object') for (const [key, part] of Object.entries(value)) {
        expect(['evaluation','answer_key','answerKey','correct','answers','scoring']).not.toContain(key);
        check(part);
      }
    };
    check(specs);
    check(JSON.parse(readFileSync('tests/fixtures/marketing-basics-11-15-before.json','utf8')));
    expect(specs).toHaveLength(53);
    expect(specs.reduce((sum, s) => sum + s.blocks.length, 0)).toBe(661);
    for (const spec of specs) {
      const outcome = spec.blocks.find(b => b.type === 'objective')!.content;
      expect(outcome.outcomes).toHaveLength(3);
      expect(outcome.deliverable).toBeTruthy();
      expect(outcome.check).toBeTruthy();
      if (Number(spec.module.slice(-2)) >= 11) {
        expect(spec.blocks.find(b => b.key === 'practice_brief')!.content.body).toContain('ИИ в процеса — упражнение и проверка:');
        expect(spec.blocks.find(b => b.key === 'practice_brief')!.content.body).toContain('Критерии за самопроверка:');
        expect(spec.blocks.find(b => b.key === 'practice_brief')!.content.body).toContain('Първа подсказка');
        expect(spec.blocks.find(b => b.key === 'practice_brief')!.content.body).toContain('безплатен');
        expect(spec.blocks.find(b => b.key === 'model_solution')!.content.cards).toHaveLength(1);
        expect(spec.blocks.find(b => b.key === 'case')!.content.body).toContain('учебни');
      }
      for (const b of spec.blocks.filter(b => ['quiz','scenario'].includes(b.type))) {
        const lengths = (b.content.options as {label:string}[]).map(option => option.label.length);
        expect(Math.max(...lengths) / Math.min(...lengths), `${spec.lesson}/${b.key}`).toBeLessThan(2);
      }
      expect(spec.blocks.some(b => ['practical_response','submission','homework'].includes(b.type))).toBe(false);
      expect(LEARNING_SECTIONS[2].modules.find(m => m.id === spec.module)!.lessons.find(l => l.id === spec.lesson)!.title).toBe(spec.title);
    }
  });

  it('preserves all seven populated learner tables, IDs, XP, grading and content outside the 53 lessons', async () => {
    for (const rows of Object.values(learners)) expect(rows.length).toBeGreaterThan(0);
    expect(await learnerRecords(db)).toEqual(learners);
    expect((await db.query('SELECT l.*,v.version_number,v.subtitle,v.duration,v.estimated_minutes FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id ORDER BY l.id')).rows).toEqual(identities);
    const now = new Map((await db.query<Record<string, unknown>>('SELECT b.*,k.answer_key,k.scoring FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id')).rows.map(r => [r.id, r]));
    expect(now.size).toBe(originals.length);
    for (const old of originals) {
      for (const key of ['id','version_id','block_key','position','block_type','required','points','answer_key','scoring']) expect(now.get(old.id)?.[key]).toEqual(old[key]);
      if (['practical_response','course_exam','submission','sequence_sort'].includes(old.block_type as string)) expect(now.get(old.id)?.content).toEqual(old.content);
      if (['quiz','scenario'].includes(old.block_type as string)) {
        const optionIds = (r: Record<string, unknown>) => (r.content as { options: { id: string }[] }).options.map(o => o.id).sort();
        expect(optionIds(now.get(old.id)!)).toEqual(optionIds(old));
      }
    }
    expect((await db.query(`${allContent} WHERE NOT(l.lesson_id=ANY($1)) ORDER BY b.id`, [specs.map(s => s.lesson)])).rows).toEqual(outside);
    expect((await db.query("SELECT lesson_id,academy_private.lesson_validation(published_version_id)->'warnings' warnings FROM academy_lessons ORDER BY lesson_id")).rows).toEqual(warnings);
    const receipt = (await db.query<{ receipt: Record<string, unknown> }>("SELECT details->'publication_receipt' receipt FROM academy_lesson_audit WHERE details->>'release'=$1 AND details?'publication_receipt'", [release])).rows[0].receipt;
    expect(receipt).toMatchObject({ published_lessons:53,archived_blocks:726,changed_blocks:661,learner_records_unchanged:true,lesson_identity_unchanged:true,grading_identity_unchanged:true,outside_content_unchanged:true });
  });

  it('resumes partial and completed lessons without resets and keeps archives and keys protected', async () => {
    await actor(db, 'authenticated', STUDENT);
    type Lesson = { versionChanged: boolean; progress: Record<string, unknown>; blocks: { key: string; type: string }[] };
    const get = async (module: string, lesson: string) => (await db.query<{ lesson: Lesson }>('SELECT academy_get_lesson_v2($1,$2) lesson',[module,lesson])).rows[0].lesson;
    const partial = await get('s03-m11','lm11-01');
    const completed = await get('s03-m15','lm15-09');
    expect(partial.versionChanged).toBe(false);
    expect(partial.progress).toMatchObject({ current_block_key:'check_2',block_state:{check_2:{selected:'a'}},completed_block_keys:['objective','principle','case'] });
    expect(completed.versionChanged).toBe(false);
    expect(completed.progress).toMatchObject({ score_percent:100,mastery_status:'mastered' });
    expect(partial.blocks.some(b => b.key === 'notes')).toBe(false);
    expect(JSON.stringify(partial.blocks)).not.toMatch(/"(?:answer_key|evaluation|scoring)":/);
    expect((await db.query('SELECT details FROM academy_lesson_audit')).rows).toEqual([]);
    await expect(db.query('SELECT answer_key FROM academy_private.lesson_block_keys')).rejects.toThrow('permission denied');
    await actor(db);
  });

  it('grades a wrong and right submission through the real RPC for every retained check', async () => {
    type Check = { module_id:string;lesson_id:string;version_id:string;block_key:string;block_type:string;content:{options?:{id:string;label:string}[]};answer_key:{correct?:string;order?:string[];value?:number;min?:number;max?:number} };
    const checks = (await db.query<Check>("SELECT l.module_id,l.lesson_id,b.version_id,b.block_key,b.block_type,b.content,k.answer_key FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id LIKE 's03-%' ORDER BY l.lesson_id,b.position")).rows;
    expect(checks).toHaveLength(142);
    await actor(db,'authenticated',OTHER);
    const first = checks[0];
    await expect(db.query('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6)',[first.module_id,first.lesson_id,first.version_id,first.block_key,{selected:first.answer_key.correct},crypto.randomUUID()])).rejects.toThrow('Access denied');
    await actor(db,'authenticated',STUDENT);
    for (const c of checks) {
      const submit = async (payload: unknown) => (await db.query<{ result:{correct:boolean;feedback:{explanation:string;complete:boolean}} }>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) result',[c.module_id,c.lesson_id,c.version_id,c.block_key,payload,crypto.randomUUID()])).rows[0].result;
      const field = c.block_type === 'quiz' ? 'answer' : 'selected';
      const right = c.block_type === 'calculator' ? {value:c.answer_key.value ?? c.answer_key.min} : c.block_type === 'sequence_sort' ? {order:c.answer_key.order} : {[field]:c.answer_key.correct};
      const wrong = c.block_type === 'calculator' ? {value:Number(c.answer_key.max ?? c.answer_key.value)+100} : c.block_type === 'sequence_sort' ? {order:[...c.answer_key.order!].reverse()} : {[field]:c.content.options!.find(o => o.id !== c.answer_key.correct)!.id};
      const rejected = await submit(wrong);
      expect(rejected.correct,`${c.lesson_id}/${c.block_key}`).toBe(false);
      expect(rejected.feedback.complete,`${c.lesson_id}/${c.block_key}`).toBe(false);
      const result = await submit(right);
      expect(result.correct,`${c.lesson_id}/${c.block_key}`).toBe(true);
      expect(result.feedback.complete,`${c.lesson_id}/${c.block_key}`).toBe(true);
      expect(result.feedback.explanation).toBeTruthy();
      if (process.env.MARKETING_BASICS_1115_SOURCE_SNAPSHOT && ['quiz','scenario'].includes(c.block_type)) {
        const label = c.content.options!.find(o => o.id === c.answer_key.correct)!.label;
        expect(result.feedback.explanation).toContain(label);
      }
    }
    await actor(db);
  }, 60000);

  it('publishes matching visible content, reading times and idempotent protected archives', async () => {
    const counts: Record<string, number> = {};
    await actor(db,'authenticated',STUDENT);
    for (const spec of specs) {
      const lesson = (await db.query<{ lesson: Parameters<typeof countVisibleLessonWords>[0] & { blocks: { key: string; title: string; content: unknown }[] } }>('SELECT academy_get_lesson_v2($1,$2) lesson',[spec.module,spec.lesson])).rows[0].lesson;
      expect(lesson.title).toBe(spec.title);
      for (const patch of spec.blocks) expect(lesson.blocks.find(b => b.key === patch.key)?.content).toEqual(patch.content);
      counts[`${spec.module}/${spec.lesson}`] = countVisibleLessonWords(lesson);
      if (!process.env.MARKETING_BASICS_1115_COUNTS_OUTPUT) expect(counts[`${spec.module}/${spec.lesson}`], spec.lesson).toBe(ACADEMY_READING_WORDS[`${spec.module}/${spec.lesson}`]);
    }
    if (process.env.MARKETING_BASICS_1115_COUNTS_OUTPUT) writeFileSync(process.env.MARKETING_BASICS_1115_COUNTS_OUTPUT,JSON.stringify(counts,null,2));
    await actor(db);
    if (process.env.MARKETING_BASICS_1115_VERIFY_OUTPUT) writeFileSync(process.env.MARKETING_BASICS_1115_VERIFY_OUTPUT,JSON.stringify((await db.query(marketing1115FingerprintSQL)).rows,null,2));
    const before = (await db.query("SELECT details FROM academy_lesson_audit WHERE details->>'release'=$1 ORDER BY id",[release])).rows;
    expect(before).toHaveLength(53);
    await db.exec(sql);
    expect((await db.query("SELECT details FROM academy_lesson_audit WHERE details->>'release'=$1 ORDER BY id",[release])).rows).toEqual(before);
  });

  it('rolls back the entire publication if the last lesson changed after research', async () => {
    const fresh = await createMarketing1115Database();
    try {
      const migration = await marketing1115Migration(fresh);
      await fresh.exec("UPDATE academy_lesson_blocks SET content=content||'{\"drift\":true}' WHERE version_id=(SELECT published_version_id FROM academy_lessons WHERE lesson_id='lm15-09') AND block_key='principle'");
      const before = (await fresh.query(`${allContent} ORDER BY b.id`)).rows;
      await expect(fresh.exec(migration)).rejects.toThrow('Marketing source drift for lm15-09');
      expect((await fresh.query(`${allContent} ORDER BY b.id`)).rows).toEqual(before);
      expect((await fresh.query("SELECT id FROM academy_lesson_audit WHERE details->>'release'=$1",[release])).rows).toEqual([]);
    } finally { await fresh.close(); }
  },60000);

  it('rejects corrupted staged delivery before any lesson is changed', async () => {
    const fresh = await createMarketing1115Database();
    try {
      const delivery = JSON.parse(execFileSync('python3',['scripts/marketing-basics/build_11_15_delivery.py','--json'],{encoding:'utf8',maxBuffer:3_000_000})) as {stages:string[];apply:string};
      for (const stage of delivery.stages) await fresh.exec(stage);
      await fresh.exec("UPDATE academy_lesson_audit SET details=details||jsonb_build_object('payload_text',details->>'payload_text'||' ') WHERE details->>'delivery_part'='1'");
      const before = (await fresh.query(`${allContent} ORDER BY b.id`)).rows;
      await expect(fresh.exec(delivery.apply)).rejects.toThrow('Marketing delivery payload hash mismatch');
      expect((await fresh.query(`${allContent} ORDER BY b.id`)).rows).toEqual(before);
      expect((await fresh.query("SELECT id FROM academy_lesson_audit WHERE details->>'release'=$1",[release])).rows).toEqual([]);
    } finally { await fresh.close(); }
  },60000);
});
