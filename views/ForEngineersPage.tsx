import React, { useState, useEffect } from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { Page, ProfileTier } from '../types/index.ts';
import { CheckCircle, Briefcase, Star, Rocket, ShieldCheck, TrendingUp, DollarSign, Clapperboard, X, Award, BarChart } from '../components/Icons.tsx';

interface ForEngineersPageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

// Curated list of high-quality, relevant hero images for engineers
const ENGINEER_HERO_IMAGES = [
    'https://images.unsplash.com/photo-1581092921462-205273467433?q=80&w=2070&auto=format=fit=crop', // Technician working on server rack
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format=fit=crop', // Close up of hands on laptop with code
    'https://images.unsplash.com/photo-1621924519390-78132692e293?q=80&w=2070&auto=format=fit=crop', // Wiring a network patch panel
    'https://images.unsplash.com/photo-1614730321455-5c26a8d6e1a4?q=80&w=1974&auto=format=fit=crop', // Audio mixing console
    'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=2074&auto=format=fit=crop', // Close up of a circuit board
];

const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start">
        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
        <span className="text-gray-600">{children}</span>
    </li>
);

const TestimonialCard = ({ quote, name, role, avatar }: { quote: string, name: string, role: string, avatar: string }) => (
    <div className="bg-blue-700 p-6 rounded-lg text-center h-full flex flex-col">
        <img src={avatar} alt={name} className="w-20 h-20 rounded-full mx-auto -mt-12 border-4 border-blue-600 shadow-lg"/>
        <p className="text-blue-200 italic my-4 flex-grow">"{quote}"</p>
        <div>
            <p className="font-bold text-white">{name}</p>
            <p className="text-sm text-blue-300">{role}</p>
        </div>
    </div>
);

const FeatureDetailCard = ({ icon: Icon, title, children }: { icon: React.ComponentType<any>, title: string, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-3">
            <Icon className="w-8 h-8 text-blue-500 mr-3" />
            <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-gray-600">{children}</p>
    </div>
);


export const ForEngineersPage = ({ onNavigate, onHowItWorksClick }: ForEngineersPageProps) => {
    const [heroImage, setHeroImage] = useState('');

    useEffect(() => {
        // Select a random hero image on component mount
        setHeroImage(ENGINEER_HERO_IMAGES[Math.floor(Math.random() * ENGINEER_HERO_IMAGES.length)]);
    }, []);

    const TIERS = [
        {
            tier: ProfileTier.BASIC,
            title: "Basic Profile",
            price: "FREE",
            period: " / Forever",
            ctaText: "Get Started for Free",
            features: [
                "Create your public professional profile",
                "Appear in general searches",
                "Set your availability calendar",
                "Search and apply for jobs",
            ]
        },
        {
            tier: ProfileTier.SKILLS,
            title: "Skills Profile",
            price: "£15",
            period: " / month",
            ctaText: "Start 30-Day Free Trial",
            isFeatured: true,
            features: [
                "Everything in Basic, plus:",
                "Add specialist roles with detailed skill ratings",
                "Get priority ranking in company searches",
                "Unlock 'Profile Boosts' for top placement",
                "Create visual case studies (Storyboards)",
                "Access AI-powered Training Recommendations",
                "Covered by our Security Net Guarantee",
            ]
        },
    ];

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
            <main className="flex-grow pt-24">
                {/* Hero Section */}
                <section 
                    className="relative text-white text-center min-h-[50vh] flex items-center justify-center px-4 bg-cover bg-center"
                    style={{ backgroundImage: `url('${heroImage}')` }}
                >
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Stop Hunting for Work. Let It Find You.</h1>
                        <p className="text-lg md:text-xl mx-auto mb-8">Tired of scrolling forums and relying on word-of-mouth? TechSubbies.com automates your work pipeline. Showcase your skills, set your availability calendar, and get contacted directly by top companies for your next project.</p>
                        <button onClick={() => onNavigate('engineerSignUp')} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Create Your Profile for Free</button>
                    </div>
                </section>

                {/* The Old Way vs The TechSubbies Way */}
                <section className="py-16 bg-gray-100">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold text-gray-800 mb-10">A Modern Toolkit for the Modern Engineer</h2>
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {/* The Old Way */}
                            <div className="border border-red-200 bg-white rounded-lg p-8 text-left h-full">
                                <h3 className="text-2xl font-bold text-red-700 mb-4">The Old Way</h3>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start"><X className="w-6 h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" /><span>Endlessly scrolling job forums & social media.</span></li>
                                    <li className="flex items-start"><X className="w-6 h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" /><span>Relying on inconsistent word-of-mouth contacts.</span></li>
                                    <li className="flex items-start"><X className="w-6 h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" /><span>Losing 20-25% of your hard-earned rate to agency fees.</span></li>
                                    <li className="flex items-start"><X className="w-6 h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" /><span>Keeping clients waiting while you check your paper diary.</span></li>
                                    <li className="flex items-start"><X className="w-6 h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" /><span>A reactive, unpredictable, and stressful work pipeline.</span></li>
                                </ul>
                            </div>
                            {/* The TechSubbies Way */}
                            <div className="border-2 border-green-500 bg-white rounded-lg p-8 text-left h-full shadow-lg">
                                <h3 className="text-2xl font-bold text-green-700 mb-4">The TechSubbies Way</h3>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start"><CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" /><span>High-value projects find you automatically based on your skills.</span></li>
                                    <li className="flex items-start"><CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" /><span>Engage in direct communication & contracts. No middlemen.</span></li>
                                    <li className="flex items-start"><CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" /><span>You keep 100% of your day rate. Always.</span></li>
                                    <li className="flex items-start"><CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" /><span>Real-time availability means no missed opportunities.</span></li>
                                    <li className="flex items-start"><CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" /><span>Build a proactive, automated, and steady stream of offers.</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                
                 {/* Profile Comparison Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">A Plan for Every Ambition</h2>
                         <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">From getting your foot in the door to becoming an industry leader, we have a plan that grows with you. <button onClick={() => onNavigate('pricing')} className="text-blue-600 font-semibold hover:underline">See full comparison</button>.</p>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {TIERS.map(tier => (
                                <div key={tier.title} className={`border rounded-lg p-8 text-left flex flex-col ${tier.isFeatured ? 'border-2 border-blue-600 shadow-2xl relative' : 'border-gray-200'}`}>
                                    {tier.isFeatured && <span className="absolute top-0 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">Most Popular</span>}
                                    <h3 className={`text-2xl font-bold ${tier.isFeatured ? 'text-blue-600' : 'text-gray-800'}`}>{tier.title}</h3>
                                    <div className="my-6">
                                        <span className="text-5xl font-extrabold">{tier.price}</span>
                                        <span className="text-xl font-medium text-gray-500">{tier.period}</span>
                                    </div>
                                    <ul className="space-y-4 mb-8 flex-grow">
                                        {tier.features.map((feature, index) => <FeatureListItem key={index}>{feature}</FeatureListItem>)}
                                    </ul>
                                    <button onClick={() => onNavigate('engineerSignUp')} className={`w-full mt-auto font-bold py-3 px-6 rounded-lg transition-colors ${tier.isFeatured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>{tier.ctaText}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                 {/* Premium Features Detailed Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-gray-800 mb-2">Unlock Your Full Potential</h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">Our premium tiers give you the professional tools to stand out and secure high-value contracts.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureDetailCard icon={Award} title="Verified Certifications">Gain instant credibility. Our Professional tier allows you to submit your certifications for verification, adding a badge of trust to your profile that companies look for.</FeatureDetailCard>
                            <FeatureDetailCard icon={Star} title="Showcase Specialist Roles">Go beyond a simple skills list. The Skills tier lets you add high-demand roles like 'AV Commissioning Engineer' and rate your competency on the granular skills that matter to clients.</FeatureDetailCard>
                            <FeatureDetailCard icon={TrendingUp} title="Enhanced Search Visibility">Skills Profiles are automatically ranked higher in search results, putting you in front of more project managers and increasing your chances of being contacted for top-tier contracts.</FeatureDetailCard>
                            <FeatureDetailCard icon={Rocket} title="Profile Boosts">Need to fill a gap in your schedule quickly? Use a Profile Boost credit to temporarily place yourself at the very top of relevant searches for 12 hours, guaranteeing maximum visibility when it matters most.</FeatureDetailCard>
                            <FeatureDetailCard icon={Clapperboard} title="Visual Case Studies">A picture is worth a thousand words. Use our Storyboard Creator to build compelling, visual narratives of your best projects, demonstrating your process and results in a way a CV never can.</FeatureDetailCard>
                            <FeatureDetailCard icon={BarChart} title="Profile Analytics">Understand your impact. Our Business tier gives you access to detailed analytics on who is viewing your profile, your search appearances, and engagement metrics to optimize your strategy.</FeatureDetailCard>
                        </div>
                    </div>
                </section>
                
                {/* Testimonials Section */}
                <section className="py-20 bg-blue-600 text-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-16">What Our Engineers Are Saying</h2>
                        <div className="grid md:grid-cols-3 gap-12">
                            <TestimonialCard 
                                quote="The Skills Profile was a game-changer. Being able to detail my Crestron and Biamp commissioning skills directly led to my last three contracts. Companies know exactly what they're getting."
                                name="Neil B."
                                role="AV Commissioning Engineer"
                                avatar="https://xsgames.co/randomusers/assets/avatars/male/74.jpg"
                            />
                            <TestimonialCard 
                                quote="Within a week of boosting my profile, I had two inquiries for long-term projects. It's the most effective marketing I've ever done for my freelance business."
                                name="Samantha G."
                                role="IT Support Engineer"
                                avatar="https://xsgames.co/randomusers/assets/avatars/female/10.jpg"
                            />
                            <TestimonialCard 
                                quote="TechSubbies understands the contracting world. The Security Net Guarantee gave me the confidence to go full-time freelance. It's a platform that truly supports its engineers."
                                name="David C."
                                role="Cloud Engineer"
                                avatar="https://xsgames.co/randomusers/assets/avatars/male/15.jpg"
                            />
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-12 bg-gray-800 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold mb-4">Ready to Find Your Next Project?</h2>
                        <p className="text-xl mb-8">Join a growing network of elite tech professionals.</p>
                        <button onClick={() => onNavigate('engineerSignUp')} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Sign Up for Free</button>
                    </div>
                </section>
            </main>
            <Footer onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
        </div>
    );
};
