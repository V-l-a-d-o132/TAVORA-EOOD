import {afterAll,beforeAll,expect,test} from 'vitest';
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import type {PGlite} from '@electric-sql/pglite';
import {actor,createSilkDatabase,STUDENT,OTHER} from './helpers/silk-road-db';
import {loadPracticalSilkCandidates} from '../scripts/prepare-practical-silk-assets.mjs';
import {countVisibleLessonWords} from '../src/lib/academy-reading-time';
const candidates=loadPracticalSilkCandidates('toolkit-20261018');
const oldCandidates=loadPracticalSilkCandidates();
const appliedCandidates=loadPracticalSilkCandidates('applied-20261018');
const privateRows=process.env.SILK_TOOLKIT_PRIVATE?JSON.parse(readFileSync(process.env.SILK_TOOLKIT_PRIVATE,'utf8')):null;
const payload=l=>privateRows?.find(r=>r.lesson===l.lesson)?.payload||{...l.payload,additions:l.payload.additions.map(b=>b.type==='matching'?{...b,evaluation:{matches:Object.fromEntries(b.content.left.map(s=>[s.id,s.choices[0]]))},feedback:{success:'Synthetic test success.',retry:'Synthetic test retry.',details:Object.fromEntries(b.content.left.map(s=>[s.id,{success:'Synthetic decision success.',retry:'Synthetic decision retry.'}]))}}:b)};
const transferred=l=>payload(l).additions.find(b=>b.type==='matching');
let db:PGlite,oldVersion:string,openingKey:string,oldProgress:any,oldAttempts:any,outsideBefore:string,oldWords:number,bodies:any[];
const versions=new Map<string,string>();
async function sourceContent(){return (await db.query<any>(`SELECT l.module_id AS "moduleId",l.lesson_id,v.title,v.subtitle,v.objective,jsonb_agg(jsonb_build_object('title',b.title,'content',b.content,'type',b.block_type) ORDER BY b.position) blocks FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id WHERE l.module_id LIKE 's01-%' GROUP BY l.module_id,l.lesson_id,v.id ORDER BY l.module_id,l.lesson_id`)).rows;}
async function outsideHash(){return (await db.query<any>(`SELECT md5(string_agg(to_jsonb(l)::text||to_jsonb(v)::text||to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY l.id,b.id)) h FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id NOT LIKE 's01-%'`)).rows[0].h;}
async function grade(l,matches=transferred(l).evaluation.matches,attempt=randomUUID()) {return (await db.query<any>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) r',[l.module,l.lesson,versions.get(l.lesson),'silk_toolcheck_20261018',{matches},attempt])).rows[0].r;}
beforeAll(async()=>{
 const saved=process.env.SILK_ROAD_SOURCE_SNAPSHOT;
 const realSource=process.env.SILK_TOOLKIT_SOURCE?JSON.parse(readFileSync(process.env.SILK_TOOLKIT_SOURCE,'utf8')):null;
 let temporary:string|undefined;
 if(realSource){temporary=mkdtempSync(join(tmpdir(),'silk-toolkit-test-'));const file=join(temporary,'source.json');writeFileSync(file,JSON.stringify(realSource.map(l=>({...l,blocks:l.blocks.filter(b=>b.block_type!=='course_exam')}))),{mode:0o600});process.env.SILK_ROAD_SOURCE_SNAPSHOT=file;}
 try{db=await createSilkDatabase(true);}finally{if(saved===undefined)delete process.env.SILK_ROAD_SOURCE_SNAPSHOT;else process.env.SILK_ROAD_SOURCE_SNAPSHOT=saved;if(temporary)rmSync(temporary,{recursive:true});}
 await db.exec(readFileSync('supabase/migrations/20260929215642_perfect_video_module_15_practical_exam.sql','utf8').split('DO $release$')[0]);
 await db.exec(readFileSync('supabase/migrations/20261009190315_silk_road_market_ready_publication.sql','utf8').split('-- PUBLISH_MARKET_CURRICULUM')[0]);
 await db.exec(readFileSync('supabase/migrations/20261010163647_perfect_video_story_first_publication.sql','utf8').split('-- PUBLISH_VIDEO_STORY_CURRICULUM')[0]);
 const ex=readFileSync('supabase/migrations/20261012181301_marketing_community_final_exams.sql','utf8');await db.exec(ex.slice(ex.indexOf('CREATE OR REPLACE FUNCTION')));
 for(const file of ['20261015064651_practical_video_studio_payloads.sql','20261015121821_practical_marketing_first_5_publication.sql','20261015133829_practical_marketing_6_10_publication.sql','20261015192236_practical_marketing_11_15_publication.sql','20261015201823_practical_marketing_16_20_publication.sql','20261016073844_practical_silk_studio_publication.sql'])await db.exec(readFileSync(`supabase/migrations/${file}`,'utf8'));
 for(const l of realSource||[])for(const b of l.blocks.filter(b=>b.block_type==='course_exam')){
  const id=(await db.query<any>('INSERT INTO academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',[l.version.id,b.block_key,b.position,b.block_type,b.title,b.content,b.required,b.points])).rows[0].id;
  await db.query('INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring) VALUES($1,$2,$3,$4)',[id,b.evaluation,b.feedback,b.scoring]);
 }
 if(!process.env.SILK_TOOLKIT_SOURCE){
  await db.exec("DELETE FROM academy_lesson_blocks WHERE block_type='practical_response'; UPDATE academy_lesson_versions SET change_note='silk_road_market_ready_20261009'");
  for(const l of candidates){
   const v=(await db.query<any>('SELECT published_version_id v FROM academy_lessons WHERE module_id=$1 AND lesson_id=$2',[l.module,l.lesson])).rows[0].v;
   const opening=appliedCandidates.find(r=>r.lesson===l.lesson).payload.amendments[0];await db.query("UPDATE academy_lesson_blocks SET block_key=$2,content=$3 WHERE version_id=$1 AND block_type='objective'",[v,opening.key,{...opening.content,body:opening.content.body+(l.lesson==='l01-01'?' Historical editorial body.':''),check:'Historical instructions.'}]);
   const old=oldCandidates.find(r=>r.lesson===l.lesson);
   for(const [index,b] of [old.bridge,old.practice].entries()){
    const id=(await db.query<any>('INSERT INTO academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',[v,b.key,100+index,b.type,b.title,b.content,b.required,b.points])).rows[0].id;
    if(b.type==='matching')await db.query('INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring) VALUES($1,$2,$3,$4)',[id,{matches:Object.fromEntries(b.content.left.map(s=>[s.id,s.choices[0]]))},{success:'Historical synthetic success.',retry:'Historical synthetic retry.',details:Object.fromEntries(b.content.left.map(s=>[s.id,{success:'Historical synthetic slot success.',retry:'Historical synthetic slot retry.'}]))},{}]);
   }
  }
  for(const l of appliedCandidates){
   const v=(await db.query<any>('SELECT published_version_id v FROM academy_lessons WHERE module_id=$1 AND lesson_id=$2',[l.module,l.lesson])).rows[0].v;
   for(const [index,b] of l.payload.additions.entries()){
    const id=(await db.query<any>('INSERT INTO academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',[v,b.key,300+index,b.type,b.title,b.content,b.required,b.points])).rows[0].id;
    if(b.type==='matching')await db.query('INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring) VALUES($1,$2,$3,$4)',[id,{matches:Object.fromEntries(b.content.left.map(s=>[s.id,s.choices[0]]))},{success:'Historical applied success.',retry:'Historical applied retry.',details:Object.fromEntries(b.content.left.map(s=>[s.id,{success:'Historical applied slot success.',retry:'Historical applied slot retry.'}]))},{}]);
   }
  }
  await db.exec("UPDATE academy_lesson_blocks SET position=900 WHERE block_type='summary'");
  const questions=Array.from({length:33},(_,i)=>({id:`synthetic-toolkit-${i+1}`,moduleId:`s01-m${String(Math.floor(i/3)+1).padStart(2,'0')}`,prompt:`Synthetic historical item ${i+1}`,options:[{id:'yes',label:'Provided fact'},{id:'no',label:'Missing fact'}]}));
  const v=(await db.query<any>("SELECT published_version_id v FROM academy_lessons WHERE lesson_id='l11-04'")).rows[0].v;
  const id=(await db.query<any>("INSERT INTO academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points) VALUES($1,'synthetic-historical-exam',999,'course_exam','Historical exam',$2,true,33) RETURNING id",[v,{introduction:'Synthetic retained bank.',minimumPercent:80,minimumGroupPercent:60,questions}])).rows[0].id;
  await db.query('INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring) VALUES($1,$2,$3,$4)',[id,{answers:Object.fromEntries(questions.map(q=>[q.id,'yes'])),criticalQuestions:[questions[0].id,questions[12].id,questions[24].id]},{},{}]);
 }
 await db.exec(readFileSync('supabase/migrations/20261018081531_silk_applied_materials_and_transfer.sql','utf8'));
 await db.exec(readFileSync('supabase/migrations/20261018142316_silk_toolkit_guides_and_checks.sql','utf8'));
 // Two unrelated course records act as a mutation boundary; no learner/client fixtures are production data.
 for(const module of ['s02-m01','s03-m01']){
  const l=(await db.query<any>("INSERT INTO academy_lessons(module_id,lesson_id,status) VALUES($1,$2,'draft') RETURNING id",[module,`${module}-synthetic`])).rows[0].id;
  const v=(await db.query<any>("INSERT INTO academy_lesson_versions(academy_lesson_id,version_number,title,source_kind) VALUES($1,1,'Unrelated synthetic lesson','editor') RETURNING id",[l])).rows[0].id;
  await db.query("INSERT INTO academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points) VALUES($1,'untouched',0,'rich_text','Unchanged material','{\"body\":\"Unchanged synthetic body\"}',true,5)",[v]);
  await db.query("UPDATE academy_lessons SET status='published',published_version_id=$2,draft_version_id=$2 WHERE id=$1",[l,v]);
 }
 for(const l of candidates)await db.query(`INSERT INTO academy_private.silk_toolkit_upgrades(release_key,module_id,lesson_id,expected_version_id,expected_fingerprint,payload)
 SELECT 'silk_toolkit_20261018',l.module_id,l.lesson_id,l.published_version_id,md5(to_jsonb(l)::text||to_jsonb(v)::text||coalesce((SELECT string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id) FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=v.id),'')),$3
 FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id WHERE l.module_id=$1 AND l.lesson_id=$2`,[l.module,l.lesson,payload(l)]);
 const before=await sourceContent();oldWords=before.reduce((n,l)=>n+countVisibleLessonWords(l),0);bodies=before.map(l=>l.blocks.find(b=>b.type==='objective').content.body);
 const l=(await db.query<any>("SELECT id,published_version_id FROM academy_lessons WHERE lesson_id='l01-03'")).rows[0];oldVersion=l.published_version_id;
 openingKey=(await db.query<any>("SELECT block_key FROM academy_lesson_blocks WHERE version_id=$1 AND block_type='objective'",[oldVersion])).rows[0].block_key;
 const keys=(await db.query<any>("SELECT b.block_key,b.block_type,b.points,k.answer_key FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=$1 AND (b.block_type='objective' OR b.block_key='silk_studio_20261016') ORDER BY b.position",[oldVersion])).rows;
 await actor(db,'authenticated',STUDENT);
 for(const b of keys)await db.query('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6)',['s01-m01','l01-03',oldVersion,b.block_key,b.block_type==='objective'?{acknowledged:true}:{matches:b.answer_key.matches},randomUUID()]);
 await actor(db);oldProgress=(await db.query<any>('SELECT to_jsonb(p) r FROM academy_lesson_progress p WHERE user_id=$1 AND academy_lesson_id=$2',[STUDENT,l.id])).rows[0].r;
 oldAttempts=(await db.query('SELECT md5(to_jsonb(a)::text) h FROM academy_lesson_attempts_v2 a ORDER BY a.id')).rows;outsideBefore=await outsideHash();
},120000);
afterAll(async()=>{await db?.close();});
test('bad feedback in the final case rolls the entire 74-lesson publication back',async()=>{
 const last=candidates.at(-1),p=payload(last),broken=structuredClone(p);delete broken.additions.find(b=>b.type==='matching').feedback.details['part-4'];
 const n=(await db.query<any>('SELECT count(*) n FROM academy_lesson_versions')).rows[0].n;
 await db.query('UPDATE academy_private.silk_toolkit_upgrades SET payload=$1 WHERE lesson_id=$2',[broken,last.lesson]);await expect(db.query('SELECT academy_private.publish_silk_toolkit()')).rejects.toThrow(/Invalid transfer/);
 expect((await db.query<any>('SELECT count(*) n FROM academy_lesson_versions')).rows[0].n).toBe(n);
 await db.query('UPDATE academy_private.silk_toolkit_upgrades SET payload=$1 WHERE lesson_id=$2',[p,last.lesson]);
});
test('drift in original private grading blocks publication',async()=>{
 await db.exec('BEGIN');try{await db.query("UPDATE academy_private.lesson_block_keys SET feedback=feedback||'{\"changedAfterReview\":true}' WHERE block_id=(SELECT id FROM academy_lesson_blocks WHERE version_id=$1 AND block_key='silk_studio_20261016')",[oldVersion]);await expect(db.query('SELECT academy_private.publish_silk_toolkit()')).rejects.toThrow(/changed since staging/);}finally{await db.exec('ROLLBACK');}
});
test('publishes one edition atomically, retaining original teaching and all old block keys',async()=>{
 const r=(await db.query<any>('SELECT academy_private.publish_silk_toolkit() r')).rows[0].r;expect(r.published).toBe(74);expect(r.addedBlocks).toBe(62);
 for(const r of (await db.query<any>("SELECT lesson_id,published_version_id FROM academy_lessons WHERE module_id LIKE 's01-%'")).rows)versions.set(r.lesson_id,r.published_version_id);
 expect((await db.query<any>('SELECT academy_private.publish_silk_toolkit() r')).rows[0].r.alreadyPublished).toBe(true);
 expect((await db.query<any>(`SELECT count(*) n FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks old ON old.version_id=v.origin_version_id LEFT JOIN academy_lesson_blocks b ON b.version_id=v.id AND b.block_key=old.block_key WHERE l.module_id LIKE 's01-%' AND b.id IS NULL`)).rows[0].n).toBe(0);
 const after=await sourceContent();expect(after.filter((l,i)=>l.blocks.find(b=>b.type==='objective').content.body!==bodies[i])).toHaveLength(0);
 const words=after.reduce((n,l)=>n+countVisibleLessonWords(l),0);expect(words).toBeGreaterThan(oldWords);
 if(process.env.SILK_TOOLKIT_METRICS)writeFileSync(process.env.SILK_TOOLKIT_METRICS,JSON.stringify({wordsBefore:oldWords,wordsAfter:words,lessons:74,newBlocks:62,toolGuides:51,transferCases:11,decisions:43,perLesson:Object.fromEntries(after.map(l=>[`${l.moduleId}/${l.lesson_id}`,countVisibleLessonWords(l)]))},null,2));
});
test('preserves historical attempts and identical completed work; new work is not credited automatically',async()=>{
 const p=(await db.query<any>("SELECT to_jsonb(p) r FROM academy_lesson_progress p JOIN academy_lessons l ON l.id=p.academy_lesson_id WHERE l.lesson_id='l01-03' AND p.user_id=$1",[STUDENT])).rows[0].r;
 expect(p.version_id).not.toBe(oldVersion);expect(p.completed_block_keys).toContain(openingKey);expect(p.completed_block_keys).toContain('silk_studio_20261016');
 expect((await db.query<any>('SELECT snapshot=$3::jsonb same FROM academy_private.lesson_progress_history WHERE user_id=$1 AND version_id=$2',[STUDENT,oldVersion,oldProgress])).rows[0].same).toBe(true);
 expect((await db.query('SELECT md5(to_jsonb(a)::text) h FROM academy_lesson_attempts_v2 a ORDER BY a.id')).rows).toEqual(oldAttempts);
});
test('a guest can check the free new case with feedback but cannot access paid cases or create account progress',async()=>{
 const free=candidates.find(l=>l.lesson==='l01-04'),paid=candidates.find(l=>l.lesson==='l02-10');const n=(await db.query<any>('SELECT count(*) n FROM academy_lesson_attempts_v2')).rows[0].n;
 await actor(db,'anon');const r=await grade(free);expect(r.correct).toBe(true);expect(r.preview).toBe(true);expect(r.progress).toBeNull();expect(r.feedback.details).toHaveLength(4);await expect(grade(paid)).rejects.toThrow(/Access denied/);await actor(db);
 expect((await db.query<any>('SELECT count(*) n FROM academy_lesson_attempts_v2')).rows[0].n).toBe(n);
});
test('all 43 real decisions accept the reviewed map and reject both alternatives individually',async()=>{
 await actor(db,'authenticated',STUDENT);
 for(const l of candidates.filter(l=>transferred(l))){const b=transferred(l),answers=b.evaluation.matches;const passed=await grade(l);expect(passed.correct).toBe(true);expect(passed.feedback.details.every(d=>d.correct)).toBe(true);
  for(const slot of b.content.left)for(const id of slot.choices.filter(id=>id!==answers[slot.id])){const result=await grade(l,{...answers,[slot.id]:id});expect(result.correct).toBe(false);expect(result.feedback.details.filter(d=>!d.correct)).toHaveLength(1);expect(result.feedback).not.toHaveProperty('evaluation');expect(result.feedback).not.toHaveProperty('answer_key');}
 }
 await actor(db);
},120000);
test('rejects open responses, cross-slot choices and stale-version writes; repeated submission does not award twice',async()=>{
 const l=candidates.find(l=>l.lesson==='l01-04'),b=transferred(l),map=b.evaluation.matches;
 await actor(db,'authenticated',STUDENT);
 for(const p of [{matches:map,text:'собствен отговор'},{matches:{...map,'part-1':'arbitrary'}},{matches:{...map,'part-1':b.content.left[1].choices[0]}}])await expect(db.query('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6)',[l.module,l.lesson,versions.get(l.lesson),b.key,p,randomUUID()])).rejects.toThrow();
 const id=randomUUID(),a=await grade(l,map,id),c=await grade(l,map,id);expect(a.attemptId).toBe(c.attemptId);expect(a.progress.xp).toBe(c.progress.xp);
 await expect(db.query("SELECT academy_complete_lesson_block('s01-m01','l01-03',$1,$2,'{\"acknowledged\":true}',$3)",[oldVersion,openingKey,randomUUID()])).rejects.toThrow(/version changed/);await actor(db);
});
test('only the owner can inspect staging or invoke publication; other courses are untouched',async()=>{
 expect(await outsideHash()).toBe(outsideBefore);
 for(const role of ['anon','authenticated','service_role']){await actor(db,role,OTHER);await expect(db.query('SELECT * FROM academy_private.silk_toolkit_upgrades')).rejects.toThrow();await expect(db.query('SELECT academy_private.publish_silk_toolkit()')).rejects.toThrow();}
 await actor(db);
});
test('the final course exam requires the independent final case without changing its bank',async()=>{
 expect((await db.query<any>(`SELECT count(*) n FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks old ON old.version_id=v.origin_version_id AND old.block_type='course_exam' JOIN academy_lesson_blocks b ON b.version_id=v.id AND b.block_key=old.block_key JOIN academy_private.lesson_block_keys nk ON nk.block_id=b.id JOIN academy_private.lesson_block_keys ok ON ok.block_id=old.id WHERE l.module_id LIKE 's01-%' AND (b.content IS DISTINCT FROM old.content OR nk.answer_key IS DISTINCT FROM ok.answer_key)`)).rows[0].n).toBe(0);
 const l=candidates.at(-1),exam=(await db.query<any>("SELECT b.block_key,k.answer_key FROM academy_lesson_blocks b JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=$1 AND b.block_type='course_exam'",[versions.get(l.lesson)])).rows[0];
 await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,completed_block_keys,block_state,completed_at)
 SELECT $1,l.id,l.published_version_id,array_agg(b.block_key ORDER BY b.position),'{}'::jsonb,now()
 FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id WHERE l.module_id LIKE 's01-%' AND l.lesson_id<>'l11-04' AND b.required GROUP BY l.id
 ON CONFLICT(user_id,academy_lesson_id) DO UPDATE SET version_id=EXCLUDED.version_id,completed_block_keys=EXCLUDED.completed_block_keys,completed_at=EXCLUDED.completed_at`,[STUDENT]);
 await db.query("UPDATE academy_lesson_progress SET completed_block_keys=ARRAY['silk_studio_20261016','silk_worked_20261016','silk_transfer_20261018'],block_state='{}',completed_at=NULL WHERE user_id=$1 AND academy_lesson_id=(SELECT id FROM academy_lessons WHERE lesson_id='l11-04')",[STUDENT]);
 const submit=()=>db.query<any>('SELECT academy_submit_course_exam($1,$2,$3,$4,$5,$6) r',[l.module,l.lesson,versions.get(l.lesson),exam.block_key,{answers:exam.answer_key.answers},randomUUID()]);
 await actor(db,'authenticated',STUDENT);await expect(submit()).rejects.toThrow(/работна задача/);await grade(l);const result=(await submit()).rows[0].r;expect(result.correct).toBe(true);expect(result.feedback.totalQuestions).toBe(33);await actor(db);
});
