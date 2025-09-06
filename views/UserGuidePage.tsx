import React, { useState, useMemo } from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { Page } from '../types/index.ts';
import { FAQ_DATA } from '../data/faqData.ts';
import { LifeBuoy, Search, User, Building, ChevronDown } from '../components/Icons.tsx';

interface HelpCenterPageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

const FaqAccordionItem = ({ faq, isOpen, onToggle }: { faq: { question: string, answer: string }, isOpen: boolean, onToggle: () => void }) => (
    <div className="border-b border-gray-200">
        <button
            onClick={onToggle}
            className="w-full flex justify-between items-center py-2 text-left font-semibold text-sm text-gray-800 hover:bg-gray-50 px-2"
        >
            <span>{faq.question}</span>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>
        <div 
            className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        >
            <div className="overflow-hidden">
                <div className="pb-2 px-2">
                    <p className="text-gray-600 text-xs">{faq.answer}</p>
                </div>
            </div>
        </div>
    </div>
);


export const HelpCenterPage = ({ onNavigate, onHowItWorksClick }: HelpCenterPageProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('engineers');
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    const filteredFaqs = useMemo(() => {
        if (!searchTerm) {
            return FAQ_DATA;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        const filter = (faqs: any[]) => faqs.filter(faq =>
            faq.question.toLowerCase().includes(lowercasedTerm) ||
            faq.answer.toLowerCase().includes(lowercasedTerm)
        );
        return {
            engineers: filter(FAQ_DATA.engineers),
            companies: filter(FAQ_DATA.companies),
            general: filter(FAQ_DATA.general),
        };
    }, [searchTerm]);
    
    const getTabClass = (tabName: string) => `px-4 py-2 font-semibold text-sm rounded-t-lg transition-colors duration-200 flex items-center gap-2 border-b-2 ${activeTab === tabName ? 'bg-white text-blue-600 border-blue-600' : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100 hover:border-gray-300'}`;

    const handleToggleFaq = (question: string) => {
        setOpenFaq(prev => prev === question ? null : question);
    };

    const renderFaqList = (faqs: { question: string, answer: string }[]) => (
        <div className="space-y-1">
            {faqs.length > 0 ? (
                faqs.map(faq => (
                    <FaqAccordionItem 
                        key={faq.question} 
                        faq={faq}
                        isOpen={openFaq === faq.question}
                        onToggle={() => handleToggleFaq(faq.question)}
                    />
                ))
            ) : (
                 <p className="text-center py-8 text-gray-500">No results found for "{searchTerm}".</p>
            )}
        </div>
    );

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
            <main className="flex-grow pt-14">
                 <div className="bg-blue-800 text-white py-4">
                    <div className="container mx-auto px-4 text-center max-w-3xl">
                        <LifeBuoy size={32} className="mx-auto mb-2 text-blue-300" />
                        <h1 className="text-2xl font-extrabold">Help Center</h1>
                        <p className="text-sm text-blue-200 mt-2">Find answers to common questions about TechSubbies.com.</p>
                        <div className="mt-4 relative max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for answers..."
                                className="w-full rounded-full py-2 pl-12 pr-4 text-gray-800"
                            />
                        </div>
                    </div>
                </div>
                
                 <div className="container mx-auto px-4 py-4 max-w-4xl">
                    <div className="flex justify-center border-b border-gray-300 mb-3">
                        <button onClick={() => setActiveTab('engineers')} className={getTabClass('engineers')}><User /> For Engineers</button>
                        <button onClick={() => setActiveTab('companies')} className={getTabClass('companies')}><Building /> For Companies</button>
                        <button onClick={() => setActiveTab('general')} className={getTabClass('general')}>General</button>
                    </div>

                    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                        {activeTab === 'engineers' && renderFaqList(filteredFaqs.engineers)}
                        {activeTab === 'companies' && renderFaqList(filteredFaqs.companies)}
                        {activeTab === 'general' && renderFaqList(filteredFaqs.general)}
                    </div>
                </div>

            </main>
            <Footer onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
        </div>
    );
};