import { randomUUID } from "node:crypto";
import { db } from "./db.js";

export type MarketplaceAnalyticsEventType =
  | "search.performed"
  | "profile.viewed"
  | "invitation.sent"
  | "application.submitted"
  | "booking.created";

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

export function recordMarketplaceAnalyticsEvent(input: {
  eventType: MarketplaceAnalyticsEventType;
  actorUserId: string;
  subjectUserId?: string;
  jobId?: string;
  createdAt?: string;
}): void {
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
}

function sinceForWindow(windowDays: MarketplaceAnalyticsWindow): string | null {
  if (windowDays === "all") return null;
  return new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();
}

function countEvents(eventType: MarketplaceAnalyticsEventType, since: string | null): number {
  const row = since
    ? db.prepare("SELECT COUNT(*) AS total FROM marketplace_analytics_events WHERE eventType = ? AND createdAt >= ?")
        .get(eventType, since)
    : db.prepare("SELECT COUNT(*) AS total FROM marketplace_analytics_events WHERE eventType = ?")
        .get(eventType);
  return Number((row as { total?: number } | undefined)?.total || 0);
}

function countDistinctActors(eventType: MarketplaceAnalyticsEventType, since: string | null): number {
  const row = since
    ? db.prepare("SELECT COUNT(DISTINCT actorUserId) AS total FROM marketplace_analytics_events WHERE eventType = ? AND createdAt >= ?")
        .get(eventType, since)
    : db.prepare("SELECT COUNT(DISTINCT actorUserId) AS total FROM marketplace_analytics_events WHERE eventType = ?")
        .get(eventType);
  return Number((row as { total?: number } | undefined)?.total || 0);
}

function ratio(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null;
  return numerator / denominator;
}

function repeatBookingSummary(since: string | null) {
  const rows = (since
    ? db.prepare(`
        SELECT actorUserId, subjectUserId, COUNT(*) AS bookings
        FROM marketplace_analytics_events
        WHERE eventType = 'booking.created'
          AND subjectUserId IS NOT NULL
          AND createdAt >= ?
        GROUP BY actorUserId, subjectUserId
      `).all(since)
    : db.prepare(`
        SELECT actorUserId, subjectUserId, COUNT(*) AS bookings
        FROM marketplace_analytics_events
        WHERE eventType = 'booking.created'
          AND subjectUserId IS NOT NULL
        GROUP BY actorUserId, subjectUserId
      `).all()) as Array<{ actorUserId: string; subjectUserId: string; bookings: number }>;

  const bookingPairs = rows.length;
  const repeatBookingPairs = rows.filter((row) => Number(row.bookings) >= 2).length;
  return {
    bookingPairs,
    repeatBookingPairs,
    repeatBookingRate: ratio(repeatBookingPairs, bookingPairs),
  };
}

function retention30dSummary(now = new Date()) {
  const firstActivityRows = db.prepare(`
    SELECT actorUserId, MIN(createdAt) AS firstAt
    FROM marketplace_analytics_events
    GROUP BY actorUserId
  `).all() as Array<{ actorUserId: string; firstAt: string }>;

  let eligibleUsers = 0;
  let retainedUsers = 0;
  for (const row of firstActivityRows) {
    const firstAt = new Date(row.firstAt);
    if (!Number.isFinite(firstAt.getTime())) continue;
    const threshold = new Date(firstAt.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (threshold > now) continue;
    eligibleUsers += 1;
    const retained = db.prepare(`
      SELECT 1 AS ok
      FROM marketplace_analytics_events
      WHERE actorUserId = ? AND createdAt >= ?
      LIMIT 1
    `).get(row.actorUserId, threshold.toISOString()) as { ok?: number } | undefined;
    if (retained?.ok === 1) retainedUsers += 1;
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
  const searches = countEvents("search.performed", since);
  const profileViews = countEvents("profile.viewed", since);
  const invitations = countEvents("invitation.sent", since);
  const applications = countEvents("application.submitted", since);
  const bookings = countEvents("booking.created", since);

  return {
    windowDays,
    generatedAt: new Date().toISOString(),
    stages: { searches, profileViews, invitations, applications, bookings },
    actors: {
      uniqueSearchers: countDistinctActors("search.performed", since),
      uniqueProfileViewers: countDistinctActors("profile.viewed", since),
      uniqueApplicants: countDistinctActors("application.submitted", since),
      uniqueBookers: countDistinctActors("booking.created", since),
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
