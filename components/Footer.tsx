import React from 'react';
import { Logo } from './Logo.tsx';
import { APP_NAME } from '../context/AppContext.tsx';

interface FooterProps {
    onLoginClick?: () => void;
}

export const Footer = ({ onLoginClick }: FooterProps) => {

    const handleActionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (onLoginClick) {
            onLoginClick();
        } else {
            // This case happens for logged-in users where the prop isn't passed.
            // In a real app, this would navigate. For the demo, we can show an alert.
            alert("This functionality is available via your dashboard navigation.");
        }
    };

    const handlePlaceholderClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        alert('This page is not yet implemented in the demo.');
    };

    const linkClass = "text-gray-400 hover:text-white";

    return (
        <footer className="bg-gray-800 text-white p-8 mt-12">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1">
                    <Logo className="text-white" />
                    <p className="mt-2 text-gray-400">Connecting tech talent with opportunity.</p>
                </div>
                <div>
                    <h3 className="font-bold">For Engineers</h3>
                    <ul className="mt-2 space-y-2">
                        <li><a href="#" onClick={handleActionClick} className={linkClass}>Find Work</a></li>
                        <li><a href="#" onClick={handleActionClick} className={linkClass}>Profile Setup</a></li>
                        <li><a href="#" onClick={handlePlaceholderClick} className={linkClass}>Pricing</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold">For Companies</h3>
                    <ul className="mt-2 space-y-2">
                        <li><a href="#" onClick={handleActionClick} className={linkClass}>Post a Job</a></li>
                        <li><a href="#" onClick={handleActionClick} className={linkClass}>Find Talent</a></li>
                        <li><a href="#" onClick={handlePlaceholderClick} className={linkClass}>Why It's Free</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold">Company</h3>
                    <ul className="mt-2 space-y-2">
                        <li><a href="#investors" className={linkClass}>For Investors</a></li>
                        <li><a href="#" onClick={handlePlaceholderClick} className={linkClass}>About Us</a></li>
                        <li><a href="mailto:invest@techsubbies.com" className={linkClass}>Contact</a></li>
                    </ul>
                </div>
            </div>
            <div className="text-center text-gray-500 mt-8 pt-4 border-t border-gray-700">
                © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </div>
        </footer>
    );
};
