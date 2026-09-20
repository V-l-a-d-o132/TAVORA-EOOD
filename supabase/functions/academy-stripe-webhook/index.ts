import * as runtime from "../_shared/academy-runtime.ts";
import { createWebhookHandler } from "../_shared/academy-webhook-handler.ts";
Deno.serve(
  createWebhookHandler(runtime, Deno.env.get("STRIPE_WEBHOOK_SECRET")!),
);
