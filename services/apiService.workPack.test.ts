import { describe, expect, it } from 'vitest';
import { parseTechnicalWorkPack } from './apiService';

const pack = {
  id: 'pack-1', contractId: 'contract-1', companyId: 'company-1', version: 2, roleId: 'network-engineer',
  responsibility: 'Deliver independently', scope: 'Configure and document the site network.', exclusions: ['Cabling replacement'],
  prerequisites: ['Cisco access'], siteContact: 'Sam Site', escalationContact: 'Alex PM', completionEvidence: ['Test results'],
  paymentNotice: 'Payment remains directly between the parties.', createdAt: '2026-08-09T10:00:00Z', updatedAt: '2026-08-09T11:00:00Z',
};

describe('technical work-pack response parsing', () => {
  it('accepts a complete work pack for the requested contract', () => {
    expect(parseTechnicalWorkPack(pack, 'contract-1').version).toBe(2);
  });

  it('rejects cross-contract, invalid-version, and malformed evidence data', () => {
    expect(() => parseTechnicalWorkPack(pack, 'contract-2')).toThrow('Invalid technical work-pack response.');
    expect(() => parseTechnicalWorkPack({ ...pack, version: 0 }, 'contract-1')).toThrow('Invalid technical work-pack response.');
    expect(() => parseTechnicalWorkPack({ ...pack, completionEvidence: [42] }, 'contract-1')).toThrow('Invalid technical work-pack response.');
  });
});
