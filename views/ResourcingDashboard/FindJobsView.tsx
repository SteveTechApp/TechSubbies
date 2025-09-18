import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
// FIX: Replaced incorrect context hook 'useInteractions' with the correct hook 'useAppContext'.
import { useAppContext } from '../../context/InteractionContext';
import { Job, EngineerProfile } from '../../types';
import { ApplyAsEngineerModal } from '../../components/ApplyAsEngineerModal';
import { Search, MapPin, Calendar, DollarSign, Clock, Briefcase, Layers, MessageCircle } from '../../components/Icons';
import { formatDisplayDate } from '../../utils/dateFormatter';

interface ResourcingJobCardProps {
    job: Job;
    onApply: (job: Job) => void;
    onMessage: (companyProfileId: string) => void;
}

const ResourcingJobCard = ({ job, onApply, onMessage }: ResourcingJobCardProps) => {
    const { companies } = useData();
    const company = companies.find(c => c.id === job.companyId);

    if (!company) return null;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-start gap-4">
                <img src={company.logo || company.avatar} alt={company.name} className="w-12 h-12 rounded-lg object-contain bg-white p-1 border flex-shrink-0" />
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
            <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => onMessage(company.id)} className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md text-sm hover:bg-gray-300">
                    <MessageCircle size={16} className="mr-2"/> Message Company
                </button>
                <button onClick={() => onApply(job)} className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md text-sm hover:bg-blue-700">
                    <Briefcase size={16} className="mr-2"/> Apply for Engineer
                </button>
            </div>
        </div>
    );
};

interface FindJobsViewProps {
    managedEngineers: EngineerProfile[];
    setActiveView: (view: string) => void;
}

export const FindJobsView = ({ managedEngineers, setActiveView }: FindJobsViewProps) => {
    const { jobs } = useData();
    const { applyForJob, startConversationAndNavigate } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [jobToApply, setJobToApply] = useState<Job | null>(null);

    const filteredJobs = useMemo(() => {
        return jobs.filter(job =>
            job.status === 'active' &&
            (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
             job.location.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [jobs, searchTerm]);

    const handleApplySubmit = (jobId: string, engineerId: string) => {
        applyForJob(jobId, engineerId);
        setJobToApply(null);
        alert('Application submitted successfully!');
    };
    
    const handleMessageCompany = (companyProfileId: string) => {
        startConversationAndNavigate(companyProfileId, () => setActiveView('Messages'));
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Find Jobs for Your Talent</h1>
            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by title, keyword, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="space-y-4">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                        <ResourcingJobCard 
                            key={job.id} 
                            job={job} 
                            onApply={setJobToApply}
                            onMessage={handleMessageCompany}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">No jobs found matching your criteria.</p>
                )}
            </div>
            {jobToApply && (
                <ApplyAsEngineerModal
                    isOpen={!!jobToApply}
                    onClose={() => setJobToApply(null)}
                    job={jobToApply}
                    managedEngineers={managedEngineers}
                    onSubmit={handleApplySubmit}
                />
            )}
        </div>
    );
};