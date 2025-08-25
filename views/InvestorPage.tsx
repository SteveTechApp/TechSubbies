import React from 'react';
import { HighlightCard } from '../components/HighlightCard.tsx';
import { RevenueCard } from '../components/RevenueCard.tsx';
import { Zap, Layers, TrendingUp, BrainCircuit, Rocket } from '../components/Icons.tsx';

export const InvestorPage = () => {
    return (
        <section id="investors" className="py-12 bg-gray-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-gray-800">An Investment in the Future of Work</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">TechSubbies.com is poised to become the essential infrastructure for the freelance tech economy. Discover why we're a high-growth opportunity.</p>
                </div>

                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-10">
                    <h3 className="text-2xl font-bold mb-4 text-center">Executive Summary</h3>
                    <p className="text-gray-700 text-center">In today's fast-paced Tech industry, project managers waste countless hours searching for specialized AV & IT talent and vetting availability. TechSubbies.com solves this by providing instant access to a curated network of qualified freelance engineers with real-time availability, dramatically reducing hiring time from weeks to days.</p>
                </div>

                <div className="mb-10">
                    <h3 className="text-3xl font-bold text-center mb-8">Investment Highlights</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <HighlightCard icon={Zap} title="Disruptive Business Model">Free access for companies drives massive adoption and network effects, creating a deep pool of opportunities for our paying engineer user base.</HighlightCard>
                        <HighlightCard icon={Layers} title="Multiple Revenue Streams">Revenue is generated through a high-volume, low-cost subscription model for talent, supplemented by high-margin, value-added services.</HighlightCard>
                        <HighlightCard icon={TrendingUp} title="High-Demand Market">The global gig economy and the increasing reliance on a flexible, specialized tech workforce are fueling massive market growth.</HighlightCard>
                        <HighlightCard icon={BrainCircuit} title="Technology Differentiation">Advanced filtering, AI-powered team building, and real-time availability tracking set our platform apart.</HighlightCard>
                        <HighlightCard icon={Rocket} title="First-Mover Advantage">We are targeting a high-value vertical with a purpose-built solution designed for the unique needs of the tech contracting industry.</HighlightCard>
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
                    <p className="mt-4 mb-6 max-w-2xl mx-auto">TechSubbies.com presents a high-growth investment opportunity in a rapidly expanding global market. With a scalable business model, robust technology, and multiple revenue streams, the platform is poised for substantial success.</p>
                    <a href="mailto:invest@techsubbies.com" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105">Contact Us for Investment Enquiries</a>
                </div>
            </div>
        </section>
    );
};