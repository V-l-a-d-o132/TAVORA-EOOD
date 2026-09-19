import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Rate limiting — 15 per IP per minute (allow legit module selections)
const ipAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 15;
const WINDOW_MS = 60_000;

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
    console.log("[update-modules] Received body:", JSON.stringify(body));
    const { access_code, selected_modules } = body;

    if (!access_code || !Array.isArray(selected_modules)) {
      console.error("[update-modules] Invalid body:", { access_code, selected_modules_type: typeof selected_modules });
      return new Response(JSON.stringify({ error: "Missing access_code or selected_modules" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Validate access_code format
    if (typeof access_code !== "string" || access_code.length < 4 || access_code.length > 64) {
      return new Response(JSON.stringify({ error: "Invalid access code format" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Validate selected_modules content
    if (selected_modules.some((m: unknown) => typeof m !== "number" || !Number.isInteger(m) || m < 1 || m > 20)) {
      return new Response(JSON.stringify({ error: "Invalid module selection" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Verify the code exists
    const { data: customer, error: lookupError } = await supabase
      .from("checklist_customers")
      .select("id, access_code, tier")
      .eq("access_code", access_code)
      .maybeSingle();

    console.log("[update-modules] Lookup result:", { customer, lookupError });

    if (lookupError || !customer) {
      return new Response(JSON.stringify({ error: "Invalid access code" }), {
        status: 404,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Enforce tier limits
    const tierLimits: Record<string, number> = { single: 1, bundle: 3, complete: 10 };
    const maxModules = tierLimits[customer.tier] || 1;
    if (selected_modules.length > maxModules) {
      return new Response(JSON.stringify({ error: `Your tier allows maximum ${maxModules} module(s)` }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    console.log("[update-modules] Updating customer:", customer.id, "with modules:", selected_modules);
    const { error: updateError } = await supabase
      .from("checklist_customers")
      .update({ selected_modules })
      .eq("access_code", access_code);

    console.log("[update-modules] Update result:", { updateError });

    if (updateError) {
      return new Response(JSON.stringify({ error: "Failed to update modules", detail: updateError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("[update-modules] Exception:", err);
    return new Response(JSON.stringify({ error: "Update failed", detail: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
