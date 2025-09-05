import React, { useMemo } from 'react';
import { EngineerProfile } from '../../types/index.ts';
import { useAppContext } from '../../context/AppContext.tsx';
import { BarChart, TrendingUp, Users, Mail, Briefcase } from '../../components/Icons.tsx';

// --- Mock Data Generation ---
const generateChartData = (days: number, minVal: number, maxVal: number) => {
    return Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        value: Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal,
    }));
};

const SimpleLineChart = ({ data, color, title }: { data: {day: number, value: number}[], color: string, title: string }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.value / maxValue) * 100}`).join(' ');

    return (
        <div className="h-full w-full">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">{title}</h4>
            <svg viewBox="0 0 100 100" className="w-full h-48" preserveAspectRatio="none">
                <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
            </svg>
        </div>
    );
};

const SimpleBarChart = ({ data, color }: { data: { label: string; value: number }[], color: string }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div>
            <h4 className="font-semibold text-gray-700 mb-2">Profile Views by Company Type</h4>
            <div className="space-y-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600 w-24 text-right">{item.label}</span>
                        <div className="flex-grow bg-gray-200 rounded-full h-4">
                            <div className={`${color} h-4 rounded-full text-white text-xs flex items-center justify-end pr-2`} style={{ width: `${(item.value / maxValue) * 100}%` }}>
                                {item.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const AnalyticsView = () => {
    const { user, contracts } = useAppContext();
    const engineer = user?.profile as EngineerProfile;

    // --- Memoized Mock Data for Charts ---
    const profileViewsData = useMemo(() => generateChartData(30, 10, 80), []);
    const searchAppearancesData = useMemo(() => generateChartData(30, 150, 500), []);
    const viewsByCompanyData = useMemo(() => [
        { label: 'Integrators', value: Math.floor(engineer.profileViews * 0.6) },
        { label: 'MSP', value: Math.floor(engineer.profileViews * 0.2) },
        { label: 'Events Co.', value: Math.floor(engineer.profileViews * 0.15) },
        { label: 'Other', value: Math.floor(engineer.profileViews * 0.05) },
    ], [engineer.profileViews]);

    const completedContracts = contracts.filter(c => c.engineerId === engineer.id && c.status === 'Completed').length;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <BarChart size={30} className="mr-3 text-blue-600"/>
                My Profile Analytics
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Profile Views (30d)</p>
                            <p className="text-4xl font-bold text-gray-800">{engineer.profileViews}</p>
                        </div>
                        <TrendingUp size={24} className="text-green-500" />
                    </div>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Search Appearances</p>
                            <p className="text-4xl font-bold text-gray-800">{engineer.searchAppearances}</p>
                        </div>
                         <Users size={24} className="text-blue-500" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Job Invites</p>
                            <p className="text-4xl font-bold text-gray-800">{engineer.jobInvites}</p>
                        </div>
                         <Mail size={24} className="text-purple-500" />
                    </div>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Contracts Completed</p>
                            <p className="text-4xl font-bold text-gray-800">{completedContracts}</p>
                        </div>
                         <Briefcase size={24} className="text-orange-500" />
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                     <h3 className="text-lg font-bold mb-4">Performance Trends (Last 30 Days)</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SimpleLineChart data={profileViewsData} color="#3b82f6" title="Profile Views"/>
                        <SimpleLineChart data={searchAppearancesData} color="#8b5cf6" title="Search Appearances"/>
                     </div>
                </div>
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
                    <SimpleBarChart data={viewsByCompanyData} color="bg-blue-500" />
                </div>
            </div>

        </div>
    );
};
