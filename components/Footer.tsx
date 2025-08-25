import React from 'react';
import { Logo } from './Logo.tsx';
import { Page } from '../types/index.ts';
import { DropdownMenu } from './DropdownMenu.tsx';
import { LogIn, Linkedin, XIcon, Instagram, Facebook } from './Icons.tsx';

interface FooterProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

export const Footer = ({ onNavigate, onHowItWorksClick }: FooterProps) => {
    const dropdownItemClass = 'block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100';
    const textColor = 'text-gray-700 hover:text-blue-600';
    const navButtonClass = `px-4 py-2 font-medium text-xs ${textColor} text-center h-12 flex items-center`;

    return (
        <footer className="bg-white shadow-md mt-auto border-t border-gray-200 z-40">
            {/* Main Footer Nav */}
            <div className="container mx-auto p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button onClick={() => onNavigate('landing')} aria-label="Go to homepage">
                  <Logo className="text-gray-800 h-10" />
                </button>
                <nav>
                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-1 gap-y-2">
                        <DropdownMenu triggerText={<span>For<br/>Engineers</span>} direction="up">
                            <button onClick={() => onNavigate('forEngineers')} className={dropdownItemClass}>Explore Features</button>
                            <button onClick={() => onNavigate('pricing')} className={dropdownItemClass}>View Pricing</button>
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
                    </div>
                </nav>
            </div>
            {/* Sub-Footer for Socials and Contact */}
            <div className="bg-gray-100 py-4 px-4 border-t">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 gap-4">
                    <div className="text-center md:text-left">
                        <p>&copy; {new Date().getFullYear()} TechSubbies.com. All Rights Reserved.</p>
                        <p className="mt-1">
                            Contact: <a href="mailto:contact@techsubbies.com" className="hover:underline">contact@techsubbies.com</a> | <a href="tel:+441234567890" className="hover:underline">+44 1234 567890</a>
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a href="#" className="text-gray-500 hover:text-blue-600" aria-label="LinkedIn"><Linkedin /></a>
                        <a href="#" className="text-gray-500 hover:text-blue-600" aria-label="X - formerly Twitter"><XIcon /></a>
                        <a href="#" className="text-gray-500 hover:text-blue-600" aria-label="Instagram"><Instagram /></a>
                        <a href="#" className="text-gray-500 hover:text-blue-600" aria-label="Facebook"><Facebook /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};