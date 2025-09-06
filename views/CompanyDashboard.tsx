import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
// FIX: Corrected module imports to remove file extensions.
import { EngineerProfile, Job, CompanyProfile } from '../types';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { JobPostModal } from '../components/JobPostModal';
import { DashboardView } from './CompanyDashboard/DashboardView';
import { MyJobsView } from './CompanyDashboard/MyJobsView';
import { SettingsView } from './CompanyDashboard/SettingsView';
import { FindTalentView } from './CompanyDashboard/FindTalentView';
import { EngineerProfileView } from './EngineerProfileView';
import { MessagesView } from './MessagesView';
import { ArrowLeft } from '../components/Icons';
import { ContractsView } from './ContractsView';
import { InstantInviteModal } from '../components/InstantInviteModal';
import { ProjectPlannerView } from './CompanyDashboard/ProjectPlannerView';
import { ProjectTrackingView } from './CompanyDashboard/ProjectTrackingView';
import { InvoicesView } from './InvoicesView';

export const CompanyDashboard = () => {
    const { user, postJob, jobs, engineers, applications, updateCompanyProfile, setCurrentPageContext } = useAppContext();
    const [activeView, setActiveView] = useState('Dashboard');
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    
    const [talentView, setTalentView] = useState<'list' | 'profile'>('list');
    const [selectedEngineer, setSelectedEngineer] = useState<EngineerProfile | null>(null);
    
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [jobForInvite, setJobForInvite] = useState<Job | null>(null);

    const myJobs = useMemo(() => jobs.filter(j => j.companyId === user?.profile?.id), [jobs, user]);

    useEffect(() => {
        let context = `Company Dashboard: ${activeView}`;
        if (activeView === 'Find Talent' && talentView === 'profile') {
            context = `Company Dashboard: Viewing Engineer Profile`;
        }
        setCurrentPageContext(context);
    }, [activeView, talentView, setCurrentPageContext]);


    useEffect(() => {
        if (activeView === 'Post a Job') {
            setIsJobModalOpen(true);
        } else if (isJobModalOpen) {
            setIsJobModalOpen(false);
        }
    
        if (activeView !== 'Find Talent') {
            handleBackToSearch();
        }
    }, [activeView]);

    const handleSelectEngineer = (engineer: EngineerProfile) => {
        setSelectedEngineer(engineer);
        setTalentView('profile');
    };

    const handleBackToSearch = () => {
        setSelectedEngineer(null);
        setTalentView('list');
    };

    const handlePostJob = (jobData: any) => {
        const newJob = postJob(jobData);
        setIsJobModalOpen(false);
        setActiveView('My Jobs');
        if (newJob) {
            setJobForInvite(newJob);
            setIsInviteModalOpen(true);
        }
    };

    const renderActiveView = () => {
        if (!user) return null;
        switch(activeView) {
            case 'Dashboard':
                return <DashboardView user={user} myJobs={myJobs} engineers={engineers} applications={applications} setActiveView={setActiveView} />;
            case 'Find Talent':
                 if (talentView === 'profile' && selectedEngineer) {
                    return (
                        <div className="h-full overflow-y-auto custom-scrollbar">
                            <button 
                                onClick={handleBackToSearch} 
                                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                <ArrowLeft size={16} className="mr-2" />
                                Back to Search Results
                            </button>
                            <EngineerProfileView profile={selectedEngineer} isEditable={false} onEdit={() => {}} />
                        </div>
                    )
                }
                return <FindTalentView engineers={engineers} myJobs={myJobs} onSelectEngineer={handleSelectEngineer} />;
            case 'Post a Job': 
                return <MyJobsView myJobs={myJobs} setActiveView={setActiveView} />;
            case 'My Jobs':
                return <MyJobsView myJobs={myJobs} setActiveView={setActiveView} />;
            case 'Project Planner':
                return <ProjectPlannerView />;
            case 'Project Tracking':
                return <ProjectTrackingView />;
            case 'Messages':
                return <MessagesView />;
            case 'Contracts':
                return <ContractsView setActiveView={setActiveView} />;
            case 'Invoices':
                return <InvoicesView />;
            case 'Settings':
                return <SettingsView profile={user.profile as CompanyProfile} onSave={updateCompanyProfile} />;
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
        <div className="flex h-screen">
            <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-grow p-2 bg-gray-50 overflow-hidden">
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
             <InstantInviteModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                job={jobForInvite}
            />
        </div>
    );
};