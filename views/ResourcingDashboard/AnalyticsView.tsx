import React, { useMemo } from 'react';
import { useAppContext } from '../../context/InteractionContext';
import { BarChart2, DollarSign, Briefcase, Users } from '../../components/Icons';
import { Contract, EngineerProfile } from '../../types';

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
     if (maxValue === 0) return <p className="text-sm text-gray-500">{title}: No data to display.</p>;
    return (
        <div>
            <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
            <div className="space-y-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600 w-24 text-right truncate">{item.label}</span>
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
    const { user, contracts, engineers } = useAppContext();

    const { managedEngineerIds, managedContracts, totalContractValue, placementsByEngineer } = useMemo(() => {
        if (!user || user.role !== 'Resourcing Company') {
            return { managedEngineerIds: new Set(), managedContracts: [], totalContractValue: 0, placementsByEngineer: [] };
        }
        
        const managedIds = new Set((user.profile as any).managedEngineerIds || []);
        const mContracts = contracts.filter(c => managedIds.has(c.engineerId));
        
        const totalValue = mContracts.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
        
        const placementsByEng = engineers
            .filter(e => managedIds.has(e.id))
            .map(eng => ({
                label: eng.name,
                value: mContracts.filter(c => c.engineerId === eng.id).length
            }))
            .sort((a,b) => b.value - a.value);

        return {
            managedEngineerIds: managedIds,
            managedContracts: mContracts,
            totalContractValue: totalValue,
            placementsByEngineer: placementsByEng
        };
    }, [user, contracts, engineers]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <BarChart2 size={30} className="mr-3 text-indigo-600"/>
                Agency Analytics
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={Users} value={String(managedEngineerIds.size)} label="Managed Engineers" color="text-blue-500" />
                <StatCard icon={Briefcase} value={String(managedContracts.length)} label="Total Placements" color="text-green-500" />
                <StatCard icon={DollarSign} value={`£${totalContractValue.toLocaleString()}`} label="Total Contract Value" color="text-purple-500" />
            </div>
            
            <div className="mt-6 bg-white p-6 rounded-lg shadow">
                 <SimpleBarChart data={placementsByEngineer} color="bg-indigo-500" title="Placements by Engineer" unit="" />
            </div>
        </div>
    );
};
