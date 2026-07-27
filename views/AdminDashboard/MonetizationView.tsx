import React from 'react';
import { useAppContext } from '../../context/InteractionContext';
import { StatCard } from '../../components/StatCard';
import { TransactionType } from '../../types';
import { DollarSign, ShieldCheck, Star, TrendingUp } from '../../components/Icons';

export const MonetizationView = () => {
    const { transactions } = useAppContext();
    const subscriptionRevenue = transactions
        .filter(transaction => transaction.type === TransactionType.SUBSCRIPTION)
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    const activeMemberships = new Set(
        transactions
            .filter(transaction => transaction.type === TransactionType.SUBSCRIPTION)
            .map(transaction => transaction.userId)
    ).size;

    return (
        <div>
            <h1 className="mb-6 flex items-center text-3xl font-bold">
                <DollarSign size={30} className="mr-3" />
                Membership Revenue
            </h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard icon={TrendingUp} value={`£${subscriptionRevenue.toLocaleString()}`} label="Total Membership Revenue" colorClass="bg-green-500" />
                <StatCard icon={Star} value={String(activeMemberships)} label="Paying Members" colorClass="bg-blue-500" />
                <StatCard icon={ShieldCheck} value="0%" label="Commission on Work Fees" colorClass="bg-purple-500" />
            </div>

            <section className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 shadow-sm">
                <h2 className="flex items-center text-xl font-bold text-green-950">
                    <ShieldCheck size={22} className="mr-3" />
                    Commercial model boundary
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-green-900">
                    TechSubbies revenue comes from membership subscriptions. Engineering rates, invoices and payments remain direct arrangements between members, with no placement, success or percentage fee payable to TechSubbies.
                </p>
            </section>
        </div>
    );
};
