import { describe, expect, it } from 'vitest';
import { scoreOpportunityCandidate } from './opportunityMatchEngine';
import type { CandidateSkillProfile, OpportunityRequirement } from '../types/opportunityMatching';

const candidate: CandidateSkillProfile = { id: 'e1', displayName: 'Engineer', market: 'AV', roleIds: [], roleTitles: [], skills: ['signal flow'], productExperience: { crestron: 'programmed' }, generalSectors: ['AV'], acceptsLowResponsibilityWork: true };

describe('role, sector and prerequisite boundaries', () => {
  it('does not treat a general AV profile or skill as a specialist programmer role', () => {
    const job: OpportunityRequirement = { id: 'j1', title: 'Control programmer', market: 'AV', roleIds: ['av-control-systems-programmer'], summary: '', locationMode: 'onsite', skillRequirements: [{ id: 's', label: 'signal flow', priority: 'must-have' }], productRequirements: [{ tagId: 'crestron', label: 'Crestron', minimumLevel: 'programmed', priority: 'must-have' }] };
    expect(scoreOpportunityCandidate(job, candidate).outcome).toBe('NO MATCH');
  });

  it('includes the free profile for genuinely general sector work unless opted out', () => {
    const job: OpportunityRequirement = { id: 'j2', title: 'General AV support', market: 'AV', roleIds: [], generalSectorOpportunity: true, responsibilityLevel: 'basic-support', summary: '', locationMode: 'onsite', skillRequirements: [], productRequirements: [] };
    expect(scoreOpportunityCandidate(job, candidate).roleFitScore).toBe(70);
    expect(scoreOpportunityCandidate(job, { ...candidate, acceptsLowResponsibilityWork: false }).roleFitScore).not.toBe(70);
  });

  it('hard-excludes a candidate below a manufacturer prerequisite', () => {
    const job: OpportunityRequirement = { id: 'j3', title: 'Crestron programmer', market: 'AV', roleIds: ['av-control-systems-programmer'], summary: '', locationMode: 'onsite', skillRequirements: [], productRequirements: [{ tagId: 'crestron', label: 'Crestron', minimumLevel: 'programmed', priority: 'must-have', isPrerequisite: true }] };
    const specialist = { ...candidate, roleIds: ['av-control-systems-programmer'], productExperience: { crestron: 'installed' as const } };
    expect(scoreOpportunityCandidate(job, specialist).outcome).toBe('NO MATCH');
  });
});
