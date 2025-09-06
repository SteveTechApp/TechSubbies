import React from 'react';

interface StatCardProps {
    icon: React.ComponentType<any>;
    value: string;
    label: string;
    colorClass?: string;
}

export const StatCard = ({ icon: Icon, value, label, colorClass = 'bg-blue-500' }: StatCardProps) => (
    <div className="bg-white p-5 rounded-lg shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${colorClass}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm font-medium text-gray-500">{label}</p>
        </div>
    </div>
);
