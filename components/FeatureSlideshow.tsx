import React, { useState, useEffect, useRef } from 'react';
import { MousePointer, Star, Briefcase, Sparkles, CheckCircle } from './Icons.tsx';

const SLIDES = [
    {
        title: "1. Showcase Your Expertise",
        description: "Engineers add a 'Specialist Role' to their premium profile and rate their competency on the granular, industry-specific skills that matter.",
        image: "https://i.imgur.com/eB3ZTwj.png", // Mockup of skill rating UI
        animationClass: "animate-[cursor-click-path-1_5s_ease-in-out_infinite]",
    },
    {
        title: "2. Define Your Exact Needs",
        description: "Companies post jobs for free, selecting a role that auto-populates required skills. They then mark each one as 'Essential' or 'Desirable'.",
        image: "https://i.imgur.com/8Qtm93t.png", // Mockup of job posting skill importance
        animationClass: "animate-[cursor-click-path-2_7s_ease-in-out_infinite]",
    },
    {
        title: "3. Get an Instant AI Match",
        description: "The platform's AI analyzes engineer skills against the job's requirements, instantly generating a ranked list of candidates with a precise match score.",
        image: "https://i.imgur.com/i9u5v01.png", // Mockup of AI match results
        animationClass: "animate-[cursor-click-path-3_5s_ease-in-out_infinite]",
    },
    {
        title: "4. Connect Directly. No Middlemen.",
        description: "The result is a fast, fair, and focused connection that saves everyone time and money. It's the modern way to hire freelance tech talent.",
        image: "https://i.imgur.com/4qL3x8s.png", // Mockup showing direct connection/message
        animationClass: "", // No animation on the final slide
    },
];

export const FeatureSlideshow = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const timerRef = useRef<number | null>(null);

    const SLIDE_DURATION = 8000;

    const goToSlide = (index: number) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActiveSlide(index);
        setTimeout(() => setIsAnimating(false), 500);
    };

    useEffect(() => {
        timerRef.current = window.setInterval(() => {
            goToSlide((activeSlide + 1) % SLIDES.length);
        }, SLIDE_DURATION);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [activeSlide, isAnimating]);

    return (
        <div className="w-full h-full flex flex-col items-center">
            <div className="relative w-full h-full bg-gray-100 border-4 border-gray-800 rounded-lg overflow-hidden shadow-inner">
                {SLIDES.map((slide, index) => (
                    <div
                        key={index}
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{ opacity: activeSlide === index ? 1 : 0, zIndex: activeSlide === index ? 10 : 0 }}
                    >
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }} />
                        {slide.animationClass && (
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
