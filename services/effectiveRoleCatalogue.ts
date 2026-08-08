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

let hydrationPromise: Promise<RoleCatalogueHydration> | null = null;

export async function hydrateEffectiveRoleCatalogue(): Promise<RoleCatalogueHydration> {
  if (hydrationPromise) return hydrationPromise;

  hydrationPromise = taxonomyService.listPublished()
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
