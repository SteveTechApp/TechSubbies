import React from 'react';
import { Conversation, UserProfile } from '../types';
import { formatTimeAgo } from '../utils/dateFormatter';

interface ConversationListItemProps {
    conversation: Conversation;
    otherParticipant: UserProfile | undefined;
    isSelected: boolean;
    onSelect: () => void;
}

export const ConversationListItem = ({ conversation, otherParticipant, isSelected, onSelect }: ConversationListItemProps) => {
    if (!otherParticipant) return null;
    const selectedClasses = isSelected ? 'bg-blue-50' : 'hover:bg-gray-50';
    const unreadCount = Number((conversation as Conversation & { unreadCount?: number }).unreadCount || 0);

    return (
        <button
            onClick={onSelect}
            className={`w-full text-left p-3 flex items-start gap-3 border-b border-gray-100 transition-colors ${selectedClasses}`}
        >
            <img src={otherParticipant.avatar} alt={otherParticipant.name} className="w-12 h-12 rounded-full flex-shrink-0" />
            <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-baseline gap-2">
                    <h3 className={`truncate ${unreadCount > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'}`}>{otherParticipant.name}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <p className="text-xs text-gray-400">{formatTimeAgo(conversation.lastMessageTimestamp)}</p>
                        {unreadCount > 0 && (
                            <span className="min-w-5 h-5 px-1 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center" aria-label={`${unreadCount} unread messages`}>
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </div>
                </div>
                <p className={`text-sm truncate ${unreadCount > 0 ? 'font-medium text-gray-700' : 'text-gray-500'}`}>{conversation.lastMessageText}</p>
            </div>
        </button>
    );
};
