import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ForumPost, ForumComment, UserProfile } from '../../types';
import { ArrowUp, ArrowDown } from '../Icons';
import { formatTimeAgo } from '../../utils/dateFormatter';

interface CommentProps {
    comment: ForumComment;
    onReply: (commentId: string) => void;
}

const Comment = ({ comment, onReply }: CommentProps) => {
    const { findUserByProfileId, voteOnComment } = useAppContext();
    const author = findUserByProfileId(comment.authorId);

    return (
        <div className="flex items-start gap-3">
            <img src={author?.profile.avatar} alt={author?.profile.name} className="w-8 h-8 rounded-full mt-1" />
            <div className="flex-grow bg-gray-50 p-3 rounded-lg">
                <p className="text-sm">
                    <span className="font-bold">{author?.profile.name}</span>
                    <span className="text-gray-500 ml-2">• {formatTimeAgo(comment.timestamp)}</span>
                </p>
                <p className="mt-1">{comment.content}</p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                     <div className="flex items-center gap-1 text-gray-600">
                        {/* FIX: Correctly call voteOnComment with 'up' as the type definition has been fixed. */}
                        <button onClick={() => voteOnComment(comment.id, 'up')} className="p-1 hover:bg-green-100 rounded-full"><ArrowUp size={14} /></button>
                        <span className="font-bold">{comment.upvotes - comment.downvotes}</span>
                        <button onClick={() => voteOnComment(comment.id, 'down')} className="p-1 hover:bg-red-100 rounded-full"><ArrowDown size={14} /></button>
                    </div>
                    <button onClick={() => onReply(comment.id)} className="font-semibold text-blue-600 hover:underline">Reply</button>
                </div>
            </div>
        </div>
    );
};


interface ForumPostDetailsProps {
    post: ForumPost;
}

export const ForumPostDetails = ({ post }: ForumPostDetailsProps) => {
    const { user, forumComments, findUserByProfileId, addForumComment } = useAppContext();
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const author = findUserByProfileId(post.authorId);

    const commentsByParentId = useMemo(() => {
        return forumComments
            .filter(c => c.postId === post.id)
            .reduce((acc, comment) => {
                const parentId = comment.parentId || 'root';
                if (!acc[parentId]) {
                    acc[parentId] = [];
                }
                acc[parentId].push(comment);
                return acc;
            }, {} as Record<string, ForumComment[]>);
    }, [forumComments, post.id]);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        addForumComment({
            postId: post.id,
            parentId: replyingTo,
            content: newComment,
        });
        setNewComment('');
        setReplyingTo(null);
    };
    
    const renderComments = (parentId: string | null) => {
        const key = parentId || 'root';
        const comments = commentsByParentId[key] || [];
        return (
            <div className={`space-y-4 ${parentId ? 'pl-8 border-l-2' : ''}`}>
                {comments.map(comment => (
                    <div key={comment.id}>
                        <Comment comment={comment} onReply={setReplyingTo} />
                        {renderComments(comment.id)}
                    </div>
                ))}
            </div>
        );
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="border-b pb-4 mb-4">
                <p className="text-sm text-gray-500">
                    Posted by <span className="font-semibold">{author?.profile.name || '...'}</span> • {formatTimeAgo(post.timestamp)}
                </p>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-2">{post.title}</h1>
                <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
            </div>
            
            <div className="prose prose-lg max-w-none mb-6">
                <p>{post.content}</p>
            </div>
            
            <div className="border-t pt-4">
                <h3 className="text-xl font-bold mb-4">Comments ({forumComments.filter(c => c.postId === post.id).length})</h3>
                
                {/* Add Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={replyingTo ? `Replying to comment...` : "Add your comment..."}
                        rows={3}
                        className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-end items-center mt-2 gap-2">
                         {replyingTo && (
                             <button type="button" onClick={() => setReplyingTo(null)} className="text-sm text-gray-500 hover:underline">Cancel Reply</button>
                         )}
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Post Comment</button>
                    </div>
                </form>

                {/* Comments List */}
                {renderComments(null)}
            </div>
        </div>
    );
};
