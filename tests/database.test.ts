import { PGlite } from "@electric-sql/pglite";
import { readdirSync, readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

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
    await db.exec(readFileSync("supabase/migrations/" + f, "utf8"));
  }
  await db.exec(
    `INSERT INTO academy_prices(price_id,tier_id,livemode,amount_cents,checkout_enabled) VALUES
 ('price_systems-10','systems-10',true,4900,true),('price_perfektno-video','perfektno-video',true,9900,true);
 INSERT INTO interactive_lessons(module_id,lesson_id,title,slides) VALUES
 ('s01-m01','test-lesson','Preview','[{"id":"cp1","type":"checkpoint","checkpoint":{"question":"Q","options":["a","b"],"correctIndex":1,"explanation":"Because"}}]'),
 ('s01-m02','test-lesson','Paid','[]');
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
      .toEqual({ n: 2 });
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
