import React from 'react';

interface RevenueCardProps {
    number: string;
    title: string;
    children: React.ReactNode;
}

export const RevenueCard = ({ number, title, children }: RevenueCardProps) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 text-center h-full">
        <div className="text-5xl font-extrabold text-blue-500 mb-3">{number}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{children}</p>
    </div>
);