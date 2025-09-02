import React from 'react';

interface ProfileSectionPanelProps {
    title: string;
    icon: React.ComponentType<any>;
    onEdit: () => void;
    children: React.ReactNode;
}

export const ProfileSectionPanel = ({ title, icon: Icon, onEdit, children }: ProfileSectionPanelProps) => (
    <div className="bg-white p-5 rounded-lg shadow-md flex flex-col">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
                <Icon size={24} className="mr-3 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            </div>
            <button
                onClick={onEdit}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
                Edit
            </button>
        </div>
        <div className="flex-grow">
            {children}
        </div>
    </div>
);