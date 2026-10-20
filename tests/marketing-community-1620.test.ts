import { loadFinalMarketingAiCandidates } from '../scripts/prepare-final-marketing-ai-assets.mjs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { PGlite } from '@electric-sql/pglite';
import { LEARNING_SECTIONS } from '../src/mocks/learning-platform';
import { loadFinalPracticalMarketingCandidates } from '../scripts/prepare-final-practical-marketing-assets.mjs';
import { ACADEMY_READING_WORDS } from '../src/data/academy-reading-words';
import { marketingVisibleFragments, marketingVisibleWords } from '../src/lib/marketing-reading-count';
import { locateLesson } from '../src/lib/academy-lesson-location';
import { actor, createSilkDatabase, learnerRecords, STUDENT, OTHER } from './helpers/silk-road-db';
import { seedVideo711Lessons } from './helpers/perfect-video-711-db';
import { stageCommunityLessons, publishCommunityLessons, versionFingerprint } from '../scripts/marketing-basics/community-release-1620.mjs';

type Block = { key:string;type:string;title:string;content:Record<string,unknown>;required:boolean;points:number;position:number;evaluation?:{correct?:string;order?:string[];matches?:Record<string,string>;answers?:Record<string,string>};feedback?:Record<string,unknown>;scoring?:Record<string,unknown> };
type Lesson = { academy_lesson_id:string;lesson_id:string;source_module_id:string;title:string;subtitle:string;objective:string;hook:string;estimated_minutes:number;duration:string;origin_version_id:string;previous_draft_version_id:string;source_fingerprint?:string;change_note:string;blocks:Block[] };
type Metric = {id:string;rendered:{words:number;lines:number};payload:{words:number;lines:number};first_page:{words:number;lines:number};baseline:{rendered:{words:number;lines:number};payload:{words:number;lines:number};first_page:{words:number;lines:number}}};
const release=JSON.parse(readFileSync('scripts/marketing-basics/releases/community-16-20-20261012.json','utf8')) as {lesson_files:string[];modules:{number:number;title:string}[]};
const parts=release.lesson_files.map(file=>JSON.parse(readFileSync(`scripts/marketing-basics/releases/${file}`,'utf8')) as {lessons:Lesson[];metrics:Metric[]});
const packet={...release,lessons:parts.flatMap(part=>part.lessons),metrics:parts.flatMap(part=>part.metrics)};

describe('Marketing Basics community modules 16–20',()=>{
  it('preserves all 55 donor lessons and the approved module order',()=>{
    expect(packet.lessons).toHaveLength(55);
    expect(packet.modules.map(m=>m.number)).toEqual([16,17,18,19,20]);
    expect(LEARNING_SECTIONS[2].modules.slice(15,20).map(m=>m.title)).toEqual(packet.modules.map(m=>m.title));
    for(const l of packet.lessons)expect(locateLesson(l.source_module_id,l.lesson_id)?.lesson.title).toBe(l.title);
    expect(LEARNING_SECTIONS[2].modules.slice(15,20).map(m=>m.id)).toEqual(['s03-m14','s03-m17','s03-m18','s03-m19','s03-m20']);
  });
  it('keeps every lesson and its detailed first page above the original word and line floors',()=>{
    for(const l of packet.lessons){
      const m=packet.metrics.find(m=>m.id===l.lesson_id)!;
      expect(l.blocks[0].type).toBe('objective');
      for(const name of ['body','outcomes','deliverable','check'])expect(l.blocks[0].content[name],`${l.lesson_id}/${name}`).toBeTruthy();
      for(const field of ['rendered','payload','first_page'] as const)for(const unit of ['words','lines'] as const)expect(m[field][unit],`${l.lesson_id}/${field}/${unit}`).toBeGreaterThanOrEqual(m.baseline[field][unit]);
      const words=marketingVisibleWords(l);
      expect(words).toBe(m.rendered.words);
      expect(marketingVisibleFragments(l).flatMap(p=>p.split('\n')).filter(p=>p.trim()).length).toBe(m.rendered.lines);
      const practical=loadFinalPracticalMarketingCandidates().find(p=>p.lesson===l.lesson_id)!;
      const current={...l,blocks:[...l.blocks.map(b=>({...b,content:b.type==='objective'?practical.opening:b.content})),practical.bridge,practical.practice]};
      expect(ACADEMY_READING_WORDS[`${l.source_module_id}/${l.lesson_id}`]).toBe(marketingVisibleWords({...current,blocks:[...current.blocks,...(loadFinalMarketingAiCandidates().find(r=>r.lesson===l.lesson_id)?.payload.additions||[])]}));
    }
  });
  it('requires closed practice without publishing private grading data',()=>{
    const privateFields=new Set(['evaluation','answer_key','answerKey','correct','answers','scoring','feedback']);
    const inspect=(value:unknown)=>{if(Array.isArray(value))value.forEach(inspect);else if(value&&typeof value==='object')for(const [key,part]of Object.entries(value)){expect(privateFields.has(key),key).toBe(false);inspect(part);}};
    inspect(packet);
    for(const l of packet.lessons){
      expect(l.blocks.some(b=>['practical_response','prompt_builder','reflection','homework','submission','calculator'].includes(b.type)),l.lesson_id).toBe(false);
      expect(l.blocks.find(b=>b.key==='context-action')).toMatchObject({type:'scenario',required:true,points:10});
      expect(l.blocks.find(b=>b.key==='context-reason')).toMatchObject({type:'quiz',required:true,points:10});
      const practice=l.blocks.find(b=>['practice_brief','method'].includes(b.key));
      expect(String(practice?.content.body??'')).not.toMatch(/Направи собствен опит|След своя опит|на лист|Пази своята работа/);
    }
    expect(packet.lessons.flatMap(l=>l.blocks).filter(b=>b.type==='matching')).toHaveLength(15);
  });
  it('keeps full examples and aligns all five banks with the approved curriculum',()=>{
    const find=(id:string,key:string)=>packet.lessons.find(l=>l.lesson_id===id)!.blocks.find(b=>b.key===key)!;
    expect(String(find('lm14-06','model_solution').content.cards)).toBeTruthy();
    expect(find('lm17-11','lab_dataset').content.columns).toEqual(['Етап','Брой','Значение']);
    expect(packet.lessons.find(l=>l.lesson_id==='lm17-11')!.blocks.filter(b=>b.key.startsWith('crm-decision-'))).toHaveLength(20);
    for(const id of ['lm14-10','lm17-11','lm18-09','lm19-11','lm20-09'])expect(String(find(id,'lab_workbook').content.body)).not.toMatch(/Запази файл|изтегли|Създай папка|собствен опит/);
    expect(find('lm19-11','model_solution').content.cards).toBeTruthy();
    const exams=packet.lessons.flatMap(l=>l.blocks.filter(b=>b.type==='course_exam'));
    expect(exams.map(b=>(b.content.questions as unknown[]).length)).toEqual([14,16,15,15,60]);
    const retained=exams.flatMap(b=>b.content.questions as {sourceQuestion?:string}[]).filter(q=>q.sourceQuestion);
    expect(retained).toHaveLength(100);expect(new Set(retained.map(q=>q.sourceQuestion)).size).toBe(100);
    expect(exams[4].content.reviewNumbers).toMatchObject({'s03-m14':16,'s03-m12':14,'s03-m05':3});
  });
});

const candidatePath=process.env.MARKETING_COMMUNITY_1620_PRIVATE_CANDIDATE;
const sourcePath=process.env.MARKETING_COMMUNITY_1620_PRIVATE_SOURCE;
describe.skipIf(!candidatePath||!sourcePath)('Actual private candidate through the existing database RPCs',()=>{
  let db:PGlite;
  let candidate:Lesson[];
  let published:{lesson_id:string;version_id:string}[];
  let beforeLearners:Awaited<ReturnType<typeof learnerRecords>>;
  beforeAll(async()=>{
    db=await createSilkDatabase(true);
    const source=JSON.parse(readFileSync(sourcePath!,'utf8')).source as Parameters<typeof seedVideo711Lessons>[1];
    await db.exec(readFileSync('supabase/migrations/20260929215642_perfect_video_module_15_practical_exam.sql','utf8').split('DO $release$')[0]);
    await db.exec(readFileSync('supabase/migrations/20261001060142_marketing_basics_module20_course_exam.sql','utf8'));
    await db.exec(readFileSync('supabase/migrations/20261001175901_academy_retire_open_answers.sql','utf8'));
    const definitions=JSON.parse(readFileSync(sourcePath!.replace('Stage4_Source_Private','Stage4_DB_Functions_Private'),'utf8')) as {signature:string;definition:string}[];
    for(const definition of definitions)await db.exec(definition.definition+';');
    await db.exec(readFileSync('supabase/migrations/20261012181301_marketing_community_final_exams.sql','utf8'));
    await seedVideo711Lessons(db,source);
    const historical=source.find(l=>l.lesson_id==='lm20-10')!;
    const historicalExam=historical.blocks.find(b=>b.block_type==='course_exam')!;
    await actor(db,'authenticated',STUDENT);
    const historicalResult=(await db.query<{result:{correct:boolean}}>('select academy_submit_course_exam($1,$2,$3,$4,$5,$6) result',[historical.module_id,historical.lesson_id,historical.version.id,historicalExam.block_key,{answers:historicalExam.evaluation!.answers},crypto.randomUUID()])).rows[0].result;
    expect(historicalResult.correct).toBe(true);
    await actor(db);
    candidate=JSON.parse(readFileSync(candidatePath!,'utf8')) as Lesson[];
    const fingerprints=(await db.query<{lesson_id:string;fingerprint:string}>(`select l.lesson_id,${versionFingerprint} fingerprint from academy_lessons l join academy_lesson_versions v on v.id=l.published_version_id where l.module_id like 's03-%'`)).rows;
    for(const l of candidate)l.source_fingerprint=fingerprints.find(f=>f.lesson_id===l.lesson_id)!.fingerprint;
    const ai=candidate.find(l=>l.lesson_id==='lm14-01')!;
    await db.query(`insert into academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys,xp) values($1,$2,$3,'outcome','{}',array['outcome'],1)`,[STUDENT,ai.academy_lesson_id,ai.origin_version_id]);
    beforeLearners=await learnerRecords(db);
  },180000);
  afterAll(async()=>{await db?.close();});
  it('rejects a changed source atomically, then stages and publishes without editing learner rows',async()=>{
    const bad=structuredClone(candidate);bad[0].source_fingerprint='incorrect-source';
    const before=(await db.query('select count(*) n from academy_lesson_versions')).rows;
    await expect(db.exec(stageCommunityLessons(bad))).rejects.toThrow();
    expect((await db.query('select count(*) n from academy_lesson_versions')).rows).toEqual(before);
    const staged=(await db.query<{drafts:number;lessons:{lesson_id:string;version_id:string}[]}>(stageCommunityLessons(candidate))).rows[0];
    expect(staged.drafts).toBe(55);published=staged.lessons;
    const checks=(await db.query<{lesson_id:string;validation:{errors:string[];warnings:string[]};fingerprint:string}>(`select l.lesson_id,academy_private.lesson_validation(v.id) validation,${versionFingerprint} fingerprint from academy_lessons l join academy_lesson_versions v on v.id=l.draft_version_id where v.change_note=$1`,[candidate[0].change_note])).rows;
    expect(checks).toHaveLength(55);
    for(const c of checks)expect(c.validation).toMatchObject({errors:[],warnings:[]});
    const publication=candidate.map(l=>({...l,draft_version_id:published.find(p=>p.lesson_id===l.lesson_id)!.version_id,draft_fingerprint:checks.find(c=>c.lesson_id===l.lesson_id)!.fingerprint,blocks:undefined}));
    const badDraft=structuredClone(publication);badDraft[0].draft_fingerprint='incorrect-draft';
    await expect(db.exec(publishCommunityLessons(badDraft))).rejects.toThrow();
    expect((await db.query('select published_version_id from academy_lessons where id=$1',[candidate[0].academy_lesson_id])).rows[0]).toMatchObject({published_version_id:candidate[0].origin_version_id});
    expect((await db.query<{published_lessons:number}>(publishCommunityLessons(publication))).rows[0].published_lessons).toBe(55);
    expect(await learnerRecords(db)).toEqual(beforeLearners);
    expect((await db.query('select count(*) n from academy_lesson_versions where id=any($1::uuid[])',[candidate.map(l=>l.origin_version_id)])).rows[0]).toMatchObject({n:55});
    await actor(db,'authenticated',STUDENT);
    const changed=(await db.query<{lesson:{versionChanged:boolean;blocks:{key:string;completed?:boolean}[]}}>('select academy_get_lesson_v2($1,$2) lesson',['s03-m20','lm20-10'])).rows[0].lesson;
    expect(changed.versionChanged).toBe(true);
    expect(changed.blocks.find(b=>b.key==='exam')?.completed).not.toBe(true);
    await actor(db);
  },180000);
  it('grades every wrong option and the correct answer and keeps public reads protected',async()=>{
    await actor(db,'authenticated',OTHER);
    await expect(db.query('select academy_get_lesson_v2($1,$2)',[candidate[0].source_module_id,candidate[0].lesson_id])).rejects.toThrow('Access denied');
    await expect(db.query('select answer_key from academy_private.lesson_block_keys')).rejects.toThrow('permission denied');
    await actor(db,'authenticated',STUDENT);
    let checked=0;
    for(const l of candidate){
      const version=published.find(p=>p.lesson_id===l.lesson_id)!.version_id;
      const publicRead=(await db.query<{lesson:{blocks:unknown[]}}>('select academy_get_lesson_v2($1,$2) lesson',[l.source_module_id,l.lesson_id])).rows[0].lesson;
      expect(publicRead.blocks).toHaveLength(l.blocks.length);
      expect(JSON.stringify(publicRead.blocks)).not.toMatch(/"(?:evaluation|answer_key|scoring)":/);
      for(const b of l.blocks.filter(b=>b.type!=='course_exam'&&b.evaluation&&Object.keys(b.evaluation).length)){
        const submit=async(payload:unknown)=>(await db.query<{result:{correct:boolean;feedback:{complete:boolean;explanation:string}}}>('select academy_complete_lesson_block($1,$2,$3,$4,$5,$6) result',[l.source_module_id,l.lesson_id,version,b.key,payload,crypto.randomUUID()])).rows[0].result;
        const key=b.evaluation!;
        let right:unknown,wrong:unknown[];
        if(b.type==='sequence_sort'){right={order:key.order};wrong=[{order:[...key.order!].reverse()}];}
        else if(b.type==='matching'){right={matches:key.matches};const entries=Object.entries(key.matches!);wrong=[{matches:Object.fromEntries(entries.map(([k],i)=>[k,entries[(i+1)%entries.length][1]]))}];}
        else {const field=b.type==='quiz'?'answer':'selected';right={[field]:key.correct};wrong=(b.content.options as {id:string}[]).filter(o=>o.id!==key.correct).map(o=>({[field]:o.id}));}
        for(const payload of wrong){const result=await submit(payload);expect(result.correct,`${l.lesson_id}/${b.key}`).toBe(false);expect(result.feedback.complete,`${l.lesson_id}/${b.key}`).toBe(false);}
        const result=await submit(right);expect(result.correct,`${l.lesson_id}/${b.key}`).toBe(true);expect(result.feedback.complete).toBe(true);expect(result.feedback.explanation).toBeTruthy();checked++;
      }
    }
    expect(checked).toBe(268);
    await actor(db);
  },180000);
  it('checks every exam choice, exact thresholds, prerequisites and repeat submission through the real RPC',async()=>{
    const exams=candidate.filter(l=>l.blocks.some(b=>b.type==='course_exam'));
    const final=exams[4];
    const block=(l:Lesson)=>l.blocks.find(b=>b.type==='course_exam')!;
    type Question={id:string;moduleId:string;options:{id:string}[]};
    const questions=(l:Lesson)=>block(l).content.questions as Question[];
    const answers=(l:Lesson,wrongIds:string[]=[])=>({answers:Object.fromEntries(questions(l).map(q=>[q.id,wrongIds.includes(q.id)?q.options.find(o=>o.id!==block(l).evaluation!.answers![q.id])!.id:block(l).evaluation!.answers![q.id]]))});
    const version=(l:Lesson)=>published.find(p=>p.lesson_id===l.lesson_id)!.version_id;
    const submit=async(l:Lesson,payload:unknown,id=crypto.randomUUID())=>(await db.query<{result:{correct:boolean;feedback:{correctCount:number;scorePercent:number;groupResults:{passed:boolean;correctCount:number;totalQuestions:number}[]};progress:{completed_at?:string}}}>('select academy_submit_course_exam($1,$2,$3,$4,$5,$6) result',[l.source_module_id,l.lesson_id,version(l),block(l).key,payload,id])).rows[0].result;
    await actor(db,'authenticated',OTHER);
    await expect(submit(exams[0],answers(exams[0]))).rejects.toThrow('Access denied');
    await actor(db,'authenticated',STUDENT);
    await expect(submit(final,answers(final))).rejects.toThrow('13 урока');
    await expect(submit(exams[0],{answers:{}})).rejects.toThrow('Answer every exam question exactly once');
    await expect(db.query('select academy_complete_lesson_block($1,$2,$3,$4,$5,$6)',[final.source_module_id,exams[0].lesson_id,version(exams[0]),block(exams[0]).key,{acknowledged:true},crypto.randomUUID()])).rejects.toThrow('course exam endpoint');
    const completeRead=async(l:Lesson)=>{
      for(const b of l.blocks.filter(b=>b.required&&!b.evaluation)){
        const p=b.type==='step_reveal'?{revealed:(b.content.steps as {id:string}[]).map(s=>s.id)}:b.type==='flip_cards'?{viewed:(b.content.cards as {id:string}[]).map(c=>c.id)}:{acknowledged:true};
        await db.query('select academy_complete_lesson_block($1,$2,$3,$4,$5,$6)',[l.source_module_id,l.lesson_id,version(l),b.key,p,crypto.randomUUID()]);
      }
    };
    for(const l of candidate.filter(l=>l.source_module_id==='s03-m20'))await completeRead(l);
    let checked=0;
    const checkChoices=async(l:Lesson)=>{
      const qs=questions(l),base=answers(l,qs.map(q=>q.id));
      expect((await submit(l,base)).feedback.correctCount).toBe(0);
      for(const q of qs){
        for(const option of q.options.filter(o=>o.id!==block(l).evaluation!.answers![q.id])){
          const payload=structuredClone(base);payload.answers[q.id]=option.id;
          const result=await submit(l,payload);expect(result.correct).toBe(false);expect(result.feedback.correctCount,`${l.lesson_id}/${q.id}/${option.id}`).toBe(0);
        }
        const payload=structuredClone(base);payload.answers[q.id]=block(l).evaluation!.answers![q.id];
        const result=await submit(l,payload);expect(result.correct).toBe(false);expect(result.feedback.correctCount,`${l.lesson_id}/${q.id}`).toBe(1);checked++;
      }
    };
    for(const l of exams.slice(0,4)){
      await checkChoices(l);
      const n=questions(l).length,minimum=Math.ceil(n*.8);
      expect((await submit(l,answers(l,questions(l).slice(0,n-minimum+1).map(q=>q.id)))).correct).toBe(false);
      const result=await submit(l,answers(l,questions(l).slice(0,n-minimum).map(q=>q.id)));
      expect(result.correct,l.lesson_id).toBe(true);expect(result.feedback.correctCount).toBe(minimum);
    }
    await checkChoices(final);expect(checked).toBe(120);
    const numbers=block(final).content.reviewNumbers as Record<string,number>;
    const groups=[0,1,2,3].map(i=>questions(final).filter(q=>Math.floor((numbers[q.moduleId]-1)/5)===i));
    expect(groups.map(g=>g.length)).toEqual([15,15,15,15]);
    const failed=await submit(final,answers(final,groups[0].slice(0,7).map(q=>q.id)));
    expect(failed.correct).toBe(false);expect(failed.feedback.correctCount).toBe(53);expect(failed.feedback.groupResults[0].passed).toBe(false);
    const below=groups.flatMap((g,i)=>g.slice(0,i===0?4:3).map(q=>q.id));
    const rejected=await submit(final,answers(final,below));expect(rejected.correct).toBe(false);expect(rejected.feedback.correctCount).toBe(47);expect(rejected.feedback.groupResults.every(g=>g.passed)).toBe(true);
    await db.exec('BEGIN; SAVEPOINT exact_group');
    const groupBoundary=await submit(final,answers(final,groups[0].slice(0,6).map(q=>q.id)));
    expect(groupBoundary.correct).toBe(true);expect(groupBoundary.feedback.groupResults[0]).toMatchObject({correctCount:9,totalQuestions:15,passed:true});
    await db.exec('ROLLBACK TO SAVEPOINT exact_group; RELEASE SAVEPOINT exact_group');
    const payload=answers(final,groups.flatMap(g=>g.slice(0,3).map(q=>q.id))),id=crypto.randomUUID();
    const passed=await submit(final,payload,id);expect(passed.correct).toBe(true);expect(passed.feedback.correctCount).toBe(48);expect(passed.feedback.scorePercent).toBe(80);
    expect((await submit(final,payload,id)).feedback).toEqual(passed.feedback);
    expect(JSON.stringify(passed.feedback)).not.toMatch(/"(?:answers|answer_key|rationales)":/);
    await db.exec('COMMIT');
    await expect(submit(final,payload)).rejects.toThrow('Exam already passed');
    await actor(db);
    const progress=(await db.query<{completed_at:string;mastery_status:string}>('select completed_at,mastery_status from academy_lesson_progress where user_id=$1 and academy_lesson_id=$2',[STUDENT,final.academy_lesson_id])).rows[0];
    expect(progress.completed_at).toBeTruthy();expect(progress.mastery_status).toBe('mastered');
  },180000);
});
