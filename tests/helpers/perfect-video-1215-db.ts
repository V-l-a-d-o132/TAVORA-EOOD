import { readFileSync } from 'node:fs';
import { createSilkDatabase } from './silk-road-db';
import { seedVideo711Lessons, video711BaseSource } from './perfect-video-711-db';

type Block = { block_key: string; position: number; block_type: string; title: string; content: Record<string, unknown>; required: boolean; points: number; answer_key?: Record<string, unknown>; feedback?: Record<string, unknown>; scoring?: Record<string, unknown> };
type Curriculum = { module_id: string; lesson_id: string; title: string; subtitle: string; objective: string; hook: string; estimated_minutes: number; blocks: Block[] };

export function video1215BaseSource() {
  if (process.env.PERFECT_VIDEO_1215_SOURCE_SNAPSHOT) return JSON.parse(readFileSync(process.env.PERFECT_VIDEO_1215_SOURCE_SNAPSHOT, 'utf8'));
  return [
    ['20260929194936_perfect_video_modules_10_12_v7_release.sql', 'Перфектното видео, модули 10–12: първо практическо издание v7'],
    ['20260929212115_perfect_video_modules_13_14_v8_release.sql', 'Перфектното видео, модули 13–14: първо практическо издание v8'],
    ['20260929215642_perfect_video_module_15_practical_exam.sql', 'FRAME финален проект и практични изпити v9'],
  ].flatMap(([file, note]) => {
    const source = JSON.parse(readFileSync('supabase/migrations/' + file, 'utf8').match(/\$curriculum\$(.*?)\$curriculum\$/s)![1]) as Curriculum[];
    return source.filter(row => ['s02-m12', 's02-m13', 's02-m14', 's02-m15'].includes(row.module_id)).map(row => ({
      module_id: row.module_id, lesson_id: row.lesson_id,
      version: { version_number: 1, title: row.title, subtitle: row.subtitle, objective: row.objective, hook: row.hook,
        estimated_minutes: row.estimated_minutes, duration: row.estimated_minutes + ' минути', source_kind: 'editor', change_note: note },
      blocks: row.blocks.map(block => ({ ...block, evaluation: block.answer_key })),
    }));
  });
}

export async function createVideo1215Database() {
  const db = await createSilkDatabase(true);
  // Install the existing exam contract without running its historical catalog publication.
  const exam = readFileSync('supabase/migrations/20260929215642_perfect_video_module_15_practical_exam.sql', 'utf8');
  await db.exec(exam.slice(0, exam.indexOf('DO $release$')));
  for (const file of [
    '20261001060142_marketing_basics_module20_course_exam.sql',
    '20261001175901_academy_retire_open_answers.sql',
  ]) await db.exec(readFileSync('supabase/migrations/' + file, 'utf8'));
  await seedVideo711Lessons(db, [
    ...video1215BaseSource(),
    ...video711BaseSource().filter(row => row.lesson_id === 'pv11-16'),
  ]);
  return db;
}
