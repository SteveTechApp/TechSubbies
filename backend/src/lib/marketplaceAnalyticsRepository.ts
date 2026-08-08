import { randomUUID } from "node:crypto";
import { db } from "./db.js";

export type MarketplaceAnalyticsEventType =
  | "search.performed"
  | "profile.viewed"
  | "invitation.sent";

export type MarketplaceAnalyticsWindow = 30 | 90 | "all";

export type MarketplaceAnalyticsSummary = {
  windowDays: MarketplaceAnalyticsWindow;
  generatedAt: string;
  stages: {
    searches: number;
    profileViews: number;
    invitations: number;
    applications: number;
    bookings: number;
  };
  actors: {
    uniqueSearchers: number;
    uniqueProfileViewers: number;
    uniqueApplicants: number;
    uniqueBookers: number;
  };
  conversion: {
    profileViewsPerSearch: number | null;
    invitationRateFromViews: number | null;
    applicationToBookingRate: number | null;
  };
  repeatBooking: {
    bookingPairs: number;
    repeatBookingPairs: number;
    repeatBookingRate: number | null;
  };
  retention30d: {
    eligibleUsers: number;
    retainedUsers: number;
    rate: number | null;
  };
};

db.exec(`
  CREATE TABLE IF NOT EXISTS marketplace_analytics_events (
    id TEXT PRIMARY KEY,
    eventType TEXT NOT NULL,
    actorUserId TEXT NOT NULL,
    subjectUserId TEXT,
    jobId TEXT,
    createdAt TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS marketplace_analytics_events_type_created
    ON marketplace_analytics_events(eventType, createdAt DESC);
  CREATE INDEX IF NOT EXISTS marketplace_analytics_events_actor_created
    ON marketplace_analytics_events(actorUserId, createdAt DESC);
  CREATE INDEX IF NOT EXISTS marketplace_analytics_events_pair
    ON marketplace_analytics_events(actorUserId, subjectUserId, eventType, createdAt DESC);
`);

export function checkMarketplaceAnalyticsRepository(): boolean {
  const row = db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'marketplace_analytics_events'"
  ).get() as { name?: string } | undefined;
  return row?.name === "marketplace_analytics_events";
}

function recentDuplicate(input: {
  eventType: MarketplaceAnalyticsEventType;
  actorUserId: string;
  subjectUserId?: string;
  jobId?: string;
}): boolean {
  const dedupeSeconds = input.eventType === "search.performed" ? 5 : input.eventType === "profile.viewed" ? 60 : 300;
  const threshold = new Date(Date.now() - dedupeSeconds * 1000).toISOString();
  const row = db.prepare(`
    SELECT 1 AS ok
    FROM marketplace_analytics_events
    WHERE eventType = ?
      AND actorUserId = ?
      AND COALESCE(subjectUserId, '') = ?
      AND COALESCE(jobId, '') = ?
      AND createdAt >= ?
    LIMIT 1
  `).get(
    input.eventType,
    input.actorUserId,
    input.subjectUserId || "",
    input.jobId || "",
    threshold
  ) as { ok?: number } | undefined;
  return row?.ok === 1;
}

export function recordMarketplaceAnalyticsEvent(input: {
  eventType: MarketplaceAnalyticsEventType;
  actorUserId: string;
  subjectUserId?: string;
  jobId?: string;
  createdAt?: string;
}): boolean {
  if (!input.createdAt && recentDuplicate(input)) return false;
  db.prepare(`
    INSERT INTO marketplace_analytics_events (
      id, eventType, actorUserId, subjectUserId, jobId, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    randomUUID(),
    input.eventType,
    input.actorUserId,
    input.subjectUserId || null,
    input.jobId || null,
    input.createdAt || new Date().toISOString()
  );
  return true;
}

function sinceForWindow(windowDays: MarketplaceAnalyticsWindow): string | null {
  if (windowDays === "all") return null;
  return new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();
}

function countDiscoveryEvents(eventType: MarketplaceAnalyticsEventType, since: string | null): number {
  const row = since
    ? db.prepare("SELECT COUNT(*) AS total FROM marketplace_analytics_events WHERE eventType = ? AND createdAt >= ?")
        .get(eventType, since)
    : db.prepare("SELECT COUNT(*) AS total FROM marketplace_analytics_events WHERE eventType = ?")
        .get(eventType);
  return Number((row as { total?: number } | undefined)?.total || 0);
}

function countDistinctDiscoveryActors(eventType: MarketplaceAnalyticsEventType, since: string | null): number {
  const row = since
    ? db.prepare("SELECT COUNT(DISTINCT actorUserId) AS total FROM marketplace_analytics_events WHERE eventType = ? AND createdAt >= ?")
        .get(eventType, since)
    : db.prepare("SELECT COUNT(DISTINCT actorUserId) AS total FROM marketplace_analytics_events WHERE eventType = ?")
        .get(eventType);
  return Number((row as { total?: number } | undefined)?.total || 0);
}

function countDurableRows(table: "applications" | "contracts", since: string | null): number {
  const row = since
    ? db.prepare(`SELECT COUNT(*) AS total FROM ${table} WHERE createdAt >= ?`).get(since)
    : db.prepare(`SELECT COUNT(*) AS total FROM ${table}`).get();
  return Number((row as { total?: number } | undefined)?.total || 0);
}

function countDistinctDurableActors(
  table: "applications" | "contracts",
  actorColumn: "engineerId" | "companyId",
  since: string | null
): number {
  const row = since
    ? db.prepare(`SELECT COUNT(DISTINCT ${actorColumn}) AS total FROM ${table} WHERE createdAt >= ?`).get(since)
    : db.prepare(`SELECT COUNT(DISTINCT ${actorColumn}) AS total FROM ${table}`).get();
  return Number((row as { total?: number } | undefined)?.total || 0);
}

function ratio(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null;
  return numerator / denominator;
}

function repeatBookingSummary(since: string | null) {
  const rows = (since
    ? db.prepare(`
        SELECT companyId, engineerId, COUNT(*) AS bookings
        FROM contracts
        WHERE createdAt >= ?
        GROUP BY companyId, engineerId
      `).all(since)
    : db.prepare(`
        SELECT companyId, engineerId, COUNT(*) AS bookings
        FROM contracts
        GROUP BY companyId, engineerId
      `).all()) as Array<{ companyId: string; engineerId: string; bookings: number }>;

  const bookingPairs = rows.length;
  const repeatBookingPairs = rows.filter((row) => Number(row.bookings) >= 2).length;
  return {
    bookingPairs,
    repeatBookingPairs,
    repeatBookingRate: ratio(repeatBookingPairs, bookingPairs),
  };
}

function marketplaceActivityRows(): Array<{ actorUserId: string; createdAt: string }> {
  return db.prepare(`
    SELECT actorUserId, createdAt FROM marketplace_analytics_events
    UNION ALL
    SELECT companyId AS actorUserId, postedDate AS createdAt FROM jobs
    UNION ALL
    SELECT engineerId AS actorUserId, createdAt FROM applications
    UNION ALL
    SELECT companyId AS actorUserId, createdAt FROM contracts
    UNION ALL
    SELECT engineerId AS actorUserId, createdAt FROM contracts
  `).all() as Array<{ actorUserId: string; createdAt: string }>;
}

function retention30dSummary(now = new Date()) {
  const activity = marketplaceActivityRows();
  const byUser = new Map<string, string[]>();
  for (const row of activity) {
    if (!row.actorUserId || !row.createdAt) continue;
    const entries = byUser.get(row.actorUserId) || [];
    entries.push(row.createdAt);
    byUser.set(row.actorUserId, entries);
  }

  let eligibleUsers = 0;
  let retainedUsers = 0;
  for (const timestamps of byUser.values()) {
    const sorted = timestamps
      .map((value) => new Date(value))
      .filter((value) => Number.isFinite(value.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());
    if (!sorted.length) continue;
    const firstAt = sorted[0];
    const threshold = new Date(firstAt.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (threshold.getTime() > now.getTime()) continue;
    eligibleUsers += 1;
    if (sorted.some((value) => value.getTime() >= threshold.getTime())) retainedUsers += 1;
  }

  return {
    eligibleUsers,
    retainedUsers,
    rate: ratio(retainedUsers, eligibleUsers),
  };
}

export function getMarketplaceAnalyticsSummary(
  windowDays: MarketplaceAnalyticsWindow = 30
): MarketplaceAnalyticsSummary {
  const since = sinceForWindow(windowDays);
  const searches = countDiscoveryEvents("search.performed", since);
  const profileViews = countDiscoveryEvents("profile.viewed", since);
  const invitations = countDiscoveryEvents("invitation.sent", since);
  const applications = countDurableRows("applications", since);
  const bookings = countDurableRows("contracts", since);

  return {
    windowDays,
    generatedAt: new Date().toISOString(),
    stages: { searches, profileViews, invitations, applications, bookings },
    actors: {
      uniqueSearchers: countDistinctDiscoveryActors("search.performed", since),
      uniqueProfileViewers: countDistinctDiscoveryActors("profile.viewed", since),
      uniqueApplicants: countDistinctDurableActors("applications", "engineerId", since),
      uniqueBookers: countDistinctDurableActors("contracts", "companyId", since),
    },
    conversion: {
      profileViewsPerSearch: ratio(profileViews, searches),
      invitationRateFromViews: ratio(invitations, profileViews),
      applicationToBookingRate: ratio(bookings, applications),
    },
    repeatBooking: repeatBookingSummary(since),
    retention30d: retention30dSummary(),
  };
}
