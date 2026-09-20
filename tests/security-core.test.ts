import { afterEach, describe, expect, it, vi } from "vitest";
import Stripe from "stripe";
import {
  AMOUNTS,
  type CheckoutSession,
  type PriceConfig,
  requireOwner,
  trustedOrigin,
  validateSession,
} from "../supabase/functions/_shared/academy-core";
import { safeRedirect } from "../src/lib/auth-redirect";
import { authorizeEmail } from "../supabase/functions/_shared/email-auth";
import { assertClientAnalyticsEvent } from "../supabase/functions/_shared/analytics-policy";

describe("public analytics purchase boundary", () => {
  it("rejects client Academy purchases while preserving ordinary analytics", () => {
    expect(() => assertClientAnalyticsEvent("1742675203594120", "Purchase"))
      .toThrow("verified purchase");
    expect(() => assertClientAnalyticsEvent("1742675203594120", "PageView")).not
      .toThrow();
  });
  it("rejects numeric and noncanonical pixel IDs that could bypass that boundary", () => {
    for (
      const pixel of [
        1742675203594120,
        "01742675203594120",
        "%311742675203594120",
        "../1742675203594120",
      ]
    ) {
      expect(() => assertClientAnalyticsEvent(pixel, "Purchase")).toThrow(
        "Invalid",
      );
    }
  });
});

const uid = "00000000-0000-4000-8000-000000000001";
const cfg: PriceConfig = {
  price_id: "price_test",
  tier_id: "systems-10",
  amount_cents: 4900,
  currency: "eur",
  livemode: false,
  historical: false,
};
const session: CheckoutSession = {
  id: "cs_test_fixture",
  mode: "payment",
  payment_status: "paid",
  currency: "eur",
  amount_total: 4900,
  livemode: false,
  client_reference_id: uid,
  metadata: { user_id: uid, tier: "systems-10", source: "academy-v2" },
  payment_intent: "pi_fixture",
  line_items: { data: [{ quantity: 1, price: { id: "price_test" } }] },
};
afterEach(() => vi.unstubAllGlobals());
describe("payment trust boundary", () => {
  it.each(Object.entries(AMOUNTS))(
    "validates exact %s entitlement at %i cents",
    (tier, amount) => {
      expect(
        validateSession(
          {
            ...session,
            metadata: { ...session.metadata, tier },
            amount_total: amount,
          },
          { ...cfg, tier_id: tier, amount_cents: amount },
          false,
          uid,
        ),
      ).toMatchObject({ tier, user_id: uid, amount_total: amount });
    },
  );
  it.each([
    { payment_status: "unpaid" },
    { mode: "subscription" },
    { livemode: true },
    { amount_total: 1 },
    { currency: "usd" },
    { metadata: { ...session.metadata, tier: "premium-all" } },
    { metadata: { ...session.metadata, source: "untrusted" } },
    { client_reference_id: "00000000-0000-4000-8000-000000000002" },
    { client_reference_id: null },
    { payment_intent: null },
    { line_items: { data: [{ quantity: 1, price: { id: "wrong" } }] } },
    { line_items: { data: [{ quantity: 2, price: { id: "price_test" } }] } },
  ])(
    "rejects malformed session %j",
    (change) =>
      expect(() => validateSession({ ...session, ...change }, cfg, false, uid))
        .toThrow(),
  );
  it("rejects a stolen session ID before granting access", () =>
    expect(() => requireOwner(session, "00000000-0000-4000-8000-000000000002"))
      .toThrow("another account"));
  it("accepts only allowlisted production, staging and test localhost origins", () => {
    expect(trustedOrigin("https://imashnujnoto.com", "", true)).toBe(
      "https://imashnujnoto.com",
    );
    expect(
      trustedOrigin(
        "https://stage.example.com",
        "https://stage.example.com",
        true,
      ),
    ).toBe("https://stage.example.com");
    expect(trustedOrigin("http://localhost:5173", "", false)).toBe(
      "http://localhost:5173",
    );
    for (
      const o of [
        null,
        "https://evil.example",
        "https://imashnujnoto.com.evil.example",
        "http://localhost:5173",
      ]
    ) {
      expect(() => trustedOrigin(o, "", true)).toThrow();
    }
  });
  it("verifies real Stripe HMACs and rejects tampering and missing signatures", async () => {
    const stripe = new Stripe("sk_test_fixture_no_network");
    const body = JSON.stringify({
      id: "evt_fixture",
      type: "checkout.session.completed",
      data: { object: session },
    });
    const secret = "whsec_fixture_not_a_real_secret";
    const signature = stripe.webhooks.generateTestHeaderString({
      payload: body,
      secret,
    });
    expect(
      (await stripe.webhooks.constructEventAsync(body, signature, secret)).id,
    ).toBe("evt_fixture");
    await expect(
      stripe.webhooks.constructEventAsync(body + " ", signature, secret),
    ).rejects.toThrow();
    await expect(stripe.webhooks.constructEventAsync(body, "", secret)).rejects
      .toThrow();
  });
});
describe("auth redirects", () => {
  it.each([
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/\nevil.example",
    "javascript:alert(1)",
  ])("rejects %j", (input) => expect(safeRedirect(input)).toBe("/kurs"));
  it("retains an internal lesson and query", () =>
    expect(safeRedirect("/module/s01-m02?lesson=2")).toBe(
      "/module/s01-m02?lesson=2",
    ));
});
describe("email ownership", () => {
  it("requires own JWT or an exact trusted server credential", async () => {
    vi.stubGlobal("Deno", { env: { get: () => "server-fixture-only" } });
    const client = {
      auth: {
        getUser: vi.fn(async (token: string) => ({
          data: { user: token === "own" ? { id: uid } : null },
          error: token === "own" ? null : Error("bad"),
        })),
      },
    };
    const request = (token?: string) =>
      new Request("https://api.invalid", {
        headers: token ? { authorization: "Bearer " + token } : {},
      });
    expect((await authorizeEmail(request(), uid, client as never))?.status)
      .toBe(401);
    expect(
      (await authorizeEmail(
        request("own"),
        "00000000-0000-4000-8000-000000000002",
        client as never,
      ))?.status,
    ).toBe(403);
    expect(await authorizeEmail(request("own"), uid, client as never))
      .toBeNull();
    expect(
      await authorizeEmail(
        request("server-fixture-only"),
        uid,
        client as never,
      ),
    ).toBeNull();
  });
});
