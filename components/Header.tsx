import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Logo } from './Logo.tsx';
import { UserMenu } from './UserMenu.tsx';
import { GuestMenu } from './GuestMenu.tsx';

interface HeaderProps {
    isLanding?: boolean;
    onHowItWorksClick?: () => void;
    onLoginClick?: () => void;
    onNavigate?: (page: 'forEngineers' | 'forCompanies') => void;
}

export const Header = ({ isLanding = false, onHowItWorksClick, onLoginClick, onNavigate }: HeaderProps) => {
    const { user, logout } = useAppContext();

    const headerClasses = isLanding
        ? "bg-white shadow-md p-4 flex justify-between items-center z-50"
        : "bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50";
    
    const logoColorClass = "text-gray-800";

    return (
        <header className={headerClasses}>
            <a href="/" aria-label="Go to homepage">
              <Logo className={logoColorClass} />
            </a>
            <nav>
                {user ? (
                    <UserMenu user={user} logout={logout} />
                ) : (
                    <GuestMenu 
                        isLanding={isLanding}
                        onHowItWorksClick={onHowItWorksClick!} 
                        onLoginClick={onLoginClick!}
                        onNavigate={onNavigate}
                    />
                )}
            </nav>
        </header>
    );
};