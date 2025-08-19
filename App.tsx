import React from 'react';
import { useAppContext } from './context/AppContext';
import { Role } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './views/LandingPage';
import { EngineerDashboard } from './views/EngineerDashboard';
import { CompanyDashboard } from './views/CompanyDashboard';

const App: React.FC = () => {
  const { role } = useAppContext();

  const renderContent = () => {
    switch (role) {
      case Role.ENGINEER:
        return <EngineerDashboard />;
      case Role.COMPANY:
        return <CompanyDashboard />;
      case Role.NONE:
      default:
        return <LandingPage />;
    }
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
