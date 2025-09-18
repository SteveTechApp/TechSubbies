import React from 'react';
// FIX: Corrected import path for types.
import { ForumPost, UserProfile } from '../../types';
import { ArrowUp, ArrowDown, MessageSquare } from '../Icons';
import { formatTimeAgo } from '../../utils/dateFormatter';
// FIX: Corrected import path for useAppContext to resolve 'not a module' error.
import { useAppContext } from '../../context/InteractionContext';

interface ForumPostItemProps {
    post: ForumPost;
    author: UserProfile | undefined;
    onSelect: () => void;
}

export const ForumPostItem = ({ post, author, onSelect }: ForumPostItemProps) => {
    const { forumComments, voteOnPost } = useAppContext();
    const commentCount = forumComments.filter(c => c.postId === post.id).length;

    return (
        <div className="p-4 border rounded-lg hover:bg-gray-50/50 transition-colors flex gap-4">
            <div className="flex flex-col items-center gap-1 text-gray-600">
                <button onClick={(e) => { e.stopPropagation(); voteOnPost(post.id, 'up'); }} className="p-1 hover:bg-green-100 rounded-full"><ArrowUp size={18} /></button>
                <span className="font-bold text-lg">{post.upvotes - post.downvotes}</span>
                <button onClick={(e) => { e.stopPropagation(); voteOnPost(post.id, 'down'); }} className="p-1 hover:bg-red-100 rounded-full"><ArrowDown size={18} /></button>
            </div>
            <button onClick={onSelect} className="flex-grow text-left">
                <p className="text-xs text-gray-500">
                    Posted by <span className="font-semibold">{author?.name || '...'}</span> • {formatTimeAgo(post.timestamp)}
                </p>
                <h3 className="text-xl font-bold text-blue-700 mt-1">{post.title}</h3>
                <div className="flex justify-between items-center mt-3">
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <MessageSquare size={16} />
                        <span>{commentCount} comments</span>
                    </div>
                </div>
            </button>
        </div>
    );
};