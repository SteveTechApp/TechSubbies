import React, { useState } from 'react';
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
import { InvestorRelationsPage } from './views/InvestorRelationsPage.tsx';
import { AIAssistant } from './components/AIAssistant.tsx';
import { HowItWorksModal } from './components/HowItWorksModal.tsx';


const App = () => {
    const { user } = useAppContext();
    const [page, setPage] = useState<Page>('landing');
    const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

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
            case 'forEngineers':
                return <ForEngineersPage {...pageProps} />;
            case 'forCompanies':
                return <ForCompaniesPage {...pageProps} />;
            case 'investors':
                return <InvestorRelationsPage {...pageProps} />;
            case 'landing':
            default:
                return <LandingPage {...pageProps} />;
        }
    };

    return (
        <>
            {renderPage()}
            <AIAssistant />
            <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
        </>
    );
};

export default App;