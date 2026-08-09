import React, { useEffect, useState } from 'react';
import { StatCard } from '../../components/StatCard';
import { DollarSign, ShieldCheck, Star, TrendingUp } from '../../components/Icons';
import { getAdminSubscriptionBillingSummary, type AdminSubscriptionBillingSummary } from '../../services/billingService';
import { getAdminPricingResearchSummary, type PricingResearchSummary } from '../../services/pricingResearchService';

const formatPercent = (value: number | null) => value === null ? '—' : `${Math.round(value * 100)}%`;
const formatScore = (value: number | null) => value === null ? '—' : value.toFixed(1);
const formatPrice = (value: number | null) => value === null ? '—' : `£${Number.isInteger(value) ? value : value.toFixed(1)}`;
const label = (value: string) => value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

export const MonetizationView = () => {
    const [billing, setBilling] = useState<AdminSubscriptionBillingSummary | null>(null);
    const [research, setResearch] = useState<PricingResearchSummary | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            getAdminSubscriptionBillingSummary(),
            getAdminPricingResearchSummary(),
        ])
            .then(([billingSummary, researchSummary]) => {
                setBilling(billingSummary);
                setResearch(researchSummary);
            })
            .catch((reason) => setError(reason instanceof Error ? reason.message : 'Could not load commercial evidence.'));
    }, []);

    if (error) return <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">{error}</div>;
    if (!billing || !research) return <p className="text-gray-600">Loading commercial evidence…</p>;

    const activePaidMemberships = billing.active + billing.trialing;
    const likelyResponses = research.segments.reduce((sum, segment) => sum + segment.likelyToPayResponses, 0);
    const statedIntentRate = research.totalResponses > 0 ? likelyResponses / research.totalResponses : null;

    return (
        <div>
            <header className="mb-6">
                <h1 className="flex items-center text-3xl font-bold">
                    <DollarSign size={30} className="mr-3" />
                    Monetization Evidence
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-gray-600">
                    Compare real paid-membership state with stated willingness to pay. Survey intent is research evidence, not booked revenue.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <StatCard icon={Star} value={String(activePaidMemberships)} label="Active / Trial Paid Accounts" colorClass="bg-blue-500" />
                <StatCard icon={TrendingUp} value={String(research.totalResponses)} label="Pricing Research Responses" colorClass="bg-green-500" />
                <StatCard icon={DollarSign} value={formatPercent(statedIntentRate)} label="Likely to Pay (Stated)" colorClass="bg-amber-500" />
                <StatCard icon={ShieldCheck} value="0%" label="Commission on Work Fees" colorClass="bg-purple-500" />
            </div>

            <section className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Willingness to pay by account type</h2>
                        <p className="mt-1 text-sm text-gray-500">Price figures are median monthly research responses, not approved TechSubbies prices.</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Likely = score 4–5 / 5</span>
                </div>

                <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b text-xs uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="px-3 py-2">Segment</th>
                                <th className="px-3 py-2 text-right">Responses</th>
                                <th className="px-3 py-2 text-right">Value /5</th>
                                <th className="px-3 py-2 text-right">Pay likelihood /5</th>
                                <th className="px-3 py-2 text-right">Likely to pay</th>
                                <th className="px-3 py-2 text-right">Good value</th>
                                <th className="px-3 py-2 text-right">Expensive</th>
                                <th className="px-3 py-2 text-right">Too expensive</th>
                            </tr>
                        </thead>
                        <tbody>
                            {research.segments.map((segment) => (
                                <tr key={segment.role} className="border-b last:border-0">
                                    <td className="px-3 py-3 font-semibold text-gray-900">{segment.role}</td>
                                    <td className="px-3 py-3 text-right">{segment.responses}</td>
                                    <td className="px-3 py-3 text-right">{formatScore(segment.averageValueScore)}</td>
                                    <td className="px-3 py-3 text-right">{formatScore(segment.averageLikelihoodToPay)}</td>
                                    <td className="px-3 py-3 text-right">{formatPercent(segment.likelyToPayRate)}</td>
                                    <td className="px-3 py-3 text-right">{formatPrice(segment.medianPriceGoodValue)}</td>
                                    <td className="px-3 py-3 text-right">{formatPrice(segment.medianPriceExpensive)}</td>
                                    <td className="px-3 py-3 text-right">{formatPrice(segment.medianPriceTooExpensive)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {research.segments.map((segment) => (
                    <section key={segment.role} className="rounded-xl border bg-white p-5 shadow-sm">
                        <h3 className="font-bold text-gray-900">{segment.role}</h3>
                        <p className="mt-1 text-xs text-gray-500">{segment.responses} research responses</p>

                        <h4 className="mt-4 text-xs font-bold uppercase tracking-wide text-gray-500">Top value drivers</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            {segment.topValueDrivers.length > 0
                                ? segment.topValueDrivers.map((item) => <li key={item.driver} className="flex justify-between gap-3"><span>{label(item.driver)}</span><strong>{item.responses}</strong></li>)
                                : <li className="text-gray-400">No responses yet</li>}
                        </ul>

                        <h4 className="mt-4 text-xs font-bold uppercase tracking-wide text-gray-500">Main blockers</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            {segment.blockers.length > 0
                                ? segment.blockers.slice(0, 3).map((item) => <li key={item.blocker} className="flex justify-between gap-3"><span>{label(item.blocker)}</span><strong>{item.responses}</strong></li>)
                                : <li className="text-gray-400">No responses yet</li>}
                        </ul>
                    </section>
                ))}
            </div>

            <section className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6 shadow-sm">
                <h2 className="flex items-center text-xl font-bold text-green-950">
                    <ShieldCheck size={22} className="mr-3" />
                    Commercial model boundary
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-green-900">
                    TechSubbies revenue comes from membership subscriptions. Engineering rates, invoices and project payments remain direct arrangements between members, with no placement, success or percentage fee payable to TechSubbies.
                </p>
            </section>
        </div>
    );
};
