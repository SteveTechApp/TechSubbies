import React, { useState, useRef, useLayoutEffect } from 'react';
import { Conversation } from '../types';
import { useAppContext } from '../context/InteractionContext';
import { Send, Loader } from './Icons';
import { formatTimeAgo } from '../utils/dateFormatter';

interface ChatWindowProps {
    conversation: Conversation;
}

export const ChatWindow = ({ conversation }: ChatWindowProps) => {
    const { user, messages, findUserById, sendMessage } = useAppContext();
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const otherParticipantId = conversation.participantIds.find(id => id !== user!.id)!;
    const otherParticipant = findUserById(otherParticipantId);
    
    const conversationMessages = messages
        .filter(m => m.conversationId === conversation.id)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    useLayoutEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationMessages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsLoading(true);
        await sendMessage(conversation.id, newMessage);
        setNewMessage('');
        setIsLoading(false);
    };

    if (!otherParticipant) return <div>Loading...</div>;

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b bg-white flex items-center gap-3 flex-shrink-0">
                <img src={otherParticipant.profile.avatar} alt={otherParticipant.profile.name} className="w-10 h-10 rounded-full" />
                <div>
                    <h2 className="font-bold">{otherParticipant.profile.name}</h2>
                    <p className="text-xs text-gray-500">{otherParticipant.role}</p>
                </div>
            </header>
            <main className="flex-grow p-4 overflow-y-auto custom-scrollbar">
                 <div className="space-y-4">
                    {conversationMessages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === user!.id ? 'justify-end' : 'justify-start'}`}>
                            {msg.senderId !== user!.id && <img src={otherParticipant.profile.avatar} alt="avatar" className="w-6 h-6 rounded-full self-start"/>}
                             <div className={`p-3 rounded-lg max-w-xs md:max-w-md break-words ${msg.senderId === user!.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p>{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.senderId === user!.id ? 'text-blue-200' : 'text-gray-500'}`}>{formatTimeAgo(msg.timestamp)}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <footer className="p-4 border-t bg-white flex-shrink-0">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full border p-2 rounded-full px-4"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !newMessage.trim()} className="p-3 bg-blue-600 text-white rounded-full disabled:bg-blue-300">
                        {isLoading ? <Loader className="animate-spin" /> : <Send />}
                    </button>
                </form>
            </footer>
        </div>
    );
};
