import React from 'react';
import { Logo } from './Logo.tsx';
import { Page } from '../types/index.ts';
import { DropdownMenu } from './DropdownMenu.tsx';
import { LogIn } from './Icons.tsx';

interface FooterProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

export const Footer = ({ onNavigate, onHowItWorksClick }: FooterProps) => {
    const dropdownItemClass = 'block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100';
    const textColor = 'text-gray-700 hover:text-blue-600';
    const navButtonClass = `px-4 py-2 font-medium text-xs ${textColor} text-center h-12 flex items-center`;

    return (
        <footer className="bg-white shadow-md p-4 flex justify-between items-center mt-auto border-t border-gray-200 z-40">
            <button onClick={() => onNavigate('landing')} aria-label="Go to homepage">
              <Logo className="text-gray-800 h-12 sm:h-16" />
            </button>
            <nav>
                <div className="flex items-center space-x-1">
                    <DropdownMenu triggerText={<span>For<br/>Engineers</span>} direction="up">
                        <button onClick={() => onNavigate('forEngineers')} className={dropdownItemClass}>Explore Features</button>
                        <button onClick={() => onNavigate('engineerSignUp')} className={dropdownItemClass}>Profile Setup</button>
                    </DropdownMenu>
                    <DropdownMenu triggerText={<span>For<br/>Companies</span>} direction="up">
                        <button onClick={() => onNavigate('forCompanies')} className={dropdownItemClass}>Why It's Free</button>
                        <button onClick={() => onNavigate('login')} className={dropdownItemClass}>Post a Job</button>
                    </DropdownMenu>
                    <button
                        onClick={onHowItWorksClick}
                        className={navButtonClass}
                    >
                        How It<br/>Works
                    </button>
                    <DropdownMenu triggerText={<span>Company</span>} direction="up">
                        <button onClick={() => onNavigate('aboutUs')} className={dropdownItemClass}>About Us</button>
                        <button onClick={() => onNavigate('investors')} className={dropdownItemClass}>For Investors</button>
                    </DropdownMenu>
                     <DropdownMenu triggerText={<span>Legal</span>} direction="up">
                        <button onClick={() => onNavigate('terms')} className={dropdownItemClass}>Terms of Service</button>
                        <button onClick={() => onNavigate('privacy')} className={dropdownItemClass}>Privacy Policy</button>
                    </DropdownMenu>
                    {/* Invisible placeholder to align with header's login button */}
                    <div className="flex items-center justify-center text-center px-4 py-2 text-xs h-12 invisible" aria-hidden="true">
                        <LogIn className="w-4 h-4 mr-2" />
                        <span>Login /<br/>Sign Up</span>
                    </div>
                </div>
            </nav>
        </footer>
    );
};