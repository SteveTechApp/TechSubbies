import { database, db, findUserById, updateUserProfile } from "./db.js";

export type MembershipTier = "Bronze" | "Silver" | "Gold" | "Platinum";
export type BillingStatus =
  | "free"
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "unpaid"
  | "canceled"
  | "paused";

export type BillingState = {
  userId: string;
  provider: string;
  customerId: string | null;
  subscriptionId: string | null;
  priceId: string | null;
  tier: MembershipTier;
  status: BillingStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: number;
  lastInvoiceId: string | null;
  lastPaymentFailedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminBillingAccount = BillingState & {
  name: string;
  email: string;
};

export type BillingSummary = {
  paidAccounts: number;
  active: number;
  trialing: number;
  pastDue: number;
  endingAtPeriodEnd: number;
  ended: number;
};

db.exec(`
  CREATE TABLE IF NOT EXISTS subscription_billing (
    userId TEXT PRIMARY KEY,
    provider TEXT NOT NULL,
    customerId TEXT UNIQUE,
    subscriptionId TEXT UNIQUE,
    priceId TEXT,
    tier TEXT NOT NULL,
    status TEXT NOT NULL,
    currentPeriodEnd TEXT,
    cancelAtPeriodEnd INTEGER NOT NULL DEFAULT 0,
    lastInvoiceId TEXT,
    lastPaymentFailedAt TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS subscription_billing_customer
    ON subscription_billing(customerId);
  CREATE INDEX IF NOT EXISTS subscription_billing_subscription
    ON subscription_billing(subscriptionId);

  CREATE TABLE IF NOT EXISTS billing_webhook_events (
    eventId TEXT PRIMARY KEY,
    eventType TEXT NOT NULL,
    receivedAt TEXT NOT NULL
  );
`);

function defaultState(userId: string): BillingState {
  const now = new Date().toISOString();
  return {
    userId,
    provider: "stripe",
    customerId: null,
    subscriptionId: null,
    priceId: null,
    tier: "Bronze",
    status: "free",
    currentPeriodEnd: null,
    cancelAtPeriodEnd: 0,
    lastInvoiceId: null,
    lastPaymentFailedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

export async function checkBillingRepository(): Promise<boolean> {
  const tables = await Promise.all([
    database.tableExists("subscription_billing"),
    database.tableExists("billing_webhook_events"),
  ]);
  return tables.every(Boolean);
}

export async function getBillingState(userId: string): Promise<BillingState> {
  const row = await database.queryOne<BillingState>("SELECT * FROM subscription_billing WHERE userId = ?", [userId]);
  return row || defaultState(userId);
}

export function findBillingByCustomerId(customerId: string): Promise<BillingState | undefined> {
  return database.queryOne<BillingState>("SELECT * FROM subscription_billing WHERE customerId = ?", [customerId]);
}

export function findBillingBySubscriptionId(subscriptionId: string): Promise<BillingState | undefined> {
  return database.queryOne<BillingState>("SELECT * FROM subscription_billing WHERE subscriptionId = ?", [subscriptionId]);
}

export async function recordBillingWebhookEvent(eventId: string, eventType: string): Promise<boolean> {
  try {
    await database.execute(`
      INSERT INTO billing_webhook_events (eventId, eventType, receivedAt)
      VALUES (?, ?, ?)
    `, [eventId, eventType, new Date().toISOString()]);
    return true;
  } catch (error) {
    if (error instanceof Error && /UNIQUE constraint failed/.test(error.message)) return false;
    throw error;
  }
}

export async function linkCheckoutToUser(input: {
  userId: string;
  customerId: string;
  subscriptionId: string;
}) {
  const existing = await getBillingState(input.userId);
  const now = new Date().toISOString();
  await database.execute(`
    INSERT INTO subscription_billing (
      userId, provider, customerId, subscriptionId, priceId, tier, status,
      currentPeriodEnd, cancelAtPeriodEnd, lastInvoiceId, lastPaymentFailedAt,
      createdAt, updatedAt
    ) VALUES (?, 'stripe', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(userId) DO UPDATE SET
      customerId = excluded.customerId,
      subscriptionId = excluded.subscriptionId,
      updatedAt = excluded.updatedAt
  `, [input.userId, input.customerId, input.subscriptionId, existing.priceId,
    existing.tier, existing.status, existing.currentPeriodEnd, existing.cancelAtPeriodEnd,
    existing.lastInvoiceId, existing.lastPaymentFailedAt, existing.createdAt, now]);
  return getBillingState(input.userId);
}

function entitlementTier(tier: MembershipTier, status: BillingStatus): MembershipTier {
  return ["active", "trialing", "past_due"].includes(status) ? tier : "Bronze";
}

function syncProfileEntitlement(userId: string, state: BillingState) {
  const user = findUserById(userId);
  if (!user || user.role !== "Engineer" || user.deletedAt) return;
  let profile: Record<string, unknown> = {};
  try {
    profile = JSON.parse(user.profile) as Record<string, unknown>;
  } catch {
    profile = {};
  }

  const nextTier = entitlementTier(state.tier, state.status);
  const previousTier = typeof profile.profileTier === "string" ? profile.profileTier : "Bronze";
  profile.profileTier = nextTier;
  profile.membershipBillingStatus = state.status;
  profile.membershipRenewalAt = state.currentPeriodEnd;
  profile.membershipCancelAtPeriodEnd = state.cancelAtPeriodEnd === 1;
  if (nextTier !== "Bronze" && previousTier === "Bronze") {
    profile.membershipActivatedAt = new Date().toISOString();
  }
  if (nextTier === "Bronze" && previousTier !== "Bronze") {
    profile.membershipEndedAt = new Date().toISOString();
  }
  delete profile.requestedProfileTier;
  delete profile.membershipRequestedAt;
  delete profile.membershipActivatedBy;
  updateUserProfile(user.id, JSON.stringify(profile), user.name);
}

export async function reconcileSubscription(input: {
  userId: string;
  customerId: string;
  subscriptionId: string;
  priceId: string;
  tier: MembershipTier;
  status: BillingStatus;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
}) {
  const existing = await getBillingState(input.userId);
  const now = new Date().toISOString();
  await database.execute(`
    INSERT INTO subscription_billing (
      userId, provider, customerId, subscriptionId, priceId, tier, status,
      currentPeriodEnd, cancelAtPeriodEnd, lastInvoiceId, lastPaymentFailedAt,
      createdAt, updatedAt
    ) VALUES (?, 'stripe', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(userId) DO UPDATE SET
      provider = 'stripe',
      customerId = excluded.customerId,
      subscriptionId = excluded.subscriptionId,
      priceId = excluded.priceId,
      tier = excluded.tier,
      status = excluded.status,
      currentPeriodEnd = excluded.currentPeriodEnd,
      cancelAtPeriodEnd = excluded.cancelAtPeriodEnd,
      updatedAt = excluded.updatedAt
  `, [input.userId, input.customerId, input.subscriptionId, input.priceId, input.tier,
    input.status, input.currentPeriodEnd || null, input.cancelAtPeriodEnd ? 1 : 0,
    existing.lastInvoiceId, existing.lastPaymentFailedAt, existing.createdAt, now]);
  const state = await getBillingState(input.userId);
  syncProfileEntitlement(input.userId, state);
  return state;
}

export async function recordInvoicePaymentFailure(input: {
  userId: string;
  invoiceId: string;
}) {
  const now = new Date().toISOString();
  await database.execute(`
    UPDATE subscription_billing
    SET status = CASE WHEN status IN ('active', 'trialing') THEN 'past_due' ELSE status END,
        lastInvoiceId = ?, lastPaymentFailedAt = ?, updatedAt = ?
    WHERE userId = ?
  `, [input.invoiceId, now, now, input.userId]);
  const state = await getBillingState(input.userId);
  syncProfileEntitlement(input.userId, state);
  return state;
}

export async function recordInvoicePaid(input: { userId: string; invoiceId: string }) {
  const now = new Date().toISOString();
  await database.execute(`
    UPDATE subscription_billing
    SET status = CASE WHEN status = 'past_due' THEN 'active' ELSE status END,
        lastInvoiceId = ?, lastPaymentFailedAt = NULL, updatedAt = ?
    WHERE userId = ?
  `, [input.invoiceId, now, input.userId]);
  const state = await getBillingState(input.userId);
  syncProfileEntitlement(input.userId, state);
  return state;
}

export function paidTierForStripePrice(priceId: string, env: NodeJS.ProcessEnv = process.env): MembershipTier | null {
  if (priceId && priceId === env.STRIPE_PRICE_SILVER) return "Silver";
  if (priceId && priceId === env.STRIPE_PRICE_GOLD) return "Gold";
  if (priceId && priceId === env.STRIPE_PRICE_PLATINUM) return "Platinum";
  return null;
}

export function stripePriceForPaidTier(tier: MembershipTier, env: NodeJS.ProcessEnv = process.env): string | null {
  if (tier === "Silver") return env.STRIPE_PRICE_SILVER?.trim() || null;
  if (tier === "Gold") return env.STRIPE_PRICE_GOLD?.trim() || null;
  if (tier === "Platinum") return env.STRIPE_PRICE_PLATINUM?.trim() || null;
  return null;
}

export function listAdminBillingAccounts(): Promise<AdminBillingAccount[]> {
  return database.queryMany<AdminBillingAccount>(`
    SELECT billing.*, users.name, users.email
    FROM subscription_billing billing
    JOIN users ON users.id = billing.userId
    WHERE users.deletedAt IS NULL
    ORDER BY
      CASE billing.status WHEN 'past_due' THEN 0 WHEN 'unpaid' THEN 1 ELSE 2 END,
      billing.updatedAt DESC
  `);
}

export async function getBillingSummary(): Promise<BillingSummary> {
  const row = await database.queryOne<BillingSummary>(`
    SELECT
      COUNT(*) AS paidAccounts,
      COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END), 0) AS active,
      COALESCE(SUM(CASE WHEN status = 'trialing' THEN 1 ELSE 0 END), 0) AS trialing,
      COALESCE(SUM(CASE WHEN status = 'past_due' THEN 1 ELSE 0 END), 0) AS pastDue,
      COALESCE(SUM(CASE WHEN cancelAtPeriodEnd = 1 THEN 1 ELSE 0 END), 0) AS endingAtPeriodEnd,
      COALESCE(SUM(CASE WHEN status IN ('canceled', 'unpaid', 'incomplete_expired') THEN 1 ELSE 0 END), 0) AS ended
    FROM subscription_billing
  `);
  return row!;
}
