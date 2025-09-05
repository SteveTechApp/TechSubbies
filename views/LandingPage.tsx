import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Page } from '../types/index.ts';
import { Header } from '../components/Header.tsx';
import { Footer } from '../components/Footer.tsx';
import { StatCard } from '../components/StatCard.tsx';
import { FeatureCard } from '../components/FeatureCard.tsx';
import { Users, Building, ClipboardList, DollarSign, Calendar, Handshake, User, Briefcase, MapPin, ArrowRight } from '../components/Icons.tsx';
import { HERO_IMAGES, COMPANY_LOGOS } from '../data/assets.ts';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  onHowItWorksClick: () => void;
}

const dynamicRoles = [
    "Tech Subcontractor", "AV Engineer", "Network Specialist",
    "Crestron Programmer", "Cloud Architect", "Live Events Tech",
];

const engineerPrompts = [
    "Get matched with high-value projects from leading integrators.",
    "Showcase your commissioning skills and land your next major installation.",
    "Your Cisco & Juniper expertise is in high demand. Find specialized contract roles.",
    "Connect with clients looking for certified SIMPL & C# programmers.",
    "Lead the next big cloud migration. Find top-tier AWS & Azure projects.",
    "Power the world's biggest shows, from festivals to corporate events.",
];

export const LandingPage = ({ onNavigate, onHowItWorksClick }: LandingPageProps) => {
  const { engineers, jobs, companies } = useAppContext();
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);
  const [textOpacity, setTextOpacity] = useState(1);
  
  useEffect(() => {
      const roleInterval = setInterval(() => {
          setTextOpacity(0); // Start fade out
          setTimeout(() => {
              setRoleIndex(prevIndex => (prevIndex + 1) % dynamicRoles.length);
              setTextOpacity(1); // Start fade in
          }, 500);
      }, 3000);
      
      const imageInterval = setInterval(() => {
          setHeroImageIndex(prevIndex => (prevIndex + 1) % HERO_IMAGES.landing.length);
      }, 6000); // Change image every 6 seconds

      return () => {
          clearInterval(roleInterval);
          clearInterval(imageInterval);
      };
  }, []);

  const featuredCompanies = companies.filter(c => c.consentToFeature).slice(0, 8);
  
  const featuredJobs = jobs
    .filter(j => j.status === 'active' && (parseInt(String(j.dayRate), 10) || 0) > 400)
    .sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime())
    .slice(0, 3);
    
  const getCompanyName = (companyId: string) => companies.find(c => c.id === companyId)?.name || 'A Leading Company';

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
      <main className="bg-gray-50 flex-grow pt-16">
           <section className="relative text-white text-center h-screen flex items-center justify-center px-4 overflow-hidden">
                {HERO_IMAGES.landing.map((src, index) => (
                    <div
                        key={src}
                        className="absolute inset-0 bg-cover bg-center z-0 slow-zoom transition-opacity duration-1000"
                        style={{
                            backgroundImage: `url('${src}')`,
                            opacity: index === heroImageIndex ? 1 : 0,
                        }}
                        aria-hidden="true"
                    />
                ))}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-blue-900/70 to-indigo-800/60 z-10" />
                
                <div className="relative z-20 max-w-4xl p-4 bg-black/20 backdrop-blur-md rounded-xl border border-white/10">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2 fade-in-up">
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
                        className="text-base text-gray-200 max-w-3xl mx-auto mb-4 fade-in-up transition-opacity duration-500 ease-in-out" 
                        style={{ animationDelay: '0.2s', opacity: textOpacity }}
                    >
                        {engineerPrompts[roleIndex]}
                    </p>
                    <div className="flex justify-center space-x-4 fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <button onClick={() => onNavigate('login')} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg">Post a Job for FREE</button>
                        <button onClick={() => onNavigate('login')} className="bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold py-2 px-5 rounded-lg hover:bg-white/30 transition">Find Work</button>
                    </div>
                </div>
            </section>

          <section className="py-6">
              <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
                  <StatCard icon={Users} value={engineers.length} label="Skilled Tech Engineers" />
                  <StatCard icon={Building} value={companies.length} label="Active Companies" />
                  <StatCard icon={ClipboardList} value={jobs.length} label="Jobs Posted" />
              </div>
          </section>
          
           <section className="py-6 bg-gray-100">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Built for Your Role</h2>
              <p className="text-sm text-gray-600 max-w-2xl mx-auto mb-6">Whether you're looking for your next project or your next expert, TechSubbies is your dedicated platform.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                <button onClick={() => onNavigate('forEngineers')} className="text-left p-4 bg-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="p-2 bg-blue-100 rounded-full inline-block mb-2">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">For Engineers</h3>
                  <p className="text-gray-600 text-xs">Create a free profile, set your availability, and upgrade to a Skills Profile to showcase specialist expertise and land top contracts.</p>
                </button>
                <button onClick={() => onNavigate('forCompanies')} className="text-left p-4 bg-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="p-2 bg-green-100 rounded-full inline-block mb-2">
                    <Briefcase className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">For Companies</h3>
                  <p className="text-gray-600 text-xs">Access a curated network of skilled AV & IT specialists. Post jobs for free and find the right talent instantly.</p>
                </button>
              </div>
            </div>
          </section>

          <section className="py-8 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Featured Contracts</h2>
                <p className="text-sm text-gray-600 max-w-2xl mx-auto mb-6">Get a glimpse of the high-value opportunities available right now on the platform.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
                    {featuredJobs.map(job => (
                        <div key={job.id} className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col text-left">
                            <div className="flex-grow">
                                <p className="text-xs font-semibold text-blue-600">{getCompanyName(job.companyId)}</p>
                                <h3 className="text-base font-bold text-gray-800 my-1">{job.title}</h3>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                                    <span className="flex items-center"><MapPin size={12} className="mr-1"/>{job.location}</span>
                                    <span className="flex items-center"><DollarSign size={12} className="mr-1"/>{job.currency}{job.dayRate} / day</span>
                                </div>
                                <p className="text-xs text-gray-600">{job.description.substring(0, 100)}...</p>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <button onClick={() => onNavigate('login')} className="w-full font-bold py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm">
                                    View Details & Apply
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                     <button onClick={() => onNavigate('login')} className="font-bold text-blue-600 hover:text-blue-800 transition-colors group text-sm">
                        <span>View All Jobs</span>
                        <ArrowRight className="inline-block w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
          </section>
          
            <section className="py-6 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Trusted by leading integrators & managed service providers</h3>
                    <div className="flex justify-center items-center flex-wrap gap-x-8 gap-y-4">
                        {featuredCompanies.map(company => {
                            const LogoComponent = COMPANY_LOGOS[company.id as keyof typeof COMPANY_LOGOS];
                            if (!LogoComponent) return null;

                            return (
                                <button
                                    key={company.id}
                                    onClick={() => onNavigate('login')}
                                    title={`View ${company.name}'s profile - Login required`}
                                    className="opacity-70 hover:opacity-100 transition-opacity"
                                >
                                    <LogoComponent className="h-4 text-gray-500 transition-colors duration-300 hover:text-gray-800" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>
          
          <section id="features" className="py-6 bg-white">
              <div className="container mx-auto px-4">
                  <h2 className="text-2xl font-bold text-center mb-6">Why TechSubbies is Different</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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