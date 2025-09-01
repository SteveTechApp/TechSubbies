import React, { useState } from 'react';
import { EngineerProfile, Compliance, ProfileTier } from '../types/index.ts';
import { Star, Briefcase, Award, Linkedin, Mail, Users, Calendar, MapPin, ShieldCheck, CheckCircle, BarChart, Edit } from './Icons.tsx';

// A simple component to render a star rating on the card
const CardStarRating = ({ rating = 0, label }: { rating?: number, label: string }) => (
    <div className="flex items-center gap-2">
        <span className="font-bold text-sm">{label}</span>
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={` ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} />
            ))}
        </div>
    </div>
);

// Stat row component for the card
const StatRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center py-2 px-3 odd:bg-white/10 even:bg-black/10">
        <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
        <span className="text-lg font-black bg-white text-blue-900 px-3 py-0.5 rounded-sm shadow-inner">{value}</span>
    </div>
);


const CardFront = ({ profile, isEditable, onEdit }: { profile: EngineerProfile, isEditable?: boolean, onEdit?: () => void }) => {
    const {
        name, discipline, avatar, experience, dayRate, currency,
        customerRating, peerRating, location, description, profileTier
    } = profile;

    const TIER_BADGE_INFO = {
        [ProfileTier.BASIC]: null,
        [ProfileTier.PROFESSIONAL]: { text: "Professional", color: "bg-green-400" },
        [ProfileTier.SKILLS]: { text: "Skills Profile", color: "bg-yellow-400" },
        [ProfileTier.BUSINESS]: { text: "Business", color: "bg-purple-400" },
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
        <div className={`font-sans w-full h-full bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl border-8 ${borderClass} shadow-2xl p-4 transform transition-all duration-300 relative`}>
            {isEditable && (
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
                    className="absolute top-3 right-3 z-20 flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 shadow-lg border border-white/30"
                    aria-label="Edit Public Profile"
                >
                    <Edit size={14} className="mr-1.5" /> Edit Profile
                </button>
            )}
            <div className="text-center border-b-4 border-yellow-400 pb-2 mb-3">
                <div className="flex justify-center items-center gap-3">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">{name}</h1>
                    <span className="text-2xl">{countryFlag}</span>
                </div>
                <p className="text-sm font-semibold text-blue-200">{discipline}</p>
            </div>
            <div className="relative w-full aspect-[4/3] bg-blue-800 rounded-lg overflow-hidden border-4 border-white mb-3">
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
                 <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full flex flex-col items-center gap-1">
                    <CardStarRating rating={customerRating} label="Client"/>
                    <CardStarRating rating={peerRating} label="Peer"/>
                </div>
            </div>
            <div className="bg-blue-800/50 rounded-lg border-2 border-white/50 overflow-hidden mb-4">
                <StatRow label="Experience" value={`${experience} YRS`} />
                <StatRow label="Day Rate" value={`${currency}${dayRate}`} />
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
            <div>
                 <h3 className="text-center font-bold uppercase text-yellow-400 tracking-wider mb-1">Profile File</h3>
                 <p className="text-xs text-blue-200 bg-black/20 p-2 rounded-md h-20 overflow-y-auto custom-scrollbar">{description}</p>
            </div>
            <p className="text-center text-xs text-blue-300 mt-2 opacity-70">Click to flip for more details</p>
             {tierBadge && (
                <div className="absolute -top-5 -right-5 transform rotate-12">
                     <span className={`${tierBadge.color} text-blue-900 text-xs font-black px-4 py-2 rounded-full uppercase shadow-lg`}>
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
        <div className="font-sans w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl border-8 border-white shadow-2xl p-4 flex flex-col">
            <div className="text-center border-b-2 border-blue-400 pb-2 mb-3">
                <h2 className="text-2xl font-black uppercase tracking-tighter">{profile.name}</h2>
                <p className="text-sm font-semibold text-gray-300">Detailed Profile</p>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-3 text-sm">
                
                {/* WORK READINESS - VISIBLE FOR ALL */}
                <div>
                    <h3 className="font-bold text-blue-300 uppercase flex items-center mb-1"><ShieldCheck size={16} className="mr-2"/> Work Readiness</h3>
                     <div className="bg-black/30 p-2 rounded-md">
                        <div className="flex justify-around text-center border-b border-gray-600 pb-1 mb-1">
                            <div className="text-xs">
                                <span className="block font-bold">Prof. Indemnity</span>
                                {profile.compliance?.professionalIndemnity ? <span className="text-green-400">Covered</span> : <span className="text-red-400">Not Covered</span>}
                            </div>
                            <div className="text-xs">
                                <span className="block font-bold">Public Liability</span>
                                {profile.compliance?.publicLiability ? <span className="text-green-400">Covered</span> : <span className="text-red-400">Not Covered</span>}
                            </div>
                        </div>
                        <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mt-1">
                            {positiveReadiness.map(flag => (
                                <li key={flag.key} className="flex items-center">
                                    <CheckCircle size={12} className="mr-1.5 text-green-400 flex-shrink-0" />
                                    {flag.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {hasSkillsFeatures && profile.selectedJobRoles && profile.selectedJobRoles.length > 0 ? (
                    <div>
                        <h3 className="font-bold text-blue-300 uppercase flex items-center mb-1"><Briefcase size={16} className="mr-2"/> Specialist Roles</h3>
                        <div className="space-y-2">
                            {profile.selectedJobRoles?.map(role => (
                                <div key={role.roleName} className="bg-black/30 p-2 rounded-md flex justify-between items-center">
                                    <span className="font-semibold">{role.roleName}</span>
                                    <span className="font-bold text-lg bg-blue-400 text-gray-900 px-2 rounded-sm">{role.overallScore}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-4 bg-black/20 rounded-md">
                        <p>Upgrade to a "Skills Profile" to display specialist roles and detailed skill ratings.</p>
                    </div>
                )}

                {profile.certifications.length > 0 && (
                     <div>
                        <h3 className="font-bold text-blue-300 uppercase flex items-center mb-1"><Award size={16} className="mr-2"/> Certifications</h3>
                        <ul className="list-disc list-inside bg-black/30 p-2 rounded-md">
                            {profile.certifications.map(cert => 
                                <li key={cert.name} className="flex items-center">
                                    {cert.name} 
                                    {cert.verified && <span title="Verified"><CheckCircle size={12} className="ml-1.5 text-green-400 flex-shrink-0" /></span>}
                                </li>
                            )}
                        </ul>
                    </div>
                )}
                 {profile.caseStudies && profile.caseStudies.length > 0 && (
                     <div>
                        <h3 className="font-bold text-blue-300 uppercase flex items-center mb-1"><Briefcase size={16} className="mr-2"/> Case Studies</h3>
                        <ul className="list-disc list-inside bg-black/30 p-2 rounded-md">
                            {profile.caseStudies.map(cs => <li key={cs.id}><a href={cs.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{cs.name}</a></li>)}
                        </ul>
                    </div>
                )}

                <div>
                    <h3 className="font-bold text-blue-300 uppercase flex items-center mb-1">Contact</h3>
                    <div className="flex justify-around bg-black/30 p-2 rounded-md">
                         <a href={`mailto:${profile.contact.email}`} className="flex items-center gap-2 hover:text-blue-300 transition-colors"><Mail size={18}/> Email</a>
                         <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-300 transition-colors"><Linkedin size={18}/> LinkedIn</a>
                    </div>
                </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2 opacity-70">Click to flip back</p>
        </div>
    );
};


export const TopTrumpCard = ({ profile, isEditable, onEdit }: { profile: EngineerProfile, isEditable?: boolean, onEdit?: () => void }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    
    if (!profile) return null;
    
    // The card needs a static height to flip correctly. We'll set it based on a typical aspect ratio.
    // max-w-sm is 384px. A good card height would be around 1.4 times that. 384 * 1.5 = 576. Let's aim higher to be safe.
    // The content will dictate the final height, but we need a container with a fixed height for the flip.
    // Let's have the container calculate its height and apply it. This is tricky without JS.
    // A simpler way is to give it a generous min-height.
    // The current front card is about 820px tall on my screen. Let's set a min-height.

    return (
        <div
            className={`flip-card max-w-sm mx-auto h-[830px] cursor-pointer transform hover:scale-[1.02] transition-transform duration-300 ${isFlipped ? 'flipped' : ''}`}
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
