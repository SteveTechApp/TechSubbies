import React, { useState, useEffect } from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { FeatureCard } from '../components/FeatureCard.tsx';
import { PenSquare, Search, Handshake, DollarSign, Users, Briefcase, FileText } from '../components/Icons.tsx';
import { Page } from '../types/index.ts';
import { HERO_IMAGES } from '../data/assets.ts';

interface ForCompaniesPageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

export const ForCompaniesPage = ({ onNavigate, onHowItWorksClick }: ForCompaniesPageProps) => {
    const [heroImage, setHeroImage] = useState('');

    useEffect(() => {
        // Select a random hero image on component mount
        setHeroImage(HERO_IMAGES.companies[Math.floor(Math.random() * HERO_IMAGES.companies.length)]);
    }, []);

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
            <main className="flex-grow pt-14">
                {/* Hero Section */}
                <section 
                    className="relative text-white text-center min-h-[40vh] flex items-center justify-center px-4 bg-cover bg-center"
                    style={{ backgroundImage: `url('${heroImage}')` }}
                >
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-xl md:text-3xl font-extrabold mb-2">The Talent You Need. The Moment You Need It.</h1>
                        <p className="text-xs md:text-sm mx-auto mb-4">Stop searching, start building. Post contracts for free and instantly access our network of skilled AV & IT freelance engineers with confirmed availability.</p>
                        <button onClick={() => onNavigate('login')} className="bg-blue-600 text-white font-bold py-1.5 px-5 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Find Talent for Free</button>
                    </div>
                </section>

                {/* Why It's Free Section */}
                <section className="py-4 bg-white">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <div className="mb-3">
                            <h2 className="text-xl font-bold text-gray-800 mb-1">Our Project-First Model: Why It's Free for You</h2>
                            <p className="text-xs text-gray-600">
                                We believe the best way to build the largest, most engaged network of elite tech talent is to remove every barrier for companies like yours. When you can post contracts freely, you create a constant stream of high-quality opportunities. This vibrant marketplace becomes the go-to destination for top-tier engineers, who are then happy to subscribe for premium tools to showcase their skills for those projects.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col items-center">
                                <div className="p-2 bg-blue-100 rounded-full mb-2"><Briefcase size={24} className="text-blue-600"/></div>
                                <h3 className="font-bold text-sm">You Post Contracts for Free</h3>
                                <p className="text-gray-500 text-xs">Unlimited postings create maximum opportunity.</p>
                            </div>
                             <div className="flex flex-col items-center">
                                <div className="p-2 bg-green-100 rounded-full mb-2"><Users size={24} className="text-green-600"/></div>
                                <h3 className="font-bold text-sm">Top Engineers Join</h3>
                                <p className="text-gray-500 text-xs">The best talent goes where the best projects are.</p>
                            </div>
                             <div className="flex flex-col items-center">
                                <div className="p-2 bg-yellow-100 rounded-full mb-2"><DollarSign size={24} className="text-yellow-600"/></div>
                                <h3 className="font-bold text-sm">Engineers Subscribe</h3>
                                <p className="text-gray-500 text-xs">Engineers pay for premium tools, funding the platform.</p>
                            </div>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-gray-700">
                            It's a win-win. You get free, direct access to the best talent pool, and engineers get a platform dedicated to their career growth.
                        </p>
                    </div>
                </section>
                
                {/* Features Section */}
                <section className="py-4 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-xl font-bold text-center mb-3">Project Resourcing, Without the Hassle</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-7xl mx-auto">
                            <FeatureCard icon={Search} title="AI Smart Match">
                                Leverage our AI to get a ranked list of the best-fit candidates instantly, saving you hours of manual vetting.
                            </FeatureCard>
                            <FeatureCard icon={FileText} title="Streamlined Contracts">
                                Generate and send contracts for e-signature directly on the platform. No more paperwork or email chains.
                            </FeatureCard>
                            <FeatureCard icon={DollarSign} title="Secure Escrow Payments">
                                Fund project milestones into a secure escrow account. Release payments with a click upon work approval, ensuring trust and transparency.
                            </FeatureCard>
                            <FeatureCard icon={Users} title="Build Your Talent Pool">
                                After a successful project, add your best freelancers to a curated "Talent Pool" for easy direct engagement on future work.
                            </FeatureCard>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-4 bg-gray-800 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-xl font-bold mb-2">Ready to Build Your Project Team?</h2>
                        <p className="text-sm mb-4">Find the perfect tech subcontractor for your next project today.</p>
                        <button onClick={() => onNavigate('login')} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Post Your First Contract</button>
                    </div>
                </section>
            </main>
            <Footer onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
        </div>
    );
};