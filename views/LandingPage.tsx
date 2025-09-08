import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Page } from '../types';
import { FeatureCard } from '../components/FeatureCard';
import { Search, Sparkles, Handshake, ArrowRight } from '../components/Icons';
import { FeatureSlideshow } from '../components/FeatureSlideshow';
import { TestimonialCard } from '../components/TestimonialCard';
import { AVATARS } from '../data/assets';
import { FeaturedJobCard } from '../components/FeaturedJobCard';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export const LandingPage = ({ onNavigate }: LandingPageProps) => {
  const { user, jobs } = useAppContext();

  const featuredJobs = useMemo(() => {
    return jobs
        .filter(job => job.status === 'active')
        .sort((a, b) => parseInt(b.dayRate, 10) - parseInt(a.dayRate, 10))
        .slice(0, 3);
  }, [jobs]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-800 text-white pt-32 pb-20 text-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop')` }}></div>
        <div className="relative container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 fade-in-up">The UK's Specialist Freelance Network</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
            AI-powered matching connects expert AV &amp; IT engineers with the UK's leading tech companies. No recruiters. No placement fees. Just direct connections.
          </p>
          <div className="flex justify-center gap-4 fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => onNavigate(user ? (user.profile.role === 'Engineer' ? 'engineerDashboard' : 'companyDashboard') : 'engineerSignUp')}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Find Work
            </button>
            <button
              onClick={() => onNavigate(user ? (user.profile.role === 'Engineer' ? 'engineerDashboard' : 'companyDashboard') : 'companySignUp')}
              className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
            >
              Find Talent
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why TechSubbies?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">We're not another job board. We're a technology platform built for the specifics of the specialist tech industry.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={Search} title="Precision Search">
              Companies find engineers based on granular, rated skills, not just keywords. Engineers get matched with jobs that truly fit their expertise.
            </FeatureCard>
            <FeatureCard icon={Sparkles} title="AI Smart Match">
              Our Gemini-powered AI instantly ranks the best candidates for your job, complete with a percentage match score. Hiring decisions in minutes, not weeks.
            </FeatureCard>
            <FeatureCard icon={Handshake} title="Direct Connections">
              No recruiters, no middlemen, no placement fees. Companies post jobs for free and connect directly with the freelance talent they need.
            </FeatureCard>
          </div>
        </div>
      </section>

       {/* How It Works (Visual) Section */}
       <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">The Future of Freelance Hiring</h2>
                <p className="text-gray-600 max-w-3xl mx-auto">See how our unique skills-first approach creates the perfect match between client needs and engineer expertise.</p>
            </div>
            <div className="max-w-4xl mx-auto h-[30rem] md:h-[40rem]">
                <FeatureSlideshow />
            </div>
        </div>
      </section>
      
      {/* Featured Jobs Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Contracts</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Here are some of the high-value contracts available right now. Create a profile to apply and get matched with more.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredJobs.map(job => (
                <FeaturedJobCard key={job.id} job={job} onNavigate={onNavigate} />
            ))}
          </div>
           <button
              onClick={() => onNavigate(user ? (user.profile.role === 'Engineer' ? 'engineerDashboard' : 'companyDashboard') : 'login')}
              className="mt-12 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 inline-flex items-center group"
          >
              Explore All Jobs
              <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

       {/* Testimonials Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Trusted by the Industry</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <TestimonialCard
              text="TechSubbies is a game-changer. The AI matching gave me the top 3 candidates for a complex Crestron role in under an hour. We had a contract signed the same day."
              author="Steve G., Project Manager"
              company="Pro AV Solutions"
              avatar={AVATARS.steve}
            />
            <TestimonialCard
              text="As a freelance engineer, the Skills Profile is incredible. I can finally showcase my deep expertise in Biamp and Dante, and I'm getting invites for jobs that are a perfect fit."
              author="Neil B., AV Engineer"
              company="Freelance Contractor"
              avatar={AVATARS.neil}
            />
             <TestimonialCard
              text="We've cut our hiring time by 80%. No more sifting through irrelevant CVs. We post a job, get a ranked list of matched engineers, and start conversations. It's that simple."
              author="Emily C., Operations Director"
              company="Nexus IT"
              avatar={AVATARS.emily}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">Whether you're looking for your next contract or searching for specialist talent, get started for free today.</p>
           <button
              onClick={() => onNavigate('engineerSignUp')}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Create Your Profile
            </button>
        </div>
      </section>

    </div>
  );
};
