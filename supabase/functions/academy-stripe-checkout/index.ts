import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Rate limiting — 10 checkout attempts per IP per minute
const ipAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 60_000;

const TIER_CONFIG: Record<string, { name: string; price: number; description: string }> = {
  // ─── Пътят на коприната (Секция 1) ───
  "systems-10": {
    name: "Пътят на коприната — Стартов пакет | Академия TAVORA",
    price: 4900,
    description: "10 модула от Пътят на коприната. Доживотен достъп.",
  },
  "koprinena-pateka": {
    name: "Пътят на коприната — AI Business Blueprint | Академия TAVORA",
    price: 9900,
    description: "11 модула от Пътят на коприната. Доживотен достъп.",
  },
  // ─── Перфектното Видео (Секция 2) ───
  "perfektno-video": {
    name: "Перфектното Видео — Видео продукция за бизнеса | Академия TAVORA",
    price: 9900,
    description: "15 модула за бизнес видео производство. От стратегия до монтаж. Доживотен достъп.",
  },
  // ─── Marketing Basics (Секция 3) ───
  "marketing-basics": {
    name: "Marketing Basics — Системата за растеж на бизнеса | Академия TAVORA",
    price: 12900,
    description: "20 модула маркетинг система. От позициониране до продажби и скалиране. Доживотен достъп.",
  },
  // ─── Пълен достъп (всички секции) ───
  "premium-all": {
    name: "Пълен достъп — Всички секции | Академия TAVORA",
    price: 24900,
    description: "Всички 3 секции: Пътят на коприната (11 модула) + Перфектното Видео (15 модула) + Marketing Basics (20 модула). Доживотен достъп. Включва сертификат.",
  },
  // ─── Пълен достъп + Стратегически сесии ───
  "strategic_access": {
    name: "Пълен достъп + Стратегически сесии | Академия TAVORA",
    price: 49700,
    description: "Всички 3 секции + 2 индивидуални стратегически срещи + Системата зад Академия TAVORA. Доживотен достъп. Включва сертификат.",
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

    // Extract user_id from JWT token
    let userId = "unknown";
    try {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
        if (!authErr && user?.id) {
          userId = user.id;
          console.log("[academy-checkout] Got user_id from JWT:", userId);
        }
      }
    } catch (jwtErr) {
      console.warn("[academy-checkout] Could not extract user_id from JWT:", jwtErr);
    }

    console.log("[academy-checkout] Creating price for tier:", tier);
    const priceId = await getOrCreatePrice(tier);
    console.log("[academy-checkout] Got price ID:", priceId);

    const origin = req.headers.get("origin") || "https://imashnujnoto.com";

    const successUrl = `${origin}/kurs/potvardjenie?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/kurs/checkout`;

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { tier, source: "academy", user_id: userId },
    });

    console.log("[academy-checkout] Session created:", session.id);
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[academy-checkout] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});