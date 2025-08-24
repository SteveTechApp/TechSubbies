import React, { useState, useEffect } from 'react';
import { useAppContext, MOCK_COMPANIES } from '../context/AppContext.tsx';
import { Header } from '../components/Header.tsx';
import { Footer } from '../components/Footer.tsx';
import { InvestorPage } from './InvestorPage.tsx';
import { StatCard } from '../components/StatCard.tsx';
import { FeatureCard } from '../components/FeatureCard.tsx';
import { Users, Building, ClipboardList, DollarSign, Calendar, Handshake, User, Briefcase } from '../components/Icons.tsx';
import { HowItWorksModal } from '../components/HowItWorksModal.tsx';

interface LandingPageProps {
  onLoginClick: () => void;
  onNavigate: (page: 'forEngineers' | 'forCompanies') => void;
}

const heroImages = [
  'https://images.unsplash.com/photo-1521185496955-15097b20c5fe?q=80&w=1950&auto=format&fit=crop', // Original: Tech/Coding
  'https://images.unsplash.com/photo-1593349319623-7a4c16b1464e?q=80&w=1974&auto=format&fit=crop', // AV: Sound mixing board
  'https://images.unsplash.com/photo-1520085601670-6a3fb8b5535a?q=80&w=2070&auto=format&fit=crop', // IT: Server racks
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop', // Corporate AV/Collaboration
  'https://images.unsplash.com/photo-1621947082218-5c6216c43014?q=80&w=1974&auto=format&fit=crop', // Infrastructure: Network cables
];

export const LandingPage = ({ onLoginClick, onNavigate }: LandingPageProps) => {
  const { engineers, jobs } = useAppContext();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState(heroImages.length - 1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(prevIndex => {
        setPreviousImageIndex(prevIndex);
        return (prevIndex + 1) % heroImages.length;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  
  const handleHowItWorksClick = () => setIsHowItWorksOpen(true);
  const featuredCompanies = MOCK_COMPANIES.filter(c => c.consentToFeature).slice(0, 5);

  return (
    <>
      <Header isLanding={true} onLoginClick={onLoginClick} onHowItWorksClick={handleHowItWorksClick} onNavigate={onNavigate} />
      <main className="bg-gray-50">
          {/* Hero Section */}
          <section className="relative text-white text-center min-h-[50vh] md:min-h-[60vh] flex items-center justify-center px-4 overflow-hidden">
              {heroImages.map((src, index) => {
                  const isCurrent = index === currentImageIndex;
                  const isPrevious = index === previousImageIndex;
                  const baseClasses = 'absolute inset-0 bg-cover bg-center';
                  
                  if (isCurrent) {
                      return <div key={src} className={`${baseClasses} transition-opacity duration-1000 ease-in-out opacity-100 z-10`} style={{ backgroundImage: `url('${src}')` }} />;
                  }
                  if (isPrevious) {
                      return <div key={src} className={`${baseClasses} opacity-100 z-0`} style={{ backgroundImage: `url('${src}')` }} />;
                  }
                  return <div key={src} className={`${baseClasses} opacity-0 z-0`} style={{ backgroundImage: `url('${src}')` }} />;
              })}
              <div className="absolute inset-0 bg-black opacity-60 z-20"></div>
              <div className="relative z-30 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-extrabold mb-4 fade-in-up">Find Your Next Tech Subcontractor. Instantly.</h1>
                  <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 fade-in-up" style={{ animationDelay: '0.2s' }}>The free-to-use platform for companies to find and hire expert freelance Tech (AV & IT) engineers with verified availability. No placement fees. No hassle.</p>
                  <div className="flex justify-center space-x-4 fade-in-up" style={{ animationDelay: '0.4s' }}>
                      <button onClick={() => onNavigate('forCompanies')} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Post a Job for FREE</button>
                      <button onClick={() => onNavigate('forEngineers')} className="bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-8 rounded-lg hover:bg-white/30 transition">Find Work</button>
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
          
           {/* NEW: Role-based CTA Section */}
          <section className="py-16 bg-gray-100">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Built for Your Role</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">Whether you're looking for your next project or your next expert, TechSubbies is your dedicated platform.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <button onClick={() => onNavigate('forEngineers')} className="text-left p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="p-3 bg-blue-100 rounded-full inline-block mb-4">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">For Engineers</h3>
                  <p className="text-gray-600">Showcase your skills, set your availability, and let top companies come to you. Find your next contract without the hassle.</p>
                </button>
                <button onClick={() => onNavigate('forCompanies')} className="text-left p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="p-3 bg-green-100 rounded-full inline-block mb-4">
                    <Briefcase className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">For Companies</h3>
                  <p className="text-gray-600">Access a curated network of vetted AV & IT specialists. Post jobs for free and find the right talent instantly.</p>
                </button>
              </div>
            </div>
          </section>
          
          {/* Trusted By Section */}
          <section className="py-12 bg-white">
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
          <section id="features" className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                  <h2 className="text-4xl font-bold text-center mb-12">Why TechSubbies is Different</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <FeatureCard icon={DollarSign} title="Zero Cost for Companies">It is completely free for companies to post jobs and find engineers. We believe in removing barriers to connect talent with opportunity.</FeatureCard>
                      <FeatureCard icon={Calendar} title="Real-Time Availability">Our integrated calendar system means you only see engineers who are actually available for your project dates, saving you time.</FeatureCard>
                      <FeatureCard icon={Handshake} title="Direct Engagement">Communicate and negotiate directly with engineers. We facilitate the connection and get out of your way. No middleman fees.</FeatureCard>
                  </div>
              </div>
          </section>
          <InvestorPage />
      </main>
      <Footer onLoginClick={onLoginClick} />
      <HowItWorksModal 
          isOpen={isHowItWorksOpen} 
          onClose={() => setIsHowItWorksOpen(false)} 
      />
    </>
  );
};