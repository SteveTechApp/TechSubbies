
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Role, Currency } from '../types';
import { DollarSign, PoundSterling, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { HowItWorksModal } from './HowItWorksModal';

export const Header: React.FC = () => {
  const { role, setRole, setCurrency, currency, currentUser, logout, setPublicView } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const toggleCurrency = () => {
    setCurrency(currency === Currency.GBP ? Currency.USD : Currency.GBP);
  };

  const handleLogoClick = () => {
    setRole(Role.NONE);
  };

  return (
    <>
      <header className="bg-white text-gray-700 shadow-sm sticky top-0 z-40">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <button onClick={handleLogoClick} className="flex items-center space-x-2">
            <Logo />
          </button>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              How it Works
            </button>
            <button
              onClick={() => setPublicView('investors')}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              For Investors
            </button>
            <button onClick={toggleCurrency} className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
              {currency === Currency.GBP ? <PoundSterling size={20} /> : <DollarSign size={20} />}
              <span className="ml-1 text-sm font-medium">{currency === Currency.GBP ? 'GBP' : 'USD'}</span>
            </button>
            
            {currentUser ? (
               <div className="flex items-center space-x-4">
                 <span className="text-sm text-gray-600 hidden sm:block">Welcome, {currentUser.name.split(' ')[0]}</span>
                 <button onClick={logout} className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors" title="Logout">
                    <LogOut size={16} className="mr-0 sm:mr-2"/>
                    <span className="hidden sm:inline">Logout</span>
                 </button>
               </div>
            ) : null}
          </div>
        </nav>
      </header>
      <HowItWorksModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
