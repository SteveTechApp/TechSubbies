import React, { useState } from 'react';
import { Page } from '../types';
import { useAppContext } from '../context/InteractionContext';
import { PlayCircle, Loader, ArrowLeft, X } from '../components/Icons';

const TUTORIAL_TOPICS = [
    "How to Create an Effective Skills Profile",
    "How to Find and Apply for Jobs",
    "Understanding Contracts and Payments",
    "How to Post a Job and Find Talent (for Companies)",
    "Using AI Tools to Your Advantage",
];

const VideoModal = ({ title, script, videoUrl, onClose }: { title: string, script: string, videoUrl: string, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col relative"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
                </header>
                <main className="flex-grow flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
                    <div className="w-full md:w-2/3 flex-shrink-0">
                         <video src={videoUrl} controls autoPlay className="w-full rounded-lg bg-black">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="w-full md:w-1/3 overflow-y-auto custom-scrollbar pr-2">
                        <h3 className="font-bold mb-2">Video Script</h3>
                        <p className="whitespace-pre-wrap text-sm text-gray-700">{script}</p>
                    </div>
                </main>
            </div>
        </div>
    );
};


export const TutorialsPage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    const { geminiService } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedVideo, setGeneratedVideo] = useState<{ title: string; script: string; videoUrl: string } | null>(null);
    const [loadingTopic, setLoadingTopic] = useState<string | null>(null);

    const handleGenerateVideo = async (topic: string) => {
        setIsLoading(true);
        setLoadingTopic(topic);
        setError('');
        setGeneratedVideo(null);

        const result = await geminiService.generateTutorialVideo(topic);

        if (result.error) {
            setError(result.error);
        } else {
            setGeneratedVideo(result);
        }
        setIsLoading(false);
        setLoadingTopic(null);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <button 
                    // FIX: Replaced string literal with Page enum for type safety.
                    onClick={() => onNavigate(Page.LANDING)} 
                    className="flex items-center mb-6 text-gray-600 hover:text-gray-900 font-semibold"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Main Site
                </button>
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Video Tutorials</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Watch short, AI-generated guides to learn how to use the key features of TechSubbies.com.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg space-y-3">
                    {TUTORIAL_TOPICS.map(topic => (
                        <button
                            key={topic}
                            onClick={() => handleGenerateVideo(topic)}
                            disabled={isLoading}
                            className="w-full flex items-center justify-between text-left p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:bg-gray-100"
                        >
                            <span className="font-semibold text-lg text-gray-800">{topic}</span>
                            {isLoading && loadingTopic === topic ? (
                                <div className="text-center w-8">
                                    <Loader className="animate-spin text-blue-600"/>
                                </div>
                            ) : (
                                <PlayCircle className="text-blue-600"/>
                            )}
                        </button>
                    ))}
                </div>
                {error && <p className="text-center text-red-500 mt-4">{error}</p>}
                
                {isLoading && (
                    <div className="text-center mt-4 text-gray-600">
                        <p>Generating video... This can take a few minutes as the AI model is rendering the content.</p>
                        <p className="text-sm">Please be patient and do not navigate away from the page.</p>
                    </div>
                )}

                {generatedVideo && (
                    <VideoModal 
                        {...generatedVideo}
                        onClose={() => setGeneratedVideo(null)}
                    />
                )}
            </div>
        </div>
    );
};
