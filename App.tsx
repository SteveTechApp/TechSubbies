import React, { useState } from 'react';
import { useAppContext, Role } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { LandingPage } from './views/LandingPage.tsx';
import { EngineerDashboard } from './views/EngineerDashboard.tsx';
import { CompanyDashboard } from './views/CompanyDashboard.tsx';
import { ResourcingDashboard } from './views/ResourcingDashboard.tsx';
import { AdminDashboard } from './views/AdminDashboard.tsx';
import { LoginPage } from './views/LoginSelector.tsx';
import { ForEngineersPage } from './views/ForEngineersPage.tsx';
import { ForCompaniesPage } from './views/ForCompaniesPage.tsx';

const AppLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
    </div>
);

type Page = 'landing' | 'login' | 'forEngineers' | 'forCompanies';

const App = () => {
    const { user } = useAppContext();
    const [page, setPage] = useState<Page>('landing');

    const navigate = (targetPage: Page) => {
        setPage(targetPage);
    };

    if (user) {
        const renderDashboard = () => {
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
        };
        return <AppLayout>{renderDashboard()}</AppLayout>;
    }

    switch (page) {
        case 'login':
            return <LoginPage onNavigateHome={() => navigate('landing')} />;
        case 'forEngineers':
            return <ForEngineersPage onNavigateHome={() => navigate('landing')} onLoginClick={() => navigate('login')} />;
        case 'forCompanies':
            return <ForCompaniesPage onNavigateHome={() => navigate('landing')} onLoginClick={() => navigate('login')} />;
        case 'landing':
        default:
            return (
                <LandingPage
                    onLoginClick={() => navigate('login')}
                    onNavigate={(p) => navigate(p)}
                />
            );
    }
};

export default App;