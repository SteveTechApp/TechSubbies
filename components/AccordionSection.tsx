import React, { useState } from 'react';
import { ChevronDown } from './Icons.tsx';

interface AccordionSectionProps {
    title: string;
    icon: React.ComponentType<any>;
    children: React.ReactNode;
    startOpen?: boolean;
}

export const AccordionSection = ({ title, icon: Icon, children, startOpen = false }: AccordionSectionProps) => {
    const [isOpen, setIsOpen] = useState(startOpen);

    return (
        <div className="border-b border-gray-200 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-4 px-2 text-left hover:bg-gray-50 rounded-t-md"
                aria-expanded={isOpen}
            >
                <div className="flex items-center">
                    <Icon className="w-6 h-6 mr-3 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                </div>
                <ChevronDown className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            <div 
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="py-4 px-2">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
