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

// Rate limiting — 20 verify attempts per IP per minute (allow retries)
const ipAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 20;
const WINDOW_MS = 60_000;

// Session dedup cache — prevent processing same session_id twice  
const processedSessions = new Set<string>();

function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "TAVORA-";
  for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  code += "-";
  for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

async function sendChecklistEmail(to: string, access_code: string, tier: string, name: string) {
  try {
    const tierLabel = tier === "bundle" ? "Пакет 3 системи (24 EUR)"
      : tier === "complete" ? "Пълен пакет (37 EUR)"
      : "Една система (12 EUR)";
    const greeting = name ? `Здравей, ${name.split(" ")[0]}!` : "Здравей!";

    const { data, error } = await resend.emails.send({
      from: "Tavora Digital <noreply@imashnujnoto.com>",
      to: [to],
      subject: `Твоят код за достъп: ${access_code}`,
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px 32px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; border:1px solid #e53e3e; padding: 8px 20px; margin-bottom: 16px;">
              <span style="color: #e53e3e; font-weight: 700; font-size: 14px; letter-spacing: 4px; text-transform: uppercase;">T A V O R A</span>
            </div>
            <p style="color: #555; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin: 0;">AI Business Blueprint</p>
          </div>
          <h1 style="color: #fff; font-size: 24px; font-weight: 300; margin: 0 0 8px 0; text-align: center;">${greeting}</h1>
          <p style="color: #888; font-size: 14px; text-align: center; margin: 0 0 32px 0;">
            Благодарим ти за покупката — <strong style="color: #fff;">${tierLabel}</strong>
          </p>
          <div style="height: 1px; background: linear-gradient(90deg, transparent, #e53e3e, transparent); margin-bottom: 32px;"></div>
          <p style="color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin: 0 0 12px 0;">Твоят код за достъп</p>
          <div style="background: #111; border: 1px solid #e53e3e; padding: 24px; text-align: center; margin-bottom: 32px;">
            <span style="font-family: 'Courier New', monospace; font-size: 24px; font-weight: 700; color: #e53e3e; letter-spacing: 4px;">${access_code}</span>
          </div>
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="https://imashnujnoto.com/digitalni-produkti/proverki/dostap?code=${access_code}"
               style="display: inline-block; background: #e53e3e; color: #fff; padding: 16px 40px; text-decoration: none; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
              Отвори системите
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

    if (error) { console.error("[stripe-verify] Resend error:", JSON.stringify(error)); return false; }
    console.log("[stripe-verify] Email sent! ID:", data?.id);
    return true;
  } catch (err) {
    console.error("[stripe-verify] Email failed:", err);
    return false;
  }
}

async function waitForPayment(sessionId: string, maxRetries: number = 5): Promise<any> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log(`[stripe-verify] Attempt ${attempt + 1}: payment_status=${session.payment_status}`);
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
    const { session_id } = await req.json();
    if (!session_id) {
      return new Response(JSON.stringify({ error: "Missing session_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Validate session_id format to prevent probing
    if (!/^cs_[a-zA-Z0-9_]+$/.test(session_id)) {
      return new Response(JSON.stringify({ error: "Invalid session_id format" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

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

    const tier = session.metadata?.tier || "single";
    const email = session.customer_details?.email || "";
    const name = session.customer_details?.name || "";

    console.log("[stripe-verify] Payment confirmed:", { tier, email });

    // Reuse existing customer if found
    const { data: existingBySession } = await supabase
      .from("checklist_customers")
      .select("id, access_code, tier, selected_modules")
      .eq("email", email)
      .eq("tier", tier)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingBySession?.access_code && existingBySession.tier === tier) {
      console.log("[stripe-verify] Reusing existing customer:", existingBySession.id);
      await supabase.from("checklist_customers").update({ is_active: true }).eq("id", existingBySession.id);
      return new Response(
        JSON.stringify({
          access_code: existingBySession.access_code,
          tier: existingBySession.tier,
          selected_modules: existingBySession.selected_modules || [],
          already_exists: true,
        }),
        { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Generate unique access code
    let accessCode = generateAccessCode();
    let attempts = 0;
    while (attempts < 5) {
      const { data: dup } = await supabase.from("checklist_customers").select("id").eq("access_code", accessCode).maybeSingle();
      if (!dup) break;
      accessCode = generateAccessCode();
      attempts++;
    }

    // Save to checklist_customers
    const { error: insertError } = await supabase.from("checklist_customers").insert({
      email, name, password: accessCode, tier, access_code: accessCode, is_active: true, selected_modules: [],
    });

    if (insertError) {
      console.error("[stripe-verify] Insert error:", JSON.stringify(insertError));
      return new Response(
        JSON.stringify({ error: "Failed to save customer", detail: insertError.message }),
        { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Send checklist email with access code
    if (email) {
      await sendChecklistEmail(email, accessCode, tier, name);
    }

    return new Response(
      JSON.stringify({ access_code: accessCode, tier, email, name, selected_modules: [] }),
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe-verify] Fatal error:", message);
    return new Response(
      JSON.stringify({ error: "Verification failed", detail: message }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
