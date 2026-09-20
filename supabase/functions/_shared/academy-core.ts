export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
export const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const AMOUNTS: Record<string, number> = {
  "systems-10": 4900,
  "koprinena-pateka": 9900,
  "perfektno-video": 9900,
  "marketing-basics": 12900,
  "premium-all": 24900,
  strategic_access: 49700,
};
export interface PriceConfig {
  price_id: string;
  tier_id: string;
  amount_cents: number;
  currency: string;
  livemode: boolean;
  historical: boolean;
}
export interface CheckoutSession {
  id: string;
  mode: string | null;
  payment_status: string;
  currency: string | null;
  amount_total: number | null;
  livemode: boolean;
  metadata: Record<string, string> | null;
  client_reference_id: string | null;
  payment_intent: string | { id: string } | null;
  line_items?: {
    data: Array<{ quantity: number | null; price: { id: string } | null }>;
    has_more?: boolean;
  };
}
export function trustedOrigin(
  origin: string | null,
  extra: string,
  livemode: boolean,
) {
  const allowed = new Set([
    "https://imashnujnoto.com",
    "https://www.imashnujnoto.com",
    ...extra.split(",").map((x) => x.trim()).filter(Boolean),
  ]);
  if (!livemode) {
    ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]
      .forEach((x) => allowed.add(x));
  }
  if (!origin || !allowed.has(origin)) {
    throw new HttpError(403, "Origin not allowed");
  }
  const u = new URL(origin);
  if (u.origin !== origin || (livemode && u.protocol !== "https:")) {
    throw new HttpError(403, "Origin not allowed");
  }
  return origin;
}
export function requireOwner(session: CheckoutSession, userId?: string) {
  const owner = session.metadata?.user_id;
  if (!owner || !UUID.test(owner)) {
    throw new HttpError(422, "Purchase has no valid owner");
  }
  if (userId && owner !== userId) {
    throw new HttpError(403, "This payment belongs to another account");
  }
  if (session.client_reference_id && session.client_reference_id !== owner) {
    throw new HttpError(422, "Purchase identity mismatch");
  }
  return owner;
}
export function validateSession(
  session: CheckoutSession,
  cfg: PriceConfig,
  mode: boolean,
  userId?: string,
) {
  const owner = requireOwner(session, userId);
  const aliases: Record<string, string> = {
    premium: "koprinena-pateka",
    "premium-all-upsell": "premium-all",
  };
  const tier = cfg.historical
    ? (aliases[session.metadata?.tier ?? ""] ?? session.metadata?.tier)
    : session.metadata?.tier;
  if (session.livemode !== mode || cfg.livemode !== mode) {
    throw new HttpError(422, "Payment environment mismatch");
  }
  if (session.mode !== "payment") {
    throw new HttpError(422, "Invalid payment mode");
  }
  if (session.payment_status !== "paid") {
    throw new HttpError(402, "Payment is still processing");
  }
  if (
    cfg.currency !== "eur" || session.currency !== cfg.currency ||
    session.amount_total !== cfg.amount_cents || tier !== cfg.tier_id
  ) throw new HttpError(422, "Payment does not match the product");
  if (
    !["academy", "academy-v2", "downsell-email"].includes(
      session.metadata?.source ?? "",
    )
  ) throw new HttpError(422, "Invalid purchase source");
  if (
    !cfg.historical &&
    (session.client_reference_id !== owner ||
      cfg.amount_cents !== AMOUNTS[cfg.tier_id])
  ) throw new HttpError(422, "Invalid current product");
  const items = session.line_items?.data;
  if (
    !items || items.length !== 1 || session.line_items?.has_more ||
    items[0].quantity !== 1 || items[0].price?.id !== cfg.price_id
  ) throw new HttpError(422, "Invalid checkout line items");
  const pi = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id;
  if (!pi) throw new HttpError(422, "Missing payment intent");
  return {
    session_id: session.id,
    payment_intent_id: pi,
    user_id: owner,
    tier: cfg.tier_id,
    price_id: cfg.price_id,
    livemode: mode,
    amount_total: session.amount_total,
    currency: session.currency,
    mode: session.mode,
    payment_status: session.payment_status,
  };
}
