
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Job, EngineerProfile, ApplicationStatus } from '../../types';
import { MapPin, DollarSign, Users, Edit, Trash2 } from '../../components/Icons';
// FIX: `ApplicantDeepDiveModal` was not a module. It has been created and is now imported correctly.
import { ApplicantDeepDiveModal } from '../../components/Company/ApplicantDeepDiveModal';
import { CreateContractModal } from '../../components/CreateContractModal';

interface MyJobsViewProps {
    myJobs: Job[];
    setActiveView: (view: string) => void;
}

const JobCard = ({ job, onSelect, onEdit, onDelete }: { job: Job, onSelect: () => void, onEdit: () => void, onDelete: () => void }) => {
    const { applications } = useAppContext();
    const jobApplicants = applications.filter(a => a.jobId === job.id).length;

    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
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

const ApplicantCard = ({ applicant, job, onDeepDive, onHire }: { applicant: EngineerProfile, job: Job, onDeepDive: () => void, onHire: () => void }) => {
    return (
        <div className="flex items-center gap-4 p-3 bg-white rounded-lg border">
            <img src={applicant.avatar} alt={applicant.name} className="w-14 h-14 rounded-full" />
            <div className="flex-grow">
                <h4 className="font-bold">{applicant.name}</h4>
                <p className="text-sm text-blue-600">{applicant.discipline}</p>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={onDeepDive} className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 font-semibold">AI Deep Dive</button>
                <button onClick={onHire} className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold">Hire & Send Contract</button>
            </div>
        </div>
    )
}


export const MyJobsView = ({ myJobs, setActiveView }: MyJobsViewProps) => {
    const { applications, engineers, createContract, sendOffer } = useAppContext();
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [selectedApplicant, setSelectedApplicant] = useState<EngineerProfile | null>(null);
    const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);

    const applicantsForSelectedJob = selectedJob
        ? applications
            .filter(app => app.jobId === selectedJob.id)
            .map(app => engineers.find(eng => eng.id === app.engineerId))
            .filter((eng): eng is EngineerProfile => !!eng)
        : [];
    
    const handleHire = (engineer: EngineerProfile) => {
        if (!selectedJob) return;
        sendOffer(selectedJob.id, engineer.id);
        setSelectedApplicant(engineer);
        setIsHireModalOpen(true);
    };
    
    const handleContractSent = (contract: any) => {
        createContract(contract);
        alert(`Contract sent to ${selectedApplicant?.name} for signature!`);
        setIsHireModalOpen(false);
        setSelectedApplicant(null);
    };

    if (selectedJob) {
        return (
            <div>
                <button onClick={() => setSelectedJob(null)} className="text-blue-600 hover:underline mb-4">&larr; Back to My Jobs</button>
                <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                <p className="text-gray-500 mb-4">Applicants for this role:</p>
                {applicantsForSelectedJob.length > 0 ? (
                    <div className="space-y-3">
                        {applicantsForSelectedJob.map(eng => (
                            <ApplicantCard
                                key={eng.id}
                                applicant={eng}
                                job={selectedJob}
                                onDeepDive={() => { setSelectedApplicant(eng); setIsDeepDiveOpen(true); }}
                                onHire={() => handleHire(eng)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center p-8 bg-gray-50 rounded-lg">No applicants yet.</p>
                )}
                 {selectedApplicant && (
                    <ApplicantDeepDiveModal
                        isOpen={isDeepDiveOpen}
                        onClose={() => setIsDeepDiveOpen(false)}
                        job={selectedJob}
                        engineer={selectedApplicant}
                    />
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
                        onSelect={() => setSelectedJob(job)}
                        onEdit={() => alert(`Editing job: ${job.title}`)}
                        onDelete={() => alert(`Deleting job: ${job.title}`)}
                    />
                ))}
            </div>
            {myJobs.length === 0 && <p className="text-center text-gray-500">You haven't posted any jobs yet.</p>}
        </div>
    );
};
