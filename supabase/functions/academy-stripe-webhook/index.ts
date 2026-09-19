import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");

// ─── Module ID helpers ─────────────────────────────────────────
function mods(section: string, from: number, to: number): string[] {
  const arr: string[] = [];
  for (let i = from; i <= to; i++) {
    arr.push(`${section}-m${String(i).padStart(2, "0")}`);
  }
  return arr;
}

const KOPRINENA_10 = mods("s01", 1, 10);
const KOPRINENA_11 = mods("s01", 1, 11);
const VIDEO_15 = mods("s02", 1, 15);
const MARKETING_20 = mods("s03", 1, 20);
const ALL_MODULES = [...KOPRINENA_11, ...VIDEO_15, ...MARKETING_20];

// ─── Active tiers (prices in cents) ───────────────────────────
interface TierCfg {
  name: string;
  priceCents: number;
  moduleIds: string[];
  fullAccess: boolean;
}

const TIER_CONFIG: Record<string, TierCfg> = {
  "systems-10": { name: "Стартов пакет", priceCents: 4900, moduleIds: KOPRINENA_10, fullAccess: false },
  "koprinena-pateka": { name: "Пътят на коприната", priceCents: 9900, moduleIds: KOPRINENA_11, fullAccess: false },
  "perfektno-video": { name: "Перфектното Видео", priceCents: 9900, moduleIds: VIDEO_15, fullAccess: false },
  "marketing-basics": { name: "Marketing Basics", priceCents: 12900, moduleIds: MARKETING_20, fullAccess: false },
  "premium-all": { name: "Пълен достъп", priceCents: 24900, moduleIds: ALL_MODULES, fullAccess: true },
  "strategic_access": { name: "Пълен достъп + стратегически сесии", priceCents: 49700, moduleIds: ALL_MODULES, fullAccess: true },
};

// Legacy tiers — recognized for historical recompute only, never granted for new purchases
const LEGACY_TIERS: Record<string, TierCfg> = {
  "premium": { name: "Пътят на коприната (legacy)", priceCents: 0, moduleIds: KOPRINENA_11, fullAccess: false },
  "premium-all-upsell": { name: "Пълен достъп (legacy)", priceCents: 0, moduleIds: ALL_MODULES, fullAccess: true },
};

// ─── Resolve authenticated user from session metadata or email ───
async function resolveUserId(session: any): Promise<string | null> {
  const metaUserId = session.metadata?.user_id;
  if (metaUserId && metaUserId !== "unknown") {
    const { data } = await supabase.auth.admin.getUserById(metaUserId);
    if (data?.user) return metaUserId;
  }

  const email = session.customer_details?.email;
  if (!email) return null;

  for (let page = 1; page <= 10; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (error || !data?.users?.length) break;
    const u = data.users.find((x) => x.email?.toLowerCase() === email.toLowerCase());
    if (u) return u.id;
  }
  return null;
}

// ─── Recompute access from remaining active purchases ───────────
async function recomputeAccess(userId: string): Promise<void> {
  const { data: purchases } = await supabase
    .from("academy_purchases")
    .select("tier_id")
    .eq("user_id", userId)
    .eq("status", "paid");

  let modules: string[] = [];
  let hasFull = false;
  for (const p of purchases || []) {
    const cfg = TIER_CONFIG[p.tier_id] || LEGACY_TIERS[p.tier_id];
    if (!cfg) continue;
    if (cfg.fullAccess) hasFull = true;
    modules = modules.concat(cfg.moduleIds);
  }
  modules = [...new Set(modules)];

  const { error } = await supabase
    .from("profiles")
    .update({ unlocked_modules: modules, has_full_access: hasFull })
    .eq("id", userId);
  if (error) console.error("[webhook] recomputeAccess failed:", error.message);
}

// ─── Grant access: ensure profile + recompute (no merge) ────────
async function grantAccess(userId: string): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  const updateData: Record<string, unknown> = {
    id: userId,
    abandoned_checkout_at: null,
    abandoned_checkout_tier: null,
    abandoned_cart_email_sent: false,
  };
  if (!profile) {
    updateData.role = "user";
    updateData.created_at = new Date().toISOString();
  }

  const { error } = await supabase.from("profiles").upsert(updateData, { onConflict: "id" });
  if (error) {
    console.error("[webhook] grantAccess upsert failed:", error.message);
    return false;
  }
  await recomputeAccess(userId);
  return true;
}

// ─── checkout.session.completed ─────────────────────────────────
async function handleCheckoutCompleted(session: any): Promise<Record<string, string>> {
  if (session.payment_status !== "paid") {
    console.log("[webhook] session not paid:", session.payment_status);
    return { status: "pending" };
  }

  const tierId = session.metadata?.tier || "";
  const cfg = TIER_CONFIG[tierId];

  if (!cfg) {
    if (LEGACY_TIERS[tierId]) {
      console.warn(`[webhook] legacy tier "${tierId}" — not granting for new purchase`);
      return { status: "legacy_ignored" };
    }
    console.error(`[webhook] unknown tier "${tierId}"`);
    return { status: "invalid_tier" };
  }

  if (session.currency !== "eur") {
    console.error(`[webhook] invalid currency: ${session.currency}`);
    return { status: "invalid_currency" };
  }
  if (session.amount_total !== cfg.priceCents) {
    console.error(`[webhook] amount mismatch: got ${session.amount_total}, expected ${cfg.priceCents}`);
    return { status: "amount_mismatch" };
  }

  const userId = await resolveUserId(session);
  if (!userId) {
    console.error("[webhook] could not resolve user for session", session.id);
    return { status: "no_user" };
  }

  const { data: existing } = await supabase
    .from("academy_purchases")
    .select("id")
    .eq("stripe_checkout_session_id", session.id)
    .maybeSingle();
  if (existing) return { status: "already_processed" };

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || null;

  const { error: insertErr } = await supabase.from("academy_purchases").insert({
    user_id: userId,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: paymentIntentId,
    tier_id: tierId,
    amount_paid_cents: session.amount_total,
    currency: session.currency,
    status: "paid",
    purchased_at: new Date().toISOString(),
  });

  if (insertErr) {
    if (insertErr.code === "23505") return { status: "already_processed" };
    console.error("[webhook] insert failed:", insertErr.message);
    return { status: "record_failed" };
  }

  const granted = await grantAccess(userId);
  return { status: granted ? "success" : "grant_failed" };
}

// ─── charge.refunded ────────────────────────────────────────────
async function handleRefund(charge: any): Promise<Record<string, string>> {
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id || null;
  if (!paymentIntentId) return { status: "no_payment_intent" };

  const amountRefunded = charge.amount_refunded || 0;
  const amount = charge.amount || 0;
  const newStatus = amountRefunded >= amount ? "refunded" : "partially_refunded";

  const { data: purchase } = await supabase
    .from("academy_purchases")
    .select("id, user_id")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .maybeSingle();
  if (!purchase) return { status: "purchase_not_found" };

  const { error: updErr } = await supabase
    .from("academy_purchases")
    .update({ status: newStatus, refunded_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", purchase.id);
  if (updErr) {
    console.error("[webhook] refund update failed:", updErr.message);
    return { status: "update_failed" };
  }

  await recomputeAccess(purchase.user_id);
  return { status: newStatus };
}

// ─── charge.dispute.created ─────────────────────────────────────
async function handleDispute(dispute: any): Promise<Record<string, string>> {
  const paymentIntentId = dispute.payment_intent || null;
  if (!paymentIntentId) return { status: "no_payment_intent" };

  const { data: purchase } = await supabase
    .from("academy_purchases")
    .select("id, user_id")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .maybeSingle();
  if (!purchase) return { status: "purchase_not_found" };

  const { error: updErr } = await supabase
    .from("academy_purchases")
    .update({ status: "disputed", updated_at: new Date().toISOString() })
    .eq("id", purchase.id);
  if (updErr) {
    console.error("[webhook] dispute update failed:", updErr.message);
    return { status: "update_failed" };
  }

  await recomputeAccess(purchase.user_id);
  return { status: "disputed" };
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing signature" }), { status: 400 });
  }
  if (!WEBHOOK_SECRET) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not configured");
    return new Response(JSON.stringify({ error: "Webhook secret not configured" }), { status: 500 });
  }

  const payload = await req.text();
  let event: any;
  try {
    event = await stripe.webhooks.constructEvent(payload, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
  }

  let result: Record<string, string>;
  switch (event.type) {
    case "checkout.session.completed":
      result = await handleCheckoutCompleted(event.data.object);
      break;
    case "charge.refunded":
      result = await handleRefund(event.data.object);
      break;
    case "charge.dispute.created":
      result = await handleDispute(event.data.object);
      break;
    default:
      result = { status: "ignored" };
  }

  console.log(`[webhook] event ${event.type} →`, JSON.stringify(result));
  return new Response(JSON.stringify({ received: true, type: event.type, ...result }), {
    headers: { "Content-Type": "application/json" },
  });
});
