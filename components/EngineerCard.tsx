import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { EngineerProfile, ProfileTier } from '../types/index.ts';
import { MapPin, Star, Rocket, Sparkles } from './Icons.tsx';

interface EngineerCardProps {
    profile: EngineerProfile;
    onClick: () => void;
    matchScore?: number;
    isAiMatch?: boolean;
}

export const EngineerCard = ({ profile, onClick, matchScore, isAiMatch }: EngineerCardProps) => {
    const { companies } = useAppContext();

    const resourcingCompany = profile.resourcingCompanyId 
        ? companies.find(c => c.id === profile.resourcingCompanyId) 
        : null;

    const borderClass = profile.isBoosted 
        ? 'border-amber-400'
        : profile.profileTier !== ProfileTier.BASIC 
        ? 'border-blue-500'
        : 'border-transparent';
        
    return (
        <button 
            onClick={onClick} 
            className={`w-full h-full flex flex-col text-left p-3 bg-white rounded-lg shadow-md border-4 ${borderClass} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
        >
            <div className="relative mb-3">
                <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                    <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
                </div>
                
                {resourcingCompany && resourcingCompany.logo && (
                    <div 
                        className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 bg-white p-1 rounded-full shadow-lg"
                        title={`Managed by ${resourcingCompany.name}`}
                    >
                        <img 
                            src={resourcingCompany.logo} 
                            alt={`${resourcingCompany.name} logo`}
                            className="w-8 h-8 rounded-full object-contain"
                        />
                    </div>
                )}
                
                {matchScore !== undefined && (
                    <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-lg">
                        <Sparkles size={12} className="mr-1.5" />
                        {Math.round(matchScore)}% Match
                    </div>
                )}
                
                <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
                    {profile.isBoosted && (
                         <span className="bg-amber-400 text-black text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center shadow-lg">
                            <Rocket size={12} className="mr-1" /> BOOSTED
                        </span>
                    )}
                    {profile.profileTier !== ProfileTier.BASIC && (
                         <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center shadow">
                            <Star size={12} className="mr-1" /> SKILLS PROFILE
                        </span>
                    )}
                </div>
            </div>
            
            <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-800 truncate">{profile.name}</h3>
                </div>
                <p className="text-blue-600 font-semibold text-sm">{profile.discipline}</p>
                <p className="text-sm text-gray-500 flex items-center mt-1"><MapPin size={14} className="mr-1"/> {profile.location}</p>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-gray-500 uppercase">
                        {profile.profileTier !== ProfileTier.BASIC ? 'Core Skills' : 'Profile Tier'}
                    </h4>
                    <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">{profile.currency}{profile.dayRate}</p>
                    </div>
                </div>
                {profile.profileTier !== ProfileTier.BASIC && profile.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {profile.skills.slice(0, 3).map(skill => (
                            <span key={skill.name} className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded-md">{skill.name}</span>
                        ))}
                         {profile.skills.length > 3 && (
                            <span className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded-md">+{profile.skills.length - 3} more</span>
                        )}
                    </div>
                ) : (
                    <div className="mt-1 text-center bg-gray-100 p-2 rounded-md">
                        <p className="text-xs text-blue-700 font-semibold">Upgrade to Skills Profile to showcase expertise.</p>
                    </div>
                )}
            </div>
        </button>
    );
}