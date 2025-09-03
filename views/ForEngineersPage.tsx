import React, { useState, useEffect } from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { Page, ProfileTier } from '../types/index.ts';
import { CheckCircle, BarChart, Star, Rocket, Clapperboard, TrendingUp, Award } from '../components/Icons.tsx';
import { HERO_IMAGES } from '../data/assets.ts';

interface ForEngineersPageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start">
        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
        <span className="text-gray-600">{children}</span>
    </li>
);

const TestimonialCard = ({ quote, name, role, avatar }: { quote: string, name: string, role: string, avatar: string }) => (
    <div className="bg-blue-700 p-6 rounded-lg text-center h-full flex flex-col">
        <img src={avatar} alt={name} className="w-20 h-20 rounded-full mx-auto -mt-12 border-4 border-blue-600 shadow-lg"/>
        <p className="text-blue-200 italic my-4 flex-grow">"{quote}"</p>
        <div>
            <p className="font-bold text-white">{name}</p>
            <p className="text-sm text-blue-300">{role}</p>
        </div>
    </div>
);

const FeatureDetailCard = ({ icon: Icon, title, children }: { icon: React.ComponentType<any>, title: string, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-3">
            <Icon className="w-8 h-8 text-blue-500 mr-3" />
            <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-gray-600">{children}</p>
    </div>
);

export const ForEngineersPage = ({ onNavigate, onHowItWorksClick }: ForEngineersPageProps) => {
    const [heroImage, setHeroImage] = useState('');

    useEffect(() => {
        setHeroImage(HERO_IMAGES.engineers[Math.floor(Math.random() * HERO_IMAGES.engineers.length)]);
    }, []);

    const TIER_STYLES = {
        // FIX: Corrected typo in Tailwind class from text-amber-8-00 to text-amber-800
        [ProfileTier.BASIC]: { border: 'border-amber-700', titleText: 'text-amber-800', buttonBg: 'bg-amber-700', buttonHoverBg: 'hover:bg-amber-800', badgeBg: 'bg-amber-700' },
        [ProfileTier.PROFESSIONAL]: { border: 'border-slate-400', titleText: 'text-slate-600', buttonBg: 'bg-slate-500', buttonHoverBg: 'hover:bg-slate-600', badgeBg: 'bg-slate-500' },
    };

    const TIERS = [
        {
            tier: ProfileTier.BASIC, title: "Bronze", price: "FREE", period: " / Forever",
            ctaText: "Get Started for Free", styles: TIER_STYLES[ProfileTier.BASIC],
            features: [ "Create your public professional profile", "Appear in general searches", "Set your availability calendar", "Search and apply for jobs" ]
        },
        {
            tier: ProfileTier.PROFESSIONAL, title: "Silver", price: "£7", period: " / month",
            ctaText: "Start 30-Day Free Trial", isFeatured: true, styles: TIER_STYLES[ProfileTier.PROFESSIONAL],
            features: [ "Everything in Bronze, plus:", "Add Core Skills & Verified Certifications", "Add 1 Specialist Role with rated skills", "Access all AI-powered Tools", "Create visual case studies (Storyboards)", "Includes 5 Role Credits", "Priority ranking in company searches", "Covered by our Security Net Guarantee" ]
        },
    ];

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
            <main className="flex-grow pt-24">
                <section className="relative text-white text-center min-h-[50vh] flex items-center justify-center px-4 bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }}>
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <div className="relative z-10 max-