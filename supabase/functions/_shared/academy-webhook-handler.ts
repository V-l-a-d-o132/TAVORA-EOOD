import type Stripe from "npm:stripe@22.4.0";
import type * as Runtime from "./academy-runtime.ts";
import { HttpError } from "./academy-core.ts";
export function createWebhookHandler(
  deps: Pick<
    typeof Runtime,
    "db" | "stripe" | "live" | "json" | "fulfill" | "deliverOutbox"
  >,
  secret: string,
) {
  const { db, stripe, live, json, fulfill, deliverOutbox } = deps;
  return async (req: Request) => {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        await req.text(),
        req.headers.get("stripe-signature") ?? "",
        secret,
      );
    } catch {
      return json({ error: "Invalid signature" }, 400);
    }
    if (event.livemode !== live) {
      return json({ error: "Wrong environment" }, 400);
    }
    try {
      if (
        event.type === "checkout.session.completed" ||
        event.type === "checkout.session.async_payment_succeeded"
      ) {
        const session = event.data.object;
        if (
          !["academy", "academy-v2", "downsell-email"].includes(
            session.metadata?.source ?? "",
          )
        ) return json({ received: true, ignored: true });
        if (session.payment_status !== "paid") {
          return json({ received: true, pending: true });
        }
        await fulfill(session.id, undefined, event.id);
        await deliverOutbox(session.id);
      } else if (event.type === "checkout.session.async_payment_failed") {
        const { error } = await db.from("academy_webhook_events").upsert({
          event_id: event.id,
          kind: event.type,
        }, { onConflict: "event_id", ignoreDuplicates: true });
        if (error) throw error;
      } else if (event.type === "charge.refunded") {
        const c = event.data.object;
        const pi = typeof c.payment_intent === "string"
          ? c.payment_intent
          : c.payment_intent?.id;
        if (pi) {
          const { error } = await db.rpc("academy_apply_adjustment", {
            p_event_id: event.id,
            p_payment_intent: pi,
            p_refunded_cents: c.amount_refunded,
            p_event_time: event.created,
          });
          if (error) throw error;
        }
      } else if (
        event.type === "charge.dispute.created" ||
        event.type === "charge.dispute.closed"
      ) {
        const d = event.data.object;
        const pi = typeof d.payment_intent === "string"
          ? d.payment_intent
          : d.payment_intent?.id;
        if (pi) {
          const { error } = await db.rpc("academy_apply_adjustment", {
            p_event_id: event.id,
            p_payment_intent: pi,
            p_dispute_status: d.status,
            p_event_time: event.created,
          });
          if (error) throw error;
        }
      }
      return json({ received: true });
    } catch (err) {
      console.error(
        "[academy-webhook] processing failed",
        event.id,
        err instanceof HttpError ? err.status : 500,
      );
      return json({ error: "Processing failed; retry required" }, 500);
    }
  };
}
