
import React from 'react';
import { ArrowLeft, BarChart, TrendingUp, Zap, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { COMPANY_SUBSCRIPTION_PLANS, SUBSCRIPTION_PLANS } from '../constants';

const InfoCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center mb-3">
            <Icon className="w-8 h-8 mr-4 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <div className="text-gray-600 space-y-2">
            {children}
        </div>
    </div>
);

const FinancialCard: React.FC<{ year: string, revenue: string, users: { label: string, value: string }[] }> = ({ year, revenue, users }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-500 transform hover:scale-105 transition-transform duration-300">
        <p className="text-lg font-semibold text-gray-500">{year}</p>
        <p className="text-4xl font-extrabold text-gray-900 my-2">{revenue}</p>
        <div className="space-y-1 text-sm text-gray-600">
            {users.map(user => (
                <div key={user.label} className="flex justify-between">
                    <span>{user.label}</span>
                    <span className="font-medium">{user.value}</span>
                </div>
            ))}
        </div>
    </div>
);


export const InvestorPage: React.FC = () => {
    const { setPublicView } = useAppContext();

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-128px)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    <button 
                        onClick={() => setPublicView('landing')} 
                        className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-6"
                    >
                        <ArrowLeft size={16} className="mr-2"/>
                        Back to Home
                    </button>
                    
                    <header className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
                            Investment Prospectus
                        </h1>
                        <p className="text-lg text-gray-600">
                            Building the essential infrastructure for the future of freelance technical work.
                        </p>
                    </header>

                    <section className="space-y-8">
                        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">Executive Summary</h2>
                            <p className="text-gray-600">
                                In today's fast-paced digital economy, project managers waste countless hours searching for specialized tech talent and vetting availability, creating significant project delays. TechSubbies.com solves this by providing instant access to a curated network of qualified freelance tech engineers with real-time availability, dramatically reducing hiring time from weeks to mere days. We are a scalable, technology-driven platform connecting freelance engineers with companies that require their specialized expertise, poised to become the industry standard.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoCard icon={TrendingUp} title="Market Opportunity">
                                <p>The global gig economy is valued at over $455 billion, with explosive growth in the specialized tech freelance sector. We are positioned to capture a significant share by solving core challenges for both sides of the marketplace.</p>
                            </InfoCard>
                            <InfoCard icon={Zap} title="Our Solution">
                                <p>Our platform features detailed skill profiles, AI-powered job matching, real-time availability calendars, and a tiered subscription model to provide unmatched value and efficiency in the hiring process.</p>
                            </InfoCard>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Revenue Model</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <h3 className="font-bold text-lg mb-2">Engineer Subscriptions</h3>
                                    <ul className="space-y-2 text-sm">
                                        {SUBSCRIPTION_PLANS.map(plan => (
                                            <li key={plan.name} className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span><strong>{plan.name} ({plan.price > 0 ? `£${plan.price}/mo` : 'Free'}):</strong> {plan.features.join(', ')}.</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <h3 className="font-bold text-lg mb-2">Company Subscriptions</h3>
                                    <ul className="space-y-2 text-sm">
                                         {COMPANY_SUBSCRIPTION_PLANS.map(plan => (
                                            <li key={plan.name} className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span><strong>{plan.name} ({plan.price > 0 ? `£${plan.price}/mo` : 'Custom'}):</strong> {plan.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Financial Projections</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <FinancialCard 
                                    year="Year 1" 
                                    revenue="£189,800"
                                    users={[
                                        {label: 'Pro Users', value: '500'},
                                        {label: 'Expert Users', value: '250'},
                                        {label: 'Business Accounts', value: '100'},
                                    ]}
                                />
                                 <FinancialCard 
                                    year="Year 2" 
                                    revenue="£514,800"
                                    users={[
                                        {label: 'Pro Users', value: '1,200'},
                                        {label: 'Expert Users', value: '600'},
                                        {label: 'Business Accounts', value: '250'},
                                    ]}
                                />
                                 <FinancialCard 
                                    year="Year 3" 
                                    revenue="£1,120,800"
                                    users={[
                                        {label: 'Pro Users', value: '2,500'},
                                        {label: 'Expert Users', value: '1,200'},
                                        {label: 'Business Accounts', value: '500'},
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="text-center pt-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">Join Us</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                                TechSubbies.com presents a high-growth investment opportunity in a rapidly expanding global market. We invite you to join us in building the essential platform for the future of freelance technical work.
                            </p>
                            <a href="mailto:invest@techsubbies.com" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                                Contact for Investment Enquiries
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
