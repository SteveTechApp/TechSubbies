import React from 'react';
import { LogIn } from './Icons.tsx';
import { DropdownMenu } from './DropdownMenu.tsx';

interface GuestMenuProps {
    onHowItWorksClick: () => void;
    onLoginClick: () => void;
    isLanding?: boolean;
}

export const GuestMenu = ({ onHowItWorksClick, onLoginClick, isLanding = false }: GuestMenuProps) => {
    const textColor = isLanding ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-blue-600';
    const loginButtonClass = isLanding 
        ? "flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-md hover:bg-white/30 transition-colors"
        : "flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors";
    
    const dropdownItemClass = isLanding
        ? 'block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10'
        : 'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100';

    return (
        <div className="flex items-center space-x-1">
             <DropdownMenu triggerText="For Engineers" isLanding={isLanding}>
                <button onClick={onLoginClick} className={dropdownItemClass}>Find Work</button>
                <button onClick={onLoginClick} className={dropdownItemClass}>Profile Setup</button>
            </DropdownMenu>
            <DropdownMenu triggerText="For Companies" isLanding={isLanding}>
                <button onClick={onLoginClick} className={dropdownItemClass}>Post a Job</button>
                <button onClick={onLoginClick} className={dropdownItemClass}>Find Talent</button>
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
