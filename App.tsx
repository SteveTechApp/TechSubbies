import React, { useState } from 'react';
import { useAppContext } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './views/LandingPage';
import { LoginSelector } from './views/LoginSelector';
import { EngineerDashboard } from './views/EngineerDashboard';
import { CompanyDashboard } from './views/CompanyDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { ResourcingDashboard } from './views/ResourcingDashboard';
import { HowItWorksModal } from './components/HowItWorksModal';
import { EngineerSignUpWizard } from './views/EngineerSignUpWizard';
import { CompanySignUpWizard } from './views/CompanySignUpWizard';
import { ForEngineersPage } from './views/ForEngineersPage';
import { ForCompaniesPage } from './views/ForCompaniesPage';
import { PricingPage } from './views/PricingPage';
import { AboutUsPage } from './views/AboutUsPage';
import { InvestorPage } from './views/InvestorPage';
import { LegalPage } from './views/LegalPage';
import { AIAssistant } from './components/AIAssistant';
import { UserGuidePage } from './views/UserGuidePage';
import { ResourcingCompanySignUpWizard } from './views/ResourcingCompanySignUpWizard';


function App() {
  const { user, currentPage, setCurrentPage } = useAppContext();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const onNavigate = (page: any) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    if (user) {
      switch (user.role) {
        case 'Engineer':
          return <EngineerDashboard />;
        case 'Company':
          return <CompanyDashboard />;
        case 'Admin':
          return <AdminDashboard />;
        case 'ResourcingCompany':
            return <ResourcingDashboard />;
        default:
          return <LandingPage onNavigate={onNavigate} />;
      }
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={onNavigate} />;
      case 'login':
        return <LoginSelector onNavigate={onNavigate} />;
      case 'engineerSignUp':
        return <EngineerSignUpWizard onCancel={() => onNavigate('login')} />;
      case 'companySignUp':
        return <CompanySignUpWizard onCancel={() => onNavigate('login')} />;
      case 'resourcingCompanySignUp':
        return <ResourcingCompanySignUpWizard onCancel={() => onNavigate('login')} />;
      case 'forEngineers':
          return <ForEngineersPage onNavigate={onNavigate} />;
      case 'forCompanies':
          return <ForCompaniesPage onNavigate={onNavigate} />;
      case 'pricing':
          return <PricingPage onNavigate={onNavigate} />;
      case 'aboutUs':
          return <AboutUsPage onNavigate={onNavigate} />;
      case 'investors':
          return <InvestorPage onNavigate={onNavigate} />;
      case 'helpCenter':
        return <UserGuidePage onNavigate={onNavigate} />;
      case 'terms':
          return <LegalPage page="terms" onNavigate={onNavigate} />;
      case 'privacy':
          return <LegalPage page="privacy" onNavigate={onNavigate} />;
      case 'security':
          return <LegalPage page="security" onNavigate={onNavigate} />;
      default:
        return <LandingPage onNavigate={onNavigate} />;
    }
  };
  
  const showHeaderFooter = !user && !['login', 'engineerSignUp', 'companySignUp', 'resourcingCompanySignUp'].includes(currentPage);
  const mainContentClass = showHeaderFooter ? "pt-20" : "";

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {showHeaderFooter && <Header onNavigate={onNavigate} onHowItWorksClick={() => setIsHowItWorksOpen(true)} />}
      <main className={`flex-grow ${mainContentClass}`}>
        {renderPage()}
      </main>
      {showHeaderFooter && <Footer onNavigate={onNavigate} onHowItWorksClick={() => setIsHowItWorksOpen(true)} />}

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onNavigate={onNavigate}
      />
      
      {user && <AIAssistant />}
    </div>
  );
}

export default App;
