import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext, Job, User, EngineerProfile } from '../context/AppContext.tsx';
import { DashboardSidebar } from '../components/DashboardSidebar.tsx';
import { JobPostModal } from '../components/JobPostModal.tsx';
import { AIEngineerCostAnalysis } from '../components/AIEngineerCostAnalysis.tsx';
import { MapPin } from 'lucide-react';

const formatDate = (date: any): string => {
    if (!date) return 'TBD';
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'Invalid Date';
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
};

const CompanyDashboard_DashboardView = ({ user, myJobs, engineers }: {user: User, myJobs: Job[], engineers: EngineerProfile[]}) => (
  <div>
    <h1 className='text-3xl font-bold mb-6'>Welcome, {user?.profile?.name}!</h1>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='font-bold text-xl'>Active Jobs</h2>
        <p className='text-4xl font-extrabold text-blue-600'>{myJobs.length}</p>
      </div>
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='font-bold text-xl'>Total Engineers</h2>
        <p className='text-4xl font-extrabold text-green-600'>{engineers.length}</p>
      </div>
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='font-bold text-xl'>Applications</h2>
        <p className='text-4xl font-extrabold text-yellow-600'>12</p>
      </div>
    </div>
    <div className='bg-white p-6 rounded-lg shadow'>
      <h2 className='text-xl font-bold mb-4'>Featured Engineer vs. Your Latest Job</h2>
      {myJobs.length > 0 && engineers.length > 0 ?
        <AIEngineerCostAnalysis job={myJobs[0]} engineer={engineers[0]} /> :
        <p>Post a job to see AI analysis.</p>
      }
    </div>
  </div>
);

const CompanyDashboard_MyJobsView = ({ myJobs }: { myJobs: Job[] }) => (
  <div>
    <h1 className='text-3xl font-bold mb-6'>My Posted Jobs</h1>
    <div className='bg-white p-6 rounded-lg shadow'>
        {myJobs.length > 0 ? (
            <div className='space-y-4'>
            {myJobs.map(job => 
                <div key={job.id} className='p-4 border rounded-md flex justify-between items-center'>
                    <div>
                        <h3 className='font-bold text-lg text-blue-700'>{job.title}</h3>
                        <p className='text-gray-600 flex items-center mt-1'>
                            <MapPin className='w-4 h-4 mr-2 text-gray-400' />
                            {job.location}
                        </p>
                    </div>
                    <div className='text-right text-gray-500 text-sm'>
                        <p>Posted: {formatDate(job.postedDate)}</p>
                        <p>Starts: {formatDate(job.startDate)}</p>
                    </div>
                </div>
            )}
            </div>
        ) : (
            <p className='text-center text-gray-500 py-4'>You have not posted any jobs yet.</p>
        )}
    </div>
  </div>
);

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
                return <CompanyDashboard_DashboardView user={user} myJobs={myJobs} engineers={engineers} />;
            case 'Post a Job': // Intentionally fall through, modal handles it
            case 'My Jobs':
                return <CompanyDashboard_MyJobsView myJobs={myJobs} />;
            default:
                return (
                    <div>
                        <h1 className='text-2xl font-bold'>{activeView} - Coming Soon</h1>
                        <p className='mt-4'>The functionality for "{activeView}" is under development. Please check back later!</p>
                    </div>
                );
        }
    };

    return (
        <div className='flex'>
            <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className='flex-grow p-8 bg-gray-50'>
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
