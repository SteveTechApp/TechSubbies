import React, { useEffect, useState } from 'react';
import { StatCard } from '../../components/StatCard';
import { Users, Briefcase, UserCheck, ShieldCheck, DollarSign } from '../../components/Icons';
import apiService, { type AdminPlatformMetrics } from '../../services/apiService';

export const DashboardView = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
    const [metrics, setMetrics] = useState<AdminPlatformMetrics | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        apiService.getAdminPlatformMetrics()
            .then(setMetrics)
            .catch((reason) => setError(reason instanceof Error ? reason.message : 'Could not load platform metrics.'));
    }, []);

    if (error) {
        return <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">{error}</div>;
    }
    if (!metrics) {
        return <p className="text-gray-600">Loading live platform metrics…</p>;
    }

    return (
        <div>
            <div className="mb-4 flex items-end justify-between">
                <div>
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500">Live operational data from the TechSubbies backend.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                <StatCard icon={Users} value={metrics.users.total.toString()} label="Registered Accounts" colorClass="bg-blue-500" />
                <StatCard icon={UserCheck} value={metrics.users.engineers.toString()} label="Engineers" colorClass="bg-green-500" />
                <StatCard icon={Briefcase} value={metrics.marketplace.jobsActive.toString()} label="Active Jobs" colorClass="bg-indigo-500" />
                <StatCard icon={ShieldCheck} value={metrics.marketplace.contractsActive.toString()} label="Active Contracts" colorClass="bg-cyan-600" />
                <StatCard icon={DollarSign} value={metrics.membershipPending.toString()} label="Membership Requests" colorClass="bg-amber-500" />
            </div>

            {metrics.membershipPending > 0 && (
                <div className="mt-4 flex flex-col justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="font-semibold text-amber-950">
                            {metrics.membershipPending} membership {metrics.membershipPending === 1 ? 'request needs' : 'requests need'} verification
                        </p>
                        <p className="text-sm text-amber-800">Verify external membership billing before activating access.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setActiveView('Membership Requests')}
                        className="rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
                    >
                        Review membership requests
                    </button>
                </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div className="rounded-lg bg-white p-4 shadow">
                    <h2 className="mb-4 text-base font-bold">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <button onClick={() => setActiveView('Manage Users')} className="rounded-lg bg-gray-50 p-4 text-center hover:bg-gray-100">
                            <Users className="mx-auto mb-2 h-8 w-8 text-gray-600" />
                            <span className="text-sm font-semibold">Manage Users</span>
                        </button>
                        <button onClick={() => setActiveView('Manage Jobs')} className="rounded-lg bg-gray-50 p-4 text-center hover:bg-gray-100">
                            <Briefcase className="mx-auto mb-2 h-8 w-8 text-gray-600" />
                            <span className="text-sm font-semibold">Manage Jobs</span>
                        </button>
                        <button onClick={() => setActiveView('Privacy Requests')} className="rounded-lg bg-gray-50 p-4 text-center hover:bg-gray-100">
                            <ShieldCheck className="mx-auto mb-2 h-8 w-8 text-gray-600" />
                            <span className="text-sm font-semibold">Privacy Requests</span>
                        </button>
                        <button onClick={() => setActiveView('Membership Requests')} className="rounded-lg bg-gray-50 p-4 text-center hover:bg-gray-100">
                            <DollarSign className="mx-auto mb-2 h-8 w-8 text-gray-600" />
                            <span className="text-sm font-semibold">Membership Requests</span>
                        </button>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-4 shadow">
                    <h2 className="mb-4 text-base font-bold">Platform Health</h2>
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between"><span>Companies</span><strong>{metrics.users.companies}</strong></li>
                        <li className="flex justify-between"><span>Resourcing companies</span><strong>{metrics.users.resourcingCompanies}</strong></li>
                        <li className="flex justify-between"><span>Suspended accounts</span><strong>{metrics.users.suspended}</strong></li>
                        <li className="flex justify-between"><span>Jobs posted</span><strong>{metrics.marketplace.jobsTotal}</strong></li>
                        <li className="flex justify-between"><span>Applications</span><strong>{metrics.marketplace.applications}</strong></li>
                        <li className="flex justify-between"><span>Contracts</span><strong>{metrics.marketplace.contractsTotal}</strong></li>
                        <li className="flex justify-between"><span>Pending privacy requests</span><strong>{metrics.privacyPending}</strong></li>
                        <li className="flex justify-between"><span>Pending membership requests</span><strong>{metrics.membershipPending}</strong></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
