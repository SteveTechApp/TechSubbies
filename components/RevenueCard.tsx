import React from 'react';

interface RevenueCardProps {
    number: string;
    title: string;
    children: React.ReactNode;
}

export const RevenueCard = ({ number, title, children }: RevenueCardProps) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-3">
            <div className="text-3xl font-bold text-blue-500 mr-4">{number}</div>
            <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-gray-600">{children}</p>
    </div>
);
