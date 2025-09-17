
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
      <section className="bg-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
            <img 
                src={AVATARS.steve} 
                alt="Steve Goodwin, Founder & CEO" 
                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-blue-400 shadow-lg"
            />
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Steve Goodwin</h1>
            <p className="text-xl text-blue-300 font-semibold mb-4">Founder & CEO</p>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
                "After 25+ years in the AV industry, I've seen the hiring process from every angle—as an integrator, a distributor, and for manufacturers. I built TechSubbies to solve the problems I witnessed firsthand."
            </p>
        </div>
      </section>

      {/* Founder's Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">A Vision Forged by Industry Experience</h2>
            <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
                <p>
                    Steve Goodwin's journey to founding TechSubbies.com wasn't forged in a startup incubator; it was built over a quarter-century of deep, hands-on experience within the professional AV industry. He's not just a CEO; he's an industry veteran who has seen the challenges of technical staffing from every possible perspective.
                </p>
                <p>
                    Throughout his extensive career, Steve has held key leadership roles across the entire supply chain. As an integrator, he understood the critical need for reliable, skilled engineers on the ground. As a Technical Director for a major distributor, he saw the gap between product potential and field expertise. And while working for leading manufacturers, he recognized the challenge of ensuring their cutting-edge technology was supported by a qualified freelance workforce.
                </p>
                <p>
                   This unique 360-degree view gave him unparalleled insight into the industry's biggest bottleneck: finding the right specialist for the right job, quickly and efficiently. He grew frustrated with the slow, expensive, and often inaccurate traditional recruitment model, where high fees benefited middlemen rather than the clients and the engineers themselves.
                </p>
                 <p>
                    TechSubbies.com is the culmination of that experience. It's a platform built on a deep understanding of what the industry truly needs: a direct, transparent, and technology-driven way for companies to connect with verified, skilled freelance talent. Steve's mission is to leverage technology to solve a problem he has lived with for decades, empowering both companies and engineers to build better, more efficiently, and more profitably.
                </p>
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
