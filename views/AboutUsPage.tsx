import React from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { Page } from '../types/index.ts';
import { Users, Briefcase, Zap } from '../components/Icons.tsx';

interface AboutUsPageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

export const AboutUsPage = ({ onNavigate, onHowItWorksClick }: AboutUsPageProps) => {
    return (
        <div className="bg-white flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
            <main className="flex-grow pt-24">
                {/* Hero Section */}
                <section 
                    className="relative text-white text-center min-h-[40vh] flex items-center justify-center px-4 bg-cover bg-center"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop')` }}
                >
                    <div className="absolute inset-0 bg-blue-800 opacity-70"></div>
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Connecting Expertise with Opportunity</h1>
                        <p className="text-lg md:text-xl mx-auto">We're building the digital infrastructure for the freelance AV & IT industry, making it easier than ever to find the right talent and the right projects.</p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 text-center max-w-4xl">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Mission</h2>
                        <p className="text-lg text-gray-600">
                            Our mission is to solve a critical, dual-sided problem in the technology sector. Companies struggle to find qualified, available specialist engineers quickly, leading to project delays. Meanwhile, talented freelance engineers lack a dedicated platform to showcase their niche skills and manage their work pipeline effectively. TechSubbies.com bridges this gap, creating a seamless, efficient marketplace for the freelance tech community.
                        </p>
                    </div>
                </section>
                
                {/* Story Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 max-w-5xl">
                         <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Our Story</h2>
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="text-gray-700 space-y-4">
                                <p>TechSubbies.com was founded by Steve Goodwin, an industry veteran with over two decades of experience in technical project management. After years of relying on outdated spreadsheets, personal networks, and expensive recruitment agencies to find specialist freelancers, Steve knew there had to be a better way.</p>
                                <p>The traditional hiring process was broken—it was slow, inefficient, and created unnecessary barriers between skilled engineers and the companies that needed them. The vision was simple: create a purpose-built platform that streamlines the entire engagement lifecycle.</p>
                                <p>Today, TechSubbies.com is that solution—a modern, intuitive hub where companies can post jobs for free and engineers can build powerful profiles that truly represent their skills and real-time availability. We are passionate about empowering freelance professionals and helping companies build the best teams for their projects.</p>
                            </div>
                             <div>
                                <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center">
                                    <img 
                                        src="https://i.imgur.com/RfjB4zR.jpg" 
                                        alt="Steve Goodwin, Founder"
                                        className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500"
                                    />
                                    <h3 className="text-2xl font-bold text-gray-800">Steve Goodwin</h3>
                                    <p className="text-blue-600 font-semibold">Founder & CEO</p>
                                    <p className="text-gray-600 mt-2 text-sm">"We're not just building a platform; we're building a community. Our goal is to be the trusted partner for every freelance tech professional and every company looking to hire them."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-16 bg-blue-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold mb-4">Join the Network</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">Whether you're a company looking to hire or an engineer looking for your next challenge, TechSubbies is your platform for success.</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => onNavigate('login')} className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105">Find Talent</button>
                            <button onClick={() => onNavigate('engineerSignUp')} className="bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/30 transition">Find Work</button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
        </div>
    );
};