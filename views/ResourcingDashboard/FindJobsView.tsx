import React, { useState, useMemo } from 'react';
import { useAppContext, } from '../../context/AppContext.tsx';
import { Job, EngineerProfile } from '../../types/index.ts';
import { ApplyAsEngineerModal } from '../../components/ApplyAsEngineerModal.tsx';
import { Search, MapPin, Calendar, DollarSign, Clock, MessageCircle, Briefcase, Layers } from '../../components/Icons.tsx';
import { formatDisplayDate } from '../../utils/dateFormatter.ts';


interface ResourcingJobCardProps {
    job: Job;
    onApply: (job: Job) => void;
    onMessage: (companyProfileId: string) => void;
}

const ResourcingJobCard = ({ job, onApply, onMessage }: ResourcingJobCardProps) => (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-blue-700">{job.title}</h3>
                <p className="text-gray-500 text-sm">Posted on {formatDisplayDate(job.postedDate)}</p>
            </div>
            <div className="flex items-center gap-2">
                 <button 
                    onClick={() => onMessage(job.companyId)}
                    className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                    <MessageCircle size={16}/>
                </button>
                <button 
                    onClick={() => onApply(job)}
                    className="bg-green-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 whitespace-nowrap"
                >
                    Apply on Behalf of...
                </button>
            </div>
        </div>
        <div className="my-3 text-gray-700">
            <p>{job.description.substring(0, 200)}...</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 border-t pt-3 text-sm">
            <span className="flex items-center"><MapPin size={16} className="mr-2 text-gray-400"/> {job.location}</span>
            <span className="flex items-center"><DollarSign size={16} className="mr-2 text-gray-400"/> {job.currency}{job.dayRate} / day</span>
            <span className="flex items-center"><Clock size={16} className="mr-2 text-gray-400"/> {job.duration}</span>
            <span className="flex items-center"><Calendar size={16} className="mr-2 text-gray-400"/> Starts: {formatDisplayDate(job.startDate)}</span>
            <span className="flex items-center"><Briefcase size={16} className="mr-2 text-gray-400"/> {job.jobType}</span>
            <span className="flex items-center"><Layers size={16} className="mr-2 text-gray-400"/> {job.experienceLevel}</span>
        </div>
    </div>
);


interface FindJobsViewProps {
    managedEngineers: EngineerProfile[];
    setActiveView: (view: string) => void;
}

export const FindJobsView = ({ managedEngineers, setActiveView }: FindJobsViewProps) => {
    const { jobs, applyForJob, startConversationAndNavigate } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const filteredJobs = useMemo(() => {
        if (!searchTerm) return jobs;
        return jobs.filter(job => 
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [jobs, searchTerm]);

    const handleOpenApplyModal = (job: Job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
    };

    const handleSubmitApplication = (jobId: string, engineerId: string) => {
        applyForJob(jobId, engineerId);
        handleCloseModal();
    };

    const handleMessageCompany = (companyProfileId: string) => {
        startConversationAndNavigate(companyProfileId, () => setActiveView('Messages'));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Find Jobs for Your Engineers</h1>
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
                {filteredJobs.map(job => 
                    <ResourcingJobCard key={job.id} job={job} onApply={handleOpenApplyModal} onMessage={handleMessageCompany} />
                )}
            </div>

            {selectedJob && (
                <ApplyAsEngineerModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    job={selectedJob}
                    managedEngineers={managedEngineers}
                    onSubmit={handleSubmitApplication}
                />
            )}
        </div>
    );
};
