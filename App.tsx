import React from 'react';
import { useAppContext, Role } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { LandingPage } from './views/LandingPage.tsx';
import { EngineerDashboard } from './views/EngineerDashboard.tsx';
import { CompanyDashboard } from './views/CompanyDashboard.tsx';
import { ResourcingDashboard } from './views/ResourcingDashboard.tsx';
import { AdminDashboard } from './views/AdminDashboard.tsx';

const AppLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
    </div>
);

const App = () => {
    const { user } = useAppContext();

    const renderContent = () => {
        if (!user) {
            return <LandingPage />;
        }
        
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
                return <LandingPage />;
        }
    };

    return (
        <AppLayout>
            {renderContent()}
        </AppLayout>
    );
};

export default App;