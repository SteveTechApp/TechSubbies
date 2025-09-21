import React, { useState } from 'react';
import { Page } from '../types';
import { PageHeader } from '../components/PageHeader';
import { User, Building, Briefcase, Star, Sparkles, Handshake, DollarSign, FileText, BarChart2, Search, Users as UsersIcon } from '../components/Icons';

interface HowItWorksPageProps {
  onNavigate: (page: Page) => void;
}

type Tab = 'engineers' | 'companies' | 'resourcing';

const Step = ({ icon: Icon, title, description, imageSide = 'right' }: { icon: React.ComponentType<any>, title: string, description: string, imageSide?: 'left' | 'right' }) => {
    const textContent = (
        <div className="flex-1">
            <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            </div>
            <p className="text-gray-600 text-lg ml-16">{description}</p>
        </div>
    );
    
    const imageContent = (
        <div className="flex-1 flex items-center justify-center p-8">
           <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 shadow-inner">Placeholder Image</div>
        </div>
    );

    return (
        <div className={`flex flex-col md:flex-row items-center gap-8 py-12 ${imageSide === 'left' ? 'md:flex-row-reverse' : ''}`}>
            {textContent}
            {imageContent}
        </div>
    );
};

const TabContent = ({ tab, onNavigate }: { tab: Tab, onNavigate: (page: Page) => void }) => {
    switch(tab) {
        case 'engineers':
            return (
                <div className="animate-fade-in-up">
                    <Step 
                        icon={Star}
                        title="1. Build Your Expert Profile"
                        description="Don't just list jobs, showcase your deep skills. Our premium 'Skills Profile' lets you rate your competency on specific technologies (Crestron, Dante, Cisco) so our AI can find you the perfect, high-value contract."
                    />
                    <Step 
                        icon={Sparkles}
                        title="2. Get Matched, Not Spammed"
                        description="Our AI does the heavy lifting. It matches your unique skills to detailed job requirements. No more scrolling through irrelevant listings. Get alerts for jobs that are a perfect fit."
                        imageSide="left"
                    />
                     <Step 
                        icon={Handshake}
                        title="3. Connect & Contract Directly"
                        description="Cut out the middleman. Communicate directly with top companies, sign digital contracts securely on the platform, and build your professional network with every job."
                    />
                     <Step 
                        icon={DollarSign}
                        title="4. Manage Your Business"
                        description="From scheduling your availability to invoicing and getting paid securely (with optional escrow), we provide the tools to run your freelance business smoothly."
                        imageSide="left"
                    />
                    <div className="text-center py-12">
                         {/* FIX: Replaced string literal with Page enum for type safety. */}
                         <button onClick={() => onNavigate(Page.ENGINEER_SIGNUP)} className="bg-blue-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                            Create Your Free Profile Now
                        </button>
                    </div>
                </div>
            );
        case 'companies':
            return (
                 <div className="animate-fade-in-up">
                    <Step 
                        icon={FileText}
                        title="1. Post a Job for Free"
                        description="Describe your project and define the exact skills you need. Our AI helps you build the perfect job description to attract the right experts. It's always free to post."
                    />
                    <Step 
                        icon={Sparkles}
                        title="2. Instant AI Shortlist"
                        description="Forget sifting through CVs. The moment you post, our AI analyzes our network of premium 'Skills Profiles' and presents you with a ranked shortlist of the best-matched engineers, complete with a percentage score."
                        imageSide="left"
                    />
                     <Step 
                        icon={Handshake}
                        title="3. Hire with Confidence"
                        description="Review detailed profiles, message candidates, and send a secure digital contract in minutes. Choose between a simple Day Rate or a milestone-based SOW with escrow for total peace of mind."
                    />
                     <Step 
                        icon={UsersIcon}
                        title="4. Build Your Talent Pool"
                        description="Don't lose track of great freelancers. After a successful project, add them to your private 'Talent Pool' for direct invitations to future work."
                        imageSide="left"
                    />
                    <div className="text-center py-12">
                         {/* FIX: Replaced string literal with Page enum for type safety. */}
                         <button onClick={() => onNavigate(Page.COMPANY_SIGNUP)} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-transform transform hover:scale-105">
                            Post Your Job For Free
                        </button>
                    </div>
                </div>
            );
         case 'resourcing':
            return (
                 <div className="animate-fade-in-up">
                    <Step 
                        icon={UsersIcon}
                        title="1. Centralize Your Roster"
                        description="Manage your entire roster of freelance talent in one powerful dashboard. Track their skills, availability, and documents effortlessly."
                    />
                    <Step 
                        icon={Search}
                        title="2. Proactively Find Contracts"
                        description="Access our exclusive B2B job board. Search for opportunities and apply on behalf of your engineers, expanding your business reach."
                        imageSide="left"
                    />
                     <Step 
                        icon={Briefcase}
                        title="3. Streamline Placements"
                        description="Oversee all contracts and placements from a single view. Manage communications and track progress without the administrative headache."
                    />
                     <Step 
                        icon={BarChart2}
                        title="4. Grow Your Agency"
                        description="With a simple, scalable subscription model, you can grow your business without worrying about commission fees. Focus on what you do best: connecting talent with opportunity."
                        imageSide="left"
                    />
                    <div className="text-center py-12">
                         {/* FIX: Replaced string literal with Page enum for type safety. */}
                         <button onClick={() => onNavigate(Page.RESOURCING_SIGNUP)} className="bg-indigo-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
                            Join as a Resourcing Partner
                        </button>
                    </div>
                </div>
            );
        default: return null;
    }
};


export const HowItWorksPage = ({ onNavigate }: HowItWorksPageProps) => {
    const [activeTab, setActiveTab] = useState<Tab>('engineers');
    
    const getTabClass = (tabName: Tab, color: string) => 
        `w-full sm:w-auto px-6 py-4 text-center font-bold border-b-4 transition-colors flex items-center justify-center gap-2 text-xl 
        ${ activeTab === tabName ? `border-${color}-600 text-${color}-600` : 'border-transparent text-gray-500 hover:text-gray-800' }`;

    return (
        <div className="bg-white">
            {/* FIX: Replaced string literal with Page enum for type safety. */}
            <PageHeader onBack={() => onNavigate(Page.LANDING)} />

            {/* Hero Section */}
            <section className="bg-gray-800 text-white py-16 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">The Future of Freelance Hiring</h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
                        A transparent, AI-powered process designed to save time and create perfect matches between clients and freelance experts.
                    </p>
                </div>
            </section>
            
            {/* Tab Navigation */}
            <div className="sticky top-16 bg-white z-30 shadow-md">
                 <div className="container mx-auto">
                    <nav className="flex flex-col sm:flex-row justify-center">
                        <button onClick={() => setActiveTab('engineers')} className={getTabClass('engineers', 'blue')}>
                            <User /> For Engineers
                        </button>
                        <button onClick={() => setActiveTab('companies')} className={getTabClass('companies', 'green')}>
                            <Building /> For Companies
                        </button>
                        <button onClick={() => setActiveTab('resourcing')} className={getTabClass('resourcing', 'indigo')}>
                            <Briefcase /> For Resourcing
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content Section */}
            <section className="bg-gray-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <TabContent tab={activeTab} onNavigate={onNavigate} />
                </div>
            </section>
        </div>
    );
};