import React, { useState, useMemo } from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { Page, ProfileTier } from '../types/index.ts';
import { HighlightCard } from '../components/HighlightCard.tsx';
import { RevenueCard } from '../components/RevenueCard.tsx';
import { Zap, Layers, TrendingUp, BrainCircuit, Rocket, Users, Download } from '../components/Icons.tsx';
import { PROSPECTUS_CONTENT } from '../data/prospectusContent.ts';
import { RevenueSimulator } from '../components/RevenueSimulator.tsx';
import { FinancialForecast } from '../components/FinancialForecast.tsx';
import { calculateFinancials } from '../data/financialModel.ts';


interface InvestorRelationsPageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

export const InvestorRelationsPage = ({ onNavigate, onHowItWorksClick }: InvestorRelationsPageProps) => {

    const [subscriberNumbers, setSubscriberNumbers] = useState({
        [ProfileTier.PROFESSIONAL]: 500, // Silver
        [ProfileTier.SKILLS]: 250,       // Gold
        [ProfileTier.BUSINESS]: 50,      // Platinum
    });

    const handleSliderChange = (tier: ProfileTier, value: number) => {
        setSubscriberNumbers(prev => ({
            ...prev,
            [tier]: value,
        }));
    };
    
    const { totalRevenue, totalUsers, costs, profit } = useMemo(() => {
        return calculateFinancials(subscriberNumbers);
    }, [subscriberNumbers]);


    const handleDownloadProspectus = () => {
        const blob = new Blob([PROSPECTUS_CONTENT], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'TechSubbies_Investor_Prospectus.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
            <main className="flex-grow pt-14">
                {/* Hero Section */}
                <section 
                    className="relative text-white text-center min-h-[40vh] flex items-center justify-center px-4 bg-cover bg-center"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop')` }}
                >
                    <div className="absolute inset-0 bg-blue-900 opacity-80"></div>
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-xl md:text-3xl font-extrabold mb-2">An Investment in the Future of Work</h1>
                        <p className="text-xs md:text-sm mx-auto">TechSubbies.com is poised to become the essential infrastructure for the freelance tech economy. Discover our high-growth opportunity.</p>
                    </div>
                </section>

                 <section id="investors" className="py-4 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto bg-gray-50 p-4 rounded-lg shadow-lg mb-4 border border-gray-200">
                            <h3 className="text-lg font-bold mb-2 text-center text-gray-800">Executive Summary</h3>
                            <p className="text-gray-700 text-center text-sm">TechSubbies.com is a vertically-integrated B2B marketplace solving a critical, dual-sided problem: companies struggle to find qualified, available specialist engineers quickly, while freelance engineers lack a dedicated platform to showcase their niche skills. By leveraging a freemium model for companies and a premium subscription for engineers, we create powerful network effects in a high-demand, growing market.</p>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-center mb-3">Investment Highlights</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <HighlightCard icon={Zap} title="Disruptive Business Model">Free access for companies drives massive adoption and network effects, creating a deep pool of opportunities for our paying engineer user base.</HighlightCard>
                                <HighlightCard icon={Layers} title="Multiple Revenue Streams">Revenue is generated through a high-volume, low-cost subscription model for talent, supplemented by high-margin, value-added services.</HighlightCard>
                                <HighlightCard icon={TrendingUp} title="High-Demand Market">The global gig economy and the increasing reliance on a flexible, specialized tech workforce are fueling massive market growth.</HighlightCard>
                                <HighlightCard icon={BrainCircuit} title="Technology Differentiation">Advanced filtering, AI-powered team building, and real-time availability tracking set our platform apart.</HighlightCard>
                                <HighlightCard icon={Rocket} title="First-Mover Advantage">We are targeting a high-value vertical with a purpose-built solution designed for the unique needs of the tech contracting industry.</HighlightCard>
                                <HighlightCard icon={Users} title="Strong Network Effects">Our freemium model for companies rapidly builds one side of the marketplace, attracting paying engineers and creating a virtuous cycle.</HighlightCard>
                            </div>
                        </div>
                        
                        <div className="mb-4 bg-blue-50 py-4 rounded-lg">
                            <h3 className="text-lg font-bold text-center mb-3">Our Modern Revenue Model</h3>
                            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-3 px-4">
                                <RevenueCard number="1" title="Skills Profile Subscriptions">Our core recurring revenue. A low-cost monthly subscription unlocks premium tools for engineers to showcase their specialist skills.</RevenueCard>
                                <RevenueCard number="2" title="Microtransactions">Pay-per-use features like 'Profile Boosts' and '12-Hour Day Passes' allow engineers to increase visibility on demand.</RevenueCard>
                                <RevenueCard number="3" title="Targeted Advertising">Premium advertising slots for industry-specific manufacturers and training companies to reach their ideal audience.</RevenueCard>
                            </div>
                        </div>

                        <div className="mb-4 bg-white py-4 rounded-lg shadow-md border">
                             <h3 className="text-lg font-bold text-center mb-3">Interactive Financial Forecast</h3>
                             <RevenueSimulator 
                                subscriberNumbers={subscriberNumbers}
                                onSliderChange={handleSliderChange}
                                totalArr={totalRevenue.subscriptions}
                             />
                             <FinancialForecast 
                                revenue={totalRevenue}
                                users={totalUsers}
                                costs={costs}
                                profit={profit}
                             />
                        </div>

                        <div className="text-center bg-blue-600 text-white p-4 rounded-lg">
                            <h3 className="text-lg font-bold">Join Us in Building the Future</h3>
                            <p className="mt-2 mb-4 max-w-2xl mx-auto text-sm">TechSubbies.com presents a high-growth investment opportunity in a rapidly expanding global market. We are currently seeking £500,000 in seed funding to accelerate product development and user acquisition.</p>
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                                <a href="mailto:invest@techsubbies.com" className="inline-block w-full sm:w-auto bg-white text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105">Contact Us for Investment Enquiries</a>
                                <button
                                    onClick={handleDownloadProspectus}
                                    className="inline-flex items-center justify-center w-full sm:w-auto bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold py-2 px-6 rounded-lg hover:bg-white/30 transition"
                                >
                                    <Download size={16} className="mr-2" />
                                    Download Prospectus
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
        </div>
    );
};