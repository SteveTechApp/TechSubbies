import React, { useState, useEffect } from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { Page } from '../types/index.ts';
import { Search, User, Building, Zap } from '../components/Icons.tsx';
import { FeatureSlideshow } from '../components/FeatureSlideshow.tsx';
import { HERO_IMAGES } from '../data/assets.ts';
import { HighlightCard } from '../components/HighlightCard.tsx';
import { useAppContext } from '../context/AppContext.tsx';

interface LandingPageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

export const LandingPage = ({ onNavigate, onHowItWorksClick }: LandingPageProps) => {
    const { companies } = useAppContext();
    const [heroImage, setHeroImage] = useState('');

    useEffect(() => {
        setHeroImage(HERO_IMAGES.landing[Math.floor(Math.random() * HERO_IMAGES.landing.length)]);
    }, []);

    const featuredCompanies = companies.filter(c => c.consentToFeature);

    return (
        <div className="bg-white flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
            <main className="flex-grow pt-14">
                <section 
                    className="relative text-white text-center min-h-[60vh] flex items-center justify-center px-4 bg-cover bg-center"
                    style={{ backgroundImage: `url('${heroImage}')` }}
                >
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <div className="relative z-10 max-w-4xl">
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">The Network for Freelance Tech Talent</h1>
                        <p className="text-lg md:text-xl mx-auto mb-8">Instantly connect with verified AV & IT engineers with confirmed availability. Post your contract for free and find the right skills, right now.</p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <button onClick={() => onNavigate('login')} className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                                Find Talent For Free
                            </button>
                            <button onClick={() => onNavigate('login')} className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-black transition-colors">
                                Find Work
                            </button>
                        </div>
                    </div>
                </section>

                {featuredCompanies.length > 0 && (
                    <section className="py-8 bg-gray-100">
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Trusted by leading companies</h2>
                            <div className="flex justify-center items-center gap-8 flex-wrap">
                               {featuredCompanies.map(company => (
                                   <img key={company.id} src={company.logo} alt={company.name} className="h-10 object-contain" title={company.name} />
                               ))}
                            </div>
                        </div>
                    </section>
                )}
                
                <section id="how-it-works" className="py-16 bg-white">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <h2 className="text-3xl font-bold text-center mb-4">A Smarter Way to Connect</h2>
                        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">TechSubbies isn't another job board. It's a skill-matching engine designed for the speed and precision today's tech projects demand.</p>
                        <div className="w-full aspect-[16/9] lg:aspect-[2/1] max-w-5xl mx-auto">
                           <FeatureSlideshow />
                        </div>
                    </div>
                </section>

                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-bold mb-4">For Companies</h2>
                                <p className="text-gray-600 mb-6">Stop searching, start building. Get direct access to the talent you need, exactly when you need it.</p>
                                <ul className="space-y-4 text-left">
                                    <li className="flex items-start"><Building className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-1" /><span><strong>Post Contracts for Free:</strong> No placement fees, no hidden costs. Attract the best talent by creating a vibrant marketplace.</span></li>
                                    <li className="flex items-start"><Zap className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-1" /><span><strong>AI Smart Match:</strong> Instantly get a ranked list of the best-fit candidates based on their detailed, rated skills.</span></li>
                                    <li className="flex items-start"><User className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-1" /><span><strong>Build Your Talent Pool:</strong> Add your best freelancers to a private list for direct invitations to future projects.</span></li>
                                </ul>
                                 <button onClick={() => onNavigate('forCompanies')} className="mt-8 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700">Learn More</button>
                            </div>
                             <div className="text-center md:text-left">
                                <h2 className="text-3xl font-bold mb-4">For Engineers</h2>
                                <p className="text-gray-600 mb-6">Showcase your specialist skills, get matched with high-value contracts, and build your freelance business.</p>
                                <ul className="space-y-4 text-left">
                                     <li className="flex items-start"><Search className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-1" /><span><strong>Build a Skills Profile:</strong> Go beyond a CV. Add specialist roles and rate your competency on granular skills to stand out.</span></li>
                                     <li className="flex items-start"><User className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-1" /><span><strong>Direct Communication:</strong> Talk directly with hiring managers. No recruiters, no middlemen.</span></li>
                                     <li className="flex items-start"><Building className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-1" /><span><strong>Build Your Client Network:</strong> Every completed contract adds a permanent connection to your private network.</span></li>
                                </ul>
                                <button onClick={() => onNavigate('forEngineers')} className="mt-8 bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-900">Learn More</button>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="py-16 bg-blue-800 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Join the Network Today</h2>
                        <p className="text-blue-200 mb-8">Whether you're hiring or looking for your next contract, TechSubbies is your dedicated platform.</p>
                        <button onClick={() => onNavigate('login')} className="bg-white text-blue-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105">
                            Get Started
                        </button>
                    </div>
                </section>
            </main>
            <Footer onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
        </div>
    );
};