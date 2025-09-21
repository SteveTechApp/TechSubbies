import React, { useMemo } from 'react';
// FIX: Corrected import path for useAppContext to resolve 'not a module' error.
import { useAppContext } from '../../context/InteractionContext';
import { BarChart2, DollarSign, Briefcase, Users, Clock } from '../../components/Icons';
import { Contract, Discipline, EngineerProfile, TransactionType } from '../../types';

const StatCard = ({ icon: Icon, value, label, color }: { icon: React.ComponentType<any>, value: string, label: string, color: string }) => (
    <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-4xl font-bold text-gray-800">{value}</p>
            </div>
            <Icon size={24} className={color} />
        </div>
    </div>
);

const SimpleBarChart = ({ data, color, title, unit = '' }: { data: { label: string; value: number }[], color: string, title: string, unit?: string }) => {
    if (!data || data.length === 0) return null;
    const maxValue = Math.max(...data.map(d => d.value));
    if (maxValue === 0) return null;
    return (
        <div>
            <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
            <div className="space-y-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600 w-24 text-right">{item.label}</span>
                        <div className="flex-grow bg-gray-200 rounded-full h-4">
                            <div className={`${color} h-4 rounded-full text-white text-xs flex items-center justify-end pr-2`} style={{ width: `${(item.value / maxValue) * 100}%` }}>
                                {unit}{item.value.toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AnalyticsView = () => {
    const { user, contracts, engineers, jobs } = useAppContext();

    const { totalSpend, hiresByDiscipline, avgTimeToHire, activeContracts } = useMemo(() => {
        if (!user) return { totalSpend: 0, hiresByDiscipline: [], avgTimeToHire: 0, activeContracts: 0 };
        
        const myContracts = contracts.filter(c => c.companyId === user.profile.id);
        
        const spend = myContracts.reduce((sum, c) => {
            if (typeof c.amount === 'string') {
                return sum + (parseFloat(c.amount) || 0);
            }
            return sum + (c.amount || 0);
        }, 0);
        
        const active = myContracts.filter(c => c.status === 'Active').length;

        const hires = myContracts.map(c => engineers.find(e => e.id === c.engineerId)).filter((e): e is EngineerProfile => !!e);

        // FIX: Explicitly typing the accumulator `acc` ensures correct type inference for `byDiscipline`, fixing downstream errors.
        const byDiscipline = hires.reduce((acc: Record<string, number>, eng) => {
            if (eng) {
                acc[eng.discipline] = (acc[eng.discipline] || 0) + 1;
            }
            return acc;
        }, {});
        
        const disciplineChartData = Object.entries(byDiscipline).map(([label, value]) => ({ label, value }));

        // Simulate time to hire
        const timeToHire = myContracts.reduce((sum, c) => {
            const job = jobs.find(j => j.id === c.jobId);
            if (job && c.engineerSignature) {
                const diff = new Date(c.engineerSignature.date).getTime() - new Date(job.postedDate).getTime();
                return sum + (diff / (1000 * 3600 * 24));
            }
            return sum;
        }, 0);
        const avgTime = myContracts.length > 0 ? timeToHire / myContracts.length : 0;

        return {
            totalSpend: spend,
            hiresByDiscipline: disciplineChartData,
            avgTimeToHire: avgTime,
            activeContracts: active
        };
    }, [user, contracts, engineers, jobs]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <BarChart2 size={30} className="mr-3 text-blue-600"/>
                Hiring Analytics
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={DollarSign} value={`£${totalSpend.toLocaleString()}`} label="Total Spend" color="text-green-500" />
                <StatCard icon={Users} value={String(hiresByDiscipline.reduce((s,i) => s + i.value, 0))} label="Total Hires" color="text-blue-500" />
                <StatCard icon={Briefcase} value={String(activeContracts)} label="Active Contracts" color="text-purple-500" />
                <StatCard icon={Clock} value={`${avgTimeToHire.toFixed(1)} days`} label="Avg. Time to Hire" color="text-orange-500" />
            </div>
            
            <div className="mt-6 bg-white p-6 rounded-lg shadow">
                <SimpleBarChart data={hiresByDiscipline} color="bg-blue-500" title="Hires by Discipline" />
            </div>
        </div>
    );
};