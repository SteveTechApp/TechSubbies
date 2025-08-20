
import React from 'react';
import { useAppContext } from './context/AppContext';
import { Role } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './views/LandingPage';
import { EngineerDashboard } from './views/EngineerDashboard';
import { CompanyDashboard } from './views/CompanyDashboard';
import { LoginSelector } from './views/LoginSelector';
import { EngineerProfileView } from './views/EngineerProfileView';
import { AdminDashboard } from './views/AdminDashboard';
import { DashboardSidebar } from './components/DashboardSidebar';

const App: React.FC = () => {
  const { role, currentUser, viewingEngineer } = useAppContext();

  const renderDashboardContent = () => {
    if (viewingEngineer) {
      return <EngineerProfileView />;
    }
    
    switch (role) {
      case Role.ADMIN:
        return <AdminDashboard />;
      case Role.ENGINEER:
        return <EngineerDashboard />;
      case Role.COMPANY:
        return <CompanyDashboard />;
      default:
        // Fallback to landing page if role is somehow lost
        return <LandingPage />;
    }
  };
  
  const renderPublicContent = () => {
     if (role === Role.NONE) {
        return <LandingPage />;
      } else {
        return <LoginSelector roleToLogin={role} />;
      }
  };

  if (currentUser) {
    // Render the main application layout with a sidebar
    return (
       <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar role={role} />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            {renderDashboardContent()}
          </main>
        </div>
      </div>
    );
  }

  // Render the public-facing layout
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Header />
      <main className="flex-grow">
        {renderPublicContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
