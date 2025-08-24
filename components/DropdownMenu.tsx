import React, { useState } from 'react';
import { ChevronDown } from './Icons.tsx';

interface DropdownMenuProps {
    triggerText: string;
    children: React.ReactNode;
    isLanding?: boolean;
}

export const DropdownMenu = ({ triggerText, children, isLanding = false }: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const menuClasses = 'bg-white shadow-lg border border-gray-200';
    
    const triggerColor = 'text-gray-700 hover:text-blue-600';

    return (
        <div 
            className="relative" 
            onMouseEnter={() => setIsOpen(true)} 
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className={`flex items-center px-4 py-2 transition-colors font-medium ${triggerColor}`}>
                {triggerText}
                <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {isOpen && (
                <div className={`absolute top-full right-0 mt-1 w-48 rounded-md shadow-lg z-50 overflow-hidden ${menuClasses}`}>
                    <div className="flex flex-col">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};