import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, expect, test } from 'vitest';
import type { PGlite } from '@electric-sql/pglite';
import { actor, createSilkDatabase, STUDENT } from './helpers/silk-road-db';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
import { ACADEMY_READING_WORDS } from '../src/data/academy-reading-words';
import { LEARNING_SECTIONS } from '../src/mocks/learning-platform';

const RELEASE = 'perfect_video_story_first_20261010';
const migration = readFileSync('supabase/migrations/20261010163647_perfect_video_story_first_publication.sql', 'utf8');
const [functions, publication] = migration.split('-- PUBLISH_VIDEO_STORY_CURRICULUM');
const candidateDir = process.env.PERFECT_VIDEO_CANDIDATE_DIR;
let db: PGlite;
let lessons: any[];
let oldVersion: string;
let oldProgress: unknown;
let unrelatedBefore: unknown;
const counts = [24,20,21,17,8,18,16,16,11,16,16,8,18,18,13];
const fixtureChoice = (key: string) => ({ key, type: 'quiz', position: 0, title: 'Синтетична проверка', required: true, points: 10,
  content: { question: 'Условие за техническия тест.', options: [{ id: 'a', label: 'Вариант А' }, { id: 'b', label: 'Вариант Б' }] },
  evaluation: { correct: 'a' }, feedback: { choices: { a: 'Съответства.', b: 'Не съответства.' } }, scoring: {} });
function fixture(module: string, lesson: string) {
  const blocks: any[] = ['objective','hook','core'].map(key => ({ key, type: key === 'core' ? 'rich_text' : key, position: 0, title: key, content: { body: 'Запазено условие.' }, required: true, points: 0 }));
  blocks.push(fixtureChoice('quiz_1'), fixtureChoice('quiz_2'));
  blocks.push({ key: 'sequence', type: 'sequence_sort', position: 0, title: 'Ред', content: { instruction: 'Учебен ред.', items: [{ id: 's1', text: 'Начало' }, { id: 's2', text: 'Край' }] }, evaluation: { order: ['s1','s2'] }, feedback: {}, required: true, points: 10 });
  blocks.push({ key: 'summary', type: 'summary', position: 0, title: 'Извод', content: { takeaways: ['Извод.'] }, required: true, points: 0 });
  blocks.forEach((b, i) => b.position = (i + 1) * 10);
  return { module, lesson, title: 'Синтетична тестова версия', subtitle: 'Условия', objective: 'Провери условията.', hook: 'Зададен случай.', estimated_minutes: 10, change_note: RELEASE, blocks };
}
function fixtureExam(n: number) {
  const modules = n === 13 ? Array.from({ length: 15 }, (_, i) => i + 1) : n === 12 ? [13,14] : Array.from({ length: 4 }, (_, i) => (n - 9) * 4 + i + 1);
  const per = n === 13 ? 2 : n === 12 ? 6 : 3;
  const questions = modules.flatMap(m => Array.from({ length: per }, (_, i) => ({ id: `fixture-${m}-${i}`, moduleId: `s02-m${String(m).padStart(2, '0')}`, prompt: 'Синтетично условие.', options: [{ id: 'a', label: 'Вариант А' }, { id: 'b', label: 'Вариант Б' }] })));
  return { key: 'exam', type: 'course_exam', position: 90, title: 'Синтетичен изпит', required: true, points: 100,
    content: { questions, minimumPercent: 80, minimumGroupPercent: 50 }, evaluation: { answers: Object.fromEntries(questions.map(q => [q.id,'a'])), criticalQuestions: n === 13 ? ['fixture-5-0','fixture-12-0','fixture-13-0'] : [] }, feedback: {}, scoring: {} };
}
async function stage(l: any) {
  await db.query(`INSERT INTO academy_private.perfect_video_story_lessons(release_key,module_id,lesson_id,expected_version_id,expected_fingerprint,payload)
    SELECT $1,l.module_id,l.lesson_id,l.published_version_id,md5(to_jsonb(l)::text||to_jsonb(v)::text||coalesce((SELECT string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id)
    FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=v.id),'')),$2
    FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id WHERE l.module_id=$3 AND l.lesson_id=$4`, [RELEASE,l,l.module,l.lesson]);
}
async function submit(l: any, b: any, payload: any) {
  const version = (await db.query<{ published_version_id: string }>('SELECT published_version_id FROM academy_lessons WHERE module_id=$1 AND lesson_id=$2', [l.module,l.lesson])).rows[0].published_version_id;
  const fn = b.type === 'course_exam' ? 'submit_course_exam' : 'complete_lesson_block';
  return (await db.query<{ r: any }>(`SELECT academy_private.${fn}($1,$2,$3,$4,$5,$6) r`, [l.module,l.lesson,version,b.key,payload,randomUUID()])).rows[0].r;
}
beforeAll(async () => {
  db = await createSilkDatabase(true);
  await db.exec('ALTER TABLE academy_lesson_blocks DROP CONSTRAINT academy_lesson_blocks_block_type_check');
  await db.exec(readFileSync('supabase/migrations/20261009190315_silk_road_market_ready_publication.sql','utf8').split('-- PUBLISH_MARKET_CURRICULUM')[0]);
  await db.exec(readFileSync('supabase/migrations/20261010163641_perfect_video_story_first_staging.sql','utf8'));
  const sources = candidateDir ? readdirSync(join(candidateDir, 'source')).filter(f => /^s02-m\d\d\.json$/.test(f)).sort().flatMap(f => JSON.parse(readFileSync(join(candidateDir,'source',f),'utf8'))) : null;
  lessons = candidateDir ? readdirSync(candidateDir).filter(f => /^m\d\d\.json$/.test(f)).sort().flatMap(f => JSON.parse(readFileSync(join(candidateDir,f),'utf8'))) : counts.flatMap((count,m) => Array.from({ length: count }, (_, i) => fixture(`s02-m${String(m+1).padStart(2,'0')}`, `pv${String(m+1).padStart(2,'0')}-${String(m === 8 && i >= 2 ? i+2 : i+1).padStart(2,'0')}`)));
  expect(lessons.length).toBe(240);
  const manifest = JSON.parse(readFileSync('scripts/perfect-video/releases/story-first-manifest-20261011.json', 'utf8'));
  const catalog = LEARNING_SECTIONS.find(s => s.id === 'perfektno-video')!.modules;
  expect(manifest.lessons).toHaveLength(240);
  for (const item of manifest.lessons) {
    expect(catalog.find(m => m.id === item.module)?.lessons.find(l => l.id === item.lesson)?.title).toBe(item.title);
  }
  if (candidateDir) for (const l of lessons) {
    expect(countVisibleLessonWords({ ...l, moduleId: l.module }), l.lesson).toBe(ACADEMY_READING_WORDS[`${l.module}/${l.lesson}`]);
    expect(manifest.lessons.find(item => item.lesson === l.lesson)).toMatchObject({ title: l.title, blocks: l.blocks.length });
  }
  for (const l of lessons) {
    const source = sources?.find(s => s.catalog.lesson_id === l.lesson);
    const sourceBlocks = source ? source.blocks.map(b => ({ key: b.block_key, type: b.block_type, position: b.position, title: b.title, content: b.content, required: b.required, points: b.points, evaluation: b.private_key?.answer_key, feedback: b.private_key?.feedback, scoring: b.private_key?.scoring })) : structuredClone(l.blocks);
    const id = (await db.query<{ id: string }>("INSERT INTO academy_lessons(module_id,lesson_id,status) VALUES($1,$2,'draft') RETURNING id", [l.module,l.lesson])).rows[0].id;
    const version = (await db.query<{ id: string }>("INSERT INTO academy_lesson_versions(academy_lesson_id,version_number,title,objective,hook,change_note) VALUES($1,1,$2,'Предишна цел.','Предишен случай.','previous_video_release') RETURNING id", [id,l.title])).rows[0].id;
    for (const b of sourceBlocks) {
      const bid = (await db.query<{ id: string }>('INSERT INTO academy_lesson_blocks(version_id,block_key,block_type,position,title,content,required,points) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id', [version,b.key,b.type,b.position,b.title,b.content,b.required,b.points])).rows[0].id;
      if (b.evaluation) await db.query('INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring) VALUES($1,$2,$3,$4)',[bid,b.evaluation,b.feedback||{},b.scoring||{}]);
    }
    await db.query("UPDATE academy_lessons SET status='published',published_version_id=$2,draft_version_id=$2 WHERE id=$1",[id,version]);
    if (!candidateDir) {
      l.blocks.find(b => b.key==='core').content.body='Изменено обяснение.';
      l.blocks.find(b => b.key==='quiz_2').evaluation.correct='b';
      l.blocks.splice(-1,0,{ ...fixtureChoice('new_transfer'), position: 65 });
      if (l.module==='s02-m15' && Number(l.lesson.slice(-2))>=9) l.blocks.push(fixtureExam(Number(l.lesson.slice(-2))));
    }
    await stage(l);
  }
  await db.exec(functions);
  unrelatedBefore = (await db.query("SELECT to_jsonb(l) row FROM academy_lessons l WHERE module_id NOT LIKE 's02-%' ORDER BY id")).rows;
  await actor(db,'postgres',STUDENT);
  oldVersion = (await db.query<{ published_version_id:string }>("SELECT published_version_id FROM academy_lessons WHERE lesson_id='pv01-01'")).rows[0].published_version_id;
  const oldBlocks = (await db.query<any>('SELECT b.block_key,b.block_type,k.answer_key FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=$1 AND (b.block_type IN (\'objective\',\'quiz\')) ORDER BY b.position LIMIT 3',[oldVersion])).rows;
  for (const b of oldBlocks) await db.query("SELECT academy_private.complete_lesson_block('s02-m01','pv01-01',$1,$2,$3,$4)",[oldVersion,b.block_key,b.block_type==='quiz'?{answer:b.answer_key.correct}:{acknowledged:true},randomUUID()]);
  oldProgress=(await db.query('SELECT to_jsonb(p) row FROM academy_lesson_progress p WHERE user_id=$1',[STUDENT])).rows[0].row;
},120000);
afterAll(async () => { await db?.close(); });

test('source or private-key edits abort atomically before publication', async () => {
  await db.exec('BEGIN');
  await db.exec("UPDATE academy_private.lesson_block_keys SET scoring='{"+'"changed":true'+"}' WHERE block_id IN (SELECT b.id FROM academy_lesson_blocks b JOIN academy_lessons l ON l.published_version_id=b.version_id WHERE l.lesson_id='pv15-13')");
  await expect(db.exec(publication)).rejects.toThrow(/changed since staging/);
  await db.exec('ROLLBACK');
  expect((await db.query('SELECT count(*)::int n FROM academy_lesson_versions WHERE change_note=$1',[RELEASE])).rows[0].n).toBe(0);
});

test('all 240 publish, historical attempts survive and only identical work carries', async () => {
  const attempts=(await db.query('SELECT to_jsonb(a) row FROM academy_lesson_attempts_v2 a ORDER BY id')).rows;
  await db.exec(publication);
  expect((await db.query('SELECT to_jsonb(a) row FROM academy_lesson_attempts_v2 a ORDER BY id')).rows).toEqual(attempts);
  expect((await db.query('SELECT snapshot FROM academy_private.lesson_progress_history WHERE version_id=$1',[oldVersion])).rows[0].snapshot).toEqual(oldProgress);
  expect((await db.query("SELECT to_jsonb(l) row FROM academy_lessons l WHERE module_id NOT LIKE 's02-%' ORDER BY id")).rows).toEqual(unrelatedBefore);
  const progress=(await db.query<any>('SELECT * FROM academy_lesson_progress WHERE user_id=$1',[STUDENT])).rows[0];
  expect(progress.version_id===oldVersion).toBe(false); expect(progress.completed_at).toBeNull();
  if (!candidateDir) expect(progress.completed_block_keys).toEqual(['objective','quiz_1']);
  await db.exec(functions);
  expect((await db.query("SELECT count(*)::int n FROM pg_trigger WHERE tgname='guard_perfect_video_story_progress'")).rows[0].n).toBe(1);
  await db.exec(publication);
  expect((await db.query('SELECT count(*)::int n FROM academy_lesson_versions WHERE change_note=$1',[RELEASE])).rows[0].n).toBe(240);
  await expect(db.query('UPDATE academy_lesson_progress SET version_id=$1 WHERE user_id=$2',[oldVersion,STUDENT])).rejects.toThrow(/version changed/);
  await actor(db,'authenticated',STUDENT);
  await expect(db.query('SELECT * FROM academy_private.perfect_video_story_lessons')).rejects.toThrow();
  await actor(db,'postgres',STUDENT);
},60000);

test('the final exam rejects missing prerequisites; every candidate check grades correctly without private maps', async () => {
  const final=lessons.at(-1), finalExam=final.blocks.find(b=>b.type==='course_exam');
  await expect(submit(final,finalExam,{answers:finalExam.evaluation.answers})).rejects.toThrow(/239/);
  for (const l of lessons) {
    for (const b of l.blocks.filter(b=>b.required)) {
      if (b.type==='course_exam' && l.lesson==='pv15-13') {
        const all={...b.evaluation.answers};
        const critical=b.evaluation.criticalQuestions[0];
        const question=b.content.questions.find(q=>q.id===critical);
        all[critical]=question.options.find(o=>o.id!==all[critical]).id;
        const result=await submit(l,b,{answers:all});
        expect(result.correct).toBe(false); expect(result.feedback.criticalPassed).toBe(false);
        const weak={...b.evaluation.answers};
        for(const q of b.content.questions.filter(q=>q.moduleId==='s02-m01')) weak[q.id]=q.options.find(o=>o.id!==weak[q.id]).id;
        const group=await submit(l,b,{answers:weak});
        expect(group.correct).toBe(false); expect(group.feedback.scorePercent).toBeGreaterThan(80);
      }
      let payload:any={acknowledged:true};
      if(['quiz','scenario'].includes(b.type)) {
        const wrong=b.content.options.find(o=>o.id!==b.evaluation.correct).id;
        const rejected=await submit(l,b,b.type==='quiz'?{answer:wrong}:{selected:wrong});
        expect(rejected.feedback.complete===false,`${l.lesson}/${b.key}: wrong choice`).toBe(true);
        expect(Object.keys(rejected.feedback).some(k=>['answer','answers','choices','criticalQuestions'].includes(k))).toBe(false);
        payload=b.type==='quiz'?{answer:b.evaluation.correct}:{selected:b.evaluation.correct};
      }
      if(b.type==='sequence_sort')payload={order:b.evaluation.order};
      if(b.type==='matching')payload={matches:b.evaluation.matches};
      if(b.type==='course_exam')payload={answers:b.evaluation.answers};
      const result=await submit(l,b,payload);
      expect(result.feedback.complete===true,`${l.lesson}/${b.key}: completion`).toBe(true);
      expect(Object.keys(result.feedback).some(k=>['answer','answers','choices','criticalQuestions'].includes(k))).toBe(false);
    }
  }
  const completed=(await db.query<{n:number}>("SELECT count(*)::int n FROM academy_lesson_progress p JOIN academy_lessons l ON l.id=p.academy_lesson_id WHERE p.user_id=$1 AND l.module_id LIKE 's02-%' AND p.completed_at IS NOT NULL",[STUDENT])).rows[0].n;
  expect(completed).toBe(240);
},180000);
