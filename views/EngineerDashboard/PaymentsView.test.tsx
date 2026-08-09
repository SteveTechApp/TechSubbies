import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Currency, ProfileTier } from '../../types';

const getMembershipBillingState = vi.fn();
const createMembershipCheckout = vi.fn();
const createMembershipPortal = vi.fn();
const redirectToBillingUrl = vi.fn();

vi.mock('../../services/billingService', () => ({
    getMembershipBillingState: (...args: unknown[]) => getMembershipBillingState(...args),
    createMembershipCheckout: (...args: unknown[]) => createMembershipCheckout(...args),
    createMembershipPortal: (...args: unknown[]) => createMembershipPortal(...args),
    redirectToBillingUrl: (...args: unknown[]) => redirectToBillingUrl(...args),
}));

import { PaymentsView } from './PaymentsView';

const profile = {
    id: 'engineer-1',
    name: 'Alex Engineer',
    profileTier: ProfileTier.BASIC,
    currency: Currency.GBP,
} as any;

const freeBilling = {
    tier: ProfileTier.BASIC,
    status: 'free',
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    hasCustomer: false,
    hasSubscription: false,
    paymentIssue: false,
    lastPaymentFailedAt: null,
};

describe('PaymentsView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        getMembershipBillingState.mockResolvedValue(freeBilling);
        createMembershipCheckout.mockResolvedValue('https://checkout.stripe.test/session');
        createMembershipPortal.mockResolvedValue('https://billing.stripe.test/portal');
    });

    it('starts Stripe Checkout when a free member chooses a paid tier', async () => {
        render(<PaymentsView profile={profile} setActiveView={vi.fn()} />);

        await waitFor(() => expect(screen.getByRole('button', { name: 'Choose Membership' })).toBeEnabled());
        fireEvent.click(screen.getByRole('button', { name: 'Choose Membership' }));
        expect(screen.getByRole('dialog', { name: 'Choose your membership' })).toBeInTheDocument();
        expect(screen.getByText('£15/month')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Gold Skills Profile' }));
        fireEvent.click(screen.getByRole('button', { name: 'Continue with Gold' }));

        await waitFor(() => expect(createMembershipCheckout).toHaveBeenCalledWith(ProfileTier.SKILLS));
        expect(redirectToBillingUrl).toHaveBeenCalledWith('https://checkout.stripe.test/session');
    });

    it('makes the work-fee boundary explicit', async () => {
        render(<PaymentsView profile={profile} setActiveView={vi.fn()} />);
        await waitFor(() => expect(getMembershipBillingState).toHaveBeenCalled());

        expect(screen.getByText('Zero commission')).toBeInTheDocument();
        expect(screen.getByText(/Stripe is used only for TechSubbies membership subscriptions/i)).toBeInTheDocument();
        expect(screen.getByText(/TechSubbies never holds project funds/i)).toBeInTheDocument();
    });

    it('opens Stripe Billing Management for an existing subscriber', async () => {
        getMembershipBillingState.mockResolvedValue({
            ...freeBilling,
            tier: ProfileTier.SKILLS,
            status: 'active',
            hasCustomer: true,
            hasSubscription: true,
            currentPeriodEnd: '2026-09-08T00:00:00.000Z',
        });

        render(<PaymentsView profile={{ ...profile, profileTier: ProfileTier.SKILLS }} setActiveView={vi.fn()} />);
        await waitFor(() => expect(screen.getByRole('button', { name: 'Manage Membership' })).toBeEnabled());
        fireEvent.click(screen.getByRole('button', { name: 'Manage Membership' }));

        await waitFor(() => expect(createMembershipPortal).toHaveBeenCalled());
        expect(redirectToBillingUrl).toHaveBeenCalledWith('https://billing.stripe.test/portal');
    });

    it('surfaces a failed renewal without immediately removing paid access', async () => {
        getMembershipBillingState.mockResolvedValue({
            ...freeBilling,
            tier: ProfileTier.SKILLS,
            status: 'past_due',
            hasCustomer: true,
            hasSubscription: true,
            paymentIssue: true,
            lastPaymentFailedAt: '2026-08-08T12:00:00.000Z',
        });

        render(<PaymentsView profile={{ ...profile, profileTier: ProfileTier.SKILLS }} setActiveView={vi.fn()} />);

        expect(await screen.findByText(/latest membership renewal payment failed/i)).toBeVisible();
        expect(screen.getByText(/paid features remain available while Stripe retries/i)).toBeVisible();
        fireEvent.click(screen.getByRole('button', { name: 'Update payment method' }));
        await waitFor(() => expect(createMembershipPortal).toHaveBeenCalled());
    });
});
