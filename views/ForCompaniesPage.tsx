import React, { useState, useEffect } from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { FeatureCard } from '../components/FeatureCard.tsx';
import { PenSquare, Search, Handshake } from '../components/Icons.tsx';
import { Page } from '../types/index.ts';

interface ForCompaniesPageProps {
    onNavigate: (page: Page) => void;
}

// Curated list of high-quality, relevant hero images for companies
const COMPANY_HERO_IMAGES = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop', // Team collaborating in a modern office
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop', // Professionals reviewing plans
    'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop', // A project meeting in progress
    'https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=2071&auto=format&fit=crop', // Whiteboard session with sticky notes
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop', // Modern conference room with large screen
];

export const ForCompaniesPage = ({ onNavigate }: ForCompaniesPageProps) => {
    const [heroImage, setHeroImage] = useState('');

    useEffect(() => {
        // Select a random hero image on component mount
        setHeroImage(COMPANY_HERO_IMAGES[Math.floor(Math.random() * COMPANY_HERO_IMAGES.length)]);
    }, []);

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} />
            <main className="flex-grow pt-24">
                {/* Hero Section */}
                <section 
                    className="relative text-white text-center min-h-[40vh] flex items-center justify-center px-4 bg-cover bg-center"
                    style={{ backgroundImage: `url('${heroImage}')` }}
                >
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">The Talent You Need. The Moment You Need It.</h1>
                        <p className="text-lg md:text-xl mx-auto mb-8">Stop searching, start building. Post jobs for free and instantly access our network of skilled AV & IT freelance engineers with confirmed availability.</p>
                        <button onClick={() => onNavigate('login')} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Find Talent for Free</button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center mb-10">Hiring, Without the Hassle</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <FeatureCard icon={PenSquare} title="Post Jobs for Free">
                                Describe your project and requirements in minutes. Our platform is completely free for companies to post jobs and find talent. No hidden costs.
                            </FeatureCard>
                            <FeatureCard icon={Search} title="Find Skilled Specialists">
                                Search our database of qualified engineers with advanced filters for specialist skills, day rate, and real-time availability.
                            </FeatureCard>
                            <FeatureCard icon={Handshake} title="Engage Directly. No Fees.">
                                Connect, negotiate, and contract directly with freelancers. We get out of the way, saving you from costly placement fees and delays.
                            </FeatureCard>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-12 bg-gray-800 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold mb-4">Ready to Build Your Team?</h2>
                        <p className="text-xl mb-8">Find the perfect tech subcontractor for your next project today.</p>
                        <button onClick={() => onNavigate('login')} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Post Your First Job</button>
                    </div>
                </section>
            </main>
            <Footer onNavigate={onNavigate} />
        </div>
    );
};