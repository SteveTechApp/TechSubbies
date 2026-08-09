import { describe, expect, it } from 'vitest';
import { parseCompletionValidation, parseCompletionValidations } from './apiService';

const validation = {
  id: 'validation-1', contractId: 'contract-1', engineerId: 'engineer-1', validatorId: 'company-1', roleId: 'network-engineer',
  responsibilityMet: true, capabilitiesObserved: ['VLAN configuration'], unexpectedSupervisionRequired: false,
  wouldUseAgainForRole: true, comments: 'Delivered cleanly', createdAt: '2026-08-09T10:00:00Z',
};

describe('completion validation response parsing', () => {
  it('accepts evidence for the expected engineer and contract', () => {
    expect(parseCompletionValidation(validation, { contractId: 'contract-1' }).roleId).toBe('network-engineer');
    expect(parseCompletionValidations([validation], 'engineer-1')).toHaveLength(1);
  });

  it('rejects mismatched ownership and malformed evidence fields', () => {
    expect(() => parseCompletionValidation(validation, { contractId: 'contract-2' })).toThrow('Invalid completion validation response.');
    expect(() => parseCompletionValidations([validation], 'engineer-2')).toThrow('Invalid completion validation response.');
    expect(() => parseCompletionValidation({ ...validation, responsibilityMet: 'yes' })).toThrow('Invalid completion validation response.');
    expect(() => parseCompletionValidation({ ...validation, capabilitiesObserved: [42] })).toThrow('Invalid completion validation response.');
  });
});
