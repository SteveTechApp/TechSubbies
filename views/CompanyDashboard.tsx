import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Engineer } from '../types';
import { generateJobDescription } from '../services/geminiService';
import { Search, Star, MapPin, PlusCircle, Sparkles, XCircle } from 'lucide-react';
import { SKILL_ROLES } from '../constants';

const EngineerCard: React.FC<{ engineer: Engineer; currency: string }> = ({ engineer, currency }) => (
  // Updated card styles
  <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-gray-200">
    <div className="p-6">
      <div className="flex items-center space-x-4">
        <img className="h-16 w-16 rounded-full object-cover" src={engineer.profileImageUrl} alt={engineer.name} />
        <div>
          <h3 className="text-xl font-bold text-gray-800">{engineer.name}</h3>
          {/* Updated tagline text color */}
          <p className="text-sm text-gray-600 font-medium">{engineer.tagline}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center"><MapPin size={14} className="mr-1" /> {engineer.location}</div>
        <div className="flex items-center">
          <Star size={14} className="text-yellow-400 mr-1" fill="currentColor"/> 
          {engineer.reviews.rating} ({engineer.reviews.count} reviews)
        </div>
      </div>
      <div className="mt-4">
          <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider">Specialized Roles</h4>
          <div className="flex flex-wrap gap-2 mt-2">
              {engineer.skillProfiles.map(p => (
                  // Updated tag style
                  <span key={p.id} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">{p.roleTitle}</span>
              ))}
              {engineer.skillProfiles.length === 0 && <p className="text-xs text-gray-500">Basic Profile Only</p>}
          </div>
      </div>
      {/* Updated button color */}
      <button className="w-full mt-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
        View Profile & Availability
      </button>
    </div>
  </div>
);

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
    const { engineers, currency } = useAppContext();
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
                        <EngineerCard key={engineer.id} engineer={engineer} currency={currency} />
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
