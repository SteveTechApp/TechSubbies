import React, { useState } from 'react';
import { LogOut, LogIn } from 'lucide-react';
import { useAppContext } from '../context/AppContext.tsx';
import { Logo } from './Logo.tsx';
import { HowItWorksModal } from './HowItWorksModal.tsx';
import { LoginSelector } from '../views/LoginSelector.tsx';

export const Header = () => {
    const { user, logout } = useAppContext();
    const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
    const [isLoginSelectorOpen, setIsLoginSelectorOpen] = useState(false);

    const UserMenu = () => (
        <div className='flex items-center space-x-4'>
            <span className='text-gray-700 hidden sm:block'>Welcome, {user?.profile?.name}</span>
            <img src={user?.profile?.avatar} alt='User Avatar' className='w-10 h-10 rounded-full border-2 border-blue-500' />
            <button
                onClick={logout}
                className='flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
            >
                <LogOut className='w-4 h-4 mr-2' />
                Logout
            </button>
        </div>
    );

    const GuestMenu = () => (
        <div className='flex items-center space-x-2'>
            <button
                onClick={() => setIsHowItWorksOpen(true)}
                className='px-4 py-2 text-gray-700 hover:text-blue-600'
            >
                How It Works
            </button>
            <a
                href='#investors'
                className='px-4 py-2 text-gray-700 hover:text-blue-600'
            >
                For Investors
            </a>
            <button
                onClick={() => setIsLoginSelectorOpen(true)}
                className='flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
            >
                <LogIn className='w-4 h-4 mr-2' />
                Login / Sign Up
            </button>
        </div>
    );

    return (
        <>
            <header className='bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50'>
                <Logo className='text-gray-800' />
                <nav>{user ? <UserMenu /> : <GuestMenu />}</nav>
            </header>
            <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
            {!user && <LoginSelector isOpen={isLoginSelectorOpen} onClose={() => setIsLoginSelectorOpen(false)} />}
        </>
    );
};
