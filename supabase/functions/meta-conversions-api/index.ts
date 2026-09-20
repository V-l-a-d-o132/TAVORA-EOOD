import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import { assertClientAnalyticsEvent } from "../_shared/analytics-policy.ts";
import { HttpError } from "../_shared/academy-core.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const CAPI_VERSION = "v18.0";

interface CapiEventPayload {
  pixel_id: string;
  event_name: string;
  event_time?: number;
  event_id?: string;
  user_data?: {
    em?: string;
    ph?: string;
    fn?: string;
    ln?: string;
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string;
    fbp?: string;
  };
  custom_data?: Record<string, unknown>;
  action_source?: string;
  event_source_url?: string;
}

function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input.trim().toLowerCase());
  return crypto.subtle.digest("SHA-256", data).then((buf) => {
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  });
}

async function hashEmail(email?: string): Promise<string | undefined> {
  if (!email) return undefined;
  return await sha256(email);
}

async function sendCapiEvent(payload: CapiEventPayload, accessToken: string) {
  const eventTime = payload.event_time || Math.floor(Date.now() / 1000);
  const eventId = payload.event_id || crypto.randomUUID();

  const hashedEmail = await hashEmail(payload.user_data?.em);

  const userData: Record<string, unknown> = {};
  if (hashedEmail) userData.em = [hashedEmail];
  if (payload.user_data?.ph) userData.ph = [await sha256(payload.user_data.ph)];
  if (payload.user_data?.fn) userData.fn = [await sha256(payload.user_data.fn)];
  if (payload.user_data?.ln) userData.ln = [await sha256(payload.user_data.ln)];
  if (payload.user_data?.client_ip_address) userData.client_ip_address = payload.user_data.client_ip_address;
  if (payload.user_data?.client_user_agent) userData.client_user_agent = payload.user_data.client_user_agent;
  if (payload.user_data?.fbc) userData.fbc = payload.user_data.fbc;
  if (payload.user_data?.fbp) userData.fbp = payload.user_data.fbp;

  const body = {
    data: [
      {
        event_name: payload.event_name,
        event_time: eventTime,
        event_id: eventId,
        action_source: payload.action_source || "website",
        event_source_url: payload.event_source_url || undefined,
        user_data: userData,
        custom_data: payload.custom_data || {},
      },
    ],
  };

  const url = `https://graph.facebook.com/${CAPI_VERSION}/${payload.pixel_id}/events?access_token=${accessToken}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const responseText = await response.text();
  let responseJson: any = null;
  try {
    responseJson = JSON.parse(responseText);
  } catch {
    /* not JSON */
  }

  return {
    status: response.status,
    ok: response.ok,
    body: responseJson || responseText,
    event_id: eventId,
  };
}

async function logToDb(
  eventName: string,
  eventId: string,
  stripeSessionId: string | undefined,
  customerEmail: string | undefined,
  amount: number | undefined,
  responseStatus: number,
  responseBody: unknown
) {
  try {
    await supabase.from("meta_capi_logs").insert({
      event_name: eventName,
      event_id: eventId,
      stripe_session_id: stripeSessionId || null,
      customer_email: customerEmail || null,
      amount: amount || null,
      response_status: responseStatus,
      response_body: responseBody,
    });
  } catch (err) {
    console.error("[meta-capi] DB log error:", err);
  }
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

  try {
    const payload: CapiEventPayload = await req.json();
    assertClientAnalyticsEvent(payload.pixel_id, payload.event_name);

    // Auto-extract client IP from request headers if not provided by caller
    if (!payload.user_data?.client_ip_address) {
      const fwdFor = req.headers.get("x-forwarded-for");
      if (fwdFor) {
        const ip = fwdFor.split(",")[0].trim();
        if (!payload.user_data) payload.user_data = {};
        payload.user_data.client_ip_address = ip;
      }
    }

    const accessToken = Deno.env.get("META_CAPI_ACCESS_TOKEN");

    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "META_CAPI_ACCESS_TOKEN not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!payload.pixel_id || !payload.event_name) {
      return new Response(
        JSON.stringify({ error: "Missing pixel_id or event_name" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await sendCapiEvent(payload, accessToken);

    logToDb(
      payload.event_name,
      result.event_id,
      (payload.custom_data?.stripe_session_id as string) || undefined,
      payload.user_data?.em,
      payload.custom_data?.value as number | undefined,
      result.status,
      result.body
    );

    return new Response(
      JSON.stringify({
        success: result.ok,
        event_id: result.event_id,
        meta_response: result.body,
      }),
      {
        status: result.ok ? 200 : 502,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (err) {
    if (err instanceof HttpError) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: err.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
    const message = err instanceof Error ? err.message : String(err);
    console.error("[meta-capi] Fatal error:", message);
    return new Response(
      JSON.stringify({ error: "CAPI send failed", detail: message }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
