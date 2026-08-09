import { describe, expect, it } from 'vitest';
import { canonicalRoleIdsFromProfile, toCanonicalCapabilityProfile, toCanonicalRoleRequirement } from './canonicalCapability';

describe('canonical capability adapters', () => {
  it('normalizes legacy profile and opportunity shapes without trusting arbitrary fields', () => {
    const profile = toCanonicalCapabilityProfile({ expectationId: 'AV Lead', maximumResponsibility: 'lead', skills: [{ skill: 'commissioning', selfLevel: 4 }], keywords: [' Q-SYS ', 42], evidence: [{ type: 'project', note: 'Delivered' }, null] });
    expect(profile).toMatchObject({ overallCapability: 'lead', capabilities: [{ skillId: 'commissioning', claim: 'independent' }], keywords: ['Q-SYS'], evidence: [{ type: 'project', note: 'Delivered' }] });

    const requirement = toCanonicalRoleRequirement({ expectationId: 'AV Lead', quantity: 0, workingArrangement: 'independent', skills: [{ skill: 'commissioning' }], prerequisites: ['Q-SYS', 12] });
    expect(requirement).toMatchObject({ quantity: 1, responsibility: 'deliver', skills: [{ skillId: 'commissioning', required: true }], prerequisites: [{ label: 'Q-SYS' }] });
  });

  it('returns deterministic empty canonical structures for malformed input', () => {
    expect(toCanonicalCapabilityProfile(null).capabilities).toEqual([]);
    expect(toCanonicalRoleRequirement('invalid').skills).toEqual([]);
  });

  it('extracts unique canonical roles and ignores malformed legacy profiles', () => {
    expect(canonicalRoleIdsFromProfile({ roleSkillProfiles: [null, { roleId: 'network-engineer' }, { expectationId: 'network-engineer' }, { roleId: 42 }] })).toEqual(['network-engineer']);
    expect(canonicalRoleIdsFromProfile('invalid')).toEqual([]);
  });
});
