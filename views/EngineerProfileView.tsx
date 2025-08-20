

import React from 'react';
import { useAppContext } from '../context/AppContext';
import { SkillProfile } from '../types';
import { Star, ArrowLeft, Briefcase, Award, ShieldCheck, Calendar, MapPin, CheckCircle, Mail, Phone, Globe, Linkedin, Users } from 'lucide-react';
import { Calendar as AvailabilityCalendar } from '../components/Calendar';

const RatingDisplay: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
        ))}
    </div>
);

const DetailItem: React.FC<{ icon: React.ElementType, label: string; value?: string | React.ReactNode, href?: string }> = ({ icon: Icon, label, value, href }) => {
    const content = <div className="flex items-center space-x-3">
        <Icon className="h-6 w-6 text-blue-600 flex-shrink-0" />
        <div>
            <p className="text-sm font-semibold text-gray-800">{value || '—'}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    </div>;

    if (href && value) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity">{content}</a>;
    }
    return content;
};


const ComplianceItem: React.FC<{ label: string; value: boolean }> = ({ label, value }) => (
    <div className="flex items-center text-sm">
        <CheckCircle className={`h-5 w-5 mr-2 ${value ? 'text-green-500' : 'text-gray-300'}`} />
        <span className={value ? 'text-gray-700' : 'text-gray-500'}>{label}</span>
    </div>
);


const SkillProfileCard: React.FC<{ profile: SkillProfile; currency: string; }> = ({ profile, currency }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-full">
        <div>
            <h3 className="text-xl font-bold text-gray-800">{profile.roleTitle}</h3>
            <span className='text-blue-600 text-lg font-semibold'>
                {currency}{profile.dayRate}/day
            </span>
        </div>
        <div className="mt-4">
            <h4 className="font-semibold text-gray-600 mb-2">Self-Assessed Skills:</h4>
            <ul className="space-y-2">
                {profile.skills.map(skill => (
                    <li key={skill.id} className="flex justify-between items-center text-sm">
                        <span>{skill.name}</span>
                        <RatingDisplay rating={skill.rating} />
                    </li>
                ))}
            </ul>
        </div>
        {profile.customSkills.length > 0 && (
            <div className="mt-4">
                <h4 className="font-semibold text-gray-600 mb-2">Specialties:</h4>
                <div className="flex flex-wrap gap-2">
                    {profile.customSkills.map(skill => (
                        <span key={skill} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                    ))}
                </div>
            </div>
        )}
    </div>
);


export const EngineerProfileView: React.FC = () => {
    const { viewingEngineer: engineer, setViewingEngineer, currency } = useAppContext();

    if (!engineer) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Engineer profile not found.</p>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                 <button 
                    onClick={() => setViewingEngineer(null)} 
                    className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2"/>
                    Back to Search Results
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <img src={engineer.profileImageUrl} alt={engineer.name} className="h-32 w-32 rounded-full object-cover border-4 border-gray-100" />
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{engineer.name}</h1>
                            <p className="text-lg text-gray-700 mt-1">{engineer.tagline}</p>
                            <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2 text-gray-500">
                                <MapPin size={16} />
                                <span>{engineer.location}</span>
                            </div>
                        </div>
                    </div>
                     <div className="mt-4 sm:mt-0 self-center sm:self-start">
                        <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto">
                            Contact Engineer
                        </button>
                    </div>
                </div>

                {/* Availability Calendar */}
                <div className="mt-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Availability</h2>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <AvailabilityCalendar 
                            highlightedDates={engineer.availability} 
                            readOnly={true}
                        />
                    </div>
                </div>

                 {/* Bio Section */}
                <div className="mt-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">About Me</h2>
                    <p className="text-gray-600 whitespace-pre-wrap">{engineer.bio}</p>
                </div>
                <hr className="my-8 border-gray-200"/>

                {/* Two-Column Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Professional Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <DetailItem icon={Calendar} label="Years of Experience" value={`${engineer.yearsOfExperience} years`} />
                            <DetailItem icon={Briefcase} label="Company Name" value={engineer.companyName} />
                            <DetailItem icon={MapPin} label="Travel Radius" value={engineer.travelRadius} />
                            <DetailItem icon={Award} label="Customer Rating" value={<RatingDisplay rating={engineer.customerRating} />} />
                            <DetailItem icon={ShieldCheck} label="Peer Rating" value={<RatingDisplay rating={engineer.peerRating} />} />
                        </div>
                         <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mt-8">Contact</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                             <DetailItem icon={Mail} label="Email" value={engineer.email} href={`mailto:${engineer.email}`} />
                             <DetailItem icon={Phone} label="Mobile" value={engineer.mobile} href={`tel:${engineer.mobile}`} />
                             <DetailItem icon={Globe} label="Website" value={engineer.website} href={`https://${engineer.website}`} />
                             <DetailItem icon={Linkedin} label="LinkedIn" value={engineer.linkedin} href={`https://${engineer.linkedin}`} />
                         </div>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Compliance & Certifications</h3>
                        <div className="space-y-3">
                             <ComplianceItem label="Professional Indemnity Insurance" value={engineer.professionalIndemnityInsurance} />
                             <ComplianceItem label="Public Liability Insurance" value={engineer.publicLiabilityInsurance} />
                             <hr className="my-3 border-gray-200"/>
                             {engineer.certifications.map(cert => (
                                <ComplianceItem key={cert.id} label={cert.name} value={cert.achieved} />
                             ))}
                        </div>
                    </div>
                </div>
            </div>

             {/* Associates Section */}
            {engineer.associates && engineer.associates.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Trusted Associates</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {engineer.associates.map((associate, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 border border-gray-200 transform hover:scale-105 transition-transform duration-300">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    {associate.link ? (
                                        <a href={associate.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-800 hover:text-blue-600 hover:underline">
                                            {associate.name}
                                        </a>
                                    ) : (
                                        <p className="font-semibold text-gray-800">{associate.name}</p>
                                    )}
                                    <p className="text-sm text-gray-500">Peer Endorsed</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

             {/* Skill Profiles Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Skill Profiles & Day Rates</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     <div className="bg-gray-100 rounded-lg shadow-md p-6 border border-gray-200">
                         <h3 className="text-xl font-bold text-gray-800">Basic Engineer Profile</h3>
                         <span className="text-lg font-semibold text-gray-600">
                             {currency}{engineer.baseDayRate}/day
                         </span>
                         <p className="text-sm text-gray-600 mt-2">Default profile for general tech support tasks, visible to all companies.</p>
                     </div>
                     {engineer.skillProfiles.map(profile => (
                         <SkillProfileCard 
                             key={profile.id} 
                             profile={profile} 
                             currency={currency}
                         />
                     ))}
                 </div>
            </div>
        </div>
    );
};
