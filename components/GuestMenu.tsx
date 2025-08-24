import React from 'react';
import { LogIn } from './Icons.tsx';
import { DropdownMenu } from './DropdownMenu.tsx';

interface GuestMenuProps {
    onHowItWorksClick: () => void;
    onLoginClick: () => void;
    onNavigate?: (page: 'forEngineers' | 'forCompanies') => void;
    isLanding?: boolean;
}

export const GuestMenu = ({ onHowItWorksClick, onLoginClick, onNavigate, isLanding = false }: GuestMenuProps) => {
    const textColor = 'text-gray-700 hover:text-blue-600';
    const loginButtonClass = "flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors";
    
    const dropdownItemClass = 'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100';

    return (
        <div className="flex items-center space-x-1">
             <DropdownMenu triggerText="For Engineers" isLanding={isLanding}>
                <button onClick={() => onNavigate && onNavigate('forEngineers')} className={dropdownItemClass}>Explore Features</button>
                <button onClick={onLoginClick} className={dropdownItemClass}>Profile Setup</button>
            </DropdownMenu>
            <DropdownMenu triggerText="For Companies" isLanding={isLanding}>
                <button onClick={() => onNavigate && onNavigate('forCompanies')} className={dropdownItemClass}>Why It's Free</button>
                <button onClick={onLoginClick} className={dropdownItemClass}>Post a Job</button>
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
                onClick={onLoginClick}
                className={loginButtonClass}
            >
                <LogIn className="w-4 h-4 mr-2" />
                Login / Sign Up
            </button>
        </div>
    );
};