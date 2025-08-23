import React, { useState } from 'react';
import { useAppContext, MOCK_COMPANIES } from '../context/AppContext.tsx';
import { Header } from '../components/Header.tsx';
import { Footer } from '../components/Footer.tsx';
import { InvestorPage } from './InvestorPage.tsx';
import { StatCard } from '../components/StatCard.tsx';
import { FeatureCard } from '../components/FeatureCard.tsx';
import { Users, Building, ClipboardList, DollarSign, Calendar, Handshake } from '../components/Icons.tsx';
import { HowItWorksModal } from '../components/HowItWorksModal.tsx';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage = ({ onLoginClick }: LandingPageProps) => {
  const { engineers, jobs } = useAppContext();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  
  const handleHowItWorksClick = () => setIsHowItWorksOpen(true);

  const featuredCompanies = MOCK_COMPANIES.filter(c => c.consentToFeature).slice(0, 5);

  return (
    <>
      <Header isLanding={true} onLoginClick={onLoginClick} onHowItWorksClick={handleHowItWorksClick} />
      <main className="bg-gray-50">
          {/* Hero Section */}
          <section className="relative text-white text-center min-h-[60vh] md:min-h-[70vh] flex items-center justify-center px-4">
              <div 
                  className="absolute inset-0 bg-cover bg-center z-0" 
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521185496955-15097b20c5fe?q=80&w=1950&auto=format&fit=crop')" }}
              ></div>
              <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
              <div className="relative z-20 max-w-4xl">
                  <h1 
                      className="text-4xl md:text-6xl font-extrabold mb-4 fade-in-up"
                  >Find Your Next Tech Subcontractor. Instantly.</h1>
                  <p 
                      className="text-lg md:text-xl max-w-3xl mx-auto mb-8 fade-in-up" 
                      style={{ animationDelay: '0.2s' }}
                  >The free-to-use platform for companies to find and hire expert freelance Tech (AV & IT) engineers with verified availability. No placement fees. No hassle.</p>
                  <div 
                      className="flex justify-center space-x-4 fade-in-up"
                      style={{ animationDelay: '0.4s' }}
                  >
                      <button onClick={onLoginClick} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Post a Job for FREE</button>
                      <button onClick={onLoginClick} className="bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-8 rounded-lg hover:bg-white/30 transition">Find Talent</button>
                  </div>
              </div>
          </section>

          {/* Stats Section */}
          <section className="py-16">
              <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                  <StatCard icon={Users} value={`${engineers.length}+`} label="Vetted Tech Engineers" />
                  <StatCard icon={Building} value={`${MOCK_COMPANIES.length}+`} label="Active Companies" />
                  <StatCard icon={ClipboardList} value={`${jobs.length}+`} label="Jobs Posted" />
              </div>
          </section>
          
          {/* Trusted By Section */}
          <section className="py-12 bg-gray-100">
            <div className="container mx-auto px-4 text-center">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Trusted by leading integrators & managed service providers</h3>
              <div className="flex justify-center items-center space-x-12 flex-wrap text-gray-400">
                  {featuredCompanies.map(company => (
                      <span key={company.id} className="text-2xl font-bold">{company.name}</span>
                  ))}
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section id="features" className="py-16 bg-white">
              <div className="container mx-auto px-4">
                  <h2 className="text-4xl font-bold text-center mb-12">Why TechSubbies is Different</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <FeatureCard icon={DollarSign} title="Zero Cost for Companies">It is completely free for companies to post jobs and find engineers. We believe in removing barriers to connect talent with opportunity.</FeatureCard>
                      <FeatureCard icon={Calendar} title="Real-Time Availability">Our integrated calendar system means you only see engineers who are actually available for your project dates, saving you time.</FeatureCard>
                      <FeatureCard icon={Handshake} title="Direct Engagement">Communicate and negotiate directly with engineers. We facilitate the connection and get out of your way. No middleman fees.</FeatureCard>
                  </div>
              </div>
          </section>
      </main>
      <Footer onLoginClick={onLoginClick} />
      <HowItWorksModal 
          isOpen={isHowItWorksOpen} 
          onClose={() => setIsHowItWorksOpen(false)} 
      />
    </>
  );
};
