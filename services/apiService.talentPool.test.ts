import { describe, expect, it } from 'vitest';
import { parseTalentPool, parseTalentPoolEntry } from './apiService';

const entry = {
  id: 'pool-1', ownerCompanyId: 'company-1', engineerId: 'engineer-1', engineerName: 'Engineer Example',
  list: 'preferred', approvedRoleIds: ['network-engineer'], privateNotes: 'Strong site feedback',
  createdAt: '2026-08-09T10:00:00Z', updatedAt: '2026-08-09T10:00:00Z',
};

describe('talent-pool response parsing', () => {
  it('accepts complete private talent-pool records', () => {
    expect(parseTalentPool([entry])).toHaveLength(1);
    expect(parseTalentPoolEntry(entry).privateNotes).toBe('Strong site feedback');
  });

  it('rejects invalid classifications, role identifiers, and list containers', () => {
    expect(() => parseTalentPoolEntry({ ...entry, list: 'public' })).toThrow('Invalid talent-pool response.');
    expect(() => parseTalentPoolEntry({ ...entry, approvedRoleIds: [42] })).toThrow('Invalid talent-pool response.');
    expect(() => parseTalentPool({ entries: [entry] })).toThrow('Invalid talent-pool response.');
  });
});
