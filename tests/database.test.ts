import { PGlite } from "@electric-sql/pglite";
import { readdirSync, readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { seedVideo711Lessons, video711BaseSource } from "./helpers/perfect-video-711-db";

const A = "00000000-0000-4000-8000-000000000001";
const B = "00000000-0000-4000-8000-000000000002";
const ADMIN = "00000000-0000-4000-8000-000000000003";
let db: PGlite;
async function actor(role = "postgres", uid = "") {
  await db.exec("RESET ROLE");
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [uid]);
  await db.exec(`SET ROLE ${role}`);
}
async function scalar(sql: string) {
  return (await db.query<Record<string, unknown>>(sql)).rows[0];
}
const purchase = (sid: string, tier = "systems-10", uid = A) => ({
  session_id: sid,
  payment_intent_id: "pi_" + sid,
  user_id: uid,
  tier,
  price_id: "price_" + tier,
  livemode: true,
  amount_total: tier === "systems-10" ? 4900 : 9900,
  currency: "eur",
  mode: "payment",
  payment_status: "paid",
});
async function record(sid: string, tier = "systems-10", uid = A) {
  await actor("service_role");
  return db.query("SELECT public.academy_record_purchase($1,$2) result", [
    purchase(sid, tier, uid),
    "evt_" + sid,
  ]);
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    `CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
 CREATE SCHEMA auth; CREATE SCHEMA storage;
 CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,raw_user_meta_data jsonb DEFAULT '{}');
 CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT current_user::text $$;
 GRANT USAGE ON SCHEMA auth TO anon,authenticated,service_role;
 CREATE TABLE storage.objects(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),bucket_id text,name text);
 ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
 GRANT USAGE ON SCHEMA storage TO anon,authenticated,service_role;
 GRANT ALL ON storage.objects TO anon,authenticated,service_role;`,
  );
  const files = readdirSync("supabase/migrations").filter((x) =>
    x.endsWith(".sql")
  ).sort();
  await db.exec(readFileSync("supabase/migrations/" + files[0], "utf8"));
  await db.query(
    "INSERT INTO auth.users(id,email) VALUES($1,'a@example.invalid'),($2,'b@example.invalid'),($3,'admin@example.invalid')",
    [A, B, ADMIN],
  );
  // Existing grants are captured before hardening; no production data is used in tests.
  await db.exec("ALTER TABLE profiles DISABLE TRIGGER enforce_role_change");
  await db.query("UPDATE profiles SET role='admin' WHERE id=$1", [ADMIN]);
  await db.query(
    `UPDATE profiles SET unlocked_modules='["s03-m02"]' WHERE id=$1`,
    [B],
  );
  await db.exec("ALTER TABLE profiles ENABLE TRIGGER enforce_role_change");
  for (const f of files.slice(1)) {
    if (f.includes("lesson_engine_v2_core")) {
      await db.exec(
        `INSERT INTO interactive_lessons(module_id,lesson_id,title,slides) VALUES
         ('s01-m01','test-lesson','Preview','[{"id":"cp1","type":"checkpoint","title":"Check","checkpoint":{"question":"Q","options":["a","b"],"correctIndex":1,"explanation":"Because"}}]'),
         ('s01-m02','test-lesson','Paid','[]');
         INSERT INTO interactive_lessons(module_id,lesson_id,title,subtitle,duration,slides)
         SELECT 's01-m01',lesson_id,title,'Запазен богат източник','25 мин',jsonb_build_array(
           jsonb_build_object('type','title','title',title,'body','Реален бизнес проблем, който изисква решение и проверка.'),
           jsonb_build_object('type','content','title','Принцип','body',repeat('Конкретно обяснение с контекст, ограничения и проверим резултат. ',20),'highlights',jsonb_build_array('Провери фактите','Не споделяй чувствителни данни','Запиши критерия за качество')),
           jsonb_build_object('type','comparison','title','Слаб и работещ подход','leftSide',jsonb_build_object('label','Слаб','content','Обща команда без контекст'),'rightSide',jsonb_build_object('label','Работещ','content','Ясен вход, критерий и човешка проверка')),
           jsonb_build_object('type','framework','title','Процес','frameworkSteps',jsonb_build_array(jsonb_build_object('title','Контекст','description','Дай проверими факти','example','Реален пример'),jsonb_build_object('title','Проверка','description','Определи собственик','example','Човек одобрява'))),
           jsonb_build_object('type','interactive','title','Реши казуса','interactivePrompt',jsonb_build_object('scenario','Клиентска ситуация с реален риск.','task','Напиши конкретно решение.','hint','Определи критерий за успех.','revealAnswer','Примерно решение')),
           jsonb_build_object('type','checkpoint','title','Проверка','checkpoint',jsonb_build_object('question','Кой подход е надежден?','options',jsonb_build_array('Ясен и проверим','Общ и непроверен','Автоматичен без надзор'),'correctIndex',0,'explanation','Надеждният процес има контекст, критерий и човешки контрол.')),
           jsonb_build_object('type','summary','title','Обобщение','keyTakeaways',jsonb_build_array('Избирай проверими задачи','Човекът носи отговорност'),'cta','Приложи върху една реална задача.')
         )
         FROM (VALUES
           ('l01-01','Основи на AI за бизнес — какво работи и какво не'),
           ('l01-02','Prompt engineering на професионално ниво'),
           ('l01-03','Мулти-моделна стратегия: ChatGPT, Claude, Gemini'),
           ('l01-04','AI за бизнес решения всеки ден')
         ) fixture(lesson_id,title);
         INSERT INTO interactive_lessons(module_id,lesson_id,title,slides)
         SELECT 's99-m99','migration-'||lpad(i::text,3,'0'),'Migration fixture '||i,'[]'::jsonb
         FROM generate_series(1,212) i;`,
      );
    }
    if (f.endsWith("perfect_video_modules_7_11_clear_practice.sql")) {
      // Legacy 7–9 releases require an existing catalog and intentionally skip
      // this fresh schema fixture. Seed their committed published curriculum so
      // the new migration exercises its full 75-lesson guard, without weakening it.
      await seedVideo711Lessons(db, video711BaseSource().filter(
        (lesson) => ["s02-m07", "s02-m08", "s02-m09"].includes(lesson.module_id),
      ));
    }
    await db.exec(readFileSync("supabase/migrations/" + f, "utf8"));
  }
  await db.exec(
    `INSERT INTO academy_prices(price_id,tier_id,livemode,amount_cents,checkout_enabled) VALUES
 ('price_systems-10','systems-10',true,4900,true),('price_perfektno-video','perfektno-video',true,9900,true);
 INSERT INTO lesson_quizzes(id,module_id,lesson_id,question,options,correct_index,explanation)
 VALUES('10000000-0000-4000-8000-000000000001','s01-m01','test-lesson','Q','["a","b"]',1,'Because');
 INSERT INTO storage.objects(bucket_id,name) VALUES('course-pdfs','s01-m02/paid.pdf'),('course-pdfs','s01-m01/preview.pdf');`,
  );
}, 60000);
afterAll(async () => {
  await db.close();
});

describe("RLS and privileged operations", () => {
  it("preserves existing profiles and legacy grants without inventing purchases", async () => {
    await actor();
    expect(await scalar("SELECT count(*)::int n FROM profiles")).toEqual({
      n: 3,
    });
    expect(await scalar("SELECT count(*)::int n FROM academy_access_grants"))
      .toEqual({ n: 1 });
  });
  it("blocks self elevation, role changes, and entitlement inserts", async () => {
    await actor("authenticated", A);
    for (
      const sql of [
        "UPDATE profiles SET has_full_access=true",
        `UPDATE profiles SET unlocked_modules='["s02-m01"]'`,
        "UPDATE profiles SET role='super_admin'",
        `INSERT INTO academy_access_grants(user_id,source,full_access) VALUES('${A}','fake',true)`,
      ]
    ) await expect(db.exec(sql)).rejects.toThrow();
    await expect(
      db.query("SELECT academy_record_purchase($1)", [purchase("fake")]),
    ).rejects.toThrow();
  });
  it("allows own profile edits, hides other profiles and admin data", async () => {
    await actor("authenticated", A);
    await db.exec("UPDATE profiles SET full_name='Updated'");
    expect(await scalar("SELECT count(*)::int n FROM profiles")).toEqual({
      n: 1,
    });
    expect(await scalar("SELECT count(*)::int n FROM contact_messages"))
      .toEqual({ n: 0 });
  });
  it("allows preview RPC but no paid content, raw answers or paid PDFs to anon", async () => {
    await actor("anon");
    const preview = await scalar(
      "SELECT academy_get_lesson('s01-m01','test-lesson') lesson",
    );
    expect(JSON.stringify(preview)).toContain("Preview");
    expect(JSON.stringify(preview)).not.toContain("correctIndex");
    expect(JSON.stringify(preview)).not.toContain("Because");
    await expect(db.exec("SELECT academy_get_lesson('s01-m02','test-lesson')"))
      .rejects.toThrow();
    await expect(db.exec("SELECT * FROM lesson_quizzes")).rejects.toThrow();
    expect(await scalar("SELECT count(*)::int n FROM storage.objects")).toEqual(
      { n: 1 },
    );
  });
  it("denies unpaid users and allows preserved grants only for the correct modules", async () => {
    await actor("authenticated", B);
    expect(
      await scalar(
        "SELECT academy_has_module_access('s03-m02') yes,academy_has_module_access('s02-m01') no",
      ),
    ).toEqual({ yes: true, no: false });
  });
  it("allows admin backend content management and all profiles", async () => {
    await actor("authenticated", ADMIN);
    expect(await scalar("SELECT count(*)::int n FROM profiles")).toEqual({
      n: 3,
    });
    expect(await scalar("SELECT count(*)::int n FROM interactive_lessons"))
      .toEqual({ n: 218 });
  });
});

describe("Lesson Engine V2 migration and publication", () => {
  it("backs up and migrates all 218 legacy lessons without changing the source rows", async () => {
    await actor("service_role");
    expect(await scalar("SELECT count(*)::int n FROM academy_private.interactive_lessons_backup_20260920")).toEqual({ n: 218 });
    expect(await scalar("SELECT count(*)::int n FROM academy_lessons WHERE source_legacy_id IS NOT NULL")).toEqual({ n: 218 });
    expect(await scalar("SELECT count(*)::int n FROM interactive_lessons")).toEqual({ n: 218 });
  });

  it("publishes all 35 reference lessons and keeps answer keys out of the student payload", async () => {
    await actor("service_role");
    expect(await scalar("SELECT count(*)::int n FROM academy_lessons WHERE module_id IN ('s01-m01','s02-m01','s03-m01') AND status='published'")).toEqual({ n: 36 });
    await actor("anon");
    const lesson = await scalar("SELECT academy_get_lesson_v2('s01-m01','l01-01') lesson");
    expect(JSON.stringify(lesson)).toContain("Основи на AI");
    expect(JSON.stringify(lesson)).not.toContain('"correct"');
    expect(JSON.stringify(lesson)).not.toContain("lesson_block_keys");
  });

  it("restores the four rich s01-m01 lessons as reviewable drafts without replacing published content", async () => {
    await actor("service_role");
    expect(await scalar(`SELECT count(*)::int n
      FROM academy_lessons l
      JOIN academy_lesson_versions d ON d.id=l.draft_version_id
      WHERE l.module_id='s01-m01'
        AND l.lesson_id LIKE 'l01-%'
        AND d.change_note='Premium editorial restoration from the preserved legacy lesson'
        AND l.published_version_id IS DISTINCT FROM l.draft_version_id`)).toEqual({ n: 4 });
    expect(await scalar(`SELECT count(*)::int n
      FROM academy_lesson_blocks b
      JOIN academy_lesson_versions v ON v.id=b.version_id
      JOIN academy_lessons l ON l.id=v.academy_lesson_id
      WHERE l.module_id='s01-m01' AND l.lesson_id LIKE 'l01-%'
        AND v.change_note='Premium editorial restoration from the preserved legacy lesson'
        AND b.block_type IN ('before_after','step_reveal','practical_response','quiz','checklist','summary')`)).toEqual({ n: 28 });
    const draft = await scalar(`SELECT academy_private.lesson_json(l.id,l.draft_version_id,true) lesson
      FROM academy_lessons l WHERE l.module_id='s01-m01' AND l.lesson_id='l01-01'`);
    expect(JSON.stringify(draft)).toContain("Карта за AI делегиране");
    expect(JSON.stringify(draft)).toContain("Конкретно обяснение");
    await actor("anon");
    const published = await scalar("SELECT academy_get_lesson_v2('s01-m01','l01-01') lesson");
    expect(JSON.stringify(published)).not.toContain("Карта за AI делегиране");
  });

  it("keeps drafts invisible to learners and gives admins a sanitized preview", async () => {
    await actor("authenticated", ADMIN);
    const source = (await db.query<{ id: string }>("SELECT id FROM academy_lessons WHERE module_id='s01-m01' AND lesson_id='l01-01'")).rows[0];
    const draft = (await db.query<{ lesson: { versionId: string } }>(
      "SELECT academy_admin_save_lesson($1,'s01-m01','l01-01','Draft only','','10 мин','цел','hook',10,$2,'test draft') lesson",
      [source.id, [{ key: "objective", type: "objective", title: "Цел", content: { body: "draft secret" }, required: true, points: 5 }]],
    )).rows[0].lesson;
    const preview = await scalar(`SELECT academy_admin_preview_lesson('${source.id}','${draft.versionId}') lesson`);
    expect(JSON.stringify(preview)).toContain("draft secret");
    expect(JSON.stringify(preview)).not.toContain('"evaluation"');
    await actor("anon");
    const published = await scalar("SELECT academy_get_lesson_v2('s01-m01','l01-01') lesson");
    expect(JSON.stringify(published)).not.toContain("draft secret");
  });

  it("autosaves and resumes at the exact block without marking the lesson complete", async () => {
    await actor("authenticated", A);
    const loaded = (await db.query<{ lesson: { versionId: string } }>("SELECT academy_get_lesson_v2('s01-m01','l01-01') lesson")).rows[0].lesson;
    await db.query("SELECT academy_autosave_lesson($1,$2,$3,$4,$5)", [
      "s01-m01", "l01-01", loaded.versionId, "concept", { concept: { draft: "resume-here" } },
    ]);
    const resumed = (await db.query<{ lesson: { progress: { current_block_key: string; completed_at: string | null }; } }>("SELECT academy_get_lesson_v2('s01-m01','l01-01') lesson")).rows[0].lesson;
    expect(JSON.stringify(resumed)).toContain("resume-here");
    expect(resumed.progress.current_block_key).toBe("concept");
    expect(resumed.progress.completed_at).toBeNull();
  });

  it("validates quiz answers server-side, deduplicates attempts and completes only after every required block", async () => {
    await actor("authenticated", A);
    const lesson = (await db.query<{ lesson: { id: string; versionId: string; blocks: Array<{ key: string; type: string }> } }>("SELECT academy_get_lesson_v2('s01-m01','l01-01') lesson")).rows[0].lesson;
    const wrongId = crypto.randomUUID();
    const wrong = await db.query<{ result: { correct: boolean; feedback: { complete: boolean } } }>(
      "SELECT academy_complete_lesson_block($1,$2,$3,'quiz',$4,$5) result",
      ["s01-m01", "l01-01", lesson.versionId, { answer: "b" }, wrongId],
    );
    expect(wrong.rows[0].result).toMatchObject({ correct: false, feedback: { complete: false } });
    const repeated = await db.query("SELECT academy_complete_lesson_block($1,$2,$3,'quiz',$4,$5) result", ["s01-m01", "l01-01", lesson.versionId, { answer: "b" }, wrongId]);
    expect(repeated.rows).toEqual(wrong.rows);

    for (const block of lesson.blocks) {
      const payload = block.key === "interaction" ? { selected: "a" }
        : block.key === "quiz" ? { answer: "a" }
        : block.key === "practice" ? { text: "Конкретен план с вход, проверим резултат и човешка проверка след изпълнението." }
        : block.key === "reflection" ? { text: "Ще проверявам допусканията преди да приема препоръка от модел." }
        : { acknowledged: true };
      await db.query("SELECT academy_complete_lesson_block($1,$2,$3,$4,$5,$6)", ["s01-m01", "l01-01", lesson.versionId, block.key, payload, crypto.randomUUID()]);
    }
    // Retired open-answer blocks no longer award XP in the published edition.
    expect((await db.query("SELECT completed_at IS NOT NULL completed,mastery_status,xp FROM academy_lesson_progress WHERE user_id=$1 AND academy_lesson_id=$2", [A, lesson.id])).rows[0]).toEqual({ completed: true, mastery_status: "mastered", xp: 55 });
  });

  it("evaluates anonymous preview attempts without writing trusted progress", async () => {
    await actor("service_role");
    const before = await scalar("SELECT count(*)::int n FROM academy_lesson_attempts_v2");
    const version = (await db.query<{ id: string }>("SELECT published_version_id id FROM academy_lessons WHERE module_id='s01-m01' AND lesson_id='l01-02'")).rows[0].id;
    await actor("anon");
    const answer = await db.query<{ result: { preview: boolean; correct: boolean } }>("SELECT academy_complete_lesson_block($1,$2,$3,'quiz',$4,$5) result", ["s01-m01", "l01-02", version, { answer: "a" }, crypto.randomUUID()]);
    expect(answer.rows[0].result).toMatchObject({ preview: true, correct: true });
    await actor("service_role");
    expect(await scalar("SELECT count(*)::int n FROM academy_lesson_attempts_v2")).toEqual(before);
  });

  it("allows version rollback only to admins and records a new immutable version", async () => {
    await actor("service_role");
    const lessonId = (await db.query<{ id: string }>("SELECT academy_lesson_id id FROM academy_lesson_versions WHERE title LIKE 'Основи на AI%' ORDER BY version_number LIMIT 1")).rows[0].id;
    const oldVersion = (await db.query<{ id: string }>("SELECT id FROM academy_lesson_versions WHERE academy_lesson_id=$1 AND source_kind='reference' ORDER BY version_number LIMIT 1", [lessonId])).rows[0].id;
    await actor("authenticated", A);
    await expect(db.query("SELECT academy_admin_rollback_lesson($1,$2)", [lessonId, oldVersion])).rejects.toThrow();
    await actor("authenticated", ADMIN);
    const before = await scalar(`SELECT count(*)::int n FROM academy_lesson_versions WHERE academy_lesson_id='${lessonId}'`);
    await db.query("SELECT academy_admin_rollback_lesson($1,$2)", [lessonId, oldVersion]);
    const after = await scalar(`SELECT count(*)::int n FROM academy_lesson_versions WHERE academy_lesson_id='${lessonId}'`);
    expect(after).toEqual({ n: Number(before.n) + 1 });
    expect(await scalar(`SELECT status,published_version_id=draft_version_id same FROM academy_lessons WHERE id='${lessonId}'`)).toEqual({ status: "published", same: true });
  });
});

describe("Silk Road current-edition reporting", () => {
  it("excludes completion from an older version without deleting its history", async () => {
    await actor("authenticated", A);
    const module = (await db.query<{ result: Array<{ lessonId: string; completed: boolean; xp: number }> }>("SELECT academy_get_module_progress('s01-m01') result")).rows[0].result;
    expect(module.find((row) => row.lessonId === "l01-01")).toMatchObject({ completed: false, xp: 0 });
    const dashboard = (await db.query<{ result: Array<{ lesson_id: string; completed: boolean; xp: number }> }>("SELECT academy_get_silk_road_progress() result")).rows[0].result;
    expect(dashboard.find((row) => row.lesson_id === "l01-01")).toMatchObject({ completed: false, xp: 0 });
    const updated = (await db.query<{ lesson: { versionChanged: boolean; progress: unknown } }>("SELECT academy_get_lesson_v2('s01-m01','l01-01') lesson")).rows[0].lesson;
    expect(updated.versionChanged).toBe(true);
    expect(updated.progress).toBeNull();
    await actor();
    const history = await scalar("SELECT p.completed_at IS NOT NULL completed, p.xp FROM academy_lesson_progress p JOIN academy_lessons l ON l.id=p.academy_lesson_id WHERE p.user_id='00000000-0000-4000-8000-000000000001' AND l.module_id='s01-m01' AND l.lesson_id='l01-01'");
    expect(history).toEqual({ completed: true, xp: 55 });
  });

  it("requires authentication and excludes other users and locked modules", async () => {
    await actor("anon");
    await expect(db.query("SELECT academy_get_silk_road_progress()")).rejects.toThrow();
    await actor("authenticated", B);
    const rows = (await db.query<{ result: Array<{ module_id: string; completed: boolean; xp: number }> }>("SELECT academy_get_silk_road_progress() result")).rows[0].result;
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((row) => row.module_id === "s01-m01" && !row.completed && row.xp === 0)).toBe(true);
  });
});

describe("unified progress and resume", () => {
  it("reports real current-edition XP for all courses without reading legacy completion or changing history", async () => {
    await actor();
    await db.exec("BEGIN");
    try {
      const refs = (await db.query<{ id: string; module_id: string; lesson_id: string; published_version_id: string }>(
        `SELECT DISTINCT ON (left(module_id,3)) id,module_id,lesson_id,published_version_id
         FROM academy_lessons WHERE published_version_id IS NOT NULL AND status<>'archived'
           AND module_id IN ('s01-m01','s02-m02','s03-m01') ORDER BY left(module_id,3),lesson_id`
      )).rows;
      expect(refs).toHaveLength(3);
      for (let i = 0; i < refs.length; i++) {
        const l = refs[i];
        await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,xp,completed_at)
          VALUES($1,$2,$3,$4,NULL) ON CONFLICT(user_id,academy_lesson_id)
          DO UPDATE SET version_id=EXCLUDED.version_id,xp=EXCLUDED.xp,completed_at=NULL`, [ADMIN,l.id,l.published_version_id,[7,28,19][i]]);
        await db.query(`INSERT INTO pdf_progress(user_id,module_id,lesson_id,completed)
          VALUES($1,$2,$3,true) ON CONFLICT(user_id,module_id,lesson_id) DO UPDATE SET completed=true`, [ADMIN,l.module_id,l.lesson_id]);
      }
      const stored = await scalar("SELECT md5(jsonb_agg(p ORDER BY user_id,academy_lesson_id)::text) hash FROM academy_lesson_progress p");
      await actor('authenticated',ADMIN);
      const report = (await db.query<{ result: Array<{ module_id: string; lesson_id: string; completed: boolean; xp: number }> }>("SELECT academy_get_learning_progress() result")).rows[0].result;
      for (let i = 0; i < refs.length; i++) {
        expect(report.find(row => row.module_id===refs[i].module_id && row.lesson_id===refs[i].lesson_id)).toMatchObject({ completed:false,xp:[7,28,19][i] });
      }
      await actor();
      expect(await scalar("SELECT md5(jsonb_agg(p ORDER BY user_id,academy_lesson_id)::text) hash FROM academy_lesson_progress p")).toEqual(stored);
      const video = refs[1];
      const old = (await db.query<{ id: string }>('SELECT id FROM academy_lesson_versions WHERE academy_lesson_id=$1 AND id<>$2 LIMIT 1',[video.id,video.published_version_id])).rows[0];
      expect(old).toBeTruthy();
      await db.query('UPDATE academy_lesson_progress SET version_id=$1,xp=99,completed_at=now() WHERE user_id=$2 AND academy_lesson_id=$3',[old.id,ADMIN,video.id]);
      await actor('authenticated',ADMIN);
      const module = (await db.query<{ result: Array<{lessonId: string; completed: boolean; xp: number}> }>('SELECT academy_get_module_progress($1) result',[video.module_id])).rows[0].result;
      expect(module.find(row => row.lessonId===video.lesson_id)).toMatchObject({ completed:false,xp:0 });
      const updated = (await db.query<{ result: Array<{ module_id: string; lesson_id: string; completed: boolean; xp: number }> }>('SELECT academy_get_learning_progress() result')).rows[0].result;
      expect(updated.find(row => row.module_id===video.module_id && row.lesson_id===video.lesson_id)).toMatchObject({completed:false,xp:0});
      await actor();
      expect((await db.query<{xp:number}>('SELECT xp FROM academy_lesson_progress WHERE user_id=$1 AND academy_lesson_id=$2',[ADMIN,video.id])).rows[0].xp).toBe(99);
    } finally { await db.exec('ROLLBACK'); await actor(); }
  });

  it('requires authentication and only returns the callers accessible progress', async () => {
    await actor('anon');
    await expect(db.query('SELECT academy_get_learning_progress()')).rejects.toThrow();
    await actor('authenticated',B);
    const rows = (await db.query<{ result: Array<{module_id: string; xp: number; completed: boolean}> }>('SELECT academy_get_learning_progress() result')).rows[0].result;
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every(row => ['s01-m01','s03-m02'].includes(row.module_id) && row.xp===0 && !row.completed)).toBe(true);
  });

  it('records stable IDs using server time without awarding XP or completing anything', async () => {
    await actor();
    await db.exec('BEGIN');
    try {
      const before = await scalar('SELECT count(*)::int n,sum(xp)::int xp FROM academy_lesson_progress');
      await actor('authenticated',B);
      const saved = (await db.query<{result:{moduleId:string;lessonId:string;timestamp:string}}>("SELECT academy_record_lesson_visit($1,'s01-m01','l01-04') result",[B])).rows[0].result;
      expect(saved).toMatchObject({moduleId:'s01-m01',lessonId:'l01-04'});
      expect(Number.isFinite(Date.parse(saved.timestamp))).toBe(true);
      expect((await db.query<{last_opened_lesson:unknown}>('SELECT last_opened_lesson FROM profiles WHERE id=$1',[B])).rows[0].last_opened_lesson).toEqual(saved);
      await actor();
      expect(await scalar('SELECT count(*)::int n,sum(xp)::int xp FROM academy_lesson_progress')).toEqual(before);
    } finally { await db.exec('ROLLBACK'); await actor(); }
  });

  it('rejects cross-account, locked, missing and anonymous bookmark writes', async () => {
    await actor('authenticated',B);
    await expect(db.query("SELECT academy_record_lesson_visit($1,'s01-m01','l01-01')",[A])).rejects.toThrow(/Access denied/);
    await expect(db.query("SELECT academy_record_lesson_visit($1,'s03-m20','lm20-01')",[B])).rejects.toThrow(/Access denied/);
    await expect(db.query("SELECT academy_record_lesson_visit($1,'s01-m01','missing')",[B])).rejects.toThrow(/not found/);
    await actor('anon');
    await expect(db.query("SELECT academy_record_lesson_visit($1,'s01-m01','l01-01')",[B])).rejects.toThrow();
  });
});

describe("transactional payment ledger", () => {
  it("unlocks exact modules and repeated events create one purchase/outbox pair", async () => {
    await record("one");
    await record("one");
    await actor();
    expect(
      await scalar(
        "SELECT count(*)::int n FROM academy_purchases WHERE stripe_checkout_session_id='one'",
      ),
    ).toEqual({ n: 1 });
    expect(
      await scalar(
        "SELECT count(*)::int n FROM academy_outbox WHERE session_id='one'",
      ),
    ).toEqual({ n: 2 });
    await actor("authenticated", A);
    expect(
      await scalar(
        "SELECT academy_has_module_access('s01-m10') yes,academy_has_module_access('s01-m11') no",
      ),
    ).toEqual({ yes: true, no: false });
  });
  it("refuses ownership changes and wrong prices", async () => {
    await expect(record("one", "systems-10", B)).rejects.toThrow("ownership");
    await actor("service_role");
    await expect(
      db.query("SELECT academy_record_purchase($1)", [{
        ...purchase("invalid"),
        amount_total: 1,
      }]),
    ).rejects.toThrow("Invalid purchase");
  });
  it("partial refunds preserve access, full refunds preserve other purchases", async () => {
    await record("two", "perfektno-video");
    await db.query("SELECT academy_apply_adjustment($1,$2,$3)", [
      "partial",
      "pi_one",
      100,
    ]);
    await actor("authenticated", A);
    expect(await scalar("SELECT academy_has_module_access('s01-m02') yes"))
      .toEqual({ yes: true });
    await actor("service_role");
    await db.query("SELECT academy_apply_adjustment($1,$2,$3)", [
      "full",
      "pi_one",
      4900,
    ]);
    await record("one");
    await actor("authenticated", A);
    expect(
      await scalar(
        "SELECT academy_has_module_access('s01-m02') no,academy_has_module_access('s02-m15') yes",
      ),
    ).toEqual({ no: false, yes: true });
  });
  it("handles refund before completion and out of order refund replay", async () => {
    await actor("service_role");
    await db.query("SELECT academy_apply_adjustment($1,$2,$3)", [
      "early",
      "pi_early",
      4900,
    ]);
    await record("early");
    await db.query("SELECT academy_apply_adjustment($1,$2,$3)", [
      "stale",
      "pi_early",
      100,
    ]);
    expect(
      await scalar(
        "SELECT status FROM academy_purchases WHERE stripe_checkout_session_id='early'",
      ),
    ).toEqual({ status: "refunded" });
  });
  it("lost dispute revokes, won dispute restores, stale created cannot reopen terminal state", async () => {
    await actor("service_role");
    await db.query("SELECT academy_apply_adjustment($1,$2,0,$3,$4)", [
      "lost",
      "pi_two",
      "lost",
      20,
    ]);
    await actor("authenticated", A);
    expect(await scalar("SELECT academy_has_module_access('s02-m02') yes"))
      .toEqual({ yes: false });
    await actor("service_role");
    await db.query("SELECT academy_apply_adjustment($1,$2,0,$3,$4)", [
      "won",
      "pi_two",
      "won",
      30,
    ]);
    await db.query("SELECT academy_apply_adjustment($1,$2,0,$3,$4)", [
      "stale-dispute",
      "pi_two",
      "needs_response",
      10,
    ]);
    await actor("authenticated", A);
    expect(await scalar("SELECT academy_has_module_access('s02-m02') yes"))
      .toEqual({ yes: true });
  });
  it("claims side effects once while lease is active", async () => {
    await record("lease-only");
    expect((await db.query("SELECT * FROM academy_claim_outbox('lease-only')")).rows)
      .toHaveLength(2);
    expect((await db.query("SELECT * FROM academy_claim_outbox('lease-only')")).rows)
      .toHaveLength(0);
  });
  it("cancels an unsent activation email after a full refund without deleting payment history", async () => {
    await record("cancel-email");
    await db.query("SELECT academy_apply_adjustment($1,$2,$3)", [
      "cancel-email-refund",
      "pi_cancel-email",
      4900,
    ]);
    await record("cancel-email"); // a late verify must not enqueue the email again
    expect(
      await scalar(
        "SELECT state FROM academy_outbox WHERE id='cancel-email:access_email'",
      ),
    ).toEqual({ state: "cancelled" });
    expect(
      (await db.query("SELECT kind FROM academy_claim_outbox('cancel-email')"))
        .rows,
    ).toEqual([{ kind: "meta_purchase" }]);
    expect(
      await scalar(
        "SELECT count(*)::int n FROM academy_purchases WHERE stripe_checkout_session_id='cancel-email'",
      ),
    ).toEqual({ n: 1 });
  });
});

describe("server-side assessments", () => {
  it("hides answers and returns feedback only after submission; rejects spoofed scores", async () => {
    await actor("authenticated", A);
    expect(
      JSON.stringify(
        await scalar("SELECT academy_get_quiz('s01-m01','test-lesson')"),
      ),
    ).not.toContain("correct");
    await expect(
      db.exec(
        `INSERT INTO pdf_progress(user_id,module_id,lesson_id,quiz_score) VALUES('${A}','s01-m01','spoof',100)`,
      ),
    ).rejects.toThrow();
    const args = ["s01-m01", "test-lesson", {
      "10000000-0000-4000-8000-000000000001": 1,
    }, "20000000-0000-4000-8000-000000000001"];
    const first = await db.query(
      "SELECT academy_submit_quiz($1,$2,$3,$4) result",
      args,
    );
    expect(first.rows[0]).toMatchObject({ result: { score: 1, total: 1 } });
    expect(
      (await db.query("SELECT academy_submit_quiz($1,$2,$3,$4) result", args))
        .rows,
    ).toEqual(first.rows);
    expect(await scalar("SELECT count(*)::int n FROM academy_quiz_attempts"))
      .toEqual({ n: 1 });
  });
});

describe("additional adversarial regression coverage", () => {
  it("rejects null checkpoint answers and empty quiz submissions", async () => {
    await actor("authenticated", A);
    await expect(
      db.exec(
        "SELECT academy_answer_checkpoint('s01-m01','test-lesson','cp1',NULL)",
      ),
    ).rejects.toThrow();
    await expect(
      db.query("SELECT academy_submit_quiz($1,$2,$3,$4)", [
        "s01-m01",
        "test-lesson",
        null,
        "20000000-0000-4000-8000-000000000009",
      ]),
    ).rejects.toThrow();
  });
  it("test-mode purchase unlocks its exact package only in an isolated test environment", async () => {
    await actor("service_role");
    const data = {
      ...purchase("test-isolated", "systems-10", B),
      livemode: false,
      price_id: "price_1UHZrLBAV4zTG6a352iWRFlt",
    };
    await db.query("SELECT academy_record_purchase($1)", [data]);
    await actor("authenticated", B);
    expect(await scalar("SELECT academy_has_module_access('s01-m10') allowed"))
      .toEqual({ allowed: false });
    await actor();
    await db.exec("UPDATE academy_private.runtime_config SET livemode=false");
    await actor("authenticated", B);
    expect(
      await scalar(
        "SELECT academy_has_module_access('s01-m10') yes,academy_has_module_access('s01-m11') no,academy_has_module_access('s02-m01') other",
      ),
    ).toEqual({ yes: true, no: false, other: false });
    await actor();
    await db.exec("UPDATE academy_private.runtime_config SET livemode=true");
    expect(
      await scalar(
        "SELECT count(*)::int n FROM academy_outbox WHERE session_id='test-isolated'",
      ),
    ).toEqual({ n: 0 });
  });
  it("ordinary users cannot edit private environment, price catalog or truncate tables", async () => {
    await actor("authenticated", A);
    for (
      const q of [
        "UPDATE academy_private.runtime_config SET livemode=false",
        "UPDATE academy_prices SET amount_cents=1",
        "TRUNCATE profiles",
        "TRUNCATE interactive_lessons",
      ]
    ) {
      await expect(db.exec(q)).rejects.toThrow();
    }
  });
  it("a user with another active purchase in the same package keeps its entitlement after a refund", async () => {
    await record("overlap-a", "systems-10", B);
    await record("overlap-b", "systems-10", B);
    await db.query("SELECT academy_apply_adjustment($1,$2,$3)", [
      "overlap-refund",
      "pi_overlap-a",
      4900,
    ]);
    await actor("authenticated", B);
    expect(await scalar("SELECT academy_has_module_access('s01-m02') allowed"))
      .toEqual({ allowed: true });
  });
});

describe("email delivery lease", () => {
  it("claims once, retries failures with the same provider key, and never resends success", async () => {
    await actor("service_role");
    const first = (await db.query<{ token: string }>(
      "SELECT academy_claim_email($1,'welcome') token",
      [A],
    )).rows[0].token;
    expect(first).toBeTruthy();
    expect(
      (await db.query<{ token: string | null }>(
        "SELECT academy_claim_email($1,'welcome') token",
        [A],
      )).rows[0].token,
    ).toBeNull();
    await db.query("SELECT academy_finish_email($1,'welcome',$2,false)", [
      A,
      first,
    ]);
    const second = (await db.query<{ token: string }>(
      "SELECT academy_claim_email($1,'welcome') token",
      [A],
    )).rows[0].token;
    expect(second).not.toBe(first);
    await db.query("SELECT academy_finish_email($1,'welcome',$2,true)", [
      A,
      second,
    ]);
    await db.query("SELECT academy_finish_email($1,'welcome',$2,false)", [
      A,
      first,
    ]); // stale worker
    expect(
      (await db.query<{ token: string | null }>(
        "SELECT academy_claim_email($1,'welcome') token",
        [A],
      )).rows[0].token,
    ).toBeNull();
  });
  it("does not automatically retry beyond the provider deduplication window", async () => {
    await actor("service_role");
    await db.query("SELECT academy_claim_email($1,'downsell')", [B]);
    await db.exec(
      "UPDATE email_logs SET first_attempt_at=now()-interval '24 hours',lease_until=now()-interval '1 hour' WHERE email_type='downsell'",
    );
    expect(
      (await db.query<{ token: string | null }>(
        "SELECT academy_claim_email($1,'downsell') token",
        [B],
      )).rows[0].token,
    ).toBeNull();
  });
  it("does not emit new email or analytics for an explicitly verified historical price", async () => {
    await actor("service_role");
    await db.query("SELECT academy_record_purchase($1)", [{
      ...purchase("historical"),
      price_id: "price_1Tt5YBBAV4zTG6a3dOmyhgop",
      amount_total: 1499,
    }]);
    expect(
      await scalar(
        "SELECT count(*)::int n FROM academy_outbox WHERE session_id='historical'",
      ),
    ).toEqual({ n: 0 });
  });
});

describe("Perfect Video v4.2 release safety", () => {
  it("publishes 65 reviewed lessons, preserves prior progress and requires correct scenario choices", async () => {
    await actor();
    expect(await scalar(`SELECT count(*)::int n FROM academy_lessons
      WHERE module_id IN ('s02-m01','s02-m02','s02-m03')
        AND published_version_id=draft_version_id`)).toEqual({ n: 65 });
    const ref = (await db.query<{
      lesson_id: string;
      version_id: string;
      block_key: string;
      correct: string;
      options: Array<{ id: string }>;
    }>(`SELECT l.id lesson_id, l.published_version_id version_id,
              b.block_key, k.answer_key->>'correct' correct,
              b.content->'options' options
       FROM academy_lessons l
       JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id
       JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
       WHERE l.module_id='s02-m01' AND l.lesson_id='pv01-01'
         AND b.block_type='scenario' ORDER BY b.position LIMIT 1`)).rows[0];
    expect(ref).toBeTruthy();
    const old = (await db.query<{ id: string }>(
      "SELECT id FROM academy_lesson_versions WHERE academy_lesson_id=$1 AND id<>$2 ORDER BY version_number DESC LIMIT 1",
      [ref.lesson_id, ref.version_id],
    )).rows[0].id;
    await db.query(`INSERT INTO academy_lesson_progress
      (user_id,academy_lesson_id,version_id,current_block_key,completed_block_keys,xp)
      VALUES($1,$2,$3,'hook',ARRAY['objective','hook'],7)`, [ADMIN, ref.lesson_id, old]);
    await actor("authenticated", ADMIN);
    const before = (await db.query<{ lesson: { versionChanged: boolean; progress: unknown; priorProgress: { completedBlocks: number; xp: number } } }>(
      "SELECT academy_get_lesson_v2('s02-m01','pv01-01') lesson",
    )).rows[0].lesson;
    expect(before.versionChanged).toBe(true);
    expect(before.progress).toBeNull();
    expect(before.priorProgress).toMatchObject({ completedBlocks: 2, xp: 7 });

    const wrongChoice = ref.options.find((option) => option.id !== ref.correct)?.id;
    expect(wrongChoice).toBeTruthy();
    const wrong = (await db.query<{ result: { correct: boolean; feedback: { complete: boolean; answer?: unknown }; progress: { completed_block_keys: string[] } } }>(
      "SELECT academy_complete_lesson_block('s02-m01','pv01-01',$1,$2,$3,$4) result",
      [ref.version_id, ref.block_key, { selected: wrongChoice }, crypto.randomUUID()],
    )).rows[0].result;
    expect(wrong.correct).toBe(false);
    expect(wrong.feedback.complete).toBe(false);
    expect(wrong.feedback.answer).toBeUndefined();
    expect(wrong.progress.completed_block_keys).not.toContain(ref.block_key);
    await actor();
    const archived = (await db.query<{ snapshot: { xp: number; completed_block_keys: string[]; version_id: string } }>(
      "SELECT snapshot FROM academy_private.lesson_progress_history WHERE user_id=$1 AND academy_lesson_id=$2 AND version_id=$3",
      [ADMIN, ref.lesson_id, old],
    )).rows[0].snapshot;
    expect(archived).toMatchObject({ xp: 7, completed_block_keys: ['objective', 'hook'], version_id: old });
    await actor("authenticated", ADMIN);
    const correct = (await db.query<{ result: { correct: boolean; feedback: { complete: boolean } } }>(
      "SELECT academy_complete_lesson_block('s02-m01','pv01-01',$1,$2,$3,$4) result",
      [ref.version_id, ref.block_key, { selected: ref.correct }, crypto.randomUUID()],
    )).rows[0].result;
    expect(correct).toMatchObject({ correct: true, feedback: { complete: true } });
  });
});

describe("Perfect Video final exam", () => {
  it("keeps keys private, rejects acknowledgements, scores one complete attempt and gates the final", async () => {
    await actor();
    const ref = (await db.query<{
      version_id: string;
      questions: Array<{ id: string; options: Array<{ id: string }> }>;
      answers: Record<string, string>;
    }>(`SELECT l.published_version_id version_id,
              b.content->'questions' questions,k.answer_key->'answers' answers
       FROM academy_lessons l JOIN academy_lesson_blocks b
         ON b.version_id=l.published_version_id
       JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
       WHERE l.module_id='s02-m15' AND l.lesson_id='pv15-09'
         AND b.block_type='course_exam'`)).rows[0];
    expect(ref.questions).toHaveLength(12);
    await actor("authenticated", ADMIN);
    const lesson = (await db.query<{ lesson: { blocks: unknown[] } }>(
      "SELECT academy_get_lesson_v2('s02-m15','pv15-09') lesson",
    )).rows[0].lesson;
    expect(JSON.stringify(lesson.blocks)).not.toContain('"answer_key"');
    expect(JSON.stringify(lesson.blocks)).not.toContain('"evaluation"');

    await expect(db.query(
      "SELECT academy_complete_lesson_block('s02-m15','pv15-09',$1,'exam',$2,$3)",
      [ref.version_id, { acknowledged: true }, crypto.randomUUID()],
    )).rejects.toThrow(/course exam endpoint/);
    await expect(db.query(
      "SELECT academy_submit_course_exam('s02-m15','pv15-09',$1,'exam',$2,$3)",
      [ref.version_id, { answers: { q01: 'a' } }, crypto.randomUUID()],
    )).rejects.toThrow(/every exam question/);

    const wrongAnswers = Object.fromEntries(ref.questions.map((question) => [
      question.id,
      question.options.find((option) => option.id !== ref.answers[question.id])?.id,
    ]));
    const wrong = (await db.query<{ result: { correct: boolean; feedback: { complete: boolean; scorePercent: number; weakModules: string[]; answer?: unknown } } }>(
      "SELECT academy_submit_course_exam('s02-m15','pv15-09',$1,'exam',$2,$3) result",
      [ref.version_id, { answers: wrongAnswers }, crypto.randomUUID()],
    )).rows[0].result;
    expect(wrong).toMatchObject({ correct: false, feedback: { complete: false, scorePercent: 0 } });
    expect(wrong.feedback.weakModules).toEqual(['s02-m01', 's02-m02', 's02-m03', 's02-m04']);
    expect(wrong.feedback.answer).toBeUndefined();

    const nearMiss = { ...ref.answers };
    for (const question of ref.questions.slice(0, 3)) nearMiss[question.id] = wrongAnswers[question.id];
    const belowThreshold = (await db.query<{ result: { correct: boolean; feedback: { complete: boolean; scorePercent: number } } }>(
      "SELECT academy_submit_course_exam('s02-m15','pv15-09',$1,'exam',$2,$3) result",
      [ref.version_id, { answers: nearMiss }, crypto.randomUUID()],
    )).rows[0].result;
    expect(belowThreshold).toMatchObject({ correct: false, feedback: { complete: false, scorePercent: 75 } });

    const passAnswers = { ...ref.answers };
    for (const question of ref.questions.slice(0, 2)) passAnswers[question.id] = wrongAnswers[question.id];
    const passed = (await db.query<{ result: { correct: boolean; feedback: { complete: boolean; scorePercent: number; answer?: unknown } } }>(
      "SELECT academy_submit_course_exam('s02-m15','pv15-09',$1,'exam',$2,$3) result",
      [ref.version_id, { answers: passAnswers }, crypto.randomUUID()],
    )).rows[0].result;
    expect(passed).toMatchObject({ correct: true, feedback: { complete: true, scorePercent: 83 } });
    expect(passed.feedback.answer).toBeUndefined();
    await expect(db.query(
      "SELECT academy_submit_course_exam('s02-m15','pv15-13',(SELECT published_version_id FROM academy_lessons WHERE lesson_id='pv15-13'),'exam',$1,$2)",
      [{ answers: Object.fromEntries(Array.from({ length: 30 }, (_, i) => [`q${String(i + 1).padStart(2, '0')}`, 'a'])) }, crypto.randomUUID()],
    )).rejects.toThrow(/12 previous module 15 lessons/);
  });
});

// Synthetic fixtures only: the real Marketing Basics exam and its keys remain private.
async function marketingExamFixture() {
  await actor();
  await db.exec("BEGIN");
  await db.exec(`DO $fixture$
    DECLARE i integer; lid uuid; vid uuid; bid uuid; questions jsonb; keys jsonb;
      lo integer; hi integer; per_module integer;
    BEGIN
      FOR i IN 1..14 LOOP
        INSERT INTO academy_lessons(module_id,lesson_id,status)
          VALUES('s03-m20','lm20-'||lpad(i::text,2,'0'),'draft') RETURNING id INTO lid;
        INSERT INTO academy_lesson_versions(academy_lesson_id,version_number,title,source_kind)
          VALUES(lid,1,'Synthetic test lesson','editor') RETURNING id INTO vid;
        UPDATE academy_lessons SET status='published',published_version_id=vid,draft_version_id=vid WHERE id=lid;
        IF i>=10 THEN
          lo:=CASE i WHEN 10 THEN 1 WHEN 11 THEN 5 WHEN 12 THEN 11 WHEN 13 THEN 17 ELSE 1 END;
          hi:=CASE i WHEN 10 THEN 4 WHEN 11 THEN 10 WHEN 12 THEN 16 WHEN 13 THEN 20 ELSE 20 END;
          per_module:=CASE WHEN i=14 THEN 2 ELSE 3 END;
          SELECT jsonb_agg(jsonb_build_object('id','q'||n,'moduleId','s03-m'||lpad(m::text,2,'0'),
            'prompt','Synthetic question '||n,'options',jsonb_build_array(
              jsonb_build_object('id','a','label','Synthetic A'),jsonb_build_object('id','b','label','Synthetic B'))) ORDER BY n),
            jsonb_object_agg('q'||n,'a') INTO questions,keys
          FROM (SELECT m,row_number() OVER (ORDER BY m,j) n FROM generate_series(lo,hi) m
            CROSS JOIN generate_series(1,per_module) j) q;
          INSERT INTO academy_lesson_blocks(version_id,block_key,position,block_type,title,content,points,required)
            VALUES(vid,'exam',0,'course_exam','Synthetic exam',jsonb_build_object('questions',questions,
              'minimumPercent',80,'minimumGroupPercent',CASE WHEN i=14 THEN 60 ELSE 0 END),100,true)
            RETURNING id INTO bid;
          INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,scoring)
            VALUES(bid,jsonb_build_object('answers',keys),'{"mode":"aggregate"}');
        END IF;
      END LOOP;
    END $fixture$;`);
  return (await db.query<{ lesson_id: string; version_id: string; answers: Record<string, string> }>(`
    SELECT l.lesson_id,l.published_version_id version_id,k.answer_key->'answers' answers
    FROM academy_lessons l JOIN academy_lesson_blocks b ON b.version_id=l.published_version_id
    JOIN academy_private.lesson_block_keys k ON k.block_id=b.id WHERE l.module_id='s03-m20'
    ORDER BY l.lesson_id`)).rows;
}

describe("Marketing Basics course exam", () => {
  it("requires access, exact answers and current prerequisites while preserving private keys", async () => {
    const refs = await marketingExamFixture();
    const group = refs[0];
    const final = refs[4];
    const submit = (ref = group, answers: Record<string, unknown> = group.answers, attempt = crypto.randomUUID()) =>
      db.query("SELECT academy_submit_course_exam('s03-m20',$1,$2,'exam',$3,$4) result",
        [ref.lesson_id, ref.version_id, { answers }, attempt]);
    // Expected errors use savepoints because the fixtures run in an isolated transaction.
    async function rejects(action: () => Promise<unknown>, pattern: RegExp) {
      await actor();
      await db.exec("SAVEPOINT expected_error");
      try { await expect(action()).rejects.toThrow(pattern); }
      finally { await db.exec("ROLLBACK TO SAVEPOINT expected_error"); }
    }
    try {
      await rejects(async () => { await actor("anon"); return submit(); }, /permission denied|Access denied/);
      const outsider = '00000000-0000-4000-8000-000000000099';
      await db.query("INSERT INTO auth.users(id,email) VALUES($1,'exam-outsider@example.invalid')", [outsider]);
      await rejects(async () => { await actor("authenticated", outsider); return submit(); }, /Access denied/);
      await rejects(async () => { await actor("authenticated", ADMIN); return db.query("SELECT * FROM academy_private.lesson_block_keys"); }, /permission denied/);
      await actor("authenticated", ADMIN);
      const bundle = (await db.query<{ lesson: unknown }>("SELECT academy_get_lesson_v2('s03-m20','lm20-10') lesson")).rows[0].lesson;
      expect(JSON.stringify(bundle)).not.toMatch(/answer_key|"evaluation"/);
      await rejects(async () => { await actor("authenticated", ADMIN); return db.query(
        "SELECT academy_complete_lesson_block('s03-m20','lm20-10',$1,'exam',$2,$3)",
        [group.version_id, { acknowledged: true }, crypto.randomUUID()]); }, /course exam endpoint/);
      await rejects(async () => { await actor("authenticated", ADMIN); return submit(group, { q1: 'a' }); }, /every exam question/);
      await rejects(async () => { await actor("authenticated", ADMIN); return submit(group, { ...group.answers, extra: 'a' }); }, /every exam question/);
      await rejects(async () => { await actor("authenticated", ADMIN); return submit(group, { ...group.answers, q1: 'invalid' }); }, /Invalid or missing/);
      await rejects(async () => { await actor("authenticated", ADMIN); return submit({ ...group, version_id: crypto.randomUUID() }); }, /Published exam not found/);
      await rejects(async () => { await actor("authenticated", ADMIN); return submit(final, final.answers); }, /предишните 13/);
      await actor();
      await db.exec(`UPDATE academy_lesson_blocks SET content=jsonb_set(content,'{questions,0,moduleId}','"s03-m20"')
        WHERE version_id='${group.version_id}'`);
      await rejects(async () => { await actor("authenticated", ADMIN); return submit(); }, /exam coverage/);
    } finally { await actor(); await db.exec("ROLLBACK"); }
  });

  it("enforces 80% overall and 60% in each final group, with atomic and idempotent attempts", async () => {
    const refs = await marketingExamFixture();
    const final = refs[4];
    type ExamResult = { correct: boolean; feedback: { complete: boolean; scorePercent: number;
      groupResults: Array<{ passed: boolean; scorePercent: number }>; answer?: unknown; weakModules: string[] };
      progress: { completed_block_keys: string[] } };
    const submit = async (answers: Record<string, string>, attempt = crypto.randomUUID()) =>
      (await db.query<{ result: ExamResult }>("SELECT academy_submit_course_exam('s03-m20','lm20-14',$1,'exam',$2,$3) result",
        [final.version_id, { answers }, attempt])).rows[0].result;
    const answersWithErrors = (indices: number[]) => ({ ...final.answers,
      ...Object.fromEntries(indices.map((i) => [`q${i + 1}`, 'b'])) });
    try {
      await actor();
      await db.query(`INSERT INTO academy_lesson_progress(user_id,academy_lesson_id,version_id,completed_at)
        SELECT $1,id,published_version_id,now() FROM academy_lessons
        WHERE module_id='s03-m20' AND lesson_id BETWEEN 'lm20-01' AND 'lm20-13'`, [ADMIN]);
      await actor("authenticated", ADMIN);
      const near = await submit(answersWithErrors([0,2,8,10,12,20,22,32,34]));
      expect(near).toMatchObject({ correct: false, feedback: { complete: false, scorePercent: 77.5 } });
      expect(near.feedback.groupResults.every((group) => group.passed)).toBe(true);
      expect(near.progress.completed_block_keys).not.toContain('exam');
      const highButUneven = await submit(answersWithErrors([0,1,2,3]));
      expect(highButUneven).toMatchObject({ correct: false, feedback: { complete: false, scorePercent: 90 } });
      expect(highButUneven.feedback.groupResults[0]).toMatchObject({ passed: false, scorePercent: 50 });
      expect(highButUneven.feedback.answer).toBeUndefined();
      expect(highButUneven.feedback.weakModules).toEqual(['s03-m01', 's03-m02']);
      const attempt = crypto.randomUUID();
      const passingAnswers = answersWithErrors([0,2,8,10,20,22,32,34]);
      const pass = await submit(passingAnswers, attempt);
      expect(pass).toMatchObject({ correct: true, feedback: { complete: true, scorePercent: 80 } });
      expect(pass.progress.completed_block_keys).toContain('exam');
      expect(pass.feedback.groupResults.every((group) => group.passed)).toBe(true);
      expect((await submit(passingAnswers, attempt)).feedback).toEqual(pass.feedback);
      await actor();
      expect((await db.query<{ n: number }>("SELECT count(*)::int n FROM academy_lesson_attempts_v2 WHERE id=$1", [attempt])).rows[0].n).toBe(1);
      await db.exec("SAVEPOINT conflict");
      await actor("authenticated", ADMIN);
      await expect(submit(final.answers, attempt)).rejects.toThrow(/Attempt conflict/);
      await db.exec("ROLLBACK TO SAVEPOINT conflict");
      await actor("authenticated", ADMIN);
      await expect(submit(final.answers)).rejects.toThrow(/already passed/);
    } finally { await db.exec("ROLLBACK"); await actor(); }
  });
});
