import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { ForumPost } from '../types/index.ts';
import { ArrowLeft, MessageSquare, Plus, Search } from '../components/Icons.tsx';
import { ForumPostItem } from '../components/Forum/ForumPostItem.tsx';
import { ForumPostDetails } from '../components/Forum/ForumPostDetails.tsx';
import { CreatePostModal } from '../components/Forum/CreatePostModal.tsx';

export const ForumView = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
    const { forumPosts, findUserByProfileId } = useAppContext();
    const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredPosts = useMemo(() => {
        return forumPosts
            .filter(post => 
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [forumPosts, searchTerm]);

    if (selectedPost) {
        return (
            <div>
                <button 
                    onClick={() => setSelectedPost(null)} 
                    className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Forum
                </button>
                <ForumPostDetails post={selectedPost} />
            </div>
        );
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center"><MessageSquare className="mr-3 text-blue-600"/> Tech Forum</h1>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
                >
                    <Plus size={18} className="mr-2" />
                    Create Post
                </button>
            </div>

            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text"
                    placeholder="Search posts by title, content, or tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500"
                />
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
                 {filteredPosts.length > 0 ? (
                    <div className="space-y-3">
                        {filteredPosts.map(post => {
                            const author = findUserByProfileId(post.authorId);
                            return (
                                <ForumPostItem 
                                    key={post.id} 
                                    post={post} 
                                    author={author?.profile} 
                                    onSelect={() => setSelectedPost(post)} 
                                />
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">No posts found. Why not create one?</p>
                )}
            </div>

            <CreatePostModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};