import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

// ─── Module ID groups ─────────────────────────────────────────
const KOPRINENA_PATEKA_MODULES_FULL = [
  "s01-m01", "s01-m02", "s01-m03", "s01-m04", "s01-m05",
  "s01-m06", "s01-m07", "s01-m08", "s01-m09", "s01-m10",
  "s01-m11",
];

const KOPRINENA_PATEKA_MODULES_10 = [
  "s01-m01", "s01-m02", "s01-m03", "s01-m04", "s01-m05",
  "s01-m06", "s01-m07", "s01-m08", "s01-m09", "s01-m10",
];

const PERFEKTNO_VIDEO_MODULES = [
  "s02-m01", "s02-m02", "s02-m03", "s02-m04", "s02-m05",
  "s02-m06", "s02-m07", "s02-m08", "s02-m09", "s02-m10",
  "s02-m11", "s02-m12", "s02-m13", "s02-m14", "s02-m15",
];

const MARKETING_BASICS_MODULES = [
  "s03-m01", "s03-m02", "s03-m03", "s03-m04", "s03-m05",
  "s03-m06", "s03-m07", "s03-m08", "s03-m09", "s03-m10",
  "s03-m11", "s03-m12", "s03-m13", "s03-m14", "s03-m15",
  "s03-m16", "s03-m17", "s03-m18", "s03-m19", "s03-m20",
];

const ALL_MODULES = [
  ...KOPRINENA_PATEKA_MODULES_FULL,
  ...PERFEKTNO_VIDEO_MODULES,
  ...MARKETING_BASICS_MODULES,
];

// ─── STRICT tier → modules mapping ───
type TierResult = { moduleIds: string[]; setFullAccess: boolean } | null;

function getModulesForTier(tier: string): TierResult {
  switch (tier) {
    case "premium":
    case "koprinena-pateka":
      return { moduleIds: KOPRINENA_PATEKA_MODULES_FULL, setFullAccess: false };

    case "systems-10":
      return { moduleIds: KOPRINENA_PATEKA_MODULES_10, setFullAccess: false };

    case "perfektno-video":
      return { moduleIds: PERFEKTNO_VIDEO_MODULES, setFullAccess: false };

    case "marketing-basics":
      return { moduleIds: MARKETING_BASICS_MODULES, setFullAccess: false };

    case "premium-all":
      return { moduleIds: ALL_MODULES, setFullAccess: true };

    case "premium-all-upsell":
      return { moduleIds: ALL_MODULES, setFullAccess: true };

    case "strategic_access":
      return { moduleIds: ALL_MODULES, setFullAccess: true };

    default:
      console.error(`[academy-verify] UNKNOWN TIER: "${tier}" — rejecting unlock`);
      return null;
  }
}

function getTierLabel(tier: string): string {
  switch (tier) {
    case "systems-10": return "Пътят на коприната — 10 модула (Стартов пакет)";
    case "koprinena-pateka":
    case "premium": return "Пътят на коприната — 11 модула";
    case "perfektno-video": return "Перфектното Видео — 15 модула";
    case "marketing-basics": return "Marketing Basics — 20 модула";
    case "premium-all-upsell": return "Пълен достъп — всички секции + Сертификат";
    case "premium-all": return "Пълен достъп — всички секции";
    case "strategic_access": return "Пълен достъп + стратегически сесии";
    default: return "Академия TAVORA";
  }
}

async function sendAcademyAccessEmail(to: string, name: string, tier: string) {
  try {
    const tierLabel = getTierLabel(tier);
    const greeting = name ? `Здравей, ${name.split(" ")[0]}!` : "Здравей!";
    const ctaLink = "https://imashnujnoto.com/kurs";

    console.log("[academy-verify] Sending access email to:", to);

    const { data, error } = await resend.emails.send({
      from: "Tavora Digital <noreply@imashnujnoto.com>",
      to: [to],
      subject: `Достъпът ти е активиран — Академия TAVORA`,
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px 32px;">

          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; border:1px solid #e53e3e; padding: 8px 20px; margin-bottom: 16px;">
              <span style="color: #e53e3e; font-weight: 700; font-size: 14px; letter-spacing: 4px; text-transform: uppercase;">T A V O R A</span>
            </div>
            <p style="color: #555; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin: 0;">Академия</p>
          </div>

          <h1 style="color: #fff; font-size: 24px; font-weight: 300; margin: 0 0 8px 0; text-align: center;">${greeting}</h1>
          <p style="color: #888; font-size: 14px; text-align: center; margin: 0 0 32px 0;">
            Плащането е потвърдено — <strong style="color: #fff;">${tierLabel}</strong>
          </p>

          <div style="height: 1px; background: linear-gradient(90deg, transparent, #e53e3e, transparent); margin-bottom: 32px;"></div>

          <p style="color: #888; font-size: 13px; text-align: center; margin: 0 0 16px 0;">
            Модулите са отключени. Влез и започни веднага:
          </p>

          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${ctaLink}"
               style="display: inline-block; background: #e53e3e; color: #fff; padding: 18px 44px; text-decoration: none; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
              КЪМ ПЛАТФОРМАТА
            </a>
          </div>

          <div style="height: 1px; background: linear-gradient(90deg, transparent, #333, transparent); margin-bottom: 24px;"></div>

          <p style="color: #666; font-size: 12px; text-align: center; margin: 0 0 8px 0;">
            Ако не си правил/а тази поръчка, просто игнорирай този имейл.
          </p>
          <p style="color: #444; font-size: 11px; text-align: center; margin: 0;">
            <strong style="color: #888;">Tavora Digital</strong> · Велико Търново · България
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[academy-verify] Resend error:", JSON.stringify(error));
      return false;
    }
    console.log("[academy-verify] Email sent! ID:", data?.id);
    return true;
  } catch (err) {
    console.error("[academy-verify] Email send failed:", err);
    return false;
  }
}

// ─── Recompute access from all paid purchases ──────────────────
async function recomputeAccess(userId: string): Promise<boolean> {
  try {
    const { data: purchases } = await supabase
      .from("academy_purchases")
      .select("tier_id")
      .eq("user_id", userId)
      .eq("status", "paid");

    let modules: string[] = [];
    let hasFull = false;
    for (const p of purchases || []) {
      const tierRes = getModulesForTier(p.tier_id);
      if (!tierRes) continue;
      if (tierRes.setFullAccess) hasFull = true;
      modules = modules.concat(tierRes.moduleIds);
    }
    modules = [...new Set(modules)];

    const { error } = await supabase
      .from("profiles")
      .update({ unlocked_modules: modules, has_full_access: hasFull })
      .eq("id", userId);

    if (error) {
      console.error("[academy-verify] recomputeAccess failed:", error.message);
      return false;
    }
    console.log(`[academy-verify] recomputeAccess: ${modules.length} modules, full=${hasFull}`);
    return true;
  } catch (err) {
    console.error("[academy-verify] recomputeAccess crash:", err);
    return false;
  }
}

// ─── Record a purchase (source of truth) ───────────────────────
async function recordPurchase(session: any, userId: string, tier: string): Promise<void> {
  try {
    const { data: existing } = await supabase
      .from("academy_purchases")
      .select("id")
      .eq("stripe_checkout_session_id", session.id)
      .maybeSingle();
    if (existing) return;

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id || null;

    const { error } = await supabase.from("academy_purchases").insert({
      user_id: userId,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      tier_id: tier,
      amount_paid_cents: session.amount_total,
      currency: session.currency,
      status: "paid",
      purchased_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[academy-verify] recordPurchase insert failed:", error.message);
    }
  } catch (err) {
    console.error("[academy-verify] recordPurchase crash:", err);
  }
}

// ─── Resolve user id by email ──────────────────────────────────
async function resolveUserIdByEmail(email: string): Promise<string | null> {
  try {
    for (let page = 1; page <= 10; page++) {
      const { data: authUsers, error: authErr } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
      if (authErr) break;
      if (!authUsers?.users?.length) break;

      const matchedUser = authUsers.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (matchedUser) return matchedUser.id;
    }
    return null;
  } catch (err) {
    console.error("[academy-verify] resolveUserIdByEmail crash:", err);
    return null;
  }
}

async function waitForPayment(sessionId: string, maxRetries: number = 5): Promise<any> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log(`[academy-verify] Payment check ${attempt + 1}/${maxRetries}: payment_status=${session.payment_status}`);
    if (session.payment_status === "paid") return session;
    if (attempt < maxRetries - 1) await new Promise((r) => setTimeout(r, 1500));
  }
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const requestId = crypto.randomUUID().slice(0, 8);
  console.log(`[academy-verify:${requestId}] ========== REQUEST START ==========`);

  try {
    const { session_id } = await req.json();
    if (!session_id) {
      return new Response(JSON.stringify({ error: "Missing session_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    console.log(`[academy-verify:${requestId}] Session ID:`, session_id);

    const session = await waitForPayment(session_id, 5);
    if (!session || session.payment_status !== "paid") {
      return new Response(JSON.stringify({
        error: "Payment still processing. Please wait a moment and refresh the page.",
        detail: session?.payment_status || "unknown"
      }), {
        status: 402,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const tier = session.metadata?.tier || "";
    const email = session.customer_details?.email || "";
    const name = session.customer_details?.name || "";
    const metadataUserId = session.metadata?.user_id;

    console.log(`[academy-verify:${requestId}] Payment confirmed:`, { tier, email, metadataUserId: metadataUserId || "not-set" });

    const tierResult = getModulesForTier(tier);
    if (!tierResult) {
      console.error(`[academy-verify:${requestId}] ❌ REJECTED unknown tier: "${tier}"`);
      return new Response(JSON.stringify({
        error: `Unknown tier: "${tier}". No modules were unlocked. Please contact support.`,
        tier,
        request_id: requestId,
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const { moduleIds, setFullAccess } = tierResult;
    console.log(`[academy-verify:${requestId}] Tier "${tier}" → ${moduleIds.length} modules, setFullAccess=${setFullAccess}`);

    let jwtUserId = "";
    try {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
        if (!authErr && user?.id) {
          jwtUserId = user.id;
        } else {
          console.log(`[academy-verify:${requestId}] JWT invalid/expired (graceful):`, authErr?.message);
        }
      }
    } catch (jwtErr) {
      console.log(`[academy-verify:${requestId}] JWT parse error (graceful):`, jwtErr);
    }

    const finalUserId = jwtUserId || metadataUserId || "";

    let unlocked = false;
    let unlockMethod = "none";

    const resolvedUserId =
      (finalUserId && finalUserId !== "unknown")
        ? finalUserId
        : (metadataUserId && metadataUserId !== "unknown" ? metadataUserId : "");

    if (resolvedUserId) {
      unlockMethod = "recompute";
      await recordPurchase(session, resolvedUserId, tier);
      unlocked = await recomputeAccess(resolvedUserId);
    } else if (email) {
      const emailUserId = await resolveUserIdByEmail(email);
      if (emailUserId) {
        unlockMethod = "email-fallback-recompute";
        await recordPurchase(session, emailUserId, tier);
        unlocked = await recomputeAccess(emailUserId);
      } else {
        unlockMethod = "email-not-found";
      }
    }

    if (email) {
      sendAcademyAccessEmail(email, name, tier).catch((e) => {
        console.error(`[academy-verify:${requestId}] Email error (non-blocking):`, e);
      });
    }

    console.log(`[academy-verify:${requestId}] ========== RESULT ==========`);
    console.log(`[academy-verify:${requestId}] access_granted:`, unlocked, "method:", unlockMethod);

    return new Response(
      JSON.stringify({
        tier,
        email,
        name,
        access_granted: unlocked,
        modules_unlocked: moduleIds.length,
        user_id: finalUserId || "email-match",
        method: unlockMethod,
        request_id: requestId,
      }),
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[academy-verify:${requestId}] ❌ FATAL:`, message);
    return new Response(
      JSON.stringify({ error: "Verification failed", detail: message, request_id: requestId }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
