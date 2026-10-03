import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { LEARNING_SECTIONS } from '../../src/mocks/learning-platform';

export const STUDENT = '00000000-0000-4000-8000-000000000091';
export const OTHER = '00000000-0000-4000-8000-000000000092';

type Block = {
  id?: string; block_key: string; position: number; block_type: string; title: string;
  content: Record<string, unknown>; required: boolean; points: number;
  evaluation?: Record<string, unknown>; feedback?: Record<string, unknown>; scoring?: Record<string, unknown>;
};
type Source = { module_id: string; lesson_id: string; version: Record<string, unknown>; blocks: Block[] };
const ids = (prefix: string, count: number) => Array.from({ length: count }, (_, i) => `${prefix}-${String(i + 1).padStart(2, '0')}`);

function sourceFixture(allModules: boolean): Source[] {
  const counts = allModules ? [4, 10, 10, 10, 10, 10, 4, 4, 4, 4, 4] : [4, 10];
  const titles = new Map(LEARNING_SECTIONS[0].modules.flatMap(module => module.lessons.map(lesson => [lesson.id, lesson.title] as const)));
  return counts.flatMap((count, index) => ids(`l${String(index + 1).padStart(2, '0')}`, count)).map(lessonId => {
    const moduleNumber = Number(lessonId.slice(1, 3));
    const moduleId = `s01-m${lessonId.slice(1, 3)}`;
    const theoryCount = moduleId === 's01-m01' ? 5 : 4;
    const blocks: Block[] = [];
    const add = (key: string, type: string, required = true, points = 5) => {
      const block: Block = {
        block_key: key, position: blocks.length, block_type: type, title: `Запазен ${key}`,
        content: { body: `Съществуващ довод за ${lessonId}/${key}. Не измисляй липсващи факти. Задание за Readdy AI.` },
        required, points,
      };
      if (type === 'quiz') {
        block.content = { question: `Запазен въпрос ${key}`, options: [{ id: 'a', label: 'Проверени факти' }, { id: 'b', label: 'Предположение' }] };
        block.evaluation = { correct: 'a' }; block.feedback = { explanation: 'Използвай известните факти.' };
      }
      blocks.push(block);
    };
    add('objective', 'objective');
    for (let i = 1; i <= theoryCount; i++) add(`lesson_section_${i}`, 'rich_text');
    add('practice_brief', 'rich_text'); add('practice', 'practical_response', false, 0);
    add('model_solution', 'rich_text', false, 0);
    for (let i = 1; i <= 3; i++) add(`quiz_${i}`, 'quiz', true, 10);
    add('summary', 'summary');
    return {
      module_id: moduleId, lesson_id: lessonId,
      version: {
        version_number: lessonId === 'l10-01' ? 6 : lessonId === 'l11-04' ? 2 : [9, 7, 7, 7, 6, 6, 6, 6, 5, 5, 5][moduleNumber - 1], title: titles.get(lessonId),
        subtitle: 'Запазено обяснение', duration: '25 мин', objective: 'Провери фактите и резултата.',
        hook: 'Практическа задача с ясни ограничения.', source_kind: 'editor', change_note: ['l10-01', 'l11-04'].includes(lessonId) ? 'silk_road_practical_review_20260925' : 'silk_road_final_20260924',
      }, blocks,
    };
  });
}

export async function createSilkDatabase(allModules = false) {
  const db = new PGlite();
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE SCHEMA auth; CREATE SCHEMA storage;
    CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,raw_user_meta_data jsonb DEFAULT '{}');
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT current_user::text $$;
    GRANT USAGE ON SCHEMA auth TO anon,authenticated,service_role;
    CREATE TABLE storage.objects(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),bucket_id text,name text);
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
    GRANT USAGE ON SCHEMA storage TO anon,authenticated,service_role;
    GRANT ALL ON storage.objects TO anon,authenticated,service_role;`);
  for (const file of [
    '20260919204858_existing_public_schema.sql',
    '20260919204901_academy_security_foundation.sql',
    '20260919204904_academy_payments_and_quizzes.sql',
    '20260920143038_lesson_engine_v2_core.sql',
    '20260928120433_perfect_video_progress_history_and_graded_scenarios.sql',
    '20261001124726_academy_unified_progress_resume.sql',
    '20261001175901_academy_retire_open_answers.sql',
  ]) await db.exec(readFileSync(`supabase/migrations/${file}`, 'utf8'));
  await db.query("INSERT INTO auth.users(id,email) VALUES($1,'student@example.invalid'),($2,'other@example.invalid')", [STUDENT, OTHER]);
  await db.query("INSERT INTO academy_access_grants(user_id,source,full_access) VALUES($1,'test-editorial-fixture',true)", [STUDENT]);
  const source: Source[] = process.env.SILK_ROAD_SOURCE_SNAPSHOT
    ? JSON.parse(readFileSync(process.env.SILK_ROAD_SOURCE_SNAPSHOT, 'utf8')) as Source[]
    : sourceFixture(allModules);
  for (const item of source.filter(item => allModules || ['s01-m01', 's01-m02'].includes(item.module_id))) {
    const v = item.version;
    const lesson = (await db.query<{ id: string }>(
      'INSERT INTO academy_lessons(id,module_id,lesson_id,status) VALUES(coalesce($1::uuid,gen_random_uuid()),$2,$3,\'draft\') RETURNING id',
      [v.academy_lesson_id || null, item.module_id, item.lesson_id],
    )).rows[0];
    const version = (await db.query<{ id: string }>(`INSERT INTO academy_lesson_versions
      (id,academy_lesson_id,version_number,title,subtitle,duration,objective,hook,estimated_minutes,source_kind,change_note)
      VALUES(coalesce($1::uuid,gen_random_uuid()),$2,$3,$4,$5,$6,$7,$8,25,$9,$10) RETURNING id`,
    [v.id || null, lesson.id, v.version_number, v.title, v.subtitle, v.duration, v.objective, v.hook, v.source_kind, v.change_note])).rows[0];
    for (const b of item.blocks) {
      const block = (await db.query<{ id: string }>(`INSERT INTO academy_lesson_blocks
        (id,version_id,block_key,position,block_type,title,content,required,points)
        VALUES(coalesce($1::uuid,gen_random_uuid()),$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [b.id || null, version.id, b.block_key, b.position, b.block_type, b.title, b.content, b.required, b.points])).rows[0];
      if (b.evaluation && Object.keys(b.evaluation).length) await db.query(
        'INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring) VALUES($1,$2,$3,$4)',
        [block.id, b.evaluation, b.feedback || {}, b.scoring || {}],
      );
    }
    await db.query("UPDATE academy_lessons SET status='published',published_version_id=$2,draft_version_id=$2 WHERE id=$1", [lesson.id, version.id]);
  }
  return db;
}

export async function actor(db: PGlite, role = 'postgres', uid = '') {
  await db.exec('RESET ROLE');
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [uid]);
  await db.exec(`SET ROLE ${role}`);
}

export async function learnerRecords(db: PGlite) {
  await actor(db);
  const result: Record<string, unknown[]> = {};
  for (const table of ['academy_lesson_progress', 'academy_lesson_attempts_v2', 'academy_private.lesson_progress_history', 'pdf_progress', 'profiles', 'academy_access_grants', 'academy_user_badges']) {
    result[table] = (await db.query(`SELECT to_jsonb(t) AS row FROM ${table} t ORDER BY to_jsonb(t)::text`)).rows;
  }
  return result;
}
