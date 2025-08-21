import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { InvestorPage } from './InvestorPage.tsx';
import { MOCK_COMPANIES } from '../services/mockDataGenerator.ts';
import { Users, Building, ClipboardList, DollarSign, Calendar, Handshake, LucideIcon } from 'lucide-react';

interface StatCardProps {
    icon: LucideIcon;
    value: string;
    label: string;
}

const StatCard = ({ icon: Icon, value, label }: StatCardProps) => (
    <div className='bg-white p-6 rounded-lg shadow-lg flex items-center'>
        <Icon className='w-12 h-12 text-blue-500 mr-4' />
        <div>
            <p className='text-3xl font-bold text-gray-800'>{value}</p>
            <p className='text-gray-500'>{label}</p>
        </div>
    </div>
);

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    children: React.ReactNode;
}

const FeatureCard = ({ icon: Icon, title, children }: FeatureCardProps) => (
    <div className='bg-white p-6 rounded-lg border border-gray-200'>
        <div className='flex items-center mb-3'>
            <Icon className='w-8 h-8 text-blue-500 mr-3' />
            <h3 className='text-xl font-bold'>{title}</h3>
        </div>
        <p className='text-gray-600'>{children}</p>
    </div>
);

export const LandingPage = () => {
  const { engineers, jobs } = useAppContext();
  
  return (
    <main className='bg-gray-50'>
        {/* Hero Section */}
        <section className='text-center py-20 px-4 bg-white'>
            <h1 className='text-5xl font-extrabold text-gray-800 mb-4'>Find Your Next Tech Subcontractor. Instantly.</h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-8'>The free-to-use platform for companies to find and hire expert freelance engineers with verified availability. No placement fees. No hassle.</p>
            <div className='flex justify-center space-x-4'>
                <button className='bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105'>Post a Job for FREE</button>
                <button className='bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition'>Find Talent</button>
            </div>
        </section>

        {/* Stats Section */}
        <section className='py-16'>
            <div className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4'>
                <StatCard icon={Users} value={`${engineers.length}+`} label='Vetted Engineers' />
                <StatCard icon={Building} value={`${MOCK_COMPANIES.length}+`} label='Active Companies' />
                <StatCard icon={ClipboardList} value={`${jobs.length}+`} label='Jobs Posted' />
            </div>
        </section>
        
        {/* Features Section */}
        <section className='py-16 bg-white'>
            <div className='container mx-auto px-4'>
                <h2 className='text-4xl font-bold text-center mb-12'>Why TechSubbies is Different</h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    <FeatureCard icon={DollarSign} title='Zero Cost for Companies'>It is completely free for companies to post jobs and find engineers. We believe in removing barriers to connect talent with opportunity.</FeatureCard>
                    <FeatureCard icon={Calendar} title='Real-Time Availability'>Our integrated calendar system means you only see engineers who are actually available for your project dates, saving you time.</FeatureCard>
                    <FeatureCard icon={Handshake} title='Direct Engagement'>Communicate and negotiate directly with engineers. We facilitate the connection and get out of your way. No middleman fees.</FeatureCard>
                </div>
            </div>
        </section>

        <InvestorPage />
    </main>
  );
};
