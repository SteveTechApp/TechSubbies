import React, { useState } from 'react';
import { useNavigation } from './context/NavigationContext';
import { useAuth } from './context/AuthContext';
import { Page } from './types';

// Page Components
import { LandingPage } from './views/LandingPage';
import { LoginSelector } from './views/LoginSelector';
import { EngineerSignUpWizard } from './views/EngineerSignUpWizard';
import { CompanySignUpWizard } from './views/CompanySignUpWizard';
import { ResourcingCompanySignUpWizard } from './views/ResourcingCompanySignUpWizard';
import { EngineerDashboard } from './views/EngineerDashboard';
import { CompanyDashboard } from './views/CompanyDashboard';
import { ResourcingDashboard } from './views/ResourcingDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { ForEngineersPage } from './views/ForEngineersPage';
import { ForCompaniesPage } from './views/ForCompaniesPage';
import { ForResourcingCompaniesPage } from './views/ForResourcingCompaniesPage';
import { AboutUsPage } from './views/AboutUsPage';
import { InvestorPage } from './views/InvestorPage';
import { PricingPage } from './views/PricingPage';
import { LegalPage } from './views/LegalPage';
import { AccessibilityPage } from './views/AccessibilityPage';
import { HowItWorksPage } from './views/HowItWorksPage';
import { UserGuidePage } from './views/UserGuidePage';
import { TutorialsPage } from './views/TutorialsPage';

// Common Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HowItWorksModal } from './components/HowItWorksModal';
import { AIAssistant } from './components/AIAssistant';

const App = () => {
    const { page, setPage } = useNavigation();
    const { user } = useAuth();
    const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

    const renderPage = () => {
        // Automatically route logged-in users to their dashboard if they land on a public page
        if (user && (page === Page.LANDING || page === Page.LOGIN)) {
            switch (user.role) {
                case 'Engineer': setPage(Page.ENGINEER_DASHBOARD); break;
                case 'Company':
                    setPage(Page.COMPANY_DASHBOARD); break;
                case 'Resourcing Company':
                    return <ResourcingDashboard />;
                case 'Admin':
                    return <AdminDashboard />;
            }
        }
        
        switch (page) {
            case Page.LANDING: return <LandingPage onNavigate={setPage} />;
            case Page.LOGIN: return <LoginSelector onNavigate={setPage} />;
            case Page.ENGINEER_SIGNUP: return <EngineerSignUpWizard onCancel={() => setPage(Page.LOGIN)} />;
            case Page.COMPANY_SIGNUP: return <CompanySignUpWizard onCancel={() => setPage(Page.LOGIN)} />;
            case Page.RESOURCING_SIGNUP: return <ResourcingCompanySignUpWizard onCancel={() => setPage(Page.LOGIN)} />;
            
            // Dashboards (protected by user role check inside the component)
            case Page.ENGINEER_DASHBOARD: return <EngineerDashboard />;
            case Page.COMPANY_DASHBOARD: return <CompanyDashboard />;
            
            // Content Pages
            case Page.FOR_ENGINEERS: return <ForEngineersPage onNavigate={setPage} />;
            case Page.FOR_COMPANIES: return <ForCompaniesPage onNavigate={setPage} />;
            case Page.FOR_RESOURCING: return <ForResourcingCompaniesPage onNavigate={setPage} />;
            case Page.ABOUT_US: return <AboutUsPage onNavigate={setPage} />;
            case Page.INVESTORS: return <InvestorPage onNavigate={setPage} />;
            case Page.PRICING: return <PricingPage onNavigate={setPage} />;
            case Page.LEGAL: return <LegalPage page="terms" onNavigate={setPage} />;
            case Page.ACCESSIBILITY: return <AccessibilityPage />;
            case Page.HELP: return <UserGuidePage onNavigate={setPage} />;
            case Page.TUTORIALS: return <TutorialsPage onNavigate={setPage} />;
            
            default:
                // Handle complex pages or redirect
                // FIX: Safely cast page to string to avoid potential 'never' type errors.
                if (String(page).startsWith('how-it-works')) return <HowItWorksPage onNavigate={setPage} />;
                if (user?.role === 'Resourcing Company') return <ResourcingDashboard />;
                if (user?.role === 'Admin') return <AdminDashboard />;
                return <LandingPage onNavigate={setPage} />;
        }
    };
    
    // FIX: Safely cast page to string to avoid potential 'never' type errors.
    const isDashboard = String(page).toLowerCase().includes('dashboard') || 
                        (user?.role === 'Resourcing Company' && page === Page.COMPANY_DASHBOARD) ||
                        (user?.role === 'Admin' && page === Page.COMPANY_DASHBOARD);


    return (
        <div className="flex flex-col min-h-screen">
            {!isDashboard && <Header onNavigate={setPage} onHowItWorksClick={() => setIsHowItWorksOpen(true)} />}
            <main className={`flex-grow ${!isDashboard ? 'pt-16' : ''}`}>
                {renderPage()}
            </main>
            {!isDashboard && <Footer onNavigate={setPage} />}

            <HowItWorksModal
                isOpen={isHowItWorksOpen}
                onClose={() => setIsHowItWorksOpen(false)}
                onNavigate={setPage}
            />
            {user && <AIAssistant />}
        </div>
    );
};

export default App;