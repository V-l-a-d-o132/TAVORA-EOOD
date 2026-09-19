import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Rate limiting — simple in-memory map (resets on cold start, good enough)
const ipAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 60_000; // 1 minute

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    // Rate limiting by IP
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    const now = Date.now();
    let record = ipAttempts.get(ip);
    
    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + WINDOW_MS };
      ipAttempts.set(ip, record);
    }
    
    record.count++;
    if (record.count > MAX_ATTEMPTS) {
      return new Response(JSON.stringify({ error: "Too many attempts. Please try again later." }), {
        status: 429,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const body = await req.json();
    const accessCode = (body.access_code || "").trim();

    if (!accessCode || accessCode.length < 4 || accessCode.length > 64) {
      return new Response(JSON.stringify({ error: "Invalid access code format." }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const { data: customer, error: dbError } = await supabase
      .from("checklist_customers")
      .select("name, tier, selected_modules, is_active")
      .eq("access_code", accessCode)
      .maybeSingle();

    if (dbError || !customer) {
      // Intentionally vague — don't reveal if code exists
      return new Response(JSON.stringify({ error: "Invalid access code." }), {
        status: 403,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (!customer.is_active) {
      return new Response(JSON.stringify({ error: "Access is deactivated." }), {
        status: 403,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Only return minimal info — name, tier, modules. NEVER return email or access_code
    return new Response(JSON.stringify({
      name: customer.name,
      tier: customer.tier || "single",
      selected_modules: customer.selected_modules || [],
    }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err) {
    console.error("[customer-lookup] Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
