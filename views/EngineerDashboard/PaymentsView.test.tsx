import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Currency, ProfileTier } from '../../types';

const updateEngineerProfile = vi.fn().mockResolvedValue(undefined);

vi.mock('../../context/InteractionContext', () => ({
    useAppContext: () => ({ updateEngineerProfile }),
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
        fireEvent.click(screen.getByRole('button', { name: 'Confirm Gold' }));

        await waitFor(() => expect(updateEngineerProfile).toHaveBeenCalledWith({ profileTier: ProfileTier.SKILLS }));
        expect(screen.getByRole('status')).toHaveTextContent('Membership changed to Gold.');
    });

    it('makes the work-fee boundary explicit', () => {
        render(<PaymentsView profile={profile} setActiveView={vi.fn()} />);

        expect(screen.getByText('Zero commission')).toBeInTheDocument();
        expect(screen.getByText(/Applying never consumes credits/)).toBeInTheDocument();
    });
});
