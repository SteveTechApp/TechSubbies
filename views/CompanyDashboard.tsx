import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { DashboardSidebar } from '../components/DashboardSidebar.tsx';
import { JobPostModal } from '../components/JobPostModal.tsx';
import { DashboardView } from './CompanyDashboard/DashboardView.tsx';
import { MyJobsView } from './CompanyDashboard/MyJobsView.tsx';

export const CompanyDashboard = () => {
    const { user, postJob, jobs, engineers } = useAppContext();
    const [activeView, setActiveView] = useState('Dashboard');
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);

    const myJobs = useMemo(() => jobs.filter(j => j.companyId === user?.profile?.id), [jobs, user]);

    useEffect(() => {
        if (activeView === 'Post a Job') {
            setIsJobModalOpen(true);
        }
    }, [activeView]);

    const handlePostJob = (jobData: any) => {
        postJob(jobData);
        setIsJobModalOpen(false);
        setActiveView('My Jobs');
    };

    const renderActiveView = () => {
        if (!user) return null;
        switch(activeView) {
            case 'Dashboard':
                return <DashboardView user={user} myJobs={myJobs} engineers={engineers} />;
            case 'Post a Job': // Intentionally fall through, modal handles it
            case 'My Jobs':
                return <MyJobsView myJobs={myJobs} />;
            default:
                return (
                    <div>
                        <h1 className="text-2xl font-bold">{activeView} - Coming Soon</h1>
                        <p className="mt-4">The functionality for "{activeView}" is under development. Please check back later!</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex">
            <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-grow p-8 bg-gray-50">
                {renderActiveView()}
            </main>
            <JobPostModal
                isOpen={isJobModalOpen}
                onClose={() => {
                    setIsJobModalOpen(false);
                    if (activeView === 'Post a Job') setActiveView('Dashboard');
                }}
                onPostJob={handlePostJob}
            />
        </div>
    );
};
