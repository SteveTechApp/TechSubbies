import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

const TEST_DB = path.join(process.cwd(), 'data', 'test-marketplace-analytics.db');
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.NODE_ENV = 'test';

const { db } = await import('./db.js');
const {
  getMarketplaceAnalyticsSummary,
  recordMarketplaceAnalyticsEvent,
} = await import('./marketplaceAnalyticsRepository.js');

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function insertApplication(id: string, engineerId: string, createdAt: string) {
  db.prepare(`
    INSERT INTO applications (id, jobId, engineerId, status, reviewed, createdAt, updatedAt)
    VALUES (?, ?, ?, 'Applied', 0, ?, ?)
  `).run(id, `job-${id}`, engineerId, createdAt, createdAt);
}

function insertContract(id: string, companyId: string, engineerId: string, createdAt: string) {
  db.prepare(`
    INSERT INTO contracts (
      id, jobId, companyId, engineerId, data, status,
      engineerSignature, companySignature, milestones, timesheets, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, '{}', 'Active', NULL, NULL, '[]', '[]', ?, ?)
  `).run(id, `job-${id}`, companyId, engineerId, createdAt, createdAt);
}

beforeEach(() => {
  db.prepare('DELETE FROM marketplace_analytics_events').run();
  db.prepare('DELETE FROM applications').run();
  db.prepare('DELETE FROM contracts').run();
  db.prepare('DELETE FROM jobs').run();
});

describe('marketplace analytics', () => {
  it('combines discovery events with durable application and booking records', () => {
    recordMarketplaceAnalyticsEvent({
      eventType: 'search.performed',
      actorUserId: 'company-1',
      createdAt: isoDaysAgo(2),
    });
    recordMarketplaceAnalyticsEvent({
      eventType: 'profile.viewed',
      actorUserId: 'company-1',
      subjectUserId: 'engineer-1',
      createdAt: isoDaysAgo(2),
    });
    recordMarketplaceAnalyticsEvent({
      eventType: 'invitation.sent',
      actorUserId: 'company-1',
      subjectUserId: 'engineer-1',
      jobId: 'job-1',
      createdAt: isoDaysAgo(2),
    });
    insertApplication('app-1', 'engineer-1', isoDaysAgo(2));
    insertApplication('app-2', 'engineer-2', isoDaysAgo(1));
    insertContract('contract-1', 'company-1', 'engineer-1', isoDaysAgo(1));

    const summary = getMarketplaceAnalyticsSummary(30);
    expect(summary.stages).toEqual({
      searches: 1,
      profileViews: 1,
      invitations: 1,
      applications: 2,
      bookings: 1,
    });
    expect(summary.conversion.profileViewsPerSearch).toBe(1);
    expect(summary.conversion.invitationRateFromViews).toBe(1);
    expect(summary.conversion.applicationToBookingRate).toBe(0.5);
  });

  it('counts repeat bookings by company-engineer pair', () => {
    insertContract('contract-1', 'company-1', 'engineer-1', isoDaysAgo(10));
    insertContract('contract-2', 'company-1', 'engineer-1', isoDaysAgo(5));
    insertContract('contract-3', 'company-1', 'engineer-2', isoDaysAgo(4));

    const summary = getMarketplaceAnalyticsSummary(30);
    expect(summary.repeatBooking.bookingPairs).toBe(2);
    expect(summary.repeatBooking.repeatBookingPairs).toBe(1);
    expect(summary.repeatBooking.repeatBookingRate).toBe(0.5);
  });

  it('defines 30-day retention as marketplace activity on or after day 30', () => {
    recordMarketplaceAnalyticsEvent({
      eventType: 'search.performed',
      actorUserId: 'company-retained',
      createdAt: isoDaysAgo(45),
    });
    recordMarketplaceAnalyticsEvent({
      eventType: 'profile.viewed',
      actorUserId: 'company-retained',
      subjectUserId: 'engineer-1',
      createdAt: isoDaysAgo(10),
    });
    recordMarketplaceAnalyticsEvent({
      eventType: 'search.performed',
      actorUserId: 'company-not-retained',
      createdAt: isoDaysAgo(45),
    });

    const summary = getMarketplaceAnalyticsSummary('all');
    expect(summary.retention30d.eligibleUsers).toBe(2);
    expect(summary.retention30d.retainedUsers).toBe(1);
    expect(summary.retention30d.rate).toBe(0.5);
  });

  it('deduplicates rapid repeated discovery actions', () => {
    expect(recordMarketplaceAnalyticsEvent({
      eventType: 'profile.viewed',
      actorUserId: 'company-1',
      subjectUserId: 'engineer-1',
    })).toBe(true);
    expect(recordMarketplaceAnalyticsEvent({
      eventType: 'profile.viewed',
      actorUserId: 'company-1',
      subjectUserId: 'engineer-1',
    })).toBe(false);
    expect(getMarketplaceAnalyticsSummary(30).stages.profileViews).toBe(1);
  });
});
