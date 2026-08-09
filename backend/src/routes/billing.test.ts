import { createHmac } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

const TEST_DB = path.join(process.cwd(), "data", "test-billing.db");
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_billing_test";
process.env.STRIPE_PRICE_SILVER = "price_silver";
process.env.STRIPE_PRICE_GOLD = "price_gold";
process.env.STRIPE_PRICE_PLATINUM = "price_platinum";

const { createApp } = await import("../app.js");
const { createUser, markEmailVerified } = await import("../lib/db.js");
const { signToken } = await import("../middleware/auth.js");
const app = createApp();

let engineerId: string;
let engineerToken: string;

beforeAll(() => {
  const engineer = createUser({
    email: "billing-engineer@example.com",
    password: "not-used",
    role: "Engineer",
    name: "Billing Engineer",
    profile: JSON.stringify({ profileTier: "Bronze", name: "Billing Engineer" }),
  });
  markEmailVerified(engineer.id);
  engineerId = engineer.id;
  engineerToken = signToken(engineer.id);
});

function signedWebhook(event: Record<string, unknown>) {
  const raw = JSON.stringify(event);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac("sha256", process.env.STRIPE_WEBHOOK_SECRET!)
    .update(`${timestamp}.${raw}`)
    .digest("hex");
  return request(app)
    .post("/api/billing/stripe/webhook")
    .set("Content-Type", "application/json")
    .set("Stripe-Signature", `t=${timestamp},v1=${signature}`)
    .send(raw);
}

describe("subscription billing reconciliation", () => {
  it("grants a paid tier, preserves it during retry, restores active after payment, then returns to Bronze when cancelled", async () => {
    const activeEvent = {
      id: "evt_subscription_active",
      type: "customer.subscription.updated",
      data: {
        object: {
          object: "subscription",
          id: "sub_123",
          customer: "cus_123",
          status: "active",
          current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
          cancel_at_period_end: false,
          metadata: { user_id: engineerId, membership_tier: "Gold" },
          items: { data: [{ price: { id: "price_gold" } }] },
        },
      },
    };

    const activated = await signedWebhook(activeEvent);
    expect(activated.status).toBe(200);

    const userAfterActivation = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${engineerToken}`);
    expect(userAfterActivation.body.profile.profileTier).toBe("Gold");
    expect(userAfterActivation.body.profile.membershipBillingStatus).toBe("active");

    const duplicate = await signedWebhook(activeEvent);
    expect(duplicate.status).toBe(200);
    expect(duplicate.body.duplicate).toBe(true);

    const failedInvoice = await signedWebhook({
      id: "evt_invoice_failed",
      type: "invoice.payment_failed",
      data: {
        object: {
          id: "in_failed",
          customer: "cus_123",
          subscription: "sub_123",
        },
      },
    });
    expect(failedInvoice.status).toBe(200);

    const billingPastDue = await request(app)
      .get("/api/billing/me")
      .set("Authorization", `Bearer ${engineerToken}`);
    expect(billingPastDue.body).toMatchObject({
      schemaVersion: 1,
      tier: "Gold",
      status: "past_due",
      paymentIssue: true,
    });

    const userPastDue = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${engineerToken}`);
    expect(userPastDue.body.profile.profileTier).toBe("Gold");

    const recoveredInvoice = await signedWebhook({
      id: "evt_invoice_paid",
      type: "invoice.paid",
      data: {
        object: {
          id: "in_paid",
          customer: "cus_123",
          subscription: "sub_123",
        },
      },
    });
    expect(recoveredInvoice.status).toBe(200);

    const billingRecovered = await request(app)
      .get("/api/billing/me")
      .set("Authorization", `Bearer ${engineerToken}`);
    expect(billingRecovered.body).toMatchObject({
      tier: "Gold",
      status: "active",
      paymentIssue: false,
    });

    const cancelled = await signedWebhook({
      id: "evt_subscription_cancelled",
      type: "customer.subscription.deleted",
      data: {
        object: {
          object: "subscription",
          id: "sub_123",
          customer: "cus_123",
          status: "canceled",
          current_period_end: Math.floor(Date.now() / 1000),
          cancel_at_period_end: false,
        },
      },
    });
    expect(cancelled.status).toBe(200);

    const userAfterCancellation = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${engineerToken}`);
    expect(userAfterCancellation.body.profile.profileTier).toBe("Bronze");
    expect(userAfterCancellation.body.profile.membershipBillingStatus).toBe("canceled");
  });

  it("rejects a forged Stripe webhook signature", async () => {
    const response = await request(app)
      .post("/api/billing/stripe/webhook")
      .set("Content-Type", "application/json")
      .set("Stripe-Signature", `t=${Math.floor(Date.now() / 1000)},v1=${"0".repeat(64)}`)
      .send(JSON.stringify({ id: "evt_forged", type: "invoice.paid", data: { object: {} } }));
    expect(response.status).toBe(401);
  });

  it("rejects signed webhook envelopes with primitive or missing provider objects", async () => {
    const primitive = await signedWebhook({ id: "evt_primitive", type: "invoice.paid", data: { object: "invoice" } });
    expect(primitive.status).toBe(400);
    const missing = await signedWebhook({ id: "evt_missing", type: "invoice.paid", data: {} });
    expect(missing.status).toBe(400);
  });

  it("falls back safely when Stripe sends an unknown subscription status", async () => {
    const response = await signedWebhook({
      id: "evt_unknown_status",
      type: "customer.subscription.updated",
      data: { object: { object: "subscription", id: "sub_unknown", customer: "cus_unknown", status: "future_status", metadata: { user_id: engineerId }, items: { data: [{ price: { id: "price_silver" } }] } } },
    });
    expect(response.status).toBe(200);
    const billing = await request(app).get("/api/billing/me").set("Authorization", `Bearer ${engineerToken}`);
    expect(billing.body.status).toBe("incomplete");
  });
});
