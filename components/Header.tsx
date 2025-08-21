import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Logo } from './Logo.tsx';
import { UserMenu } from './UserMenu.tsx';
import { GuestMenu } from './GuestMenu.tsx';

interface HeaderProps {
    isLanding?: boolean;
    onHowItWorksClick?: () => void;
    onLoginClick?: () => void;
}

export const Header = ({ isLanding = false, onHowItWorksClick, onLoginClick }: HeaderProps) => {
    const { user, logout } = useAppContext();

    const headerClasses = isLanding
        ? "absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-transparent"
        : "bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50";
    
    const logoColorClass = isLanding ? "text-white" : "text-gray-800";

    return (
        <header className={headerClasses}>
            <Logo className={logoColorClass} />
            <nav>
                {user ? (
                    <UserMenu user={user} logout={logout} />
                ) : (
                    <GuestMenu 
                        isLanding={isLanding}
                        onHowItWorksClick={onHowItWorksClick!} 
                        onLoginClick={onLoginClick!} 
                    />
                )}
            </nav>
        </header>
    );
};
