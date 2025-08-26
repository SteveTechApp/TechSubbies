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
                                <p>The traditional hiring process was broken—it was slow, inefficient, and created unnecessary barriers between skilled engineers and the companies that needed them. The vision was simple: create a