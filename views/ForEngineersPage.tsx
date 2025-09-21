import React from 'react';
import { Page } from '../types';
import { PageHeader } from '../components/PageHeader';
import { HighlightCard } from '../components/HighlightCard';
import { Star, Sparkles, Handshake, DollarSign, Users, Briefcase } from '../components/Icons';

interface ForEngineersPageProps {
  onNavigate: (page: Page) => void;
}

export const ForEngineersPage = ({ onNavigate }: ForEngineersPageProps) => {
  return (
    <div className="bg-white">
      {/* FIX: Replaced string literal with Page enum for type safety. */}
      <PageHeader onBack={() => onNavigate(Page.LANDING)} />

      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-16 text-center">
         <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581092921462-205273467433?q=80&w=2070&auto=format&fit=crop')` }}></div>
         <div className="relative container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Your Skills. Your Rate. Your Contracts.</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
                TechSubbies.com is built for specialist engineers. Showcase your deep expertise, get matched with high-value jobs, and take control of your freelance career.
            </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Features Designed For You</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">Stop wasting time on generic job boards. Our platform is built to understand and highlight your unique technical skills.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <HighlightCard icon={Star} title="Detailed Skills Profile">
              Go beyond a basic CV. Add specialist roles and rate your competency on granular, industry-specific skills to prove your expertise.
            </HighlightCard>
            <HighlightCard icon={Sparkles} title="AI-Powered Matching">
              Our AI reads the fine print. It matches your detailed skills profile to jobs that require your specific knowledge, so you only see relevant opportunities.
            </HighlightCard>
            <HighlightCard icon={Handshake} title="Direct Client Access">
              No recruiters in the middle. Communicate, negotiate, and sign contracts directly with the hiring companies.
            </HighlightCard>
            <HighlightCard icon={DollarSign} title="Secure & Prompt Payments">
                Utilize our escrow system for milestone projects. Once work is approved, payment is released. No more chasing invoices.
            </HighlightCard>
             <HighlightCard icon={Users} title="Build Your Network">
                Every completed contract adds a client to your permanent network, making it easy to get repeat work from companies who trust you.
            </HighlightCard>
             <HighlightCard icon={Briefcase} title="One-Click Applications">
                Your profile is your application. Find a job you like and apply with a single click. We'll handle the rest.
            </HighlightCard>
          </div>
        </div>
      </section>
      
       {/* How It Works Steps */}
       <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">Your Journey on TechSubbies.com</h2>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                <div className="text-center md:text-left">
                    <div className="text-5xl font-extrabold text-blue-100 mb-2">01</div>
                    <h3 className="text-2xl font-bold mb-2">Create Your Profile</h3>
                    <p className="text-gray-600">Build your free profile in minutes. Upgrade to a premium 'Skills Profile' to add specialist roles and showcase your deep expertise to stand out.</p>
                </div>
                 <div className="text-center md:text-left">
                    <div className="text-5xl font-extrabold text-blue-100 mb-2">02</div>
                    <h3 className="text-2xl font-bold mb-2">Find & Apply</h3>
                    <p className="text-gray-600">Search our exclusive job board. Our AI ensures you see the most relevant contracts first. Apply with a single click.</p>
                </div>
                 <div className="text-center md:text-left">
                    <div className="text-5xl font-extrabold text-blue-100 mb-2">03</div>
                    <h3 className="text-2xl font-bold mb-2">Sign & Work</h3>
                    <p className="text-gray-600">Receive offers and sign contracts directly on the platform with e-signatures. No more chasing paperwork or emails.</p>
                </div>
                 <div className="text-center md:text-left">
                    <div className="text-5xl font-extrabold text-blue-100 mb-2">04</div>
                    <h3 className="text-2xl font-bold mb-2">Get Paid & Grow</h3>
                    <p className="text-gray-600">Submit timesheets or milestones for approval. Get paid securely and on time. Every completed job builds your reputation and network.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Ready to Find Your Next Contract?</h2>
            <p className="text-gray-600 my-4 max-w-2xl mx-auto">Join a network of elite freelance professionals and connect with the world's top technology companies.</p>
            {/* FIX: Replaced string literal with Page enum for type safety. */}
            <button onClick={() => onNavigate(Page.ENGINEER_SIGNUP)} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 mt-2">
                Sign Up For Free
            </button>
        </div>
      </section>
    </div>
  );
};