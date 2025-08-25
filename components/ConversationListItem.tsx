import React from 'react';
import { Conversation, UserProfile } from '../types/index.ts';

interface ConversationListItemProps {
    conversation: Conversation;
    otherParticipant: UserProfile | undefined;
    isSelected: boolean;
    onSelect: () => void;
}

const formatDate = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
};

export const ConversationListItem = ({ conversation, otherParticipant, isSelected, onSelect }: ConversationListItemProps) => {
    if (!otherParticipant) return null;

    const selectedClasses = isSelected ? 'bg-blue-50' : 'hover:bg-gray-50';

    return (
        <button
            onClick={onSelect}
            className={`w-full text-left p-3 flex items-start gap-3 border-b border-gray-100 transition-colors ${selectedClasses}`}
        >
            <img src={otherParticipant.avatar} alt={otherParticipant.name} className="w-12 h-12 rounded-full flex-shrink-0" />
            <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-800 truncate">{otherParticipant.name}</h3>
                    <p className="text-xs text-gray-400 flex-shrink-0">{formatDate(conversation.lastMessageTimestamp)}</p>
                </div>
                <p className="text-sm text-gray-500 truncate">{conversation.lastMessageText}</p>
            </div>
        </button>
    );
};
