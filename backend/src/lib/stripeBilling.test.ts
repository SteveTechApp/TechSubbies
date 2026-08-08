import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StripeBillingProvider, verifyStripeWebhook } from "./stripeBilling.js";

beforeEach(() => {
  process.env.FRONTEND_ORIGIN = "https://app.techsubbies.test";
  process.env.STRIPE_PRICE_SILVER = "price_silver";
  process.env.STRIPE_PRICE_GOLD = "price_gold";
  process.env.STRIPE_PRICE_PLATINUM = "price_platinum";
});

describe("StripeBillingProvider", () => {
  it("creates a subscription Checkout session for the selected TechSubbies tier", async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.headers).toEqual(expect.objectContaining({
        Authorization: "Bearer sk_test_key",
        "Content-Type": "application/x-www-form-urlencoded",
      }));
      const body = new URLSearchParams(String(init?.body));
      expect(body.get("mode")).toBe("subscription");
      expect(body.get("line_items[0][price]")).toBe("price_gold");
      expect(body.get("client_reference_id")).toBe("engineer-1");
      expect(body.get("subscription_data[metadata][user_id]")).toBe("engineer-1");
      expect(body.get("subscription_data[metadata][membership_tier]")).toBe("Gold");
      expect(body.get("customer_email")).toBe("engineer@example.com");
      return new Response(JSON.stringify({ id: "cs_test_1", url: "https://checkout.stripe.test/1" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;

    const provider = new StripeBillingProvider({
      secretKey: "sk_test_key",
      webhookSecret: "whsec_test",
    }, fetchMock);

    await expect(provider.createCheckoutSession({
      userId: "engineer-1",
      email: "engineer@example.com",
      tier: "Gold",
    })).resolves.toEqual({ id: "cs_test_1", url: "https://checkout.stripe.test/1" });
  });

  it("creates a Customer Portal session for an existing Stripe customer", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toContain("/billing_portal/sessions");
      const body = new URLSearchParams(String(init?.body));
      expect(body.get("customer")).toBe("cus_123");
      return new Response(JSON.stringify({ id: "bps_1", url: "https://billing.stripe.test/portal" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;

    const provider = new StripeBillingProvider({ secretKey: "sk_test_key", webhookSecret: "whsec_test" }, fetchMock);
    await expect(provider.createPortalSession("cus_123")).resolves.toEqual({
      id: "bps_1",
      url: "https://billing.stripe.test/portal",
    });
  });
});

describe("Stripe webhook verification", () => {
  it("accepts the signed raw body and rejects stale or forged signatures", () => {
    const rawBody = Buffer.from(JSON.stringify({ id: "evt_1", type: "invoice.paid" }));
    const timestamp = 1_800_000_000;
    const secret = "whsec_secret";
    const signature = createHmac("sha256", secret)
      .update(`${timestamp}.${rawBody.toString("utf8")}`)
      .digest("hex");
    const header = `t=${timestamp},v1=${signature}`;

    expect(verifyStripeWebhook({
      rawBody,
      signatureHeader: header,
      webhookSecret: secret,
      nowSeconds: timestamp + 10,
    })).toBe(true);

    expect(verifyStripeWebhook({
      rawBody,
      signatureHeader: `t=${timestamp},v1=${"0".repeat(64)}`,
      webhookSecret: secret,
      nowSeconds: timestamp + 10,
    })).toBe(false);

    expect(verifyStripeWebhook({
      rawBody,
      signatureHeader: header,
      webhookSecret: secret,
      nowSeconds: timestamp + 600,
    })).toBe(false);
  });
});
