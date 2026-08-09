import { describe, expect, it } from 'vitest';
import { parseContractContact } from './apiService';

const contact = {
  contractId: 'contract-1',
  partyId: 'engineer-1',
  name: 'Engineer Example',
  role: 'Engineer',
  contact: { email: 'engineer@example.com', phone: '07000000000', website: 'https://example.com' },
};

describe('contract contact response parsing', () => {
  it('accepts the authorised party contact for the requested contract', () => {
    expect(parseContractContact(contact, 'contract-1')).toEqual(contact);
  });

  it('rejects cross-contract, partial, and unsafe contact responses', () => {
    expect(() => parseContractContact(contact, 'contract-2')).toThrow('Invalid contract contact response.');
    expect(() => parseContractContact({ ...contact, partyId: undefined }, 'contract-1')).toThrow('Invalid contract contact response.');
    expect(() => parseContractContact({ ...contact, contact: { website: 'javascript:alert(1)' } }, 'contract-1')).toThrow('Invalid contract contact response.');
  });
});
