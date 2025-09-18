import React from 'react';
import { Logo } from './Logo';
import { Linkedin, X as XIcon } from './Icons';
// FIX: Corrected import path for types.
import { Page } from '../types';

export const Footer = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    const footerLinks = [
        { label: 'About Us', page: 'aboutUs' as Page },
        { label: 'For Engineers', page: 'forEngineers' as Page },
        { label: 'For Companies', page: 'forCompanies' as Page },
        { label: 'Investors', page: 'investors' as Page },
        { label: 'Terms of Service', page: 'legal' as Page, subPage: 'terms' },
        { label: 'Privacy Policy', page: 'legal' as Page, subPage: 'privacy' },
        { label: 'Data Security', page: 'legal' as Page, subPage: 'security' },
        { label: 'Accessibility', page: 'accessibility' as Page },
    ];

    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <Logo className="h-12 mb-4" />
                        <p className="text-gray-400 text-sm">The Global Specialist Freelance Network</p>
                    </div>
                    <div className="md:col-span-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {footerLinks.map(link => (
                                <button key={link.label} onClick={() => onNavigate(link.page)} className="text-left text-gray-300 hover:text-white text-sm">
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-4 border-t border-gray-700 flex justify-between items-center">
                    <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} TechSubbies.com. All rights reserved.</p>
                    <div className="flex items-center space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white"><XIcon /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Linkedin /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
