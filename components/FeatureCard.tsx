import React from 'react';

interface FeatureCardProps {
    icon: React.ComponentType<any>;
    title: string;
    children: React.ReactNode;
}

export const FeatureCard = ({ icon: Icon, title, children }: FeatureCardProps) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-3">
            <Icon className="w-8 h-8 text-blue-500 mr-3" />
            <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-gray-600">{children}</p>
    </div>
);