import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  baselineCanonicalRoleRegistry,
  canonicalRoleRegistry,
  getCanonicalRole,
} from '../data/canonicalRoleRegistry';
import { taxonomyService } from './taxonomyService';
import {
  hydrateEffectiveRoleCatalogue,
  resetRoleCatalogueHydrationForTests,
} from './effectiveRoleCatalogue';

afterEach(() => {
  vi.restoreAllMocks();
  resetRoleCatalogueHydrationForTests();
});

describe('effective role catalogue', () => {
  it('applies published taxonomy snapshots over the source-controlled baseline', async () => {
    const baseline = baselineCanonicalRoleRegistry[0];
    const published = {
      ...baseline,
      title: `${baseline.title} (Published)`,
      summary: `${baseline.summary} Approved practitioner update.`,
    };

    vi.spyOn(taxonomyService, 'listPublished').mockResolvedValue([
      {
        id: 'version-1',
        roleId: baseline.id,
        version: 2,
        status: 'published',
        snapshot: published,
        changeNote: 'Approved update for test coverage.',
        createdBy: 'admin-1',
        createdAt: '2026-08-08T00:00:00.000Z',
        updatedAt: '2026-08-08T00:00:00.000Z',
        submittedAt: '2026-08-08T00:00:00.000Z',
        publishedAt: '2026-08-08T00:00:00.000Z',
        publishedBy: 'admin-1',
        reviews: [],
      },
    ]);

    const result = await hydrateEffectiveRoleCatalogue();

    expect(result.source).toBe('published');
    expect(result.publishedRoleCount).toBe(1);
    expect(canonicalRoleRegistry).toHaveLength(baselineCanonicalRoleRegistry.length);
    expect(getCanonicalRole(baseline.id)?.title).toBe(published.title);
  });

  it('falls back to the baseline catalogue when published taxonomy cannot load', async () => {
    vi.spyOn(taxonomyService, 'listPublished').mockRejectedValue(new Error('offline'));

    const result = await hydrateEffectiveRoleCatalogue();

    expect(result.source).toBe('baseline');
    expect(result.publishedRoleCount).toBe(0);
    expect(canonicalRoleRegistry[0].title).toBe(baselineCanonicalRoleRegistry[0].title);
  });
});
