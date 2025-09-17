import React from 'react';
import { EngineerProfile, ProfileTier } from '../types';
import { PenSquare, Star, Award, ShieldCheck, Briefcase } from './Icons';

interface TopTrumpCardProps {
    profile: EngineerProfile;
    isEditable: boolean;
    onEdit: () => void;
}

const StatBar = ({ label, value, max, color, tooltip }: { label: string, value: number, max: number, color: string, tooltip: string }) => {
    const percentage = (value / max) * 100;
    return (
        <div className="flex items-center w-full tooltip-container">
            <span className="w-1/3 font-bold text-sm text-right pr-4 text-gray-300">{label}</span>
            <div className="w-2/3 bg-gray-700/50 rounded-full h-5 relative">
                <div className={`${color} h-5 rounded-full flex items-center justify-end pr-2`} style={{ width: `${percentage}%` }}>
                    <span className="font-bold text-white text-xs">{value}</span>
                </div>
            </div>
            <span className="tooltip-text">{tooltip}</span>
        </div>
    );
};

export const TopTrumpCard = ({ profile, isEditable, onEdit }: TopTrumpCardProps) => {
    const tierColor = {
        [ProfileTier.BASIC]: 'from-gray-400 to-gray-600',
        [ProfileTier.PROFESSIONAL]: 'from-green-400 to-green-600',
        [ProfileTier.SKILLS]: 'from-blue-400 to-blue-600',
        [ProfileTier.BUSINESS]: 'from-purple-400 to-purple-600',
    }[profile.profileTier];

    const overallScore = profile.selectedJobRoles?.[0]?.overallScore || (profile.experience * 5 + 50);

    return (
        <div className={`relative bg-gray-800 text-white rounded-xl shadow-2xl p-2 border-4 border-gray-600`}>
            {isEditable && (
                <button 
                    onClick={onEdit} 
                    className="absolute top-2 right-2 z-20 p-2 bg-white/20 rounded-full hover:bg-white/40"
                    aria-label="Edit Profile"
                >
                    <PenSquare size={20} />
                </button>
            )}
            <div className={`bg-gradient-to-br ${tierColor} rounded-lg p-1`}>
                <header className="flex justify-between items-center bg-gray-800/80 px-4 py-2 rounded-t-md">
                    <div>
                        <h1 className="text-2xl font-black tracking-wider">{profile.name}</h1>
                        <p className="text-yellow-400 font-bold">{profile.discipline}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-5xl font-black text-yellow-400">{overallScore}</p>
                        <p className="text-xs font-bold -mt-1">OVERALL RATING</p>
                    </div>
                </header>
                <div className="aspect-[16/10] bg-gray-900 border-y-4 border-gray-600 flex items-center justify-center">
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <div className="bg-gray-800/80 p-4 rounded-b-md space-y-3">
                    <p className="text-sm italic text-gray-300">{profile.description}</p>
                    <div className="space-y-2 pt-2">
                        <StatBar label="Experience" value={profile.experience} max={40} color="bg-blue-500" tooltip={`${profile.experience} years in the industry.`} />
                        <StatBar label="Day Rate" value={profile.maxDayRate} max={1200} color="bg-green-500" tooltip={`Max day rate: ${profile.currency}${profile.maxDayRate}`} />
                        <StatBar label="Reputation" value={profile.reputation} max={100} color="bg-yellow-500" tooltip={`Based on reviews and completed contracts.`} />
                        <StatBar label="Compliance" value={profile.complianceScore} max={100} color="bg-red-500" tooltip={`Based on insurance, safety certs, etc.`} />
                    </div>

                    <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 pt-4 border-t border-gray-700/50">
                        {profile.selectedJobRoles?.slice(0, 3).map(role => (
                            <div key={role.roleName} className="flex items-center text-sm font-semibold text-gray-200">
                                <Star size={14} className="mr-1.5 text-yellow-400" /> {role.roleName} ({role.overallScore})
                            </div>
                        ))}
                         {profile.certifications?.slice(0, 2).map(cert => (
                            <div key={cert.name} className={`flex items-center text-sm font-semibold ${cert.verified ? 'text-green-300' : 'text-gray-400'}`}>
                                <Award size={14} className="mr-1.5" /> {cert.name} {cert.verified && <ShieldCheck size={12} className="ml-1"/>}
                            </div>
                        ))}
                         {profile.caseStudies?.slice(0, 1).map(study => (
                             <a key={study.id} href={study.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm font-semibold text-blue-300 hover:underline">
                                <Briefcase size={14} className="mr-1.5" /> View Portfolio
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};