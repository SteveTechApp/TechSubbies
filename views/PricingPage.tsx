import React from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { Page } from '../types/index.ts';
import { CheckCircle } from '../components/Icons.tsx';

interface PricingPageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start">
        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
        <span className="text-gray-600">{children}</span>
    </li>
);

export const PricingPage = ({ onNavigate, onHowItWorksClick }: PricingPageProps) => {
    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
            <main className="flex-grow pt-24">
                {/* Hero Section */}
                <section className="py-12 bg-white text-center">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Simple, Transparent Pricing</h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Choose the plan that's right for your freelance career. It's always free for companies to hire.</p>
                    </div>
                </section>

                {/* Pricing Tiers Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

                            {/* Basic Profile Tier */}
                            <div className="border border-gray-200 rounded-lg p-8 bg-white shadow-lg flex flex-col">
                                <h2 className="text-2xl font-bold text-gray-800">Basic Profile</h2>
                                <p className="text-gray-500 mt-2 mb-4 flex-grow">The essential tools to get you started and visible on the platform.</p>
                                <div className="my-6">
                                    <span className="text-5xl font-extrabold">FREE</span>
                                    <span className="text-xl font-medium text-gray-500"> / Forever</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <FeatureListItem>Create your public profile</FeatureListItem>
                                    <FeatureListItem>Be visible in general searches</FeatureListItem>
                                    <FeatureListItem>List your core skills & experience</FeatureListItem>
                                    <FeatureListItem>Set your availability</FeatureListItem>
                                    <FeatureListItem>Apply for entry-level & support roles</FeatureListItem>
                                </ul>
                                <button
                                    onClick={() => onNavigate('engineerSignUp')}
                                    className="w-full mt-auto bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Get Started
                                </button>
                            </div>

                            {/* Skills Profile Tier */}
                            <div className="border-2 border-blue-600 rounded-lg p-8 bg-white shadow-2xl relative flex flex-col">
                                <span className="absolute top-0 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">Most Popular</span>
                                <h2 className="text-2xl font-bold text-blue-600">Skills Profile</h2>
                                <p className="text-gray-500 mt-2 mb-4 flex-grow">The complete toolkit to showcase your expertise and win high-value contracts.</p>
                                <div className="my-6">
                                    <span className="text-5xl font-extrabold">£15</span>
                                    <span className="text-xl font-medium text-gray-500"> / month</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <FeatureListItem><strong>Everything in Basic, plus:</strong></FeatureListItem>
                                    <FeatureListItem>Add specialist roles with detailed skill ratings</FeatureListItem>
                                    <FeatureListItem>Appear higher in search results</FeatureListItem>
                                    <FeatureListItem>Create visual case studies (Storyboards)</FeatureListItem>
                                    <FeatureListItem>Unlock Profile Boosts to top search results</FeatureListItem>
                                </ul>
                                <button
                                     onClick={() => onNavigate('engineerSignUp')}
                                    className="w-full mt-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Start 30-Day Free Trial
                                </button>
                            </div>

                        </div>
                    </div>
                </section>
                
                 {/* FAQ Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg">Is it really free for companies to post jobs?</h3>
                                <p className="text-gray-600 mt-1">Yes, 100%. Companies can post as many jobs as they like and search the talent database for free. We believe in removing all barriers to connecting talent with opportunity.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Can I cancel my Skills Profile subscription at any time?</h3>
                                <p className="text-gray-600 mt-1">Absolutely. You can manage your subscription from your billing settings and cancel at any time. You will retain premium features until the end of your current billing period.</p>
                            </div>
                             <div>
                                <h3 className="font-semibold text-lg">What happens after my 30-day free trial ends?</h3>
                                <p className="text-gray-600 mt-1">We will notify you before your trial ends. If you've added a payment method, your paid subscription will begin. If not, your profile will automatically revert to a Basic Profile. You won't lose your core information.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
        </div>
    );
};