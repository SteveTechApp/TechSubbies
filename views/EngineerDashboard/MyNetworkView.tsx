import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
// FIX: Add CompanyProfile, Job, and Application to imports for explicit typing
import { ApplicationStatus, Job, Role, CompanyProfile, Application } from '../../types/index.ts';
import { ArrowLeft, Briefcase, CheckCircle, Mail, Download, X } from '../../components/Icons.tsx';

interface MyNetworkViewProps {
    setActiveView: (view: string) => void;
}

// FIX: Define a type for the accumulator object in the reduce function
interface CompanyInteraction {
    company: CompanyProfile;
    interactions: {
        job: Job;
        application: Application;
    }[];
}

// Helper to generate an .ics file for calendar integration
const generateIcsFile = (job: Job, companyName: string) => {
    if (!job.startDate) return;

    const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
    };

    const startDate = new Date(job.startDate);
    // Mock end date based on duration for demo
    const endDate = new Date(startDate);
    if (job.duration.includes('week')) {
        endDate.setDate(startDate.getDate() + parseInt(job.duration) * 7);
    } else {
        endDate.setDate(startDate.getDate() + 30); // Default to 1 month
    }
    
    const icsContent = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//TechSubbies.com//EN',
        'BEGIN:VEVENT',
        `UID:${job.id}@techsubbies.com`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART;VALUE=DATE:${formatDate(startDate).slice(0,8)}`,
        `DTEND;VALUE=DATE:${formatDate(endDate).slice(0,8)}`,
        `SUMMARY:Project: ${job.title}`,
        `DESCRIPTION:Work contract for ${job.title} with ${companyName}. Details on TechSubbies.com.`,
        `LOCATION:${job.location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `techsubbies_${job.title.replace(/\s/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const MyNetworkView = ({ setActiveView }: MyNetworkViewProps) => {
    const { user, applications, jobs, companies, acceptOffer, declineOffer } = useAppContext();

    const networkData = useMemo(() => {
        if (!user || user.role !== Role.ENGINEER) return [];

        const engineerId = user.profile.id;
        const myApplications = applications.filter(app => app.engineerId === engineerId);

        // FIX: Explicitly type the accumulator ('acc') in the reduce function to prevent type errors.
        const companyInteractions = myApplications.reduce((acc: Record<string, CompanyInteraction>, app) => {
            const job = jobs.find(j => j.id === app.jobId);
            if (!job) return acc;

            const companyId = job.companyId;
            if (!acc[companyId]) {
                const company = companies.find(c => c.id === companyId);
                if (company) {
                    acc[companyId] = {
                        company,
                        interactions: []
                    };
                }
            }
            if(acc[companyId]) {
                 acc[companyId].interactions.push({ job, application: app });
            }
           
            return acc;
        }, {});

        return Object.values(companyInteractions)
            .sort((a, b) => a.company.name.localeCompare(b.company.name));

    }, [user, applications, jobs, companies]);

    return (
        <div>
            <button
                onClick={() => setActiveView('Dashboard')}
                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mb-4">My Network</h1>
            <p className="text-gray-600 mb-6">Here are the companies you've applied to or worked with through the platform.</p>

            <div className="space-y-6">
                {networkData.length > 0 ? networkData.map(({ company, interactions }) => (
                    <div key={company.id} className="bg-white p-5 rounded-lg shadow-md border">
                        <div className="flex items-center mb-4 pb-4 border-b">
                            <img src={company.avatar} alt={company.name} className="w-16 h-16 rounded-full mr-4" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{company.name}</h2>
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{company.website}</a>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Your Interactions:</h3>
                        <div className="space-y-3">
                            {interactions.map(({ job, application }) => (
                                <div key={job.id} className="p-3 bg-gray-50 rounded-md flex flex-col sm:flex-row justify-between sm:items-center">
                                    <div className="mb-2 sm:mb-0">
                                        <p className="font-semibold">{job.title}</p>
                                        <p className="text-sm text-gray-500">Applied on: {new Date(application.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                         {application.status === ApplicationStatus.OFFERED ? (
                                            <>
                                                <button onClick={() => declineOffer(job.id, user!.profile.id)} className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 font-bold flex items-center"> <X size={14} className="mr-1.5"/> Decline</button>
                                                <button onClick={() => { acceptOffer(job.id, user!.profile.id); generateIcsFile(job, company.name); }} className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 font-bold flex items-center"><Download size={14} className="mr-1.5"/> Accept & Add to Calendar</button>
                                            </>
                                        ) : (
                                            <span className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full ${
                                                application.status === ApplicationStatus.COMPLETED || application.status === ApplicationStatus.ACCEPTED ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {application.status === ApplicationStatus.COMPLETED ? <CheckCircle size={16} className="mr-1.5" /> : <Briefcase size={16} className="mr-1.5" />}
                                                {application.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md border-2 border-dashed">
                        <Mail size={40} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-bold text-gray-700">Your network is waiting to be built.</h3>
                        <p className="text-gray-500 mt-2">Apply for jobs to start building your professional network on TechSubbies.</p>
                        <button onClick={() => setActiveView('Job Search')} className="mt-4 bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700">
                            Find Work Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
