import React, { useState } from 'react';
import { useAppContext, Role } from './context/AppContext.tsx';
import { LandingPage } from './views/LandingPage.tsx';
import { EngineerDashboard } from './views/EngineerDashboard.tsx';
import { CompanyDashboard } from './views/CompanyDashboard.tsx';
import { ResourcingDashboard } from './views/ResourcingDashboard.tsx';
import { AdminDashboard } from './views/AdminDashboard.tsx';
import { LoginSelector } from './views/LoginSelector.tsx';
import { ForEngineersPage } from './views/ForEngineersPage.tsx';
import { ForCompaniesPage } from './views/ForCompaniesPage.tsx';
import { EngineerSignUpWizard } from './views/EngineerSignUpWizard.tsx';

type Page = 'landing' | 'login' | 'forEngineers' | 'forCompanies' | 'engineerSignUp';

const App = () => {
    const { user } = useAppContext();
    const [page, setPage] = useState<Page>('landing');

    const onNavigate = (targetPage: Page) => {
        setPage(targetPage);
    };

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

    switch (page) {
        case 'login':
            return <LoginSelector onNavigate={onNavigate} />;
        case 'engineerSignUp':
            return <EngineerSignUpWizard onCancel={() => onNavigate('login')} />;
        case 'forEngineers':
            return <ForEngineersPage onNavigate={onNavigate} />;
        case 'forCompanies':
            return <ForCompaniesPage onNavigate={onNavigate} />;
        case 'landing':
        default:
            return <LandingPage onNavigate={onNavigate} />;
    }
};

export default App;