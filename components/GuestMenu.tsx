import React, { useState } from 'react';
// FIX: Corrected import path for icons.
import { LogIn, Menu, X } from './Icons';
import { DropdownMenu } from './DropdownMenu';
// FIX: Corrected import path for types.
import { Page } from '../types';
import { Logo } from './Logo';

interface GuestMenuProps {
    onHowItWorksClick: () => void;
    onNavigate: (page: Page) => void;
}

export const GuestMenu = ({ onHowItWorksClick, onNavigate }: GuestMenuProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const textColor = 'text-gray-700 hover:text-blue-600';
    const navButtonClass = `px-4 py-2 font-medium text-base ${textColor} text-center`;
    const loginButtonClass = "flex items-center justify-center text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-base";
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
                    {/* FIX: Replaced string literals with Page enum members for type safety. */}
                    <button onClick={() => onNavigate(Page.FOR_ENGINEERS)} className={dropdownItemClass}>Explore Features</button>
                    <button onClick={() => onNavigate(Page.ENGINEER_SIGNUP)} className={dropdownItemClass}>Profile Setup</button>
                </DropdownMenu>
                <DropdownMenu triggerText="For Companies">
                    {/* FIX: Replaced string literals with Page enum members for type safety. */}
                    <button onClick={() => onNavigate(Page.FOR_COMPANIES)} className={dropdownItemClass}>Why It's Free</button>
                    <button onClick={() => onNavigate(Page.LOGIN)} className={dropdownItemClass}>Post a Job</button>
                </DropdownMenu>
                 <DropdownMenu triggerText="For Resourcing">
                    {/* FIX: Replaced string literals with Page enum members for type safety. */}
                    <button onClick={() => onNavigate(Page.FOR_RESOURCING)} className={dropdownItemClass}>Explore Features</button>
                    <button onClick={() => onNavigate(Page.PRICING)} className={dropdownItemClass}>View Pricing</button>
                    <button onClick={() => onNavigate(Page.RESOURCING_SIGNUP)} className={dropdownItemClass}>Sign Up</button>
                </DropdownMenu>
                <button onClick={onHowItWorksClick} className={navButtonClass}>How It Works</button>
                {/* FIX: Replaced string literals with Page enum members for type safety. */}
                <button onClick={() => onNavigate(Page.PRICING)} className={navButtonClass}>Pricing</button>
                <button onClick={() => onNavigate(Page.INVESTORS)} className={navButtonClass}>Investors</button>
                <button onClick={() => onNavigate(Page.ABOUT_US)} className={navButtonClass}>About Us</button>
                <button onClick={() => onNavigate(Page.LOGIN)} className={loginButtonClass}>
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
                        {/* FIX: Replaced string literal with Page enum for type safety. */}
                        <button onClick={() => handleMobileNav(Page.LANDING)} aria-label="Go to homepage">
                            <Logo className="text-gray-800 h-12" />
                        </button>
                        <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                            <X className="w-8 h-8 text-gray-700" />
                        </button>
                    </header>
                    <nav className="flex flex-col flex-grow space-y-5 text-center">
                        {/* FIX: Replaced string literals with Page enum members for type safety. */}
                        <button onClick={() => handleMobileNav(Page.FOR_ENGINEERS)} className={mobileLinkClass}>For Engineers</button>
                        <button onClick={() => handleMobileNav(Page.FOR_COMPANIES)} className={mobileLinkClass}>For Companies</button>
                        <button onClick={() => handleMobileNav(Page.FOR_RESOURCING)} className={mobileLinkClass}>For Resourcing</button>
                        <button onClick={handleMobileHowItWorks} className={mobileLinkClass}>How It Works</button>
                        <button onClick={() => handleMobileNav(Page.PRICING)} className={mobileLinkClass}>Pricing</button>
                        <button onClick={() => handleMobileNav(Page.INVESTORS)} className={mobileLinkClass}>Investors</button>
                        <button onClick={() => handleMobileNav(Page.ABOUT_US)} className={mobileLinkClass}>About Us</button>
                        <div className="pt-6 mt-auto">
                            <button
                                // FIX: Replaced string literal with Page enum for type safety.
                                onClick={() => handleMobileNav(Page.LOGIN)}
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