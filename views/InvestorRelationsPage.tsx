import React from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { Page } from '../types/index.ts';
import { HighlightCard } from '../components/HighlightCard.tsx';
import { RevenueCard } from '../components/RevenueCard.tsx';
import { Zap, Layers, TrendingUp, BrainCircuit, Rocket, BarChart, Users } from '../components/Icons.tsx';

interface InvestorRelationsPageProps {
    onNavigate: (page: Page) => void;
}

export const InvestorRelationsPage = ({ onNavigate }: InvestorRelationsPageProps) => {

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} />
            <main className="flex-grow pt-24">
                {/* Hero Section */}
                <section 
                    className="relative text-white text-center min-h-[40vh] flex items-center justify-center px-4 bg-cover bg-center"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop')` }}
                >
                    <div className="absolute inset-0 bg-blue-900 opacity-80"></div>
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">An Investment in the Future of Work</h1>
                        <p className="text-lg md:text-xl mx-auto">TechSubbies.com is poised to become the essential infrastructure for the freelance tech economy. Discover our high-growth opportunity.</p>
                    </div>
                </section>

                 <section id="investors" className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-lg mb-10 border border-gray-200">
                            <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Executive Summary</h3>
                            <p className="text-gray-700 text-center">TechSubbies.com is a vertically-integrated B2B marketplace solving a critical, dual-sided problem: companies struggle to find qualified, available specialist engineers quickly, while freelance engineers lack a dedicated platform to showcase their niche skills. By leveraging a freemium model for companies and a premium subscription for engineers, we create powerful network effects in a high-demand, growing market.</p>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-3xl font-bold text-center mb-8">Investment Highlights</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <HighlightCard icon={Zap} title="Disruptive Business Model">Free access for companies drives massive adoption and network effects, creating a deep pool of opportunities for our paying engineer user base.</HighlightCard>
                                <HighlightCard icon={Layers} title="Multiple Revenue Streams">Revenue is generated through a high-volume, low-cost subscription model for talent, supplemented by high-margin, value-added services.</HighlightCard>
                                <HighlightCard icon={TrendingUp} title="High-Demand Market">The global gig economy and the increasing reliance on a flexible, specialized tech workforce are fueling massive market growth.</HighlightCard>
                                <HighlightCard icon={BrainCircuit} title="Technology Differentiation">Advanced filtering, AI-powered team building, and real-time availability tracking set our platform apart.</HighlightCard>
                                <HighlightCard icon={Rocket} title="First-Mover Advantage">We are targeting a high-value vertical with a purpose-built solution designed for the unique needs of the tech contracting industry.</HighlightCard>
                                <HighlightCard icon={Users} title="Strong Network Effects">Our freemium model for companies rapidly builds one side of the marketplace, attracting paying engineers and creating a virtuous cycle.</HighlightCard>
                            </div>
                        </div>
                        
                        <div className="mb-10 bg-blue-50 py-10 rounded-lg">
                            <h3 className="text-3xl font-bold text-center mb-8">Our Modern Revenue Model</h3>
                            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 px-4">
                                <RevenueCard number="1" title="Skills Profile Subscriptions">A low-cost monthly subscription for engineers unlocks a premium "Skills Profile", enabling them to showcase specialist skills and appear in detailed searches.</RevenueCard>
                                <RevenueCard number="2" title='"Boost Profile" Credits'>A pay-per-use feature allowing engineers to purchase credits that temporarily place their profile at the top of relevant search results.</RevenueCard>
                                <RevenueCard number="3" title="Targeted Advertising">Premium advertising slots for industry-specific manufacturers and training companies to reach their ideal audience.</RevenueCard>
                            </div>
                        </div>

                        <div className="text-center bg-blue-600 text-white p-10 rounded-lg">
                            <h3 className="text-3xl font-bold">Join Us in Building the Future</h3>
                            <p className="mt-4 mb-6 max-w-2xl mx-auto">TechSubbies.com presents a high-growth investment opportunity in a rapidly expanding global market. We are currently seeking £500,000 in seed funding to accelerate product development and user acquisition.</p>
                            <a href="mailto:invest@techsubbies.com" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105">Contact Us for Investment Enquiries</a>
                        </div>
                    </div>
                </section>

            </main>
            <Footer onNavigate={onNavigate} />
        </div>
    );
};