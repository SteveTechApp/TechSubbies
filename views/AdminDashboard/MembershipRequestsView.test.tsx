import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiService from '../../services/apiService';
import { ProfileTier } from '../../types';
import { MembershipRequestsView } from './MembershipRequestsView';

vi.mock('../../services/apiService', () => ({
    default: {
        listAdminMembershipSelections: vi.fn(),
        confirmAdminMembershipSelection: vi.fn(),
    },
}));

const selection = {
    userId: 'engineer-1',
    email: 'engineer@example.com',
    name: 'Test Engineer',
    activeTier: ProfileTier.BASIC,
    requestedTier: ProfileTier.SKILLS,
    requestedAt: '2026-07-27T12:00:00.000Z',
};

describe('MembershipRequestsView', () => {
    beforeEach(() => {
        vi.mocked(apiService.listAdminMembershipSelections).mockResolvedValue([selection]);
        vi.mocked(apiService.confirmAdminMembershipSelection).mockResolvedValue({
            userId: selection.userId,
            activeTier: ProfileTier.SKILLS,
            notificationSent: true,
        });
        vi.spyOn(window, 'confirm').mockReturnValue(true);
    });

    it('lists pending plan selections and activates one after confirmation', async () => {
        const user = userEvent.setup();
        render(<MembershipRequestsView />);

        expect(await screen.findByText('Test Engineer')).toBeVisible();
        expect(screen.getByText('engineer@example.com')).toBeVisible();
        await user.click(screen.getByRole('button', { name: 'Verify billing and activate' }));

        expect(window.confirm).toHaveBeenCalledWith(expect.stringMatching(/external billing has been verified/i));
        await waitFor(() => expect(apiService.confirmAdminMembershipSelection).toHaveBeenCalledWith('engineer-1'));
        expect(await screen.findByRole('status')).toHaveTextContent(/Gold membership is now active/i);
        expect(screen.getByRole('status')).toHaveTextContent(/confirmation email was sent/i);
        expect(screen.queryByText('engineer@example.com')).not.toBeInTheDocument();
    });

    it('shows a clear empty state', async () => {
        vi.mocked(apiService.listAdminMembershipSelections).mockResolvedValue([]);
        render(<MembershipRequestsView />);
        expect(await screen.findByText(/No membership requests awaiting verification/i)).toBeVisible();
    });
});
