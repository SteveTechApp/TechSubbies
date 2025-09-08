
import React, { useState } from 'react';
import { LogIn, Menu, X } from './Icons';
import { DropdownMenu } from './DropdownMenu';
import { Page } from '../types';
import { Logo } from './Logo';

interface GuestMenuProps {
    onHowItWorksClick: () => void;
    onNavigate: (page: Page) => void;
}

export const GuestMenu = ({ onHowItWorksClick, onNavigate }: GuestMenuProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const textColor = 'text-gray-700 hover:text-blue-600';
    const navButtonClass = `px-4 py-2 font-medium text-sm ${textColor} text-center`;
    const loginButtonClass = "flex items-center justify-center text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm";
    const dropdownItemClass = 'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100';
    
    const mobileLinkClass = 'text-2xl font-bold text-gray-800 hover:text-blue-600 py-2';

    const handleMobileNav = (page: Page) => {
        onNavigate(page);
        setIsMenuOpen(false);
    };

    const handleMobileHowItWorks = () => {
        onHowItWorksClick();
        setIsMenuOpen(false);
    }

    return (
        <>
            <div className="hidden lg:flex items-center space-x-1">
                 <DropdownMenu triggerText="For Engineers">
                    <button onClick={() => onNavigate('forEngineers')} className={dropdownItemClass}>Explore Features</button>
                    <button onClick={() => onNavigate('engineerSignUp')} className={dropdownItemClass}>Profile Setup</button>
                </DropdownMenu>
                <DropdownMenu triggerText="For Companies">
                    <button onClick={() => onNavigate('forCompanies')} className={dropdownItemClass}>Why It's Free</button>
                    <button onClick={() => onNavigate('login')} className={dropdownItemClass}>Post a Job</button>
                </DropdownMenu>
                <button onClick={onHowItWorksClick} className={navButtonClass}>How It Works</button>
                <button onClick={() => onNavigate('pricing')} className={navButtonClass}>Pricing</button>
                <button onClick={() => onNavigate('investors')} className={navButtonClass}>Investors</button>
                <button onClick={() => onNavigate('aboutUs')} className={navButtonClass}>About Us</button>
                <button onClick={() => onNavigate('login')} className={loginButtonClass}>
                    <LogIn className="w-4 h-4 mr-2" />
                    <span>Login / Sign Up</span>
                </button>
            </div>

            <div className="lg:hidden">
                <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
                    <Menu className="w-8 h-8 text-gray-700" />
                </button>
            </div>

            {isMenuOpen && (
                <div className="fixed inset-0 bg-white z-50 p-6 flex flex-col lg:hidden fade-in-up">
                    <header className="flex justify-between items-center mb-10">
                        <button onClick={() => handleMobileNav('landing')} aria-label="Go to homepage">
                            <Logo className="text-gray-800 h-12" />
                        </button>
                        <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                            <X className="w-8 h-8 text-gray-700" />
                        </button>
                    </header>
                    <nav className="flex flex-col flex-grow space-y-5 text-center">
                        <button onClick={() => handleMobileNav('forEngineers')} className={mobileLinkClass}>For Engineers</button>
                        <button onClick={() => handleMobileNav('forCompanies')} className={mobileLinkClass}>For Companies</button>
                        <button onClick={handleMobileHowItWorks} className={mobileLinkClass}>How It Works</button>
                        <button onClick={() => handleMobileNav('pricing')} className={mobileLinkClass}>Pricing</button>
                        <button onClick={() => handleMobileNav('investors')} className={mobileLinkClass}>Investors</button>
                        <button onClick={() => handleMobileNav('aboutUs')} className={mobileLinkClass}>About Us</button>
                        <div className="pt-6 mt-auto">
                            <button
                                onClick={() => handleMobileNav('login')}
                                className="w-full max-w-xs mx-auto flex items-center justify-center text-center px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-bold"
                            >
                                <LogIn className="w-5 h-5 mr-2" />
                                <span>Login / Sign Up</span>
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
};