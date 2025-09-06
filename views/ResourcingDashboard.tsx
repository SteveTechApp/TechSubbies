import React, { useState, useMemo, useEffect } from 'react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { useAppContext } from '../context/AppContext';
// FIX: Corrected module import to remove file extension.
import { DashboardView } from './ResourcingDashboard/DashboardView';
import { ManageEngineersView } from './ResourcingDashboard/ManageEngineersView';
import { FindJobsView } from './ResourcingDashboard/FindJobsView';
import { MessagesView } from './MessagesView';
import { PlacementsView } from './ResourcingDashboard/PlacementsView';
import { InvoicesView } from './InvoicesView';

export const ResourcingDashboard = () => {
    const { user, engineers, applications, contracts, setCurrentPageContext } = useAppContext();
    const [activeView, setActiveView] = useState('Dashboard');

    useEffect(() => {
        setCurrentPageContext(`Resourcing Dashboard: ${activeView}`);
    }, [activeView, setCurrentPageContext]);

    const managedEngineers = useMemo(() => {
        if (!user) return [];
        return engineers.filter(e => e.resourcingCompanyId === user.profile.id);
    }, [user, engineers]);
    
    const managedContracts = useMemo(() => {
        if (!user) return [];
        const managedIds = new Set(managedEngineers.map(e => e.id));
        return contracts.filter(c => managedIds.has(c.engineerId));
    }, [user, managedEngineers, contracts]);


    const renderActiveView = () => {
        if (!user) return <div>Loading...</div>;

        switch (activeView) {
            case 'Dashboard':
                return <DashboardView managedEngineers={managedEngineers} applications={applications} activePlacements={managedContracts} setActiveView={setActiveView} />;
            case 'Manage Engineers':
                return <ManageEngineersView managedEngineers={managedEngineers} setActiveView={setActiveView} />;
            case 'Find Jobs':
                return <FindJobsView managedEngineers={managedEngineers} setActiveView={setActiveView} />;
            case 'Contracts':
                return <PlacementsView managedContracts={managedContracts} setActiveView={setActiveView} />;
            case 'Invoices':
                return <InvoicesView />;
            case 'Messages':
                return <MessagesView />;
            case 'Settings':
                 return (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">Settings</h1>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold">Company Settings</h2>
                            <p className="mt-4">Manage your resourcing company profile and notification settings here.</p>
                            <p className="mt-2 text-sm text-gray-500">(This feature is under development)</p>
                        </div>
                    </div>
                );
            default:
                return (
                    <div>
                        <h1 className="text-2xl font-bold">{activeView} - Coming Soon</h1>
                        <p>The functionality for "{activeView}" is under construction.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen">
            <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-grow p-2 bg-gray-50 overflow-y-auto custom-scrollbar">
                {renderActiveView()}
            </main>
        </div>
    );
};