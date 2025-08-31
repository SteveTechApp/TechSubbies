import React from 'react';

interface SectionWrapperProps {
    title: string;
    icon?: React.ComponentType<any>;
    children: React.ReactNode;
}

export const SectionWrapper = ({ title, icon: Icon, children }: SectionWrapperProps) => (
    <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-2xl font-bold border-b pb-2 mb-4 flex items-center">
            {Icon && <Icon size={24} className="mr-3 text-blue-600" />}
            {title}
        </h2>
        {children}
    </div>
);
