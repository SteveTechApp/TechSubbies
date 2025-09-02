import React, { useState, useRef } from 'react';
import { ChevronDown } from './Icons.tsx';

interface DropdownMenuProps {
    triggerText: React.ReactNode;
    children: React.ReactNode;
    isLanding?: boolean;
    direction?: 'up' | 'down';
}

export const DropdownMenu = ({ triggerText, children, isLanding = false, direction = 'down' }: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = window.setTimeout(() => {
            setIsOpen(false);
        }, 200); // 200ms delay before closing
    };

    const menuClasses = 'bg-white shadow-lg border border-gray-200';
    const triggerColor = 'text-gray-700 hover:text-blue-600';

    const menuPositionClass = direction === 'up' 
        ? 'absolute bottom-full right-0 mb-1 w-48 rounded-md shadow-lg z-50 overflow-hidden' 
        : 'absolute top-full right-0 mt-1 w-48 rounded-md shadow-lg z-50 overflow-hidden';

    return (
        <div 
            className="relative" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
        >
            <button className={`flex items-center px-4 py-2 transition-colors font-medium text-xs text-center ${triggerColor}`}>
                {triggerText}
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen && direction === 'down' ? 'rotate-180' : ''} ${isOpen && direction === 'up' ? '-rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className={`${menuPositionClass} ${menuClasses}`}>
                    <div className="flex flex-col">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};