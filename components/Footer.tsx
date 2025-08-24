import React from 'react';
import { Logo } from './Logo.tsx';
import { APP_NAME } from '../context/AppContext.tsx';

type Page = 'landing' | 'login' | 'forEngineers' | 'forCompanies' | 'engineerSignUp';

interface FooterProps {
    onNavigate: (page: Page) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {

    const handlePlaceholderClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        alert('This page is not yet implemented in the demo.');
    };

    const linkClass = "text-gray-600 hover:text-blue-600 transition-colors";

    return (
        <footer className="bg-white text-gray-800 p-6 mt-auto border-t border-gray-200">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                    {/* Logo on the left */}
                     <button onClick={() => onNavigate('landing')} aria-label="Go to homepage">
                        <Logo className="text-gray-800" />
                    </button>

                    {/* Menus on the right */}
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 text-left">
                        <div>
                            <h3 className="font-bold mb-3">For Engineers</h3>
                            <ul className="space-y-2">
                                <li><button onClick={() => onNavigate('engineerSignUp')} className={linkClass}>Find Work</button></li>
                                <li><button onClick={() => onNavigate('engineerSignUp')} className={linkClass}>Profile Setup</button></li>
                                <li><button onClick={handlePlaceholderClick} className={linkClass}>Pricing</button></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-3">For Companies</h3>
                            <ul className="space-y-2">
                                <li><button onClick={() => onNavigate('login')} className={linkClass}>Post a Job</button></li>
                                <li><button onClick={() => onNavigate('login')} className={linkClass}>Find Talent</button></li>
                                <li><button onClick={() => onNavigate('forCompanies')} className={linkClass}>Why It's Free</button></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-3">Company</h3>
                            <ul className="space-y-2">
                                <li><a href="#investors" className={linkClass}>For Investors</a></li>
                                <li><button onClick={handlePlaceholderClick} className={linkClass}>About Us</button></li>
                                <li><a href="mailto:invest@techsubbies.com" className={linkClass}>Contact</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="text-center md:text-left text-gray-500 mt-8 pt-4 border-t border-gray-200">
                    © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                </div>
            </div>
        </footer>
    );
};