import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Page } from '../types/index.ts';
import { Logo } from './Logo.tsx';
import { UserMenu } from './UserMenu.tsx';
import { GuestMenu } from './GuestMenu.tsx';
import { LanguageCurrencySelector } from './LanguageCurrencySelector.tsx';

interface HeaderProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick?: () => void;
}

export const Header = ({ onNavigate, onHowItWorksClick }: HeaderProps) => {
    const { user, logout } = useAppContext();

    const headerClasses = "bg-white shadow-md p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50";
    const logoColorClass = "text-gray-800";

    return (
        <header className={headerClasses}>
            <button onClick={() => onNavigate('landing')} aria-label="Go to homepage">
              <Logo className={`${logoColorClass} h-10 sm:h-12`} />
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