import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiService from '../../services/apiService';
import { UserManagementView } from './UserManagementView';

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({ user: { id: 'admin-1' } }),
}));

vi.mock('../../services/apiService', () => ({
    default: {
        listAdminUsers: vi.fn(),
        setAdminUserSuspension: vi.fn(),
    },
}));

const account = {
    id: 'member-1',
    email: 'member@example.com',
    role: 'Engineer',
    name: 'Marketplace Member',
    emailVerified: 1,
    suspendedAt: null,
    suspensionReason: null,
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
};

describe('UserManagementView', () => {
    beforeEach(() => {
        vi.mocked(apiService.listAdminUsers).mockResolvedValue({
            users: [account],
            total: 1,
            limit: 25,
            offset: 0,
        });
        vi.mocked(apiService.setAdminUserSuspension).mockResolvedValue({
            user: {
                ...account,
                suspendedAt: '2026-07-27T12:00:00.000Z',
                suspensionReason: 'Repeated marketplace policy violations.',
            },
            notificationSent: true,
        });
    });

    it('loads real accounts and requires a reason before suspension', async () => {
        const user = userEvent.setup();
        render(<UserManagementView />);

        expect(await screen.findByText('Marketplace Member')).toBeVisible();
        await user.click(screen.getByRole('button', { name: 'Suspend account' }));
        expect(screen.getByRole('alert')).toHaveTextContent(/at least 10 characters/i);
        expect(apiService.setAdminUserSuspension).not.toHaveBeenCalled();

        await user.type(screen.getByLabelText('Suspension reason'), 'Repeated marketplace policy violations.');
        await user.click(screen.getByRole('button', { name: 'Suspend account' }));

        await waitFor(() => expect(apiService.setAdminUserSuspension).toHaveBeenCalledWith(
            'member-1',
            true,
            'Repeated marketplace policy violations.'
        ));
        expect(await screen.findByText('Suspended')).toBeVisible();
        expect(screen.getByRole('status')).toHaveTextContent(/sessions were revoked/i);
        expect(screen.getByRole('status')).toHaveTextContent(/notification email was sent/i);
    });

    it('submits server-side account searches', async () => {
        const user = userEvent.setup();
        render(<UserManagementView />);
        await screen.findByText('Marketplace Member');

        await user.type(screen.getByLabelText('Search accounts'), 'member@example.com');
        await user.click(screen.getByRole('button', { name: 'Search' }));

        await waitFor(() => expect(apiService.listAdminUsers).toHaveBeenLastCalledWith({
            limit: 25,
            offset: 0,
            query: 'member@example.com',
        }));
    });
});
