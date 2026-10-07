import { readFileSync } from 'node:fs';
import type { PGlite } from '@electric-sql/pglite';
import { createSilkDatabase } from './silk-road-db';
import { seedVideo711Lessons } from './perfect-video-711-db';

type Source = Parameters<typeof seedVideo711Lessons>[1];
export const marketing1115MigrationPath = 'supabase/migrations/20261007103339_marketing_basics_modules_11_15_ai_mcp_practice.sql';
export const marketing1115FingerprintSQL = readFileSync('scripts/marketing-basics/fingerprints.sql','utf8')
  .replace("('s03-m01','s03-m02','s03-m03','s03-m04','s03-m05')",
    "('s03-m11','s03-m12','s03-m13','s03-m14','s03-m15')");

export async function seedMarketing1115Lessons(db: PGlite): Promise<void> {
  const path = process.env.MARKETING_BASICS_1115_SOURCE_SNAPSHOT || 'tests/fixtures/marketing-basics-11-15-before.json';
  const source = JSON.parse(readFileSync(path,'utf8')) as Source;
  if (!process.env.MARKETING_BASICS_1115_SOURCE_SNAPSHOT) {
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

export async function createMarketing1115Database(): Promise<PGlite> {
  const db = await createSilkDatabase(true);
  await seedMarketing1115Lessons(db);
  return db;
}

export async function marketing1115Migration(db:PGlite):Promise<string> {
  const sql=readFileSync(marketing1115MigrationPath,'utf8');
  if (process.env.MARKETING_BASICS_1115_SOURCE_SNAPSHOT) return sql;
  const hashes=new Map((await db.query<{lesson_id:string;fingerprint:string}>(marketing1115FingerprintSQL)).rows.map(r=>[r.lesson_id,r.fingerprint]));
  const marker='$mb1115_payload$';
  const [prefix,payload,suffix]=sql.split(marker);
  const specs=JSON.parse(payload) as {lesson:string;source_hash:string}[];
  for (const spec of specs) spec.source_hash=hashes.get(spec.lesson)!;
  return prefix+marker+JSON.stringify(specs)+marker+suffix;
}
