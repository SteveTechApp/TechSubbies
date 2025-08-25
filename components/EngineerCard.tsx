import React from 'react';
import { EngineerProfile } from '../types/index.ts';
import { MapPin, Star } from './Icons.tsx';

interface EngineerCardProps {
    profile: EngineerProfile;
    onClick: () => void;
}

export const EngineerCard = ({ profile, onClick }: EngineerCardProps) => {
    const borderClass = profile.isBoosted 
        ? 'border-purple-500'
        : profile.profileTier === 'paid' 
        ? 'border-blue-500' 
        : 'border-gray-300';
        
    return (
        <button 
            onClick={onClick} 
            className={`w-full h-full flex flex-col text-left p-3 bg-white rounded-lg shadow-md border-t-4 ${borderClass} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
        >
            <div className="relative mb-3">
                {/* Using a simple colored div as placeholder for image */}
                 <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                    <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
                </div>
                {profile.profileTier === 'paid' && (
                     <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center shadow">
                        <Star size={12} className="mr-1" /> SKILLS PROFILE
                    </span>
                )}
            </div>
            
            <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-800 truncate">{profile.name}</h3>
                <p className="text-blue-600 font-semibold text-sm">{profile.discipline}</p>
                <p className="text-sm text-gray-500 flex items-center mt-1"><MapPin size={14} className="mr-1"/> {profile.location}</p>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-gray-500 uppercase">
                        Core Skills
                    </h4>
                    <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">{profile.currency}{profile.dayRate}</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                    {profile.skills.slice(0, 3).map(skill => (
                        <span key={skill.name} className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded-md">{skill.name}</span>
                    ))}
                     {profile.skills.length > 3 && (
                        <span className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded-md">+{profile.skills.length - 3} more</span>
                    )}
                </div>
            </div>
        </button>
    );
}