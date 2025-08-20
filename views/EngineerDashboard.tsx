
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { SkillProfile, Engineer, Certification } from '../types';
import { Star, PlusCircle, MapPin, Edit, X, Save, UploadCloud, Paperclip } from 'lucide-react';
import { EditSkillProfileModal } from '../components/EditSkillProfileModal';
import { Calendar } from '../components/Calendar';


// A generic component for rendering a detail row, handling edit mode.
const DetailItem: React.FC<{
    label: string;
    value?: string | null;
    isEditing: boolean;
    onChange: (value: string) => void;
    href?: string;
    placeholder?: string;
}> = ({ label, value, isEditing, onChange, href, placeholder }) => (
    <div className="grid grid-cols-3 gap-4 text-sm">
        <span className="font-semibold text-gray-600 col-span-1">{label}</span>
        <div className="text-gray-800 col-span-2">
            {isEditing ? (
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder || label}
                    className="w-full p-1 border border-gray-300 rounded-md"
                />
            ) : (
                href && value ? <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{value}</a> : (value || '—')
            )}
        </div>
    </div>
);

// A specific component for boolean "Yes/No" compliance items with an upload link.
const UploadItem: React.FC<{
    label: string;
    value: boolean;
    isEditing: boolean;
    onChange: (value: boolean) => void;
}> = ({ label, value, isEditing, onChange }) => (
    <div className="grid grid-cols-3 gap-4 text-sm items-center">
        <span className="font-semibold text-gray-600 col-span-2">{label}</span>
        <div className="flex items-center justify-between col-span-1">
             {isEditing ? (
                <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
            ) : (
                <span className={value ? 'text-green-600 font-semibold' : 'text-gray-500'}>{value ? 'Yes' : 'No'}</span>
            )}
             {value && (
                <a href="#" className="text-xs text-blue-600 hover:underline flex items-center" onClick={(e) => e.preventDefault()}>
                    <Paperclip size={12} className="mr-1" />
                    Upload
                </a>
             )}
        </div>
    </div>
);

const RatingDisplay: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
        ))}
    </div>
);

// SkillProfileCard now includes an Edit button
const SkillProfileCard: React.FC<{ profile: SkillProfile; currency: string; onEdit: () => void; }> = ({ profile, currency, onEdit }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-gray-800">{profile.roleTitle}</h3>
                <span className={profile.isPremium ? 'text-blue-600 text-lg font-semibold' : 'text-gray-500 text-lg font-semibold'}>
                    {currency}{profile.dayRate}/day
                </span>
            </div>
            <button onClick={onEdit} className="flex items-center text-sm bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-lg hover:bg-gray-300 transition-colors">
                <Edit size={14} className="mr-2"/> Edit
            </button>
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


export const EngineerDashboard: React.FC = () => {
    const { currentUser, currency, jobs, getCompanyById, updateEngineer } = useAppContext();
    const currentEngineer = currentUser as Engineer;

    const [isEditing, setIsEditing] = useState(false);
    const [draftEngineer, setDraftEngineer] = useState<Engineer>(currentEngineer);
    const [editingProfile, setEditingProfile] = useState<SkillProfile | null>(null);

    useEffect(() => {
        setDraftEngineer(currentEngineer);
    }, [currentEngineer]);
    
    const handleProfileChange = (key: keyof Engineer, value: any) => {
        setDraftEngineer(prev => ({ ...prev!, [key]: value }));
    }

    const handleCertificationChange = (id: string, achieved: boolean) => {
        const updatedCerts = draftEngineer.certifications.map(cert => 
            cert.id === id ? { ...cert, achieved } : cert
        );
        handleProfileChange('certifications', updatedCerts);
    };
    
    const handleSaveChanges = () => {
        const updatedEngineer = {...draftEngineer, name: `${draftEngineer.firstName} ${draftEngineer.surname}`}
        updateEngineer(updatedEngineer);
        setIsEditing(false);
    }
    
    const handleCancelChanges = () => {
        setDraftEngineer(currentEngineer);
        setIsEditing(false);
    }

    const handleSaveSkillProfile = (updatedProfile: SkillProfile) => {
        // Check if it's a new profile by checking its existence in the original currentEngineer object
        const isNewProfile = !currentEngineer.skillProfiles.some(p => p.id === updatedProfile.id);

        let updatedProfiles;
        if (isNewProfile) {
            // Add new profile to the existing list
            updatedProfiles = [...currentEngineer.skillProfiles, updatedProfile];
        } else {
            // Update existing profile in the list
            updatedProfiles = currentEngineer.skillProfiles.map(p => 
                p.id === updatedProfile.id ? updatedProfile : p
            );
        }
        
        // Create the fully updated engineer object
        const updatedEngineer = {
            ...currentEngineer,
            skillProfiles: updatedProfiles
        };

        // Persist the changes to the global state, which will trigger a re-render
        updateEngineer(updatedEngineer);
        setEditingProfile(null); // Close modal
    };

    const handleAddNewProfile = () => {
        const newProfile: SkillProfile = {
            id: `sp_${Date.now()}`,
            roleTitle: '', // Empty so the dropdown shows the placeholder
            dayRate: 250,
            skills: [],
            customSkills: [],
            isPremium: true,
        };
        setEditingProfile(newProfile);
    };

    const handleDateClick = (date: string) => {
        if (!isEditing) return;
        const currentAvailability = draftEngineer.availability || [];
        const newAvailability = currentAvailability.includes(date)
            ? currentAvailability.filter(d => d !== date)
            : [...currentAvailability, date].sort();
        
        handleProfileChange('availability', newAvailability);
    };

    if (!currentEngineer) {
        return <div>Loading engineer profile...</div>;
    }

    const engineerRoles = new Set(currentEngineer.skillProfiles.map(p => p.roleTitle));
    engineerRoles.add('Basic Engineer');
    const matchedJobs = jobs.filter(job => engineerRoles.has(job.roleTitle));

    return (
        <>
             {editingProfile && (
                <EditSkillProfileModal
                    profile={editingProfile}
                    onClose={() => setEditingProfile(null)}
                    onSave={handleSaveSkillProfile}
                    currency={currency}
                />
            )}

             <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-8 border border-gray-200">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <img src={draftEngineer.profileImageUrl} alt={draftEngineer.name} className="h-28 w-28 rounded-full object-cover" />
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{draftEngineer.firstName} {draftEngineer.surname}</h1>
                            {isEditing ? (
                                 <input type="text" value={draftEngineer.tagline} onChange={(e) => handleProfileChange('tagline', e.target.value)} className="text-lg text-gray-700 mt-1 border-b-2 p-1 w-full"/>
                            ) : (
                                <p className="text-lg text-gray-700 mt-1">{draftEngineer.tagline}</p>
                            )}
                        </div>
                    </div>
                     <div>
                        {isEditing ? (
                            <div className="flex space-x-2 mt-4 sm:mt-0">
                                <button onClick={handleCancelChanges} className="flex items-center bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                    <X size={20} className="mr-2" /> Cancel
                                </button>
                                <button onClick={handleSaveChanges} className="flex items-center bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                                    <Save size={20} className="mr-2" /> Save
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0">
                                <Edit size={20} className="mr-2" /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
                {/* Bio Section */}
                <div className="mt-6">
                    {isEditing ? (
                         <textarea value={draftEngineer.bio} onChange={(e) => handleProfileChange('bio', e.target.value)} className="w-full text-gray-600 border-2 p-2 rounded-md"/>
                    ) : (
                        <p className="text-gray-600">{draftEngineer.bio}</p>
                    )}
                </div>
                <hr className="my-6 border-gray-200"/>
                {/* Two-Column Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    {/* Left Column */}
                    <div className="space-y-3">
                        <DetailItem label="Title" value={draftEngineer.title} isEditing={isEditing} onChange={v => handleProfileChange('title', v)} />
                        <DetailItem label="First Name" value={draftEngineer.firstName} isEditing={isEditing} onChange={v => handleProfileChange('firstName', v)} />
                        <DetailItem label="Middle Name" value={draftEngineer.middleName} isEditing={isEditing} onChange={v => handleProfileChange('middleName', v)} />
                        <DetailItem label="Surname" value={draftEngineer.surname} isEditing={isEditing} onChange={v => handleProfileChange('surname', v)} />
                        <DetailItem label="Company Name" value={draftEngineer.companyName} isEditing={isEditing} onChange={v => handleProfileChange('companyName', v)} />
                        <DetailItem label="Travel Radius" value={draftEngineer.travelRadius} isEditing={isEditing} onChange={v => handleProfileChange('travelRadius', v)} />
                        <hr className="my-3 border-gray-200"/>
                        <DetailItem label="Email Address" value={draftEngineer.email} isEditing={isEditing} onChange={v => handleProfileChange('email', v)} href={`mailto:${draftEngineer.email}`} />
                        <DetailItem label="Mobile" value={draftEngineer.mobile} isEditing={isEditing} onChange={v => handleProfileChange('mobile', v)} href={`tel:${draftEngineer.mobile}`} />
                        <DetailItem label="Website" value={draftEngineer.website} isEditing={isEditing} onChange={v => handleProfileChange('website', v)} href={`https://${draftEngineer.website}`} />
                        <DetailItem label="LinkedIn" value={draftEngineer.linkedin} isEditing={isEditing} onChange={v => handleProfileChange('linkedin', v)} href={`https://${draftEngineer.linkedin}`}/>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-3">
                        <UploadItem label="Professional Indemnity Insurance" value={draftEngineer.professionalIndemnityInsurance} isEditing={isEditing} onChange={v => handleProfileChange('professionalIndemnityInsurance', v)} />
                        <UploadItem label="Public Liability Insurance" value={draftEngineer.publicLiabilityInsurance} isEditing={isEditing} onChange={v => handleProfileChange('publicLiabilityInsurance', v)} />
                        <hr className="my-3 border-gray-200"/>
                        <h4 className="font-semibold text-gray-600 text-sm">Certifications & Training</h4>
                        {draftEngineer.certifications.map(cert => (
                             <UploadItem key={cert.id} label={cert.name} value={cert.achieved} isEditing={isEditing} onChange={v => handleCertificationChange(cert.id, v)} />
                        ))}
                        <hr className="my-3 border-gray-200"/>
                        <div className="grid grid-cols-3 gap-4 text-sm items-center">
                            <span className="font-semibold text-gray-600 col-span-1">Customer Rating</span>
                            <div className="text-gray-800 col-span-2"><RatingDisplay rating={draftEngineer.customerRating} /></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm items-center">
                            <span className="font-semibold text-gray-600 col-span-1">Peer Rating</span>
                            <div className="text-gray-800 col-span-2"><RatingDisplay rating={draftEngineer.peerRating} /></div>
                        </div>
                    </div>
                </div>
             </div>

            {/* Availability Calendar */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">My Availability</h2>
                <p className="text-sm text-gray-600 mb-4">
                    {isEditing 
                        ? "Click on dates to toggle your availability. Changes will be saved when you click the 'Save' button." 
                        : "This is your current availability calendar. Click 'Edit Profile' to make changes."}
                </p>
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <Calendar 
                        highlightedDates={draftEngineer.availability} 
                        onDateClick={handleDateClick}
                        readOnly={!isEditing}
                    />
                </div>
            </div>

            {/* Existing Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">My Skill Profiles</h2>
                        <button onClick={handleAddNewProfile} className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            <PlusCircle size={20} className="mr-2" />
                            Add New Profile
                        </button>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                             <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-gray-800">Basic Engineer Profile</h3>
                                <span className="text-lg font-semibold text-gray-500">
                                    {currency}{currentEngineer.baseDayRate}/day
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Your default profile for general tech support tasks. This profile uses your core certifications and is visible to all companies.</p>
                        </div>

                        {currentEngineer.skillProfiles.map(profile => (
                            <SkillProfileCard 
                                key={profile.id} 
                                profile={profile} 
                                currency={currency}
                                onEdit={() => setEditingProfile(profile)}
                            />
                        ))}
                    </div>
                </div>

                <div className="md:col-span-1">
                     <h2 className="text-2xl font-bold text-gray-800 mb-6">Incoming Job Offers</h2>
                     <div className="space-y-4">
                        {matchedJobs.length > 0 ? (
                            matchedJobs.map(job => {
                                const company = getCompanyById(job.companyId);
                                return (
                                    <div key={job.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                                        <h4 className="font-bold text-gray-800">{job.title}</h4>
                                        <p className="text-sm text-gray-600">{company?.name} - {job.location}</p>
                                        <div className="flex justify-end mt-2 space-x-2">
                                            <button className="text-xs font-semibold border border-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100">Decline</button>

                                            <button className="text-xs font-semibold bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">Accept</button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center">
                                <p className="text-gray-500">No job offers matching your profiles at the moment.</p>
                            </div>
                        )}
                     </div>
                </div>
            </div>
        </>
    );
};
