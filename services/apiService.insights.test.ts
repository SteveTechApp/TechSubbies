import { describe, expect, it } from 'vitest';
import { parseCompanyAudit, parseProjectTeam, parseWorkforceInsights } from './apiService';

const insights = {
  totals: { jobs: 1, applications: 2, contracts: 1, completedContracts: 0, validations: 0, positiveValidations: 0 },
  conversion: { applicationsPerJob: 2, applicationToContractPercent: 50, contractCompletionPercent: 0 },
  availability: { freshnessPercent: 75 },
  roleDemand: [{ roleId: 'network-engineer', count: 1 }],
  privacyNotice: 'Aggregated company data.',
};

describe('company intelligence response parsing', () => {
  it('accepts complete workforce insight and audit DTOs', () => {
    expect(parseWorkforceInsights(insights).roleDemand[0].count).toBe(1);
    expect(parseCompanyAudit([{ id: 'a1', companyId: 'c1', actorId: 'u1', action: 'post.job', entityType: 'job', entityId: 'j1', createdAt: '2026-08-09T10:00:00Z' }])).toHaveLength(1);
  });

  it('rejects malformed nested metrics and partial audit events', () => {
    expect(() => parseWorkforceInsights({ ...insights, availability: { freshnessPercent: '75' } })).toThrow('Invalid workforce insights response.');
    expect(() => parseCompanyAudit([{ id: 'a1' }])).toThrow('Invalid company audit response.');
  });

  it('validates persisted project-team responses', () => {
    const team = { id: 't1', companyId: 'c1', name: 'Site delivery', requiredRoleIds: ['network-engineer'], members: [{ engineerId: 'e1', roleIds: ['network-engineer'] }], createdAt: '2026-08-09T10:00:00Z' };
    expect(parseProjectTeam(team).members[0].engineerId).toBe('e1');
    expect(() => parseProjectTeam({ ...team, members: [{ engineerId: 'e1' }] })).toThrow('Invalid project team response.');
  });
});
