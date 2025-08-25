import React, { useState, useEffect } from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { FeatureCard } from '../components/FeatureCard.tsx';
import { Briefcase, Star, User } from '../components/Icons.tsx';
import { Page } from '../types/index.ts';

interface ForEngineersPageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

// Curated list of high-quality, relevant hero images for engineers
const ENGINEER_HERO_IMAGES = [
    'https://images.unsplash.com/photo-1581092921462-205273467433?q=80&w=2070&auto=format&fit=crop', // Technician working on server rack
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop', // Close up of hands on laptop with code
    'https://images.unsplash.com/photo-1621924519390-78132692e293?q=80&w=2070&auto=format&fit=crop', // Wiring a network patch panel
    'https://images.unsplash.com/photo-1614730321455-5c26a8d6e1a4?q=80&w=1974&auto=format&fit=crop', // Audio mixing console
    'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=1974&auto=format&fit=crop', // Close up of a circuit board
];

export const ForEngineersPage = ({ onNavigate, onHowItWorksClick }: ForEngineersPageProps) => {
    const [heroImage, setHeroImage] = useState('');

    useEffect(() => {
        // Select a random hero image on component mount
        setHeroImage(ENGINEER_HERO_IMAGES[Math.floor(Math.random() * ENGINEER_HERO_IMAGES.length)]);
    }, []);

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
            <main className="flex-grow pt-24">
                {/* Hero Section */}
                <section 
                    className="relative text-white text-center min-h-[40vh] flex items-center justify-center px-4 bg-cover bg-center"
                    style={{ backgroundImage: `url('${heroImage}')` }}
                >
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Build Your Freelance Career.</h1>
                        <p className="text-lg md:text-xl mx-auto mb-8">Showcase your specialist skills, set your real-time availability, and let top AV & IT companies apply to you. Take control of your contracting work.</p>
                        <button onClick={() => onNavigate('engineerSignUp')} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Create Your Profile</button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center mb-10">The Tools You Need to Succeed</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <FeatureCard icon={User} title="Your Basic Profile (Free)">
                                Get started by creating your free profile. Add your core discipline, location, experience, top skills, and set your availability so companies can find you.
                            </FeatureCard>
                            <FeatureCard icon={Star} title="The Skills Profile (Premium)">
                                Supercharge your presence for just <strong>£15/month</strong>. Upgrade to add specialist roles, get rated on granular skills, showcase visual case studies, and appear higher in search results.
                            </FeatureCard>
                            <FeatureCard icon={Briefcase} title="Direct Opportunities">
                                Once your profile is live, companies can find you and message you directly about roles. No recruitment fees, just direct connections.
                            </FeatureCard>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-12 bg-blue-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold mb-4">Ready to Find Your Next Project?</h2>
                        <p className="text-xl mb-8">Join a growing network of elite tech professionals.</p>
                        <button onClick={() => onNavigate('engineerSignUp')} className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105">Sign Up for Free</button>
                    </div>
                </section>
            </main>
            <Footer onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
        </div>
    );
};