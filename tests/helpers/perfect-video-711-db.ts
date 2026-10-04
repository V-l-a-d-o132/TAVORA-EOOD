import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { createSilkDatabase } from './silk-road-db';

type Block = { id?: string; block_key: string; position: number; block_type: string; title: string; content: Record<string, unknown>; required: boolean; points: number; evaluation?: Record<string, unknown>; feedback?: Record<string, unknown>; scoring?: Record<string, unknown> };
type Source = { module_id: string; lesson_id: string; version: Record<string, unknown>; blocks: Block[] };
type Curriculum = { module_id: string; lesson_id: string; title: string; subtitle: string; objective: string; hook: string; estimated_minutes: number; blocks: (Block & { answer_key?: Record<string, unknown> })[] };

function committedSource(): Source[] {
  return [
    ['20260928182339_perfect_video_modules_7_9_v6_release.sql', 3, 'Переработка модулей 7–9: практическо издание v6'],
    ['20260929194936_perfect_video_modules_10_12_v7_release.sql', 1, 'Перфектното видео, модули 10–12: първо практическо издание v7'],
  ].flatMap(([file, number, note]) => {
    const sql = readFileSync(`supabase/migrations/${file}`, 'utf8');
    const source = JSON.parse(sql.match(/\$curriculum\$(.*?)\$curriculum\$/s)![1]) as Curriculum[];
    return source.map(row => ({ module_id: row.module_id, lesson_id: row.lesson_id,
      version: { version_number: number, title: row.title, subtitle: row.subtitle, objective: row.objective, hook: row.hook, estimated_minutes: row.estimated_minutes, duration: `${row.estimated_minutes} минути`, source_kind: 'editor', change_note: note },
      blocks: row.blocks.map(block => ({ ...block, evaluation: block.answer_key })),
    }));
  });
}

export function video711BaseSource(): Source[] {
  return process.env.PERFECT_VIDEO_711_SOURCE_SNAPSHOT
    ? JSON.parse(readFileSync(process.env.PERFECT_VIDEO_711_SOURCE_SNAPSHOT, 'utf8')) as Source[]
    : committedSource().filter(row => row.module_id !== 's02-m12');
}

export async function createVideo711Database() {
  const db = await createSilkDatabase(true);
  // Include the actual adjacent module 12 to catch accidental edits outside 7–11.
  await seedVideo711Lessons(db, [...video711BaseSource(), ...committedSource().filter(row => row.module_id === 's02-m12')]);
  return db;
}

export async function seedVideo711Lessons(db: PGlite, sources: Source[]) {
  for (const source of sources) {
    const v = source.version;
    const lesson = (await db.query<{ id: string }>('INSERT INTO academy_lessons(id,module_id,lesson_id,status) VALUES(coalesce($1::uuid,gen_random_uuid()),$2,$3,\'draft\') RETURNING id', [v.academy_lesson_id || null, source.module_id, source.lesson_id])).rows[0];
    const version = (await db.query<{ id: string }>(`INSERT INTO academy_lesson_versions(id,academy_lesson_id,version_number,title,subtitle,duration,objective,hook,estimated_minutes,source_kind,change_note)
      VALUES(coalesce($1::uuid,gen_random_uuid()),$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`, [v.id || null, lesson.id, v.version_number, v.title, v.subtitle, v.duration, v.objective, v.hook, v.estimated_minutes, v.source_kind, v.change_note])).rows[0];
    for (const b of source.blocks) {
      const block = (await db.query<{ id: string }>(`INSERT INTO academy_lesson_blocks(id,version_id,block_key,position,block_type,title,content,required,points)
        VALUES(coalesce($1::uuid,gen_random_uuid()),$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`, [b.id || null, version.id, b.block_key, b.position, b.block_type, b.title, b.content, b.required, b.points])).rows[0];
      if (b.evaluation && Object.keys(b.evaluation).length) await db.query('INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring) VALUES($1,$2,$3,$4)', [block.id, b.evaluation, b.feedback || {}, b.scoring || {}]);
    }
    await db.query("UPDATE academy_lessons SET status='published',published_version_id=$2,draft_version_id=$2 WHERE id=$1", [lesson.id, version.id]);
  }
}
