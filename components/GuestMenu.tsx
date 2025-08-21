import React from 'react';
import { LogIn } from './Icons.tsx';

interface GuestMenuProps {
    onHowItWorksClick: () => void;
    onLoginClick: () => void;
}

export const GuestMenu = ({ onHowItWorksClick, onLoginClick }: GuestMenuProps) => (
    <div className="flex items-center space-x-2">
        <button
            onClick={onHowItWorksClick}
            className="px-4 py-2 text-gray-700 hover:text-blue-600"
        >
            How It Works
        </button>
        <a
            href="#investors"
            className="px-4 py-2 text-gray-700 hover:text-blue-600"
        >
            For Investors
        </a>
        <button
            onClick={onLoginClick}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
            <LogIn className="w-4 h-4 mr-2" />
            Login / Sign Up
        </button>
    </div>
);