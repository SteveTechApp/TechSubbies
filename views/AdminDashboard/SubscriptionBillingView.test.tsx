import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileTier } from '../../types';

const getAdminSubscriptionBillingSummary = vi.fn();
const listAdminSubscriptionBillingAccounts = vi.fn();

vi.mock('../../services/billingService', () => ({
    getAdminSubscriptionBillingSummary: (...args: unknown[]) => getAdminSubscriptionBillingSummary(...args),
    listAdminSubscriptionBillingAccounts: (...args: unknown[]) => listAdminSubscriptionBillingAccounts(...args),
}));

import { SubscriptionBillingView } from './SubscriptionBillingView';

describe('SubscriptionBillingView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        getAdminSubscriptionBillingSummary.mockResolvedValue({
            paidAccounts: 2,
            active: 1,
            trialing: 0,
            pastDue: 1,
            endingAtPeriodEnd: 0,
            ended: 0,
        });
        listAdminSubscriptionBillingAccounts.mockResolvedValue([
            {
                userId: 'eng-1',
                name: 'Active Engineer',
                email: 'active@example.com',
                tier: ProfileTier.SKILLS,
                status: 'active',
                currentPeriodEnd: '2026-09-08T00:00:00.000Z',
                cancelAtPeriodEnd: false,
                paymentIssue: false,
                lastPaymentFailedAt: null,
                updatedAt: '2026-08-08T00:00:00.000Z',
            },
            {
                userId: 'eng-2',
                name: 'Past Due Engineer',
                email: 'pastdue@example.com',
                tier: ProfileTier.PROFESSIONAL,
                status: 'past_due',
                currentPeriodEnd: '2026-09-08T00:00:00.000Z',
                cancelAtPeriodEnd: false,
                paymentIssue: true,
                lastPaymentFailedAt: '2026-08-08T00:00:00.000Z',
                updatedAt: '2026-08-08T00:00:00.000Z',
            },
        ]);
    });

    it('shows subscription status without offering manual entitlement activation', async () => {
        render(<SubscriptionBillingView />);

        expect(await screen.findByText('Subscription Billing')).toBeVisible();
        expect(screen.getByText('Active Engineer')).toBeVisible();
        expect(screen.getByText('Past Due Engineer')).toBeVisible();
        expect(screen.getByText(/1 membership payment needs attention/i)).toBeVisible();
        expect(screen.getByText(/operationally read-only/i)).toBeVisible();
        expect(screen.queryByRole('button', { name: /activate/i })).not.toBeInTheDocument();
    });

    it('reiterates that project payments are outside TechSubbies', async () => {
        render(<SubscriptionBillingView />);
        expect(await screen.findByText(/Subscription billing only/i)).toBeVisible();
        expect(screen.getByText(/does not process engineer project invoices/i)).toBeVisible();
    });
});
