import React, { useState } from 'react';
import { Page } from '../types';
import { PageHeader } from '../components/PageHeader';
import { PlayCircle, Loader, FileText, X } from '../components/Icons';
import { useAppContext } from '../context/AppContext';

interface TutorialsPageProps {
  onNavigate: (page: Page) => void;
}

interface TutorialTopic {
  title: string;
  description: string;
}

interface GeneratedTutorial {
  title: string;
  script: string;
  videoUrl: string;
}

const TUTORIAL_TOPICS: TutorialTopic[] = [
    { title: "How to Create a Skills Profile", description: "Learn how to build a premium profile that gets you noticed by top companies." },
    { title: "How to Post Your First Job", description: "A guide for companies to create effective job posts that attract the right talent." },
    { title: "Using AI Smart Match to Hire", description: "See how our AI instantly shortlists the best candidates for your role." },
    { title: "Managing Contracts & Payments", description: "A walkthrough of our secure contracting and milestone payment system." },
];

const LOADING_MESSAGES = [
    "Spinning up the video generators...",
    "Teaching the AI to be a film director...",
    "Rendering pixels and soundwaves...",
    "This can take a moment, great content is on its way!",
    "Finalizing the script and syncing audio...",
];

export const TutorialsPage = ({ onNavigate }: TutorialsPageProps) => {
    const { geminiService } = useAppContext();
    const [selectedTutorial, setSelectedTutorial] = useState<GeneratedTutorial | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
    const [error, setError] = useState('');

    const handleGenerateVideo = async (topic: TutorialTopic) => {
        setIsLoading(true);
        setSelectedTutorial(null);
        setError('');

        const messageInterval = setInterval(() => {
            setLoadingMessage(prev => {
                const currentIndex = LOADING_MESSAGES.indexOf(prev);
                return LOADING_MESSAGES[(currentIndex + 1) % LOADING_MESSAGES.length];
            });
        }, 2000);

        // Simulate a delay for the generation process
        await new Promise(resolve => setTimeout(resolve, 3000));

        const result = await geminiService.generateTutorialVideo(topic.title);
        
        clearInterval(messageInterval);
        setIsLoading(false);

        if (result.error) {
            setError(result.error);
        } else {
            setSelectedTutorial(result);
        }
    };

    return (
        <div className="bg-gray-50">
            <PageHeader onBack={() => onNavigate('landing')} />

            {/* Hero Section */}
            <section className="bg-gray-800 text-white py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Video Tutorials</h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
                        Watch short, AI-generated guides to learn how to get the most out of the TechSubbies platform.
                    </p>
                </div>
            </section>

            {/* Tutorial List Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold text-center mb-8">Choose a Tutorial to Watch</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {TUTORIAL_TOPICS.map((topic, index) => (
                            <button
                                key={index}
                                onClick={() => handleGenerateVideo(topic)}
                                disabled={isLoading}
                                className="bg-white p-6 rounded-lg shadow-lg text-left h-full flex flex-col items-start hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="bg-blue-100 p-3 rounded-full mb-4">
                                    <PlayCircle className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">{topic.title}</h3>
                                <p className="text-gray-600 mt-2 flex-grow">{topic.description}</p>
                                <span className="mt-4 text-blue-600 font-bold flex items-center">
                                    Watch Now &rarr;
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Modal for Loading/Displaying Video */}
            {(isLoading || selectedTutorial || error) && (
                 <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in-up" style={{animationDuration: '0.3s'}}>
                    <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col relative">
                        <button onClick={() => { setIsLoading(false); setSelectedTutorial(null); setError(''); }} className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg text-gray-600 hover:text-black z-10">
                            <X size={24} />
                        </button>
                        
                        {isLoading && (
                            <div className="p-12 text-center">
                                <Loader className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-gray-800">Generating Your Tutorial...</h3>
                                <p className="text-gray-500 mt-2">{loadingMessage}</p>
                            </div>
                        )}

                        {error && (
                            <div className="p-12 text-center">
                                <h3 className="text-2xl font-bold text-red-600">An Error Occurred</h3>
                                <p className="text-gray-500 mt-2">{error}</p>
                            </div>
                        )}

                        {selectedTutorial && (
                            <>
                                <header className="p-4 border-b flex-shrink-0">
                                    <h2 className="text-2xl font-bold">{selectedTutorial.title}</h2>
                                </header>
                                <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
                                    <div className="w-full md:w-2/3 bg-black flex-shrink-0">
                                        <video
                                            key={selectedTutorial.videoUrl}
                                            className="w-full h-full object-contain"
                                            controls
                                            autoPlay
                                        >
                                            <source src={selectedTutorial.videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                    <div className="w-full md:w-1/3 p-4 flex flex-col">
                                        <h3 className="text-lg font-bold mb-2 flex items-center flex-shrink-0">
                                            <FileText size={18} className="mr-2" />
                                            Video Script
                                        </h3>
                                        <div className="overflow-y-auto custom-scrollbar flex-grow pr-2">
                                            <p className="text-gray-700 whitespace-pre-wrap">{selectedTutorial.script}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                 </div>
            )}
        </div>
    );
};