import React, { useState } from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { Page } from '../types/index.ts';
import { User, Building, Users, LayoutDashboard, Edit, Search, CalendarDays, BrainCircuit, CreditCard, Briefcase, Mail, PlusCircle, FileText, DollarSign } from '../components/Icons.tsx';

interface UserGuidePageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

const GuideSection = ({ title, icon: Icon, children }: { title: string, icon: React.ComponentType<any>, children: React.ReactNode }) => (
    <div id={title.toLowerCase().replace(/\s/g, '-')} className="mb-12 scroll-mt-28">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-blue-500 flex items-center">
            <Icon size={28} className="mr-3 text-blue-600" />
            For {title}
        </h2>
        <div className="prose prose-lg max-w-none">
            {children}
        </div>
    </div>
);

const SubSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-3">{title}</h3>
        {children}
    </div>
);

export const UserGuidePage = ({ onNavigate, onHowItWorksClick }: UserGuidePageProps) => {
    const [activeTab, setActiveTab] = useState('engineers');
    
    const getTabClass = (tabName: string) => `px-6 py-3 font-semibold text-lg rounded-t-lg transition-colors duration-200 flex items-center gap-2 ${activeTab === tabName ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`;

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
            <main className="flex-grow pt-24">
                <div className="bg-blue-800 text-white py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-5xl font-extrabold">TechSubbies.com User Guide</h1>
                        <p className="text-xl text-blue-200 mt-2">Your complete guide to leveraging the platform for success.</p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center border-b border-gray-300">
                        <a href="#for-engineers" onClick={() => setActiveTab('engineers')} className={getTabClass('engineers')}><User /> Engineers</a>
                        <a href="#for-companies" onClick={() => setActiveTab('companies')} className={getTabClass('companies')}><Building /> Companies</a>
                        <a href="#for-resourcing-companies" onClick={() => setActiveTab('resourcing')} className={getTabClass('resourcing')}><Users /> Resourcing</a>
                    </div>

                    <div className="py-10 bg-white p-6 sm:p-10 rounded-b-lg shadow-md">
                        <GuideSection title="Engineers" icon={User}>
                            <p>As a freelance engineer, TechSubbies.com is your command center for building a powerful professional profile, finding high-value contracts, and managing your career.</p>

                            <SubSection title="1. Getting Started: Your Profile">
                                <ul>
                                    <li><strong>Sign-Up:</strong> The four-step wizard guides you through creating your free <strong>Basic Profile</strong>. You'll provide core info, work readiness details (like insurance and competencies), optional identity verification, and your initial day rate (capped at £195/day for Basic profiles).</li>
                                    <li><strong>Dashboard (<LayoutDashboard className="inline-block" />):</strong> Your central hub. Here you can see profile stats, actionable insights, and navigate to all key sections.</li>
                                    <li><strong>Managing Your Profile (<Edit className="inline-block" />):</strong> This is where you bring your profile to life. Update your bio, contact info, and readiness details at any time.</li>
                                    <li><strong>Upgrading to Premium:</strong> A <strong>Basic Profile</strong> is great for starting out. To unlock the platform's full power, upgrade to a paid tier from the <strong>Billing</strong> page.
                                        <ul>
                                            <li><strong>Professional Tier:</strong> Add searchable "Core Skills" (tags) and get your certifications verified.</li>
                                            <li><strong>Skills Tier:</strong> Unlock "Specialist Roles" to add granular, rated skills, gain access to AI Tools, and create visual case studies. This is the key to attracting top-tier contracts.</li>
                                            <li><strong>Business Tier:</strong> Access detailed profile analytics to optimize your presence.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </SubSection>

                            <SubSection title="2. Finding & Managing Work">
                                <ul>
                                    <li><strong>Job Search (<Search className="inline-block" />):</strong> Use advanced filters to find the perfect job. You can filter by keywords, location, day rate, job type, and experience level.</li>
                                    <li><strong>Set Availability (<CalendarDays className="inline-block" />):</strong> Keep your calendar up-to-date. Companies filter by availability, so this is crucial for receiving relevant offers. You can also get a unique URL to sync your availability with your personal calendar (e.g., Google Calendar, Outlook).</li>
                                    <li><strong>My Network & Connections (<Users className="inline-block" />):</strong> This section has two tabs. "My Applications" lets you track all your job applications and manage offers. Once a contract is complete, the company is automatically added to your "My Connections" tab, creating a permanent record of your professional network.</li>
                                </ul>
                            </SubSection>

                            <SubSection title="3. Contracts, Payments & Advanced Tools">
                                <ul>
                                    <li><strong>Contracts (<FileText className="inline-block" />):</strong> When a company hires you, a contract is generated on the platform. You'll receive a notification to review and e-sign it. All your active and past contracts are managed here.</li>
                                    <li><strong>Secure Payments (<DollarSign className="inline-block" />):</strong> We ensure you get paid securely.
                                        <ul>
                                            <li><strong>For SOWs:</strong> The client funds project milestones into a secure escrow account before you start. Once you complete work, you submit the milestone for approval. Upon approval, payment is automatically released to you.</li>
                                            <li><strong>For Day Rate:</strong> Submit your timesheets through the contract page. Once the client approves it, payment is processed.</li>
                                        </ul>
                                    </li>
                                    <li><strong>AI Tools (<BrainCircuit className="inline-block" />):</strong> (Skills Tier+) Leverage Gemini AI to discover relevant skills for a job role or get personalized training recommendations based on your profile to help you upskill.</li>
                                    <li><strong>Billing (<CreditCard className="inline-block" />):</strong> Manage your subscription, purchase "Profile Boost" credits, and view your transaction history.</li>
                                    <li><strong>Messages (<Mail className="inline-block" />):</strong> Communicate directly with companies. All your professional conversations are kept securely in one place.</li>
                                </ul>
                            </SubSection>
                        </GuideSection>

                        <GuideSection title="Companies" icon={Building}>
                             <p>For companies, TechSubbies.com is a free and powerful tool to eliminate hiring friction, reduce costs, and find the perfect freelance specialist for your project instantly.</p>
                             <SubSection title="1. Getting Started">
                                <ul>
                                    <li><strong>Sign-Up:</strong> Creating a company account is fast and completely <strong>free</strong>. We encourage using a commercial email address and providing a valid company registration number to become a verified organization, which builds trust with engineers.</li>
                                     <li><strong>Dashboard (<LayoutDashboard className="inline-block" />):</strong> Get a quick overview of your active jobs and total applicants. Use the Quick Actions to immediately post a new job or start searching for talent.</li>
                                </ul>
                            </SubSection>

                             <SubSection title="2. Posting Jobs & Finding Talent">
                                <ul>
                                    <li><strong>Post a Job (<PlusCircle className="inline-block" />):</strong> Our two-step wizard makes it easy to create a detailed job post. First, provide the basic details. Second, and most importantly, define the <strong>Skill Importance</strong>. Mark each skill as 'Essential' or 'Desirable'. This data powers our AI matching engine to find you the best candidates.</li>
                                    <li><strong>Find Talent (<Search className="inline-block" />):</strong>
                                        <ul>
                                            <li><strong>Manual Search:</strong> Use our detailed filters to search the entire network of engineers by keyword, specialist role, day rate, and more.</li>
                                            <li><strong>AI Smart Match:</strong> This is our flagship feature. Select one of your posted jobs, and our Gemini-powered AI will analyze every premium engineer's detailed skills against your requirements. It returns a ranked list of candidates with a precise <strong>Match Score</strong>, so you can see the best fits at a glance.</li>
                                        </ul>
                                    </li>
                                </ul>
                             </SubSection>
                             
                            <SubSection title="3. Hiring & Management">
                                <ul>
                                    <li><strong>My Jobs (<Briefcase className="inline-block" />):</strong> This is your hiring pipeline. Select a job to view all applicants, sorted by relevance. From an applicant's card, click "Create Contract" to start the hiring process.</li>
                                    <li><strong>Contracts & Escrow (<FileText className="inline-block" />):</strong> Our system allows you to create either a Day Rate or Statement of Work (SOW) contract and send it for e-signature. For SOWs, you'll be prompted to fund each milestone into a secure escrow account. This provides security for both parties and ensures work begins promptly.</li>
                                    <li><strong>Approving Payments (<DollarSign className="inline-block" />):</strong> When an engineer submits a milestone or timesheet, you'll be notified. Simply review the work and click "Approve" on the contract page to release the payment from escrow.</li>
                                    <li><strong>Talent Pools (<Users className="inline-block" />):</strong> After a contract is completed, you can add your favorite engineers to a "Talent Pool". This creates a curated list of trusted freelancers you can message and invite directly to future projects, bypassing the public job search.</li>
                                </ul>
                            </SubSection>
                        </GuideSection>

                        <GuideSection title="Resourcing Companies" icon={Users}>
                             <p>As a resourcing company, TechSubbies.com provides a centralized platform to manage your roster of engineers and efficiently find contract work for them.</p>

                             <SubSection title="1. Your Dashboard & Roster">
                                <ul>
                                    <li><strong>Dashboard (<LayoutDashboard className="inline-block" />):</strong> Your dashboard provides key statistics about your managed talent, including the total number of engineers on your roster, how many are currently available, and the number of jobs you've applied to on their behalf.</li>
                                    <li><strong>Manage Engineers (<Users className="inline-block" />):</strong> This is your main view for your talent pool. See a card for each engineer you manage, with their core details, availability, and day rate. You can search and sort your roster to quickly find the right person for an opportunity.</li>
                                </ul>
                             </SubSection>

                              <SubSection title="2. Finding & Applying for Jobs">
                                <ul>
                                    <li><strong>Find Jobs (<Search className="inline-block" />):</strong> Access the main job board to search for opportunities that fit the skills of the engineers you manage.</li>
                                    <li><strong>Apply on Behalf of...:</strong> This is your key action. When you find a suitable job, click the "Apply on Behalf of..." button. A modal will appear allowing you to select which of your managed engineers to submit for the role.</li>
                                </ul>
                             </SubSection>

                             <SubSection title="3. Communication & Contracts">
                                 <ul>
                                    <li><strong>Messages (<Mail className="inline-block" />):</strong> Use the messaging system to communicate with your managed engineers or with the companies that have posted jobs.</li>
                                     <li><strong>Contracts (<Briefcase className="inline-block" />):</strong> When a company hires one of your engineers, you can view and manage the contract details on their behalf through the platform, including tracking milestones and payments.</li>
                                 </ul>
                            </SubSection>
                        </GuideSection>

                    </div>
                </div>
            </main>
            <Footer onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
        </div>
    );
};