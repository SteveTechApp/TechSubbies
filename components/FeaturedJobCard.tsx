import React from 'react';
// FIX: Corrected import path for types.
import { Job, Page, Role } from '../types';
// FIX: Corrected import path for useAppContext to resolve 'not a module' error.
import { useAppContext } from '../context/InteractionContext';
import { MapPin, DollarSign, Clock, ArrowRight } from './Icons';

interface FeaturedJobCardProps {
    job: Job;
    onNavigate: (page: Page) => void;
}

export const FeaturedJobCard = ({ job, onNavigate }: FeaturedJobCardProps) => {
    const { companies, user } = useAppContext();
    const company = companies.find(c => c.id === job.companyId);

    if (!company) return null;

    const handleApplyClick = () => {
        // If user is an engineer, go to their dashboard (where they can find the job).
        // Otherwise (guest or other roles), go to login/signup page for engineers.
        if (user && user.role === Role.ENGINEER) {
            // FIX: Replaced string literal with Page enum for type safety.
            onNavigate(Page.ENGINEER_DASHBOARD);
        } else {
            // FIX: Replaced string literal with Page enum for type safety.
            onNavigate(Page.LOGIN);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-blue-600 h-full flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center mb-4">
                <img src={company.logo || company.avatar} alt={company.name} className="w-12 h-12 rounded-lg object-contain bg-white p-1 border flex-shrink-0 mr-4" />
                <div>
                    <h4 className="font-bold text-gray-800">{company.name}</h4>
                    <p className="text-sm text-gray-500 flex items-center"><MapPin size={14} className="mr-1.5"/> {job.location}</p>
                </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex-grow">{job.title}</h3>
            <div className="space-y-2 text-gray-700 border-t pt-4">
                <p className="flex items-center"><DollarSign size={16} className="mr-2 text-green-500"/> <span className="font-bold text-lg">{job.currency}{job.dayRate}</span> / day</p>
                <p className="flex items-center"><Clock size={16} className="mr-2 text-blue-500"/> {job.duration}</p>
            </div>
            <button
                onClick={handleApplyClick}
                className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center group"
            >
                View & Apply
                <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
            </button>
        </div>
    );
};