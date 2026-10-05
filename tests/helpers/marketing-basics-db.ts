import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { createSilkDatabase } from './silk-road-db';
import { seedVideo711Lessons } from './perfect-video-711-db';

type Block = { block_key: string; block_type: string; content: Record<string, unknown>; evaluation?: Record<string, unknown>; feedback?: Record<string, unknown>; scoring?: Record<string, unknown> };
type Source = Parameters<typeof seedVideo711Lessons>[1];

export const marketingMigrationPath = 'supabase/migrations/20261005105024_marketing_basics_modules_1_5_clear_practice.sql';
export const marketingFingerprintSQL = readFileSync('scripts/marketing-basics/fingerprints.sql', 'utf8');

export async function createMarketingDatabase(): Promise<PGlite> {
  const db = await createSilkDatabase(true);
  await seedMarketingLessons(db);
  return db;
}

export async function seedMarketingLessons(db: PGlite): Promise<void> {
  const path = process.env.MARKETING_BASICS_SOURCE_SNAPSHOT || 'tests/fixtures/marketing-basics-1-5-before.json';
  const source = JSON.parse(readFileSync(path, 'utf8')) as Source;
  if (!process.env.MARKETING_BASICS_SOURCE_SNAPSHOT) {
    // CI uses fictional keys, never the production grading mappings. Live-source
    // verification reads those mappings only from an external, uncommitted file.
    for (const row of source) for (const [index, block] of row.blocks.entries()) {
      const b = block as Block;
      if (['quiz', 'scenario'].includes(b.block_type)) {
        const options = b.content.options as { id: string }[];
        b.evaluation = { correct: options[(index + 1) % options.length].id };
        b.feedback = { explanation: 'Synthetic CI explanation; not a production answer.' };
        b.scoring = {};
      } else if (b.block_type === 'sequence_sort') {
        b.evaluation = { order: (b.content.items as { id: string }[]).map(item => item.id) };
        b.feedback = { explanation: 'Synthetic CI sequence; not a production answer.' };
        b.scoring = {};
      }
    }
  }
  await seedVideo711Lessons(db, source);
}

export async function marketingMigration(db: PGlite): Promise<string> {
  const sql = readFileSync(marketingMigrationPath, 'utf8');
  if (process.env.MARKETING_BASICS_SOURCE_SNAPSHOT) return sql;
  // Retain and exercise every source-drift guard with the fictional CI keys.
  const hashes = new Map((await db.query<{ lesson_id: string; fingerprint: string }>(marketingFingerprintSQL)).rows.map(row => [row.lesson_id, row.fingerprint]));
  const marker = '$mb15_payload$';
  const [prefix, payload, suffix] = sql.split(marker);
  const specs = JSON.parse(payload) as { lesson: string; source_hash: string }[];
  for (const spec of specs) spec.source_hash = hashes.get(spec.lesson)!;
  return `${prefix}${marker}${JSON.stringify(specs)}${marker}${suffix}`;
}
