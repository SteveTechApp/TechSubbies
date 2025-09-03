import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Job, Role } from '../types/index.ts';
import { MapPin, Calendar, DollarSign, Clock, MessageCircle, Briefcase, Layers } from './Icons.tsx';
import { formatDisplayDate } from '../../utils/dateFormatter.ts';

interface JobCardProps {
    job: Job;
    setActiveView?: (view: string) => void;
}

export const JobCard = ({ job, setActiveView }: JobCardProps) => {
    const { user, applyForJob, startConversationAndNavigate } = useAppContext();
    const canMessage = user?.role === Role.ENGINEER && setActiveView;

    const handleMessageClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the main card click if it were a button
        if (canMessage) {
            startConversationAndNavigate(job.companyId, () => setActiveView('Messages'));
        }
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 flex flex-col">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-blue-700">{job.title}</h3>
                    <p className="text-gray-500">Posted on {formatDisplayDate(job.postedDate)}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button 
                        onClick={() => applyForJob(job.id)}
                        className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 whitespace-nowrap w-full"
                    >
                        Apply Now
                    </button>
                    {canMessage && (
                         <button 
                            onClick={handleMessageClick}
                            className="flex items-center justify-center bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap text-sm w-full"
                        >
                            <MessageCircle size={16} className="mr-2"/> Message Company
                        </button>
                    )}
                </div>
            </div>
            <div className="my-4 text-gray-700 flex-grow">
                <p>{job.description.substring(0, 200)}...</p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 border-t pt-3">
                <span className="flex items-center"><MapPin size={16} className="mr-2 text-gray-400"/> {job.location}</span>
                <span className="flex items-center"><DollarSign size={16} className="mr-2 text-gray-400"/> {job.currency}{job.dayRate} / day</span>
                <span className="flex items-center"><Clock size={16} className="mr-2 text-gray-400"/> {job.duration}</span>
                <span className="flex items-center"><Calendar size={16} className="mr-2 text-gray-400"/> Starts: {formatDisplayDate(job.startDate)}</span>
                <span className="flex items-center"><Briefcase size={16} className="mr-2 text-gray-400"/> {job.jobType}</span>
                <span className="flex items-center"><Layers size={16} className="mr-2 text-gray-400"/> {job.experienceLevel}</span>
            </div>
        </div>
    );
};
