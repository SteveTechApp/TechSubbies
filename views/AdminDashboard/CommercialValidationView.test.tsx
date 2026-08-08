import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getCommercialValidationSummary: vi.fn(),
  listCommercialDecisions: vi.fn(),
  createCommercialDecision: vi.fn(),
  updateCommercialDecisionStatus: vi.fn(),
}));

vi.mock('../../services/commercialValidationService', () => mocks);

import { CommercialValidationView } from './CommercialValidationView';

const role = (name: 'Engineer' | 'Company' | 'Resourcing Company', ready: boolean, billingAvailable = name === 'Engineer') => ({
  role: name,
  stage: ready ? 'cohort-test-ready' as const : 'insufficient-evidence' as const,
  readyForCohortTest: ready,
  research: {
    responses: ready ? 12 : 2,
    averageValueScore: 4,
    averageLikelihoodToPay: 4,
    likelyToPayRate: 0.5,
    medianPriceGoodValue: 15,
    medianPriceExpensive: 30,
  },
  marketplace: { engagedAccounts90d: ready ? 6 : 1, primaryActions90d: 8, bookings90d: 2 },
  billing: { capabilityAvailable: billingAvailable, paidAccounts: billingAvailable ? 2 : 0, activeOrTrialing: billingAvailable ? 2 : 0, pastDue: 0, endingAtPeriodEnd: 0 },
  gates: { researchSample: ready, marketplaceUsage: ready, statedIntent: true, observedBilling: billingAvailable ? false : null },
  researchPriceBand: { lowerMonthly: 15, upperMonthly: 30 },
  blockers: ready ? [] : ['Need more evidence.'],
});

const summary = {
  generatedAt: '2026-08-08T20:30:00.000Z',
  thresholds: { pricingResponses: 10, engagedAccounts90d: 5, statedLikelyToPayRate: 0.4, averageValueScore: 3.5, engineerObservedPaidAccounts: 3 },
  roles: [role('Engineer', true), role('Company', false, false), role('Resourcing Company', false, false)],
};

describe('CommercialValidationView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCommercialValidationSummary.mockResolvedValue(summary);
    mocks.listCommercialDecisions.mockResolvedValue([]);
    mocks.createCommercialDecision.mockResolvedValue({
      id: 'decision-1',
      accountRole: 'Engineer',
      packageName: 'Engineer pilot',
      candidateMonthlyPrice: 15,
      candidateAnnualPrice: null,
      valueDrivers: ['better-matching'],
      status: 'draft',
      evidenceSnapshot: null,
      decisionNote: null,
      createdAt: '2026-08-08T20:30:00.000Z',
      updatedAt: '2026-08-08T20:30:00.000Z',
      decidedAt: null,
    });
  });

  it('shows role-specific evidence and distinguishes unavailable billing evidence', async () => {
    render(<CommercialValidationView />);

    expect(await screen.findByText('Commercial Validation')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Engineer' })).toBeInTheDocument();
    expect(screen.getAllByText('Company').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Unavailable').length).toBeGreaterThan(0);
    expect(screen.getByText(/never changes live Stripe prices/i)).toBeInTheDocument();
  });

  it('records a package hypothesis without publishing pricing', async () => {
    render(<CommercialValidationView />);
    await screen.findByText('Commercial Validation');

    fireEvent.change(screen.getByLabelText('Package name'), { target: { value: 'Engineer pilot' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save hypothesis' }));

    await waitFor(() => expect(mocks.createCommercialDecision).toHaveBeenCalledWith({
      accountRole: 'Engineer',
      packageName: 'Engineer pilot',
      candidateMonthlyPrice: 15,
      candidateAnnualPrice: null,
      valueDrivers: ['better-matching'],
    }));
    expect(await screen.findByText('Engineer pilot')).toBeInTheDocument();
  });
});
