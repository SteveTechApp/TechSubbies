import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/InteractionContext';
import { CollaborationPost } from '../../types';
import { Search, PlusCircle } from '../../components/Icons';
import { CollaborationPostCard } from '../../components/CollaborationPostCard';
import { PostCollaborationModal } from '../../components/PostCollaborationModal';

export const FindPartnerView = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
    const { collaborationPosts } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    const filteredPosts = useMemo(() => {
        return collaborationPosts.filter(post =>
            post.status === 'open' &&
            (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             post.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [collaborationPosts, searchTerm]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Find a Collaboration Partner</h1>
                <button
                    onClick={() => setIsPostModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                >
                    <PlusCircle size={18} className="mr-2" />
                    Post an Opportunity
                </button>
            </div>
             <p className="text-gray-600 mb-4">Need an extra pair of hands for a project? Post your requirements here for other engineers to see.</p>

            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search opportunities by title or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="space-y-4">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => <CollaborationPostCard key={post.id} post={post} setActiveView={setActiveView} />)
                ) : (
                    <p className="text-center text-gray-500 py-8">No open collaboration opportunities found.</p>
                )}
            </div>

            <PostCollaborationModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
        </div>
    );
};
