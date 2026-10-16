import {afterAll,beforeAll,expect,test} from 'vitest';
import {readFileSync,readdirSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import type {PGlite} from '@electric-sql/pglite';
import {actor,createSilkDatabase,STUDENT,OTHER} from './helpers/silk-road-db';
import {loadPracticalSilkCandidates} from '../scripts/prepare-practical-silk-assets.mjs';
import {loadFinalPracticalMarketingCandidates} from '../scripts/prepare-final-practical-marketing-assets.mjs';
import {parseClosedStudio} from '../src/lib/closed-practice-studio';
const release='practical_silk_20261016';
const candidates=loadPracticalSilkCandidates();
const migrationNames=readdirSync('supabase/migrations').filter(n=>n.endsWith('_practical_silk_studio_publication.sql'));
if(migrationNames.length!==1)throw Error('Expected one practical Silk Road migration');
const migration=readFileSync(`supabase/migrations/${migrationNames[0]}`,'utf8');
const privateRows=process.env.SILK_PRIVATE_CANDIDATES?JSON.parse(readFileSync(process.env.SILK_PRIVATE_CANDIDATES,'utf8')):null;
const expected=l=>privateRows?.find(p=>p.lesson===l.lesson)?.payload.practice.evaluation.matches||Object.fromEntries(l.practice.content.left.map(s=>[s.id,s.choices[0]]));
const payload=l=>privateRows?.find(p=>p.lesson===l.lesson)?.payload||{opening:l.opening,bridge:l.bridge,practice:{...l.practice,evaluation:{matches:expected(l)},feedback:{success:'Решенията следват учебните условия.',retry:'Провери посочените условия.',details:Object.fromEntries(l.practice.content.left.map(s=>[s.id,{success:`Успешна част: ${s.text}`,retry:`Прегледай частта: ${s.text}`}]))}}};
let db:PGlite,oldVersion:string,oldProgress:any,oldAttempts:any,outsideBefore:any;
const versions=new Map<string,string>();
const examQuestions=Array.from({length:33},(_,i)=>({id:`synthetic-exam-${i+1}`,moduleId:`s01-m${String(Math.floor(i/3)+1).padStart(2,'0')}`,prompt:`Synthetic historical question ${i+1}`,options:[{id:'yes',label:'Потвърденото условие'},{id:'no',label:'Непотвърденото условие'}]}));
const examKey={answers:Object.fromEntries(examQuestions.map(q=>[q.id,'yes'])),criticalQuestions:[examQuestions[0].id,examQuestions[12].id,examQuestions[24].id]};
async function grade(l,matches=expected(l),attempt=randomUUID()){
 return (await db.query<{r:any}>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) r',[l.module,l.lesson,versions.get(l.lesson),'silk_studio_20261016',{matches},attempt])).rows[0].r;
}
async function exam(){return (await db.query<{r:any}>('SELECT academy_submit_course_exam($1,$2,$3,$4,$5,$6) r',['s01-m11','l11-04',versions.get('l11-04'),'historical-exam',{answers:examKey.answers},randomUUID()])).rows[0].r;}

beforeAll(async()=>{
 db=await createSilkDatabase(true);
 await db.exec(readFileSync('supabase/migrations/20260929215642_perfect_video_module_15_practical_exam.sql','utf8').split('DO $release$')[0]);
 await db.exec(readFileSync('supabase/migrations/20261009190315_silk_road_market_ready_publication.sql','utf8').split('-- PUBLISH_MARKET_CURRICULUM')[0]);
 await db.exec(readFileSync('supabase/migrations/20261010163647_perfect_video_story_first_publication.sql','utf8').split('-- PUBLISH_VIDEO_STORY_CURRICULUM')[0]);
 const ex=readFileSync('supabase/migrations/20261012181301_marketing_community_final_exams.sql','utf8');await db.exec(ex.slice(ex.indexOf('CREATE OR REPLACE FUNCTION')));
 for(const file of ['20261015064651_practical_video_studio_payloads.sql','20261015121821_practical_marketing_first_5_publication.sql','20261015133829_practical_marketing_6_10_publication.sql','20261015192236_practical_marketing_11_15_publication.sql','20261015201823_practical_marketing_16_20_publication.sql'])await db.exec(readFileSync(`supabase/migrations/${file}`,'utf8'));
 await db.exec(migration);
 await db.exec("DELETE FROM academy_lesson_blocks WHERE block_type='practical_response'; UPDATE academy_lesson_versions SET change_note='silk_road_market_ready_20261009';");
 for(const l of candidates){
  const row=(await db.query<any>('SELECT * FROM academy_lessons WHERE module_id=$1 AND lesson_id=$2',[l.module,l.lesson])).rows[0];
  versions.set(l.lesson,row.published_version_id);
  await db.query("UPDATE academy_lesson_blocks SET content=$2 WHERE version_id=$1 AND block_type='objective'",[row.published_version_id,{body:l.opening.body,outcomes:['Запазено учебно умение'],deliverable:'Запазено подробно начало.',check:'Запазена проверка.'}]);
  if(l.lesson==='l11-04'){
   const block=(await db.query<{id:string}>("INSERT INTO academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points) VALUES($1,'historical-exam',999,'course_exam','Запазен изпит',$2,true,33) RETURNING id",[row.published_version_id,{introduction:'Synthetic historical exam bank.',minimumPercent:80,minimumGroupPercent:60,questions:examQuestions}])).rows[0];
   await db.query('INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring) VALUES($1,$2,$3,$4)',[block.id,examKey,{},{}]);
  }
  await db.query(`INSERT INTO academy_private.practical_silk_upgrades(release_key,module_id,lesson_id,expected_version_id,expected_fingerprint,payload)
   SELECT $1,l.module_id,l.lesson_id,l.published_version_id,md5(to_jsonb(l)::text||to_jsonb(v)::text||coalesce((SELECT string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id)
   FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=v.id),'')),$2
   FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id WHERE l.id=$3`,[release,payload(l),row.id]);
 }
 const outside=loadFinalPracticalMarketingCandidates()[0],practice=outside.practice,oid=randomUUID(),vid=randomUUID(),bid=randomUUID();
 await db.query("INSERT INTO academy_lessons(id,module_id,lesson_id,status) VALUES($1,$2,$3,'draft')",[oid,outside.module,outside.lesson]);
 await db.query("INSERT INTO academy_lesson_versions(id,academy_lesson_id,version_number,title,source_kind,change_note) VALUES($1,$2,1,$3,'editor','marketing_basics_community_final_stage4_20261012')",[vid,oid,outside.title]);
 await db.query('INSERT INTO academy_lesson_blocks(id,version_id,block_key,position,block_type,title,content,required,points) VALUES($1,$2,$3,0,$4,$5,$6,true,20)',[bid,vid,practice.key,practice.type,practice.title,practice.content]);
 const outsideKeys=Object.fromEntries(practice.content.left.map(s=>[s.id,s.choices[0]]));
 await db.query('INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring) VALUES($1,$2,$3,$4)',[bid,{matches:outsideKeys},{success:'Успешна запазена маркетинг практика.',retry:'Провери запазената практика.',details:Object.fromEntries(practice.content.left.map(s=>[s.id,{success:'Успешна част от запазен случай.',retry:'Свери запазения случай.'}]))},{}]);
 await db.query("UPDATE academy_lessons SET status='published',published_version_id=$2,draft_version_id=$2 WHERE id=$1",[oid,vid]);
 outsideBefore=(await db.query("SELECT to_jsonb(l) l,to_jsonb(v) v,to_jsonb(b) b,to_jsonb(k) k FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id LIKE 's03-%'")).rows;
 oldVersion=versions.get('l01-01')!;
 await actor(db,'authenticated',STUDENT);
 for(const key of ['objective','lesson_section_1'])await db.query("SELECT academy_complete_lesson_block('s01-m01','l01-01',$1,$2,'{\"acknowledged\":true}',$3)",[oldVersion,key,randomUUID()]);
 await actor(db);
 oldProgress=(await db.query("SELECT to_jsonb(p) r FROM academy_lesson_progress p JOIN academy_lessons l ON l.id=p.academy_lesson_id WHERE l.lesson_id='l01-01' AND p.user_id=$1",[STUDENT])).rows[0].r;
 oldAttempts=(await db.query('SELECT to_jsonb(a) r FROM academy_lesson_attempts_v2 a ORDER BY a.id')).rows;
},120000);
afterAll(async()=>{await db?.close();});

test('the full public release has finite choices, changed conditions and no evaluator',()=>{
 expect(candidates).toHaveLength(74);expect(new Set(candidates.map(l=>l.module)).size).toBe(11);
 const forbidden=new Set(['evaluation','answer_key','answers','correct','modelAnswer']);
 const scan=v=>{if(Array.isArray(v))v.forEach(scan);else if(v&&typeof v==='object')for(const [k,x]of Object.entries(v)){expect(forbidden.has(k)).toBe(false);scan(x);}};
 for(const l of candidates){scan(l);expect(l.wordsAfter).toBeGreaterThan(l.wordsBefore);expect(l.linesAfter).toBeGreaterThan(l.linesBefore);const s=parseClosedStudio(l.practice.content)!;expect(s.domain).toBe('silk-road');expect(s.slots).toHaveLength(4);expect(s.slots.filter(s=>s.phase==='change')).toHaveLength(1);expect(s.choices).toHaveLength(12);for(const choice of s.choices)if(choice.calculation)expect(choice.calculation.label).not.toMatch(/неправил|неподкрепен|обърнат|непълен|стар показател/i);}
});
test('missing feedback in the last lesson rolls back the entire publication',async()=>{
 const before=(await db.query('SELECT count(*) n FROM academy_lesson_versions')).rows[0];
 const last=candidates.at(-1),original=payload(last),broken=structuredClone(original);delete broken.practice.feedback.details['slot-4'];
 await db.query('UPDATE academy_private.practical_silk_upgrades SET payload=$1 WHERE lesson_id=$2',[broken,last.lesson]);
 await expect(db.query('SELECT academy_private.publish_practical_silk()')).rejects.toThrow(/Invalid practical|Missing decision/);
 expect((await db.query('SELECT count(*) n FROM academy_lesson_versions')).rows[0]).toEqual(before);
 expect((await db.query("SELECT count(*) n FROM academy_lesson_blocks WHERE content->'studio'->>'release'=$1",[release])).rows[0].n).toBe(0);
 await db.query('UPDATE academy_private.practical_silk_upgrades SET payload=$1 WHERE lesson_id=$2',[original,last.lesson]);
});
test('a changed private source evaluator blocks publication',async()=>{
 await db.exec('BEGIN');
 try{await db.query("UPDATE academy_private.lesson_block_keys SET feedback=feedback||'{\"auditDrift\":true}' WHERE block_id=(SELECT id FROM academy_lesson_blocks WHERE version_id=$1 AND block_type='quiz' LIMIT 1)",[oldVersion]);
 await expect(db.query('SELECT academy_private.publish_practical_silk()')).rejects.toThrow(/changed since staging/);
 }finally{await db.exec('ROLLBACK');}
});
test('publishes all lessons once and retains original blocks and exam bank',async()=>{
 const result=(await db.query<any>('SELECT academy_private.publish_practical_silk() r')).rows[0].r;expect(result.published).toBe(74);expect(result.progressRowsCarried).toBe(1);
 for(const r of (await db.query<any>("SELECT lesson_id,published_version_id FROM academy_lessons WHERE module_id LIKE 's01-%'")).rows)versions.set(r.lesson_id,r.published_version_id);
 expect((await db.query<any>('SELECT academy_private.publish_practical_silk() r')).rows[0].r.alreadyPublished).toBe(true);
 expect((await db.query("SELECT count(*) n FROM academy_lesson_blocks b JOIN academy_lessons l ON l.published_version_id=b.version_id WHERE b.content->'studio'->>'release'=$1 AND b.required",[release])).rows[0].n).toBe(74);
 const changes=(await db.query<any>(`SELECT count(*) n FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks old ON old.version_id=v.origin_version_id LEFT JOIN academy_lesson_blocks b ON b.version_id=v.id AND b.block_key=old.block_key
  LEFT JOIN academy_private.lesson_block_keys ok ON ok.block_id=old.id LEFT JOIN academy_private.lesson_block_keys nk ON nk.block_id=b.id
  WHERE l.module_id LIKE 's01-%' AND (b.id IS NULL OR ROW(b.block_type,b.title,b.required,b.points,nk.answer_key,nk.feedback,nk.scoring) IS DISTINCT FROM ROW(old.block_type,old.title,old.required,old.points,ok.answer_key,ok.feedback,ok.scoring)
  OR (old.block_type<>'objective' AND b.content IS DISTINCT FROM old.content) OR (old.block_type='objective' AND b.content->>'body' IS DISTINCT FROM old.content->>'body'))`)).rows[0];expect(changes.n).toBe(0);
 const bank=(await db.query<any>("SELECT b.content,k.answer_key FROM academy_lesson_blocks b JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=$1 AND b.block_type='course_exam'",[versions.get('l11-04')])).rows[0];expect(bank.content.questions).toEqual(examQuestions);expect(bank.answer_key).toEqual(examKey);
});
test('carries only identical completed work and archives the previous progress',async()=>{
 const p=(await db.query<any>("SELECT to_jsonb(p) r FROM academy_lesson_progress p JOIN academy_lessons l ON l.id=p.academy_lesson_id WHERE l.lesson_id='l01-01' AND p.user_id=$1",[STUDENT])).rows[0].r;
 expect(p.version_id).not.toBe(oldVersion);expect(p.completed_block_keys).toContain('lesson_section_1');expect(p.completed_block_keys).not.toContain('objective');expect(p.completed_at).toBeNull();
 const archived=(await db.query<any>('SELECT snapshot FROM academy_private.lesson_progress_history WHERE user_id=$1 AND version_id=$2',[STUDENT,oldVersion])).rows;expect(archived[0].snapshot).toEqual(oldProgress);
 expect((await db.query('SELECT to_jsonb(a) r FROM academy_lesson_attempts_v2 a ORDER BY a.id')).rows).toEqual(oldAttempts);expect(oldProgress.completed_block_keys).toContain('objective');
});
test('a guest gets real feedback for free practice and no account writes',async()=>{
 const before=(await db.query('SELECT count(*) n FROM academy_lesson_attempts_v2')).rows[0].n;
 await actor(db,'anon');const l=candidates[0],r=await grade(l);expect(r.correct).toBe(true);expect(r.feedback.details).toHaveLength(4);expect(r.progress).toBeNull();expect(r.preview).toBe(true);
 await expect(grade(candidates.find(l=>l.module==='s01-m02'))).rejects.toThrow(/Access denied/);
 await actor(db);expect((await db.query('SELECT count(*) n FROM academy_lesson_attempts_v2')).rows[0].n).toBe(before);
});
test('grades all 74 real staged maps and gives one retry note per changed wrong part',async()=>{
 await actor(db,'authenticated',STUDENT);
 for(const l of candidates){const correct=await grade(l);expect(correct.correct,l.lesson).toBe(true);expect(correct.feedback.details.every(d=>d.correct&&typeof d.note==='string')).toBe(true);
  const wrong={...expected(l)},slot=l.practice.content.left.at(-1);wrong[slot.id]=slot.choices.find(id=>id!==wrong[slot.id]);const retry=await grade(l,wrong);expect(retry.correct,l.lesson).toBe(false);expect(retry.feedback.complete).toBe(false);expect(retry.feedback.details.filter(d=>!d.correct)).toHaveLength(1);expect(retry.feedback).not.toHaveProperty('details.slot-4');expect(retry.feedback).not.toHaveProperty('answer');expect(retry.feedback).not.toHaveProperty('evaluation');
 }
 await actor(db);
},120000);
test('repeated attempts are idempotent and old tabs cannot write a different version',async()=>{
 await actor(db,'authenticated',STUDENT);const l=candidates[0],id=randomUUID(),first=await grade(l,expected(l),id),again=await grade(l,expected(l),id);expect(again.attemptId).toBe(first.attemptId);expect(again.progress.xp).toBe(first.progress.xp);
 await expect(db.query("SELECT academy_complete_lesson_block('s01-m01','l01-01',$1,'objective','{\"acknowledged\":true}',$2)",[oldVersion,randomUUID()])).rejects.toThrow(/version changed/);await actor(db);
});
test('rejects free text, unknown choices and a choice borrowed from another slot',async()=>{
 await actor(db,'authenticated',STUDENT);const l=candidates[0],base={...expected(l)},slot=l.practice.content.left[0];
 for(const p of [{matches:base,text:'собствен отговор'},{matches:{...base,[slot.id]:'arbitrary text'}},{matches:{...base,[slot.id]:l.practice.content.left[1].choices[0]}}])await expect(db.query('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6)',[l.module,l.lesson,versions.get(l.lesson),l.practice.key,p,randomUUID()])).rejects.toThrow();await actor(db);
});
test('other students and client roles cannot read private staging or run the publisher',async()=>{
 await actor(db,'authenticated',OTHER);await expect(grade(candidates.find(l=>l.module==='s01-m02'))).rejects.toThrow(/Access denied/);
 for(const role of ['anon','authenticated','service_role']){await actor(db,role);await expect(db.query('SELECT * FROM academy_private.practical_silk_upgrades')).rejects.toThrow();await expect(db.query('SELECT academy_private.publish_practical_silk()')).rejects.toThrow();}
 await actor(db);
});
test('the marketing block and its private grading remain unchanged',async()=>{
 const after=(await db.query("SELECT to_jsonb(l) l,to_jsonb(v) v,to_jsonb(b) b,to_jsonb(k) k FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id JOIN academy_lesson_blocks b ON b.version_id=v.id JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id LIKE 's03-%'")).rows;expect(after).toEqual(outsideBefore);
 const l=loadFinalPracticalMarketingCandidates()[0],row=after[0],matches=row.k.answer_key.matches;await actor(db,'authenticated',STUDENT);
 const r=(await db.query<any>('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6) r',[l.module,l.lesson,row.v.id,l.practice.key,{matches},randomUUID()])).rows[0].r;expect(r.correct).toBe(true);expect(r.feedback.details).toHaveLength(l.practice.content.left.length);await actor(db);
});
test('the final exam requires current lessons and the new final practice, keeping all 33 questions',async()=>{
 // Reset the final work to demonstrate both independent prerequisite checks.
 await db.query("UPDATE academy_lesson_progress SET completed_block_keys='{}',block_state='{}' WHERE user_id=$1 AND academy_lesson_id=(SELECT id FROM academy_lessons WHERE lesson_id='l11-04')",[STUDENT]);
 await actor(db,'authenticated',STUDENT);await expect(exam()).rejects.toThrow(/работна задача/);
 const last=candidates.at(-1);await db.query('SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6)',[last.module,last.lesson,versions.get(last.lesson),last.bridge.key,{acknowledged:true},randomUUID()]);await grade(last);
 await expect(exam()).rejects.toThrow(/73 урока/);await actor(db);
 await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,completed_block_keys,block_state,completed_at)
 SELECT $1,l.id,l.published_version_id,array_agg(b.block_key ORDER BY b.position),'{}'::jsonb,now()
 FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id
 WHERE l.module_id LIKE 's01-%' AND l.lesson_id<>'l11-04' AND b.required GROUP BY l.id
 ON CONFLICT(user_id,academy_lesson_id) DO UPDATE SET version_id=EXCLUDED.version_id,completed_block_keys=EXCLUDED.completed_block_keys,completed_at=EXCLUDED.completed_at`,[STUDENT]);
 await actor(db,'authenticated',STUDENT);const r=await exam();expect(r.correct).toBe(true);expect(r.maxScore).toBe(33);await actor(db);
});
