import React from 'react';
import { EngineerProfile } from '../context/AppContext.tsx';
import { MapPin, Star } from './Icons.tsx';

interface EngineerCardProps {
    profile: EngineerProfile;
    onClick: () => void;
}

export const EngineerCard = ({ profile, onClick }: EngineerCardProps) => (
    <button onClick={onClick} className={`w-full text-left p-4 bg-white rounded-lg shadow-md border-l-4 ${profile.profileTier === 'paid' ? 'border-blue-500' : 'border-gray-300'} hover:shadow-lg hover:border-blue-600 transition-all`}>
        <div className="flex justify-between items-start">
            <div className="flex items-start">
                <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-full mr-4 border-2 border-gray-200" />
                <div>
                    <div className="flex items-center gap-x-3">
                        <h3 className="text-lg font-bold text-gray-800">{profile.name}</h3>
                        {profile.profileTier === 'paid' && (
                             <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                                <Star size={12} className="mr-1" /> JOB PROFILE
                            </span>
                        )}
                    </div>
                    <p className="text-blue-600 font-semibold">{profile.tagline}</p>
                    <p className="text-sm text-gray-500 flex items-center mt-1"><MapPin size={14} className="mr-1"/> {profile.location}</p>
                </div>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold">{profile.currency}{profile.dayRate}</p>
                <p className="text-sm text-gray-500">Day Rate</p>
            </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                {profile.profileTier === 'paid' ? 'Top Specialist Skills' : 'Core Skills'}
            </h4>
            <div className="flex flex-wrap gap-2">
                {profile.skills.slice(0, 4).map(skill => (
                    <span key={skill.name} className="bg-gray-200 text-gray-800 px-2 py-1 text-sm rounded-md">{skill.name}</span>
                ))}
            </div>
        </div>
    </button>
);
