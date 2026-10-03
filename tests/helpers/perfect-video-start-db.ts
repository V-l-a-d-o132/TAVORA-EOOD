import { readFileSync } from 'node:fs';
import { createSilkDatabase } from './silk-road-db';

type Block = { id?: string; block_key: string; position: number; block_type: string; title: string; content: Record<string, unknown>; required: boolean; points: number; evaluation?: Record<string, unknown>; feedback?: Record<string, unknown>; scoring?: Record<string, unknown> };
type Source = { module_id: string; lesson_id: string; version: Record<string, unknown>; blocks: Block[] };

export function videoBaseSource(): Source[] {
  if (process.env.PERFECT_VIDEO_SOURCE_SNAPSHOT) return JSON.parse(readFileSync(process.env.PERFECT_VIDEO_SOURCE_SNAPSHOT, 'utf8')) as Source[];
  // Reuse the existing committed baseline. No private live export or duplicate paid fixtures are committed.
  const sql = readFileSync('supabase/migrations/20260928104816_perfect_video_modules_1_3_curriculum_v4_2_drafts.sql', 'utf8');
  const payload = JSON.parse(sql.match(/\$pv_v42_payload\$(.*?)\$pv_v42_payload\$/s)![1]) as { module_id: string; lesson_id: string; title: string; subtitle: string; objective: string; hook: string; change_note: string; estimated_minutes: number; blocks: { key: string; type: string; title: string; content: Record<string, unknown>; required: boolean; points: number; evaluation?: Record<string, unknown>; feedback?: Record<string, unknown>; scoring?: Record<string, unknown> }[] }[];
  const editions: Record<string, number> = { 'pv01-07': 4, 'pv01-19': 4, 'pv03-12': 3 };
  return payload.map(row => ({ module_id: row.module_id, lesson_id: row.lesson_id,
    version: { version_number: editions[row.lesson_id] || 5, title: row.title, subtitle: row.subtitle, objective: row.objective, hook: row.hook, change_note: row.change_note, source_kind: 'editor', estimated_minutes: row.estimated_minutes, duration: `${row.estimated_minutes} мин` },
    blocks: row.blocks.map((block, position) => ({ ...block, block_key: block.key, block_type: block.type, position })),
  }));
}

export async function createVideoDatabase() {
  const db = await createSilkDatabase(true);
  for (const source of videoBaseSource()) {
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
  return db;
}
