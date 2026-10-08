import { readFileSync } from 'node:fs';
import type { PGlite } from '@electric-sql/pglite';
import { createSilkDatabase } from './silk-road-db';
import { seedVideo711Lessons } from './perfect-video-711-db';

type Source = Parameters<typeof seedVideo711Lessons>[1];
export const marketing1620MigrationPath = 'supabase/migrations/20261007205100_marketing_basics_modules_16_20_complete_practice.sql';
export const marketing1620FingerprintSQL = readFileSync('scripts/marketing-basics/fingerprints.sql','utf8')
  .replace("('s03-m01','s03-m02','s03-m03','s03-m04','s03-m05')",
    "('s03-m16','s03-m17','s03-m18','s03-m19','s03-m20')");

export async function seedMarketing1620Lessons(db: PGlite): Promise<void> {
  const path = process.env.MARKETING_BASICS_1620_SOURCE_SNAPSHOT || 'tests/fixtures/marketing-basics-16-20-before.json';
  const source = JSON.parse(readFileSync(path,'utf8')) as Source;
  if (!process.env.MARKETING_BASICS_1620_SOURCE_SNAPSHOT) {
    // Fictional CI mappings exercise preservation without publishing real keys.
    for (const row of source) for (const [index,b] of row.blocks.entries()) {
      if (['quiz','scenario'].includes(b.block_type)) {
        const options = b.content.options as {id:string}[];
        b.evaluation = {correct:options[(index+2)%options.length].id};
      } else if (b.block_type==='sequence_sort') {
        b.evaluation = {order:(b.content.items as {id:string}[]).map(x=>x.id)};
      } else if (b.block_type==='calculator') {
        const value = 43210+index; // Deliberately unrelated to the real lesson calculation.
        b.evaluation = {value,min:value-0.01,max:value+0.01};
      }
      if (b.block_type==='course_exam') {
        const questions=b.content.questions as {id:string;options:{id:string}[]}[];
        b.evaluation={answers:Object.fromEntries(questions.map((q,i)=>[q.id,q.options[(i+1)%q.options.length].id]))};
        b.scoring={mode:'aggregate',minimumPercent:80,...(row.lesson_id==='lm20-14'?{minimumGroupPercent:60}:{})};
      }
      if (b.evaluation) {
        b.feedback = {explanation:'Fictional CI feedback; production mappings are verified outside Git.'};
        if(b.block_type!=='course_exam') b.scoring = {};
      }
    }
  }
  await seedVideo711Lessons(db,source);
}

export async function createMarketing1620Database(): Promise<PGlite> {
  const db = await createSilkDatabase(true);
  await db.exec(readFileSync('supabase/migrations/20260929215642_perfect_video_module_15_practical_exam.sql','utf8').split('DO $release$')[0]);
  await db.exec(readFileSync('supabase/migrations/20261001060142_marketing_basics_module20_course_exam.sql','utf8'));
  await db.exec(readFileSync('supabase/migrations/20261001175901_academy_retire_open_answers.sql','utf8'));
  await seedMarketing1620Lessons(db);
  return db;
}

export async function marketing1620Migration(db:PGlite):Promise<string> {
  const sql=readFileSync(marketing1620MigrationPath,'utf8');
  if (process.env.MARKETING_BASICS_1620_SOURCE_SNAPSHOT) return sql;
  const hashes=new Map((await db.query<{lesson_id:string;fingerprint:string}>(marketing1620FingerprintSQL)).rows.map(r=>[r.lesson_id,r.fingerprint]));
  const marker='$mb1620_payload$';
  const [prefix,payload,suffix]=sql.split(marker);
  const specs=JSON.parse(payload) as {lesson:string;source_hash:string}[];
  for (const spec of specs) spec.source_hash=hashes.get(spec.lesson)!;
  return prefix+marker+JSON.stringify(specs)+marker+suffix;
}
