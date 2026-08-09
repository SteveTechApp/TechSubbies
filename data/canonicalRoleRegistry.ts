import { avSkillProfiles } from './avSkillProfiles';
import { itSkillProfiles } from './itSkillProfiles';
import type { RoleSkillDefinition, RoleMarket, RoleFamily } from '../types/roleSkills';
import type { AvSkillProfile } from '../types/skillProfiles';
import type { ItSkillProfile } from '../types/itSkillProfiles';

type SourceSkillProfile = AvSkillProfile | ItSkillProfile;

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function titleFromId(value: string): string {
  return value.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function convertProfile(profile: SourceSkillProfile, market: RoleMarket): RoleSkillDefinition {
  const skills = profile.skillGroups.flatMap((group, groupIndex) =>
    group.skills.map((skill, skillIndex) => ({
      id: `${profile.id}:${slug(skill.name) || `${groupIndex}-${skillIndex}`}`,
      label: skill.name,
      description: `${group.description || group.title} Expected level: ${titleFromId(skill.level)}.`,
      requiredForGoodMatch: skill.priority === 'must-have',
      evidenceRecommended: true,
      suggestedTags: profile.productKnowledgeTags || [],
    }))
  );

  return {
    id: profile.id,
    market,
    family: profile.category as RoleFamily,
    title: profile.title,
    shortTitle: profile.title.replace(/^Free Basic /, ''),
    level: profile.planLevel === 'free-basic' ? 'entry' : 'specialist',
    summary: profile.summary,
    suitableFor: profile.suitableFor,
    typicalProjects: profile.suitableFor,
    recommendedTags: profile.productKnowledgeTags || [],
    evidenceTypes: profile.typicalEvidence || [],
    skillGroups: profile.skillGroups.map((group, groupIndex) => ({
      id: `${profile.id}:group-${groupIndex + 1}`,
      title: group.title,
      description: group.description,
      skills: skills.filter((skill) =>
        group.skills.some((source) => skill.id === `${profile.id}:${slug(source.name)}`)
      ),
    })),
  };
}

/**
 * Source-controlled baseline used whenever no approved taxonomy overlay exists.
 * IDs in this baseline are permanent marketplace identifiers; published taxonomy
 * versions may change role content but may not introduce a different identifier.
 */
export const baselineCanonicalRoleRegistry: RoleSkillDefinition[] = [
  ...avSkillProfiles.map(profile => convertProfile(profile, 'av')),
  ...itSkillProfiles.map(profile => convertProfile(profile, 'it')),
];

/**
 * Effective catalogue consumed by the application. Keep the array identity
 * stable so existing imports continue to observe newly hydrated published
 * taxonomy content without each consumer needing its own data source.
 */
export const canonicalRoleRegistry: RoleSkillDefinition[] = [...baselineCanonicalRoleRegistry];

let canonicalRoleById = new Map(canonicalRoleRegistry.map(role => [role.id, role]));

function rebuildRoleIndex() {
  canonicalRoleById = new Map(canonicalRoleRegistry.map(role => [role.id, role]));
}

export function applyPublishedRoleOverlays(overlays: RoleSkillDefinition[]): RoleSkillDefinition[] {
  const overlayById = new Map(
    overlays
      .filter(role => baselineCanonicalRoleRegistry.some(baseline => baseline.id === role.id))
      .map(role => [role.id, role])
  );

  const next = baselineCanonicalRoleRegistry.map(role => overlayById.get(role.id) || role);
  canonicalRoleRegistry.splice(0, canonicalRoleRegistry.length, ...next);
  rebuildRoleIndex();
  return canonicalRoleRegistry;
}

export function resetCanonicalRoleRegistry(): RoleSkillDefinition[] {
  canonicalRoleRegistry.splice(0, canonicalRoleRegistry.length, ...baselineCanonicalRoleRegistry);
  rebuildRoleIndex();
  return canonicalRoleRegistry;
}

export function getCanonicalRole(roleId: string): RoleSkillDefinition | undefined {
  return canonicalRoleById.get(roleId);
}

export { canonicalRoleIdForLegacy } from './canonicalRoleIds';
