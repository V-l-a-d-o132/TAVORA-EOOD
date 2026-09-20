/**
 * Read-only by default. Use only with securely supplied environment variables.
 * Deno permissions: --allow-env --allow-net.
 * This processes an existing Stripe payment. It cannot create or confirm a charge.
 */
import {
  db,
  fulfill,
  live,
  stripe,
} from "../supabase/functions/_shared/academy-runtime.ts";
import {
  type CheckoutSession,
  validateSession,
} from "../supabase/functions/_shared/academy-core.ts";

const sessionId = Deno.args.find((arg) => /^cs_(live|test)_/.test(arg));
if (!sessionId) throw new Error("Supply one existing Checkout Session ID");
const apply = Deno.args.includes("--apply");
if (apply && live && !Deno.args.includes("--allow-live")) {
  throw new Error("Live reconciliation requires --allow-live");
}
const session = await stripe.checkout.sessions.retrieve(sessionId, {
  expand: ["line_items.data.price", "payment_intent.latest_charge"],
});
const priceId = session.line_items?.data[0]?.price?.id;
const { data: price, error } = await db.from("academy_prices").select("*").eq(
  "price_id",
  priceId ?? "",
).single();
if (error || !price) {
  throw new Error("Price must first be configured by a reviewed migration");
}
const purchase = validateSession(session as CheckoutSession, price, live);
const { data: owner, error: ownerError } = await db.auth.admin.getUserById(
  purchase.user_id,
);
if (ownerError || !owner.user) {
  throw new Error("Stripe metadata owner does not exist");
}
console.log(
  JSON.stringify({
    apply,
    livemode: live,
    tier: purchase.tier,
    amount_cents: purchase.amount_total,
    owner_exists: true,
    historical: price.historical,
  }),
);
if (apply) {
  const result = await fulfill(sessionId);
  console.log(
    JSON.stringify({ recorded: true, access_granted: result.access_granted }),
  );
  // Historical transactions intentionally do not enqueue new Purchase events or emails.
}
