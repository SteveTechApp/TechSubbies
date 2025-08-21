import React from 'react';
import { useAppContext } from './context/AppContext.tsx';
import { Role } from './types.ts';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { LandingPage } from './views/LandingPage.tsx';
import { EngineerDashboard } from './views/EngineerDashboard.tsx';
import { CompanyDashboard } from './views/CompanyDashboard.tsx';
import { ResourcingDashboard } from './views/ResourcingDashboard.tsx';
import { AdminDashboard } from './views/AdminDashboard.tsx';

const App = () => {
    const { user } = useAppContext();

    const AppLayout = ({ children }: { children: React.ReactNode }) => (
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <div className="flex-grow">{children}</div>
        </div>
    );

    const renderDashboard = () => {
        if (!user) return null;
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
                return null;
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow">
                    <LandingPage />
                </div>
                <Footer />
            </div>
        );
    }
    
    return (
        <AppLayout>
            {renderDashboard()}
        </AppLayout>
    );
};

export default App;
