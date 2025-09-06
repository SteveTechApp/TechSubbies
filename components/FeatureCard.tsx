import React from 'react';

interface FeatureCardProps {
    icon: React.ComponentType<any>;
    title: string;
    children: React.ReactNode;
}

export const FeatureCard = ({ icon: Icon, title, children }: FeatureCardProps) => (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center h-full flex flex-col">
        <div className="p-4 bg-blue-100 rounded-full inline-block mb-4 mx-auto">
            <Icon className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 flex-grow">{children}</p>
    </div>
);