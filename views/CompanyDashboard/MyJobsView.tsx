import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { Job, EngineerProfile, Application, ApplicationStatus, ProfileTier } from '../../types/index.ts';
import { MapPin, ArrowLeft, User, Mail, Phone, MessageCircle, Star, Briefcase, Sparkles, Loader } from '../../components/Icons.tsx';
import { ReviewModal } from '../../components/ReviewModal.tsx';
import { CreateContractModal } from '../../components/CreateContractModal.tsx';
import { formatDisplayDate } from '../../utils/dateFormatter.ts';

interface ApplicantCardProps {
    profile: EngineerProfile;
    application: Application;
    job: Job;
    onMessage: (profileId: string) => void;
    onReview: (profile: EngineerProfile) => void;
    onCreateContract: (job: Job, profile: EngineerProfile) => void;
    matchScore?: number;
}

const ApplicantCard = ({ profile, application, job, onMessage, onReview, onCreateContract, matchScore }: ApplicantCardProps) => (
    <div className="p-4 bg-white rounded-lg shadow-md border flex items-start gap-4">
        <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-full border-2 border-gray-200" />
        <div className="flex-grow">
            <div className="flex items-center gap-3">
                <h4 className="text-lg font-bold text-gray-800">{profile.name}</h4>
                {matchScore !== undefined && (
                     <div className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center">
                        <Sparkles size={12} className="mr-1.5" />
                        {Math.round(matchScore)}% Match
                    </div>
                )}
            </div>
            <p className="text-blue-600 font-semibold">{profile.discipline}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                <span className="flex items-center"><User size={14} className="mr-1.5"/> {profile.experience} years exp.</span>
                <span className="flex items-center"><Mail size={14} className="mr-1.5"/> {profile.contact.email}</span>
                <span className="flex items-center"><Phone size={14} className="mr-1.5"/> {profile.contact.phone}</span>
            </div>
        </div>
        <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
            <div>
                {/* FIX: EngineerProfile has minDayRate and maxDayRate, not a single dayRate. Displaying the range instead. */}
                <p className="text-lg font-bold">{profile.currency}{profile.minDayRate} - {profile.maxDayRate}</p>
                <p className="text-sm text-gray-500">Day Rate</p>
            </div>
             <div className="flex items-center gap-2">
                {application.status === ApplicationStatus.APPLIED && (
                    <button 
                        onClick={() => onCreateContract(job, profile)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 font-bold flex items-center"
                    >
                        <Briefcase size={14} className="mr-1.5" /> Create Contract
                    </button>
                )}
                 {application.status !== ApplicationStatus.APPLIED && (
                    <span className={`px-3 py-1 text-sm font-bold rounded-md ${
                        application.status === ApplicationStatus.OFFERED ? 'bg-yellow-100 text-yellow-800' :
                        application.status === ApplicationStatus.ACCEPTED ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {application.status}
                    </span>
                 )}
                <button 
                    onClick={() => onMessage(profile.id)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 flex items-center"
                >
                    <MessageCircle size={14} className="mr-1.5" /> Message
                </button>
                <button 
                    onClick={() => onReview(profile)}
                    disabled={application.reviewed}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <Star size={14} className="mr-1.5" /> {application.reviewed ? 'Reviewed' : 'Complete & Rate'}
                </button>
            </div>
        </div>
    </div>
);

interface MyJobsViewProps {
    myJobs: Job[];
    setActiveView: (view: string) => void;
}

export const MyJobsView = ({ myJobs, setActiveView }: MyJobsViewProps) => {
    const { applications, engineers, startConversationAndNavigate, submitReview, sendContractForSignature, geminiService } = useAppContext();
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [reviewingApplicant, setReviewingApplicant] = useState<EngineerProfile | null>(null);
    const [contractingDetails, setContractingDetails] = useState<{job: Job, engineer: EngineerProfile} | null>(null);
    const [isMatching, setIsMatching] = useState(false);
    const [matchScores, setMatchScores] = useState<Map<string, number>>(new Map());


    const getApplicantsForJob = useMemo(() => (jobId: string) => {
        return applications
            .filter(app => app.jobId === jobId)
            .map(app => {
                const engineer = engineers.find(eng => eng.id === app.engineerId);
                return { application: app, engineer };
            })
            .filter((item): item is { application: Application; engineer: EngineerProfile } => !!item.engineer);
    }, [applications, engineers]);
    
    useEffect(() => {
        if (!selectedJob) return;

        const fetchMatchScores = async () => {
            setIsMatching(true);
            setMatchScores(new Map()); // Clear old scores

            // We can only score premium engineers with detailed skill profiles
            const premiumApplicants = getApplicantsForJob(selectedJob.id)
                .map(item => item.engineer)
                .filter(eng => 
                    eng.profileTier !== ProfileTier.BASIC && !!eng.selectedJobRoles && eng.selectedJobRoles.length > 0
                );

            if (premiumApplicants.length > 0) {
                const results = await geminiService.findBestMatchesForJob(selectedJob, premiumApplicants);
                if (results && results.matches) {
                    const scoresMap = new Map<string, number>();
                    results.matches.forEach((match: { id: string; match_score: number }) => {
                        scoresMap.set(match.id, match.match_score);
                    });
                    setMatchScores(scoresMap);
                }
            }
            setIsMatching(false);
        };

        fetchMatchScores();
    }, [selectedJob, geminiService, getApplicantsForJob]);
    
    const applicantsForSelectedJob = useMemo(() => {
        if (!selectedJob) return [];
        
        return getApplicantsForJob(selectedJob.id)
            .map(item => ({
                ...item,
                matchScore: matchScores.get(item.engineer.id)
            }))
            .sort((a, b) => {
                // Sort by match score (desc), then by application date (desc)
                if (a.matchScore !== undefined && b.matchScore !== undefined) {
                    return b.matchScore - a.matchScore;
                }
                if (a.matchScore !== undefined) return -1;
                if (b.matchScore !== undefined) return 1;
                return b.application.date.getTime() - a.application.date.getTime();
            });
    }, [selectedJob, getApplicantsForJob, matchScores]);
    
    const handleMessageApplicant = (profileId: string) => {
        startConversationAndNavigate(profileId, () => setActiveView('Messages'));
    };
    
    const handleReviewApplicant = (profile: EngineerProfile) => {
        setReviewingApplicant(profile);
    };
    
    const handleCreateContract = (job: Job, engineer: EngineerProfile) => {
        setContractingDetails({job, engineer});
    };

    if (selectedJob) {
        return (
            <div>
                 <button 
                    onClick={() => setSelectedJob(null)} 
                    className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Jobs List
                </button>
                <div className="bg-white p-5 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-1">Applicants for "{selectedJob.title}"</h2>
                    <p className="text-gray-600 mb-6">You have {applicantsForSelectedJob.length} applicant(s) for this role.</p>
                     {isMatching && (
                        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-md my-4">
                            <Loader className="animate-spin w-5 h-5 mr-3 text-blue-600" />
                            <p className="text-blue-700 font-semibold">Calculating AI match scores for premium applicants...</p>
                        </div>
                    )}
                     {applicantsForSelectedJob.length > 0 ? (
                        <div className="space-y-4">
                            {applicantsForSelectedJob.map(({ application, engineer, matchScore }) => 
                                <ApplicantCard 
                                    key={engineer.id} 
                                    profile={engineer} 
                                    application={application} 
                                    job={selectedJob} 
                                    onMessage={handleMessageApplicant} 
                                    onReview={handleReviewApplicant} 
                                    onCreateContract={handleCreateContract} 
                                    matchScore={matchScore}
                                />
                            )}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No applications received yet.</p>
                    )}
                </div>
                {reviewingApplicant && (
                    <ReviewModal 
                        isOpen={!!reviewingApplicant}
                        onClose={() => setReviewingApplicant(null)}
                        job={selectedJob}
                        engineer={reviewingApplicant}
                        onSubmit={submitReview}
                    />
                )}
                 {contractingDetails && (
                    <CreateContractModal
                        isOpen={!!contractingDetails}
                        onClose={() => setContractingDetails(null)}
                        job={contractingDetails.job}
                        engineer={contractingDetails.engineer}
                        onSendForSignature={sendContractForSignature}
                    />
                 )}
            </div>
        );
    }
    
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">My Posted Jobs</h1>
        <div className="bg-white p-5 rounded-lg shadow">
            {myJobs.length > 0 ? (
                <div className="space-y-4">
                {myJobs.map(job => 
                    <button key={job.id} onClick={() => setSelectedJob(job)} className="w-full text-left p-4 border rounded-md flex justify-between items-center hover:bg-gray-50 hover:shadow-md transition-all">
                        <div>
                            <h3 className="font-bold text-lg text-blue-700">{job.title}</h3>
                            <p className="text-gray-600 flex items-center mt-1">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                {job.location}
                            </p>
                        </div>
                         <div className="text-center font-semibold">
                            <p className="text-2xl">{getApplicantsForJob(job.id).length}</p>
                            <p className="text-sm text-gray-500">Applicants</p>
                        </div>
                        <div className="text-right text-gray-500 text-sm">
                            <p>Posted: {formatDisplayDate(job.postedDate)}</p>
                            <p>Starts: {formatDisplayDate(job.startDate)}</p>
                        </div>
                    </button>
                )}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-4">You have not posted any jobs yet.</p>
            )}
        </div>
      </div>
  );
};