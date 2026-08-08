import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getAdminSubscriptionBillingSummary: vi.fn(),
  getAdminPricingResearchSummary: vi.fn(),
}));

vi.mock('../../services/billingService', () => ({
  getAdminSubscriptionBillingSummary: mocks.getAdminSubscriptionBillingSummary,
}));

vi.mock('../../services/pricingResearchService', () => ({
  getAdminPricingResearchSummary: mocks.getAdminPricingResearchSummary,
}));

import { MonetizationView } from './MonetizationView';

const segment = (role: 'Engineer' | 'Company' | 'Resourcing Company', price: number) => ({
  role,
  responses: 2,
  averageValueScore: 4,
  averageLikelihoodToPay: 4,
  likelyToPayResponses: 1,
  likelyToPayRate: 0.5,
  medianPriceTooCheap: 5,
  medianPriceGoodValue: price,
  medianPriceExpensive: price + 20,
  medianPriceTooExpensive: price + 40,
  preferredBilling: { monthly: 1, annual: 0, either: 1 },
  topValueDrivers: [{ driver: 'better-matching' as const, responses: 2 }],
  blockers: [{ blocker: 'need-proof-of-value' as const, responses: 1 }],
});

describe('MonetizationView', () => {
  beforeEach(() => {
    mocks.getAdminSubscriptionBillingSummary.mockResolvedValue({
      paidAccounts: 4,
      active: 3,
      trialing: 1,
      pastDue: 0,
      endingAtPeriodEnd: 0,
      ended: 0,
    });
    mocks.getAdminPricingResearchSummary.mockResolvedValue({
      totalResponses: 6,
      generatedAt: '2026-08-08T18:00:00.000Z',
      segments: [segment('Engineer', 15), segment('Company', 40), segment('Resourcing Company', 60)],
    });
  });

  it('separates actual paid accounts from stated willingness-to-pay evidence', async () => {
    render(<MonetizationView />);

    expect(await screen.findByText('Monetization Evidence')).toBeInTheDocument();
    expect(screen.getByText('Active / Trial Paid Accounts')).toBeInTheDocument();
    expect(screen.getByText('Pricing Research Responses')).toBeInTheDocument();
    expect(screen.getByText(/survey intent is research evidence, not booked revenue/i)).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('£40')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
