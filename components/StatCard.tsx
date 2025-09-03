import React from 'react';

interface StatCardProps {
    icon: React.ComponentType<any>;
    value: string | number;
    label: string;
    onClick?: () => void;
    colorClass?: string;
}

export const StatCard = ({ icon: Icon, value, label, onClick, colorClass = 'bg-blue-500' }: StatCardProps) => {
    const content = (
        <>
            <div className={`p-3 rounded-full inline-block mb-3 ${colorClass}`}>
                <Icon className="w-8 h-8 text-white" />
            </div>
            <p className="text-4xl font-extrabold text-gray-800">{value}</p>
            <h2 className="font-bold text-lg text-gray-500">{label}</h2>
        </>
    );

    const baseClasses = "bg-white p-6 rounded-lg shadow text-center";

    if (onClick) {
        return (
            <button
                onClick={onClick}
                className={`w-full h-full hover:shadow-lg hover:-translate-y-1 transition-all ${baseClasses}`}
            >
                {content}
            </button>
        );
    }

    return (
        <div className={baseClasses}>
            {content}
        </div>
    );
};