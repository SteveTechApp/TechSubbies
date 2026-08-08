import React, { useEffect, useState } from 'react';
import {
    getAdminSubscriptionBillingSummary,
    listAdminSubscriptionBillingAccounts,
    type AdminSubscriptionBillingAccount,
    type AdminSubscriptionBillingSummary,
} from '../../services/billingService';

const statusClass = (status: string) => {
    if (status === 'active' || status === 'trialing') return 'bg-green-100 text-green-800';
    if (status === 'past_due') return 'bg-amber-100 text-amber-900';
    if (status === 'unpaid' || status === 'canceled' || status === 'incomplete_expired') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-700';
};

const formatDate = (value: string | null) => value
    ? new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

export const SubscriptionBillingView = () => {
    const [summary, setSummary] = useState<AdminSubscriptionBillingSummary | null>(null);
    const [accounts, setAccounts] = useState<AdminSubscriptionBillingAccount[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            getAdminSubscriptionBillingSummary(),
            listAdminSubscriptionBillingAccounts(),
        ])
            .then(([nextSummary, nextAccounts]) => {
                setSummary(nextSummary);
                setAccounts(nextAccounts);
            })
            .catch((reason) => setError(reason instanceof Error ? reason.message : 'Could not load subscription billing.'));
    }, []);

    if (error) {
        return <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>;
    }
    if (!summary) return <p className="text-gray-600">Loading subscription billing…</p>;

    return (
        <div>
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-900">Subscription Billing</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Stripe subscription status controls paid TechSubbies membership entitlements. Admin cannot manually activate a paid tier.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-lg bg-white p-4 shadow">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Paid billing accounts</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{summary.paidAccounts}</p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Active / trial</p>
                    <p className="mt-2 text-3xl font-bold text-green-700">{summary.active + summary.trialing}</p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Payment attention</p>
                    <p className="mt-2 text-3xl font-bold text-amber-700">{summary.pastDue}</p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Ending at period end</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{summary.endingAtPeriodEnd}</p>
                </div>
            </div>

            {summary.pastDue > 0 && (
                <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                    <strong>{summary.pastDue} membership {summary.pastDue === 1 ? 'payment needs' : 'payments need'} attention.</strong>
                    <span className="ml-1">Paid access remains available while Stripe retries payment.</span>
                </div>
            )}

            <div className="mt-5 overflow-hidden rounded-lg bg-white shadow">
                <div className="border-b border-gray-200 px-5 py-4">
                    <h2 className="font-bold text-gray-900">Stripe membership accounts</h2>
                    <p className="mt-1 text-xs text-gray-500">Provider events are reconciled automatically; this screen is operationally read-only.</p>
                </div>
                {accounts.length === 0 ? (
                    <p className="p-6 text-center text-sm text-gray-500">No paid subscription billing accounts yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-5 py-3">Member</th>
                                    <th className="px-5 py-3">Tier</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Renewal / end</th>
                                    <th className="px-5 py-3">Billing note</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {accounts.map(account => (
                                    <tr key={account.userId}>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-gray-900">{account.name}</p>
                                            <p className="text-xs text-gray-500">{account.email}</p>
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-gray-900">{account.tier}</td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusClass(account.status)}`}>
                                                {account.status.replaceAll('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-700">{formatDate(account.currentPeriodEnd)}</td>
                                        <td className="px-5 py-4 text-xs text-gray-600">
                                            {account.paymentIssue
                                                ? 'Payment retry in progress'
                                                : account.cancelAtPeriodEnd
                                                    ? 'Cancels at period end'
                                                    : 'Webhook reconciled'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                <strong>Subscription billing only.</strong> TechSubbies does not process engineer project invoices, hold project funds, provide escrow, or deduct commission from work fees.
            </div>
        </div>
    );
};
