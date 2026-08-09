import { createHmac, timingSafeEqual } from "node:crypto";
import { frontendOrigin } from "./config.js";
import { stripePriceForPaidTier, type MembershipTier } from "./billingRepository.js";

export type StripeBillingConfig = {
  secretKey: string;
  webhookSecret: string;
};

export type CheckoutSession = {
  id: string;
  url: string;
};

export type PortalSession = {
  id: string;
  url: string;
};

type StripeApiResponse = Record<string, unknown> & {
  error?: { message?: string };
};

export class StripeBillingProvider {
  readonly name = "stripe" as const;

  constructor(
    private readonly config: StripeBillingConfig,
    private readonly fetchImplementation: typeof fetch = globalThis.fetch
  ) {}

  private async post(path: string, body: URLSearchParams) {
    const response = await this.fetchImplementation(`https://api.stripe.com/v1${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    const data = await response.json() as StripeApiResponse;
    if (!response.ok) {
      throw new Error(data.error?.message || `Stripe request failed with status ${response.status}.`);
    }
    return data;
  }

  async createCheckoutSession(input: {
    userId: string;
    email: string;
    tier: MembershipTier;
    customerId?: string | null;
  }): Promise<CheckoutSession> {
    const priceId = stripePriceForPaidTier(input.tier);
    if (!priceId) throw new Error("STRIPE_PRICE_NOT_CONFIGURED");
    const origin = frontendOrigin();
    const body = new URLSearchParams({
      mode: "subscription",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      client_reference_id: input.userId,
      "metadata[user_id]": input.userId,
      "metadata[membership_tier]": input.tier,
      "subscription_data[metadata][user_id]": input.userId,
      "subscription_data[metadata][membership_tier]": input.tier,
      success_url: `${origin}/?billing=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?billing=cancelled`,
      allow_promotion_codes: "true",
    });
    if (input.customerId) body.set("customer", input.customerId);
    else body.set("customer_email", input.email);

    const data = await this.post("/checkout/sessions", body);
    if (typeof data.id !== "string" || typeof data.url !== "string") {
      throw new Error("Stripe Checkout did not return a session URL.");
    }
    return { id: data.id, url: data.url };
  }

  async createPortalSession(customerId: string): Promise<PortalSession> {
    const origin = frontendOrigin();
    const data = await this.post("/billing_portal/sessions", new URLSearchParams({
      customer: customerId,
      return_url: `${origin}/?billing=portal-return`,
    }));
    if (typeof data.id !== "string" || typeof data.url !== "string") {
      throw new Error("Stripe Billing Portal did not return a session URL.");
    }
    return { id: data.id, url: data.url };
  }
}

export function createStripeBillingProvider(env: NodeJS.ProcessEnv = process.env) {
  return new StripeBillingProvider({
    secretKey: env.STRIPE_SECRET_KEY?.trim() || "",
    webhookSecret: env.STRIPE_WEBHOOK_SECRET?.trim() || "",
  });
}

export function verifyStripeWebhook(input: {
  rawBody: Buffer;
  signatureHeader: string;
  webhookSecret: string;
  nowSeconds?: number;
  toleranceSeconds?: number;
}): boolean {
  const values = input.signatureHeader.split(",").map((part) => part.trim());
  const timestamp = values.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = values.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));
  if (!timestamp || signatures.length === 0 || !/^\d+$/.test(timestamp) || !input.webhookSecret) return false;

  const now = input.nowSeconds ?? Math.floor(Date.now() / 1000);
  const tolerance = input.toleranceSeconds ?? 300;
  if (Math.abs(now - Number(timestamp)) > tolerance) return false;

  const expected = createHmac("sha256", input.webhookSecret)
    .update(`${timestamp}.${input.rawBody.toString("utf8")}`)
    .digest("hex");
  const expectedBytes = Buffer.from(expected);

  return signatures.some((signature) => {
    if (!/^[0-9a-f]{64}$/i.test(signature)) return false;
    const signatureBytes = Buffer.from(signature);
    return signatureBytes.length === expectedBytes.length
      && timingSafeEqual(signatureBytes, expectedBytes);
  });
}
