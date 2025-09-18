import React from 'react';
// FIX: Corrected import path for types.
import { CollaborationPost } from '../types';
// FIX: Corrected import path for useAppContext to resolve 'not a module' error.
import { useAppContext } from '../context/InteractionContext';
import { MapPin, DollarSign, Clock, Handshake, Calendar } from './Icons';
import { formatDisplayDate } from '../utils/dateFormatter';

export const CollaborationPostCard = ({ post, setActiveView }: { post: CollaborationPost, setActiveView: (view: string) => void }) => {
    const { findUserByProfileId, startConversationAndNavigate } = useAppContext();
    const posterUser = findUserByProfileId(post.postedByEngineerId);
    
    if (!posterUser) return null;
    const poster = posterUser.profile;

    const handleMessage = () => {
        startConversationAndNavigate(poster.id, () => setActiveView('Messages'));
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-start gap-4">
                <img src={poster.avatar} alt={poster.name} className="w-12 h-12 rounded-full flex-shrink-0" />
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-blue-700">{post.title}</h3>
                    <p className="text-sm font-semibold text-gray-600">Posted by {poster.name}</p>
                </div>
                <button onClick={handleMessage} className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md text-sm hover:bg-blue-700">
                    <Handshake size={16} className="mr-2"/> Message Poster
                </button>
            </div>
            <p className="text-sm text-gray-700 mt-3">{post.description}</p>
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-2 text-gray-600 text-sm">
                <span className="flex items-center"><MapPin size={14} className="mr-1.5 text-gray-400"/> {post.location}</span>
                <span className="flex items-center"><DollarSign size={14} className="mr-1.5 text-gray-400"/> {post.currency}{post.rate} / day</span>
                <span className="flex items-center"><Clock size={14} className="mr-1.5 text-gray-400"/> {post.duration}</span>
                <span className="flex items-center"><Calendar size={14} className="mr-1.5 text-gray-400"/> Starts: {formatDisplayDate(post.startDate)}</span>
            </div>
        </div>
    );
};