import Stripe from "npm:stripe@22.4.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import {
  type CheckoutSession,
  HttpError,
  requireOwner,
  trustedOrigin,
  validateSession,
} from "./academy-core.ts";
export const db = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
const key = Deno.env.get("STRIPE_SECRET_KEY")!;
export const stripe = new Stripe(key, {
  apiVersion: "2026-07-29.dahlia",
  timeout: 15000,
  maxNetworkRetries: 2,
});
export const live = !/^[sr]k_test_/.test(key ?? "");
export function originFor(req: Request) {
  return trustedOrigin(
    req.headers.get("origin"),
    Deno.env.get("ACADEMY_ALLOWED_ORIGINS") ?? "",
    live,
  );
}
export function json(data: unknown, status = 200, origin?: string) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(origin
        ? {
          "Access-Control-Allow-Origin": origin,
          Vary: "Origin",
          "Access-Control-Allow-Headers":
            "authorization,apikey,content-type,x-client-info,idempotency-key",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        }
        : {}),
    },
  });
}
export async function requireUser(req: Request) {
  const token = req.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) throw new HttpError(401, "Влез в акаунта си.");
  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) {
    throw new HttpError(401, "Невалидна сесия. Влез отново.");
  }
  return data.user;
}
export async function limited(key: string, limit = 10, seconds = 60) {
  const { data, error } = await db.rpc("academy_rate_limit", {
    p_key: key,
    p_limit: limit,
    p_window: seconds,
  });
  if (error) throw error;
  if (!data) throw new HttpError(429, "Твърде много опити. Опитай по-късно.");
}
export function endpoint(
  fn: (req: Request, origin: string) => Promise<Response>,
) {
  return async (req: Request) => {
    let origin: string | undefined;
    try {
      origin = originFor(req);
      if (req.method === "OPTIONS") return json({}, 200, origin);
      if (req.method !== "POST") throw new HttpError(405, "Method not allowed");
      return await fn(req, origin);
    } catch (err) {
      if (!(err instanceof HttpError)) {
        console.error(
          "[academy] operation failed",
          err instanceof Error ? err.name : "unknown",
        );
      }
      return json(
        {
          error: err instanceof HttpError
            ? err.message
            : "Временна грешка. Опитай отново.",
        },
        err instanceof HttpError ? err.status : 500,
        origin,
      );
    }
  };
}
export async function fulfill(
  sessionId: string,
  userId?: string,
  eventId?: string,
) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price", "payment_intent.latest_charge"],
  });
  requireOwner(session as CheckoutSession, userId);
  const priceId = session.line_items?.data[0]?.price?.id;
  const { data: cfg, error } = await db.from("academy_prices").select("*").eq(
    "price_id",
    priceId ?? "",
  ).single();
  if (error || !cfg) {
    throw new HttpError(422, "Непозната цена. Свържи се с поддръжката.");
  }
  const validated = validateSession(
    session as CheckoutSession,
    cfg,
    live,
    userId,
  );
  // Reconcile the charge before granting: a delayed verify must not revive a refund.
  const intent = session.payment_intent as Stripe.PaymentIntent | null;
  const charge = intent && typeof intent !== "string"
    ? intent.latest_charge as Stripe.Charge | null
    : null;
  if (
    !charge || typeof charge === "string" || !charge.paid ||
    charge.amount !== validated.amount_total ||
    charge.currency !== validated.currency
  ) {
    throw new HttpError(422, "Invalid settled charge");
  }
  if (charge.amount_refunded > 0) {
    const { error: refundError } = await db.rpc("academy_apply_adjustment", {
      p_event_id: "snapshot-refund:" + charge.id + ":" + charge.amount_refunded,
      p_payment_intent: validated.payment_intent_id,
      p_refunded_cents: charge.amount_refunded,
    });
    if (refundError) throw refundError;
  }
  // A previously unobserved dispute needs review before this session can be fulfilled.
  // Terminal won/lost events continue through the normal signed adjustment ledger.
  if (charge.disputed) {
    const { data: adjustment, error: adjustmentError } = await db.from(
      "academy_payment_adjustments",
    ).select("dispute_status").eq(
      "payment_intent_id",
      validated.payment_intent_id,
    ).maybeSingle();
    if (adjustmentError || !adjustment?.dispute_status) {
      throw new HttpError(409, "Disputed payment requires review");
    }
  }
  const { data, error: recordError } = await db.rpc("academy_record_purchase", {
    p_session: validated,
    p_event_id: eventId ?? null,
  });
  if (recordError) throw recordError;
  return data;
}
async function digest(value: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value.trim().toLowerCase()),
  );
  return Array.from(
    new Uint8Array(bytes),
    (x) => x.toString(16).padStart(2, "0"),
  ).join("");
}
export async function deliverOutbox(sessionId: string) {
  const { data: jobs, error } = await db.rpc("academy_claim_outbox", {
    p_session: sessionId,
  });
  if (error) throw error;
  let failed = false;
  for (const job of jobs ?? []) {
    try {
      const { data, error: userError } = await db.auth.admin.getUserById(
        job.user_id,
      );
      if (userError || !data.user.email) throw new Error("Missing recipient");
      let response: Response;
      if (job.kind === "access_email") {
        const { data: purchase, error: purchaseError } = await db.from(
          "academy_purchases",
        ).select("status").eq("stripe_checkout_session_id", sessionId).single();
        if (purchaseError) throw purchaseError;
        if (!["paid", "partially_refunded"].includes(purchase.status)) {
          const { error: cancelError } = await db.from("academy_outbox").update(
            { state: "cancelled", lease_until: null, lease_token: null },
          ).eq("id", job.id).eq("lease_token", job.lease_token);
          if (cancelError) throw cancelError;
          continue;
        }
        const token = Deno.env.get("RESEND_API_KEY");
        if (!token) throw new Error("Email not configured");
        response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          signal: AbortSignal.timeout(15000),
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            "Idempotency-Key": job.id,
          },
          body: JSON.stringify({
            from: "Tavora Digital <noreply@imashnujnoto.com>",
            to: [data.user.email],
            subject: "Достъпът ти е активиран — Академия TAVORA",
            html:
              '<p>Плащането е потвърдено. Влез в акаунта си, за да започнеш обучението.</p><p><a href="https://imashnujnoto.com/dashboard">Към академията</a></p>',
          }),
        });
      } else {
        const token = Deno.env.get("META_CAPI_ACCESS_TOKEN");
        if (!token) throw new Error("Meta not configured");
        response = await fetch(
          "https://graph.facebook.com/v22.0/1742675203594120/events",
          {
            method: "POST",
            signal: AbortSignal.timeout(15000),
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: [{
                event_name: "Purchase",
                event_id: job.payload.event_id,
                event_time: Math.floor(
                  new Date(job.created_at).getTime() / 1000,
                ),
                action_source: "website",
                event_source_url: "https://imashnujnoto.com/kurs/potvardjenie",
                user_data: { em: [await digest(data.user.email)] },
                custom_data: {
                  value: job.payload.amount / 100,
                  currency: job.payload.currency.toUpperCase(),
                  content_ids: [job.payload.tier],
                  content_type: "product",
                },
              }],
            }),
          },
        );
      }
      if (!response.ok) throw new Error("Delivery failed");
      const { error: updateError } = await db.from("academy_outbox").update({
        state: "sent",
        sent_at: new Date().toISOString(),
        lease_until: null,
      }).eq("id", job.id).eq("lease_token", job.lease_token);
      if (updateError) throw updateError;
    } catch {
      failed = true;
      await db.from("academy_outbox").update({
        state: "pending",
        lease_until: null,
      }).eq("id", job.id).eq("lease_token", job.lease_token);
    }
  }
  // A crashed concurrent worker must not cause the webhook retry to be acknowledged.
  const { count, error: pendingError } = await db.from("academy_outbox").select(
    "id",
    { head: true, count: "exact" },
  ).eq("session_id", sessionId).in("state", ["pending", "sending"]);
  if (failed || pendingError || (count ?? 0) > 0) {
    throw new Error("Side effects pending retry");
  }
}
