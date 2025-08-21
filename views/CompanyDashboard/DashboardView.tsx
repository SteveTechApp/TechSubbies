import React from 'react';
import { User, Job, EngineerProfile } from '../../context/AppContext.tsx';
import { AIEngineerCostAnalysis } from '../../components/AIEngineerCostAnalysis.tsx';

interface DashboardViewProps {
    user: User;
    myJobs: Job[];
    engineers: EngineerProfile[];
}

export const DashboardView = ({ user, myJobs, engineers }: DashboardViewProps) => (
  <div>
    <h1 className="text-3xl font-bold mb-6">Welcome, {user?.profile?.name}!</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-bold text-xl">Active Jobs</h2>
        <p className="text-4xl font-extrabold text-blue-600">{myJobs.length}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-bold text-xl">Total Engineers</h2>
        <p className="text-4xl font-extrabold text-green-600">{engineers.length}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-bold text-xl">Applications</h2>
        <p className="text-4xl font-extrabold text-yellow-600">12</p>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Featured Engineer vs. Your Latest Job</h2>
      {myJobs.length > 0 && engineers.length > 0 ?
        <AIEngineerCostAnalysis job={myJobs[0]} engineer={engineers[0]} /> :
        <p>Post a job to see AI analysis.</p>
      }
    </div>
  </div>
);
