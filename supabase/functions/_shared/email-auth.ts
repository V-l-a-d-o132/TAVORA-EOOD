import type { SupabaseClient } from "npm:@supabase/supabase-js@2.57.4";
import { UUID } from "./academy-core.ts";
export async function authorizeEmail(
  req: Request,
  userId: unknown,
  client: SupabaseClient,
): Promise<Response | null> {
  const denied = (status: number) =>
    new Response(
      JSON.stringify({
        error: status === 400 ? "Invalid user" : "Unauthorized",
      }),
      {
        status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": req.headers.get("origin") ??
            "https://imashnujnoto.com",
          Vary: "Origin",
        },
      },
    );
  if (typeof userId !== "string" || !UUID.test(userId)) return denied(400);
  const token = req.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return denied(401);
  if (token === Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) return null;
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return denied(401);
  return data.user.id === userId ? null : denied(403);
}
