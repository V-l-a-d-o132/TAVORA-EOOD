import { afterAll, beforeAll, expect, test } from 'vitest';
import { readFileSync,readdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import type { PGlite } from '@electric-sql/pglite';
import { actor,createSilkDatabase,STUDENT,OTHER } from './helpers/silk-road-db';
import {loadVideoAiSource,loadVideoAiCandidates} from '../scripts/prepare-video-ai-assets.mjs';
import {loadVideoCompletionLessons} from '../scripts/prepare-video-completion-assets.mjs';
let db:PGlite;const versions=new Map<string,string>();let progressBefore:any,attemptsBefore:any,outsideBefore:any,examsBefore:any;
const modules=['s02-m11','s02-m12','s02-m13','s02-m14','s02-m15'];
const privateSource=process.env.VIDEO_COMPLETION_SOURCE?JSON.parse(readFileSync(process.env.VIDEO_COMPLETION_SOURCE,'utf8')):null;
const privateCandidates=process.env.VIDEO_COMPLETION_PRIVATE?JSON.parse(readFileSync(process.env.VIDEO_COMPLETION_PRIVATE,'utf8')):null;
const candidates=loadVideoCompletionLessons();
function synthetic(b:any){
 if(['quiz','scenario'].includes(b.type))return {correct:b.content.options[0].id};
 if(b.type==='sequence_sort')return {order:b.content.items.map(x=>x.id)};
 if(b.type==='course_exam')return {answers:Object.fromEntries(b.content.questions.map(q=>[q.id,q.options[0].id])),criticalQuestions:b.content.questions.length===30?[5,12,13].map(m=>b.content.questions.find(q=>q.moduleId===`s02-m${String(m).padStart(2,'0')}`).id):[]};
 if(b.type==='matching')return {matches:Object.fromEntries(b.content.left.map((s,i)=>[s.id,(s.choices||b.content.right.map(x=>x.id))[s.choices?0:i%b.content.right.length]]))};
 return null;
}
function oldRows(){
 if(privateSource)return privateSource;
 const additions=new Map(loadVideoAiCandidates().map(r=>[r.lesson,r.payload.additions]));
 return loadVideoAiSource().filter(l=>modules.includes(l.module_id)).map(l=>{
  const blocks=l.blocks.map(b=>({key:b.block_key,type:b.block_type,title:b.title,content:b.content,required:b.required,points:b.points}));
  blocks.splice(blocks.findIndex(b=>b.key==='summary'),0,...(additions.get(l.lesson_id)||[]).map(b=>({key:b.key,type:b.type,title:b.title,content:b.content,required:b.required,points:b.points})));
  return {moduleId:l.module_id,lessonId:l.lesson_id,payload:{...l.version,blocks}};
 });
}
async function manifest(){return (await db.query<any>("select md5(string_agg(lesson_id||payload::text,'|' order by lesson_id)) h from academy_private.video_client_completion_candidates")).rows[0].h;}
async function publish(){return (await db.query<any>('select academy_private.publish_video_client_completion($1) r',[await manifest()])).rows[0].r;}
async function grade(lesson:string,map:any,attempt=randomUUID()){const mod=`s02-m${lesson.slice(2,4)}`;return(await db.query<any>('select academy_complete_lesson_block($1,$2,$3,$4,$5,$6) r',[mod,lesson,versions.get(lesson),'video_production_transfer_v1',{matches:map},attempt])).rows[0].r;}
async function stagedCase(lesson:string){return (await db.query<any>("select x.item from academy_private.video_client_completion_candidates c cross join lateral jsonb_array_elements(c.payload->'blocks') x(item) where c.lesson_id=$1 and x.item->>'key'='video_production_transfer_v1'",[lesson])).rows[0].item;}

beforeAll(async()=>{
 db=await createSilkDatabase();
 await db.exec(readFileSync('supabase/migrations/20260929215642_perfect_video_module_15_practical_exam.sql','utf8').split('DO $release$')[0]);
 for(const f of ['20261009190315_silk_road_market_ready_publication.sql','20261010163647_perfect_video_story_first_publication.sql']){
  const sql=readFileSync(`supabase/migrations/${f}`,'utf8');await db.exec(sql.split(f.startsWith('20261009')?'-- PUBLISH_MARKET_CURRICULUM':'-- PUBLISH_VIDEO_STORY_CURRICULUM')[0]);
 }
 const exams=readFileSync('supabase/migrations/20261012181301_marketing_community_final_exams.sql','utf8');await db.exec(exams.slice(exams.indexOf('CREATE OR REPLACE FUNCTION')));
 for(const f of ['20261015064651_practical_video_studio_payloads.sql','20261015084105_practical_video_11_15_publication.sql','20261015121821_practical_marketing_first_5_publication.sql','20261015133829_practical_marketing_6_10_publication.sql','20261015192236_practical_marketing_11_15_publication.sql','20261015201823_practical_marketing_16_20_publication.sql','20261016073844_practical_silk_studio_publication.sql','20261018081531_silk_applied_materials_and_transfer.sql','20261018142316_silk_toolkit_guides_and_checks.sql','20261019074909_perfect_video_ai_guides_and_checks.sql','20261019173331_marketing_ai_first_five_guides_and_checks.sql','20261020082612_marketing_ai_next_five_guides_and_checks.sql','20261020115403_marketing_ai_final_ten_guides_and_checks.sql'])await db.exec(readFileSync(`supabase/migrations/${f}`,'utf8'));
 for(const row of oldRows()){
  const p=row.payload;const id=(await db.query<any>("insert into academy_lessons(module_id,lesson_id,status) values($1,$2,'draft') returning id",[row.moduleId,row.lessonId])).rows[0].id;
  const v=(await db.query<any>("insert into academy_lesson_versions(academy_lesson_id,version_number,title,subtitle,duration,objective,hook,estimated_minutes,source_kind,change_note) values($1,1,$2,$3,'20 мин',$4,$5,20,'editor','perfect_video_story_first_20261010') returning id",[id,p.title,p.subtitle,p.objective,p.hook])).rows[0].id;versions.set(row.lessonId,v);
  for(const [i,b] of p.blocks.entries()){
   const bid=(await db.query<any>('insert into academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points) values($1,$2,$3,$4,$5,$6,$7,$8) returning id',[v,b.key,i*10,b.type,b.title,b.content,b.required,b.points])).rows[0].id;
   const key=b.answer_key||synthetic(b);if(key)await db.query('insert into academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring) values($1,$2,$3,$4)',[bid,key,b.feedback||{},b.scoring||{}]);
  }
  await db.query("update academy_lessons set status='published',published_version_id=$2,draft_version_id=$2 where id=$1",[id,v]);
 }
 await db.exec(readFileSync('supabase/migrations/20261022223454_video_client_production_modules_2_5.sql','utf8'));
 const migration=readdirSync('supabase/migrations').find(f=>f.endsWith('_video_client_completion_modules_11_15.sql'))!;await db.exec(readFileSync(`supabase/migrations/${migration}`,'utf8'));
 await db.exec(readFileSync('supabase/migrations/20261024072033_video_completion_exam_prerequisite.sql','utf8'));
 for(const publicRow of candidates){
  const p=structuredClone(privateCandidates?.find(r=>r.lessonId===publicRow.lessonId)?.payload||publicRow);
  if(!privateCandidates)for(const b of p.blocks){
   const prior=(await db.query<any>('select k.answer_key,k.feedback,k.scoring from academy_lesson_blocks b join academy_private.lesson_block_keys k on k.block_id=b.id where b.version_id=$1 and b.block_key=$2',[versions.get(publicRow.lessonId),b.key])).rows[0];
   if(prior){Object.assign(b,prior);}
   else if(b.type==='matching'){b.answer_key=synthetic(b);b.feedback={success:'Synthetic accepted fixture decision.',retry:'Synthetic fixture decision needs review.',details:Object.fromEntries(b.content.left.map(s=>[s.id,{success:'Synthetic accepted fixture part.',retry:'Synthetic fixture part needs review.'}]))};b.scoring={};}
  }
  await db.query(`insert into academy_private.video_client_completion_candidates(module_id,lesson_id,expected_version_id,expected_fingerprint,payload) select l.module_id,l.lesson_id,l.published_version_id,md5(to_jsonb(l)::text||to_jsonb(v)::text||coalesce((select string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' order by b.position,b.id) from academy_lesson_blocks b left join academy_private.lesson_block_keys k on k.block_id=b.id where b.version_id=v.id),'')),$3 from academy_lessons l join academy_lesson_versions v on v.id=l.published_version_id where l.module_id=$1 and l.lesson_id=$2`,[publicRow.moduleId,publicRow.lessonId,p]);
 }
 await actor(db,'authenticated',STUDENT);
 await db.query("select academy_complete_lesson_block('s02-m11','pv11-01',$1,'objective','{\"acknowledged\":true}',$2)",[versions.get('pv11-01'),randomUUID()]);
 await actor(db);progressBefore=(await db.query('select to_jsonb(p) r from academy_lesson_progress p where user_id=$1',[STUDENT])).rows;
 attemptsBefore=(await db.query('select md5(to_jsonb(a)::text) h from academy_lesson_attempts_v2 a order by id')).rows;
 examsBefore=(await db.query("select l.lesson_id,b.content,k.answer_key,k.feedback,k.scoring from academy_lessons l join academy_lesson_blocks b on b.version_id=l.published_version_id join academy_private.lesson_block_keys k on k.block_id=b.id where b.block_type='course_exam' order by l.lesson_id")).rows;
 outsideBefore=(await db.query("select to_jsonb(l) r from academy_lessons l where module_id not like 's02-%' order by id")).rows;
},120000);
afterAll(async()=>{await db?.close();});

test('incomplete feedback, changed points and source drift stop atomic publication',async()=>{
 const p=(await db.query<any>("select payload from academy_private.video_client_completion_candidates where lesson_id='pv15-13'")).rows[0].payload;
 const n=(await db.query<any>('select count(*) n from academy_lesson_versions')).rows[0].n;
 for(const mutate of [q=>delete q.blocks.find(b=>b.key==='video_production_transfer_v1').feedback.details['part-5'],q=>q.blocks.find(b=>b.key==='summary').points++]){
  const bad=structuredClone(p);mutate(bad);await db.query("update academy_private.video_client_completion_candidates set payload=$1 where lesson_id='pv15-13'",[bad]);
  await expect(publish()).rejects.toThrow(/Independent production case|Original block type/);expect((await db.query<any>('select count(*) n from academy_lesson_versions')).rows[0].n).toBe(n);
 }
 await db.query("update academy_private.video_client_completion_candidates set payload=$1 where lesson_id='pv15-13'",[p]);
 await db.exec('begin');try{await db.query("update academy_lesson_blocks set points=points+1 where version_id=$1 and block_key='principle'",[versions.get('pv11-01')]);await expect(publish()).rejects.toThrow(/changed since staging/);}finally{await db.exec('rollback');}
},30000);

test('publishes all 73 lessons once, preserves history and keys, and adds exactly five required cases',async()=>{
 const result=await publish();expect(result.published).toBe(73);expect(result.progressRowsCarried).toBe(1);expect((await publish()).alreadyPublished).toBe(true);
 for(const r of(await db.query<any>("select lesson_id,published_version_id from academy_lessons where module_id like 's02-%'")).rows)versions.set(r.lesson_id,r.published_version_id);
 expect((await db.query<any>("select count(*) n from academy_lesson_blocks b join academy_lessons l on l.published_version_id=b.version_id where l.module_id like 's02-%'")).rows[0].n).toBe(965);
 const keyChanges=(await db.query<any>("select count(*) n from academy_lessons l join academy_lesson_versions v on v.id=l.published_version_id join academy_lesson_blocks old on old.version_id=v.origin_version_id join academy_lesson_blocks b on b.version_id=v.id and b.block_key=old.block_key left join academy_private.lesson_block_keys ok on ok.block_id=old.id left join academy_private.lesson_block_keys nk on nk.block_id=b.id where l.module_id like 's02-%' and row(ok.answer_key,ok.scoring) is distinct from row(nk.answer_key,nk.scoring)")).rows[0].n;expect(keyChanges).toBe(0);
 expect((await db.query("select l.lesson_id,b.content,k.answer_key,k.feedback,k.scoring from academy_lessons l join academy_lesson_blocks b on b.version_id=l.published_version_id join academy_private.lesson_block_keys k on k.block_id=b.id where b.block_type='course_exam' order by l.lesson_id")).rows).toEqual(examsBefore);expect(examsBefore).toHaveLength(5);expect(examsBefore.reduce((n,b)=>n+b.content.questions.length,0)).toBe(78);
 expect((await db.query("select to_jsonb(l) r from academy_lessons l where module_id not like 's02-%' order by id")).rows).toEqual(outsideBefore);
 expect((await db.query('select md5(to_jsonb(a)::text) h from academy_lesson_attempts_v2 a order by id')).rows).toEqual(attemptsBefore);
 expect((await db.query<any>('select snapshot from academy_private.lesson_progress_history where user_id=$1',[STUDENT])).rows.some(r=>JSON.stringify(r.snapshot)===JSON.stringify(progressBefore[0].r))).toBe(true);
 expect((await db.query<any>('select completed_block_keys,completed_at from academy_lesson_progress where user_id=$1',[STUDENT])).rows[0]).toEqual({completed_block_keys:[],completed_at:null});
});

test('all 25 decisions accept reviewed maps and reject each alternative with private feedback',async()=>{
 for(const lesson of ['pv11-16','pv12-08','pv13-18','pv14-18','pv15-13']){
  await actor(db);const b=await stagedCase(lesson),map=b.answer_key.matches;await actor(db,'authenticated',STUDENT);
  const accepted=await grade(lesson,map);expect(accepted.correct,lesson).toBe(true);expect(accepted.feedback.details).toHaveLength(5);
  for(const slot of b.content.left)for(const alternative of slot.choices.filter(id=>id!==map[slot.id])){
   const rejected=await grade(lesson,{...map,[slot.id]:alternative});expect(rejected.correct).toBe(false);expect(rejected.feedback.details.filter(d=>!d.correct)).toHaveLength(1);
   expect(rejected.feedback).not.toHaveProperty('answer_key');expect(rejected.feedback).not.toHaveProperty('evaluation');
  }
 }
 await actor(db);
},120000);

test('paid access, private staging, closed payloads, stale writes and replay remain enforced',async()=>{
 await actor(db);const b=await stagedCase('pv15-13'),map=b.answer_key.matches;
 for(const role of ['anon','authenticated']){await actor(db,role,role==='anon'?'':OTHER);await expect(grade('pv15-13',map)).rejects.toThrow(/Access denied/);await expect(db.query('select * from academy_private.video_client_completion_candidates')).rejects.toThrow(/permission denied/);await expect(db.query("select academy_private.publish_video_client_completion('bad')")).rejects.toThrow(/permission denied/);}
 await actor(db,'authenticated',STUDENT);
 for(const extra of [{text:'open'},{file:'data:audio/wav;base64,AAAA'},{url:'https://example.invalid'},{number:5}])await expect(db.query("select academy_complete_lesson_block('s02-m15','pv15-13',$1,'video_production_transfer_v1',$2,$3)",[versions.get('pv15-13'),{matches:map,...extra},randomUUID()])).rejects.toThrow(/Unexpected/);
 const id=randomUUID();expect(await grade('pv15-13',map,id)).toEqual(await grade('pv15-13',map,id));
 await actor(db);const old=(await db.query<any>("select origin_version_id from academy_lesson_versions where id=$1",[versions.get('pv11-01')])).rows[0].origin_version_id;
 await actor(db,'authenticated',STUDENT);await expect(db.query("select academy_complete_lesson_block('s02-m11','pv11-01',$1,'objective','{\"acknowledged\":true}',$2)",[old,randomUUID()])).rejects.toThrow(/version changed/);await actor(db);
});

test('new final practice is required by both exam entries before the unchanged question bank',async()=>{
 await publish();
 const v=(await db.query<any>("select published_version_id v from academy_lessons where lesson_id='pv15-13'")).rows[0].v;
 await db.exec('begin');
 try{
  await db.query("delete from academy_lesson_progress where user_id=$1 and academy_lesson_id=(select id from academy_lessons where lesson_id='pv15-13')",[STUDENT]);
  const checks=(await db.query<any>("select b.block_key,k.answer_key from academy_lesson_blocks b join academy_private.lesson_block_keys k on k.block_id=b.id where b.version_id=$1 and b.block_type='matching'",[v])).rows;
  const exam=(await db.query<any>("select b.block_key,k.answer_key from academy_lesson_blocks b join academy_private.lesson_block_keys k on k.block_id=b.id where b.version_id=$1 and b.block_type='course_exam'",[v])).rows[0];
  await actor(db,'authenticated',STUDENT);
  for(const b of checks.filter(b=>b.block_key!=='video_production_transfer_v1'))await db.query('select academy_complete_lesson_block($1,$2,$3,$4,$5,$6)',['s02-m15','pv15-13',v,b.block_key,b.answer_key,randomUUID()]);
  for(const entry of ['academy_submit_course_exam','academy_private.submit_perfect_video_exam']){
   await actor(db,entry.startsWith('academy_private.')?'postgres':'authenticated',STUDENT);
   await db.exec('savepoint exam_gate');
   await expect(db.query(`select ${entry}($1,$2,$3,$4,$5,$6)`,['s02-m15','pv15-13',v,exam.block_key,{answers:exam.answer_key.answers},randomUUID()])).rejects.toThrow(/практическото решение/);
   await db.exec('rollback to savepoint exam_gate');
  }
  await actor(db,'authenticated',STUDENT);
  const transfer=checks.find(b=>b.block_key==='video_production_transfer_v1');
  await db.query('select academy_complete_lesson_block($1,$2,$3,$4,$5,$6)',['s02-m15','pv15-13',v,transfer.block_key,transfer.answer_key,randomUUID()]);
  await actor(db,'postgres',STUDENT);
  await db.query("select academy_private.assert_video_practice_ready('s02-m15','pv15-13',$1)",[v]);
 }finally{await db.exec('rollback');await actor(db);}
});

