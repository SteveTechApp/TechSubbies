import React from 'react';
import { Logo } from './Logo.tsx';
import { Page } from '../types/index.ts';
import { DropdownMenu } from './DropdownMenu.tsx';

interface FooterProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

export const Footer = ({ onNavigate, onHowItWorksClick }: FooterProps) => {
    const dropdownItemClass = 'block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100';
    const textColor = 'text-gray-700 hover:text-blue-600';

    return (
        <footer className="bg-white shadow-md p-4 flex justify-between items-center mt-auto border-t border-gray-200 z-40">
            <button onClick={() => onNavigate('landing')} aria-label="Go to homepage">
              <Logo className="text-gray-800 h-12 sm:h-16" />
            </button>
            <nav>
                <div className="flex items-center space-x-1">
                    <DropdownMenu triggerText="For Engineers" direction="up">
                        <button onClick={() => onNavigate('forEngineers')} className={dropdownItemClass}>Explore Features</button>
                        <button onClick={() => onNavigate('engineerSignUp')} className={dropdownItemClass}>Profile Setup</button>
                    </DropdownMenu>
                    <DropdownMenu triggerText="For Companies" direction="up">
                        <button onClick={() => onNavigate('forCompanies')} className={dropdownItemClass}>Why It's Free</button>
                        <button onClick={() => onNavigate('login')} className={dropdownItemClass}>Post a Job</button>
                    </DropdownMenu>
                    <button
                        onClick={onHowItWorksClick}
                        className={`px-4 py-2 font-medium text-xs ${textColor}`}
                    >
                        How It Works
                    </button>
                    <button
                        onClick={() => onNavigate('investors')}
                        className={`px-4 py-2 font-medium text-xs ${textColor}`}
                    >
                        For Investors
                    </button>
                </div>
            </nav>
        </footer>
    );
};