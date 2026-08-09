import { normaliseRoleIdentity } from './roleIdentity';
import type { CapabilityClaim, CanonicalCapabilityProfile, CanonicalRoleRequirement, ResponsibilityLevel } from '../types/capability';

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : {};
}

function stringValue(...values: unknown[]): string {
  return values.find((value): value is string => typeof value === 'string') || '';
}

function arrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function responsibility(value: unknown): ResponsibilityLevel {
  return value === 'lead' ? 'lead' : value === 'specialist' ? 'diagnose' : value === 'competent' || value === 'independent' ? 'deliver' : 'assist';
}

function capabilityClaim(item: Record<string, unknown>): CapabilityClaim {
  if (item.claim === 'support' || item.claim === 'independent' || item.claim === 'not-offered') return item.claim;
  const level = Number(item.selfLevel);
  return level <= 0 ? 'not-offered' : level < 3 ? 'support' : 'independent';
}

export function toCanonicalCapabilityProfile(value: unknown): CanonicalCapabilityProfile {
  const profile = record(value);
  const capabilities = arrayValue(profile.capabilities ?? profile.skills).map(record).map(item => ({
    skillId: stringValue(item.skillId, item.skill),
    claim: capabilityClaim(item),
    evidenceNote: stringValue(item.evidenceNote),
  })).filter(item => item.skillId);
  const keywords = [...arrayValue(profile.keywords), ...arrayValue(profile.customKeywords)]
    .filter((item): item is string => typeof item === 'string')
    .map(item => item.trim()).filter(Boolean);
  const evidence = arrayValue(profile.evidence).map(record).map(item => ({
    type: stringValue(item.type), note: stringValue(item.note),
  })).filter(item => item.type);

  return {
    roleId: normaliseRoleIdentity(stringValue(profile.roleId, profile.expectationId)),
    overallCapability: responsibility(profile.overallCapability ?? profile.maximumResponsibility),
    capabilities,
    keywords: [...new Set(keywords)],
    evidence,
    profileNote: stringValue(profile.profileNote, profile.profileNotes),
  };
}

export function toCanonicalRoleRequirement(value: unknown): CanonicalRoleRequirement {
  const need = record(value);
  return {
    roleId: normaliseRoleIdentity(stringValue(need.roleId, need.expectationId)),
    quantity: Math.max(1, Number(need.quantity) || 1),
    responsibility: need.workingArrangement === 'lead' ? 'lead' : need.workingArrangement === 'independent' ? 'deliver' : 'assist',
    skills: arrayValue(need.skills).map(record).map(item => ({
      skillId: stringValue(item.skillId, item.skill),
      required: typeof item.required === 'boolean' ? item.required : typeof item.isRequired === 'boolean' ? item.isRequired : true,
    })).filter(item => item.skillId),
    prerequisites: arrayValue(need.prerequisites).filter((item): item is string => typeof item === 'string').slice(0, 3).map(label => ({
      label, category: 'software-manufacturer-hardware', minimumExperience: 'practical',
    })),
  };
}

export function canonicalRoleIdsFromProfile(value: unknown): string[] {
  const profile = record(value);
  const source = Array.isArray(profile.roleSkillProfiles)
    ? profile.roleSkillProfiles
    : Array.isArray(profile.capabilityProfiles) ? profile.capabilityProfiles : [];
  return [...new Set(source
    .map((item) => toCanonicalCapabilityProfile(item).roleId)
    .filter((roleId): roleId is string => Boolean(roleId)))];
}
