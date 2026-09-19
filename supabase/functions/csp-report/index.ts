import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Rate limiting — max 50 CSP reports per IP per minute (bots/scanners spam these)
const ipAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 50;
const WINDOW_MS = 60_000;

Deno.serve(async (req: Request) => {
  // CORS — allow all origins (CSP reports come from any page load)
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
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
    return new Response(null, { status: 429, headers: corsHeaders });
  }

  try {
    const body = await req.text();
    let report: any = null;
    
    try {
      report = JSON.parse(body);
    } catch {
      return new Response(null, { status: 400, headers: corsHeaders });
    }

    // Extract violation details
    const violation = report?.["csp-report"] || report;
    
    // Skip common false positives (browser extensions, etc.)
    const violatedDirective = violation?.["violated-directive"] || violation?.["effectiveDirective"] || "";
    const blockedUri = violation?.["blocked-uri"] || "";
    
    // Ignore browser extension reports
    if (blockedUri.startsWith("chrome-extension:") || 
        blockedUri.startsWith("moz-extension:") ||
        blockedUri.startsWith("safari-extension:") ||
        blockedUri === "about" ||
        blockedUri === "inline") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Log the violation
    const logEntry = {
      timestamp: new Date().toISOString(),
      ip,
      violated_directive: violatedDirective,
      blocked_uri: blockedUri,
      document_uri: violation?.["document-uri"] || "",
      referrer: violation?.referrer || "",
      source_file: violation?.["source-file"] || "",
      line_number: violation?.["line-number"] || 0,
      column_number: violation?.["column-number"] || 0,
    };

    // Log to console (Supabase stores function logs)
    console.log("[csp-report] VIOLATION:", JSON.stringify(logEntry));

    return new Response(null, { status: 204, headers: corsHeaders });
  } catch (err) {
    console.error("[csp-report] Error:", err);
    return new Response(null, { status: 500, headers: corsHeaders });
  }
});
