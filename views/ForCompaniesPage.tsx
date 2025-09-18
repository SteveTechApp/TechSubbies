


import React from 'react';
import { Page } from '../types';
import { PageHeader } from '../components/PageHeader';
import { HighlightCard } from '../components/HighlightCard';
import { DollarSign, Sparkles, Users, FileText, KanbanSquare, Briefcase } from '../components/Icons';

interface ForCompaniesPageProps {
  onNavigate: (page: Page) => void;
}

export const ForCompaniesPage = ({ onNavigate }: ForCompaniesPageProps) => {
  return (
    <div className="bg-white">
      {/* FIX: Replaced string literal with Page enum for type safety. */}
      <PageHeader onBack={() => onNavigate(Page.LANDING)} />

      {/* Hero Section */}
      <section className="relative bg-gray-800 text-white py-20 text-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')` }}></div>
        <div className="relative container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Find & Hire Elite Tech Talent. Instantly.</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Post jobs for free and let our AI instantly match you with the world's top freelance AV & IT engineers based on deep-skill analysis.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">A Smarter Way to Hire</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">Our platform is designed to eliminate the friction in finding and managing specialist freelance talent.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <HighlightCard icon={DollarSign} title="Completely Free to Post">
              Post unlimited jobs, search our network, and review applicants, all for free. We are funded by engineer subscriptions, not by you.
            </HighlightCard>
            <HighlightCard icon={Sparkles} title="AI Smart Match">
              Stop guessing. Our AI analyzes engineers' detailed skill profiles against your job needs and gives you a ranked list of the best candidates with a match score.
            </HighlightCard>
            <HighlightCard icon={Users} title="Direct Access to Talent">
              No recruiters, no gatekeepers. Browse profiles, message candidates directly, and build your own 'Talent Pools' of trusted freelancers for future work.
            </HighlightCard>
            <HighlightCard icon={FileText} title="Integrated Contracting">
              Create, send, and e-sign contracts directly on the platform. Choose from milestone-based SOWs or simple Day Rate agreements.
            </HighlightCard>
            <HighlightCard icon={KanbanSquare} title="Simplified Project Management">
              Approve milestones or timesheets with a single click. For SOW projects, fund a secure escrow account for total peace of mind.
            </HighlightCard>
            <HighlightCard icon={Briefcase} title="Build Your Dream Team">
              Don't just fill a role, build a flexible team. Use our Project Planner to map out your freelance needs for entire projects from start to finish.
            </HighlightCard>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-600 py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to Find Your Next Hire?</h2>
          <p className="my-4 max-w-2xl mx-auto text-blue-100">Join the world's leading companies who are building their flexible workforce on TechSubbies.</p>
          {/* FIX: Replaced string literal with Page enum for type safety. */}
          <button onClick={() => onNavigate(Page.COMPANY_SIGNUP)} className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105 mt-2">
            Post a Job For Free
          </button>
        </div>
      </section>
    </div>
  );
};