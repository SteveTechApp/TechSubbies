import React from 'react';

interface NavLinkProps {
    label: string;
    icon: React.ComponentType<any>;
    activeView: string;
    setActiveView: (view: string) => void;
}

export const NavLink = ({ label, icon: Icon, activeView, setActiveView }: NavLinkProps) => {
    const isActive = activeView === label;
    
    // Use an array and join for robust class name construction
    const classNames = [
        "w-full", "flex", "items-center", "p-3", "my-1", 
        "text-left", "rounded-md", "transition-colors",
        isActive ? "bg-blue-500 text-white shadow" : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
    ];

    return (
        <li>
            <button
                onClick={() => setActiveView(label)}
                className={classNames.join(" ")}
            >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{label}</span>
            </button>
        </li>
    );
};