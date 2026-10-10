import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { expect, test } from 'vitest';
import { LEARNING_SECTIONS } from '../src/mocks/learning-platform';
import { actor, createSilkDatabase, STUDENT } from './helpers/silk-road-db';

// Optional release gate: reads protected authoring files locally, never embeds or prints keys.
const directory = process.env.SILK_ROAD_CANDIDATE_DIR;
test.skipIf(!directory)('the complete private candidate publishes and every required check can be completed', async () => {
  const db = await createSilkDatabase(true);
  try {
    await db.exec('ALTER TABLE academy_lesson_blocks DROP CONSTRAINT academy_lesson_blocks_block_type_check');
    await db.exec(readFileSync('supabase/migrations/20261008104746_silk_road_closed_learning_release.sql', 'utf8'));
    const lessons = readdirSync(directory!).filter(file => /^m\d\d\.json$/.test(file)).sort()
      .flatMap(file => JSON.parse(readFileSync(join(directory!, file), 'utf8')));
    expect(lessons.length).toBe(74);
    const catalog = LEARNING_SECTIONS[0].modules.flatMap(m => m.lessons.map(l => ({ module: m.id, lesson: l.id, title: l.title })));
    expect(lessons.map(l => ({ module: l.module, lesson: l.lesson, title: l.title }))).toEqual(catalog);
    const baseDirectory = process.env.SILK_ROAD_MARKET_BASE_DIR;
    const base = baseDirectory ? readdirSync(baseDirectory).filter(file => /^m\d\d\.json$/.test(file)).sort()
      .flatMap(file => JSON.parse(readFileSync(join(baseDirectory, file), 'utf8'))) : lessons;
    for (const lesson of base) {
      await db.query(`INSERT INTO academy_private.silk_road_release_lessons(release_key,module_id,lesson_id,expected_version_id,payload)
        SELECT $1,$2,$3,published_version_id,$4 FROM academy_lessons WHERE module_id=$2 AND lesson_id=$3`,
      ['silk_road_closed_learning_20261008', lesson.module, lesson.lesson, lesson]);
    }
    await db.exec(readFileSync('supabase/migrations/20261008104748_silk_road_publish_closed_curriculum.sql', 'utf8'));
    if (baseDirectory) {
      await db.exec(readFileSync('supabase/migrations/20261009081505_silk_road_market_ready_staging.sql', 'utf8'));
      for (const lesson of lessons) {
        await db.query(`INSERT INTO academy_private.silk_road_market_lessons(release_key,module_id,lesson_id,expected_version_id,expected_fingerprint,payload)
          SELECT $1,l.module_id,l.lesson_id,l.published_version_id,md5(to_jsonb(l)::text||to_jsonb(v)::text||coalesce((SELECT string_agg(to_jsonb(b)::text||coalesce(to_jsonb(k)::text,''),'' ORDER BY b.position,b.id)
          FROM academy_lesson_blocks b LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE b.version_id=v.id),'')),$2
          FROM academy_lessons l JOIN academy_lesson_versions v ON v.id=l.published_version_id WHERE l.module_id=$3 AND l.lesson_id=$4`,
        ['silk_road_market_ready_20261009', lesson, lesson.module, lesson.lesson]);
      }
      await db.exec(readFileSync('supabase/migrations/20261009190315_silk_road_market_ready_publication.sql', 'utf8'));
    }
    await actor(db, 'postgres', STUDENT);
    for (const lesson of lessons) {
      const version = (await db.query<{ published_version_id: string }>('SELECT published_version_id FROM academy_lessons WHERE module_id=$1 AND lesson_id=$2', [lesson.module, lesson.lesson])).rows[0].published_version_id;
      for (const block of lesson.blocks.filter((b: { required: boolean }) => b.required)) {
        let payload: Record<string, unknown> = { acknowledged: true };
        if (block.type === 'quiz') payload = { answer: block.evaluation.correct };
        if (block.type === 'scenario') payload = { selected: block.evaluation.correct };
        if (block.type === 'matching') payload = { matches: block.evaluation.matches };
        if (block.type === 'sequence_sort') payload = { order: block.evaluation.order };
        if (block.type === 'step_reveal') payload = { revealed: block.content.steps.map((s: { id: string }) => s.id) };
        if (block.type === 'course_exam') payload = { answers: block.evaluation.answers };
        const fn = block.type === 'course_exam' ? 'submit_course_exam' : 'complete_lesson_block';
        if (baseDirectory && ['quiz', 'scenario'].includes(block.type)) {
          const wrong = block.content.options.find((o: { id: string }) => o.id !== block.evaluation.correct).id;
          const rejected = (await db.query<{ r: { feedback: { complete: boolean } } }>(
            'SELECT academy_private.complete_lesson_block($1,$2,$3,$4,$5,$6) r',
            [lesson.module, lesson.lesson, version, block.key, block.type === 'quiz' ? { answer: wrong } : { selected: wrong }, randomUUID()],
          )).rows[0].r;
          expect(rejected.feedback.complete === false, `${lesson.lesson}/${block.key}: wrong choice`).toBe(true);
        }
        const result = (await db.query<{ r: { feedback: Record<string, unknown> } }>(
          `SELECT academy_private.${fn}($1,$2,$3,$4,$5,$6) r`, [lesson.module, lesson.lesson, version, block.key, payload, randomUUID()],
        )).rows[0].r;
        // Booleans only in assertion output: no production keys or responses in CI logs.
        expect(result.feedback.complete === true, `${lesson.lesson}/${block.key}: completion`).toBe(true);
        expect(Object.keys(result.feedback).some(key => ['answer', 'answers', 'choices', 'criticalQuestions'].includes(key)), 'Private mapping exposure').toBe(false);
      }
    }
    const completed = (await db.query<{ n: number }>('SELECT count(*)::int n FROM academy_lesson_progress WHERE user_id=$1 AND completed_at IS NOT NULL', [STUDENT])).rows[0].n;
    expect(completed).toBe(74);
  } finally { await db.close(); }
}, 60000);
