import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Conversation } from '../types';
import { useAppContext } from '../context/InteractionContext';
import { Send, Loader, Globe } from './Icons';
import { formatTimeAgo } from '../utils/dateFormatter';

interface ChatWindowProps {
    conversation: Conversation;
}

// How often to poll the backend for new messages while a conversation is
// open - there's no WebSocket/push connection, so this is what makes a
// reply from the other party show up without a manual refresh. See
// refreshConversationMessages in context/InteractionContext.tsx.
const MESSAGE_POLL_INTERVAL_MS = 4000;

export const ChatWindow = ({ conversation }: ChatWindowProps) => {
    const { user, messages, findUserById, sendMessage, refreshConversationMessages, language, geminiService } = useAppContext();
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Per-message translation state, keyed by message id. Kept local to
    // this component (not in shared app state) since a translation is just
    // a view of a message for this reader, not something anyone else needs.
    const [translations, setTranslations] = useState<Record<string, { text: string; sourceLanguage: string }>>({});
    const [translating, setTranslating] = useState<Record<string, boolean>>({});
    const [translateErrors, setTranslateErrors] = useState<Record<string, string>>({});
    const [showingOriginal, setShowingOriginal] = useState<Record<string, boolean>>({});

    const handleTranslate = async (messageId: string, text: string) => {
        if (translations[messageId]) {
            setShowingOriginal(prev => ({ ...prev, [messageId]: !prev[messageId] }));
            return;
        }
        setTranslating(prev => ({ ...prev, [messageId]: true }));
        setTranslateErrors(prev => ({ ...prev, [messageId]: '' }));
        const result = await geminiService.translateText(text, language);
        setTranslating(prev => ({ ...prev, [messageId]: false }));
        if (result.error || !result.translatedText) {
            setTranslateErrors(prev => ({ ...prev, [messageId]: result.error || 'Could not translate this message.' }));
            return;
        }
        setTranslations(prev => ({ ...prev, [messageId]: { text: result.translatedText!, sourceLanguage: result.detectedSourceLanguage || '' } }));
    };

    const otherParticipantId = conversation.participantIds.find(id => id !== user!.id)!;
    const otherParticipant = findUserById(otherParticipantId);

    const conversationMessages = messages
        .filter(m => m.conversationId === conversation.id)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    useLayoutEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationMessages]);

    useEffect(() => {
        const interval = setInterval(() => {
            refreshConversationMessages(conversation.id);
        }, MESSAGE_POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [conversation.id, refreshConversationMessages]);

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
                    {conversationMessages.map(msg => {
                        const isOwnMessage = msg.senderId === user!.id;
                        const translation = translations[msg.id];
                        const isShowingOriginal = showingOriginal[msg.id];
                        const displayText = translation && !isShowingOriginal ? translation.text : msg.text;

                        return (
                        <div key={msg.id} className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                            {!isOwnMessage && <img src={otherParticipant.profile.avatar} alt="avatar" className="w-6 h-6 rounded-full self-start"/>}
                             <div className={`p-3 rounded-lg max-w-xs md:max-w-md break-words ${isOwnMessage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p>{displayText}</p>
                                <div className={`flex items-center gap-2 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                    <p className={`text-xs ${isOwnMessage ? 'text-blue-200' : 'text-gray-500'}`}>{formatTimeAgo(msg.timestamp)}</p>
                                    {/* Translation only makes sense for messages from the other
                                        person - translating your own outgoing text into your own
                                        preferred language would just show it back unchanged. */}
                                    {!isOwnMessage && (
                                        <button
                                            onClick={() => handleTranslate(msg.id, msg.text)}
                                            disabled={translating[msg.id]}
                                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 underline disabled:opacity-60"
                                        >
                                            <Globe size={12} />
                                            {translating[msg.id]
                                                ? 'Translating...'
                                                : translation
                                                    ? (isShowingOriginal ? 'Show translation' : `Show original${translation.sourceLanguage ? ` (${translation.sourceLanguage})` : ''}`)
                                                    : 'Translate'}
                                        </button>
                                    )}
                                </div>
                                {translateErrors[msg.id] && (
                                    <p className="text-xs mt-1 text-red-500">{translateErrors[msg.id]}</p>
                                )}
                            </div>
                        </div>
                        );
                    })}
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
