import { describe, expect, it } from 'vitest';
import { baselineCanonicalRoleRegistry } from './canonicalRoleRegistry';
import { adjacentFamilyValidations } from './adjacentFamilyValidation';

describe('adjacent family validation gate', () => {
  it('covers the six agreed adjacent families exactly once', () => {
    expect(adjacentFamilyValidations.map(item => item.id).sort()).toEqual([
      'broadcast',
      'fibre-telecoms',
      'physical-security',
      'residential-integration',
      'smart-buildings-bms-iot',
      'stage-systems',
    ]);
  });

  it('keeps proposed adjacent role IDs outside the live canonical catalogue', () => {
    const liveIds = new Set(baselineCanonicalRoleRegistry.map(role => role.id));
    const candidateIds = adjacentFamilyValidations.flatMap(family => family.proposedRoles.map(role => role.id));

    expect(new Set(candidateIds).size).toBe(candidateIds.length);
    for (const roleId of candidateIds) {
      expect(liveIds.has(roleId)).toBe(false);
    }
  });

  it('requires evidence, safeguards and practitioner questions before a family can advance', () => {
    for (const family of adjacentFamilyValidations) {
      expect(family.evidence.length).toBeGreaterThan(0);
      expect(family.safeguards.length).toBeGreaterThan(0);
      expect(family.practitionerQuestions.length).toBeGreaterThan(0);
      expect(family.proposedRoles.length).toBeGreaterThan(0);
      for (const evidence of family.evidence) {
        expect(evidence.url).toMatch(/^https:\/\//);
      }
    }
  });

  it('does not mark regulated or safety-critical adjacent families as unconditional advance', () => {
    const security = adjacentFamilyValidations.find(item => item.id === 'physical-security');
    const stage = adjacentFamilyValidations.find(item => item.id === 'stage-systems');
    const broadcast = adjacentFamilyValidations.find(item => item.id === 'broadcast');

    expect(security?.decision).toBe('conditional');
    expect(stage?.decision).toBe('conditional');
    expect(broadcast?.decision).toBe('hold');
  });
});
