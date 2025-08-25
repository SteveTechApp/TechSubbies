import React, { useState } from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { Page, Currency } from '../types/index.ts';
import { CheckCircle, Users, Briefcase, Rocket } from '../components/Icons.tsx';

interface PricingPageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

const PRICING_DATA = {
    engineer: {
        skillsProfile: { gbp: 15 },
        boosts: {
            bundle: { gbp: 5, count: 3 }
        }
    },
    resourcing: {
        starter: {
            gbp: 49,
            engineers: 5,
        },
        business: {
            gbp: 149,
            engineers: 20,
        }
    }
};

const CONVERSION_RATES = {
    [Currency.USD]: 1.25,
    [Currency.GBP]: 1,
};

const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start">
        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
        <span className="text-gray-600">{children}</span>
    </li>
);

interface PricingCardProps {
    title: string;
    description: string;
    price: string;
    period?: string;
    features: React.ReactNode[];
    ctaText: string;
    onCtaClick: () => void;
    isFeatured?: boolean;
    popularText?: string;
    icon?: React.ComponentType<any>;
}

const PricingCard = ({ title, description, price, period, features, ctaText, onCtaClick, isFeatured = false, popularText, icon: Icon }: PricingCardProps) => {
    const cardBorder = isFeatured ? 'border-2 border-blue-600' : 'border border-gray-200';
    const titleColor = isFeatured ? 'text-blue-600' : 'text-gray-800';

    return (
        <div className={`${cardBorder} rounded-lg p-8 bg-white shadow-lg relative flex flex-col`}>
            {popularText && <span className="absolute top-0 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">{popularText}</span>}
            
            <div className="flex items-center gap-3 mb-2">
                {Icon && <Icon className="w-8 h-8 text-blue-500" />}
                <h2 className={`text-2xl font-bold ${titleColor}`}>{title}</h2>
            </div>
            
            <p className="text-gray-500 mt-2 mb-4 flex-grow">{description}</p>
            <div className="my-6">
                <span className="text-5xl font-extrabold">{price}</span>
                {period && <span className="text-xl font-medium text-gray-500">{period}</span>}
            </div>
            <ul className="space-y-4 mb-8">
                {features.map((feature, index) => <FeatureListItem key={index}>{feature}</FeatureListItem>)}
            </ul>
            <button
                onClick={onCtaClick}
                className={`w-full mt-auto font-bold py-3 px-6 rounded-lg transition-colors ${isFeatured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
                {ctaText}
            </button>
        </div>
    );
};

export const PricingPage = ({ onNavigate, onHowItWorksClick }: PricingPageProps) => {
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>(Currency.GBP);

    const getPrice = (gbpPrice: number) => {
        const rate = CONVERSION_RATES[selectedCurrency];
        const convertedPrice = Math.round(gbpPrice * rate);
        return `${selectedCurrency}${convertedPrice}`;
    };

    const currencyButtonClass = (currency: Currency) => 
        `px-4 py-2 rounded-md font-semibold transition-colors ${
            selectedCurrency === currency
            ? 'bg-blue-600 text-white shadow'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`;

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
            <main className="flex-grow pt-24">
                {/* Hero Section */}
                <section className="py-12 bg-white text-center">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Simple, Transparent Pricing</h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Plans for every stage of your freelance career or business. It's always free for companies to post jobs.</p>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 max-w-6xl">
                        
                        {/* Currency Selector */}
                        <div className="flex justify-center items-center gap-2 mb-12 p-2 bg-gray-200 rounded-lg max-w-xs mx-auto">
                            <span className="text-gray-600 font-medium hidden sm:inline">Currency:</span>
                            <button onClick={() => setSelectedCurrency(Currency.GBP)} className={currencyButtonClass(Currency.GBP)}>🇬🇧 GBP</button>
                            <button onClick={() => setSelectedCurrency(Currency.USD)} className={currencyButtonClass(Currency.USD)}>🇺🇸 USD</button>
                        </div>

                        {/* Engineer Pricing */}
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold">For Engineers</h2>
                            <p className="text-gray-500 mt-2">Invest in your career with tools designed for freelance success.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
                           <PricingCard
                                title="Basic Profile"
                                description="The essential tools to get you started and visible on the platform."
                                price="FREE"
                                period=" / Forever"
                                features={[
                                    "Create your public profile",
                                    "Be visible in general searches",
                                    "List your core skills & experience",
                                    "Set your availability",
                                ]}
                                ctaText="Get Started"
                                onCtaClick={() => onNavigate('engineerSignUp')}
                            />
                             <PricingCard
                                title="Skills Profile"
                                description="The complete toolkit to showcase your expertise and win high-value contracts."
                                price={getPrice(PRICING_DATA.engineer.skillsProfile.gbp)}
                                period=" / month"
                                features={[
                                    <strong>Everything in Basic, plus:</strong>,
                                    "Add specialist roles with detailed skill ratings",
                                    "Appear higher in search results",
                                    "Create visual case studies (Storyboards)",
                                    <>
                                        Unlock Profile Boosts 
                                        (<Rocket size={14} className="inline-block mx-1"/> 
                                        <strong>{PRICING_DATA.engineer.boosts.bundle.count} for {getPrice(PRICING_DATA.engineer.boosts.bundle.gbp)}</strong>)
                                    </>
                                ]}
                                ctaText="Start 30-Day Free Trial"
                                onCtaClick={() => onNavigate('engineerSignUp')}
                                isFeatured
                                popularText="Most Popular"
                            />
                        </div>

                         {/* Resourcing Company Pricing */}
                        <div className="text-center mt-20 mb-12">
                            <h2 className="text-3xl font-bold">For Resourcing Companies</h2>
                            <p className="text-gray-500 mt-2">Manage your roster of engineers and find jobs for them efficiently.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                             <PricingCard
                                icon={Users}
                                title="Starter"
                                description="Perfect for small agencies or those just getting started."
                                price={getPrice(PRICING_DATA.resourcing.starter.gbp)}
                                period=" / month"
                                features={[
                                    <>Manage up to <strong>{PRICING_DATA.resourcing.starter.engineers} engineers</strong></>,
                                    "Apply for jobs on behalf of engineers",
                                    "Unified messaging inbox",
                                    "Basic reporting"
                                ]}
                                ctaText="Choose Starter"
                                onCtaClick={() => onNavigate('login')}
                            />
                             <PricingCard
                                icon={Briefcase}
                                title="Business"
                                description="For established firms that need more capacity and features."
                                price={getPrice(PRICING_DATA.resourcing.business.gbp)}
                                period=" / month"
                                features={[
                                    <>Manage up to <strong>{PRICING_DATA.resourcing.business.engineers} engineers</strong></>,
                                    "Everything in Starter, plus:",
                                    "Priority support",
                                    "Advanced analytics"
                                ]}
                                ctaText="Choose Business"
                                onCtaClick={() => onNavigate('login')}
                                isFeatured
                                popularText="Best Value"
                            />
                             <PricingCard
                                icon={Briefcase}
                                title="Enterprise"
                                description="Custom solutions for large-scale resourcing operations."
                                price="Custom"
                                features={[
                                    "Manage unlimited engineers",
                                    "Dedicated account manager",
                                    "API access for integration",
                                    "Custom branding"
                                ]}
                                ctaText="Contact Sales"
                                onCtaClick={() => window.location.href = 'mailto:sales@techsubbies.com'}
                            />
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
                                <h3 className="font-semibold text-lg">Can I cancel my subscription at any time?</h3>
                                <p className="text-gray-600 mt-1">Absolutely. You can manage your subscription from your billing settings and cancel at any time. You will retain your plan features until the end of your current billing period.</p>
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