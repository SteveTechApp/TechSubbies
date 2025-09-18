import React from 'react';
import { Menu, X } from './Icons';

interface MobileSidebarToggleProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const MobileSidebarToggle = ({ isOpen, setIsOpen }: MobileSidebarToggleProps) => {
    return (
        <button
            className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-lg"
            onClick={() => setIsOpen(!isOpen)}
        >
            {isOpen ? <X /> : <Menu />}
        </button>
    );
};
