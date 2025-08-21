import React from 'react';
import { EngineerProfile, CURRENCY_ICONS, Currency } from '../context/AppContext.tsx';
import { ProfileHeader } from '../components/ProfileHeader.tsx';
import { StatCard } from '../components/StatCard.tsx';
import { 
    BarChart, CheckCircle, Award, ShieldCheck, Mail, Phone, Globe, Linkedin
} from '../components/Icons.tsx';

interface EngineerProfileViewProps {
    profile: EngineerProfile | null;
    isEditable: boolean;
    onEdit: () => void;
}

export const EngineerProfileView = ({ profile, isEditable, onEdit }: EngineerProfileViewProps) => {
    if (!profile) return <div>Loading profile...</div>;

    const { name, tagline, location, currency, dayRate, experience, skills, description, avatar, certifications, contact } = profile;
    const CurrencyIcon = CURRENCY_ICONS[currency as Currency] || CURRENCY_ICONS[Currency.GBP];

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg relative">
            <ProfileHeader name={name} tagline={tagline} location={location} avatar={avatar} isEditable={isEditable} onEdit={onEdit} profileTier={profile.profileTier} />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
                <StatCard icon={CurrencyIcon} label="Day Rate" value={`${currency}${dayRate}`} />
                <StatCard icon={BarChart} label="Experience" value={`${experience} Years`} />
                <StatCard icon={CheckCircle} label="Skills" value={skills.length} />
                <StatCard icon={Award} label="Certs" value={certifications.length} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold mb-4 border-b pb-2">About Me</h3>
                    <p className="text-gray-700 whitespace-pre-line">{String(description || '')}</p>
                    
                    <h3 className="text-2xl font-bold mt-8 mb-4 border-b pb-2">Skills</h3>
                    <div className="flex flex-wrap gap-4">
                        {skills.map(skill => (
                            <div key={skill.name} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md">
                                <span className="font-semibold">{skill.name}</span>
                                <div className="w-full bg-blue-200 rounded-full h-2.5 mt-1">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${skill.rating * 20}%` }}
                                        aria-label={`Skill rating: ${skill.rating} out of 5`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-1">
                    <h3 className="text-2xl font-bold mb-4 border-b pb-2">Certifications</h3>
                    <ul className="space-y-3">
                        {certifications.map(cert => {
                            const iconClass = cert.verified ? 'text-green-500' : 'text-gray-400';
                            const ariaLabel = cert.verified ? "Verified" : "Not Verified";
                            return (
                                <li key={cert.name} className="flex items-center">
                                    <ShieldCheck size={20} className={iconClass} aria-label={ariaLabel} />
                                    <span className="ml-2">{cert.name}</span>
                                </li>
                            );
                        })}
                    </ul>

                    <h3 className="text-2xl font-bold mt-8 mb-4 border-b pb-2">Contact</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center"><Mail size={16} className="mr-2" /> <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a></li>
                        <li className="flex items-center"><Phone size={16} className="mr-2" /> {contact.phone}</li>
                        <li className="flex items-center"><Globe size={16} className="mr-2" /> <a href={contact.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Website</a></li>
                        <li className="flex items-center"><Linkedin size={16} className="mr-2" /> <a href={contact.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">LinkedIn</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};