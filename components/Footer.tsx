import React from 'react';
import { Logo } from './Logo';
import { Linkedin, X as XIcon } from './Icons';
// FIX: Corrected import path for types.
import { Page } from '../types';

export const Footer = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    const footerLinks = [
        { label: 'About', page: 'aboutUs' as Page },
        { label: 'For Engineers', page: 'forEngineers' as Page },
        { label: 'For Companies', page: 'forCompanies' as Page },
        { label: 'Investors', page: 'investors' as Page },
        { label: 'Terms', page: 'legal' as Page, subPage: 'terms' },
        { label: 'Privacy', page: 'legal' as Page, subPage: 'privacy' },
        { label: 'Accessibility', page: 'accessibility' as Page },
    ];

    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <Logo className="h-8" />
                    <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} TechSubbies.com.</p>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-end items-center gap-x-4 gap-y-2">
                    {footerLinks.map(link => (
                        <button key={link.label} onClick={() => onNavigate(link.page)} className="text-xs text-gray-300 hover:text-white">
                            {link.label}
                        </button>
                    ))}
                    <div className="flex items-center space-x-3 pl-3 border-l border-gray-700">
                        <a href="#" className="text-gray-400 hover:text-white"><XIcon size={16} /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Linkedin size={16} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};