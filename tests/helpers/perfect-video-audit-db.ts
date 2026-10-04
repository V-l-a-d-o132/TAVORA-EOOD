import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { createVideo1215Database } from './perfect-video-1215-db';
import { video456BaseSource } from './perfect-video-456-db';
import { seedVideo711Lessons, video711BaseSource } from './perfect-video-711-db';

type Edition = { module: string; lesson: string; objective: string; hook: string; blocks: { key: string; title: string; content: unknown; feedback?: unknown }[] };

export async function createVideoAuditDatabase(): Promise<PGlite> {
  const db = await createVideo1215Database();
  await seedVideo711Lessons(db, [
    ...video456BaseSource().filter(row => row.lesson_id === 'pv04-12'),
    ...video711BaseSource().filter(row => row.lesson_id === 'pv11-13'),
  ]);
  // Reconstruct the three already published editions from committed releases, without live UUIDs.
  for (const [file, release, selected] of [
    ['modules-4-6-clear-practice-20261004.json', 'perfect_video_modules_4_6_clear_practice_20261004', ['pv04-12']],
    ['modules-7-11-clear-practice-20261004.json', 'perfect_video_modules_7_11_clear_practice_20261004', ['pv11-13']],
    ['modules-12-15-clear-practice-20261004.json', 'perfect_video_modules_12_15_clear_practice_20261004', null],
  ] as const) {
    const specs = JSON.parse(readFileSync('scripts/perfect-video/releases/' + file, 'utf8')) as Edition[];
    for (const spec of specs.filter(s => selected === null || (selected as readonly string[]).includes(s.lesson))) {
      const version = (await db.query<{ id: string }>(`UPDATE academy_lesson_versions SET objective=$1,hook=$2,change_note=$3
        WHERE id=(SELECT published_version_id FROM academy_lessons WHERE module_id=$4 AND lesson_id=$5) RETURNING id`, [spec.objective, spec.hook, release, spec.module, spec.lesson])).rows[0];
      for (const block of spec.blocks) {
        const id = (await db.query<{ id: string }>('UPDATE academy_lesson_blocks SET title=$1,content=$2 WHERE version_id=$3 AND block_key=$4 RETURNING id', [block.title, block.content, version.id, block.key])).rows[0].id;
        if (block.feedback) await db.query('UPDATE academy_private.lesson_block_keys SET feedback=feedback||$1::jsonb WHERE block_id=$2', [block.feedback, id]);
      }
    }
  }
  return db;
}
