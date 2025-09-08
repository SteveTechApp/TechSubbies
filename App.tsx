import React, { useState } from 'react';
import { useAppContext } from './context/AppContext';
import { Page, Role } from './types';

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AIAssistant } from './components/AIAssistant';
import { ApplicantDeepDiveModal } from './components/Company/ApplicantDeepDiveModal';

// Views
import { LandingPage } from './views/LandingPage';
import { ForEngineersPage } from './views/ForEngineersPage';
import { ForCompaniesPage } from './views/ForCompaniesPage';
import { PricingPage } from './views/PricingPage';
import { AboutUsPage } from './views/AboutUsPage';
import { InvestorPage } from './views/InvestorPage';
import { LoginSelector } from './views/LoginSelector';
import { LegalPage } from './views/LegalPage';
import { EngineerSignUpWizard } from './views/EngineerSignUpWizard';
import { CompanySignUpWizard } from './views/CompanySignUpWizard';
import { ResourcingCompanySignUpWizard } from './views/ResourcingCompanySignUpWizard';
import { UserGuidePage } from './views/UserGuidePage';
import { InvestorRelationsPage } from './views/InvestorRelationsPage';

// Dashboards
import { EngineerDashboard } from './views/EngineerDashboard';
import { CompanyDashboard } from './views/CompanyDashboard';
import { ResourcingDashboard } from './views/ResourcingDashboard';
import { AdminDashboard } from './views/AdminDashboard';


function App() {
  const { user, page, setPage, applicantForDeepDive, setApplicantForDeepDive } = useAppContext();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const handleNavigate = (newPage: Page) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  const handleCancelSignUp = () => {
    setPage('login');
  }

  const renderPage = () => {
    if (user) {
      switch (user.role) {
        case Role.ENGINEER: return <EngineerDashboard />;
        case Role.COMPANY: return <CompanyDashboard />;
        case Role.RESOURCING_COMPANY: return <ResourcingDashboard />;
        case Role.ADMIN: return <AdminDashboard />;
        default: setPage('landing'); return null; // Should not happen
      }
    }

    switch (page) {
      case 'landing': return <LandingPage onNavigate={handleNavigate} />;
      case 'forEngineers': return <ForEngineersPage onNavigate={handleNavigate} />;
      case 'forCompanies': return <ForCompaniesPage onNavigate={handleNavigate} />;
      case 'pricing': return <PricingPage onNavigate={handleNavigate} />;
      case 'investors': return <InvestorPage onNavigate={handleNavigate} />;
      case 'investorRelations': return <InvestorRelationsPage onNavigate={handleNavigate} />;
      case 'aboutUs': return <AboutUsPage onNavigate={handleNavigate} />;
      case 'login': return <LoginSelector onNavigate={handleNavigate} />;
      case 'engineerSignUp': return <EngineerSignUpWizard onCancel={handleCancelSignUp} />;
      case 'companySignUp': return <CompanySignUpWizard onCancel={handleCancelSignUp} />;
      case 'resourcingCompanySignUp': return <ResourcingCompanySignUpWizard onCancel={handleCancelSignUp} />;
      case 'terms': return <LegalPage page="terms" onNavigate={handleNavigate} />;
      case 'privacy': return <LegalPage page="privacy" onNavigate={handleNavigate} />;
      case 'security': return <LegalPage page="security" onNavigate={handleNavigate} />;
      case 'helpCenter': case 'userGuide': return <UserGuidePage onNavigate={handleNavigate} />;
      default: return <LandingPage onNavigate={handleNavigate} />;
    }
  };
  
  const isDashboard = !!user;
  const isSignUp = ['engineerSignUp', 'companySignUp', 'resourcingCompanySignUp'].includes(page);
  const showHeaderFooter = !isDashboard && !isSignUp;

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {showHeaderFooter && <Header onNavigate={handleNavigate} onHowItWorksClick={() => setIsHowItWorksOpen(true)} />}
        <main className={`flex-grow ${showHeaderFooter ? 'pt-20' : ''}`}>
          {renderPage()}
        </main>
        {showHeaderFooter && <Footer onNavigate={handleNavigate} onHowItWorksClick={() => setIsHowItWorksOpen(true)} />}
        
        <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} onNavigate={handleNavigate} />
        <AIAssistant />
        
        {applicantForDeepDive && (
            <ApplicantDeepDiveModal
                isOpen={!!applicantForDeepDive}
                onClose={() => setApplicantForDeepDive(null)}
                job={applicantForDeepDive.job}
                engineer={applicantForDeepDive.engineer}
            />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;