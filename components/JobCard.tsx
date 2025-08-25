import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Job } from '../types/index.ts';
import { MapPin, Calendar, DollarSign, Clock } from './Icons.tsx';

interface JobCardProps {
    job: Job;
}

const formatDate = (date: any): string => {
    if (!date) return 'TBD';
    try {
        const d = new Date(date);
        return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
};

export const JobCard = ({ job }: JobCardProps) => {
    const { applyForJob } = useAppContext();

    return (
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-blue-700">{job.title}</h3>
                    <p className="text-gray-500">Posted on {formatDate(job.postedDate)}</p>
                </div>
                <button 
                    onClick={() => applyForJob(job.id)}
                    className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 whitespace-nowrap"
                >
                    Apply Now
                </button>
            </div>
            <div className="my-4 text-gray-700">
                <p>{job.description.substring(0, 200)}...</p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 border-t pt-3">
                <span className="flex items-center"><MapPin size={16} className="mr-2 text-gray-400"/> {job.location}</span>
                <span className="flex items-center"><DollarSign size={16} className="mr-2 text-gray-400"/> {job.currency}{job.dayRate} / day</span>
                <span className="flex items-center"><Clock size={16} className="mr-2 text-gray-400"/> {job.duration}</span>
                <span className="flex items-center"><Calendar size={16} className="mr-2 text-gray-400"/> Starts: {formatDate(job.startDate)}</span>
            </div>
        </div>
    );
};