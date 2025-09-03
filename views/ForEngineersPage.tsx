import React, { useState, useEffect } from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { Page, ProfileTier } from '../types/index.ts';
import { CheckCircle, BarChart, Star, Rocket, Clapperboard, TrendingUp, Award, DollarSign, Users } from '../components/Icons.tsx';
import { HERO_IMAGES } from '../data/assets.ts';

interface ForEngineersPageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start">
        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
        <span className="text-gray-600">{children}</span>
    </li>
);

const TestimonialCard = ({ quote, name, role, avatar }: { quote: string, name: string, role: string, avatar: string }) => (
    <div className="bg-blue-700 p-6 rounded-lg text-center h-full flex flex-col">
        <img src={avatar} alt={name} className="w-20 h-20 rounded-full mx-auto -mt-12 border-4 border-blue-600 shadow-lg"/>
        <p className="text-blue-200 italic my-4 flex-grow">"{quote}"</p>
        <div>
            <p className="font-bold text-white">{name}</p>
            <p className="text-sm text-blue-300">{role}</p>
        </div>
    </div>
);

const FeatureDetailCard = ({ icon: Icon, title, children }: { icon: React.ComponentType<any>, title: string, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-3">
            <Icon className="w-8 h-8 text-blue-500 mr-3" />
            <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-gray-600">{children}</p>
    </div>
);

export const ForEngineersPage = ({ onNavigate, onHowItWorksClick }: ForEngineersPageProps) => {
    const [heroImage, setHeroImage] = useState('');

    useEffect(() => {
        setHeroImage(HERO_IMAGES.engineers[Math.floor(Math.random() * HERO_IMAGES.engineers.length)]);
    }, []);

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
            <main className="flex-grow pt-24">
                <section className="relative text-white text-center min-h-[50vh] flex items-center justify-center px-4 bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }}>
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <div className="relative z-10 max-w-4xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Your Career, Supercharged.</h1>
                        <p className="text-lg md:text-xl mx-auto mb-8">Showcase your specialist skills, get matched with high-value contracts, and take control of your freelance career. All on one dedicated platform.</p>
                        <button onClick={() => onNavigate('login')} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Create Your Free Profile</button>
                    </div>
                </section>
                
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 text-center">
                         <h2 className="text-4xl font-bold text-gray-800 mb-12">How TechSubbies Works For You</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                            <FeatureDetailCard icon={Star} title="Build a Skills Profile">
                                Go beyond a simple CV. Our Skills Profile lets you add specialist roles and rate your competency on granular, industry-specific skills.
                            </FeatureDetailCard>
                            <FeatureDetailCard icon={TrendingUp} title="Get Matched, Not Lost">
                                Stop hoping your CV gets noticed. Our AI matching engine analyzes your detailed skills against company requirements to put you at the top of the list.
                            </FeatureDetailCard>
                             <FeatureDetailCard icon={DollarSign} title="Secure, Fast Payments">
                                Work with confidence. Our integrated escrow system secures your payment for milestones before you even start work.
                            </FeatureDetailCard>
                             <FeatureDetailCard icon={Users} title="Build Your Network">
                                Every completed contract adds the company to your "My Connections" list, creating a valuable, permanent network of clients.
                            </FeatureDetailCard>
                         </div>
                    </div>
                </section>

                <section className="py-12 bg-gray-50">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <h2 className="text-3xl font-bold text-center mb-10">All The Tools You Need</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <FeatureListItem>
                                <strong>Free Basic Profile:</strong> Get started with a professional profile, set your availability, and apply for jobs at no cost.
                            </FeatureListItem>
                             <FeatureListItem>
                                <strong>AI-Powered Tools:</strong> (Premium) Let our AI suggest relevant skills to add to your profile or recommend high-value certifications to boost your career.
                            </FeatureListItem>
                             <FeatureListItem>
                                <strong>Profile Boosts:</strong> (Premium) Get a temporary boost to the top of search results for maximum visibility when you need it most.
                            </FeatureListItem>
                             <FeatureListItem>
                                <strong>Visual Case Studies:</strong> (Premium) Use our storyboard creator to build compelling visual walkthroughs of your best projects.
                            </FeatureListItem>
                             <FeatureListItem>
                                <strong>Direct Communication:</strong> Message companies directly to discuss project details and negotiate terms. No recruiters, no middlemen.
                            </FeatureListItem>
                            <FeatureListItem>
                                <strong>Integrated Contracts & Escrow:</strong> Manage your work agreements directly on the platform, from e-signatures to secure, escrow-funded milestone payments.
                            </FeatureListItem>
                        </div>
                    </div>
                </section>
                
                <section className="py-12 bg-blue-600">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-white mb-16">Hear From Our Engineers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                           <TestimonialCard 
                                avatar="https://xsgames.co/randomusers/assets/avatars/male/74.jpg"
                                name="Neil B."
                                role="Senior AV Engineer"
                                quote="The escrow system is a game-changer for freelancers. Knowing the funds are secured before starting a big milestone gives me total peace of mind. It's the most professional setup I've seen."
                           />
                           <TestimonialCard 
                                avatar="https://xsgames.co/randomusers/assets/avatars/male/15.jpg"
                                name="David C."
                                role="Cloud & Network Architect"
                                quote="I used to spend hours sifting through irrelevant job boards. Now, I let the AI matching do the work. I get notified about projects that are a perfect fit for my AWS and Cisco skills."
                           />
                           <TestimonialCard 
                                avatar="https://xsgames.co/randomusers/assets/avatars/female/10.jpg"
                                name="Samantha G."
                                role="IT Support Specialist"
                                quote="The 'My Connections' feature is brilliant. I'm not just finishing jobs; I'm building a real client list that I can see and track right on the platform. It feels like I'm building a proper business."
                           />
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-gray-800 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold mb-4">Ready to Find Your Next Project?</h2>
                        <p className="text-xl mb-8">Join the UK's dedicated network for freelance tech professionals.</p>
                        <button onClick={() => onNavigate('login')} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                            Sign Up and Get Started
                        </button>
                    </div>
                </section>
            </main>
            <Footer onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
        </div>
    );
};