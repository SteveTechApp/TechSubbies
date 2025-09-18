import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/InteractionContext';
import { ConversationListItem } from '../components/ConversationListItem';
import { ChatWindow } from '../components/ChatWindow';

export const MessagesView = () => {
    const { user, conversations, findUserByProfileId } = useAppContext();
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    const myConversations = useMemo(() => {
        if (!user) return [];
        return conversations
            .filter(c => c.participantIds.includes(user.id))
            .sort((a, b) => b.lastMessageTimestamp.getTime() - a.lastMessageTimestamp.getTime());
    }, [user, conversations]);
    
    // Select the first conversation by default
    useState(() => {
        if (!selectedConversationId && myConversations.length > 0) {
            setSelectedConversationId(myConversations[0].id);
        }
    });

    const selectedConversation = myConversations.find(c => c.id === selectedConversationId);

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-white rounded-lg shadow-lg overflow-hidden border">
            <aside className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">Messages</h2>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    {myConversations.map(convo => {
                        const otherParticipantId = convo.participantIds.find(id => id !== user!.id)!;
                        const otherParticipant = findUserByProfileId(otherParticipantId);
                        
                        return (
                            <ConversationListItem
                                key={convo.id}
                                conversation={convo}
                                otherParticipant={otherParticipant?.profile}
                                isSelected={selectedConversationId === convo.id}
                                onSelect={() => setSelectedConversationId(convo.id)}
                            />
                        );
                    })}
                </div>
            </aside>
            <main className="w-2/3">
                {selectedConversation ? (
                    <ChatWindow conversation={selectedConversation} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Select a conversation to start messaging.</p>
                    </div>
                )}
            </main>
        </div>
    );
};
