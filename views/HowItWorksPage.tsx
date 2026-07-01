import React, { useState } from 'react';
import { Page } from '../types';
import { PageHeader } from '../components/PageHeader';
import { User, Building, Briefcase, Star, Sparkles, Handshake, DollarSign, FileText, BarChart2, Search, Users as UsersIcon } from '../components/Icons';

interface HowItWorksPageProps {
  onNavigate: (page: Page) => void;
}

type Tab = 'engineers' | 'companies' | 'resourcing';

function getInitialHowItWorksTab(): Tab {
    if (typeof window === 'undefined') {
        return 'engineers';
    }

    const hash = window.location.hash.replace('#', '');

    if (hash === 'engineers' || hash === 'companies' || hash === 'resourcing') {
        return hash;
    }

    return 'engineers';
}

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
                        title="1. Build your engineer profile"
                        description="Create a practical subcontractor profile with your trade skills, specialist capabilities, product knowledge, documents, locations and availability."
                    />
                    <Step 
                        icon={Sparkles}
                        title="2. Get matched to suitable work"
                        description="TechSubbies compares your skills, availability, location and compliance status against live project requirements so you see better-fit opportunities."
                        imageSide="left"
                    />
                     <Step 
                        icon={Handshake}
                        title="3. Respond directly to project requests"
                        description="Receive structured requests with dates, location, required skills and site details, then accept, ask a question or decline without vague back-and-forth."
                    />
                     <Step 
                        icon={DollarSign}
                        title="4. Keep your working profile current"
                        description="Keep your documents, availability, travel range and preferred work types up to date so the platform can keep matching you accurately."
                        imageSide="left"
                    />
                    <div className="text-center py-12">
                         {/* FIX: Replaced string literal with Page enum for type safety. */}
                         <button onClick={() => onNavigate(Page.ENGINEER_SIGNUP)} className="bg-blue-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                            Create engineer profile
                        </button>
                    </div>
                </div>
            );
        case 'companies':
            return (
                 <div className="animate-fade-in-up">
                    <Step 
                        icon={FileText}
                        title="1. Post a project requirement"
                        description="Describe the work, location, dates, site type, skills needed and any compliance requirements. The platform turns this into a structured project request."
                    />
                    <Step 
                        icon={Sparkles}
                        title="2. Review matched engineers"
                        description="TechSubbies ranks available engineers against the project requirement and explains why each person is a strong, partial or unsuitable match."
                        imageSide="left"
                    />
                     <Step 
                        icon={Handshake}
                        title="3. Shortlist with confidence"
                        description="Review skills, availability, location, documents and suitability before sending a targeted request to one or more engineers."
                    />
                     <Step 
                        icon={UsersIcon}
                        title="4. Keep a useful project record"
                        description="Keep the requirement, shortlist and communication trail together so similar future projects can be resourced faster."
                        imageSide="left"
                    />
                    <div className="text-center py-12">
                         {/* FIX: Replaced string literal with Page enum for type safety. */}
                         <button onClick={() => onNavigate(Page.COMPANY_SIGNUP)} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-transform transform hover:scale-105">
                            Post a project
                        </button>
                    </div>
                </div>
            );
         case 'resourcing':
            return (
                 <div className="animate-fade-in-up">
                    <Step 
                        icon={UsersIcon}
                        title="1. Manage your engineer pool"
                        description="Manage multiple subcontracting engineers in one place, including groups, skills, documents, compliance attention and availability."
                    />
                    <Step 
                        icon={Search}
                        title="2. Match engineers to opportunities"
                        description="See which engineers fit incoming project requirements by skill, location, availability and document readiness."
                        imageSide="left"
                    />
                     <Step 
                        icon={Briefcase}
                        title="3. Control compliance and availability"
                        description="Track expiring documents, missing evidence, engineer status and availability before putting people forward for work."
                    />
                     <Step 
                        icon={BarChart2}
                        title="4. Operate as a managed resource supplier"
                        description="Use TechSubbies as an operational layer for managing a technical labour pool, not just as another job board."
                        imageSide="left"
                    />
                    <div className="text-center py-12">
                         {/* FIX: Replaced string literal with Page enum for type safety. */}
                         <button onClick={() => onNavigate(Page.RESOURCING_SIGNUP)} className="bg-indigo-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
                            Create resourcing company account
                        </button>
                    </div>
                </div>
            );
        default: return null;
    }
};


export const HowItWorksPage = ({ onNavigate }: HowItWorksPageProps) => {
    const [activeTab, setActiveTab] = useState<Tab>(getInitialHowItWorksTab());
    
    const getTabClass = (tabName: Tab, color: string) => 
        `w-full sm:w-auto px-6 py-4 text-center font-bold border-b-4 transition-colors flex items-center justify-center gap-2 text-xl 
        ${ activeTab === tabName ? `border-${color}-600 text-${color}-600` : 'border-transparent text-gray-500 hover:text-gray-800' }`;

    const selectTab = (tabName: Tab) => {
        setActiveTab(tabName);

        if (typeof window !== 'undefined') {
            window.location.hash = tabName;
        }
    };

    return (
        <div className="bg-white">
            {/* FIX: Replaced string literal with Page enum for type safety. */}
            <PageHeader onBack={() => onNavigate(Page.LANDING)} />

            {/* Hero Section */}
            <section className="bg-gray-800 text-white py-16 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">How TechSubbies Works</h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
                        TechSubbies works differently for each user type: individual engineers, resourcing companies managing multiple engineers, and clients looking for technical resource.
                    </p>
                </div>
            </section>
            
            {/* Tab Navigation */}
            <div className="sticky top-16 bg-white z-30 shadow-md">
                 <div className="container mx-auto">
                    <nav className="flex flex-col sm:flex-row justify-center">
                        <button onClick={() => selectTab('engineers')} className={getTabClass('engineers', 'blue')}>
                            <User /> Engineer
                        </button>
                        <button onClick={() => selectTab('companies')} className={getTabClass('companies', 'green')}>
                            <Building /> Client
                        </button>
                        <button onClick={() => selectTab('resourcing')} className={getTabClass('resourcing', 'indigo')}>
                            <Briefcase /> Resourcing Company
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

