import { afterAll, beforeAll, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import type { PGlite } from '@electric-sql/pglite';
import { createSilkDatabase, actor, STUDENT, OTHER } from './helpers/silk-road-db';
import { loadNextPracticalMarketingCandidates } from '../scripts/prepare-next-practical-marketing-assets.mjs';
import { loadPracticalMarketingCandidates } from '../scripts/prepare-practical-marketing-assets.mjs';
import { loadFinalCandidates } from '../scripts/prepare-final-video-assets.mjs';
import { marketingVisibleWords, marketingVisibleFragments } from '../src/lib/marketing-reading-count';
import { parseClosedStudio } from '../src/lib/closed-practice-studio';
import { ACADEMY_READING_WORDS } from '../src/data/academy-reading-words';

const candidates = loadNextPracticalMarketingCandidates();
const packet = JSON.parse(readFileSync('scripts/marketing-basics/releases/community-6-10-20261012.json','utf8'));
const source = packet.lesson_files.flatMap(file=>JSON.parse(readFileSync(`scripts/marketing-basics/releases/${file}`,'utf8')).lessons);
const release = 'practical_marketing_6_10_20261015';
const privateRows = process.env.MARKETING_NEXT_PRIVATE_CANDIDATES ? JSON.parse(readFileSync(process.env.MARKETING_NEXT_PRIVATE_CANDIDATES,'utf8')) : null;
const expected = (l: typeof candidates[number]) => privateRows?.find(row=>row.lesson===l.lesson)?.payload.practice.evaluation.matches || Object.fromEntries(l.practice.content.left.map(slot=>[slot.id,slot.choices[0]]));
function payload(l: typeof candidates[number]) {
  return privateRows?.find(row=>row.lesson===l.lesson)?.payload || {
    opening:l.opening,bridge:l.bridge,...(l.amendments?{amendments:l.amendments}:{}),
    practice:{...l.practice,evaluation:{matches:expected(l)},feedback:{success:'Преминато учебно решение.',retry:'Прегледай дадените условия.',details:Object.fromEntries(l.practice.content.left.map(slot=>[slot.id,{success:`Успешна част: ${slot.text}.`,retry:`Насока за част: ${slot.text}.` }]))}},
  };
}
let db: PGlite;
const versions = new Map<string,string>();
let oldVersion:string, originalProgress:unknown, originalAttempts:unknown, originalOutside:unknown;
async function submit(l: typeof candidates[number], matches = expected(l), attempt = randomUUID()) {
  return (await db.query<{r:any}>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) r',[l.module,l.lesson,versions.get(l.lesson),'marketing_studio_next_20261015',{matches},attempt])).rows[0].r;
}
beforeAll(async()=>{
  db=await createSilkDatabase();
  await db.exec(readFileSync('supabase/migrations/20261009190315_silk_road_market_ready_publication.sql','utf8').split('-- PUBLISH_MARKET_CURRICULUM')[0]);
  await db.exec(readFileSync('supabase/migrations/20261010163647_perfect_video_story_first_publication.sql','utf8').split('-- PUBLISH_VIDEO_STORY_CURRICULUM')[0]);
  await db.exec(readFileSync('supabase/migrations/20261015064651_practical_video_studio_payloads.sql','utf8'));
  await db.exec(readFileSync('supabase/migrations/20261015121821_practical_marketing_first_5_publication.sql','utf8'));
  await db.exec(readFileSync('supabase/migrations/20261015133829_practical_marketing_6_10_publication.sql','utf8'));
  const firstFive = loadPracticalMarketingCandidates()[0];
  const originalFirstFive = JSON.parse(readFileSync('scripts/marketing-basics/releases/community-1-5-20261011.json','utf8')).lessons.find(l=>l.lesson_id===firstFive.lesson);
  const outside={...originalFirstFive,blocks:[...originalFirstFive.blocks.map(b=>({...b,content:b.type==='objective'?firstFive.opening:b.content})),firstFive.bridge,firstFive.practice]};
  const video=loadFinalCandidates()[0];
  const legacyVideo={source_module_id:video.module,lesson_id:video.lesson,title:video.title,subtitle:'Запазена видео практика',blocks:[video.practice]};
  for(const s of [...source,outside,legacyVideo]){
    const lid=(await db.query<{id:string}>("INSERT INTO academy_lessons(module_id,lesson_id,status) VALUES($1,$2,'draft') RETURNING id",[s.source_module_id,s.lesson_id])).rows[0].id;
    const vid=(await db.query<{id:string}>("INSERT INTO academy_lesson_versions(academy_lesson_id,version_number,title,subtitle,objective,hook,change_note) VALUES($1,1,$2,$3,'Учебна цел.','Учебен случай.',$4) RETURNING id",[lid,s.title,s.subtitle,s.source_module_id.startsWith('s02-')?'perfect_video_story_first_20261010':s.lesson_id===outside.lesson_id?'marketing_basics_community_first_stage1_20261011':'marketing_basics_community_second_stage2_20261012'])).rows[0].id;
    for(const [i,b] of s.blocks.entries()){
      const bid=(await db.query<{id:string}>('INSERT INTO academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',[vid,b.key,i*10,b.type,b.title,b.content,b.required,b.points])).rows[0].id;
      let key:Record<string,unknown>|null=null;
      if(['quiz','scenario'].includes(b.type))key={correct:b.content.options[(i+1)%b.content.options.length].id};
      else if(b.type==='matching')key={matches:Object.fromEntries(b.content.left.map((slot,index)=>[slot.id,slot.choices?.[0]||b.content.right[index%b.content.right.length].id]))};
      else if(b.type==='sequence_sort')key={order:b.content.items.map(item=>item.id)};
      if(key)await db.query('INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring) VALUES($1,$2,$3,$4)',[bid,key,b.content.studio?.domain==='marketing'?{success:'Съхранена практика от първите пет модула.',retry:'Провери условията на запазения случай.',details:Object.fromEntries(b.content.left.map(slot=>[slot.id,{success:'Запазена обяснена учебна стъпка.',retry:'Свери запазената стъпка с условието.'}]))}:{explanation:'Synthetic historical feedback.'},{}]);
    }
    await db.query("UPDATE academy_lessons SET status='published',published_version_id=$2,draft_version_id=$2 WHERE id=$1",[lid,vid]);
    versions.set(s.lesson_id,vid);
    if(s.lesson_id===outside.lesson_id||s.lesson_id===video.lesson)continue;
    const l=candidates.find(c=>c.lesson===s.lesson_id)!;
    await db.query(`INSERT INTO academy_private.practical_marketing_6_10_upgrades(release_key,module_id,lesson_id,expected_version_id,expected_fingerprint,payload)
      SELECT $1,l.module_id,l.lesson_id,l.published_version_id,md5(to_jsonb(l)::text||to_jsonb(v)::text||coalesce((SELECT string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id)
      FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=v.id),'')),$2
      FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id WHERE l.id=$3`,[release,payload(l),lid]);
  }
  oldVersion=versions.get('lm10-01')!;
  await actor(db,'authenticated',STUDENT);
  await db.query("SELECT academy_complete_lesson_block('s03-m10','lm10-01',$1,'objective','{\"acknowledged\":true}',$2)",[oldVersion,randomUUID()]);
  await db.query("SELECT academy_complete_lesson_block('s03-m10','lm10-01',$1,'principle','{\"acknowledged\":true}',$2)",[oldVersion,randomUUID()]);
  await actor(db);
  originalProgress=(await db.query('SELECT to_jsonb(p) r FROM academy_lesson_progress p WHERE user_id=$1',[STUDENT])).rows[0].r;
  originalAttempts=(await db.query('SELECT to_jsonb(a) r FROM academy_lesson_attempts_v2 a ORDER BY id')).rows;
  originalOutside=(await db.query("SELECT to_jsonb(l) l,to_jsonb(v) v,to_jsonb(b) b FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id WHERE l.lesson_id NOT IN(SELECT lesson_id FROM academy_private.practical_marketing_6_10_upgrades) ORDER BY b.id")).rows;
},120000);
afterAll(async()=>{await db?.close();});

test('63 lessons retain all detail and add a distinct worked example, closed practice and changed condition',()=>{
  expect(candidates).toHaveLength(63);
  expect(['s03-m01','s03-m06','s03-m08','s03-m09','s03-m10','s03-m11'].map(module=>candidates.filter(l=>l.module===module).length)).toEqual([1,12,14,14,12,10]);
  expect(candidates.find(l=>l.lesson==='lm01-01')?.module).toBe('s03-m01');
  expect(JSON.stringify(candidates)).not.toMatch(/"(?:evaluation|answer_key|correct|modelAnswer|scoring)"\s*:/);
  for(const l of candidates){
    const s=source.find(s=>s.lesson_id===l.lesson), blocks=s.blocks.map(b=>({...b,content:b.type==='objective'?l.opening:l.amendments?.find(a=>a.key===b.key)?.content||b.content}));
    expect(l.opening.body,l.lesson).toBe(s.blocks[0].content.body);
    blocks.push(l.bridge,l.practice);
    expect(marketingVisibleWords({...s,blocks})).toBe(l.wordsAfter);
    expect(marketingVisibleFragments({...s,blocks}).join('\n').split('\n')).toHaveLength(l.linesAfter);
    expect(l.wordsAfter,l.lesson).toBeGreaterThan(l.wordsBefore);
    expect(l.linesAfter,l.lesson).toBeGreaterThan(l.linesBefore);
    expect(l.firstPageWordsAfter,l.lesson).toBeGreaterThan(l.firstPageWordsBefore);
    expect(ACADEMY_READING_WORDS[`${l.module}/${l.lesson}`]).toBe(l.wordsAfter);
    const studio=parseClosedStudio(l.practice.content)!;
    expect(studio.domain).toBe('marketing');expect(studio.slots.length).toBeGreaterThanOrEqual(3);
    expect(studio.slots.filter(slot=>slot.phase==='change')).toHaveLength(1);
    expect(studio.slots.every(slot=>slot.choices.length===3)).toBe(true);
    expect(l.bridge.required).toBe(true);expect(l.practice.required).toBe(true);
    expect(l.bridge.content.body).not.toContain(studio.initialContext);
  }
});
test('a late private-grader change aborts the whole publication',async()=>{
  await db.exec('BEGIN');
  await db.exec("UPDATE academy_private.lesson_block_keys SET scoring='{\"drift\":true}' WHERE block_id IN(SELECT b.id FROM academy_lesson_blocks b JOIN academy_lessons l ON b.version_id=l.published_version_id WHERE l.lesson_id='lm11-10')");
  await expect(db.query('SELECT academy_private.publish_practical_marketing_6_10()')).rejects.toThrow(/content changed/);
  await db.exec('ROLLBACK');
  expect((await db.query<{n:number}>("SELECT count(*)::int n FROM academy_lesson_blocks WHERE block_key='marketing_studio_next_20261015'")).rows[0].n).toBe(0);
});
test('publication refuses missing per-decision teaching feedback',async()=>{
  await db.exec('BEGIN');
  await db.exec("UPDATE academy_private.practical_marketing_6_10_upgrades SET payload=payload#-'{practice,feedback,details,slot-1,retry}' WHERE lesson_id='lm11-10'");
  await expect(db.query('SELECT academy_private.publish_practical_marketing_6_10()')).rejects.toThrow(/Missing decision feedback/);
  await db.exec('ROLLBACK');
});
test('atomic publication preserves historical content, private keys and progress and includes only the moved lesson from source module 1',async()=>{
  expect((await db.query<{r:any}>('SELECT academy_private.publish_practical_marketing_6_10() r')).rows[0].r.published).toBe(63);
  for(const row of (await db.query<{lesson_id:string;published_version_id:string}>("SELECT lesson_id,published_version_id FROM academy_lessons WHERE module_id LIKE 's03-%'")).rows)versions.set(row.lesson_id,row.published_version_id);
  expect((await db.query('SELECT to_jsonb(a) r FROM academy_lesson_attempts_v2 a ORDER BY id')).rows).toEqual(originalAttempts);
  expect((await db.query("SELECT to_jsonb(l) l,to_jsonb(v) v,to_jsonb(b) b FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id WHERE l.lesson_id NOT IN(SELECT lesson_id FROM academy_private.practical_marketing_6_10_upgrades) ORDER BY b.id")).rows).toEqual(originalOutside);
  expect((await db.query('SELECT snapshot FROM academy_private.lesson_progress_history WHERE version_id=$1',[oldVersion])).rows[0].snapshot).toEqual(originalProgress);
  expect((await db.query<any>('SELECT completed_block_keys,xp,completed_at FROM academy_lesson_progress WHERE user_id=$1',[STUDENT])).rows[0]).toMatchObject({completed_block_keys:['principle'],xp:2,completed_at:null});
  const changed=(await db.query<{n:number}>(`SELECT count(*)::int n FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id
    JOIN academy_lesson_blocks old ON old.version_id=v.origin_version_id LEFT JOIN academy_lesson_blocks b ON b.version_id=v.id AND b.block_key=old.block_key
    LEFT JOIN academy_private.lesson_block_keys ok ON ok.block_id=old.id LEFT JOIN academy_private.lesson_block_keys nk ON nk.block_id=b.id
    WHERE old.block_type<>'objective' AND (b.id IS NULL OR ROW(b.block_type,b.title,b.content,b.required,b.points,nk.answer_key,nk.feedback,nk.scoring)
    IS DISTINCT FROM ROW(old.block_type,old.title,old.content,old.required,old.points,ok.answer_key,ok.feedback,ok.scoring))`)).rows[0].n;
  expect(changed).toBe(0);
  expect((await db.query<{n:number}>(`SELECT count(*)::int n FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id WHERE b.block_key IN ('marketing_studio_next_20261015','marketing_worked_next_20261015') AND b.required`)).rows[0].n).toBe(126);
  const ordering=(await db.query<{n:number}>(`SELECT count(*)::int n FROM academy_lessons l JOIN academy_lesson_blocks s ON s.version_id=l.published_version_id AND s.block_key='marketing_studio_next_20261015'
    WHERE s.position>(SELECT min(position) FROM academy_lesson_blocks b WHERE b.version_id=s.version_id AND b.block_type IN ('quiz','scenario','sequence_sort','matching') AND b.id<>s.id)`)).rows[0].n;
  expect(ordering).toBe(0);
  expect((await db.query<{n:number}>("SELECT count(*)::int n FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id WHERE v.validation->>'practicalEdition'=$1 AND v.change_note='marketing_basics_community_second_stage2_20261012'",[release])).rows[0].n).toBe(63);
  expect((await db.query<{r:any}>('SELECT academy_private.publish_practical_marketing_6_10() r')).rows[0].r.alreadyPublished).toBe(true);
});
test('every new studio requires correct finite choices and returns only the selected explanation for each part',async()=>{
  await actor(db,'authenticated',STUDENT);
  for(const l of candidates){
    const matches=expected(l),first=l.practice.content.left[0],wrongId=first.choices.find(id=>id!==matches[first.id])!;
    const attempt=randomUUID(),wrong=await submit(l,{...matches,[first.id]:wrongId},attempt);
    expect(wrong.correct,l.lesson).toBe(false);expect(wrong.feedback.complete).toBe(false);
    expect(wrong.feedback.details).toHaveLength(l.practice.content.left.length);
    expect(wrong.feedback.details[0]).toEqual({label:first.text,correct:false,note:payload(l).practice.feedback.details[first.id].retry});
    expect(JSON.stringify(wrong.feedback)).not.toContain(matches[first.id]);
    expect(JSON.stringify(wrong.feedback)).not.toContain('"matches"');
    expect(wrong.feedback.details[0]).not.toHaveProperty('success');
    expect(await submit(l,{...matches,[first.id]:wrongId},attempt)).toEqual(wrong);
    for(const [index,slot] of l.practice.content.left.entries())for(const alternative of slot.choices.filter(id=>id!==matches[slot.id])){
      const result=await submit(l,{...matches,[slot.id]:alternative});
      expect(result.correct,`${l.lesson}/${slot.id}/${alternative}`).toBe(false);
      expect(result.feedback.complete).toBe(false);
      expect(result.feedback.details[index]).toEqual({label:slot.text,correct:false,note:payload(l).practice.feedback.details[slot.id].retry});
      expect(result.feedback.details.filter(part=>!part.correct)).toHaveLength(1);
    }
    const right=await submit(l);
    expect(right.correct,l.lesson).toBe(true);expect(right.score).toBe(20);
    for(const [i,slot] of l.practice.content.left.entries())expect(right.feedback.details[i]).toEqual({label:slot.text,correct:true,note:payload(l).practice.feedback.details[slot.id].success});
    expect(right.progress.completed_block_keys).toContain('marketing_studio_next_20261015');
    expect(right.progress.completed_at).toBeNull();
  }
},120000);
test('free text, URLs, files and choices belonging to another slot cannot enter save or grading',async()=>{
  const l=candidates[0],matches=expected(l),first=l.practice.content.left[0],last=l.practice.content.left.at(-1)!;
  for(const p of [{matches,text:'own answer'},{matches,file:'data:file;base64,AAAA'},{matches:{...matches,unknown:'x'}},{matches:{...matches,[first.id]:'https://example.invalid'}},{matches:{...matches,[first.id]:matches[last.id]}}]){
    await expect(db.query('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6)',[l.module,l.lesson,versions.get(l.lesson),'marketing_studio_next_20261015',p,randomUUID()])).rejects.toThrow(/Unexpected|Unknown/);
  }
  await expect(db.query('SELECT academy_autosave_lesson($1,$2,$3,$4,$5)',[l.module,l.lesson,versions.get(l.lesson),'marketing_studio_next_20261015',{marketing_studio_next_20261015:{matches,text:'no'}}])).rejects.toThrow(/Unexpected/);
  await db.query('SELECT academy_autosave_lesson($1,$2,$3,$4,$5)',[l.module,l.lesson,versions.get(l.lesson),'marketing_studio_next_20261015',{marketing_studio_next_20261015:{matches:{[first.id]:matches[first.id]}}}]);
});
test('an old browser cannot overwrite the newly published version',async()=>{
  await expect(db.query("SELECT academy_autosave_lesson('s03-m10','lm10-01',$1,'principle','{}')",[oldVersion])).rejects.toThrow(/Invalid progress/);
  await expect(db.query("SELECT academy_complete_lesson_block('s03-m10','lm10-01',$1,'principle','{\"acknowledged\":true}',$2)",[oldVersion,randomUUID()])).rejects.toThrow(/version changed/);
});
test('all 63 lessons complete through closed RPCs with the added practice and worked example',async()=>{
  for(const l of candidates){
    await actor(db,'postgres',STUDENT);
    const blocks=(await db.query<any>('SELECT b.*,k.answer_key FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=$1 AND b.required ORDER BY b.position',[versions.get(l.lesson)])).rows;
    await actor(db,'authenticated',STUDENT);
    for(const b of blocks){
      const p=b.block_type==='quiz'?{answer:b.answer_key.correct}:b.block_type==='scenario'?{selected:b.answer_key.correct}:b.block_type==='matching'?{matches:b.answer_key.matches}:b.block_type==='sequence_sort'?{order:b.answer_key.order}:b.block_type==='checklist'?{checked:b.content.items.map(i=>i.id)}:b.block_type==='step_reveal'?{revealed:b.content.steps.map(i=>i.id)}:b.block_type==='flip_cards'?{viewed:b.content.cards.map(i=>i.id)}:{acknowledged:true};
      const r=(await db.query<{r:any}>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) r',[l.module,l.lesson,versions.get(l.lesson),b.block_key,p,randomUUID()])).rows[0].r;
      expect(r.feedback.complete,`${l.lesson}/${b.block_key}`).toBe(true);
    }
  }
  await actor(db);
  expect((await db.query<{n:number}>(`SELECT count(*)::int n FROM academy_lesson_progress p JOIN academy_lessons l ON l.id=p.academy_lesson_id WHERE p.user_id=$1 AND p.version_id=l.published_version_id AND p.completed_at IS NOT NULL AND l.lesson_id IN(SELECT lesson_id FROM academy_private.practical_marketing_6_10_upgrades)`,[STUDENT])).rows[0].n).toBe(63);
},120000);
test('the updated shared grader retains the other courses’ feedback and finite-choice contract',async()=>{
  await actor(db,'postgres',STUDENT);
  const v=loadFinalCandidates()[0],block=(await db.query<any>('SELECT b.*,k.answer_key FROM academy_lesson_blocks b JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=$1',[versions.get(v.lesson)])).rows[0];
  const silk=(await db.query<any>("SELECT l.module_id,l.lesson_id,l.published_version_id,b.block_key,k.answer_key FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id='s01-m01' AND b.block_type='quiz' LIMIT 1")).rows[0];
  await actor(db,'authenticated',STUDENT);
  const videoResult=(await db.query<{r:any}>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) r',[v.module,v.lesson,versions.get(v.lesson),block.block_key,{matches:block.answer_key.matches},randomUUID()])).rows[0].r;
  expect(videoResult.correct).toBe(true);expect(videoResult.feedback).not.toHaveProperty('details');expect(videoResult.feedback).not.toHaveProperty('answer');
  const prior=loadPracticalMarketingCandidates()[0];
  await actor(db,'postgres',STUDENT);
  const priorKey=(await db.query<any>('SELECT k.answer_key FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.lesson_id=$1 AND b.block_key=$2',[prior.lesson,prior.practice.key])).rows[0].answer_key;
  await actor(db,'authenticated',STUDENT);
  const priorResult=(await db.query<{r:any}>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) r',[prior.module,prior.lesson,versions.get(prior.lesson),prior.practice.key,{matches:priorKey.matches},randomUUID()])).rows[0].r;
  expect(priorResult.correct).toBe(true);expect(priorResult.feedback.details).toHaveLength(prior.practice.content.left.length);
  const silkResult=(await db.query<{r:any}>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) r',[silk.module_id,silk.lesson_id,silk.published_version_id,silk.block_key,{answer:silk.answer_key.correct},randomUUID()])).rows[0].r;
  expect(silkResult.correct).toBe(true);expect(silkResult.feedback).not.toHaveProperty('details');expect(silkResult.feedback).not.toHaveProperty('answer');
});
test('private explanations and publication stay owner-only and marketing remains paid',async()=>{
  await actor(db,'authenticated',OTHER);
  for(const q of ['SELECT * FROM academy_private.practical_marketing_6_10_upgrades','SELECT academy_private.publish_practical_marketing_6_10()',"SELECT academy_private.marketing_practice_feedback(gen_random_uuid(),'{}',true)"])await expect(db.query(q)).rejects.toThrow(/permission denied/);
  await expect(submit(candidates[0])).rejects.toThrow(/Access denied/);
  await actor(db,'anon');await expect(db.query("SELECT academy_get_lesson_v2('s03-m10','lm10-01')")).rejects.toThrow(/Access denied/);
  await actor(db);
  await db.exec('CREATE POLICY synthetic_allow_marketing_storage ON storage.objects FOR ALL TO authenticated USING(true) WITH CHECK(true)');
  await actor(db,'authenticated',STUDENT);
  await expect(db.query("INSERT INTO storage.objects(bucket_id,name) VALUES('academy-submissions','synthetic.pdf')")).rejects.toThrow(/row-level security/);
});
