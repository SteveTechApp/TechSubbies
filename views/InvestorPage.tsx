
import React, { useState, useMemo } from 'react';
import { Page, ProfileTier } from '../types';
import { RevenueSimulator } from '../components/RevenueSimulator';
import { FinancialForecast } from '../components/FinancialForecast';
import { calculateFinancials } from '../data/financialModel';
import { RevenueCard } from '../components/RevenueCard';

interface InvestorPageProps {
  onNavigate: (page: Page) => void;
}

export const InvestorPage = ({ onNavigate }: InvestorPageProps) => {
    const [subscriberNumbers, setSubscriberNumbers] = useState({
        [ProfileTier.PROFESSIONAL]: 1500,
        [ProfileTier.SKILLS]: 750,
        [ProfileTier.BUSINESS]: 100,
    });

    const handleSliderChange = (tier: ProfileTier, value: number) => {
        setSubscriberNumbers(prev => ({
            ...prev,
            [tier]: value,
        }));
    };

    const financials = useMemo(() => calculateFinancials(subscriberNumbers), [subscriberNumbers]);

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gray-800 text-white text-center py-20">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold">Investing in the Future of Work</h1>
                    <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
                        TechSubbies.com is a technology-first platform designed to disrupt the £48bn UK recruitment industry by directly connecting specialist freelance talent with the companies that need them.
                    </p>
                </div>
            </section>

            {/* Key Differentiators */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12">A Capital-Efficient, SaaS-Powered Model</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <RevenueCard number="£0" title="Revenue from Companies">
                            Our platform is free for companies to post jobs and hire. This removes friction and attracts the entire market, not just those with large recruitment budgets.
                        </RevenueCard>
                        <RevenueCard number="10x" title="Faster Hiring">
                            Our AI-powered skills matching reduces hiring time from weeks to hours, providing a massive efficiency gain for our clients and a better experience for freelancers.
                        </RevenueCard>
                        <RevenueCard number="SaaS" title="Engineer-Funded Model">
                            We are a true SaaS business. Revenue is generated through tiered subscriptions from freelance engineers who pay for powerful tools to advance their careers.
                        </RevenueCard>
                    </div>
                </div>
            </section>

             {/* Revenue Simulator */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive Financial Model</h2>
                     <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto mb-12">
                        Use the sliders below to simulate how different levels of subscriber adoption translate into annual recurring revenue (ARR) and overall profitability based on our financial model.
                    </p>
                    <RevenueSimulator
                        subscriberNumbers={subscriberNumbers}
                        onSliderChange={handleSliderChange}
                        totalArr={financials.totalRevenue.subscriptions}
                    />
                </div>
            </section>

             {/* Financial Forecast */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                     <FinancialForecast
                        revenue={financials.totalRevenue}
                        users={financials.totalUsers}
                        costs={financials.costs}
                        profit={financials.profit}
                    />
                </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-blue-600 py-20 text-white">
                 <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold">Request Our Prospectus</h2>
                    <p className="mt-4 text-blue-200 max-w-xl mx-auto">
                        For detailed financial projections, market analysis, and information about our seed funding round, please get in touch.
                    </p>
                    <a href="mailto:investors@techsubbies.com" className="mt-6 inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105">
                        Contact Investor Relations
                    </a>
                </div>
            </section>
        </div>
    );
};