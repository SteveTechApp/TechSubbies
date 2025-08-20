import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Role } from '../types';

export const Footer: React.FC = () => {
  const { setRole } = useAppContext();
  
  return (
    <footer className="bg-white text-gray-600">
      <div className="container mx-auto px-6 py-4 text-center text-sm border-t border-gray-200">
        <p>&copy; {new Date().getFullYear()} TechSubbies.com. All rights reserved.</p>
        <div className="mt-2">
            <button onClick={() => setRole(Role.ADMIN)} className="text-xs text-gray-400 hover:text-gray-600 underline">
                Admin Login
            </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Investment Prospectus Demo</p>
      </div>
    </footer>
  );
};