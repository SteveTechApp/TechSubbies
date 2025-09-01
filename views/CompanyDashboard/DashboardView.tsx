import React from 'react';
import { User, Job, EngineerProfile, Application } from '../../types/index.ts';
import { AIEngineerCostAnalysis } from '../../components/AIEngineerCostAnalysis.tsx';
import { PlusCircle, Briefcase, Users, Mail } from '../../components/Icons.tsx';

interface DashboardViewProps {
    user: User;
    myJobs: Job[];
    engineers: EngineerProfile[];
    applications: Application[];
    setActiveView: (view: string) => void;
}

const QuickActionButton = ({ icon: Icon, label, description, onClick }: { icon: React.ComponentType<any>, label: string, description: string, onClick: () => void }) => (
    <button onClick={onClick} className="text-left p-4 bg-gray-50 rounded-lg hover:bg-blue-100 hover:shadow-lg transition-all border border-gray-200 flex items-start gap-4 h-full">
        <div className="p-3 bg-white rounded-full shadow-sm">
            <Icon size={24} className="text-blue-600" />
        </div>
        <div>
            <h3 className="font-bold text-gray-800">{label}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </button>
);

const StatCard = ({ label, value, onClick }: { label: string, value: number, onClick: () => void }) => (
    <button onClick={onClick} className="w-full bg-white p-5 rounded-lg shadow text-left hover:shadow-lg hover:-translate-y-1 transition-all">
        <h2 className="font-bold text-xl">{label}</h2>
        <p className="text-4xl font-extrabold text-blue-600">{value}</p>
    </button>
);

const ActivityItem = ({ icon: Icon, text, time }: { icon: React.ComponentType<any>, text: React.ReactNode, time: string }) => (
    <div className="flex items-start gap-3 py-2">
        <Icon size={18} className="text-gray-400 mt-1 flex-shrink-0" />
        <div className="flex-grow">
            <p className="text-sm text-gray-700">{text}</p>
            <p className="text-xs text-gray-400">{time}</p>
        </div>
    </div>
);

export const DashboardView = ({ user, myJobs, engineers, applications, setActiveView }: DashboardViewProps) => {
    // Find recent applications for jobs posted by the current company
    const myJobIds = new Set(myJobs.map(j => j.id));
    const recentApplications = applications
        .filter(app => myJobIds.has(app.jobId))
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 3);

    const getApplicantName = (engineerId: string) => {
        return engineers.find(e => e.id === engineerId)?.name || 'An engineer';
    };
    const getJobTitle = (jobId: string) => {
        return myJobs.find(j => j.id === jobId)?.title || 'a job';
    };
    
    // Mock time for demo purposes
    const getTimeAgo = (index: number) => {
        const times = ['2 hours ago', 'Yesterday', '3 days ago'];
        return times[index] || 'A while ago';
    }

    return (
      <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold">Dashboard for {user?.profile?.name}</h1>
            <p className="text-gray-500">Here's a summary of your hiring activity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Active Jobs" value={myJobs.length} onClick={() => setActiveView('My Jobs')} />
            <StatCard label="Total Applicants" value={applications.filter(app => myJobIds.has(app.jobId)).length} onClick={() => setActiveView('My Jobs')} />
            
            <div className="bg-white p-5 rounded-lg shadow col-span-2">
                <h2 className="font-bold text-xl mb-2">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <QuickActionButton icon={PlusCircle} label="Post New Job" description="Get your role in front of engineers." onClick={() => setActiveView('Post a Job')} />
                    <QuickActionButton icon={Users} label="Find Talent" description="Search the engineer database." onClick={() => setActiveView('Find Talent')}/>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Engineer Spotlight</h2>
              {myJobs.length > 0 && engineers.length > 0 ?
                <AIEngineerCostAnalysis job={myJobs[0]} engineer={engineers[0]} /> :
                <p>Post a job to see an AI-powered analysis of a matching engineer.</p>
              }
            </div>
            <div className="lg:col-span-1 bg-white p-5 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-2">Recent Activity</h2>
                <div className="space-y-2">
                    {recentApplications.length > 0 ? recentApplications.map((app, index) => (
                         <ActivityItem 
                            key={`${app.jobId}-${app.engineerId}`}
                            icon={Mail} 
                            text={<><span className="font-semibold">{getApplicantName(app.engineerId)}</span> applied for <span className="font-semibold">{getJobTitle(app.jobId)}</span>.</>}
                            time={getTimeAgo(index)}
                        />
                    )) : (
                        <p className="text-sm text-gray-500 text-center py-4">No recent applications.</p>
                    )}
                </div>
            </div>
        </div>
      </div>
    );
};