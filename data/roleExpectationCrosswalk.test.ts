import { describe, expect, it } from 'vitest';
import { roleExpectations } from './roleExpectations';
import {
  canonicalRoleIdForLegacy,
  responsibilityExpectationCanonicalRoleIds,
  unmappedResponsibilityExpectationIds,
} from './canonicalRoleIds';
import { baselineCanonicalRoleRegistry } from './canonicalRoleRegistry';

describe('responsibility expectation canonical role crosswalk', () => {
  it('includes the extended AV and project delivery roles', () => {
    const roleTitles = new Set(roleExpectations.map(expectation => expectation.roleTitle));

    for (const title of [
      'Rack Builder',
      'Wireman (1st Fix)',
      'LED Install Engineer',
      'LED Commissioning Engineer',
      'Live Event Sound Technician',
      'Live Event Visual Technician',
      'Live Event General Engineer',
      'AV Project Manager',
      'IT Project Manager',
    ]) {
      expect(roleTitles.has(title), title).toBe(true);
    }
  });

  it('maps every responsibility expectation to an existing canonical role', () => {
    const expectationIds = roleExpectations.map(expectation => expectation.id);
    expect(unmappedResponsibilityExpectationIds(expectationIds)).toEqual([]);

    const canonicalIds = new Set(baselineCanonicalRoleRegistry.map(role => role.id));
    for (const expectation of roleExpectations) {
      const canonicalRoleId = canonicalRoleIdForLegacy(expectation.id);
      expect(responsibilityExpectationCanonicalRoleIds[expectation.id]).toBe(canonicalRoleId);
      expect(canonicalIds.has(canonicalRoleId), `${expectation.id} -> ${canonicalRoleId}`).toBe(true);
    }
  });
});
