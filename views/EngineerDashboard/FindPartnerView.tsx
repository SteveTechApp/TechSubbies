import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { EngineerProfile } from '../../types';
import { PostCollaborationModal } from '../../components/PostCollaborationModal';
import { CollaborationPostCard } from '../../components/CollaborationPostCard';
import { EngineerCard } from '../../components/EngineerCard';
import { EngineerProfileView } from '../EngineerProfileView';
import { Search, Plus, ArrowLeft } from '../../components/Icons';

export const FindPartnerView = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
    const { user, engineers, collaborationPosts } = useAppContext();
    const [activeTab, setActiveTab] = useState<'posts' | 'engineers'>('posts');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // For engineer search tab
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEngineer, setSelectedEngineer] = useState<EngineerProfile | null>(null);

    const filteredEngineers = useMemo(() => {
        if (!user) return [];
        return engineers.filter(e =>
            e.id !== user.profile.id &&
            e.status === 'active' &&
            (e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             e.discipline.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [engineers, searchTerm, user]);

    const handleSelectEngineer = (engineer: EngineerProfile) => {
        setSelectedEngineer(engineer);
    };

    const getTabClass = (tabName: 'posts' | 'engineers') => 
        `px-4 py-2 font-semibold rounded-t-lg ${activeTab === tabName ? 'bg-white border-b-0' : 'bg-gray-100 hover:bg-gray-200'}`;

    if (selectedEngineer) {
        return (
            <div className="h-full overflow-y-auto custom-scrollbar">
                <button 
                    onClick={() => setSelectedEngineer(null)} 
                    className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Search
                </button>
                <EngineerProfileView profile={selectedEngineer} isEditable={false} onEdit={() => {}} />
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Find a Partner</h1>
                {activeTab === 'posts' && (
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                        <Plus size={18} className="mr-2" /> Post Collaboration
                    </button>
                )}
            </div>
            
            <div className="flex border-b mb-4">
                <button onClick={() => setActiveTab('posts')} className={getTabClass('posts')}>Collaboration Posts</button>
                <button onClick={() => setActiveTab('engineers')} className={getTabClass('engineers')}>Find Engineers</button>
            </div>

            {activeTab === 'posts' && (
                <div className="space-y-4">
                    {collaborationPosts.filter(p => p.status === 'open').map(post => (
                        <CollaborationPostCard key={post.id} post={post} setActiveView={setActiveView} />
                    ))}
                </div>
            )}

            {activeTab === 'engineers' && (
                <div>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, discipline, or skill..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 pl-10"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredEngineers.map(eng => (
                            <EngineerCard key={eng.id} profile={eng} onClick={() => handleSelectEngineer(eng)} />
                        ))}
                    </div>
                </div>
            )}

            <PostCollaborationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};