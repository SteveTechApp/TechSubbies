import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/InteractionContext';
import { ForumPost } from '../types';
import { MessageSquare, PlusCircle } from '../components/Icons';
import { ForumPostItem } from '../components/Forum/ForumPostItem';
import { ForumPostDetails } from '../components/Forum/ForumPostDetails';
import { CreatePostModal } from '../components/Forum/CreatePostModal';

export const ForumView = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
    const { forumPosts, findUserByProfileId } = useAppContext();
    const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const sortedPosts = useMemo(() => {
        return [...forumPosts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [forumPosts]);

    if (selectedPost) {
        return (
            <div>
                 <button onClick={() => setSelectedPost(null)} className="text-blue-600 hover:underline mb-4">&larr; Back to All Posts</button>
                <ForumPostDetails post={selectedPost} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold mb-6 flex items-center">
                    <MessageSquare size={30} className="mr-3 text-blue-600"/>
                    Engineer Forum
                </h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                >
                    <PlusCircle size={18} className="mr-2" />
                    Create New Post
                </button>
            </div>
           
            <div className="space-y-4">
                {sortedPosts.map(post => {
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

            <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </div>
    );
};
