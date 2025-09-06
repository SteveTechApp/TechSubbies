import React, { useState, useEffect } from 'react';
import { useAppContext } from './context/AppContext';
// FIX: Corrected module imports to remove file extensions.
import { Role, Page } from './types';
import { LandingPage } from './views/LandingPage';
import { EngineerDashboard } from './views/EngineerDashboard';
import { CompanyDashboard } from './views/CompanyDashboard';
import { ResourcingDashboard } from './views/ResourcingDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { LoginSelector } from './views/LoginSelector';
import { ForEngineersPage } from './views/ForEngineersPage';
import { ForCompaniesPage } from './views/ForCompaniesPage';
import { EngineerSignUpWizard } from './views/EngineerSignUpWizard';
import { CompanySignUpWizard } from './views/CompanySignUpWizard';
import { ResourcingCompanySignUpWizard } from './views/ResourcingCompanySignUpWizard';
import { InvestorRelationsPage } from './views/InvestorRelationsPage';
import { AboutUsPage } from './views/AboutUsPage';
import { LegalPage } from './views/LegalPage';
import { PricingPage } from './views/PricingPage';
import { HelpCenterPage } from './views/UserGuidePage';
import { AIAssistant } from './components/AIAssistant';
import { HowItWorksModal } from './components/HowItWorksModal';
import { PaymentModal } from './components/PaymentModal';

const App = () => {
    const { user, purchaseDayPass, setCurrentPageContext } = useAppContext();
    const [page, setPage] = useState<Page>('landing');
    const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        // For logged-out users, the page state is the context.
        // For logged-in users, the dashboard component will set the context.
        if (!user) {
            setCurrentPageContext(page);
        }
        window.scrollTo(0, 0);
    }, [page, user, setCurrentPageContext]);

    const onNavigate = (targetPage: Page) => {
        setPage(targetPage);
    };
    
    const handleHowItWorksClick = () => setIsHowItWorksOpen(true);
    
    const handleDayPassPurchase = () => {
        purchaseDayPass();
        setIsPaymentModalOpen(false);
    };

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
            case 'resourcingCompanySignUp':
                return <ResourcingCompanySignUpWizard onCancel={() => onNavigate('login')} />;
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
            case 'security':
                return <LegalPage documentType="security" {...pageProps} />;
            case 'pricing':
                return <PricingPage {...pageProps} />;
            case 'helpCenter':
                return <HelpCenterPage {...pageProps} />;
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
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSuccess={handleDayPassPurchase}
                amount={2.99}
                currency="GBP"
                paymentDescription="12-Hour Premium Access Pass"
            />
        </>
    );
};

export default App;