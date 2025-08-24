import React, { useState } from 'react';
import { EngineerProfile, Skill, SelectedJobRole } from '../context/AppContext.tsx';
import { Edit, UserCog, Briefcase, Mail, ShieldCheck } from '../components/Icons.tsx';
import { AccordionSection } from '../components/AccordionSection.tsx';

const InfoItem = ({ label, value, url }: { label: string, value?: string, url?: string }) => {
    if (!value) return null;

    const renderValue = () => {
        let targetUrl = url;
        if (!targetUrl) {
            if (value.includes('@')) targetUrl = `mailto:${value}`;
            else if (value.startsWith('www') || value.startsWith('linkedin')) targetUrl = `//${value}`;
        }
        
        const isLink = targetUrl || value.startsWith('social');

        if (isLink) {
            return <a href={targetUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{value}</a>;
        }
        return <span className="text-gray-800 break-words">{value}</span>;
    };

    return (
        <div className="flex items-baseline mb-2 text-sm">
            <span className="w-1/3 font-bold text-gray-700 flex-shrink-0">{label}</span>
            <div className="flex-grow">{renderValue()}</div>
        </div>
    );
};

const StarRating = ({ rating = 0, label }: { rating?: number, label: string }) => {
    return (
        <div className="flex items-baseline mb-2 text-sm">
            <span className="w-1/3 font-bold text-gray-700 flex-shrink-0">{label}</span>
            <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                    <svg key={index} className={`w-5 h-5 fill-current ${index < (rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                ))}
            </div>
        </div>
    );
};

const SkillBar = ({ name, rating }: Skill) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-gray-800">{name}</span>
            <span className="font-bold text-blue-600">{rating} / 100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${rating}%` }}></div>
        </div>
    </div>
);


export const EngineerProfileView = ({ profile, isEditable, onEdit }: { profile: EngineerProfile | null, isEditable: boolean, onEdit: () => void }) => {
    const [activeTab, setActiveTab] = useState(0);

    if (!profile) return <div>Loading profile...</div>;

    const {
        name, discipline, description, avatar, title, firstName, surname,
        companyName, travelRadius, contact, socials, associates, caseStudies,
        compliance, generalAvailability, customerRating, peerRating,
        skills, profileTier, selectedJobRoles, trialEndDate
    } = profile;

    const isOnTrial = profileTier === 'paid' && trialEndDate && new Date(trialEndDate) > new Date();

    const complianceItems = compliance ? [
        { label: 'Professional Indemnity', value: compliance.professionalIndemnity },
        { label: 'Public Liability', value: compliance.publicLiability },
        { label: 'Site Safe', value: compliance.siteSafe },
        { label: 'Own PPE', value: compliance.ownPPE },
        { label: 'Access Equipment Trained', value: compliance.accessEquipmentTrained },
        { label: 'First Aid Trained', value: compliance.firstAidTrained },
    ] : [];

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg relative font-sans max-w-4xl mx-auto">
             {isEditable && (
                <button
                    onClick={onEdit}
                    className="absolute top-6 right-6 flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 z-10"
                >
                    <Edit size={16} className="mr-2" /> Edit Profile
                </button>
            )}
            <div className="flex flex-col sm:flex-row items-start mb-6">
                {avatar && <img src={avatar} alt={name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg mr-6 object-cover flex-shrink-0" />}
                <div className="mt-4 sm:mt-0">
                    <div className="flex items-center gap-3 flex-wrap">
                         <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
                         <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${profileTier === 'paid' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
                           {profileTier === 'paid' ? `JOB PROFILE ${isOnTrial ? '(TRIAL)' : ''}` : 'BASIC PROFILE'}
                         </span>
                    </div>
                    <h2 className="text-lg md:text-xl text-gray-600 font-semibold mb-2">{discipline}</h2>
                    <p className="text-gray-700 text-sm md:text-base">{description}</p>
                </div>
            </div>

            <div className="space-y-2">
                <AccordionSection title="Specialist Roles & Core Skills" icon={UserCog} startOpen={profileTier === 'paid'}>
                    {profileTier === 'paid' && selectedJobRoles && selectedJobRoles.length > 0 ? (
                        <div>
                            <div className="flex border-b border-gray-200 -mb-px overflow-x-auto">
                                {selectedJobRoles.map((role, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTab(index)}
                                        className={`flex-shrink-0 py-3 px-4 font-semibold text-sm focus:outline-none transition-colors duration-200 ${
                                            activeTab === index
                                                ? 'border-b-2 border-blue-600 text-blue-600'
                                                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                                        }`}
                                        aria-current={activeTab === index ? 'page' : undefined}
                                    >
                                        {role.roleName} 
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                                            activeTab === index ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                            {role.overallScore}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <div className="pt-4">
                                {selectedJobRoles[activeTab] && (
                                    <div className="p-4 bg-gray-50 rounded-b-lg space-y-4">
                                        {selectedJobRoles[activeTab].skills.map(skill => (
                                            <SkillBar key={skill.name} name={skill.name} rating={skill.rating} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                         <div className="p-4 border-l-4 border-gray-300 bg-gray-50">
                            {skills && skills.length > 0 ? (
                                <div className="space-y-4">
                                    {skills.map(skill => (
                                        <SkillBar key={skill.name} name={skill.name} rating={skill.rating} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No core skills listed.</p>
                            )}
                            {profileTier === 'free' && 
                                <p className="text-xs text-center text-gray-500 mt-4">Upgrade to a Job Profile to add specialist roles and detailed skill ratings.</p>
                            }
                        </div>
                    )}
                </AccordionSection>
                
                <AccordionSection title="Case Studies / Portfolio" icon={Briefcase}>
                    {caseStudies && caseStudies.length > 0 ? (
                        <div className="space-y-3">
                            {caseStudies.map(study => (
                                <a href={study.url} target="_blank" rel="noopener noreferrer" key={study.id} className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                                    <p className="font-semibold text-blue-600">{study.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{study.url}</p>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic px-2">No case studies have been added yet.</p>
                    )}
                </AccordionSection>
                
                <AccordionSection title="Contact & Social Links" icon={Mail}>
                    {contact && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <InfoItem label="Email Address" value={contact.email} />
                            <InfoItem label="Mobile" value={contact.phone} />
                            <InfoItem label="Website" value={contact.website} />
                            <InfoItem label="LinkedIn" value={contact.linkedin} />
                            {socials && socials.map((social, i) => <InfoItem key={i} label={social.name} value={social.url} />)}
                        </div>
                    )}
                </AccordionSection>

                <AccordionSection title="Compliance & Professional Details" icon={ShieldCheck}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        <InfoItem label="Full Name" value={`${title || ''} ${firstName} ${surname}`} />
                        <InfoItem label="Company Name" value={companyName} />
                        <InfoItem label="Travel Radius" value={travelRadius} />
                        <InfoItem label="General availability" value={generalAvailability} />
                        <hr className="md:col-span-2 my-2"/>
                        {complianceItems.map((item, i) => (
                            <div key={i} className="flex items-baseline mb-2 text-sm">
                                <span className="w-1/3 font-bold text-gray-700 flex-shrink-0">{item.label}</span>
                                <span className={`font-semibold ${item.value ? 'text-green-600' : 'text-red-600'}`}>{item.value ? 'Yes' : 'No'}</span>
                            </div>
                        ))}
                         <hr className="md:col-span-2 my-2"/>
                        <StarRating label="Customer Rating" rating={customerRating} />
                        <StarRating label="Peer Rating" rating={peerRating} />
                         {associates && associates.length > 0 && (
                            <>
                                <hr className="md:col-span-2 my-2"/>
                                {associates.map((assoc, i) => <InfoItem key={i} label={assoc.name} value={assoc.value} url={assoc.url} />)}
                            </>
                        )}
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
};
