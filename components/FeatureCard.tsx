import React from 'react';

interface FeatureCardProps {
    icon: React.ComponentType<any>;
    title: string;
    children: React.ReactNode;
}

export const FeatureCard = ({ icon: Icon, title, children }: FeatureCardProps) => (
    <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
        <div className="p-1.5 bg-blue-100 rounded-full inline-block mb-2">
            <Icon className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="text-base font-bold mb-1">{title}</h3>
        <p className="text-gray-600 text-xs">{children}</p>
    </div>
);