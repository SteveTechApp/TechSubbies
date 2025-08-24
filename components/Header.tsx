import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Logo } from './Logo.tsx';
import { UserMenu } from './UserMenu.tsx';
import { GuestMenu } from './GuestMenu.tsx';

type Page = 'landing' | 'login' | 'forEngineers' | 'forCompanies' | 'engineerSignUp';

interface HeaderProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick?: () => void; // Can keep this for modals
}

export const Header = ({ onNavigate, onHowItWorksClick }: HeaderProps) => {
    const { user, logout } = useAppContext();

    const headerClasses = "bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50";
    
    const logoColorClass = "text-gray-800";

    return (
        <header className={headerClasses}>
            <button onClick={() => onNavigate('landing')} aria-label="Go to homepage">
              <Logo className={logoColorClass} />
            </button>
            <nav>
                {user ? (
                    <UserMenu user={user} logout={logout} />
                ) : (
                    <GuestMenu 
                        onHowItWorksClick={onHowItWorksClick!} 
                        onNavigate={onNavigate}
                    />
                )}
            </nav>
        </header>
    );
};