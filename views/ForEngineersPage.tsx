import React from 'react';
import { Footer } from '../components/Footer.tsx';
import { PageHeader } from '../components/PageHeader.tsx';
import { FeatureCard } from '../components/FeatureCard.tsx';
import { UserCog, CalendarDays, Briefcase } from '../components/Icons.tsx';

interface ForEngineersPageProps {
    onNavigateHome: () => void;
    onLoginClick: () => void;
}

export const ForEngineersPage = ({ onNavigateHome, onLoginClick }: ForEngineersPageProps) => {
    return (
        <div className="bg-gray-50">
            <PageHeader onBack={onNavigateHome} />
            <main>
                {/* Hero Section */}
                <section 
                    className="relative text-white text-center min-h-[50vh] flex items-center justify-center px-4 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593349319623-7a4c16b1464e?q=80&w=1974&auto=format&fit=crop')" }}
                >
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Build Your Freelance Career.</h1>
                        <p className="text-lg md:text-xl mx-auto mb-8">Showcase your specialist skills, set your real-time availability, and let top AV & IT companies apply to you. Take control of your contracting work.</p>
                        <button onClick={onLoginClick} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Create Your Profile</button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center mb-12">The Tools You Need to Succeed</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <FeatureCard icon={UserCog} title="Create a Powerful Profile">
                                Go beyond a simple CV. Add specialist job roles with detailed, rated skills to prove your expertise in niche areas like Crestron, Cisco, or AWS.
                            </FeatureCard>
                            <FeatureCard icon={CalendarDays} title="Set Real-Time Availability">
                                A simple, clear calendar shows companies you're ready for new projects. Sync it with your personal calendar to reduce unwanted contact.
                            </FeatureCard>
                            <FeatureCard icon={Briefcase} title="Get Matched Directly">
                                Companies find you based on your skills and availability. Receive direct offers, negotiate terms, and manage your contracts all in one place.
                            </FeatureCard>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-20 bg-blue-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold mb-4">Ready to Find Your Next Project?</h2>
                        <p className="text-xl mb-8">Join a growing network of elite tech professionals.</p>
                        <button onClick={onLoginClick} className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105">Sign Up for Free</button>
                    </div>
                </section>
            </main>
            <Footer onLoginClick={onLoginClick} />
        </div>
    );
};