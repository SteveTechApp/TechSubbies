import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ConversationListItem } from '../components/ConversationListItem';
import { ChatWindow } from '../components/ChatWindow';
import { Mail } from '../components/Icons';

export const MessagesView = () => {
    const { user, conversations, selectedConversationId, setSelectedConversationId, findUserById } = useAppContext();
    
    if (!user) return null;

    const myConversations = conversations
        .filter(c => c.participantIds.includes(user.id))
        .sort((a, b) => b.lastMessageTimestamp.getTime() - a.lastMessageTimestamp.getTime());

    const activeConversation = myConversations.find(c => c.id === selectedConversationId);

    return (
        <div className="flex h-[calc(100vh-8rem)] border border-gray-200 rounded-lg overflow-hidden shadow-md">
            <aside className="w-full md:w-1/3 border-r border-gray-200 bg-white flex flex-col">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold">Inbox</h1>
                </div>
                <div className="overflow-y-auto custom-scrollbar">
                    {myConversations.map(convo => {
                        const otherParticipantId = convo.participantIds.find(id => id !== user.id)!;
                        const otherParticipant = findUserById(otherParticipantId);
                        return (
                            <ConversationListItem
                                key={convo.id}
                                conversation={convo}
                                otherParticipant={otherParticipant?.profile}
                                isSelected={convo.id === selectedConversationId}
                                onSelect={() => setSelectedConversationId(convo.id)}
                            />
                        );
                    })}
                </div>
            </aside>
            <main className="hidden md:flex w-2/3 flex-col bg-gray-50">
                {activeConversation ? (
                    <ChatWindow conversation={activeConversation} />
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-gray-500 text-center p-4">
                        <Mail size={48} className="mb-4" />
                        <h2 className="text-xl font-semibold">Select a conversation</h2>
                        <p>Your messages will appear here.</p>
                    </div>
                )}
            </main>
        </div>
    );
};