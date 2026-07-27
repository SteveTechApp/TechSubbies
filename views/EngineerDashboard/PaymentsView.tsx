import React, { useState } from 'react';
import { EngineerProfile, ProfileTier } from '../../types';
import { ArrowLeft, CheckCircle, CreditCard, DollarSign, ShieldCheck, X } from '../../components/Icons';
import {
    formatMonthlyMembershipPrice,
    MEMBERSHIP_PLAN_BY_TIER,
    MEMBERSHIP_PLANS,
} from '../../data/membershipPlans';
import { useAppContext } from '../../context/InteractionContext';

interface PaymentsViewProps {
    profile: EngineerProfile;
    setActiveView: (view: string) => void;
}

export const PaymentsView = ({ profile, setActiveView }: PaymentsViewProps) => {
    const { requestMembershipChange } = useAppContext();
    const [isManaging, setIsManaging] = useState(false);
    const [selectedTier, setSelectedTier] = useState<ProfileTier>(profile.profileTier);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const currentPlan = MEMBERSHIP_PLAN_BY_TIER[profile.profileTier];
    const selectedPlan = MEMBERSHIP_PLAN_BY_TIER[selectedTier];

    const closeManager = () => {
        setSelectedTier(profile.profileTier);
        setMessage('');
        setIsManaging(false);
    };

    const confirmMembership = async () => {
        if (selectedTier === profile.profileTier) {
            setMessage('This is already your current membership.');
            return;
        }
        setIsSaving(true);
        setMessage('');
        try {
            await requestMembershipChange(selectedTier);
            setMessage(`${selectedTier} selected. Your active plan remains ${profile.profileTier} until billing is confirmed.`);
            setIsManaging(false);
        } catch {
            setMessage('The membership could not be updated. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

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
                                {profile.requestedProfileTier && profile.requestedProfileTier !== profile.profileTier && (
                                    <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                                        <p className="font-semibold">
                                            {profile.requestedProfileTier} selected · awaiting billing confirmation
                                        </p>
                                        {profile.membershipRequestedAt && (
                                            <time className="mt-1 block text-xs" dateTime={profile.membershipRequestedAt}>
                                                Requested {new Date(profile.membershipRequestedAt).toLocaleString()}
                                            </time>
                                        )}
                                        <p className="mt-1 text-xs">Your current membership remains active while verification is completed.</p>
                                    </div>
                                )}
                                {!profile.requestedProfileTier && profile.membershipActivatedAt && (
                                    <time className="mt-2 block text-sm text-blue-800" dateTime={profile.membershipActivatedAt}>
                                        Active since {new Date(profile.membershipActivatedAt).toLocaleDateString()}
                                    </time>
                                )}
                            </div>
                            <button
                                onClick={() => setIsManaging(true)}
                                className="rounded-md bg-blue-600 px-6 py-2 font-bold text-white hover:bg-blue-700"
                            >
                                Change Membership
                            </button>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 flex items-center text-xl font-bold">
                            <DollarSign className="mr-3 text-green-600" /> Membership payment method
                        </h2>
                        <p className="py-8 text-center text-gray-500">Secure membership payment management is coming soon.</p>
                    </div>
                </div>

                <aside className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-4 flex items-center text-xl font-bold">
                        <ShieldCheck className="mr-3 text-green-600" /> Zero commission
                    </h2>
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                        <p className="font-bold">Your agreed work fee remains yours.</p>
                        <p className="mt-2">
                            Membership covers access to TechSubbies. Applying never consumes credits, and TechSubbies does not deduct placement or success fees.
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
                                <p className="mt-1 text-sm text-gray-600">Membership controls profile tools and visibility—not rates, applications, or work fees.</p>
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
                                onClick={confirmMembership}
                                disabled={isSaving}
                                className="rounded-md bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSaving ? 'Saving selection…' : selectedTier === profile.profileTier ? 'Keep Current Plan' : `Request ${selectedTier}`}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};
