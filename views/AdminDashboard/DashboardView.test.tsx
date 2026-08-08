import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import apiService from '../../services/apiService';
import { DashboardView } from './DashboardView';

vi.mock('../../services/apiService', () => ({
    default: { getAdminPlatformMetrics: vi.fn() },
}));

describe('Admin DashboardView', () => {
    it('renders live backend platform metrics', async () => {
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
            membershipPending: 2,
            pilotFunnel: { profilesUpdated: 8, jobsPosted: 4, applicationsSubmitted: 3, contractsCreated: 1 },
        });

        const setActiveView = vi.fn();
        render(<DashboardView setActiveView={setActiveView} />);

        expect(await screen.findByText('42')).toBeVisible();
        expect(screen.getByText('Registered Accounts')).toBeVisible();
        expect(screen.getByText('Active Jobs')).toBeVisible();
        expect(screen.getByText('Pending privacy requests')).toBeVisible();
        expect(screen.getByText('Pending membership requests')).toBeVisible();
        expect(screen.getByText(/2 membership requests need verification/i)).toBeVisible();
        expect(screen.getByText('Live operational data from the TechSubbies backend.')).toBeVisible();
        expect(screen.getByText('Commercial pilot funnel')).toBeVisible();
        expect(screen.getByText('Pilot conversion targets')).toBeVisible();
        expect(screen.getByText('Applications per job')).toBeVisible();
        expect(screen.getByText('0.8')).toBeVisible();
        expect(screen.getByText('33.3%')).toBeVisible();
        expect(screen.getByText('/ 15%')).toBeVisible();
        expect(screen.getByText('On target')).toBeVisible();
        expect(screen.getAllByText('Below target')).toHaveLength(2);

        await userEvent.click(screen.getByRole('button', { name: 'Review membership requests' }));
        expect(setActiveView).toHaveBeenCalledWith('Membership Requests');
    });

    it('shows backend failures instead of mock statistics', async () => {
        vi.mocked(apiService.getAdminPlatformMetrics).mockRejectedValue(new Error('Metrics unavailable'));
        render(<DashboardView setActiveView={vi.fn()} />);
        expect(await screen.findByRole('alert')).toHaveTextContent('Metrics unavailable');
    });
});
