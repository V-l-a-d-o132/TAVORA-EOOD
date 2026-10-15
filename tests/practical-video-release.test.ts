import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, expect, test } from 'vitest';
import type { PGlite } from '@electric-sql/pglite';
import { actor, createSilkDatabase, STUDENT, OTHER } from './helpers/silk-road-db';
import { loadPracticalCandidates } from '../scripts/prepare-practical-video-assets.mjs';
const candidates = loadPracticalCandidates();
import manifest from '../scripts/perfect-video/releases/practical-01-05-manifest-20261014.json';
import { parseClosedStudio } from '../src/lib/closed-practice-studio';

let db: PGlite;
const release = manifest.release;
const grading = process.env.PRACTICAL_VIDEO_PRIVATE_CANDIDATES
  ? JSON.parse(readFileSync(process.env.PRACTICAL_VIDEO_PRIVATE_CANDIDATES, 'utf8')) as { lesson: string; payload: { practice: { evaluation: { matches: Record<string,string> } } } }[] : null;
// Default tests use synthetic grader maps. Real keys may be supplied locally;
// they are never stored in repository fixtures or returned by learner RPCs.
const expected = (l: typeof candidates[number]) => grading?.find(g => g.lesson===l.lesson)?.payload.practice.evaluation.matches
  || Object.fromEntries(l.practice.content.left.map(slot => [slot.id,slot.choices[0]]));
let original: { version: string; progress: unknown; attempts: unknown; other: unknown };
const versions = new Map<string,string>();
async function version(id: string) { return versions.get(id)!; }
async function submit(id: string, payload: unknown, attempt = randomUUID()) {
  const l = candidates.find(l=>l.lesson===id)!;
  return (await db.query<{r:any}>("SELECT public.academy_complete_lesson_block($1,$2,$3,'practical_studio_20261014',$4,$5) r",[l.module,id,await version(id),payload,attempt])).rows[0].r;
}
beforeAll(async () => {
  db = await createSilkDatabase();
  await db.exec(readFileSync('supabase/migrations/20261009190315_silk_road_market_ready_publication.sql','utf8').split('-- PUBLISH_MARKET_CURRICULUM')[0]);
  await db.exec(readFileSync('supabase/migrations/20261010163647_perfect_video_story_first_publication.sql','utf8').split('-- PUBLISH_VIDEO_STORY_CURRICULUM')[0]);
  await db.exec(readFileSync('supabase/migrations/20261015064651_practical_video_studio_payloads.sql','utf8'));
  await db.exec(readFileSync('supabase/migrations/20261015064718_practical_video_01_05_publication.sql','utf8'));
  for(const l of candidates) {
    const lid=(await db.query<{id:string}>("INSERT INTO academy_lessons(module_id,lesson_id,status) VALUES($1,$2,'draft') RETURNING id",[l.module,l.lesson])).rows[0].id;
    const vid=(await db.query<{id:string}>("INSERT INTO academy_lesson_versions(academy_lesson_id,version_number,title,objective,hook,change_note) VALUES($1,1,$2,'Учебна цел.','Учебен случай.','perfect_video_story_first_20261010') RETURNING id",[lid,l.title])).rows[0].id;
    const oldBlocks=[
      {key:'objective',type:'objective',content:{body:l.opening.body},points:5},
      {key:'hook',type:'hook',content:{body:'Съществуващо обяснение.'},points:0},
      {key:'core',type:'rich_text',content:{body:'Съществуващ материал, който не се съкращава.'},points:0},
      {key:'quiz_1',type:'quiz',content:{question:'Synthetic question.',options:[{id:'a',label:'Synthetic A'},{id:'b',label:'Synthetic B'}]},points:10},
      {key:'quiz_2',type:'quiz',content:{question:'Second synthetic question.',options:[{id:'a',label:'Synthetic A'},{id:'b',label:'Synthetic B'}]},points:10},
      {key:'summary',type:'summary',content:{takeaways:['Съществуващ извод.']},points:0},
    ];
    for(const [i,b] of oldBlocks.entries()) {
      const bid=(await db.query<{id:string}>('INSERT INTO academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points) VALUES($1,$2,$3,$4,$2,$5,true,$6) RETURNING id',[vid,b.key,i*10,b.type,b.content,b.points])).rows[0].id;
      if(b.type==='quiz') await db.query("INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring) VALUES($1,'{\"correct\":\"a\"}','{\"explanation\":\"Synthetic explanation.\"}','{}')",[bid]);
    }
    await db.query("UPDATE academy_lessons SET status='published',published_version_id=$2,draft_version_id=$2 WHERE id=$1",[lid,vid]);
    versions.set(l.lesson,vid);
    const payload={opening:l.opening,practice:{...l.practice,evaluation:{matches:expected(l)},feedback:{retry:'Провери условията.',success:'Преминато учебно решение.'}}};
    await db.query(`INSERT INTO academy_private.practical_lesson_upgrades(release_key,module_id,lesson_id,expected_version_id,expected_fingerprint,payload)
      SELECT $1,l.module_id,l.lesson_id,l.published_version_id,md5(to_jsonb(l)::text||to_jsonb(v)::text||coalesce((SELECT string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id)
      FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=v.id),'')),$2
      FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id WHERE l.id=$3`,[release,payload,lid]);
  }
  await actor(db,'authenticated',STUDENT);
  const oldVersion=await version('pv01-01');
  await db.query("SELECT academy_complete_lesson_block('s02-m01','pv01-01',$1,'quiz_1','{\"answer\":\"a\"}',$2)",[oldVersion,randomUUID()]);
  await actor(db);
  original={version:oldVersion,progress:(await db.query('SELECT to_jsonb(p) row FROM academy_lesson_progress p WHERE user_id=$1',[STUDENT])).rows[0].row,
    attempts:(await db.query('SELECT to_jsonb(a) row FROM academy_lesson_attempts_v2 a ORDER BY id')).rows,
    other:(await db.query("SELECT to_jsonb(l) row FROM academy_lessons l WHERE module_id NOT LIKE 's02-%' ORDER BY id")).rows};
},120000);
afterAll(async()=>{await db?.close();});

test('every existing lesson is mapped and its text capacity increases',()=>{
  expect(candidates).toHaveLength(90);
  expect(new Set(candidates.map(l=>l.lesson)).size).toBe(90);
  expect([1,2,3,4,5].map(m=>candidates.filter(l=>l.module===`s02-m0${m}`).length)).toEqual([24,20,21,17,8]);
  for(const l of candidates) {expect(parseClosedStudio(l.practice.content),l.lesson).not.toBeNull();expect(l.wordsAfter).toBeGreaterThan(l.wordsBefore);expect(l.practice.required).toBe(true);}
  expect(JSON.stringify(candidates)).not.toMatch(/"(?:evaluation|answer_key|correct|modelAnswer)"\s*:/);
});
test('a late source or private-grader edit aborts the entire batch',async()=>{
  await db.exec('BEGIN');
  await db.exec("UPDATE academy_private.lesson_block_keys SET scoring='{\"changed\":true}' WHERE block_id IN(SELECT b.id FROM academy_lesson_blocks b JOIN academy_lessons l ON l.published_version_id=b.version_id WHERE l.lesson_id='pv05-08')");
  await expect(db.query('SELECT academy_private.publish_practical_video_01_05()')).rejects.toThrow(/content changed/);
  await db.exec('ROLLBACK');
  expect((await db.query("SELECT count(*)::int n FROM academy_lesson_blocks WHERE block_key='practical_studio_20261014'")).rows[0].n).toBe(0);
});
test('atomic publication preserves old teaching, private graders, attempts and unrelated courses',async()=>{
  expect((await db.query<{r:any}>('SELECT academy_private.publish_practical_video_01_05() r')).rows[0].r.published).toBe(90);
  for(const l of (await db.query<{lesson_id:string;published_version_id:string}>("SELECT lesson_id,published_version_id FROM academy_lessons WHERE module_id ~ '^s02-m0[1-5]$'")).rows) versions.set(l.lesson_id,l.published_version_id);
  expect((await db.query('SELECT to_jsonb(a) row FROM academy_lesson_attempts_v2 a ORDER BY id')).rows).toEqual(original.attempts);
  expect((await db.query("SELECT to_jsonb(l) row FROM academy_lessons l WHERE module_id NOT LIKE 's02-%' ORDER BY id")).rows).toEqual(original.other);
  expect((await db.query('SELECT snapshot FROM academy_private.lesson_progress_history WHERE version_id=$1',[original.version])).rows[0].snapshot).toEqual(original.progress);
  expect((await db.query<any>('SELECT completed_block_keys,xp,completed_at FROM academy_lesson_progress WHERE user_id=$1',[STUDENT])).rows[0]).toMatchObject({completed_block_keys:['quiz_1'],xp:10,completed_at:null});
  const changed=(await db.query<{n:number}>(`SELECT count(*)::int n FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id
    JOIN academy_lesson_blocks old ON old.version_id=v.origin_version_id LEFT JOIN academy_lesson_blocks b ON b.version_id=v.id AND b.block_key=old.block_key
    LEFT JOIN academy_private.lesson_block_keys ok ON ok.block_id=old.id LEFT JOIN academy_private.lesson_block_keys nk ON nk.block_id=b.id
    WHERE l.module_id ~ '^s02-m0[1-5]$' AND old.block_type<>'objective' AND (b.id IS NULL OR ROW(b.block_type,b.title,b.content,b.required,b.points,nk.answer_key,nk.feedback,nk.scoring)
    IS DISTINCT FROM ROW(old.block_type,old.title,old.content,old.required,old.points,ok.answer_key,ok.feedback,ok.scoring))`)).rows[0].n;
  expect(changed).toBe(0);
  expect((await db.query<{n:number}>("SELECT count(*)::int n FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id WHERE l.module_id ~ '^s02-m0[1-5]$' AND v.change_note='perfect_video_story_first_20261010'")).rows[0].n).toBe(90);
  expect((await db.query<{r:any}>('SELECT academy_private.publish_practical_video_01_05() r')).rows[0].r.alreadyPublished).toBe(true);
});
test('wrong finite decisions need correction; a full correct attempt passes all 90 studios',async()=>{
  await actor(db,'authenticated',STUDENT);
  for(const l of candidates) {
    const matches=expected(l),slot=l.practice.content.left[0];
    const other=slot.choices.find(id=>id!==matches[slot.id])!;
    const wrong=await submit(l.lesson,{matches:{...matches,[slot.id]:other}});
    expect(wrong.correct,l.lesson).toBe(false);expect(wrong.feedback.complete).toBe(false);
    expect(wrong.feedback.explanation).toContain(slot.text);
    expect(wrong.feedback).not.toHaveProperty('answer');
    const right=await submit(l.lesson,{matches});
    expect(right.correct,l.lesson).toBe(true);expect(right.feedback.complete).toBe(true);
    expect(right.score).toBe(20);expect(right.feedback).not.toHaveProperty('answer');
    expect(right.progress.completed_block_keys).toContain('practical_studio_20261014');
    expect(right.progress.completed_at).toBeNull(); // other required work remains
  }
},120000);
test('unknown identifiers, pasted text, files and extra exam fields cannot be saved',async()=>{
  const l=candidates[0],v=await version(l.lesson),matches=expected(l);
  for(const payload of [{matches,text:'private learner text'},{matches,file:'data:audio/wav;base64,AAAA'},{matches:{...matches,'made-up':'x'}},{matches:{...matches,[l.practice.content.left[0].id]:'https://example.invalid/answer'}}]) {
    await expect(submit(l.lesson,payload)).rejects.toThrow(/Unexpected|Unknown/);
  }
  await expect(db.query('SELECT academy_autosave_lesson($1,$2,$3,$4,$5)',[l.module,l.lesson,v,'practical_studio_20261014',{practical_studio_20261014:{matches,text:'no'}}])).rejects.toThrow(/Unexpected/);
  await db.query('SELECT academy_autosave_lesson($1,$2,$3,$4,$5)',[l.module,l.lesson,v,'practical_studio_20261014',{practical_studio_20261014:{matches:{[l.practice.content.left[0].id]:matches[l.practice.content.left[0].id]}}}]);
  await actor(db); await expect(db.query("SELECT academy_private.assert_closed_block_payload('course_exam','{\"questions\":[]}','{\"answers\":{},\"text\":\"no\"}',false)")).rejects.toThrow(/Unexpected/);
});
test('an old open browser cannot overwrite new-version progress',async()=>{
  await actor(db,'authenticated',STUDENT);
  await expect(db.query("SELECT academy_autosave_lesson('s02-m01','pv01-01',$1,'quiz_1','{}')",[original.version])).rejects.toThrow(/Invalid progress/);
  await expect(db.query("SELECT academy_complete_lesson_block('s02-m01','pv01-01',$1,'quiz_1','{\"answer\":\"a\"}',$2)",[original.version,randomUUID()])).rejects.toThrow(/version changed/);
});
test('private checkpoints and publishing stay owner-only; paid video is not anonymous',async()=>{
  await actor(db,'authenticated',OTHER);
  await expect(db.query('SELECT * FROM academy_private.practical_lesson_upgrades')).rejects.toThrow(/permission denied/);
  await expect(db.query('SELECT academy_private.publish_practical_video_01_05()')).rejects.toThrow(/permission denied/);
  await expect(submit(candidates[0].lesson,{matches:expected(candidates[0])})).rejects.toThrow(/Access denied/);
  await actor(db,'anon');
  await expect(db.query("SELECT academy_get_lesson_v2('s02-m01','pv01-01')")).rejects.toThrow(/Access denied/);
});
test('legacy student upload is denied even if a permissive storage policy exists',async()=>{
  await actor(db);
  await db.exec('CREATE POLICY synthetic_allow_storage ON storage.objects FOR ALL TO authenticated USING(true) WITH CHECK(true)');
  await actor(db,'authenticated',STUDENT);
  await expect(db.query("INSERT INTO storage.objects(bucket_id,name) VALUES('academy-submissions','synthetic.wav')")).rejects.toThrow(/row-level security/);
});
