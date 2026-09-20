import { describe, expect, it, vi } from "vitest";
import Stripe from "stripe";
import { createWebhookHandler } from "../supabase/functions/_shared/academy-webhook-handler";

const stripe = new Stripe("sk_test_fixture_no_network");
const secret = "whsec_fixture_not_a_real_secret";
function setup() {
  const rpc = vi.fn(async () => ({ error: null }));
  const upsert = vi.fn(async () => ({ error: null }));
  const fulfill = vi.fn(async () => ({})),
    deliverOutbox = vi.fn(async () => {});
  const deps = {
    stripe,
    live: false,
    json: (data: unknown, status = 200) => Response.json(data, { status }),
    db: { rpc, from: () => ({ upsert }) },
    fulfill,
    deliverOutbox,
  };
  return {
    ...deps,
    rpc,
    upsert,
    handler: createWebhookHandler(deps as never, secret),
  };
}
function request(type: string, object: unknown, extra = {}) {
  const body = JSON.stringify({
    id: "evt_test",
    created: 100,
    livemode: false,
    type,
    data: { object },
    ...extra,
  });
  return new Request("https://example.invalid/webhook", {
    method: "POST",
    body,
    headers: {
      "stripe-signature": stripe.webhooks.generateTestHeaderString({
        payload: body,
        secret,
      }),
    },
  });
}
describe("signed webhook HTTP handler", () => {
  it("accepts signed Checkout without a Supabase JWT", async () => {
    const s = setup();
    const response = await s.handler(
      request("checkout.session.completed", {
        id: "cs_test_sample",
        metadata: { source: "academy-v2" },
        payment_status: "paid",
      }),
    );
    expect(response.status).toBe(200);
    expect(s.fulfill).toHaveBeenCalledWith(
      "cs_test_sample",
      undefined,
      "evt_test",
    );
    expect(s.deliverOutbox).toHaveBeenCalledWith("cs_test_sample");
  });
  it("rejects missing signature before all processing", async () => {
    const s = setup();
    expect(
      (await s.handler(
        new Request("https://example.invalid", { method: "POST", body: "{}" }),
      )).status,
    ).toBe(400);
    expect(s.fulfill).not.toHaveBeenCalled();
    expect(s.rpc).not.toHaveBeenCalled();
  });
  it("rejects a valid signature from the wrong payment environment", async () => {
    const s = setup();
    expect(
      (await s.handler(
        request("checkout.session.completed", {}, { livemode: true }),
      )).status,
    ).toBe(400);
    expect(s.fulfill).not.toHaveBeenCalled();
  });
  it("does not grant access until an asynchronous payment succeeds", async () => {
    const s = setup();
    await s.handler(
      request("checkout.session.completed", {
        id: "cs_test_async",
        metadata: { source: "academy-v2" },
        payment_status: "unpaid",
      }),
    );
    expect(s.fulfill).not.toHaveBeenCalled();
    await s.handler(
      request("checkout.session.async_payment_succeeded", {
        id: "cs_test_async",
        metadata: { source: "academy-v2" },
        payment_status: "paid",
      }),
    );
    expect(s.fulfill).toHaveBeenCalledOnce();
  });
  it("records asynchronous failure without granting access", async () => {
    const s = setup();
    await s.handler(request("checkout.session.async_payment_failed", {}));
    expect(s.upsert).toHaveBeenCalledOnce();
    expect(s.fulfill).not.toHaveBeenCalled();
  });
  it.each([
    [
      "charge.refunded",
      { payment_intent: "pi_refund", amount_refunded: 4900 },
      { p_refunded_cents: 4900 },
    ],
    ["charge.dispute.created", {
      payment_intent: "pi_refund",
      status: "needs_response",
    }, { p_dispute_status: "needs_response" }],
    ["charge.dispute.closed", { payment_intent: "pi_refund", status: "lost" }, {
      p_dispute_status: "lost",
    }],
  ])(
    "handles %s through the atomic adjustment ledger",
    async (type, object, expected) => {
      const s = setup();
      expect((await s.handler(request(type as string, object))).status).toBe(
        200,
      );
      expect(s.rpc).toHaveBeenCalledWith(
        "academy_apply_adjustment",
        expect.objectContaining({
          p_event_id: "evt_test",
          p_payment_intent: "pi_refund",
          ...expected as object,
        }),
      );
    },
  );
  it("returns 500 so Stripe retries if either the ledger or side effects fail", async () => {
    const s = setup();
    s.deliverOutbox.mockRejectedValue(Error("pending"));
    expect(
      (await s.handler(
        request("checkout.session.completed", {
          id: "cs_test_sample",
          metadata: { source: "academy-v2" },
          payment_status: "paid",
        }),
      )).status,
    ).toBe(500);
  });
});
