import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);

// Rate limiting — 10 sessions per IP per minute
const ipAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 60_000;

const TIER_CONFIG: Record<string, { name: string; price: number; description: string }> = {
  single: {
    name: "Един модул — Система ТАВОРА",
    price: 1200,
    description: "Изберете един от 10-те модула. Доживотен достъп.",
  },
  bundle: {
    name: "Пакет от 3 модула — Система ТАВОРА",
    price: 2400,
    description: "Три модула по ваш избор. Доживотен достъп.",
  },
  complete: {
    name: "Цялата система — 10 модула | ТАВОРА",
    price: 7800,
    description: "Всички 10 модула + 30-дневен план. Доживотен достъп.",
  },
};

async function getOrCreatePrice(tier: string): Promise<string> {
  const config = TIER_CONFIG[tier];
  if (!config) throw new Error(`Invalid tier: ${tier}`);

  const allProducts = await stripe.products.list({ active: true, limit: 100 });
  let product = allProducts.data.find((p) => p.name === config.name);

  if (!product) {
    product = await stripe.products.create({
      name: config.name,
      description: config.description,
    });
  }

  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
    limit: 5,
  });

  const matchingPrice = prices.data.find(
    (p) => p.unit_amount === config.price && p.currency === "eur"
  );

  if (matchingPrice) return matchingPrice.id;

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: config.price,
    currency: "eur",
  });

  return price.id;
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

  // Rate limiting
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
  const now = Date.now();
  let record = ipAttempts.get(ip);
  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: now + WINDOW_MS };
    ipAttempts.set(ip, record);
  }
  record.count++;
  if (record.count > MAX_ATTEMPTS) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    const body = await req.json();
    const { tier } = body;

    if (!tier || !TIER_CONFIG[tier]) {
      return new Response(JSON.stringify({ error: `Invalid tier: ${tier}` }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const key = Deno.env.get("STRIPE_SECRET_KEY");
    if (!key) {
      console.error("STRIPE_SECRET_KEY not found in environment");
      return new Response(JSON.stringify({ error: "Stripe configuration missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    console.log("[stripe-checkout] Creating price for tier:", tier);
    const priceId = await getOrCreatePrice(tier);
    console.log("[stripe-checkout] Got price ID:", priceId);

    const origin = req.headers.get("origin") || "https://imashnujnoto.com";

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      success_url: `${origin}/digitalni-produkti/proverki/potvardjenie?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/digitalni-produkti/proverki`,
      metadata: { tier, source: "checklist" },
    });

    console.log("[stripe-checkout] Session created:", session.id);
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe-checkout] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
