import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { EngineerProfile } from '../types/index.ts';
import { JOB_ROLE_DEFINITIONS } from '../data/jobRoles.ts';
import { DashboardSidebar } from '../components/DashboardSidebar.tsx';
import { JobPostModal } from '../components/JobPostModal.tsx';
import { DashboardView } from './CompanyDashboard/DashboardView.tsx';
import { MyJobsView } from './CompanyDashboard/MyJobsView.tsx';
import { SettingsView } from './CompanyDashboard/SettingsView.tsx';
import { EngineerCard } from '../components/EngineerCard.tsx';
import { EngineerProfileView } from './EngineerProfileView.tsx';
import { MessagesView } from './MessagesView.tsx';
import { Search, Layers, DollarSign, ArrowLeft } from '../components/Icons.tsx';

// --- NEW VIEW: FindTalentView with Autotrader-style filtering ---
const FindTalentView = ({ engineers, onSelectEngineer }: { engineers: EngineerProfile[], onSelectEngineer: (eng: EngineerProfile) => void }) => {
    const [filters, setFilters] = useState({
        keyword: '',
        role: 'any',
        maxRate: 1000,
    });
    const [sort, setSort] = useState('relevance');
    
    const specialistRoles = useMemo(() => {
        return JOB_ROLE_DEFINITIONS.map(r => r.name).sort();
    }, []);
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({...prev, [name]: name === 'maxRate' ? parseInt(value) : value }));
    };

    const calculateMatchScore = (eng: EngineerProfile): number => {
        let score = 0;
        const maxScore = 100;

        // 1. Role Match (50 points)
        if (filters.role === 'any') {
            score += 50;
        } else if (eng.selectedJobRoles?.some(r => r.roleName === filters.role)) {
            score += 50;
        }

        // 2. Keyword Match (40 points)
        if (filters.keyword.trim() !== '') {
            const keywords = filters.keyword.toLowerCase().split(' ').filter(k => k);
            let matchedKeywords = 0;
            const searchableText = [
                eng.name,
                eng.discipline,
                ...eng.skills.map(s => s.name),
                ...(eng.selectedJobRoles?.flatMap(r => r.skills.map(s => s.name)) || [])
            ].join(' ').toLowerCase();

            keywords.forEach(kw => {
                if (searchableText.includes(kw)) {
                    matchedKeywords++;
                }
            });
            score += (matchedKeywords / keywords.length) * 40;
        } else {
            // No keyword, give full points for this section
            score += 40;
        }
        
        // 3. Rate Match (10 points)
        if (eng.dayRate <= filters.maxRate) {
            const rateScore = (1 - (eng.dayRate / filters.maxRate)) * 10;
            score += rateScore;
        }

        return Math.min(Math.round(score), maxScore);
    };


    const processedEngineers = useMemo(() => {
        return engineers
            .map(eng => ({
                ...eng,
                matchScore: calculateMatchScore(eng),
            }))
            .filter(eng => {
                // Only show active engineers
                if (eng.status !== 'active') return false;

                // Main rate filter
                if (eng.dayRate > filters.maxRate) return false;
                
                // Role filter (only filter out if a specific role is selected and it doesn't match)
                if (filters.role !== 'any' && !eng.selectedJobRoles?.some(r => r.roleName === filters.role)) {
                    return false;
                }
                
                // Keyword filter
                if (filters.keyword.trim() !== '') {
                     const searchableText = [
                        eng.name,
                        eng.discipline,
                        eng.description,
                        ...eng.skills.map(s => s.name),
                        ...(eng.selectedJobRoles?.flatMap(r => [...r.skills.map(s => s.name), r.roleName]) || [])
                    ].join(' ').toLowerCase();
                    if (!searchableText.includes(filters.keyword.toLowerCase())) {
                        return false;
                    }
                }

                return true;
            })
            .sort((a, b) => {
                const tierSort = (b.profileTier === 'paid' ? 1 : 0) - (a.profileTier === 'paid' ? 1 : 0);
                switch (sort) {
                    case 'name-asc':
                        return a.name.localeCompare(b.name);
                    case 'name-desc':
                        return b.name.localeCompare(a.name);
                    case 'rate-asc':
                        return a.dayRate - b.dayRate;
                    case 'rate-desc':
                        return b.dayRate - a.dayRate;
                    case 'relevance':
                    default:
                        // Boosted profiles first
                        if (a.isBoosted !== b.isBoosted) {
                            return a.isBoosted ? -1 : 1;
                        }
                        // Then by match score
                        if (a.matchScore !== b.matchScore) {
                            return b.matchScore - a.matchScore;
                        }
                        // Then by tier
                        return tierSort;
                }
            });
    }, [engineers, filters, sort]);

    return (
        <div className="flex gap-8 h-[calc(100vh-10rem)]">
            {/* Filters Sidebar */}
            <aside className="w-1/3 lg:w-1/4 bg-white p-6 rounded-lg shadow-md flex-shrink-0">
                <h2 className="text-xl font-bold mb-4 flex items-center"><Search size={20} className="mr-2"/> Find Talent</h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">Keyword or Skill</label>
                        <input type="text" id="keyword" name="keyword" value={filters.keyword} onChange={handleFilterChange} placeholder="e.g., Crestron, Cisco, AWS" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 flex items-center"><Layers size={14} className="mr-1.5"/> Specialist Role</label>
                        <select id="role" name="role" value={filters.role} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white">
                            <option value="any">Any Role</option>
                            {specialistRoles.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Only engineers with a 'Job Profile' appear here.</p>
                    </div>
                    <div>
                        <label htmlFor="maxRate" className="block text-sm font-medium text-gray-700 flex items-center"><DollarSign size={14} className="mr-1.5"/> Max Day Rate: £{filters.maxRate}</label>
                        <input type="range" id="maxRate" name="maxRate" min="200" max="1000" step="25" value={filters.maxRate} onChange={handleFilterChange} className="mt-1 block w-full" />
                    </div>
                </div>
            </aside>

            {/* Results */}
            <main className="flex-1 bg-gray-50 overflow-y-auto custom-scrollbar pr-2">
                 <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                     <p className="text-sm text-gray-600 mb-2 sm:mb-0">Showing {processedEngineers.length} of {engineers.filter(e => e.status === 'active').length} active engineers.</p>
                     <div className="flex items-center gap-2">
                         <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort by:</label>
                         <select id="sort" name="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 bg-white">
                             <option value="relevance">Relevance</option>
                             <option value="name-asc">Name (A-Z)</option>
                             <option value="name-desc">Name (Z-A)</option>
                             <option value="rate-asc">Day Rate (Low-High)</option>
                             <option value="rate-desc">Day Rate (High-Low)</option>
                         </select>
                     </div>
                 </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {processedEngineers.length > 0 ? (
                         processedEngineers.map(eng => <EngineerCard key={eng.id} profile={eng} matchScore={eng.matchScore} onClick={() => onSelectEngineer(eng)} />)
                    ) : (
                        <div className="text-center py-10 md:col-span-2 xl:col-span-4">
                            <p className="font-semibold">No engineers match your criteria.</p>
                            <p className="text-sm text-gray-500">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};


export const CompanyDashboard = () => {
    const { user, postJob, jobs, engineers, applications, updateCompanyProfile } = useAppContext();
    const [activeView, setActiveView] = useState('Dashboard');
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    
    // State for Find Talent view
    const [talentView, setTalentView] = useState<'list' | 'profile'>('list');
    const [selectedEngineer, setSelectedEngineer] = useState<EngineerProfile | null>(null);

    const handleSelectEngineer = (engineer: EngineerProfile) => {
        setSelectedEngineer(engineer);
        setTalentView('profile');
    };

    const handleBackToSearch = () => {
        setSelectedEngineer(null);
        setTalentView('list');
    };


    const myJobs = useMemo(() => jobs.filter(j => j.companyId === user?.profile?.id), [jobs, user]);

    useEffect(() => {
        if (activeView === 'Post a Job') {
            setIsJobModalOpen(true);
        } else {
            // Reset talent view when switching main tabs
            handleBackToSearch();
        }
    }, [activeView]);

    const handlePostJob = (jobData: any) => {
        postJob(jobData);
        setIsJobModalOpen(false);
        setActiveView('My Jobs');
    };

    const renderActiveView = () => {
        if (!user) return null;
        switch(activeView) {
            case 'Dashboard':
                return <DashboardView user={user} myJobs={myJobs} engineers={engineers} applications={applications} />;
            case 'Find Talent':
                 if (talentView === 'profile' && selectedEngineer) {
                    return (
                        <div className="h-full overflow-y-auto custom-scrollbar">
                            <button 
                                onClick={handleBackToSearch} 
                                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                <ArrowLeft size={16} className="mr-2" />
                                Back to Search Results
                            </button>
                            <EngineerProfileView profile={selectedEngineer} isEditable={false} onEdit={() => {}} />
                        </div>
                    )
                }
                return <FindTalentView engineers={engineers} onSelectEngineer={handleSelectEngineer} />;
            case 'Post a Job': // Intentionally fall through, modal handles it
            case 'My Jobs':
                return <MyJobsView myJobs={myJobs} setActiveView={setActiveView} />;
            case 'Messages':
                return <MessagesView />;
            case 'Settings':
                return <SettingsView profile={user.profile} onSave={updateCompanyProfile} />;
            default:
                return (
                    <div>
                        <h1 className="text-2xl font-bold">{activeView} - Coming Soon</h1>
                        <p className="mt-4">The functionality for "{activeView}" is under development. Please check back later!</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex">
            <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-grow p-8 bg-gray-50 h-screen overflow-hidden">
                {renderActiveView()}
            </main>
            <JobPostModal
                isOpen={isJobModalOpen}
                onClose={() => {
                    setIsJobModalOpen(false);
                    if (activeView === 'Post a Job') setActiveView('Dashboard');
                }}
                onPostJob={handlePostJob}
            />
        </div>
    );
};