import React from 'react';

interface StatCardProps {
    icon: React.ComponentType<any>;
    value: string | number;
    label: string;
}

export const StatCard = ({ icon: Icon, value, label }: StatCardProps) => (
    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
        <Icon className="w-12 h-12 text-blue-500 mr-4" />
        <div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-gray-500">{label}</p>
        </div>
    </div>
);