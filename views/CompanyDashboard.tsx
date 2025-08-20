
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Engineer } from '../types';
import { generateJobDescription } from '../services/geminiService';
import { Search, Star, MapPin, PlusCircle, Sparkles, XCircle, Briefcase, Award, ShieldCheck, Calendar } from 'lucide-react';
import { SKILL_ROLES } from '../constants';

const Stat: React.FC<{ icon: React.ElementType, label: string, value: string | React.ReactNode, isRating?: boolean }> = ({ icon: Icon, label, value }) => (
    <div className={`flex items-start space-x-3 p-2 rounded-lg`}>
        <Icon className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-base font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Rating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
        ))}
    </div>
);


const EngineerCard: React.FC<{ engineer: Engineer; currency: string; onViewProfile: (engineer: Engineer) => void }> = ({ engineer, currency, onViewProfile }) => {
    const keyCerts = engineer.certifications.filter(c => c.achieved).slice(0, 2).map(c => c.name.replace('Card Holder', '').replace('AVIXA ', '')).join(' / ');

    return (
        <div className="bg-slate-50 rounded-2xl shadow-lg overflow-hidden border-4 border-white ring-2 ring-gray-200 transform hover:scale-105 transition-transform duration-300 flex flex-col">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white text-center">
                <img className="h-24 w-24 rounded-full object-cover mx-auto border-4 border-white shadow-md" src={engineer.profileImageUrl} alt={engineer.name} />
                <h3 className="text-2xl font-bold mt-3 tracking-tight">{engineer.name}</h3>
                <p className="text-sm font-medium text-blue-100">{engineer.tagline}</p>
            </div>

            {/* Stats Section */}
            <div className="p-5 flex-grow">
                <h4 className="text-center font-bold text-gray-500 text-sm uppercase tracking-wider mb-4">Top Stats</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <Stat icon={Calendar} label="Experience" value={`${engineer.yearsOfExperience} years`} />
                    <Stat icon={Award} label="Customer Rating" value={<Rating rating={engineer.customerRating} />} />
                    <Stat icon={ShieldCheck} label="Peer Rating" value={<Rating rating={engineer.peerRating} />} />
                    <Stat icon={Briefcase} label="Day Rate" value={`${currency}${engineer.baseDayRate}`} />
                    <Stat icon={MapPin} label="Travel Radius" value={engineer.travelRadius} />
                    <Stat icon={Award} label="Key Certs" value={keyCerts || 'N/A'} />
                </div>
                
                <div className="mt-6">
                    <h4 className="text-center font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Specialized Roles</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {engineer.skillProfiles.map(p => (
                            <span key={p.id} className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">{p.roleTitle}</span>
                        ))}
                        {engineer.skillProfiles.length === 0 && <p className="text-xs text-gray-500">Basic Profile Only</p>}
                    </div>
                </div>
            </div>

            {/* Footer Button */}
            <div className="p-4 bg-gray-100">
                <button 
                  onClick={() => onViewProfile(engineer)}
                  className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-sm"
                >
                    View Full Profile
                </button>
            </div>
        </div>
    );
};


const JobPostForm: React.FC = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [keywords, setKeywords] = useState('');
    const [roleTitle, setRoleTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateDescription = async () => {
        if (!jobTitle || !keywords) {
            alert("Please provide a Job Title and some Keywords first.");
            return;
        }
        setIsLoading(true);
        try {
            const generatedDesc = await generateJobDescription(jobTitle, keywords);
            setDescription(generatedDesc);
        } catch (error) {
            console.error(error);
            setDescription("Failed to generate description.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Updated card styles
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><PlusCircle className="mr-2 text-blue-600"/>Post a New Job</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Job Title (e.g., Senior AV Technician)" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
                <select className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500" value={roleTitle} onChange={e => setRoleTitle(e.target.value)}>
                    <option value="" disabled>Select Required Role...</option>
                    {SKILL_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
                <input type="text" placeholder="Location" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Keywords (e.g., Crestron, Dante, Networking)" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" value={keywords} onChange={e => setKeywords(e.target.value)} />
            </div>
            <div className="mt-6">
                 {/* Updated button color */}
                 <button onClick={handleGenerateDescription} disabled={isLoading} className="flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">
                     <Sparkles size={16} className="mr-2"/>
                     {isLoading ? 'Generating...' : 'Generate Description with AI'}
                 </button>
            </div>
            <textarea placeholder="Job Description" className="w-full mt-4 p-3 border border-gray-300 rounded-md h-40 focus:ring-2 focus:ring-blue-500" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            <div className="flex justify-end mt-6">
                 {/* Updated button color */}
                <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">Post Job</button>
            </div>
        </div>
    );
};


export const CompanyDashboard: React.FC = () => {
    const { engineers, currency, setViewingEngineer } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEngineers, setFilteredEngineers] = useState(engineers);
    
    const [skillFilters, setSkillFilters] = useState<{ id: number; skillName: string; rating: number }[]>([]);
    const [allSkills, setAllSkills] = useState<string[]>([]);
    const [nextFilterId, setNextFilterId] = useState(0);

    useEffect(() => {
        const skills = new Set<string>();
        engineers.forEach(eng => {
            eng.skillProfiles.forEach(prof => {
                prof.skills.forEach(skill => {
                    skills.add(skill.name);
                });
            });
        });
        setAllSkills(Array.from(skills).sort());
    }, [engineers]);
    
    const addSkillFilter = () => {
        setSkillFilters([...skillFilters, { id: nextFilterId, skillName: '', rating: 1 }]);
        setNextFilterId(prev => prev + 1);
    };

    const updateSkillFilter = (id: number, field: 'skillName' | 'rating', value: string | number) => {
        setSkillFilters(currentFilters =>
            currentFilters.map(filter =>
                filter.id === id ? { ...filter, [field]: value } : filter
            )
        );
    };

    const removeSkillFilter = (id: number) => {
        setSkillFilters(currentFilters => currentFilters.filter(filter => filter.id !== id));
    };


    useEffect(() => {
        const lowercasedTerm = searchTerm.toLowerCase();

        const results = engineers.filter(eng => {
            const matchesSearch = searchTerm === '' ||
                eng.name.toLowerCase().includes(lowercasedTerm) ||
                eng.tagline.toLowerCase().includes(lowercasedTerm) ||
                eng.location.toLowerCase().includes(lowercasedTerm) ||
                eng.skillProfiles.some(p => p.roleTitle.toLowerCase().includes(lowercasedTerm));

            const matchesSkills = skillFilters.every(filter => {
                if (!filter.skillName) return true;
                return eng.skillProfiles.some(profile =>
                    profile.skills.some(skill =>
                        skill.name === filter.skillName && skill.rating >= filter.rating
                    )
                );
            });

            return matchesSearch && matchesSkills;
        });

        setFilteredEngineers(results);
    }, [searchTerm, engineers, skillFilters]);

    return (
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <JobPostForm />
            
            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Find Your Next Engineer</h2>
                <p className="text-gray-600 mb-6">Search our network of verified professionals by name, skill, location, or specific expertise.</p>
                
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, role, or location..."
                        className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Filter by Specific Skills</h3>
                    <div className="space-y-4">
                        {skillFilters.map((filter) => (
                            <div key={filter.id} className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-gray-50 rounded-md border">
                                <select
                                    value={filter.skillName}
                                    onChange={(e) => updateSkillFilter(filter.id, 'skillName', e.target.value)}
                                    className="w-full sm:flex-1 p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Select a Skill --</option>
                                    {allSkills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                                </select>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <label className="text-sm font-medium text-gray-600">Min Rating:</label>
                                    <div className="flex items-center space-x-1">
                                        {[1, 2, 3, 4, 5].map(ratingValue => (
                                            <button
                                                key={ratingValue}
                                                onClick={() => updateSkillFilter(filter.id, 'rating', ratingValue)}
                                                className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${filter.rating >= ratingValue ? 'bg-yellow-400 text-white shadow-inner' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                                aria-label={`Set minimum rating to ${ratingValue}`}
                                            >
                                                <Star size={16} className={`${filter.rating >= ratingValue ? 'fill-current' : 'fill-gray-400'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => removeSkillFilter(filter.id)} className="text-red-500 hover:text-red-700 flex-shrink-0">
                                    <XCircle size={24} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={addSkillFilter}
                        className="mt-4 flex items-center bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        <PlusCircle size={16} className="mr-2"/>
                        Add Skill Filter
                    </button>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEngineers.map(engineer => (
                        <EngineerCard key={engineer.id} engineer={engineer} currency={currency} onViewProfile={setViewingEngineer} />
                    ))}
                </div>
                 {filteredEngineers.length === 0 && (
                    <div className="text-center py-16 col-span-full bg-white rounded-lg shadow-md border">
                        <p className="text-gray-600 text-lg font-semibold">No Engineers Found</p>
                        <p className="text-gray-500 mt-2">Try adjusting your search or skill filters.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};
