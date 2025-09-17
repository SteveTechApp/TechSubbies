import React from 'react';
import { Page } from '../types';
import { PageHeader } from '../components/PageHeader';
import { HighlightCard } from '../components/HighlightCard';
import { Users, Search, FileText, DollarSign, Briefcase, BarChart2 } from '../components/Icons';

interface ForResourcingCompaniesPageProps {
  onNavigate: (page: Page) => void;
}

export const ForResourcingCompaniesPage = ({ onNavigate }: ForResourcingCompaniesPageProps) => {
  return (
    <div className="bg-white">
      <PageHeader onBack={() => onNavigate('landing')} />

      {/* Hero Section */}
      <section className="relative bg-indigo-600 text-white py-20 text-center">
         <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop')` }}></div>
         <div className="relative container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Your Central Hub for Freelance Talent</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
                Manage your roster, find contracts, and streamline your operations on a platform built for technical resourcing agencies.
            </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Tools to Scale Your Agency</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">Stop juggling spreadsheets and emails. Our platform gives you the tools to manage your talent and placements efficiently.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <HighlightCard icon={Users} title="Centralized Roster">
              Manage your entire roster of freelance engineers in one place. Keep profiles, availability, and documents organized and accessible.
            </HighlightCard>
            <HighlightCard icon={Search} title="Find & Apply">
              Access our exclusive job board to find contracts for your talent. Apply on behalf of your engineers with just a few clicks.
            </HighlightCard>
            <HighlightCard icon={FileText} title="Unified Contracts">
              Handle all contracts for your managed talent through a single, unified dashboard. Track status from signature to completion.
            </HighlightCard>
            <HighlightCard icon={BarChart2} title="Placement Analytics">
                Get a clear overview of all active placements, track key metrics, and manage your business more effectively.
            </HighlightCard>
             <HighlightCard icon={Briefcase} title="Direct Client Access">
                Communicate directly with hiring managers on the platform to discuss roles and negotiate terms for your engineers.
            </HighlightCard>
             <HighlightCard icon={DollarSign} title="Simple, Transparent Pricing">
                No hidden fees or commissions. A straightforward monthly subscription that scales with your business.
            </HighlightCard>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
       <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Simple, Scalable Pricing</h2>
            <div className="mt-8 max-w-md mx-auto bg-gray-50 border-2 border-indigo-500 rounded-lg p-8 shadow-xl">
                 <h3 className="text-2xl font-bold text-gray-800">Agency Plan</h3>
                 <div className="my-4">
                    <span className="text-5xl font-extrabold text-gray-800">£50</span>
                    <span className="ml-1 text-lg font-medium text-gray-500">/ month</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-700">+ £5 <span className="text-base font-medium text-gray-500">/ engineer / month</span></p>
                <button onClick={() => onNavigate('pricing')} className="mt-6 text-indigo-600 font-bold hover:underline">
                    See full feature list
                </button>
            </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="bg-indigo-50 py-20">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Ready to Streamline Your Agency?</h2>
            <p className="text-gray-600 my-4 max-w-2xl mx-auto">Join a new ecosystem for technical talent and take your resourcing business to the next level.</p>
            <button onClick={() => onNavigate('resourcingCompanySignUp')} className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 mt-2">
                Sign Up Now
            </button>
        </div>
      </section>
    </div>
  );
};