
import React from 'react';
import { Page } from '../types';
import { TestimonialCard } from '../components/TestimonialCard';
import { AVATARS } from '../data/assets';
import { Handshake, Sparkles, Globe } from '../components/Icons';

interface AboutUsPageProps {
  onNavigate: (page: Page) => void;
}

export const AboutUsPage = ({ onNavigate }: AboutUsPageProps) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-800 text-white py-20 text-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')` }}></div>
        <div className="relative container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Our Mission</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            To build the most efficient, transparent, and trusted platform for connecting specialist technical freelancers with the companies that need them.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full inline-block mb-4"><Handshake className="w-10 h-10 text-blue-600" /></div>
              <h3 className="text-xl font-bold mb-2">Direct Connections</h3>
              <p className="text-gray-600">We believe in empowering direct relationships. No recruiters, no middlemen, just pure connection between talent and opportunity.</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full inline-block mb-4"><Sparkles className="w-10 h-10 text-blue-600" /></div>
              <h3 className="text-xl font-bold mb-2">Technological Innovation</h3>
              <p className="text-gray-600">We leverage technology like AI not as a gimmick, but to solve real-world hiring problems, making matching faster, smarter, and more accurate.</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full inline-block mb-4"><Globe className="w-10 h-10 text-blue-600" /></div>
              <h3 className="text-xl font-bold mb-2">Building a Community</h3>
              <p className="text-gray-600">TechSubbies is more than a platform; it's a community for professionals to share knowledge, grow their skills, and build lasting careers.</p>
            </div>
          </div>
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
      <section className="bg-gray-800 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold">Join the Network</h2>
          <button onClick={() => onNavigate('login')} className="mt-6 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};
