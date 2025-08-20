import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-600">
      <div className="container mx-auto px-6 py-4 text-center text-sm border-t border-gray-200">
        <p>&copy; {new Date().getFullYear()} TechSubbies.com. All rights reserved.</p>
        <p className="text-xs text-gray-400 mt-1">Investment Prospectus Demo</p>
      </div>
    </footer>
  );
};