import {
  applyPublishedRoleOverlays,
  canonicalRoleRegistry,
  resetCanonicalRoleRegistry,
} from '../data/canonicalRoleRegistry';
import { taxonomyService } from './taxonomyService';
import type { RoleSkillDefinition } from '../types/roleSkills';

export type RoleCatalogueHydration = {
  source: 'published' | 'baseline';
  publishedRoleCount: number;
  roles: RoleSkillDefinition[];
};

const CATALOGUE_BOOTSTRAP_TIMEOUT_MS = 2500;
let hydrationPromise: Promise<RoleCatalogueHydration> | null = null;

async function loadPublishedWithTimeout() {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Role catalogue bootstrap timed out.')), CATALOGUE_BOOTSTRAP_TIMEOUT_MS);
  });

  try {
    return await Promise.race([taxonomyService.listPublished(), timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function hydrateEffectiveRoleCatalogue(): Promise<RoleCatalogueHydration> {
  if (hydrationPromise) return hydrationPromise;

  hydrationPromise = loadPublishedWithTimeout()
    .then((versions) => {
      const overlays = versions.map(version => version.snapshot);
      applyPublishedRoleOverlays(overlays);
      return {
        source: overlays.length > 0 ? 'published' as const : 'baseline' as const,
        publishedRoleCount: overlays.length,
        roles: canonicalRoleRegistry,
      };
    })
    .catch(() => {
      resetCanonicalRoleRegistry();
      return {
        source: 'baseline' as const,
        publishedRoleCount: 0,
        roles: canonicalRoleRegistry,
      };
    });

  return hydrationPromise;
}

export function resetRoleCatalogueHydrationForTests() {
  hydrationPromise = null;
  resetCanonicalRoleRegistry();
}
