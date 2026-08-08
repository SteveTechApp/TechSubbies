import { describe, expect, it } from 'vitest';
import { toDirectoryUser, toPublicUser } from './publicUser.js';
import type { UserRow } from './db.js';

function engineerUser(shareWithCompanies: boolean): UserRow {
  return {
    id: 'engineer-inclusive-1',
    email: 'engineer@example.com',
    password: 'hash',
    role: 'Engineer',
    name: 'Inclusive Engineer',
    profile: JSON.stringify({
      discipline: 'AV Engineer',
      inclusivePreferences: {
        languages: ['English', 'Polish'],
        workModes: ['on-site', 'hybrid'],
        alternativeEvidenceRoutes: ['portfolio', 'practical-assessment'],
        accessibility: {
          needsAdjustments: true,
          shareWithCompanies,
          adjustments: ['Step-free / accessible site access', 'Flexible or additional breaks'],
          note: 'Please confirm accessible parking before the booking.',
        },
      },
      accessibilityAdjustments: ['legacy private value'],
      accessibilityNote: 'legacy private note',
      contact: { email: 'engineer@example.com', phone: '07000000000' },
    }),
    emailVerified: 1,
    sessionVersion: 0,
    deletedAt: null,
    suspendedAt: null,
    suspensionReason: null,
    suspendedBy: null,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  };
}

describe('inclusive directory privacy', () => {
  it('keeps full accessibility preferences in the engineer own-account projection', () => {
    const result = toPublicUser(engineerUser(false));
    expect((result.profile as any).inclusivePreferences.accessibility).toMatchObject({
      needsAdjustments: true,
      shareWithCompanies: false,
      note: 'Please confirm accessible parking before the booking.',
    });
  });

  it('removes private accessibility details from the marketplace directory by default', () => {
    const result = toDirectoryUser(engineerUser(false));
    const profile = result.profile as any;

    expect(profile.contact).toBeUndefined();
    expect(profile.accessibilityAdjustments).toBeUndefined();
    expect(profile.accessibilityNote).toBeUndefined();
    expect(profile.inclusivePreferences).toMatchObject({
      languages: ['English', 'Polish'],
      workModes: ['on-site', 'hybrid'],
      alternativeEvidenceRoutes: ['portfolio', 'practical-assessment'],
    });
    expect(profile.inclusivePreferences.accessibility).toBeUndefined();
  });

  it('shares practical accessibility details only after explicit engineer opt-in', () => {
    const result = toDirectoryUser(engineerUser(true));
    const accessibility = (result.profile as any).inclusivePreferences.accessibility;

    expect(accessibility).toEqual({
      needsAdjustments: true,
      shareWithCompanies: true,
      adjustments: ['Step-free / accessible site access', 'Flexible or additional breaks'],
      note: 'Please confirm accessible parking before the booking.',
    });
  });
});
