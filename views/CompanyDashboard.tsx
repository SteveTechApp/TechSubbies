

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Engineer } from '../types';
import { Search, Star, MapPin, PlusCircle, XCircle, Briefcase, Award, ShieldCheck } from 'lucide-react';
import { JobPostModal } from '../components/JobPostModal';
import { AIEngineerCostAnalysis } from '../components/AIEngineerCostAnalysis';

const Stat: React.FC<{ icon: React.ElementType, value: string | React.ReactNode, className?: string }> = ({ icon: Icon, value, className = '' }) => (
    <div className={`flex items-center space-x-1.5 ${className}`}>
        <Icon className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
        <span className="text-gray-600">{value}</span>
    </div>
);

const Rating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
    </div>
);


const EngineerCard: React.FC<{ engineer: Engineer; currency: string; onViewProfile: (engineer: Engineer) => void }> = ({ engineer, currency, onViewProfile }) => {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-500 transition-all duration-300 flex flex-col p-4 h-full">
            {/* Top Section */}
            <div className="flex items-center mb-3">
                <img className="h-12 w-12 rounded-full object-cover mr-4" src={engineer.profileImageUrl} alt={engineer.name} />
                <div className="flex-1">
                    <h3 className="font-bold text-gray-800 leading-tight truncate">{engineer.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{engineer.tagline}</p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mb-3">
                <Stat icon={Briefcase} value={`${engineer.yearsOfExperience} yrs exp.`} />
                <Stat icon={MapPin} value={engineer.location} />
                <Stat icon={Award} value={<Rating rating={engineer.customerRating} />} />
                <Stat icon={ShieldCheck} value={<Rating rating={engineer.peerRating} />} />
            </div>
            
            {/* Bottom Section */}
            <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                <div>
                    <span className="text-lg font-bold text-blue-600">{currency}{engineer.baseDayRate}</span>
                    <span className="text-xs text-gray-500">/day</span>
                </div>
                <button 
                  onClick={() => onViewProfile(engineer)}
                  className="bg-blue-600 text-white font-semibold py-1.5 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                    View
                </button>
            </div>
        </div>
    );
};


export const CompanyDashboard: React.FC = () => {
    const { engineers, currency, setViewingEngineer } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEngineers, setFilteredEngineers] = useState(engineers);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    
    const [skillFilters, setSkillFilters] = useState<string[]>([]);
    const [allSkills, setAllSkills] = useState<string[]>([]);

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
    
    const toggleSkillFilter = (skillName: string) => {
        setSkillFilters(currentFilters =>
            currentFilters.includes(skillName)
                ? currentFilters.filter(s => s !== skillName)
                : [...currentFilters, skillName]
        );
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
                if (!filter) return true;
                return eng.skillProfiles.some(profile =>
                    profile.skills.some(skill => skill.name === filter)
                );
            });

            return matchesSearch && matchesSkills;
        });

        setFilteredEngineers(results);
    }, [searchTerm, engineers, skillFilters]);

    return (
        <>
            <JobPostModal isOpen={isJobModalOpen} onClose={() => setIsJobModalOpen(false)} />
            
            {/* Header and Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Find Engineers</h1>
                    <p className="text-gray-600 mt-1 text-sm">Search our network of {engineers.length} verified professionals.</p>
                </div>
                 <div className="relative w-full sm:w-auto sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search name, role, location..."
                        className="w-full p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                 <button
                    onClick={() => setIsJobModalOpen(true)}
                    className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <PlusCircle size={20} className="mr-2" />
                    Post a New Job
                </button>
            </div>
            
            <div className="mb-6">
                <AIEngineerCostAnalysis />
            </div>
            
            {/* Skill Filter Bar */}
            <div className="mb-6 flex flex-wrap gap-2 items-center">
                 <h3 className="text-sm font-semibold text-gray-700 mr-2">Popular Skills:</h3>
                {allSkills.slice(0, 10).map(skill => (
                     <button
                        key={skill}
                        onClick={() => toggleSkillFilter(skill)}
                        className={`px-3 py-1 text-sm font-medium rounded-full border transition-colors ${
                            skillFilters.includes(skill)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        {skill}
                    </button>
                ))}
                 {skillFilters.length > 0 && (
                    <button
                        onClick={() => setSkillFilters([])}
                        className="flex items-center text-sm text-red-500 font-semibold hover:text-red-700"
                    >
                        <XCircle size={16} className="mr-1" /> Clear
                    </button>
                 )}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEngineers.map(engineer => (
                    <EngineerCard key={engineer.id} engineer={engineer} currency={currency} onViewProfile={setViewingEngineer} />
                ))}
            </div>
            {filteredEngineers.length === 0 && (
                <div className="text-center py-16 col-span-full flex flex-col justify-center items-center bg-white rounded-lg shadow-md border">
                    <p className="text-gray-600 text-lg font-semibold">No Engineers Found</p>
                    <p className="text-gray-500 mt-2">Try adjusting your search or skill filters.</p>
                </div>
            )}
        </>
    );
};