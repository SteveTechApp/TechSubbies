import React from 'react';
import { Job } from '../../context/AppContext.tsx';
import { MapPin } from '../../components/Icons.tsx';

const formatDate = (date: any): string => {
    if (!date) return 'TBD';
    try {
        const d = new Date(date);
        return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
};

interface MyJobsViewProps {
    myJobs: Job[];
}

export const MyJobsView = ({ myJobs }: MyJobsViewProps) => (
  <div>
    <h1 className="text-3xl font-bold mb-6">My Posted Jobs</h1>
    <div className="bg-white p-6 rounded-lg shadow">
        {myJobs.length > 0 ? (
            <div className="space-y-4">
            {myJobs.map(job => 
                <div key={job.id} className="p-4 border rounded-md flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg text-blue-700">{job.title}</h3>
                        <p className="text-gray-600 flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            {job.location}
                        </p>
                    </div>
                    <div className="text-right text-gray-500 text-sm">
                        <p>Posted: {formatDate(job.postedDate)}</p>
                        <p>Starts: {formatDate(job.startDate)}</p>
                    </div>
                </div>
            )}
            </div>
        ) : (
            <p className="text-center text-gray-500 py-4">You have not posted any jobs yet.</p>
        )}
    </div>
  </div>
);