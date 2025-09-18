import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
// FIX: Replaced incorrect context hook 'useInteractions' with the correct hook 'useAppContext'.
import { useAppContext } from '../context/InteractionContext';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { CompanyProfile, Job, Role, EngineerProfile } from '../types';
import { DashboardView } from './CompanyDashboard/DashboardView';
import { MyJobsView } from './CompanyDashboard/MyJobsView';
import { FindTalentView } from './CompanyDashboard/FindTalentView';
import { SettingsView } from './CompanyDashboard/SettingsView';
import { JobPostModal } from '../components/JobPostModal';
import { EngineerProfileView } from './EngineerProfileView';
import { ApplicantDeepDiveModal } from '../components/Company/ApplicantDeepDiveModal';
import { InstantInviteModal } from '../components/InstantInviteModal';
import { MessagesView } from './MessagesView';
import { ContractsView } from './ContractsView';
import { ProjectPlannerView } from './CompanyDashboard/ProjectPlannerView';
import { ProjectTrackingView } from './CompanyDashboard/ProjectTrackingView';
import { AnalyticsView } from './CompanyDashboard/AnalyticsView';
import { InvoicesView } from './InvoicesView';

export const CompanyDashboard = () => {
    const { user } = useAuth();
    const { jobs, engineers, applications } = useData();
    const { postJob, updateCompanyProfile, applicantForDeepDive, setApplicantForDeepDive } = useAppContext();
    const [activeView, setActiveView] = useState('Dashboard');
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [selectedEngineer, setSelectedEngineer] = useState<EngineerProfile | null>(null);
    const [justPostedJob, setJustPostedJob] = useState<Job | null>(null);

    if (!user || (user.role !== Role.COMPANY && user.role !== Role.RESOURCING_COMPANY)) {
        return <div>Error: Invalid user role for this dashboard.</div>;
    }
    const companyProfile = user.profile as CompanyProfile;

    const myJobs = useMemo(() => {
        return jobs.filter(j => j.companyId === companyProfile.id);
    }, [jobs, companyProfile.id]);

    const handlePostJob = async (jobData: Omit<Job, 'id' | 'companyId' | 'postedDate' | 'status'>) => {
        const fullJobData = { ...jobData, companyId: companyProfile.id };
        const newJob = await postJob(fullJobData);
        setJustPostedJob(newJob);
    };

    const handleSelectEngineer = (eng: EngineerProfile) => {
        setSelectedEngineer(eng);
        setActiveView('Find Talent'); // Keep view consistent but overlay profile
    };

    const handleDeepDiveClose = () => {
        setApplicantForDeepDive(null);
    }
    
    const handleProjectCreated = () => {
        setActiveView('Project Tracking');
    };

    const renderView = () => {
        if (selectedEngineer) {
            return (
                <div className="h-full overflow-y-auto custom-scrollbar pr-4">
                     <button onClick={() => setSelectedEngineer(null)} className="text-blue-600 hover:underline mb-4">&larr; Back to Talent Search</button>
                    <EngineerProfileView profile={selectedEngineer} isEditable={false} onEdit={() => {}} />
                </div>
            );
        }
        
        switch (activeView) {
            case 'Dashboard':
                return <DashboardView user={user} myJobs={myJobs} engineers={engineers} applications={applications} setActiveView={setActiveView} />;
            case 'Post a Job':
                // This view is now handled by opening the modal
                return <MyJobsView myJobs={myJobs} setActiveView={setActiveView} />;
            case 'My Jobs':
                return <MyJobsView myJobs={myJobs} setActiveView={setActiveView} />;
            case 'Find Talent':
                return <FindTalentView engineers={engineers} myJobs={myJobs} onSelectEngineer={handleSelectEngineer} />;
            case 'Project Planner':
                return <ProjectPlannerView onProjectCreated={handleProjectCreated} />;
            case 'Project Tracking':
                return <ProjectTrackingView />;
            case 'Contracts':
                return <ContractsView setActiveView={setActiveView} />;
             case 'Invoices':
                return <InvoicesView />;
            case 'Messages':
                return <MessagesView />;
            case 'Analytics':
                return <AnalyticsView />;
            case 'Settings':
                return <SettingsView profile={companyProfile} onSave={updateCompanyProfile} />;
            default:
                return <div>View not found</div>;
        }
    };
    
    // Effect to open modal when 'Post a Job' is clicked
    React.useEffect(() => {
        if (activeView === 'Post a Job') {
            setIsJobModalOpen(true);
        }
    }, [activeView]);

    const handleCloseModal = () => {
        setIsJobModalOpen(false);
        if (activeView === 'Post a Job') {
            setActiveView('My Jobs');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 p-8 overflow-y-auto">
                {renderView()}
            </main>
            <JobPostModal
                isOpen={isJobModalOpen}
                onClose={handleCloseModal}
                onPostJob={handlePostJob}
            />
             {applicantForDeepDive && (
                <ApplicantDeepDiveModal
                    isOpen={!!applicantForDeepDive}
                    onClose={handleDeepDiveClose}
                    job={applicantForDeepDive.job}
                    engineer={applicantForDeepDive.engineer}
                />
            )}
            <InstantInviteModal 
                isOpen={!!justPostedJob}
                onClose={() => setJustPostedJob(null)}
                job={justPostedJob}
            />
        </div>
    );
};