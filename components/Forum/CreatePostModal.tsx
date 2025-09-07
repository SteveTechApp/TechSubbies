import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { X, Send, Loader } from '../Icons';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
    const { createForumPost } = useAppContext();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setError('Title and content are required.');
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
            await createForumPost({ title, content, tags: tagsArray });
            // The context will show an alert on success/failure
            onClose();
            // Reset fields for next time
            setTitle('');
            setContent('');
            setTags('');
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg p-6 m-4 max-w-2xl w-full relative transform transition-all duration-300"
                onClick={e => e.stopPropagation()}
            >
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4">Create New Forum Post</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="post-title" className="block font-medium mb-1">Title</label>
                        <input
                            id="post-title"
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g., Best practices for large-scale DM NVX deployments?"
                            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="post-content" className="block font-medium mb-1">Content</label>
                        <textarea
                            id="post-content"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={8}
                            placeholder="Explain your question or topic in detail here..."
                            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="post-tags" className="block font-medium mb-1">Tags</label>
                        <input
                            id="post-tags"
                            type="text"
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                            placeholder="e.g., crestron, networking, av-over-ip"
                            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Comma-separated tags help others find your post.</p>
                    </div>
                     <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm">
                        <strong>Forum Rules:</strong> This forum is for technical discussion only. Do not post job listings, advertisements, or requests for work. All posts are subject to AI moderation.
                    </div>
                </div>

                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {isLoading ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <Send size={18} className="mr-2" />}
                        {isLoading ? 'Submitting...' : 'Submit Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};
