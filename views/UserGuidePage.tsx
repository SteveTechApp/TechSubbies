import React, { useState } from 'react';
import { Page } from '../types';
import { FAQ_DATA } from '../data/faqData';
import { ChevronDown, User, Building, LifeBuoy } from '../components/Icons';

interface UserGuidePageProps {
  onNavigate: (page: Page) => void;
}

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4"
            >
                <span className="font-semibold text-lg text-gray-800">{question}</span>
                <ChevronDown className={`w-6 h-6 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="pb-4 pr-6 text-gray-600 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

export const UserGuidePage = ({ onNavigate }: UserGuidePageProps) => {
    const [activeTab, setActiveTab] = useState<'engineers' | 'companies' | 'general'>('engineers');

    const getTabClass = (tabName: string) => `w-full sm:w-auto px-6 py-3 text-center font-semibold border-b-2 transition-colors flex items-center justify-center gap-2 ${ activeTab === tabName ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800' }`;
    
    const renderFaqs = () => {
        const faqs = FAQ_DATA[activeTab];
        return (
            <div className="space-y-4">
                {faqs.map((faq, index) => <FaqItem key={index} {...faq} />)}
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Help Center</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Find answers to the most common questions about using TechSubbies.com.
                    </p>
                </div>
                
                <div className="max-w-4xl mx-auto mb-8 bg-blue-600 text-white p-6 rounded-lg shadow-lg flex flex-col sm:flex-row items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Prefer to watch?</h2>
                        <p className="text-blue-100">Check out our new video tutorials for a guided walkthrough of key features.</p>
                    </div>
                    {/* FIX: Replaced string literal with Page enum for type safety. */}
                    <button onClick={() => onNavigate(Page.TUTORIALS)} className="mt-4 sm:mt-0 bg-white text-blue-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105 flex-shrink-0">
                        View Tutorials
                    </button>
                </div>

                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
                    <nav className="flex flex-col sm:flex-row border-b border-gray-200">
                        <button onClick={() => setActiveTab('engineers')} className={getTabClass('engineers')}>
                            <User /> For Engineers
                        </button>
                        <button onClick={() => setActiveTab('companies')} className={getTabClass('companies')}>
                            <Building /> For Companies
                        </button>
                        <button onClick={() => setActiveTab('general')} className={getTabClass('general')}>
                            <LifeBuoy /> General
                        </button>
                    </nav>
                    <div className="p-6 md:p-8">
                        {renderFaqs()}
                    </div>
                </div>
            </div>
        </div>
    );
};