import React, { useState, useEffect, useRef } from 'react';
import { MousePointer } from './Icons';

// --- Slide Content Components ---

const Slide1Content = () => (
    <div className="w-full h-full relative flex items-center justify-center text-center text-white p-8">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')` }}></div>
        <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
        <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">How It Works</h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                A transparent, AI-powered process for Engineers, Companies, and Resourcing Agencies.
            </p>
        </div>
    </div>
);

const Slide2Content = () => (
    <div className="w-full h-full p-8 flex items-center justify-center bg-gray-200 font-sans">
        <div className="w-[480px] bg-white rounded-lg shadow-xl p-6 scale-90 transform">
            <h3 className="font-bold text-lg text-gray-800">Neil B. - Skills Profile</h3>
            <p className="text-sm text-gray-500">Premium Member</p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800">Specialist Role: AV Systems Engineer <button className="float-right text-xs bg-gray-200 px-2 py-1 rounded-md text-gray-600 font-medium hover:bg-gray-300">Edit</button></h4>
                <div className="mt-3 space-y-3 text-sm">
                    <div>
                        <div className="flex justify-between font-medium text-gray-700"><span>System Commissioning</span><span>95</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1"><div className="bg-green-500 h-2.5 rounded-full" style={{width: '95%'}}></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between font-medium text-gray-700"><span>Troubleshooting</span><span>90</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1"><div className="bg-green-500 h-2.5 rounded-full" style={{width: '90%'}}></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between font-medium text-gray-700"><span>Crestron Programming</span><span>80</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1"><div className="bg-blue-500 h-2.5 rounded-full" style={{width: '80%'}}></div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Slide3Content = () => (
    <div className="w-full h-full p-8 flex items-center justify-center bg-gray-200 font-sans">
        <div className="w-[480px] bg-white rounded-lg shadow-xl p-6 scale-90 transform">
            <h3 className="font-bold text-lg text-gray-800">Post a Job - Define Skills</h3>
            <p className="text-sm text-gray-500">Required skills for: <span className="font-semibold">AV Systems Engineer</span></p>
            <div className="mt-4 space-y-2 text-sm p-4 bg-gray-50 rounded-lg border">
                <div className="flex justify-between items-center bg-white p-2 rounded-md">
                    <span className="font-medium text-gray-700">System Commissioning</span>
                    <div className="flex gap-2">
                        <button className="bg-yellow-400 text-xs px-3 py-1 rounded-full font-bold text-yellow-900 ring-2 ring-yellow-500">Essential</button>
                        <button className="bg-gray-200 text-xs px-3 py-1 rounded-full font-medium text-gray-600 hover:bg-gray-300">Desirable</button>
                    </div>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded-md">
                    <span className="font-medium text-gray-700">Troubleshooting</span>
                    <div className="flex gap-2">
                        <button className="bg-yellow-400 text-xs px-3 py-1 rounded-full font-bold text-yellow-900">Essential</button>
                        <button className="bg-gray-200 text-xs px-3 py-1 rounded-full font-medium text-gray-600 hover:bg-gray-300">Desirable</button>
                    </div>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded-md">
                    <span className="font-medium text-gray-700">Crestron Programming</span>
                    <div className="flex gap-2">
                        <button className="bg-gray-200 text-xs px-3 py-1 rounded-full font-medium text-gray-600 hover:bg-gray-300">Essential</button>
                        <button className="bg-blue-200 text-xs px-3 py-1 rounded-full font-bold text-blue-800 ring-2 ring-blue-400">Desirable</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Slide4Content = () => (
    <div className="w-full h-full p-8 flex items-center justify-center bg-gray-200 font-sans">
        <div className="w-[480px] bg-white rounded-lg shadow-xl p-6 scale-90 transform">
            <h3 className="font-bold text-lg text-gray-800">Resourcing Dashboard</h3>
            <p className="text-sm text-gray-500">Manage talent and find placements.</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border">
                    <h4 className="font-semibold text-sm mb-2 text-gray-700">My Engineers</h4>
                    <div className="space-y-2">
                        <div className="bg-white p-2 rounded-md text-xs flex justify-between items-center"><span>Neil B. (AV)</span><button className="text-blue-600 font-semibold">Apply</button></div>
                        <div className="bg-white p-2 rounded-md text-xs flex justify-between items-center"><span>Samantha G. (AV)</span><button className="text-blue-600 font-semibold">Apply</button></div>
                        <div className="bg-white p-2 rounded-md text-xs flex justify-between items-center"><span>David C. (IT)</span><button className="text-blue-600 font-semibold">Apply</button></div>
                    </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                     <h4 className="font-semibold text-sm mb-2 text-gray-700">Available Jobs</h4>
                     <div className="space-y-2">
                        <div className="bg-white p-2 rounded-md text-xs"><strong>Senior AV Engineer</strong><p>Pro AV Solutions</p></div>
                        <div className="bg-white p-2 rounded-md text-xs"><strong>IT Support Contract</strong><p>Nexus IT</p></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Slide5Content = () => (
    <div className="w-full h-full p-8 flex items-center justify-center bg-gray-200 font-sans">
        <div className="w-[480px] h-full bg-white rounded-lg shadow-xl p-6 scale-90 transform overflow-hidden">
            <h3 className="font-bold text-lg text-gray-800">Applicants: Senior AV Engineer</h3>
            <p className="text-sm text-gray-500">Showing top results based on AI Smart Match</p>
            <div className="mt-4 space-y-3">
                <div className="p-3 border-2 border-green-400 rounded-lg flex items-center justify-between bg-green-50">
                    <div className="flex items-center gap-3">
                        <img src="https://xsgames.co/randomusers/assets/avatars/male/74.jpg" alt="Neil B." className="w-12 h-12 rounded-full"/>
                        <div>
                            <p className="font-bold text-gray-800">Neil B.</p>
                            <p className="text-xs text-blue-700 font-semibold">AV Systems Engineer</p>
                        </div>
                    </div>
                    <div className="bg-green-500 text-white font-bold text-lg px-3 py-1.5 rounded-full">97%</div>
                </div>
                <div className="p-3 border rounded-lg flex items-center justify-between bg-white">
                     <div className="flex items-center gap-3">
                        <img src="https://xsgames.co/randomusers/assets/avatars/female/10.jpg" alt="Samantha G." className="w-12 h-12 rounded-full"/>
                        <div>
                            <p className="font-bold text-gray-800">Samantha G.</p>
                            <p className="text-xs text-blue-700 font-semibold">AV Technician</p>
                        </div>
                    </div>
                    <div className="bg-blue-500 text-white font-bold text-lg px-3 py-1.5 rounded-full">82%</div>
                </div>
                <div className="p-3 border rounded-lg flex items-center justify-between bg-white">
                     <div className="flex items-center gap-3">
                        <img src="https://xsgames.co/randomusers/assets/avatars/male/46.jpg" alt="John S." className="w-12 h-12 rounded-full"/>
                        <div>
                            <p className="font-bold text-gray-800">John S.</p>
                            <p className="text-xs text-blue-700 font-semibold">Install Engineer</p>
                        </div>
                    </div>
                    <div className="bg-yellow-500 text-white font-bold text-lg px-3 py-1.5 rounded-full">68%</div>
                </div>
            </div>
        </div>
    </div>
);

const Slide6Content = () => (
    <div className="w-full h-full p-8 flex items-center justify-center bg-gray-200 font-sans">
        <div className="w-[480px] bg-white rounded-lg shadow-xl p-6 scale-90 transform text-center">
            <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                    <img src="https://i.imgur.com/L45aA6d.jpg" alt="Company representative" className="w-20 h-20 rounded-full mx-auto border-4 border-blue-500"/>
                    <p className="font-bold mt-2">Company</p>
                </div>
                <div className="font-mono text-3xl font-bold text-gray-400 animate-pulse">&lt;--&gt;</div>
                <div className="text-center">
                    <img src="https://xsgames.co/randomusers/assets/avatars/male/74.jpg" alt="Freelance engineer" className="w-20 h-20 rounded-full mx-auto border-4 border-green-500"/>
                    <p className="font-bold mt-2">Engineer</p>
                </div>
            </div>
            <h3 className="mt-6 text-2xl font-extrabold text-gray-800">Direct Connections</h3>
            <p className="text-gray-600">No recruiters. No placement fees. Just the right talent for the job.</p>
        </div>
    </div>
);


const SLIDES = [
    {
        title: "How It Works",
        description: "A transparent, AI-powered process for Engineers, Companies, and Resourcing Agencies.",
        content: <Slide1Content />,
        animationClass: "",
    },
    {
        title: "1. For Engineers: Showcase Your Expertise",
        description: "Engineers add a 'Specialist Role' to their premium profile and rate their competency on the granular, industry-specific skills that matter.",
        content: <Slide2Content />,
        animationClass: "animate-cursor-1",
    },
    {
        title: "2. For Companies: Define Your Exact Needs",
        description: "Companies post jobs for free, selecting a role that auto-populates required skills. They then mark each one as 'Essential' or 'Desirable'.",
        content: <Slide3Content />,
        animationClass: "animate-cursor-2",
    },
     {
        title: "3. For Resourcing: Manage Your Talent",
        description: "Resourcing agencies use a centralized dashboard to manage their engineers and apply to jobs on their behalf.",
        content: <Slide4Content />,
        animationClass: "animate-cursor-4",
    },
    {
        title: "4. AI Delivers the Perfect Match",
        description: "The platform's AI analyzes skills against requirements, instantly generating a ranked list of candidates with a precise match score.",
        content: <Slide5Content />,
        animationClass: "animate-cursor-3",
    },
    {
        title: "5. Connect Directly. No Middlemen.",
        description: "The result is a fast, fair, and focused connection that saves everyone time and money. It's the modern way to hire freelance tech talent.",
        content: <Slide6Content />,
        animationClass: "",
    },
];

export const FeatureSlideshow = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const timerRef = useRef<number | null>(null);
    const SLIDE_DURATION = 8000;

    const resetTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        timerRef.current = window.setInterval(() => {
            setActiveSlide(prev => (prev + 1) % SLIDES.length);
        }, SLIDE_DURATION);
    };

    const goToSlide = (index: number) => {
        setActiveSlide(index);
        resetTimer(); // Reset the timer on any manual navigation
    };

    useEffect(() => {
        resetTimer(); // Start the timer on component mount
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div className="w-full h-full flex flex-col items-center">
            <div className="relative w-full h-full bg-gray-100 border-4 border-gray-800 rounded-lg overflow-hidden shadow-inner">
                {SLIDES.map((slide, index) => (
                    <div
                        key={index}
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{
                            opacity: activeSlide === index ? 1 : 0,
                            zIndex: activeSlide === index ? 10 : 0,
                            pointerEvents: activeSlide === index ? 'auto' : 'none',
                        }}
                    >
                        <div className="absolute inset-0">
                            {slide.content}
                        </div>
                        {/* Conditionally render the cursor animation only for the active slide to ensure it restarts */}
                        {slide.animationClass && activeSlide === index && (
                            <div className="absolute inset-0">
                                <MousePointer size={24} className={`absolute text-yellow-300 drop-shadow-lg ${slide.animationClass}`} />
                            </div>
                        )}
                         <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/70 backdrop-blur-sm text-white">
                            <h3 className="font-bold text-lg sm:text-xl text-yellow-300">{slide.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-200">{slide.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center gap-2 mt-4">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${activeSlide === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};