import React from 'react';
import { useAppContext } from '../context/AppContext';
import { SkillProfile } from '../types';
import { Star, PlusCircle, MapPin, Wrench, Shield } from 'lucide-react';

const SkillRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
        ))}
    </div>
);

const SkillProfileCard: React.FC<{ profile: SkillProfile; currency: string }> = ({ profile, currency }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800">{profile.roleTitle}</h3>
            {/* Updated premium color */}
            <span className={`text-lg font-semibold ${profile.isPremium ? 'text-blue-600' : 'text-gray-500'}`}>
                {currency}{profile.dayRate}/day
            </span>
        </div>
        <div className="mt-4">
            <h4 className="font-semibold text-gray-600 mb-2">Core Skills:</h4>
            <ul className="space-y-2">
                {profile.skills.map(skill => (
                    <li key={skill.id} className="flex justify-between items-center text-sm">
                        <span>{skill.name}</span>
                        <SkillRating rating={skill.rating} />
                    </li>
                ))}
            </ul>
        </div>
        {profile.customSkills.length > 0 && (
            <div className="mt-4">
                <h4 className="font-semibold text-gray-600 mb-2">Specialties:</h4>
                <div className="flex flex-wrap gap-2">
                    {profile.customSkills.map(skill => (
                        // Updated skill tag style to be more neutral
                        <span key={skill} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                    ))}
                </div>
            </div>
        )}
    </div>
);


export const EngineerDashboard: React.FC = () => {
    const { engineers, currency, jobs, getCompanyById } = useAppContext();
    const currentEngineer = engineers[0]; // Simulate logged-in user

    const engineerRoles = new Set(currentEngineer.skillProfiles.map(p => p.roleTitle));
    engineerRoles.add('Basic Engineer');

    const matchedJobs = jobs.filter(job => engineerRoles.has(job.roleTitle));

    return (
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8 flex items-center space-x-6 border border-gray-200">
                <img src={currentEngineer.profileImageUrl} alt={currentEngineer.name} className="h-24 w-24 rounded-full" />
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">{currentEngineer.name}</h1>
                    <p className="text-lg text-gray-700 mt-1">{currentEngineer.tagline}</p>
                    <div className="flex items-center text-gray-600 text-sm mt-2 space-x-4">
                        <div className="flex items-center"><MapPin size={16} className="mr-1" /> {currentEngineer.location}</div>
                        <div className="flex items-center"><Wrench size={16} className="mr-1" /> {currentEngineer.transport}</div>
                        {currentEngineer.insurance && <div className="flex items-center text-green-600"><Shield size={16} className="mr-1" /> Insured</div>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">My Skill Profiles</h2>
                        {/* Updated button color */}
                        <button className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
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
                            <p className="text-sm text-gray-600 mt-2">Your default profile for general tech support tasks. Upgrade to add specialized profiles with custom rates.</p>
                        </div>

                        {currentEngineer.skillProfiles.map(profile => (
                            <SkillProfileCard key={profile.id} profile={profile} currency={currency} />
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
                                            {/* Updated button styles */}
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
        </div>
    );
};