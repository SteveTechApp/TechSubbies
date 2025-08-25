import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Conversation } from '../types/index.ts';

interface ChatWindowProps {
    conversation: Conversation;
}

export const ChatWindow = ({ conversation }: ChatWindowProps) => {
    const { user, messages, sendMessage, findUserById } = useAppContext();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const conversationMessages = messages
        .filter(m => m.conversationId === conversation.id)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    const otherParticipantId = conversation.participantIds.find(id => id !== user?.id)!;
    const otherParticipant = findUserById(otherParticipantId);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversationMessages.length, conversation.id]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;
        sendMessage(conversation.id, newMessage);
        setNewMessage('');
    };

    if (!user || !otherParticipant) return null;
    
    return (
        <>
            <div className="p-4 border-b bg-white flex items-center gap-3">
                <img src={otherParticipant.profile.avatar} alt={otherParticipant.profile.name} className="w-10 h-10 rounded-full" />
                <h2 className="font-bold text-lg">{otherParticipant.profile.name}</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                {conversationMessages.map(msg => (
                    <div
                        key={msg.id}
                        className={`p-3 rounded-lg max-w-[70%] ${
                            msg.senderId === user.id
                                ? 'self-end bg-blue-600 text-white'
                                : 'self-start bg-white text-gray-800 shadow-sm'
                        }`}
                    >
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.senderId === user.id ? 'text-blue-200' : 'text-gray-400'} text-right`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 bg-white border-t">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                    aria-label="Chat message input"
                />
            </form>
        </>
    );
};
