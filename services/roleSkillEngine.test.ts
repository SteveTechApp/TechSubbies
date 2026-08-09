import { describe, expect, it } from 'vitest';
import { filterRoleSkillDefinitions, getRoleSkillDefinitions } from './roleSkillEngine';

describe('market-aligned role taxonomy', () => {
  it('keeps role and skill identifiers unique', () => {
    const roles = getRoleSkillDefinitions();
    expect(new Set(roles.map((role) => role.id)).size).toBe(roles.length);
    const skillIds = roles.flatMap((role) => role.skillGroups.flatMap((group) => group.skills.map((skill) => `${role.id}:${skill.id}`)));
    expect(new Set(skillIds).size).toBe(skillIds.length);
  });

  it('covers the main AV and IT recruitment families', () => {
    const ids = new Set(getRoleSkillDefinitions().map((role) => role.id));
    ['av-systems-designer','av-project-manager','av-field-service-engineer','av-onsite-support-technician','live-events-av-technician','cloud-engineer','devops-platform-engineer','site-reliability-engineer','cyber-security-analyst','data-engineer','qa-test-engineer','technical-solution-architect'].forEach((id) => expect(ids.has(id)).toBe(true));
  });

  it('gives every role explicit knowledge expectations and boundaries', () => {
    getRoleSkillDefinitions().forEach((role) => {
      expect(role.knowledgeRequirements, `${role.id} knowledge metadata`).toBeDefined();
      expect(role.roleBoundaries, `${role.id} boundary metadata`).toBeDefined();
      expect(role.knowledgeRequirements?.length, `${role.id} knowledge`).toBeGreaterThanOrEqual(3);
      expect(role.roleBoundaries?.length, `${role.id} boundary`).toBeGreaterThanOrEqual(1);
      role.knowledgeRequirements?.forEach((requirement) => {
        expect(requirement.topic.length).toBeGreaterThan(2);
        expect(requirement.expectation.length).toBeGreaterThan(20);
      });
    });
  });

  it('finds roles by common recruitment aliases and technology keywords', () => {
    expect(filterRoleSkillDefinitions({ searchText: 'Pre-Sales AV Designer', market: 'all', family: 'all' }).some((role) => role.id === 'av-systems-designer')).toBe(true);
    expect(filterRoleSkillDefinitions({ searchText: 'Terraform', market: 'it', family: 'all' }).some((role) => role.id === 'cloud-engineer')).toBe(true);
    expect(filterRoleSkillDefinitions({ searchText: 'SOC Analyst', market: 'it', family: 'all' }).some((role) => role.id === 'cyber-security-analyst')).toBe(true);
  });
});
