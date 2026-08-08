import { avSkillProfiles } from './avSkillProfiles';
import { itSkillProfiles } from './itSkillProfiles';
import type { RoleSkillDefinition, RoleMarket, RoleFamily } from '../types/roleSkills';

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function titleFromId(value: string): string {
  return value.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function convertProfile(profile: any, market: RoleMarket): RoleSkillDefinition {
  const skills = profile.skillGroups.flatMap((group: any, groupIndex: number) =>
    group.skills.map((skill: any, skillIndex: number) => ({
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
    skillGroups: profile.skillGroups.map((group: any, groupIndex: number) => ({
      id: `${profile.id}:group-${groupIndex + 1}`,
      title: group.title,
      description: group.description,
      skills: skills.filter((skill: any) =>
        group.skills.some((source: any) => skill.id === `${profile.id}:${slug(source.name)}`)
      ),
    })),
  };
}

/**
 * The single role catalogue used by profile creation, job intake and matching.
 * Source profile files remain editorially convenient, while this registry gives
 * every consumer one stable contract and identifier set.
 */
export const canonicalRoleRegistry: RoleSkillDefinition[] = [
  ...avSkillProfiles.map(profile => convertProfile(profile, 'av')),
  ...itSkillProfiles.map(profile => convertProfile(profile, 'it')),
];

export const canonicalRoleById = new Map(canonicalRoleRegistry.map(role => [role.id, role]));

export function getCanonicalRole(roleId: string): RoleSkillDefinition | undefined {
  return canonicalRoleById.get(roleId);
}

export { canonicalRoleIdForLegacy } from './canonicalRoleIds';
