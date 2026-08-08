import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getAdminMarketplaceAnalytics: vi.fn(),
}));

vi.mock('../../services/marketplaceAnalyticsService', () => ({
  getAdminMarketplaceAnalytics: mocks.getAdminMarketplaceAnalytics,
}));

import { MarketplaceAnalyticsView } from './MarketplaceAnalyticsView';

const summary = {
  windowDays: 30 as const,
  generatedAt: '2026-08-08T17:00:00.000Z',
  stages: { searches: 20, profileViews: 30, invitations: 6, applications: 10, bookings: 3 },
  actors: { uniqueSearchers: 8, uniqueProfileViewers: 7, uniqueApplicants: 9, uniqueBookers: 3 },
  conversion: { profileViewsPerSearch: 1.5, invitationRateFromViews: 0.2, applicationToBookingRate: 0.3 },
  repeatBooking: { bookingPairs: 3, repeatBookingPairs: 1, repeatBookingRate: 1 / 3 },
  retention30d: { eligibleUsers: 4, retainedUsers: 2, rate: 0.5 },
};

describe('MarketplaceAnalyticsView', () => {
  it('renders funnel, repeat booking and retention metrics', async () => {
    mocks.getAdminMarketplaceAnalytics.mockResolvedValue(summary);
    render(<MarketplaceAnalyticsView />);

    expect(await screen.findByText('Marketplace Analytics')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('Repeat booking')).toBeInTheDocument();
    expect(screen.getByText('30-day retention')).toBeInTheDocument();
  });

  it('reloads the requested time window', async () => {
    mocks.getAdminMarketplaceAnalytics.mockResolvedValue(summary);
    render(<MarketplaceAnalyticsView />);
    await screen.findByText('Marketplace Analytics');

    fireEvent.click(screen.getByRole('button', { name: '90 days' }));
    await waitFor(() => expect(mocks.getAdminMarketplaceAnalytics).toHaveBeenLastCalledWith(90));
  });
});
