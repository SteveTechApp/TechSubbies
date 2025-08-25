import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { MessageCircle, X, Loader } from './Icons.tsx';

interface ChatMessage {
    role: 'user' | 'ai';
    text: string;
}

export const AIAssistant = () => {
    const { chatSession } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'ai', text: "Hello! I'm the TechSubbies AI Assistant. How can I help you today?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chatSession || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const stream = await chatSession.sendMessageStream({ message: userInput });
            let aiResponseText = '';
            setMessages(prev => [...prev, { role: 'ai', text: '' }]); // Add empty AI message bubble

            for await (const chunk of stream) {
                aiResponseText += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = aiResponseText;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message to AI:", error);
            setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 z-50"
                aria-label="Open AI Assistant"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat Widget */}
            {isOpen && (
                <div className="fixed bottom-20 right-6 w-full max-w-sm h-[60vh] bg-white rounded-lg shadow-2xl flex flex-col chat-widget-animate z-50">
                    {/* Header */}
                    <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                        <h3 className="font-bold text-lg text-gray-800">TechSubbies AI Assistant</h3>
                        <p className="text-sm text-gray-500">Powered by Gemini</p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg max-w-[85%] whitespace-pre-wrap ${
                                    msg.role === 'user' ? 'chat-message-user' : 'chat-message-ai'
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                         {isLoading && messages[messages.length - 1].role === 'user' && (
                            <div className="chat-message-ai p-3 rounded-lg max-w-[85%] flex items-center">
                                <Loader className="animate-spin w-5 h-5" />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask a question..."
                            disabled={isLoading}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            aria-label="Chat input"
                        />
                    </form>
                </div>
            )}
        </>
    );
};
