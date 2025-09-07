import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Conversation } from '../types';
import { Globe } from './Icons';

interface ChatWindowProps {
    conversation: Conversation;
}

export const ChatWindow = ({ conversation }: ChatWindowProps) => {
    const { user, messages, sendMessage, findUserById, isAiReplying } = useAppContext();
    const [newMessage, setNewMessage] = useState('');
    const [showOriginal, setShowOriginal] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const conversationMessages = messages
        .filter(m => m.conversationId === conversation.id)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    const otherParticipantId = conversation.participantIds.find(id => id !== user?.id)!;
    const otherParticipant = findUserById(otherParticipantId);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversationMessages.length, conversation.id, isAiReplying]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || isAiReplying) return;
        
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
                {conversationMessages.map(msg => {
                    const isOwnMessage = msg.senderId === user.id;
                    const isTranslated = !isOwnMessage && msg.originalText && msg.originalText !== msg.text;
                    
                    return (
                        <div
                            key={msg.id}
                            className={`p-3 rounded-lg max-w-[70%] relative group ${
                                isOwnMessage
                                    ? 'self-end bg-blue-600 text-white'
                                    : 'self-start bg-white text-gray-800 shadow-sm'
                            }`}
                             onMouseEnter={() => isTranslated && setShowOriginal(msg.id)}
                             onMouseLeave={() => isTranslated && setShowOriginal(null)}
                        >
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                             {isTranslated && (
                                <div className="text-xs font-bold text-blue-400 mt-1 flex items-center gap-1">
                                    <Globe size={12}/> 
                                    <span>Translated</span>
                                </div>
                            )}
                            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-200' : 'text-gray-400'} text-right`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {isTranslated && showOriginal === msg.id && (
                                <div className="absolute bottom-full mb-1 left-0 w-full max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                                    <strong>Original:</strong> {msg.originalText}
                                </div>
                            )}
                        </div>
                    );
                })}
                {isAiReplying && (
                     <div className="self-start bg-white text-gray-800 shadow-sm p-3 rounded-lg max-w-[70%] flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 bg-white border-t">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={isAiReplying ? "Replying..." : "Type a message..."}
                    disabled={isAiReplying}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    aria-label="Chat message input"
                />
            </form>
        </>
    );
};
