// FIX: The AIAssistant component was incomplete and did not return a JSX element, causing a type error.
// The component has been fully implemented with a draggable floating button and a functional chat window that uses the Gemini API.
import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useAppContext } from '../context/InteractionContext';
import { MessageCircle, X, Loader, Send } from './Icons';

interface ChatMessage {
    role: 'user' | 'ai';
    text: string;
}

export const AIAssistant = () => {
    const { chatSession, currentPageContext } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'ai', text: "Hello! I'm the TechSubbies.com AI Assistant. I have context of the page you're on, so feel free to ask specific questions. How can I help?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- Draggable Logic ---
    const fabRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState<{x: number, y: number} | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [hasMoved, setHasMoved] = useState(false);

    useEffect(() => {
        // Set initial position to bottom right only after component mounts to ensure window object is available
        if (window) {
            setPosition({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
        }

        const handleResize = () => {
            if (window) {
                setPosition(prev => {
                    if (!prev) return null;
                    const fabWidth = fabRef.current?.offsetWidth || 64;
                    const fabHeight = fabRef.current?.offsetHeight || 64;
                    return {
                        x: Math.min(prev.x, window.innerWidth - fabWidth - 20),
                        y: Math.min(prev.y, window.innerHeight - fabHeight - 20)
                    };
                });
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
        if (isOpen) return;
        setHasMoved(false);
        setIsDragging(true);
        fabRef.current?.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
        if (!isDragging || isOpen) return;

        if (!hasMoved && (Math.abs(e.movementX) > 3 || Math.abs(e.movementY) > 3)) {
            setHasMoved(true);
        }

        setPosition(pos => {
            if (!pos) return null;
            const fabWidth = fabRef.current?.offsetWidth || 64;
            const fabHeight = fabRef.current?.offsetHeight || 64;
            const newX = pos.x + e.movementX;
            const newY = pos.y + e.movementY;
            return {
                x: Math.max(20, Math.min(newX, window.innerWidth - fabWidth - 20)),
                y: Math.max(20, Math.min(newY, window.innerHeight - fabHeight - 20)),
            };
        });
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
        if (isOpen) return;
        setIsDragging(false);
        fabRef.current?.releasePointerCapture(e.pointerId);
        if (!hasMoved) {
            setIsOpen(true);
        }
    };
    
    const handleSendMessage = async () => {
        if (!userInput.trim() || !chatSession) return;
        const userMessage: ChatMessage = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        const currentInput = userInput;
        setUserInput('');

        try {
            const contextPrompt = `The user is currently on the "${currentPageContext}" page. Please tailor your answer to this context. User question: ${currentInput}`;
            const result = await chatSession.sendMessage({ message: contextPrompt });
            
            const aiMessage: ChatMessage = { role: 'ai', text: result.text.trim() };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("AI Assistant error:", error);
            const errorMessage: ChatMessage = { role: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    useLayoutEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);


    if (!position) {
        return null;
    }
    
    return (
        <>
            <div 
                className={`fixed bg-white rounded-lg shadow-2xl flex flex-col z-50 transform-gpu transition-opacity duration-300 ${isOpen ? 'opacity-100 animate-fade-in-up' : 'opacity-0 pointer-events-none'}`}
                style={{
                    width: '320px',
                    height: '420px',
                    bottom: '20px',
                    right: '20px'
                }}
            >
                <header className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg flex-shrink-0">
                    <h3 className="font-bold">AI Assistant</h3>
                    <button onClick={() => setIsOpen(false)}><X /></button>
                </header>
                <div className="flex-grow p-3 overflow-y-auto custom-scrollbar flex flex-col">
                    {messages.map((msg, index) => (
                        <div key={index} className={`mb-3 p-2 rounded-lg max-w-[85%] break-words ${msg.role === 'ai' ? 'bg-gray-200 text-gray-800 self-start' : 'bg-blue-500 text-white self-end ml-auto'}`}>
                            <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                        </div>
                    ))}
                    {isLoading && <div className="self-start mb-3 p-2 rounded-lg bg-gray-200"><Loader className="animate-spin w-6 h-6 text-blue-500"/></div>}
                    <div ref={messagesEndRef} />
                </div>
                <form 
                    className="p-3 border-t flex gap-2 flex-shrink-0"
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                >
                    <input 
                        type="text" 
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-grow border p-2 rounded-md"
                        disabled={isLoading}
                    />
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded-md disabled:bg-blue-300" disabled={isLoading || !userInput.trim()}>
                        <Send />
                    </button>
                </form>
            </div>
            
            <button
                ref={fabRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`fixed z-40 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg transform-gpu transition-opacity duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                style={{
                    left: 0,
                    top: 0,
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    touchAction: 'none'
                }}
                aria-label="Open AI Assistant"
            >
                <MessageCircle size={32} />
            </button>
        </>
    );
};