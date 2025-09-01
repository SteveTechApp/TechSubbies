import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { MOCK_COMPANIES } from '../data/mockData.ts';
import { Page } from '../types/index.ts';
import { Header } from '../components/Header.tsx';
import { Footer } from '../components/Footer.tsx';
import { StatCard } from '../components/StatCard.tsx';
import { FeatureCard } from '../components/FeatureCard.tsx';
import { Users, Building, ClipboardList, DollarSign, Calendar, Handshake, User, Briefcase } from '../components/Icons.tsx';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  onHowItWorksClick: () => void;
}

// Dynamic text for the headline
const dynamicRoles = [
    "Tech Subcontractor",
    "AV Engineer",
    "Network Specialist",
    "Crestron Programmer",
    "Cloud Architect",
    "Live Events Tech",
];

// Matching prompts for engineers
const engineerPrompts = [
    "Get matched with high-value projects from leading integrators.",
    "Showcase your commissioning skills and land your next major installation.",
    "Your Cisco & Juniper expertise is in high demand. Find specialized contract roles.",
    "Connect with clients looking for certified SIMPL & C# programmers.",
    "Lead the next big cloud migration. Find top-tier AWS & Azure projects.",
    "Power the world's biggest shows, from festivals to corporate events.",
];

// NEW: Curated list of high-quality, relevant hero images
const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop', // Programmer at desk
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1974&auto=format&fit=crop', // Server room aisle
    'https://images.unsplash.com/photo-1521185496955-15097b20c5fe?q=80&w=1950&auto=format&fit=crop', // Close up of code on screen
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop', // Network globe concept
    'https://images.unsplash.com/photo-1614113489855-474aa913b438?q=80&w=1974&auto=format&fit=crop', // Live event sound mixing desk
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop' // Professionals collaborating
];


export const LandingPage = ({ onNavigate, onHowItWorksClick }: LandingPageProps) => {
  const { engineers, jobs } = useAppContext();
  const [heroImage, setHeroImage] = useState('');

  // State for headline animation
  const [roleIndex, setRoleIndex] = useState(0);
  const [textOpacity, setTextOpacity] = useState(1);
  
  useEffect(() => {
      // Select a random hero image on component mount
      setHeroImage(HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)]);

      const roleInterval = setInterval(() => {
          setTextOpacity(0); // Start fade out
          setTimeout(() => {
              setRoleIndex(prevIndex => (prevIndex + 1) % dynamicRoles.length);
              setTextOpacity(1); // Start fade in
          }, 500); // Wait for fade out to complete before changing text
      }, 3000); // Change role every 3 seconds

      return () => clearInterval(roleInterval);
  }, []);

  const featuredCompanies = MOCK_COMPANIES.filter(c => c.consentToFeature && c.logo).slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
      <main className="bg-gray-50 flex-grow pt-24">
           {/* Hero Section */}
           <section className="relative text-white text-center h-screen flex items-center justify-center px-4 overflow-hidden">
                {/* Static Background Image with slow zoom effect */}
                <div
                    className="absolute inset-0 bg-cover bg-center z-0 slow-zoom"
                    style={{ backgroundImage: `url('${heroImage}')` }}
                    aria-hidden="true"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-blue-900/70 to-indigo-800/60 z-10"></div>
                
                {/* Glassmorphism Content Box */}
                <div className="relative z-20 max-w-4xl p-8 bg-black/20 backdrop-blur-md rounded-xl border border-white/10">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 fade-in-up">
                        Find Your Next{' '}
                        <span 
                            className="text-blue-400 transition-opacity duration-500 ease-in-out"
                            style={{ opacity: textOpacity }}
                        >
                            {dynamicRoles[roleIndex]}
                        </span>
                        . Instantly.
                    </h1>
                    <p 
                        className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8 fade-in-up transition-opacity duration-500 ease-in-out" 
                        style={{ animationDelay: '0.2s', opacity: textOpacity }}
                    >
                        {engineerPrompts[roleIndex]}
                    </p>
                    <div className="flex justify-center space-x-4 fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <button onClick={() => onNavigate('login')} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg">Post a Job for FREE</button>
                        <button onClick={() => onNavigate('login')} className="bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/30 transition">Find Work</button>
                    </div>
                </div>
            </section>

          {/* Stats Section */}
          <section className="py-10">
              <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                  <StatCard icon={Users} value={`${engineers.length}+`} label="Skilled Tech Engineers" />
                  <StatCard icon={Building} value={`${MOCK_COMPANIES.length}+`} label="Active Companies" />
                  <StatCard icon={ClipboardList} value={`${jobs.length}+`} label="Jobs Posted" />
              </div>
          </section>
          
           {/* Role-based CTA Section */}
          <section className="py-10 bg-gray-100">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Built for Your Role</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">Whether you're looking for your next project or your next expert, TechSubbies is your dedicated platform.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <button onClick={() => onNavigate('forEngineers')} className="text-left p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="p-3 bg-blue-100 rounded-full inline-block mb-4">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">For Engineers</h3>
                  <p className="text-gray-600">Create a free profile, set your availability, and upgrade to a Skills Profile to showcase specialist expertise and land top contracts.</p>
                </button>
                <button onClick={() => onNavigate('forCompanies')} className="text-left p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="p-3 bg-green-100 rounded-full inline-block mb-4">
                    <Briefcase className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">For Companies</h3>
                  <p className="text-gray-600">Access a curated network of skilled AV & IT specialists. Post jobs for free and find the right talent instantly.</p>
                </button>
              </div>
            </div>
          </section>
          
          {/* Trusted By Section */}
          <section className="py-10 bg-white">
            <div className="container mx-auto px-4 text-center">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">Trusted by leading integrators & managed service providers</h3>
              <div className="flex justify-center items-center flex-wrap gap-x-12 gap-y-6">
                  {featuredCompanies.map(company => (
                      <img 
                          key={company.id} 
                          src={company.logo} 
                          alt={`${company.name} logo`}
                          className="h-10 object-contain"
                          title={company.name}
                      />
                  ))}
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section id="features" className="py-10 bg-gray-50">
              <div className="container mx-auto px-4">
                  <h2 className="text-4xl font-bold text-center mb-10">Why TechSubbies is Different</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <FeatureCard icon={DollarSign} title="Zero Cost for Companies">It is completely free for companies to post jobs and find engineers. We believe in removing barriers to connect talent with opportunity.</FeatureCard>
                      <FeatureCard icon={Calendar} title="Real-Time Availability">Our integrated calendar system means you only see engineers who are actually available for your project dates, saving you time.</FeatureCard>
                      <FeatureCard icon={Handshake} title="Direct Engagement">Communicate and negotiate directly with engineers. We facilitate the connection and get out of your way. No middleman fees.</FeatureCard>
                  </div>
              </div>
          </section>
      </main>
      <Footer onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
    </div>
  );
};