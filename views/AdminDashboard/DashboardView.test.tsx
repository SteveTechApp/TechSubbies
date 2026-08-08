import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiService from '../../services/apiService';
import { getAdminSubscriptionBillingSummary } from '../../services/billingService';
import { DashboardView } from './DashboardView';

vi.mock('../../services/apiService', () => ({
    default: { getAdminPlatformMetrics: vi.fn() },
}));
vi.mock('../../services/billingService', () => ({
    getAdminSubscriptionBillingSummary: vi.fn(),
}));

describe('Admin DashboardView', () => {
    beforeEach(() => {
        vi.mocked(getAdminSubscriptionBillingSummary).mockResolvedValue({
            paidAccounts: 3,
            active: 2,
            trialing: 0,
            pastDue: 1,
            endingAtPeriodEnd: 0,
            ended: 0,
        });
    });

    it('renders live backend platform and subscription billing metrics', async () => {
        vi.mocked(apiService.getAdminPlatformMetrics).mockResolvedValue({
            users: { total: 42, engineers: 24, companies: 10, resourcingCompanies: 6, suspended: 2 },
            marketplace: {
                jobsTotal: 18,
                jobsActive: 7,
                applications: 31,
                contractsTotal: 12,
                contractsActive: 5,
            },
            privacyPending: 3,
            membershipPending: 0,
            pilotFunnel: { profilesUpdated: 8, jobsPosted: 4, applicationsSubmitted: 3, contractsCreated: 1 },
        });

        const setActiveView = vi.fn();
        render(<DashboardView setActiveView={setActiveView} />);

        expect(await screen.findByText('42')).toBeVisible();
        expect(screen.getByText('Registered Accounts')).toBeVisible();
        expect(screen.getByText('Active Jobs')).toBeVisible();
        expect(screen.getByText('Paid Memberships')).toBeVisible();
        expect(screen.getByText('Past-due memberships')).toBeVisible();
        expect(screen.getByText(/1 membership payment needs attention/i)).toBeVisible();
        expect(screen.getByText('Live operational data from the TechSubbies backend.')).toBeVisible();
        expect(screen.getByText('Commercial pilot funnel')).toBeVisible();
        expect(screen.getByText('Pilot conversion targets')).toBeVisible();
        expect(screen.getByText('Applications per job')).toBeVisible();
        expect(screen.getByText('0.8')).toBeVisible();
        expect(screen.getByText('33.3%')).toBeVisible();
        expect(screen.getByText('/ 15%')).toBeVisible();
        expect(screen.getByText('On target')).toBeVisible();
        expect(screen.getAllByText('Below target')).toHaveLength(2);

        await userEvent.click(screen.getByRole('button', { name: 'Review subscription billing' }));
        expect(setActiveView).toHaveBeenCalledWith('Subscription Billing');
    });

    it('shows backend failures instead of mock statistics', async () => {
        vi.mocked(apiService.getAdminPlatformMetrics).mockRejectedValue(new Error('Metrics unavailable'));
        render(<DashboardView setActiveView={vi.fn()} />);
        expect(await screen.findByRole('alert')).toHaveTextContent('Metrics unavailable');
    });
});
