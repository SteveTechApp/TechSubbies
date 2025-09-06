import React from 'react';
import { useAppContext } from '../context/AppContext';
// FIX: Corrected module import to remove file extension.
import { Page } from '../types';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';
import { GuestMenu } from './GuestMenu';
import { LanguageCurrencySelector } from './LanguageCurrencySelector';

interface HeaderProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick?: () => void;
}

export const Header = ({ onNavigate, onHowItWorksClick }: HeaderProps) => {
    const { user, logout } = useAppContext();

    const headerClasses = "bg-white shadow-md p-2 flex justify-between items-center fixed top-0 left-0 right-0 z-50";
    const logoColorClass = "text-gray-800";

    return (
        <header className={headerClasses}>
            <button onClick={() => onNavigate('landing')} aria-label="Go to homepage">
              <Logo className={`${logoColorClass} h-8 sm:h-10`} />
            </button>
            <nav className="flex items-center gap-2">
                {user ? (
                    <UserMenu user={user} logout={logout} />
                ) : (
                    <GuestMenu 
                        onHowItWorksClick={onHowItWorksClick!} 
                        onNavigate={onNavigate}
                    />
                )}
                <LanguageCurrencySelector />
            </nav>
        </header>
    );
};