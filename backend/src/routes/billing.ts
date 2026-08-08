import { Router, raw } from "express";
import { z } from "zod";
import { requireAuth, requireRole, type AuthedRequest } from "../middleware/auth.js";
import { findUserById } from "../lib/db.js";
import { recordAccountAudit } from "../lib/accountAudit.js";
import { sendEmail } from "../lib/email.js";
import {
  findBillingByCustomerId,
  findBillingBySubscriptionId,
  getBillingState,
  linkCheckoutToUser,
  paidTierForStripePrice,
  recordBillingWebhookEvent,
  recordInvoicePaid,
  recordInvoicePaymentFailure,
  reconcileSubscription,
  type BillingStatus,
  type MembershipTier,
} from "../lib/billingRepository.js";
import { createStripeBillingProvider, verifyStripeWebhook } from "../lib/stripeBilling.js";

const paidTierSchema = z.enum(["Silver", "Gold", "Platinum"]);

function publicBillingState(userId: string) {
  const state = getBillingState(userId);
  return {
    tier: state.tier,
    status: state.status,
    currentPeriodEnd: state.currentPeriodEnd,
    cancelAtPeriodEnd: state.cancelAtPeriodEnd === 1,
    hasCustomer: Boolean(state.customerId),
    hasSubscription: Boolean(state.subscriptionId),
    paymentIssue: Boolean(state.lastPaymentFailedAt),
    lastPaymentFailedAt: state.lastPaymentFailedAt,
  };
}

export const billingRouter = Router();
billingRouter.use(requireAuth, requireRole("Engineer"));

billingRouter.get("/me", (req: AuthedRequest, res) => {
  return res.json(publicBillingState(req.userId!));
});

billingRouter.post("/checkout", async (req: AuthedRequest, res) => {
  const parsed = z.object({ tier: paidTierSchema }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Choose Silver, Gold or Platinum." });

  const existing = getBillingState(req.userId!);
  if (existing.subscriptionId && !["canceled", "unpaid", "incomplete_expired", "free"].includes(existing.status)) {
    return res.status(409).json({
      error: "An existing paid membership must be changed through Billing Management.",
      code: "MANAGE_EXISTING_SUBSCRIPTION",
    });
  }

  try {
    const session = await createStripeBillingProvider().createCheckoutSession({
      userId: req.userId!,
      email: req.authUser!.email,
      tier: parsed.data.tier,
      customerId: existing.customerId,
    });
    recordAccountAudit({
      eventType: "membership.checkout_created",
      outcome: "success",
      userId: req.userId!,
      requestId: res.locals.requestId,
    });
    return res.json({ url: session.url });
  } catch (error) {
    console.error("Could not create Stripe Checkout session", error);
    return res.status(502).json({ error: "Membership checkout is temporarily unavailable." });
  }
});

billingRouter.post("/portal", async (req: AuthedRequest, res) => {
  const state = getBillingState(req.userId!);
  if (!state.customerId) {
    return res.status(404).json({ error: "No paid membership billing account exists yet." });
  }
  try {
    const session = await createStripeBillingProvider().createPortalSession(state.customerId);
    return res.json({ url: session.url });
  } catch (error) {
    console.error("Could not create Stripe Billing Portal session", error);
    return res.status(502).json({ error: "Billing management is temporarily unavailable." });
  }
});

type StripeEvent = {
  id?: string;
  type?: string;
  data?: { object?: any };
};

function stripeId(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && typeof (value as { id?: unknown }).id === "string") {
    return (value as { id: string }).id;
  }
  return null;
}

function userIdForStripeObject(object: any): string | null {
  if (typeof object?.metadata?.user_id === "string" && object.metadata.user_id) return object.metadata.user_id;
  const subscriptionId = stripeId(object?.subscription) || (typeof object?.id === "string" && object?.object === "subscription" ? object.id : null);
  if (subscriptionId) {
    const state = findBillingBySubscriptionId(subscriptionId);
    if (state) return state.userId;
  }
  const customerId = stripeId(object?.customer);
  if (customerId) {
    const state = findBillingByCustomerId(customerId);
    if (state) return state.userId;
  }
  return null;
}

function timestampToIso(value: unknown): string | null {
  return typeof value === "number" && Number.isFinite(value)
    ? new Date(value * 1000).toISOString()
    : null;
}

async function notifyPaymentFailure(userId: string) {
  const user = findUserById(userId);
  if (!user) return false;
  try {
    await sendEmail({
      to: user.email,
      subject: "TechSubbies membership payment needs attention",
      text: "We could not renew your TechSubbies membership. Your paid features remain available while Stripe retries the payment. Open Membership & Billing to update your payment method.",
    });
    return true;
  } catch {
    return false;
  }
}

export const stripeBillingWebhookRouter = Router();
stripeBillingWebhookRouter.post("/", raw({ type: "application/json", limit: "1mb" }), async (req, res) => {
  if (!Buffer.isBuffer(req.body)) return res.status(400).send("Invalid Stripe webhook body");
  const signatureHeader = String(req.headers["stripe-signature"] || "");
  if (!verifyStripeWebhook({
    rawBody: req.body,
    signatureHeader,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  })) {
    return res.status(401).send("Invalid Stripe webhook signature");
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(req.body.toString("utf8")) as StripeEvent;
  } catch {
    return res.status(400).send("Invalid Stripe webhook JSON");
  }
  if (!event.id || !event.type || !event.data?.object) {
    return res.status(400).send("Invalid Stripe webhook event");
  }
  if (!recordBillingWebhookEvent(event.id, event.type)) {
    return res.status(200).json({ received: true, duplicate: true });
  }

  const object = event.data.object;

  if (event.type === "checkout.session.completed" && object.mode === "subscription") {
    const userId = typeof object.client_reference_id === "string"
      ? object.client_reference_id
      : typeof object.metadata?.user_id === "string" ? object.metadata.user_id : null;
    const customerId = stripeId(object.customer);
    const subscriptionId = stripeId(object.subscription);
    if (userId && customerId && subscriptionId) {
      linkCheckoutToUser({ userId, customerId, subscriptionId });
      recordAccountAudit({
        eventType: "membership.checkout_completed",
        outcome: "success",
        userId,
        requestId: res.locals.requestId,
      });
    }
  }

  if (["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
    const userId = userIdForStripeObject(object);
    const customerId = stripeId(object.customer);
    const subscriptionId = stripeId(object.id);
    const priceId = stripeId(object.items?.data?.[0]?.price);
    const tier = priceId ? paidTierForStripePrice(priceId) : null;
    const status = String(object.status || (event.type.endsWith("deleted") ? "canceled" : "incomplete")) as BillingStatus;
    if (userId && customerId && subscriptionId && priceId && tier) {
      const state = reconcileSubscription({
        userId,
        customerId,
        subscriptionId,
        priceId,
        tier: tier as MembershipTier,
        status,
        currentPeriodEnd: timestampToIso(object.current_period_end),
        cancelAtPeriodEnd: object.cancel_at_period_end === true,
      });
      recordAccountAudit({
        eventType: `membership.subscription_${state.status}`,
        outcome: "success",
        userId,
        requestId: res.locals.requestId,
      });
    }
  }

  if (event.type === "invoice.payment_failed") {
    const userId = userIdForStripeObject(object);
    if (userId && typeof object.id === "string") {
      recordInvoicePaymentFailure({ userId, invoiceId: object.id });
      await notifyPaymentFailure(userId);
      recordAccountAudit({
        eventType: "membership.payment_failed",
        outcome: "failed",
        userId,
        requestId: res.locals.requestId,
      });
    }
  }

  if (event.type === "invoice.paid") {
    const userId = userIdForStripeObject(object);
    if (userId && typeof object.id === "string") {
      recordInvoicePaid({ userId, invoiceId: object.id });
      recordAccountAudit({
        eventType: "membership.invoice_paid",
        outcome: "success",
        userId,
        requestId: res.locals.requestId,
      });
    }
  }

  return res.status(200).json({ received: true });
});
