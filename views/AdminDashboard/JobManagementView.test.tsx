import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiService from '../../services/apiService';
import { JobManagementView } from './JobManagementView';

vi.mock('../../services/apiService', () => ({
    default: {
        listAdminJobs: vi.fn(),
        moderateAdminJob: vi.fn(),
    },
}));

const job = {
    id: 'job-1',
    companyId: 'company-1',
    title: 'Broadcast Systems Engineer',
    description: 'Commission a control system.',
    location: 'London',
    dayRate: '500',
    currency: '£',
    startDate: null,
    status: 'active',
    postedDate: '2026-07-01T00:00:00.000Z',
    companyName: 'Broadcast Company',
    companyEmail: 'broadcast@example.com',
    moderatedAt: null,
    moderationReason: null,
};

describe('JobManagementView', () => {
    beforeEach(() => {
        vi.mocked(apiService.listAdminJobs).mockResolvedValue({ jobs: [job], total: 1, limit: 25, offset: 0 });
        vi.mocked(apiService.moderateAdminJob).mockResolvedValue({
            ...job,
            status: 'closed',
            moderatedAt: '2026-07-27T12:00:00.000Z',
            moderationReason: 'Listing breaches marketplace posting standards.',
        });
    });

    it('loads real jobs and requires a reason before closure', async () => {
        const user = userEvent.setup();
        render(<JobManagementView setActiveView={vi.fn()} />);

        expect(await screen.findByText('Broadcast Systems Engineer')).toBeVisible();
        await user.click(screen.getByRole('button', { name: 'Close listing' }));
        expect(screen.getByRole('alert')).toHaveTextContent(/at least 10 characters/i);
        expect(apiService.moderateAdminJob).not.toHaveBeenCalled();

        await user.type(screen.getByLabelText('Closure reason'), 'Listing breaches marketplace posting standards.');
        await user.click(screen.getByRole('button', { name: 'Close listing' }));
        await waitFor(() => expect(apiService.moderateAdminJob).toHaveBeenCalledWith(
            'job-1',
            'closed',
            'Listing breaches marketplace posting standards.'
        ));
        expect(await screen.findByText('closed')).toBeVisible();
        expect(screen.getByRole('status')).toHaveTextContent(/removed from public search/i);
    });

    it('submits server-side searches', async () => {
        const user = userEvent.setup();
        render(<JobManagementView setActiveView={vi.fn()} />);
        await screen.findByText('Broadcast Systems Engineer');
        await user.type(screen.getByLabelText('Search job listings'), 'broadcast');
        await user.click(screen.getByRole('button', { name: 'Search' }));
        await waitFor(() => expect(apiService.listAdminJobs).toHaveBeenLastCalledWith({
            limit: 25,
            offset: 0,
            query: 'broadcast',
        }));
    });
});
