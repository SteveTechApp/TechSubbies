import React from 'react';

interface NavLinkProps {
    label: string;
    icon: React.ComponentType<any>;
    activeView: string;
    setActiveView: (view: string) => void;
}

export const NavLink = ({ label, icon: Icon, activeView, setActiveView }: NavLinkProps) => {
    const isActive = activeView === label;
    
    const classNames = [
        "w-full", "flex", "items-center", "px-1.5 py-1", "my-1", 
        "text-left", "rounded-md", "transition-colors",
        isActive ? "bg-blue-500 text-white shadow" : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
    ].join(" ");

    return (
        <li>
            <button
                onClick={() => setActiveView(label)}
                className={classNames}
            >
                <Icon className="w-4 h-4 mr-2" />
                <span className="font-medium text-xs">{label}</span>
            </button>
        </li>
    );
};