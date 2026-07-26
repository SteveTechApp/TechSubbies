import { describe, it, expect } from 'vitest';
import { requiresLeadSupervision, hasLeadSupervisionConfirmed } from './leadSupervision';

describe('requiresLeadSupervision', () => {
  it('flags a junior experience level', () => {
    expect(requiresLeadSupervision({ experienceLevel: 'Junior' })).toBe(true);
    expect(requiresLeadSupervision({ experienceLevel: 'junior' })).toBe(true);
  });

  it('flags support-style role names regardless of experience level', () => {
    expect(requiresLeadSupervision({ jobRole: 'AV Labour Support', experienceLevel: 'Mid-level' })).toBe(true);
    expect(requiresLeadSupervision({ title: 'Site Support Assistant' })).toBe(true);
    expect(requiresLeadSupervision({ jobRole: 'Installation Helper' })).toBe(true);
  });

  it('does not flag a standard senior/lead role', () => {
    expect(requiresLeadSupervision({ jobRole: 'Senior AV Installer', experienceLevel: 'Senior' })).toBe(false);
    expect(requiresLeadSupervision({ title: 'Lead Network Engineer', experienceLevel: 'Expert' })).toBe(false);
  });
});

describe('hasLeadSupervisionConfirmed', () => {
  it('requires both a recognised arrangement and the disclaimer checkbox', () => {
    expect(hasLeadSupervisionConfirmed({ supervisionArrangement: 'supervised', supervisionDisclaimerAccepted: true })).toBe(true);
    expect(hasLeadSupervisionConfirmed({ supervisionArrangement: 'supervised', supervisionDisclaimerAccepted: false })).toBe(false);
    expect(hasLeadSupervisionConfirmed({ supervisionArrangement: '', supervisionDisclaimerAccepted: true })).toBe(false);
  });

  it('accepts any of the recognised arrangement values', () => {
    expect(hasLeadSupervisionConfirmed({ supervisionArrangement: 'lead_engineer_present', supervisionDisclaimerAccepted: true })).toBe(true);
    expect(hasLeadSupervisionConfirmed({ supervisionArrangement: 'qualified_engineer_present', supervisionDisclaimerAccepted: true })).toBe(true);
    expect(hasLeadSupervisionConfirmed({ supervisionArrangement: 'unsupervised', supervisionDisclaimerAccepted: true })).toBe(false);
  });
});
