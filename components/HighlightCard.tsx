import React from 'react';

interface HighlightCardProps {
    icon: React.ComponentType<any>;
    title: string;
    children: React.ReactNode;
}

export const HighlightCard = ({ icon: Icon, title, children }: HighlightCardProps) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
            <Icon className="w-10 h-10 text-blue-500 mr-4" />
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600">{children}</p>
    </div>
);