import {afterAll,beforeAll,describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import type {PGlite} from '@electric-sql/pglite';
import {actor,createSilkDatabase,learnerRecords,STUDENT} from './helpers/silk-road-db';
import {updateOpeningPages,openingFingerprint,openingEdition} from '../scripts/course-openings/update-openings.mjs';

let db:PGlite;
let specs:Record<string,unknown>[];
let before:Awaited<ReturnType<typeof learnerRecords>>;
let blocks:Record<string,unknown>[];
let versions:Record<string,unknown>[];
let identities:Record<string,unknown>[];
beforeAll(async()=>{
  db=await createSilkDatabase();
  await db.exec("update academy_lesson_blocks set points=1 where block_type='objective' and version_id in (select published_version_id from academy_lessons where module_id='s01-m01')");
  await db.query(`insert into academy_lesson_progress(user_id,academy_lesson_id,version_id,current_block_key,completed_block_keys,xp,score_percent,mastery_status,completed_at)
    select $1,l.id,l.published_version_id,'summary',array_agg(b.block_key order by b.position),sum(b.points),100,'mastered','2026-10-01'
    from academy_lessons l join academy_lesson_blocks b on b.version_id=l.published_version_id and b.required where l.lesson_id='l01-01' group by l.id`,[STUDENT]);
  before=await learnerRecords(db);
  blocks=(await db.query('select b.*,k.answer_key,k.feedback,k.scoring from academy_lesson_blocks b left join academy_private.lesson_block_keys k on k.block_id=b.id order by b.id')).rows;
  versions=(await db.query('select * from academy_lesson_versions order by id')).rows;
  identities=(await db.query('select * from academy_lessons order by id')).rows;
  const pages=JSON.parse(readFileSync('scripts/course-openings/releases/s01-m01.json','utf8')).lessons;
  const source=(await db.query<{id:string;module_id:string;lesson_id:string;published_version_id:string;draft_version_id:string;version_hash:string;blocks_hash:string;first_block_id:string;first_block_key:string}>(`select l.*,md5(to_jsonb(v)::text) version_hash,${openingFingerprint} blocks_hash,b.id first_block_id,b.block_key first_block_key
    from academy_lessons l join academy_lesson_versions v on v.id=l.published_version_id join academy_lesson_blocks b on b.version_id=v.id and b.block_type='objective' where l.module_id='s01-m01' order by l.lesson_id`)).rows;
  specs=source.map(s=>({...s,academy_lesson_id:s.id,content:pages.find((p:{lesson_id:string})=>p.lesson_id===s.lesson_id).first_page.content}));
},60000);
afterAll(async()=>{await db?.close();});
describe('Opening-only publication',()=>{
  it('rejects source drift before any page or audit is written',async()=>{
    const bad=structuredClone(specs);bad[0].blocks_hash='changed';
    await expect(db.query(updateOpeningPages(bad))).rejects.toThrow();
    expect((await db.query('select count(*)::int n from academy_lesson_audit')).rows).toEqual([{n:0}]);
    expect((await db.query('select b.*,k.answer_key,k.feedback,k.scoring from academy_lesson_blocks b left join academy_private.lesson_block_keys k on k.block_id=b.id order by b.id')).rows).toEqual(blocks);
  });
  it('updates only the opening content, title and points, preserving completed work and grading',async()=>{
    expect((await db.query<{updated_openings:number;audit_rows:number}>(updateOpeningPages(specs))).rows[0]).toMatchObject({updated_openings:4,audit_rows:4});
    expect(await learnerRecords(db)).toEqual(before);
    expect((await db.query('select * from academy_lesson_versions order by id')).rows).toEqual(versions);
    expect((await db.query('select * from academy_lessons order by id')).rows).toEqual(identities);
    const after=(await db.query<Record<string,unknown>>('select b.*,k.answer_key,k.feedback,k.scoring from academy_lesson_blocks b left join academy_private.lesson_block_keys k on k.block_id=b.id order by b.id')).rows;
    const target=new Set(specs.map(s=>s.first_block_id));
    for(const old of blocks){
      const current=after.find(b=>b.id===old.id)!;
      if(!target.has(old.id))expect(current).toEqual(old);
      else{
        const {title:oldTitle,content:oldContent,points:oldPoints,...oldStable}=old;
        const {title,content,points,...stable}=current;
        expect(stable).toEqual(oldStable);expect(title).toBe('Какво ще можеш след урока');expect(points).toBe(5);expect(content).toEqual(specs.find(s=>s.first_block_id===old.id)!.content);
        const audit=(await db.query<{details:{before:Record<string,unknown>}}>('select details from academy_lesson_audit where details->>\'edition\'=$1 and details->\'before\'->>\'id\'=$2',[openingEdition,old.id])).rows[0];
        expect(audit.details.before).toMatchObject({title:oldTitle,content:oldContent,points:oldPoints});
      }
    }
    await actor(db,'authenticated',STUDENT);
    const read=(await db.query<{lesson:{versionChanged:boolean;progress:{completed_at:string;completed_block_keys:string[]}}}>('select academy_get_lesson_v2($1,$2) lesson',['s01-m01','l01-01'])).rows[0].lesson;
    expect(read.versionChanged).toBe(false);expect(read.progress.completed_at).toBeTruthy();expect(read.progress.completed_block_keys).toContain('objective');
    await actor(db);
  },60000);
  it('cannot apply the same publication twice or target Marketing Basics',async()=>{
    await expect(db.query(updateOpeningPages(specs))).rejects.toThrow();
    expect((await db.query('select count(*)::int n from academy_lesson_audit')).rows).toEqual([{n:4}]);
    expect(()=>updateOpeningPages([{...specs[0],module_id:'s03-m01'}])).toThrow('Unexpected course scope');
  });
  it('awards the displayed five XP when a new opening is acknowledged',async()=>{
    await actor(db,'authenticated',STUDENT);
    const s=specs.find(s=>s.lesson_id==='l01-02')!;
    const response=(await db.query<{result:{score:number;maxScore:number;feedback:{complete:boolean};progress:{xp:number}}}>('select academy_complete_lesson_block($1,$2,$3,$4,$5,$6) result',[s.module_id,s.lesson_id,s.published_version_id,s.first_block_key,{acknowledged:true},crypto.randomUUID()])).rows[0].result;
    expect(response).toMatchObject({score:0,maxScore:0,feedback:{complete:true},progress:{xp:5}});
    await actor(db);
  });
});
