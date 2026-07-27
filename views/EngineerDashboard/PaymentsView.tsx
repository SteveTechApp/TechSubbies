import React from 'react';
import { EngineerProfile } from '../../types';
import { ArrowLeft, CreditCard, DollarSign, ShieldCheck } from '../../components/Icons';

interface PaymentsViewProps {
    profile: EngineerProfile;
    setActiveView: (view: string) => void;
}

export const PaymentsView = ({ profile, setActiveView }: PaymentsViewProps) => (
    <div>
        <button
            onClick={() => setActiveView('Dashboard')}
            className="mb-4 flex items-center rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
        >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
        </button>
        <h1 className="mb-4 text-3xl font-bold">Membership & Billing</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-4 flex items-center text-xl font-bold">
                        <CreditCard className="mr-3 text-blue-600" /> My Membership
                    </h2>
                    <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <div>
                            <p className="text-sm font-semibold text-blue-700">Current plan</p>
                            <p className="text-2xl font-bold text-blue-900">{profile.profileTier} Plan</p>
                        </div>
                        <button className="rounded-md bg-blue-600 px-6 py-2 font-bold text-white hover:bg-blue-700">
                            Manage Membership
                        </button>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-4 flex items-center text-xl font-bold">
                        <DollarSign className="mr-3 text-green-600" /> Membership payment method
                    </h2>
                    <p className="py-8 text-center text-gray-500">Membership payment management coming soon.</p>
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
    </div>
);
