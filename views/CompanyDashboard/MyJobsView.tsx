import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
// FIX: Replaced incorrect context hook 'useInteractions' with the correct hook 'useAppContext'.
import { useAppContext } from '../../context/InteractionContext';
import { Job, EngineerProfile, ApplicationStatus, Application, Contract } from '../../types';
import { MapPin, DollarSign, Users, Edit, Trash2, BrainCircuit, Star } from '../../components/Icons';
import { CreateContractModal } from '../../components/CreateContractModal';
import {
    ApplicationPipelineFilter,
    applicationPipelineFilters,
    getApplicationPipelineCounts,
    matchesApplicationPipeline,
} from '../../utils/applicationPipeline';
import { errorMessage } from '../../utils/errorMessage';

interface MyJobsViewProps {
    myJobs: Job[];
    setActiveView: (view: string) => void;
}

const JobCard = ({ job, onSelect, onEdit, onDelete }: { job: Job, onSelect: () => void, onEdit: () => void, onDelete: () => void }) => {
    const { applications } = useData();
    const jobApplicants = applications.filter(a => a.jobId === job.id).length;

    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            {job.moderationReason && (
                <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    <strong>Closed by TechSubbies:</strong> {job.moderationReason}
                </div>
            )}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-blue-700">{job.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1"><MapPin size={14} className="mr-1.5"/>{job.location}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onEdit} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"><Edit size={16}/></button>
                    <button onClick={onDelete} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full"><Trash2 size={16}/></button>
                </div>
            </div>
            <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                {job.status}
            </span>
            <div className="flex justify-between items-end mt-4">
                <div>
                    <p className="text-sm text-gray-600 flex items-center"><DollarSign size={14} className="mr-1.5"/>{job.currency}{job.dayRate} / day</p>
                    <p className="text-sm text-gray-600 flex items-center mt-1"><Users size={14} className="mr-1.5"/>{jobApplicants} applicant(s)</p>
                </div>
                <button onClick={onSelect} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md text-sm hover:bg-blue-700">
                    View Applicants
                </button>
            </div>
        </div>
    )
}

const ApplicantCard = ({ applicant, application, onDeepDive, onHire, onReject }: {
    applicant: EngineerProfile,
    application: Application,
    onDeepDive: () => void,
    onHire: () => void,
    onReject: () => void,
}) => {
    const hiringComplete = application.status === ApplicationStatus.HIRED
        || application.status === ApplicationStatus.REJECTED
        || application.status === ApplicationStatus.COMPLETED;

    return (
        <div className={`flex flex-col gap-4 p-3 bg-white rounded-lg border relative sm:flex-row sm:items-center ${application.isFeatured ? 'border-amber-400' : 'border-gray-200'}`}>
            {application.isFeatured && (
                <div className="absolute -top-3 -left-3 bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded-full flex items-center shadow-lg transform -rotate-12">
                    <Star size={12} className="mr-1"/> FEATURED
                </div>
            )}
            <img src={applicant.avatar} alt={applicant.name} className="w-14 h-14 rounded-full" />
            <div className="flex-grow">
                <h4 className="font-bold">{applicant.name}</h4>
                <p className="text-sm text-blue-600">{applicant.discipline}</p>
                <span className="mt-1 inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                    {application.status}
                </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <button onClick={onDeepDive} className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 font-semibold flex items-center gap-2">
                    <BrainCircuit size={14} /> AI Deep Dive
                </button>
                {!hiringComplete && (
                    <button
                        onClick={onReject}
                        className="px-3 py-1.5 text-sm border border-red-300 text-red-700 rounded-md hover:bg-red-50 font-semibold"
                    >
                        Reject
                    </button>
                )}
                <button
                    onClick={onHire}
                    disabled={hiringComplete}
                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 font-semibold"
                >
                    {application.status === ApplicationStatus.HIRED ? 'Hired' :
                        application.status === ApplicationStatus.REJECTED ? 'Rejected' :
                        application.status === ApplicationStatus.COMPLETED ? 'Completed' :
                        'Hire & Send Contract'}
                </button>
            </div>
        </div>
    )
}


export const MyJobsView = ({ myJobs, setActiveView }: MyJobsViewProps) => {
    const { applications, engineers } = useData();
    const { createContract, markApplicationsViewed, rejectApplication, sendOffer, setApplicantForDeepDive } = useAppContext();
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [selectedApplicant, setSelectedApplicant] = useState<EngineerProfile | null>(null);
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    const [applicantFilter, setApplicantFilter] = useState<ApplicationPipelineFilter>('all');
    const [applicantSearch, setApplicantSearch] = useState('');

    const applicantsForSelectedJob = useMemo(() => {
        if (!selectedJob) return [];
        return applications
            .filter(app => app.jobId === selectedJob.id)
            .map(app => ({
                application: app,
                engineer: engineers.find(eng => eng.id === app.engineerId)
            }))
            .filter((item): item is { application: Application, engineer: EngineerProfile } => !!item.engineer)
            .sort((a, b) => {
                // Featured applications first
                if (a.application.isFeatured && !b.application.isFeatured) return -1;
                if (!a.application.isFeatured && b.application.isFeatured) return 1;
                // Then by date
                return b.application.date.getTime() - a.application.date.getTime();
            });
    }, [selectedJob, applications, engineers]);

    const pipelineCounts = useMemo(
        () => getApplicationPipelineCounts(applicantsForSelectedJob.map(item => item.application)),
        [applicantsForSelectedJob]
    );

    const visibleApplicants = useMemo(() => {
        const query = applicantSearch.trim().toLowerCase();
        return applicantsForSelectedJob.filter(({ application, engineer }) => {
            if (!matchesApplicationPipeline(application.status, applicantFilter)) return false;
            if (!query) return true;
            return [engineer.name, engineer.discipline, engineer.location]
                .filter(Boolean)
                .some(value => String(value).toLowerCase().includes(query));
        });
    }, [applicantFilter, applicantSearch, applicantsForSelectedJob]);
    
    const handleHire = async (engineer: EngineerProfile) => {
        if (!selectedJob) return;
        try {
            await sendOffer(selectedJob.id, engineer.id);
            setSelectedApplicant(engineer);
            setIsHireModalOpen(true);
        } catch (error: unknown) {
            alert(errorMessage(error, 'Could not send the offer.'));
        }
    };

    const handleContractSent = async (contract: Contract) => {
        try {
            await createContract(contract);
            alert(`Contract sent to ${selectedApplicant?.name} for signature!`);
            setIsHireModalOpen(false);
            setSelectedApplicant(null);
        } catch (error: unknown) {
            alert(errorMessage(error, 'Could not send the contract.'));
        }
    };

    const handleReject = async (engineer: EngineerProfile) => {
        if (!selectedJob) return;
        if (!window.confirm(`Reject ${engineer.name}'s application for ${selectedJob.title}? This decision cannot be reversed.`)) {
            return;
        }
        try {
            await rejectApplication(selectedJob.id, engineer.id);
        } catch (error: unknown) {
            alert(errorMessage(error, 'Could not reject the application.'));
        }
    };
    
    const handleOpenDeepDive = (engineer: EngineerProfile, job: Job) => {
        setApplicantForDeepDive({ engineer, job });
    };

    if (selectedJob) {
        return (
            <div>
                <button onClick={() => setSelectedJob((current) => current === null ? null : null)} className="text-blue-600 hover:underline mb-4">&larr; Back to My Jobs</button>
                <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                <p className="text-gray-500 mb-4">Applicants for this role:</p>
                {applicantsForSelectedJob.length > 0 && (
                    <div className="mb-5 space-y-3 rounded-lg border border-gray-200 bg-white p-4">
                        <label className="block">
                            <span className="sr-only">Search applicants</span>
                            <input
                                type="search"
                                value={applicantSearch}
                                onChange={event => setApplicantSearch(event.target.value)}
                                placeholder="Search by name, discipline or location"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>
                        <div className="flex flex-wrap gap-2" aria-label="Applicant pipeline filters">
                            {applicationPipelineFilters.map(filter => (
                                <button
                                    key={filter.id}
                                    type="button"
                                    onClick={() => setApplicantFilter(filter.id)}
                                    aria-pressed={applicantFilter === filter.id}
                                    className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                                        applicantFilter === filter.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {filter.label} ({pipelineCounts[filter.id]})
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {visibleApplicants.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {visibleApplicants.map(({ engineer, application }) => (
                            <ApplicantCard
                                key={engineer.id}
                                applicant={engineer}
                                application={application}
                                onDeepDive={() => handleOpenDeepDive(engineer, selectedJob)}
                                onHire={() => handleHire(engineer)}
                                onReject={() => handleReject(engineer)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center p-8 bg-gray-50 rounded-lg">
                        {applicantsForSelectedJob.length > 0 ? 'No applicants match these filters.' : 'No applicants yet.'}
                    </p>
                )}
                 {selectedApplicant && selectedJob && (
                    <CreateContractModal
                        isOpen={isHireModalOpen}
                        onClose={() => setIsHireModalOpen(false)}
                        job={selectedJob}
                        engineer={selectedApplicant}
                        onSendForSignature={handleContractSent}
                    />
                 )}
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Job Postings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myJobs.map(job => (
                    <JobCard 
                        key={job.id} 
                        job={job}
                        onSelect={() => {
                            setSelectedJob(job);
                            setApplicantFilter('all');
                            setApplicantSearch('');
                            markApplicationsViewed(job.id);
                        }}
                        onEdit={() => alert(`Editing job: ${job.title}`)}
                        onDelete={() => alert(`Deleting job: ${job.title}`)}
                    />
                ))}
            </div>
            {myJobs.length === 0 && <p className="text-center text-gray-500">You haven't posted any jobs yet.</p>}
        </div>
    );
};
