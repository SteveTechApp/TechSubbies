import React from 'react';
import { useData } from '../context/DataContext';
import { EngineerProfile, ProfileTier } from '../types';
import { MapPin, Star, Rocket, Trophy } from './Icons';

interface EngineerCardProps {
    profile: EngineerProfile;
    onClick: () => void;
    matchScore?: number;
}

const CircularProgress = ({ score }: { score: number }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const scoreColor = score >= 85 ? 'stroke-green-500' : score >= 70 ? 'stroke-blue-500' : score >= 50 ? 'stroke-yellow-500' : 'stroke-gray-500';

    return (
        <div className="relative w-20 h-20">
            <svg className="w-full h-full" viewBox="0 0 70 70">
                <circle className="text-gray-200" strokeWidth="6" stroke="currentColor" fill="transparent" r={radius} cx="35" cy="35" />
                <circle
                    className={scoreColor}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx="35"
                    cy="35"
                    transform="rotate(-90 35 35)"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{Math.round(score)}</span>
                <span className="text-xs font-bold text-gray-800">%</span>
            </div>
        </div>
    );
};


const EngineerCardComponent = ({ profile, onClick, matchScore }: EngineerCardProps) => {
    const { companies } = useData();

    const resourcingCompany = profile.resourcingCompanyId 
        ? companies.find(c => c.id === profile.resourcingCompanyId) 
        : null;

    const borderClass = profile.isBoosted 
        ? 'border-amber-400'
        : profile.profileTier !== ProfileTier.BASIC 
        ? 'border-blue-500'
        : 'border-transparent';
    
    const isTopRated = profile.badges.some(b => b.id === 'top-contributor' || b.id === 'contracts-10');
    
    const topSkillsFromRoles = profile.selectedJobRoles?.[0]?.skills
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3) || [];
        
    return (
        <button 
            onClick={onClick} 
            className={`w-full h-full flex flex-col text-left p-3 bg-white rounded-lg shadow-md border-4 ${borderClass} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
        >
            <div className="relative mb-3">
                <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                    <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md" loading="lazy" />
                </div>
                
                {resourcingCompany?.logo && (
                    <div 
                        className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 bg-white p-1 rounded-full shadow-lg"
                        title={`Managed by ${resourcingCompany.name}`}
                    >
                        <img 
                            src={resourcingCompany.logo as string} 
                            alt={`${resourcingCompany.name} logo`}
                            className="w-8 h-8 rounded-full object-contain"
                            loading="lazy"
                        />
                    </div>
                )}
                
                <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
                    {profile.isBoosted && (
                         <span className="bg-amber-400 text-black text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center shadow-lg">
                            <Rocket size={12} className="mr-1" /> BOOSTED
                        </span>
                    )}
                    {isTopRated && (
                        <span className="bg-yellow-400 text-black text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center shadow-lg">
                            <Trophy size={12} className="mr-1" /> TOP RATED
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
                <h3 className="text-lg font-bold text-gray-800 truncate">{profile.name}</h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-blue-600 font-semibold text-sm">{profile.discipline}</p>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{profile.experienceLevel}</span>
                </div>
                <p className="text-sm text-gray-500 flex items-center mt-1"><MapPin size={14} className="mr-1"/> {profile.location}</p>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
                {matchScore !== undefined ? (
                    <div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase">Evidence-adjusted match</h4>
                                <p className="text-sm text-gray-600">Skills are checked against the selected job.</p>
                            </div>
                            <CircularProgress score={matchScore} />
                        </div>
                        {profile.matchExplanation && (
                            <div className="mt-3 space-y-2 border-t border-gray-100 pt-2">
                                <div className="flex flex-wrap gap-1 text-xs">
                                    <span className="rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                                        {profile.matchExplanation.evidenceBackedSkills} evidence-backed
                                    </span>
                                    {profile.matchExplanation.skillGaps > 0 && (
                                        <span className="rounded-full bg-amber-50 px-2 py-1 font-medium text-amber-700">
                                            {profile.matchExplanation.skillGaps} below level
                                        </span>
                                    )}
                                    {profile.matchExplanation.missingSkills > 0 && (
                                        <span className="rounded-full bg-red-50 px-2 py-1 font-medium text-red-700">
                                            {profile.matchExplanation.missingSkills} missing
                                        </span>
                                    )}
                                </div>
                                {profile.matchExplanation.skills.slice(0, 3).map(skill => (
                                    <div key={skill.skillName} className="rounded-md bg-gray-50 px-2 py-1.5 text-xs">
                                        <div className="flex justify-between gap-2 font-medium text-gray-700">
                                            <span className="truncate">{skill.skillName}</span>
                                            <span className={skill.status === 'meets' ? 'text-emerald-700' : 'text-amber-700'}>
                                                {skill.effectiveRating ?? '—'} / {skill.requiredLevel}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-gray-500">
                                            {skill.evidenceCount > 0
                                                ? `${skill.evidenceCount} evidence item${skill.evidenceCount === 1 ? '' : 's'} · ${skill.evidenceFreshness}`
                                                : skill.status === 'missing' ? 'Skill not listed' : 'Self-rating only'}
                                        </p>
                                    </div>
                                ))}
                                {profile.matchExplanation.skills.length > 3 && (
                                    <p className="text-xs text-gray-500">Open profile for {profile.matchExplanation.skills.length - 3} more requirement details.</p>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-gray-500 uppercase">
                                {profile.profileTier !== ProfileTier.BASIC ? 'Top Skills' : 'Day Rate'}
                            </h4>
                            <div className="text-right">
                                <p className="text-lg font-bold text-gray-800">{profile.currency}{profile.minDayRate} - {profile.maxDayRate}</p>
                            </div>
                        </div>
                        {profile.profileTier !== ProfileTier.BASIC && topSkillsFromRoles.length > 0 ? (
                            <div className="flex flex-wrap gap-1 mt-1">
                                {topSkillsFromRoles.map(skill => (
                                    <span key={skill.name} className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded-md">{skill.name}</span>
                                ))}
                                {profile.selectedJobRoles?.[0]?.skills.length > 3 && (
                                    <span className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded-md">+{profile.selectedJobRoles[0].skills.length - 3} more</span>
                                )}
                            </div>
                        ) : (
                            <div className="mt-1 text-center bg-gray-100 p-2 rounded-md">
                                <p className="text-xs text-blue-700 font-semibold">Upgrade to Skills Profile to showcase expertise.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </button>
    );
}

export const EngineerCard = React.memo(EngineerCardComponent);
