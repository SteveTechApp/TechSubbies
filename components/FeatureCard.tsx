import React from 'react';

interface FeatureCardProps {
    icon: React.ComponentType<any>;
    title: string;
    children: React.ReactNode;
}

export const FeatureCard = ({ icon: Icon, title, children }: FeatureCardProps) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
        <div className="p-3 bg-blue-100 rounded-full inline-block mb-4">
            <Icon className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{children}</p>
    </div>
);