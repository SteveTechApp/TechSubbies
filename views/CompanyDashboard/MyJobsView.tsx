import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
// FIX: Replaced incorrect context hook 'useInteractions' with the correct hook 'useAppContext'.
import { useAppContext } from '../../context/InteractionContext';
import { Job, EngineerProfile, ApplicationStatus, Application } from '../../types';
import { MapPin, DollarSign, Users, Edit, Trash2, BrainCircuit, Star } from '../../components/Icons';
import { CreateContractModal } from '../../components/CreateContractModal';
import apiService from '../../services/apiService';

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

const ApplicantCard = ({ applicant, application, assessment, onDeepDive, onHire }: { applicant: EngineerProfile, application: Application, assessment?:any, onDeepDive: () => void, onHire: () => void }) => {
    return (
        <div className={`flex items-center gap-4 p-3 bg-white rounded-lg border relative ${application.isFeatured ? 'border-amber-400' : 'border-gray-200'}`}>
            {application.isFeatured && (
                <div className="absolute -top-3 -left-3 bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded-full flex items-center shadow-lg transform -rotate-12">
                    <Star size={12} className="mr-1"/> FEATURED
                </div>
            )}
            <img src={applicant.avatar} alt={applicant.name} className="w-14 h-14 rounded-full" />
            <div className="flex-grow">
                <h4 className="font-bold">{applicant.name}</h4>
                <p className="text-sm text-blue-600">{applicant.discipline}</p>
                {assessment&&<p className={`mt-1 text-xs font-bold uppercase ${assessment.outcome==='eligible'?'text-emerald-700':assessment.outcome==='review'?'text-amber-700':'text-red-700'}`}>{assessment.outcome} · {assessment.outcome==='excluded'?'written override required':'profile assessment available'}</p>}
            </div>
            <div className="flex items-center gap-2">
                <button onClick={onDeepDive} className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 font-semibold flex items-center gap-2">
                    <BrainCircuit size={14} /> AI Deep Dive
                </button>
                <button onClick={onHire} className={`px-3 py-1.5 text-sm text-white rounded-md font-semibold ${assessment?.outcome==='excluded'?'bg-amber-700 hover:bg-amber-800':'bg-green-600 hover:bg-green-700'}`}>{assessment?.outcome==='excluded'?'Review Override':'Select & Send Contract'}</button>
            </div>
        </div>
    )
}


export const MyJobsView = ({ myJobs, setActiveView }: MyJobsViewProps) => {
    const { applications, engineers } = useData();
    const { createContract, setApplicantForDeepDive } = useAppContext();
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [selectedApplicant, setSelectedApplicant] = useState<EngineerProfile | null>(null);
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    const [shortlist, setShortlist] = useState<any>(null);
    const [shortlistError, setShortlistError] = useState('');
    const [overrideExclusionReason, setOverrideExclusionReason] = useState('');

    useEffect(() => {
        if (!selectedJob) { setShortlist(null); setShortlistError(''); return; }
        let active=true; setShortlist(null); setShortlistError('');
        apiService.getJobShortlist(selectedJob.id).then(data=>{if(active)setShortlist(data)}).catch(error=>{if(active)setShortlistError(error.message)});
        return()=>{active=false};
    }, [selectedJob]);

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
                if(shortlist){const order=new Map(shortlist.candidates.map((item:any,index:number)=>[item.engineerId,index]));return Number(order.get(a.engineer.id)??9999)-Number(order.get(b.engineer.id)??9999);}
                // Featured applications first
                if (a.application.isFeatured && !b.application.isFeatured) return -1;
                if (!a.application.isFeatured && b.application.isFeatured) return 1;
                // Then by date
                return b.application.date.getTime() - a.application.date.getTime();
            });
    }, [selectedJob, applications, engineers, shortlist]);
    
    const handleHire = (engineer: EngineerProfile) => {
        if (!selectedJob) return;
        const assessment=shortlist?.candidates.find((item:any)=>item.engineerId===engineer.id);
        if(assessment?.outcome==='excluded'){
            const reason=window.prompt(`This applicant is excluded because:\n${assessment.risks.join('\n')}\n\nTo continue exceptionally, record why the mandatory requirement can be overridden:`)||'';
            if(reason.trim().length<20){if(reason)alert('The override reason must contain at least 20 characters.');return;}
            setOverrideExclusionReason(reason.trim());
        }else setOverrideExclusionReason('');
        setSelectedApplicant(engineer);
        setIsHireModalOpen(true);
    };
    
    const handleContractSent = async (contract: any) => {
        await createContract({...contract,overrideExclusionReason:overrideExclusionReason||undefined});
        setIsHireModalOpen(false);
        setSelectedApplicant(null);
    };
    
    const handleOpenDeepDive = (engineer: EngineerProfile, job: Job) => {
        setApplicantForDeepDive({ engineer, job });
    };

    if (selectedJob) {
        return (
            <div>
                <button onClick={() => setSelectedJob((current) => current === null ? null : null)} className="text-blue-600 hover:underline mb-4">&larr; Back to My Jobs</button>
                <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                <p className="text-gray-500">Applicants for this role:</p>
                <section className="my-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold text-slate-900">Explainable shortlist</h3><p className="mt-1 text-sm text-slate-600">Role and mandatory prerequisites control eligibility. Skills, responsibility, evidence and availability remain separate decision signals.</p></div>{shortlist&&<span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">{shortlist.candidates.length} assessed</span>}</div>
                    {!shortlist&&!shortlistError&&<p className="mt-4 text-sm text-slate-500">Assessing declared profile evidence…</p>}
                    {shortlistError&&<p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{shortlistError}</p>}
                    {shortlist&&<div className="mt-4 space-y-3">{shortlist.candidates.map((candidate:any)=><article key={candidate.applicationId} className="rounded-lg border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-2"><strong>{candidate.engineerName}</strong><span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${candidate.outcome==='eligible'?'bg-emerald-100 text-emerald-800':candidate.outcome==='review'?'bg-amber-100 text-amber-800':'bg-red-100 text-red-800'}`}>{candidate.outcome}</span></div><div className="mt-3 grid gap-3 text-sm md:grid-cols-2"><div><div className="font-semibold text-emerald-700">Why they match</div>{candidate.reasons.length?<ul className="mt-1 list-disc space-y-1 pl-5 text-slate-600">{candidate.reasons.map((reason:string)=><li key={reason}>{reason}</li>)}</ul>:<p className="mt-1 text-slate-500">No positive signals declared.</p>}</div><div><div className="font-semibold text-amber-700">Check before selection</div>{candidate.risks.length?<ul className="mt-1 list-disc space-y-1 pl-5 text-slate-600">{candidate.risks.map((risk:string)=><li key={risk}>{risk}</li>)}</ul>:<p className="mt-1 text-slate-500">No profile gaps found.</p>}</div></div></article>)}</div>}
                    {shortlist&&shortlist.candidates.length===0&&<p className="mt-4 text-sm text-slate-500">No applications have been submitted for assessment.</p>}
                    {shortlist&&<p className="mt-4 text-xs text-slate-500">{shortlist.method} Ordering never overrides an exclusion.</p>}
                </section>
                {applicantsForSelectedJob.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {applicantsForSelectedJob.map(({ engineer, application }) => (
                            <ApplicantCard
                                key={engineer.id}
                                applicant={engineer}
                                application={application}
                                assessment={shortlist?.candidates.find((item:any)=>item.engineerId===engineer.id)}
                                onDeepDive={() => handleOpenDeepDive(engineer, selectedJob)}
                                onHire={() => handleHire(engineer)}
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
