
import React from 'react';
import { useAppContext } from './context/AppContext';
import { Role } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './views/LandingPage';
import { EngineerDashboard } from './views/EngineerDashboard';
import { CompanyDashboard } from './views/CompanyDashboard';
import { LoginSelector } from './views/LoginSelector';

const App: React.FC = () => {
  const { role, currentUser } = useAppContext();

  const renderContent = () => {
    if (currentUser) {
      // @ts-ignore - 'skillProfiles' is a unique property of Engineer
      if (currentUser.skillProfiles) {
        return <EngineerDashboard />;
      }
      return <CompanyDashboard />;
    }

    if (role === Role.NONE) {
      return <LandingPage />;
    }

    return <LoginSelector roleToLogin={role} />;
  };

  return (
    // Changed bg-gray-50 to bg-gray-100 for a LinkedIn-like background
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Header />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
