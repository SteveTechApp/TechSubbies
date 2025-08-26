import React, { useState, useEffect } from 'react';
import { useAppContext } from './context/AppContext.tsx';
import { Role, Page } from './types/index.ts';
import { LandingPage } from './views/LandingPage.tsx';
import { EngineerDashboard } from './views/EngineerDashboard.tsx';
import { CompanyDashboard } from './views/CompanyDashboard.tsx';
import { ResourcingDashboard } from './views/ResourcingDashboard.tsx';
import { AdminDashboard } from './views/AdminDashboard.tsx';
import { LoginSelector } from './views/LoginSelector.tsx';
import { ForEngineersPage } from './views/ForEngineersPage.tsx';
import { ForCompaniesPage } from './views/ForCompaniesPage.tsx';
import { EngineerSignUpWizard } from './views/EngineerSignUpWizard.tsx';
import { CompanySignUpWizard } from './views/CompanySignUpWizard.tsx';
import { InvestorRelationsPage } from './views/InvestorRelationsPage.tsx';
import { AboutUsPage } from './views/AboutUsPage.tsx';
import { LegalPage } from './views/LegalPage.tsx';
import { PricingPage } from './views/PricingPage.tsx';
import { AIAssistant } from './components/AIAssistant.tsx';
import { HowItWorksModal } from './components/HowItWorksModal.tsx';


const App = () => {
    const { user } = useAppContext();
    const [page, setPage] = useState<Page>('landing');
    const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

    // Scroll to top whenever the page changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);

    const onNavigate = (targetPage: Page) => {
        setPage(targetPage);
    };
    
    const handleHowItWorksClick = () => setIsHowItWorksOpen(true);

    const renderPage = () => {
        if (user) {
            switch (user.role) {
                case Role.ENGINEER:
                    return <EngineerDashboard />;
                case Role.COMPANY:
                    return <CompanyDashboard />;
                case Role.RESOURCING_COMPANY:
                    return <ResourcingDashboard />;
                case Role.ADMIN:
                    return <AdminDashboard />;
                default:
                    return <p>Loading dashboard...</p>;
            }
        }

        const pageProps = { onNavigate, onHowItWorksClick: handleHowItWorksClick };

        switch (page) {
            case 'login':
                return <LoginSelector onNavigate={onNavigate} />;
            case 'engineerSignUp':
                return <EngineerSignUpWizard onCancel={() => onNavigate('login')} />;
            case 'companySignUp':
                return <CompanySignUpWizard onCancel={() => onNavigate('login')} />;
            case 'forEngineers':
                return <ForEngineersPage {...pageProps} />;
            case 'forCompanies':
                return <ForCompaniesPage {...pageProps} />;
            case 'investors':
                return <InvestorRelationsPage {...pageProps} />;
            case 'aboutUs':
                return <AboutUsPage {...pageProps} />;
            case 'terms':
                return <LegalPage documentType="terms" {...pageProps} />;
            case 'privacy':
                return <LegalPage documentType="privacy" {...pageProps} />;
            case 'pricing':
                return <PricingPage {...pageProps} />;
            case 'landing':
            default:
                return <LandingPage {...pageProps} />;
        }
    };

    return (
        <>
            {renderPage()}
            <AIAssistant />
            <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} onNavigate={onNavigate} />
        </>
    );
};

export default App;