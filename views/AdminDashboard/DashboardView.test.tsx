import { render, screen } from '@testing-library/react';
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
        });

        render(<DashboardView setActiveView={vi.fn()} />);

        expect(await screen.findByText('42')).toBeVisible();
        expect(screen.getByText('Registered Accounts')).toBeVisible();
        expect(screen.getByText('Active Jobs')).toBeVisible();
        expect(screen.getByText('Pending privacy requests')).toBeVisible();
        expect(screen.getByText('Live operational data from the TechSubbies backend.')).toBeVisible();
    });

    it('shows backend failures instead of mock statistics', async () => {
        vi.mocked(apiService.getAdminPlatformMetrics).mockRejectedValue(new Error('Metrics unavailable'));
        render(<DashboardView setActiveView={vi.fn()} />);
        expect(await screen.findByRole('alert')).toHaveTextContent('Metrics unavailable');
    });
});
