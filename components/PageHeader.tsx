import React from 'react';
import { ArrowLeft } from './Icons.tsx';

interface PageHeaderProps {
    onBack: () => void;
    backText?: string;
}

export const PageHeader = ({ onBack, backText = "Back to Main Site" }: PageHeaderProps) => (
    <header className="p-4 sm:p-6 absolute top-0 left-0 z-10">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 font-semibold transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            {backText}
        </button>
    </header>
);
