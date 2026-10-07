import { readFileSync } from 'node:fs';
import type { PGlite } from '@electric-sql/pglite';
import { createSilkDatabase } from './silk-road-db';
import { seedVideo711Lessons } from './perfect-video-711-db';

type Source = Parameters<typeof seedVideo711Lessons>[1];
export const marketing610MigrationPath = 'supabase/migrations/20261007065643_marketing_basics_modules_6_10_strategy_practice.sql';
export const marketing610FingerprintSQL = readFileSync('scripts/marketing-basics/fingerprints.sql','utf8')
  .replace("('s03-m01','s03-m02','s03-m03','s03-m04','s03-m05')",
    "('s03-m01','s03-m02','s03-m03','s03-m04','s03-m05','s03-m06','s03-m07','s03-m08','s03-m09','s03-m10')");

export async function seedMarketing610Lessons(db: PGlite): Promise<void> {
  const path = process.env.MARKETING_BASICS_610_SOURCE_SNAPSHOT || 'tests/fixtures/marketing-basics-6-10-before.json';
  const source = JSON.parse(readFileSync(path,'utf8')) as Source;
  if (!process.env.MARKETING_BASICS_610_SOURCE_SNAPSHOT) {
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
      if (b.evaluation) {
        b.feedback = {explanation:'Fictional CI feedback; production mappings are verified outside Git.'};
        b.scoring = {};
      }
    }
  }
  await seedVideo711Lessons(db,source);
}

export async function createMarketing610Database(): Promise<PGlite> {
  const db = await createSilkDatabase(true);
  await seedMarketing610Lessons(db);
  return db;
}

export async function marketing610Migration(db:PGlite):Promise<string> {
  const sql=readFileSync(marketing610MigrationPath,'utf8');
  if (process.env.MARKETING_BASICS_610_SOURCE_SNAPSHOT) return sql;
  const hashes=new Map((await db.query<{lesson_id:string;fingerprint:string}>(marketing610FingerprintSQL)).rows.map(r=>[r.lesson_id,r.fingerprint]));
  const marker='$mb610_payload$';
  const [prefix,payload,suffix]=sql.split(marker);
  const specs=JSON.parse(payload) as {lesson:string;source_hash:string}[];
  for (const spec of specs) spec.source_hash=hashes.get(spec.lesson)!;
  return prefix+marker+JSON.stringify(specs)+marker+suffix;
}
