import { AMOUNTS, HttpError, UUID } from "../_shared/academy-core.ts";
import {
  db,
  endpoint,
  json,
  limited,
  live,
  requireUser,
  stripe,
} from "../_shared/academy-runtime.ts";
Deno.serve(endpoint(async (req, origin) => {
  const user = await requireUser(req);
  await limited("checkout:" + user.id);
  const { tier, request_id } = await req.json();
  if (!Object.hasOwn(AMOUNTS, tier)) {
    throw new HttpError(400, "Невалиден пакет.");
  }
  const requestId = typeof request_id === "string" && UUID.test(request_id)
    ? request_id
    : crypto.randomUUID();
  const { data: price, error } = await db.from("academy_prices").select("*").eq(
    "tier_id",
    tier,
  ).eq("livemode", live).eq("checkout_enabled", true).single();
  if (error || !price || price.amount_cents !== AMOUNTS[tier]) {
    throw new HttpError(503, "Пакетът временно не е достъпен за покупка.");
  }
  const metadata = { tier, source: "academy-v2", user_id: user.id };
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: price.price_id, quantity: 1 }],
    client_reference_id: user.id,
    customer_email: user.email,
    metadata,
    payment_intent_data: { metadata },
    success_url: origin + "/kurs/potvardjenie?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: origin + "/kurs/checkout?tier=" + encodeURIComponent(tier),
    integration_identifier: "tavora-academy-qnrvzpta",
  }, {
    idempotencyKey: "academy:" + user.id + ":" + tier + ":" + origin + ":" +
      requestId,
  });
  return json({ url: session.url, session_id: session.id }, 200, origin);
}));
