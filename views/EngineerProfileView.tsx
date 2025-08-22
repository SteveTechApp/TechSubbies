import React from 'react';
import { EngineerProfile, Skill, JobRoleSkills } from '../context/AppContext.tsx';
import { Edit } from '../components/Icons.tsx';

const InfoItem = ({ label, value, url }: { label: string, value?: string, url?: string }) => {
    if (!value) {
        return null;
    }

    if (value === '—') {
        return (
            <div className="flex items-baseline mb-2">
                <span className="w-48 font-bold text-gray-700 flex-shrink-0">{label}</span>
                <span className="text-gray-800">—</span>
            </div>
        );
    }

    const renderValue = () => {
        let targetUrl = url;
        if (!targetUrl) {
            if (value.includes('@')) targetUrl = `mailto:${value}`;
            else if (value.startsWith('www') || value.startsWith('linkedin')) targetUrl = `//${value}`;
        }
        
        const isLink = targetUrl || value.startsWith('social');

        if (isLink) {
            return <a href={targetUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{value}</a>;
        }
        return <span className="text-gray-800">{value}</span>;
    };

    return (
        <div className="flex items-baseline mb-2">
            <span className="w-48 font-bold text-gray-700 flex-shrink-0">{label}</span>
            <div className="flex-grow">{renderValue()}</div>
        </div>
    );
};

const StarRating = ({ rating = 0, label }: { rating?: number, label: string }) => {
    return (
        <div className="flex items-baseline mb-2">
            <span className="w-48 font-bold text-gray-700 flex-shrink-0">{label}</span>
            <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                    <svg key={index} className={`w-6 h-6 fill-current ${index < (rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20">
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

const SpecialistRoleSection = ({ role }: { role: JobRoleSkills }) => (
    <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">{role.roleName}</h4>
        <div className="space-y-4">
            {role.skills.map(skill => (
                <SkillBar key={skill.name} name={skill.name} rating={skill.rating} />
            ))}
        </div>
    </div>
);


export const EngineerProfileView = ({ profile, isEditable, onEdit }: { profile: EngineerProfile | null, isEditable: boolean, onEdit: () => void }) => {
    if (!profile) return <div>Loading profile...</div>;

    const {
        name, tagline, description, avatar, title, firstName, middleName, surname,
        companyName, travelRadius, contact, socials, associates, otherLinks,
        compliance, generalAvailability, customerRating, peerRating,
        googleCalendarLink, rightColumnLinks, skills, profileTier, specialistJobRoles
    } = profile;

    const complianceItems = compliance ? [
        { label: 'Professional Indemnity Insurance', value: compliance.professionalIndemnity },
        { label: 'Public Liability Insurance', value: compliance.publicLiability },
        { label: 'Site Safe', value: compliance.siteSafe },
        { label: 'Own PPE', value: compliance.ownPPE },
        { label: 'Access Equipment Trained', value: compliance.accessEquipmentTrained },
        { label: 'First Aid Trained', value: compliance.firstAidTrained },
    ] : [];

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg relative font-sans max-w-5xl mx-auto">
             {isEditable && (
                <button
                    onClick={onEdit}
                    className="absolute top-6 right-6 flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                    <Edit size={16} className="mr-2" /> Edit Profile
                </button>
            )}
            <div className="flex items-start mb-6">
                {avatar && <img src={avatar} alt={name} className="w-32 h-32 rounded-lg mr-8 object-cover" />}
                <div>
                    <div className="flex items-center gap-3">
                         <h1 className="text-4xl font-bold">{name}</h1>
                         <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${profileTier === 'paid' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
                           {profileTier === 'paid' ? 'JOB PROFILE' : 'BASIC PROFILE'}
                         </span>
                    </div>
                    <h2 className="text-xl text-gray-600 font-semibold mb-2">{tagline}</h2>
                    <p className="text-gray-700">{description}</p>
                </div>
            </div>

            <hr className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                {/* Left Column */}
                <div className="space-y-6">
                    <div>
                        <InfoItem label="Title" value={title} />
                        <InfoItem label="First Name" value={firstName} />
                        <InfoItem label="Middle Name" value={middleName} />
                        <InfoItem label="Surname" value={surname} />
                        <InfoItem label="Company Name" value={companyName} />
                        <InfoItem label="Travel Radius" value={travelRadius} />
                    </div>
                    <hr />
                    {contact && (
                        <div>
                            <InfoItem label="Email Address" value={contact.email} />
                            <InfoItem label="Telephone" value={contact.telephone} />
                            <InfoItem label="Mobile" value={contact.phone} />
                            <InfoItem label="Website" value={contact.website} />
                            <InfoItem label="LinkedIn" value={contact.linkedin} />
                            {socials && socials.length > 0 && (
                                <>
                                    {socials.map((social, i) => <InfoItem key={i} label={social.name} value={social.url} />)}
                                </>
                            )}
                        </div>
                    )}
                    
                    <hr />
                    {associates && associates.length > 0 && (
                        <div>
                            {associates.map((assoc, i) => <InfoItem key={i} label={assoc.name} value={assoc.value} url={assoc.url} />)}
                        </div>
                    )}
                    <hr />
                    {otherLinks && otherLinks.length > 0 && (
                        <div>
                            {otherLinks.map((link, i) => <InfoItem key={i} label={link.name} value={link.url} />)}
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6 mt-6 md:mt-0">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            {profileTier === 'paid' ? 'Specialist Job Roles' : 'Core Skills'}
                        </h3>
                        {profileTier === 'paid' && specialistJobRoles && specialistJobRoles.length > 0 ? (
                            specialistJobRoles.map((role, i) => <SpecialistRoleSection key={i} role={role} />)
                        ) : (
                            <div className="space-y-4">
                                {skills && skills.map(skill => (
                                    <SkillBar key={skill.name} name={skill.name} rating={skill.rating} />
                                ))}
                            </div>
                        )}
                    </div>
                    <hr />
                    <div>
                        {complianceItems.map((item, i) => (
                            <div key={i} className="flex items-baseline mb-2">
                                <span className="w-48 font-bold text-gray-700 flex-shrink-0">{item.label}</span>
                                <span className="text-blue-600 font-semibold">{item.value ? 'Yes' : 'No'}</span>
                            </div>
                        ))}
                    </div>
                    <hr />
                    <div>
                        <InfoItem label="General availability" value={generalAvailability} />
                        <StarRating label="Customer Rating" rating={customerRating} />
                        <StarRating label="Peer Rating" rating={peerRating} />
                        {googleCalendarLink && <div className="text-right pt-2"><a href="#" className="text-red-500 hover:underline">{googleCalendarLink}</a></div>}
                    </div>
                    <hr />
                    {rightColumnLinks && rightColumnLinks.length > 0 && (
                        <div>
                            {rightColumnLinks.map((link, i) => (
                                <InfoItem key={i} label={link.label} value={link.value} url={link.url} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};