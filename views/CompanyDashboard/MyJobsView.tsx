import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { Job, EngineerProfile, Application } from '../../types/index.ts';
import { MapPin, ArrowLeft, User, Mail, Phone, MessageCircle, Star } from '../../components/Icons.tsx';
import { ReviewModal } from '../../components/ReviewModal.tsx';

const formatDate = (date: any): string => {
    if (!date) return 'TBD';
    try {
        const d = new Date(date);
        return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
};

interface ApplicantCardProps {
    profile: EngineerProfile;
    application: Application;
    onMessage: (profileId: string) => void;
    onReview: (profile: EngineerProfile) => void;
}

const ApplicantCard = ({ profile, application, onMessage, onReview }: ApplicantCardProps) => (
    <div className="p-4 bg-white rounded-lg shadow-md border flex items-start gap-4">
        <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-full border-2 border-gray-200" />
        <div className="flex-grow">
            <h4 className="text-lg font-bold text-gray-800">{profile.name}</h4>
            <p className="text-blue-600 font-semibold">{profile.discipline}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                <span className="flex items-center"><User size={14} className="mr-1.5"/> {profile.experience} years exp.</span>
                <span className="flex items-center"><Mail size={14} className="mr-1.5"/> {profile.contact.email}</span>
                <span className="flex items-center"><Phone size={14} className="mr-1.5"/> {profile.contact.phone}</span>
            </div>
        </div>
        <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
            <div>
                <p className="text-lg font-bold">{profile.currency}{profile.dayRate}</p>
                <p className="text-sm text-gray-500">Day Rate</p>
            </div>
             <div className="flex items-center gap-2">
                <button 
                    onClick={() => onMessage(profile.id)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 flex items-center"
                >
                    <MessageCircle size={14} className="mr-1.5" /> Message
                </button>
                <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">View Profile</button>
                 <button 
                    onClick={() => onReview(profile)}
                    disabled={application.reviewed}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <Star size={14} className="mr-1.5" /> {application.reviewed ? 'Reviewed' : 'Mark as Complete & Rate'}
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
    const { applications, engineers, startConversationAndNavigate, submitReview } = useAppContext();
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [reviewingApplicant, setReviewingApplicant] = useState<EngineerProfile | null>(null);


    const getApplicantsForJob = (jobId: string) => {
        return applications
            .filter(app => app.jobId === jobId)
            .map(app => {
                const engineer = engineers.find(eng => eng.id === app.engineerId);
                return { application: app, engineer };
            })
            .filter(item => item.engineer); // Filter out any cases where engineer wasn't found
    };
    
    const handleMessageApplicant = (profileId: string) => {
        startConversationAndNavigate(profileId, () => setActiveView('Messages'));
    };
    
    const handleReviewApplicant = (profile: EngineerProfile) => {
        setReviewingApplicant(profile);
    };

    if (selectedJob) {
        const applicants = getApplicantsForJob(selectedJob.id);
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
                    <p className="text-gray-600 mb-6">You have {applicants.length} applicant(s) for this role.</p>
                     {applicants.length > 0 ? (
                        <div className="space-y-4">
                            {applicants.map(({ application, engineer }) => 
                                engineer && <ApplicantCard key={engineer.id} profile={engineer} application={application} onMessage={handleMessageApplicant} onReview={handleReviewApplicant} />
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
                            <p>Posted: {formatDate(job.postedDate)}</p>
                            <p>Starts: {formatDate(job.startDate)}</p>
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