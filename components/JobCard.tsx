import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
// FIX: Replaced incorrect context hook 'useInteractions' with the correct hook 'useAppContext'.
import { useAppContext } from '../context/InteractionContext';
import { Job, CompanyProfile, EngineerProfile, ProfileTier } from '../types';
import { MapPin, DollarSign, Clock, Layers, Briefcase, Calendar } from './Icons';
import { formatDisplayDate } from '../utils/dateFormatter';

interface JobCardProps {
    job: Job;
    setActiveView: (view: string) => void;
}

const JobCardComponent = ({ job, setActiveView }: JobCardProps) => {
    const { companies, applications } = useData();
    const { user } = useAuth();
    const { applyForJob, applyForJobWithCredit } = useAppContext();

    const company = companies.find(c => c.id === job.companyId) as CompanyProfile;

    if (!company) return null;

    const engineerProfile = user?.profile as EngineerProfile;
    const hasApplied = user && applications.some(app => app.jobId === job.id && app.engineerId === user.profile.id);
    const canAfford = engineerProfile ? engineerProfile.platformCredits > 0 : false;
    const requiresCredit = job.dayRate > '195' && engineerProfile?.profileTier === ProfileTier.BASIC;

    const handleApply = () => {
        if (!user || user.role !== 'Engineer') return;
        
        if (requiresCredit) {
            if (canAfford) {
                if (window.confirm("This job is above your plan's day rate limit. Applying will use 1 Platform Credit. Continue?")) {
                    applyForJobWithCredit(job.id);
                }
            } else {
                alert("You don't have enough Platform Credits to apply for this job. You can buy more in the Billing section.");
                setActiveView('Billing');
            }
        } else {
            applyForJob(job.id, user.profile.id);
        }
    };
    
    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-start gap-4">
                <img src={company.logo as string || company.avatar} alt={company.name} className="w-12 h-12 rounded-lg object-contain bg-white p-1 border flex-shrink-0" loading="lazy" />
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-blue-700">{job.title}</h3>
                    <p className="text-sm font-semibold text-gray-600">Posted by {company.name}</p>
                </div>
            </div>
            <p className="text-sm text-gray-700 mt-3">{job.description.substring(0, 120)}...</p>
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-2 text-gray-600 text-sm">
                <span className="flex items-center"><MapPin size={14} className="mr-1.5 text-gray-400"/> {job.location}</span>
                <span className="flex items-center"><DollarSign size={14} className="mr-1.5 text-gray-400"/> {job.currency}{job.dayRate} / day</span>
                <span className="flex items-center"><Clock size={14} className="mr-1.5 text-gray-400"/> {job.duration}</span>
                <span className="flex items-center"><Layers size={14} className="mr-1.5 text-gray-400"/> {job.experienceLevel}</span>
                <span className="flex items-center"><Calendar size={14} className="mr-1.5 text-gray-400"/> Starts: {formatDisplayDate(job.startDate)}</span>
            </div>
            {user?.role === 'Engineer' && (
                <div className="mt-4 text-right">
                    <button 
                        onClick={handleApply} 
                        disabled={hasApplied} 
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed ml-auto"
                    >
                        <Briefcase size={16} className="mr-2"/>
                        {hasApplied ? 'Applied' : 'Apply Now'}
                    </button>
                    {requiresCredit && !hasApplied && <p className="text-xs text-yellow-600 mt-1 text-right">Requires 1 Platform Credit to apply.</p>}
                </div>
            )}
        </div>
    );
};

export const JobCard = React.memo(JobCardComponent);