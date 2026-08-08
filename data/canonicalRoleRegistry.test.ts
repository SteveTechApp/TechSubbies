import { describe, expect, it } from 'vitest';
import { canonicalRoleIdForLegacy, canonicalRoleRegistry, getCanonicalRole } from './canonicalRoleRegistry';

describe('canonicalRoleRegistry', () => {
  it('publishes every AV and IT profile through one unique catalogue', () => {
    expect(canonicalRoleRegistry).toHaveLength(46);
    expect(new Set(canonicalRoleRegistry.map(role => role.id)).size).toBe(46);
    expect(canonicalRoleRegistry.filter(role => role.market === 'av')).toHaveLength(20);
    expect(canonicalRoleRegistry.filter(role => role.market === 'it')).toHaveLength(26);
  });

  it('gives every role usable skills, evidence prompts and product tags', () => {
    for (const role of canonicalRoleRegistry) {
      expect(role.skillGroups.flatMap(group => group.skills).length).toBeGreaterThanOrEqual(11);
      expect(role.evidenceTypes.length).toBeGreaterThan(0);
      expect(role.recommendedTags.length).toBeGreaterThan(0);
    }
  });

  it('uses stable profile identifiers for lookup', () => {
    expect(getCanonicalRole('av-installation-engineer')?.title).toBe('AV Installation Engineer');
    expect(getCanonicalRole('devops-automation-engineer')?.market).toBe('it');
  });

  it('maps legacy opportunity identifiers onto canonical role IDs', () => {
    expect(canonicalRoleIdForLegacy('competent-av-installer')).toBe('av-installation-engineer');
    expect(canonicalRoleIdForLegacy('devops-automation-engineer')).toBe('devops-automation-engineer');
  });
});
