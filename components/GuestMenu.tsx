import React from 'react';
import { LogIn } from './Icons.tsx';
import { DropdownMenu } from './DropdownMenu.tsx';

type Page = 'landing' | 'login' | 'forEngineers' | 'forCompanies' | 'engineerSignUp';

interface GuestMenuProps {
    onHowItWorksClick: () => void;
    onNavigate: (page: Page) => void;
}

export const GuestMenu = ({ onHowItWorksClick, onNavigate }: GuestMenuProps) => {
    const textColor = 'text-gray-700 hover:text-blue-600';
    const loginButtonClass = "flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors";
    
    const dropdownItemClass = 'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100';

    return (
        <div className="flex items-center space-x-1">
             <DropdownMenu triggerText="For Engineers">
                <button onClick={() => onNavigate('forEngineers')} className={dropdownItemClass}>Explore Features</button>
                <button onClick={() => onNavigate('engineerSignUp')} className={dropdownItemClass}>Profile Setup</button>
            </DropdownMenu>
            <DropdownMenu triggerText="For Companies">
                <button onClick={() => onNavigate('forCompanies')} className={dropdownItemClass}>Why It's Free</button>
                <button onClick={() => onNavigate('login')} className={dropdownItemClass}>Post a Job</button>
            </DropdownMenu>
            <button
                onClick={onHowItWorksClick}
                className={`px-4 py-2 font-medium ${textColor}`}
            >
                How It Works
            </button>
            <a
                href="#investors"
                className={`px-4 py-2 font-medium ${textColor}`}
            >
                For Investors
            </a>
            <button
                onClick={() => onNavigate('login')}
                className={loginButtonClass}
            >
                <LogIn className="w-4 h-4 mr-2" />
                Login / Sign Up
            </button>
        </div>
    );
};