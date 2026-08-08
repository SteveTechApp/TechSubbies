import React, { useEffect, useState } from 'react';
import { EngineerProfile, ProfileTier } from '../../types';
import { ArrowLeft, CheckCircle, CreditCard, DollarSign, ShieldCheck, X } from '../../components/Icons';
import {
    formatMonthlyMembershipPrice,
    MEMBERSHIP_PLAN_BY_TIER,
    MEMBERSHIP_PLANS,
} from '../../data/membershipPlans';
import {
    createMembershipCheckout,
    createMembershipPortal,
    getMembershipBillingState,
    redirectToBillingUrl,
    type MembershipBillingState,
} from '../../services/billingService';

interface PaymentsViewProps {
    profile: EngineerProfile;
    setActiveView: (view: string) => void;
}

const billingStatusText = (billing: MembershipBillingState | null) => {
    if (!billing || billing.status === 'free') return 'Free membership';
    if (billing.status === 'active') return 'Active';
    if (billing.status === 'trialing') return 'Trial active';
    if (billing.status === 'past_due') return 'Payment needs attention';
    if (billing.status === 'canceled') return 'Cancelled';
    if (billing.status === 'unpaid') return 'Payment ended';
    if (billing.status === 'paused') return 'Paused';
    return 'Pending activation';
};

const formatBillingDate = (value: string | null) => value
    ? new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

export const PaymentsView = ({ profile, setActiveView }: PaymentsViewProps) => {
    const [billing, setBilling] = useState<MembershipBillingState | null>(null);
    const [isLoadingBilling, setIsLoadingBilling] = useState(true);
    const [isManaging, setIsManaging] = useState(false);
    const [selectedTier, setSelectedTier] = useState<ProfileTier>(
        profile.profileTier === ProfileTier.BASIC ? ProfileTier.PROFESSIONAL : profile.profileTier
    );
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const currentPlan = MEMBERSHIP_PLAN_BY_TIER[profile.profileTier];
    const selectedPlan = MEMBERSHIP_PLAN_BY_TIER[selectedTier];

    useEffect(() => {
        let cancelled = false;
        setIsLoadingBilling(true);
        getMembershipBillingState()
            .then(state => {
                if (!cancelled) setBilling(state);
            })
            .catch(() => {
                if (!cancelled) setMessage('Membership billing status could not be loaded.');
            })
            .finally(() => {
                if (!cancelled) setIsLoadingBilling(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const closeManager = () => {
        setSelectedTier(profile.profileTier === ProfileTier.BASIC ? ProfileTier.PROFESSIONAL : profile.profileTier);
        setIsManaging(false);
    };

    const openBillingPortal = async () => {
        setIsSaving(true);
        setMessage('');
        try {
            const url = await createMembershipPortal();
            redirectToBillingUrl(url);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Billing management could not be opened.');
            setIsSaving(false);
        }
    };

    const changeMembership = () => {
        if (billing?.hasCustomer) {
            void openBillingPortal();
            return;
        }
        setIsManaging(true);
    };

    const confirmMembership = async () => {
        if (selectedTier === ProfileTier.BASIC) {
            setMessage('Bronze is free and does not require a subscription.');
            setIsManaging(false);
            return;
        }
        setIsSaving(true);
        setMessage('');
        try {
            const url = await createMembershipCheckout(selectedTier);
            redirectToBillingUrl(url);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Membership checkout could not be started.');
            setIsSaving(false);
        }
    };

    const billingDate = formatBillingDate(billing?.currentPeriodEnd ?? null);
    const paymentIssue = billing?.status === 'past_due' || billing?.paymentIssue;

    return (
        <div>
            <button
                onClick={() => setActiveView('Dashboard')}
                className="mb-4 flex items-center rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
            </button>
            <h1 className="mb-4 text-3xl font-bold">Membership & Billing</h1>

            {message && (
                <p role="status" className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-900">
                    {message}
                </p>
            )}

            {paymentIssue && (
                <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                    <p className="font-bold">Your latest membership renewal payment failed.</p>
                    <p className="mt-1">
                        Your paid features remain available while Stripe retries the payment. Update your payment method to prevent the membership ending.
                    </p>
                    <button
                        type="button"
                        onClick={() => void openBillingPortal()}
                        disabled={isSaving}
                        className="mt-3 rounded-md bg-amber-900 px-4 py-2 font-bold text-white disabled:opacity-50"
                    >
                        Update payment method
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 flex items-center text-xl font-bold">
                            <CreditCard className="mr-3 text-blue-600" /> My Membership
                        </h2>
                        <div className="flex flex-col gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-blue-700">Current plan</p>
                                <p className="text-2xl font-bold text-blue-900">{profile.profileTier} · {currentPlan.name}</p>
                                <p className="mt-1 text-sm text-blue-700">{formatMonthlyMembershipPrice(currentPlan)}</p>
                                <p className="mt-2 text-sm font-semibold text-blue-900">
                                    {isLoadingBilling ? 'Checking billing status…' : billingStatusText(billing)}
                                </p>
                                {billingDate && !billing?.cancelAtPeriodEnd && (
                                    <p className="mt-1 text-xs text-blue-800">Next billing date: {billingDate}</p>
                                )}
                                {billingDate && billing?.cancelAtPeriodEnd && (
                                    <p className="mt-1 text-xs font-semibold text-amber-800">
                                        Paid membership ends {billingDate}; your profile will return to Bronze afterwards.
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={changeMembership}
                                disabled={isSaving || isLoadingBilling}
                                className="rounded-md bg-blue-600 px-6 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {billing?.hasCustomer ? 'Manage Membership' : 'Choose Membership'}
                            </button>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 flex items-center text-xl font-bold">
                            <DollarSign className="mr-3 text-green-600" /> Membership payment
                        </h2>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                            <p className="font-bold text-gray-900">Subscription payments are handled securely by Stripe.</p>
                            <p className="mt-2">
                                TechSubbies does not store card details. Stripe handles recurring membership charges, receipts and payment-method updates.
                            </p>
                            {billing?.hasCustomer && (
                                <button
                                    type="button"
                                    onClick={() => void openBillingPortal()}
                                    disabled={isSaving}
                                    className="mt-4 rounded-md border border-gray-300 bg-white px-4 py-2 font-bold text-gray-800 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    Open Billing Management
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <aside className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-4 flex items-center text-xl font-bold">
                        <ShieldCheck className="mr-3 text-green-600" /> Zero commission
                    </h2>
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                        <p className="font-bold">Your agreed work fee remains yours.</p>
                        <p className="mt-2">
                            Stripe is used only for TechSubbies membership subscriptions. Companies and engineers invoice and pay each other directly; TechSubbies never holds project funds and does not deduct placement or success fees.
                        </p>
                    </div>
                </aside>
            </div>

            {isManaging && (
                <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="membership-dialog-title"
                        className="max-h-[92vh] w-full overflow-y-auto rounded-t-xl bg-white p-5 shadow-2xl sm:max-w-4xl sm:rounded-xl sm:p-6"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 id="membership-dialog-title" className="text-2xl font-bold text-gray-900">Choose your membership</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Paid memberships are monthly subscriptions. Membership never changes your work rate or introduces project commission.
                                </p>
                            </div>
                            <button aria-label="Close membership manager" onClick={closeManager} className="rounded-md p-2 text-gray-500 hover:bg-gray-100">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-6 grid gap-3 md:grid-cols-2">
                            {MEMBERSHIP_PLANS.map(plan => {
                                const selected = selectedTier === plan.tier;
                                return (
                                    <button
                                        key={plan.tier}
                                        type="button"
                                        aria-label={`${plan.tier} ${plan.name}`}
                                        aria-pressed={selected}
                                        onClick={() => setSelectedTier(plan.tier)}
                                        className={`rounded-lg border-2 p-4 text-left transition ${selected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-bold uppercase tracking-wide text-blue-700">{plan.tier}</p>
                                                <p className="mt-1 text-lg font-bold text-gray-900">{plan.name}</p>
                                            </div>
                                            {selected && <CheckCircle className="text-blue-600" size={22} />}
                                        </div>
                                        <p className="mt-3 text-2xl font-extrabold text-gray-900">{formatMonthlyMembershipPrice(plan)}</p>
                                        <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                                        <p className="mt-3 text-xs font-semibold text-gray-500">
                                            {plan.specialistRoleLimit === 0 ? 'Basic marketplace profile' : `Up to ${plan.specialistRoleLimit} specialist role profile${plan.specialistRoleLimit === 1 ? '' : 's'}`}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex flex-col gap-3 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-bold text-gray-900">{selectedTier} · {selectedPlan.name}</p>
                                <p className="text-sm text-gray-600">{formatMonthlyMembershipPrice(selectedPlan)} · 0% commission on work fees</p>
                            </div>
                            <button
                                onClick={() => void confirmMembership()}
                                disabled={isSaving}
                                className="rounded-md bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSaving
                                    ? 'Opening secure checkout…'
                                    : selectedTier === ProfileTier.BASIC
                                        ? 'Keep Bronze Free'
                                        : `Continue with ${selectedTier}`}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};
