import React from 'react';
import { useAppContext, MOCK_COMPANIES } from '../context/AppContext.tsx';
import { InvestorPage } from './InvestorPage.tsx';
import { StatCard } from '../components/StatCard.tsx';
import { FeatureCard } from '../components/FeatureCard.tsx';
import { Users, Building, ClipboardList, DollarSign, Calendar, Handshake } from '../components/Icons.tsx';

export const LandingPage = () => {
  const { engineers, jobs } = useAppContext();
  
  return (
    <main className="bg-gray-50">
        {/* Hero Section */}
        <section className="text-center py-20 px-4 bg-white">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Find Your Next Tech Subcontractor. Instantly.</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">The free-to-use platform for companies to find and hire expert freelance engineers with verified availability. No placement fees. No hassle.</p>
            <div className="flex justify-center space-x-4">
                <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Post a Job for FREE</button>
                <button className="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition">Find Talent</button>
            </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                <StatCard icon={Users} value={`${engineers.length}+`} label="Vetted Engineers" />
                <StatCard icon={Building} value={`${MOCK_COMPANIES.length}+`} label="Active Companies" />
                <StatCard icon={ClipboardList} value={`${jobs.length}+`} label="Jobs Posted" />
            </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">Why TechSubbies is Different</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard icon={DollarSign} title="Zero Cost for Companies">It is completely free for companies to post jobs and find engineers. We believe in removing barriers to connect talent with opportunity.</FeatureCard>
                    <FeatureCard icon={Calendar} title="Real-Time Availability">Our integrated calendar system means you only see engineers who are actually available for your project dates, saving you time.</FeatureCard>
                    <FeatureCard icon={Handshake} title="Direct Engagement">Communicate and negotiate directly with engineers. We facilitate the connection and get out of your way. No middleman fees.</FeatureCard>
                </div>
            </div>
        </section>

        <InvestorPage />
    </main>
  );
};