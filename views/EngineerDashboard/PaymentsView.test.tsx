import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Currency, ProfileTier } from '../../types';

const requestMembershipChange = vi.fn().mockResolvedValue(undefined);
const cancelMembershipChange = vi.fn().mockResolvedValue(undefined);

vi.mock('../../context/InteractionContext', () => ({
    useAppContext: () => ({ requestMembershipChange, cancelMembershipChange }),
}));

import { PaymentsView } from './PaymentsView';

const profile = {
    id: 'engineer-1',
    name: 'Alex Engineer',
    profileTier: ProfileTier.BASIC,
    currency: Currency.GBP,
} as any;

describe('PaymentsView', () => {
    it('compares plans and updates the selected membership', async () => {
        render(<PaymentsView profile={profile} setActiveView={vi.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: 'Change Membership' }));
        expect(screen.getByRole('dialog', { name: 'Choose your membership' })).toBeInTheDocument();
        expect(screen.getByText('£15/month')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /Gold Skills Profile/ }));
        fireEvent.click(screen.getByRole('button', { name: 'Request Gold' }));

        await waitFor(() => expect(requestMembershipChange).toHaveBeenCalledWith(ProfileTier.SKILLS));
        expect(screen.getByRole('status')).toHaveTextContent('Gold selected. Your active plan remains Bronze until billing is confirmed.');
    });

    it('makes the work-fee boundary explicit', () => {
        render(<PaymentsView profile={profile} setActiveView={vi.fn()} />);

        expect(screen.getByText('Zero commission')).toBeInTheDocument();
        expect(screen.getByText(/Applying never consumes credits/)).toBeInTheDocument();
    });

    it('shows pending and activated membership lifecycle dates', () => {
        const { rerender } = render(
            <PaymentsView
                profile={{
                    ...profile,
                    requestedProfileTier: ProfileTier.SKILLS,
                    membershipRequestedAt: '2026-07-27T12:00:00.000Z',
                }}
                setActiveView={vi.fn()}
            />
        );

        expect(screen.getByText(/Gold selected · awaiting billing confirmation/i)).toBeVisible();
        expect(screen.getByText(/Your current membership remains active/i)).toBeVisible();

        rerender(
            <PaymentsView
                profile={{
                    ...profile,
                    profileTier: ProfileTier.SKILLS,
                    membershipActivatedAt: '2026-07-28T12:00:00.000Z',
                }}
                setActiveView={vi.fn()}
            />
        );
        expect(screen.getByText(/Active since/i)).toBeVisible();
    });

    it('allows a pending selection to be cancelled without changing the active plan', async () => {
        render(
            <PaymentsView
                profile={{
                    ...profile,
                    requestedProfileTier: ProfileTier.SKILLS,
                    membershipRequestedAt: '2026-07-27T12:00:00.000Z',
                }}
                setActiveView={vi.fn()}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Cancel pending selection' }));
        await waitFor(() => expect(cancelMembershipChange).toHaveBeenCalled());
        expect(screen.getByRole('status')).toHaveTextContent(/current plan is unchanged/i);
    });
});
