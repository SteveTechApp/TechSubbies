import React from 'react';
import { Job, CompanyProfile, EngineerProfile, ProfileTier } from '../types';
import { useAppContext } from '../context/AppContext';
import { MapPin, DollarSign, Clock, Layers, Briefcase, Calendar } from './Icons';
import { formatDisplayDate } from '../utils/dateFormatter';

interface JobCardProps {
    job: Job;
    setActiveView: (view: string) => void;
}

export const JobCard = ({ job, setActiveView }: JobCardProps) => {
    const { companies, applyForJob, applyForJobWithCredit, user, applications } = useAppContext();
    const company = companies.find(c => c.id === job.companyId) as CompanyProfile | undefined;
    
    const hasApplied = user ? applications.some(app => app.jobId === job.id && app.engineerId === user.profile.id) : false;

    if (!company) return null;
    
    const isFreeTier = user && user.profile.role === 'Engineer' && (user.profile as EngineerProfile).profileTier === ProfileTier.BASIC;
    const engineerProfile = user?.profile as EngineerProfile;
    const hasCredits = isFreeTier && engineerProfile.platformCredits > 0;

    const handleApply = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (user && user.profile.role === 'Engineer' && !hasApplied) {
            applyForJob(job.id, user.profile.id);
            alert(`Successfully applied for: ${job.title}`);
        }
    };
    
     const handleApplyWithCredit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (user && user.profile.role === 'Engineer' && !hasApplied) {
            if (hasCredits) {
                applyForJobWithCredit(job.id);
            } else {
                if (window.confirm("You have no Platform Credits. Would you like to purchase some to feature your application?")) {
                    setActiveView('Billing');
                }
            }
        }
    };
    
    const handleViewJob = () => {
        // In a more complex app, this would navigate to a full job details page.
        // For this demo, we can just log it.
        console.log("Viewing job details for:", job.title);
        alert("This would normally navigate to a full job details view.");
    };

    const renderApplyButton = () => {
        if (hasApplied) {
            return (
                <button disabled className="px-4 py-2 text-sm font-bold rounded-md bg-gray-200 text-gray-500 cursor-not-allowed">
                    Applied
                </button>
            );
        }

        if (isFreeTier) {
             const buttonClass = hasCredits 
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-green-600 text-white hover:bg-green-700';
            const buttonText = hasCredits ? 'Apply with Free Credit' : 'Feature your Application';
            return (
                 <button onClick={handleApplyWithCredit} className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${buttonClass}`}>
                    {buttonText}
                </button>
            )
        }
        
        return (
             <button onClick={handleApply} className="px-4 py-2 text-sm font-bold rounded-md transition-colors bg-green-600 text-white hover:bg-green-700">
                Apply Now
            </button>
        )
    };

    return (
        <div 
            onClick={handleViewJob}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-all cursor-pointer"
        >
            <div className="flex items-start gap-4">
                <img src={company.logo || company.avatar} alt={company.name} className="w-12 h-12 rounded-lg object-contain bg-white p-1 border flex-shrink-0" />
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-blue-700">{job.title}</h3>
                    <p className="text-sm font-semibold text-gray-600">{company.name}</p>
                </div>
                {renderApplyButton()}
            </div>
            <p className="text-sm text-gray-700 mt-3 line-clamp-2">{job.description}</p>
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-2 text-gray-600 text-sm">
                 <span className="flex items-center"><MapPin size={14} className="mr-1.5 text-gray-400"/> {job.location}</span>
                <span className="flex items-center"><DollarSign size={14} className="mr-1.5 text-gray-400"/> {job.currency}{job.dayRate} / day</span>
                <span className="flex items-center"><Clock size={14} className="mr-1.5 text-gray-400"/> {job.duration}</span>
                <span className="flex items-center"><Layers size={14} className="mr-1.5 text-gray-400"/> {job.experienceLevel}</span>
                <span className="flex items-center"><Briefcase size={14} className="mr-1.5 text-gray-400"/> {job.jobType}</span>
                <span className="flex items-center"><Calendar size={14} className="mr-1.5 text-gray-400"/> Starts: {formatDisplayDate(job.startDate)}</span>
            </div>
        </div>
    );
};