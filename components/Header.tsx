import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Logo } from './Logo.tsx';
import { HowItWorksModal } from './HowItWorksModal.tsx';
import { LoginSelector } from '../views/LoginSelector.tsx';
import { UserMenu } from './UserMenu.tsx';
import { GuestMenu } from './GuestMenu.tsx';

export const Header = () => {
    const { user, logout } = useAppContext();
    const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
    const [isLoginSelectorOpen, setIsLoginSelectorOpen] = useState(false);

    return (
        <>
            <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
                <Logo className="text-gray-800" />
                <nav>
                    {user ? (
                        <UserMenu user={user} logout={logout} />
                    ) : (
                        <GuestMenu 
                            onHowItWorksClick={() => setIsHowItWorksOpen(true)} 
                            onLoginClick={() => setIsLoginSelectorOpen(true)} 
                        />
                    )}
                </nav>
            </header>
            <HowItWorksModal 
                isOpen={isHowItWorksOpen} 
                onClose={() => setIsHowItWorksOpen(false)} 
            />
            {!user && (
                <LoginSelector 
                    isOpen={isLoginSelectorOpen} 
                    onClose={() => setIsLoginSelectorOpen(false)} 
                />
            )}
        </>
    );
};
