import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { PGlite } from '@electric-sql/pglite';
import { LEARNING_SECTIONS } from '../src/mocks/learning-platform';
import { ACADEMY_READING_WORDS } from '../src/data/academy-reading-words';
import { marketingVisibleFragments, marketingVisibleWords } from '../src/lib/marketing-reading-count';
import { locateLesson } from '../src/lib/academy-lesson-location';
import { actor, createSilkDatabase, learnerRecords, STUDENT, OTHER } from './helpers/silk-road-db';
import { seedVideo711Lessons } from './helpers/perfect-video-711-db';
import { stageCommunityLessons, publishCommunityLessons, versionFingerprint } from '../scripts/marketing-basics/community-release-1115.mjs';

type Block = { key:string;type:string;title:string;content:Record<string,unknown>;required:boolean;points:number;position:number;evaluation?:{correct?:string;order?:string[];matches?:Record<string,string>};feedback?:Record<string,unknown>;scoring?:Record<string,unknown> };
type Lesson = { academy_lesson_id:string;lesson_id:string;source_module_id:string;title:string;subtitle:string;objective:string;hook:string;estimated_minutes:number;duration:string;origin_version_id:string;previous_draft_version_id:string;source_fingerprint?:string;change_note:string;blocks:Block[] };
type Metric = {id:string;rendered:{words:number;lines:number};payload:{words:number;lines:number};first_page:{words:number;lines:number};baseline:{rendered:{words:number;lines:number};payload:{words:number;lines:number};first_page:{words:number;lines:number}}};
const release=JSON.parse(readFileSync('scripts/marketing-basics/releases/community-11-15-20261012.json','utf8')) as {lesson_files:string[];modules:{number:number;title:string}[]};
const parts=release.lesson_files.map(file=>JSON.parse(readFileSync(`scripts/marketing-basics/releases/${file}`,'utf8')) as {lessons:Lesson[];metrics:Metric[]});
const packet={...release,lessons:parts.flatMap(part=>part.lessons),metrics:parts.flatMap(part=>part.metrics)};

describe('Marketing Basics community modules 11–15',()=>{
  it('preserves all 51 donor lessons and the approved module order',()=>{
    expect(packet.lessons).toHaveLength(51);
    expect(packet.modules.map(m=>m.number)).toEqual([11,12,13,14,15]);
    expect(LEARNING_SECTIONS[2].modules.slice(10,15).map(m=>m.title)).toEqual(packet.modules.map(m=>m.title));
    for(const l of packet.lessons)expect(locateLesson(l.source_module_id,l.lesson_id)?.lesson.title).toBe(l.title);
    expect(LEARNING_SECTIONS[2].modules.slice(10,15).map(m=>m.id)).toEqual(['s03-m04','s03-m16','s03-m15','s03-m12','s03-m13']);
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
      expect(ACADEMY_READING_WORDS[`${l.source_module_id}/${l.lesson_id}`]).toBe(words);
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
      const practice=l.blocks.find(b=>['practice_brief','method'].includes(b.key))!;
      expect(String(practice.content.body)).not.toMatch(/Направи собствен опит|След своя опит|на лист|Пази своята работа/);
    }
    expect(packet.lessons.flatMap(l=>l.blocks).filter(b=>b.key==='assemble-message')).toHaveLength(15);
  });
  it('preserves the concrete methods, rights and numerical examples without file assignments',()=>{
    const find=(id:string,key:string)=>packet.lessons.find(l=>l.lesson_id===id)!.blocks.find(b=>b.key===key)!;
    expect(String(find('lm04-07','uncomfortable_truth').content.body)).toContain('MCP е протокол');
    expect(String(find('lm04-02','uncomfortable_truth').content.body)).toContain('2 декември 2026');
    expect(String(find('lm16-05','principle').content.body)).toContain('който и да е отзив');
    expect(String(find('lm13-08','useful-material').content.body)).toContain('само за четене');
    for(const id of ['lm16-08','lm15-09','lm12-12','lm13-12']){
      const workbook=String(find(id,'lab_workbook').content.body);
      expect(workbook).toContain('Секции на готовия пакет');
      expect(workbook).not.toMatch(/на лист|текстов редактор|Пази своята работа|Предай кратък план|Направи 90-дневен/);
    }
    expect(find('lm12-08','useful-material').content.table).toHaveLength(2);
  });
});

const candidatePath=process.env.MARKETING_COMMUNITY_1115_PRIVATE_CANDIDATE;
const sourcePath=process.env.MARKETING_COMMUNITY_1115_PRIVATE_SOURCE;
describe.skipIf(!candidatePath||!sourcePath)('Actual private candidate through the existing database RPCs',()=>{
  let db:PGlite;
  let candidate:Lesson[];
  let published:{lesson_id:string;version_id:string}[];
  let beforeLearners:Awaited<ReturnType<typeof learnerRecords>>;
  beforeAll(async()=>{
    db=await createSilkDatabase(true);
    const source=JSON.parse(readFileSync(sourcePath!,'utf8')).source as Parameters<typeof seedVideo711Lessons>[1];
    await seedVideo711Lessons(db,source);
    candidate=JSON.parse(readFileSync(candidatePath!,'utf8')) as Lesson[];
    const fingerprints=(await db.query<{lesson_id:string;fingerprint:string}>(`select l.lesson_id,${versionFingerprint} fingerprint from academy_lessons l join academy_lesson_versions v on v.id=l.published_version_id where l.module_id like 's03-%'`)).rows;
    for(const l of candidate)l.source_fingerprint=fingerprints.find(f=>f.lesson_id===l.lesson_id)!.fingerprint;
    const ai=candidate.find(l=>l.lesson_id==='lm04-01')!;
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
    expect(staged.drafts).toBe(51);published=staged.lessons;
    const checks=(await db.query<{lesson_id:string;validation:{errors:string[];warnings:string[]};fingerprint:string}>(`select l.lesson_id,academy_private.lesson_validation(v.id) validation,${versionFingerprint} fingerprint from academy_lessons l join academy_lesson_versions v on v.id=l.draft_version_id where v.change_note=$1`,[candidate[0].change_note])).rows;
    expect(checks).toHaveLength(51);
    for(const c of checks)expect(c.validation).toMatchObject({errors:[],warnings:[]});
    const publication=candidate.map(l=>({...l,draft_version_id:published.find(p=>p.lesson_id===l.lesson_id)!.version_id,draft_fingerprint:checks.find(c=>c.lesson_id===l.lesson_id)!.fingerprint,blocks:undefined}));
    const badDraft=structuredClone(publication);badDraft[0].draft_fingerprint='incorrect-draft';
    await expect(db.exec(publishCommunityLessons(badDraft))).rejects.toThrow();
    expect((await db.query('select published_version_id from academy_lessons where id=$1',[candidate[0].academy_lesson_id])).rows[0]).toMatchObject({published_version_id:candidate[0].origin_version_id});
    expect((await db.query<{published_lessons:number}>(publishCommunityLessons(publication))).rows[0].published_lessons).toBe(51);
    expect(await learnerRecords(db)).toEqual(beforeLearners);
    expect((await db.query('select count(*) n from academy_lesson_versions where id=any($1::uuid[])',[candidate.map(l=>l.origin_version_id)])).rows[0]).toMatchObject({n:51});
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
      for(const b of l.blocks.filter(b=>b.evaluation&&Object.keys(b.evaluation).length)){
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
    expect(checked).toBe(271);
    await actor(db);
  },180000);
});
