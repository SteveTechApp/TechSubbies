import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PricingResearchInput } from '../services/pricingResearchService';

const mocks = vi.hoisted(() => ({
  getMyPricingResearchResponse: vi.fn(),
  saveMyPricingResearchResponse: vi.fn(),
}));

vi.mock('../services/pricingResearchService', () => ({
  getMyPricingResearchResponse: mocks.getMyPricingResearchResponse,
  saveMyPricingResearchResponse: mocks.saveMyPricingResearchResponse,
}));

import { PricingResearchView } from './PricingResearchView';

const savedResponse = {
  id: 'pricing-1',
  userId: 'user-1',
  accountRole: 'Engineer' as const,
  valueScore: 4,
  likelihoodToPay: 4,
  priceTooCheap: 5,
  priceGoodValue: 15,
  priceExpensive: 35,
  priceTooExpensive: 60,
  preferredBilling: 'monthly' as const,
  valueDrivers: ['better-matching'] as const,
  primaryBlocker: 'need-proof-of-value' as const,
  createdAt: '2026-08-08T17:00:00.000Z',
  updatedAt: '2026-08-08T17:00:00.000Z',
};

describe('PricingResearchView', () => {
  beforeEach(() => {
    mocks.getMyPricingResearchResponse.mockReset();
    mocks.saveMyPricingResearchResponse.mockReset();
    mocks.getMyPricingResearchResponse.mockResolvedValue(savedResponse);
    mocks.saveMyPricingResearchResponse.mockImplementation(async (input: PricingResearchInput) => ({
      ...savedResponse,
      ...input,
      updatedAt: '2026-08-08T18:00:00.000Z',
    }));
  });

  it('loads the current response and saves updated structured pricing feedback', async () => {
    render(<PricingResearchView />);
    expect(await screen.findByText('Pricing Research')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Good value'), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText('Likelihood to pay'), { target: { value: '5' } });
    fireEvent.click(screen.getByLabelText('Verified talent'));
    fireEvent.click(screen.getByRole('button', { name: 'Save pricing feedback' }));

    await waitFor(() => expect(mocks.saveMyPricingResearchResponse).toHaveBeenCalledTimes(1));
    const payload = mocks.saveMyPricingResearchResponse.mock.calls[0][0] as PricingResearchInput;
    expect(payload.priceGoodValue).toBe(20);
    expect(payload.likelihoodToPay).toBe(5);
    expect(payload.valueDrivers).toEqual(expect.arrayContaining(['better-matching', 'verified-talent']));
    expect(await screen.findByText(/pricing feedback saved/i)).toBeInTheDocument();
  });

  it('blocks contradictory price thresholds before submission', async () => {
    render(<PricingResearchView />);
    await screen.findByText('Pricing Research');

    fireEvent.change(screen.getByLabelText('Good value'), { target: { value: '50' } });
    expect(screen.getByText(/must increase from left to right/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save pricing feedback' })).toBeDisabled();
  });
});
