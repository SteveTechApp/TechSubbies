import React, { useState } from 'react';
import { EngineerProfile, Compliance, ProfileTier } from '../types/index.ts';
import { Star, Briefcase, Award, Linkedin, Mail, Users, Calendar, MapPin, ShieldCheck, CheckCircle, BarChart, Edit } from './Icons.tsx';
import { BadgeDisplay } from './BadgeDisplay.tsx';

// A simple component to render a star rating on the card
const CardStarRating = ({ rating = 0, label }: { rating?: number, label: string }) => (
    <div className="flex items-center gap-1.5">
        <span className="font-bold text-[10px]">{label}</span>
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className={` ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} />
            ))}
        </div>
    </div>
);

// Stat row component for the card
const StatRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center py-1 px-2 odd:bg-white/10 even:bg-black/10">
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        <span className="text-sm font-black bg-white text-blue-900 px-1.5 py-0.5 rounded-sm shadow-inner">{value}</span>
    </div>
);


const CardFront = ({ profile, isEditable, onEdit }: { profile: EngineerProfile, isEditable?: boolean, onEdit?: () => void }) => {
    const {
        name, discipline, avatar, experience, minDayRate, maxDayRate, currency,
        customerRating, peerRating, location, description, profileTier, badges
    } = profile;

    const TIER_BADGE_INFO = {
        [ProfileTier.BASIC]: null,
        [ProfileTier.PROFESSIONAL]: { text: "Silver", color: "bg-green-400" },
        [ProfileTier.SKILLS]: { text: "Gold", color: "bg-yellow-400" },
        [ProfileTier.BUSINESS]: { text: "Platinum", color: "bg-purple-400" },
    };
    const tierBadge = TIER_BADGE_INFO[profileTier];

    const hasPaidFeatures = profileTier !== ProfileTier.BASIC;

    const topSkillScore = profile.selectedJobRoles && profile.selectedJobRoles.length > 0
        ? Math.max(...profile.selectedJobRoles.map(r => r.overallScore))
        : profile.skills && profile.skills.length > 0
        ? Math.round(profile.skills.reduce((acc, s) => acc + s.rating, 0) / (profile.skills.length || 1))
        : 0;
        
    const topSkillName = profile.skills && profile.skills.length > 0 ? profile.skills.reduce((prev, current) => (prev.rating > current.rating) ? prev : current).name : 'N/A';
    const country = location.split(',').pop()?.trim() || 'UK';
    let countryFlag = '🇬🇧';
    if (country.toLowerCase() === 'usa') countryFlag = '🇺🇸';
    
    const borderClass = profile.isBoosted ? 'border-purple-500' : 'border-white';

    return (
        <div className={`font-sans w-full h-full bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl border-2 ${borderClass} shadow-2xl p-2 transform transition-all duration-300 relative`}>
            {isEditable && (
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
                    className="absolute top-2 right-2 z-20 flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 shadow-lg border border-white/30 text-xs"
                    aria-label="Edit Public Profile"
                >
                    <Edit size={12} className="mr-1.5" /> Edit
                </button>
            )}
            <div className="text-center border-b-2 border-yellow-400 pb-1 mb-1">
                <div className="flex justify-center items-center gap-2">
                    <h1 className="text-xl font-black uppercase tracking-tighter">{name}</h1>
                    <span className="text-lg">{countryFlag}</span>
                </div>
                <p className="text-xs font-semibold text-blue-200">{discipline}</p>
            </div>
            <div className="relative w-full aspect-[4/3] bg-blue-800 rounded-lg overflow-hidden border-2 border-white mb-1">
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
                 <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full flex flex-col items-center gap-0.5">
                    <CardStarRating rating={customerRating} label="Client"/>
                    <CardStarRating rating={peerRating} label="Peer"/>
                </div>
            </div>
            <div className="bg-blue-800/50 rounded-lg border border-white/50 overflow-hidden mb-2">
                <StatRow label="Experience" value={`${experience} YRS`} />
                <StatRow label="Day Rate" value={`${currency}${minDayRate}-${maxDayRate}`} />
                {hasPaidFeatures ? (
                    <>
                        <StatRow label="Top Skill Score" value={topSkillScore} />
                        <StatRow label="Top Skill" value={topSkillName} />
                    </>
                ) : (
                     <>
                        <StatRow label="Availability" value={new Date(profile.availability).toLocaleDateString('en-GB', {day: '2-digit', month: 'short'})} />
                        <StatRow label="Based In" value={location.split(',')[0]} />
                    </>
                )}
                <StatRow label="Peer Rating" value={`${peerRating || 0} / 5`} />
                <StatRow label="Client Rating" value={`${customerRating || 0} / 5`} />
            </div>
             {badges.length > 0 && (
                <div className="mb-1">
                    <h3 className="text-center font-bold uppercase text-xs text-yellow-400 tracking-wider mb-1">Achievements</h3>
                    <div className="flex justify-center flex-wrap gap-1">
                        {badges.slice(0, 3).map(badge => <BadgeDisplay key={badge.id} badge={badge} />)}
                    </div>
                </div>
            )}
            <div>
                 <h3 className="text-center font-bold uppercase text-xs text-yellow-400 tracking-wider mb-1">Profile File</h3>
                 <p className="text-xs text-blue-200 bg-black/20 p-1.5 rounded-md h-12 overflow-y-auto custom-scrollbar">{description}</p>
            </div>
            <p className="text-center text-xs text-blue-300 mt-1 opacity-70">Click to flip for more details</p>
             {tierBadge && (
                <div className="absolute -top-3 -right-3 transform rotate-12">
                     <span className={`${tierBadge.color} text-blue-900 text-xs font-black px-2 py-0.5 rounded-full uppercase shadow-lg`}>
                        {tierBadge.text}
                    </span>
                </div>
            )}
        </div>
    );
};

const CardBack = ({ profile }: { profile: EngineerProfile }) => {
    const hasSkillsFeatures = profile.profileTier === ProfileTier.SKILLS || profile.profileTier === ProfileTier.BUSINESS;

    const readinessFlags = [
        { key: 'hasOwnTransport', label: 'Own Transport' },
        { key: 'hasOwnTools', label: 'Own Tools' },
        { key: 'powerToolCompetency', label: 'Power Tool Competency' },
        { key: 'cscsCard', label: 'CSCS Card' },
        { key: 'siteSafe', label: 'Site Safety Certs' },
        { key: 'accessEquipmentTrained', label: 'Access Equipment Trained' },
        { key: 'firstAidTrained', label: 'First Aid Trained' },
        { key: 'carriesSpares', label: 'Carries Spares' },
        { key: 'ownPPE', label: 'Own PPE' },
    ];
    
    const positiveReadiness = readinessFlags.filter(flag => profile.compliance?.[flag.key as keyof Compliance]);

    return (
        <div className="font-sans w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl border-2 border-white shadow-2xl p-2 flex flex-col">
            <div className="text-center border-b-2 border-blue-400 pb-1 mb-1">
                <h2 className="text-lg font-black uppercase tracking-tighter">{profile.name}</h2>
                <p className="text-xs font-semibold text-gray-300">Detailed Profile</p>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-1 text-xs">
                
                {/* WORK READINESS - VISIBLE FOR ALL */}
                <div>
                    <h3 className="font-bold text-blue-300 uppercase text-xs flex items-center mb-1"><ShieldCheck size={14} className="mr-1.5"/> Work Readiness</h3>
                     <div className="bg-black/30 p-1.5 rounded-md">
                        <div className="flex justify-around text-center border-b border-gray-600 pb-1 mb-1">
                            <div className="text-[10px]">
                                <span className="block font-bold">Prof. Indemnity</span>
                                {profile.compliance?.professionalIndemnity ? <span className="text-green-400">Covered</span> : <span className="text-red-400">Not Covered</span>}
                            </div>
                            <div className="text-[10px]">
                                <span className="block font-bold">Public Liability</span>
                                {profile.compliance?.publicLiability ? <span className="text-green-400">Covered</span> : <span className="text-red-400">Not Covered</span>}
                            </div>
                        </div>
                        <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs mt-1">
                            {positiveReadiness.map(flag => (
                                <li key={flag.key} className="flex items-center">
                                    <CheckCircle size={12} className="mr-1 text-green-400 flex-shrink-0" />
                                    {flag.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {hasSkillsFeatures && profile.selectedJobRoles && profile.selectedJobRoles.length > 0 ? (
                    <div>
                        <h3 className="font-bold text-blue-300 uppercase text-xs flex items-center mb-1"><Briefcase size={14} className="mr-1.5"/> Specialist Roles</h3>
                        <div className="space-y-1">
                            {profile.selectedJobRoles?.map(role => (
                                <div key={role.roleName} className="bg-black/30 p-1.5 rounded-md flex justify-between items-center">
                                    <span className="font-semibold text-xs">{role.roleName}</span>
                                    <span className="font-bold text-base bg-blue-400 text-gray-900 px-1.5 rounded-sm">{role.overallScore}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-2 bg-black/20 rounded-md">
                        <p className="text-xs">Upgrade to a "Gold Profile" to display specialist roles and detailed skill ratings.</p>
                    </div>
                )}

                {profile.certifications.length > 0 && (
                     <div>
                        <h3 className="font-bold text-blue-300 uppercase text-xs flex items-center mb-1"><Award size={14} className="mr-1.5"/> Certifications</h3>
                        <ul className="list-disc list-inside bg-black/30 p-1.5 rounded-md text-xs">
                            {profile.certifications.map(cert => 
                                <li key={cert.name} className="flex items-center">
                                    {cert.name} 
                                    {cert.verified && <span title="Verified"><CheckCircle size={12} className="ml-1 text-green-400 flex-shrink-0" /></span>}
                                </li>
                            )}
                        </ul>
                    </div>
                )}
                 {profile.caseStudies && profile.caseStudies.length > 0 && (
                     <div>
                        <h3 className="font-bold text-blue-300 uppercase text-xs flex items-center mb-1"><Briefcase size={14} className="mr-1.5"/> Case Studies</h3>
                        <ul className="list-disc list-inside bg-black/30 p-1.5 rounded-md text-xs">
                            {profile.caseStudies.map(cs => <li key={cs.id}><a href={cs.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{cs.name}</a></li>)}
                        </ul>
                    </div>
                )}

                <div>
                    <h3 className="font-bold text-blue-300 uppercase text-xs flex items-center mb-1">Contact</h3>
                    <div className="flex justify-around bg-black/30 p-1.5 rounded-md">
                         <a href={`mailto:${profile.contact.email}`} className="flex items-center gap-1 hover:text-blue-300 transition-colors text-xs"><Mail size={14}/> Email</a>
                         <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-300 transition-colors text-xs"><Linkedin size={14}/> LinkedIn</a>
                    </div>
                </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-1 opacity-70">Click to flip back</p>
        </div>
    );
};


export const TopTrumpCard = ({ profile, isEditable, onEdit }: { profile: EngineerProfile, isEditable?: boolean, onEdit?: () => void }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    
    if (!profile) return null;
    
    return (
        <div
            className={`flip-card max-w-sm mx-auto h-[660px] cursor-pointer transform hover:scale-[1.02] transition-transform duration-300 ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <CardFront profile={profile} isEditable={isEditable} onEdit={onEdit} />
                </div>
                <div className="flip-card-back">
                    <CardBack profile={profile} />
                </div>
            </div>
        </div>
    );
};