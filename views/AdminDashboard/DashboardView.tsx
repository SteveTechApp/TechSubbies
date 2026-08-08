import React, { useEffect, useState } from 'react';
import { StatCard } from '../../components/StatCard';
import { Users, Briefcase, UserCheck, ShieldCheck, DollarSign } from '../../components/Icons';
import {
    formatPilotConversionMetric,
    formatPilotConversionTarget,
    getPilotConversionMetrics,
} from '../../data/pilotConversionTargets';
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

    const pilotFunnel = metrics.pilotFunnel ?? {
        profilesUpdated: 0,
        jobsPosted: 0,
        applicationsSubmitted: 0,
        contractsCreated: 0,
    };
    const conversionMetrics = getPilotConversionMetrics(pilotFunnel);

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

            <div className="mt-4 rounded-lg bg-white p-4 shadow">
                <h2 className="text-base font-bold">Commercial pilot funnel</h2>
                <p className="mt-1 text-sm text-gray-500">Server-recorded marketplace actions used to measure pilot conversion.</p>
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                        ['Profiles updated', pilotFunnel.profilesUpdated],
                        ['Jobs posted', pilotFunnel.jobsPosted],
                        ['Applications', pilotFunnel.applicationsSubmitted],
                        ['Contracts created', pilotFunnel.contractsCreated],
                    ].map(([label, value]) => (
                        <div key={String(label)} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="text-2xl font-bold text-gray-900">{value}</div>
                            <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-5 border-t border-gray-200 pt-4">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Pilot conversion targets</h3>
                            <p className="mt-1 text-xs text-gray-500">
                                Initial controlled-pilot thresholds. Recalibrate after the first cohort produces a reliable baseline.
                            </p>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Actual / target</span>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                        {conversionMetrics.map((metric) => (
                            <div key={metric.id} className="rounded-lg border border-gray-200 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <span className="text-sm font-semibold text-gray-800">{metric.label}</span>
                                    <span
                                        className={`rounded-md px-2 py-1 text-xs font-semibold ${
                                            metric.met
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-amber-50 text-amber-700'
                                        }`}
                                    >
                                        {metric.met ? 'On target' : 'Below target'}
                                    </span>
                                </div>
                                <div className="mt-3 text-2xl font-bold text-gray-900">
                                    {formatPilotConversionMetric(metric)}
                                    <span className="ml-2 text-sm font-medium text-gray-500">
                                        / {formatPilotConversionTarget(metric)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
