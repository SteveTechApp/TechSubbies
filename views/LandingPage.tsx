import React from 'react';
import { Briefcase, UserCheck, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Role } from '../types';

export const LandingPage: React.FC = () => {
    const { setRole } = useAppContext();

    return (
        // Adjusted background to match new theme
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-center bg-gray-100">
            <div className="container mx-auto px-6 py-16">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                    Connecting Tech Talent with Opportunity.
                </h1>
                <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
                    TechSubbies.com provides instant access to skilled, certified engineers with real-time availability, streamlining the hiring process for short-term projects.
                </p>
                <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
                    {/* Card for Companies */}
                    <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-1/3 transform hover:scale-105 transition-transform duration-300 border border-gray-200 flex flex-col">
                        <Briefcase className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">For Companies</h2>
                        <p className="text-gray-600 mb-6 flex-grow">
                            Find the right expertise, right now. Search, match, and hire verified freelance engineers for your next project.
                        </p>
                        <button
                            onClick={() => setRole(Role.COMPANY)}
                            // Primary button style
                            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-sm"
                        >
                            Find an Engineer
                        </button>
                    </div>
                    {/* Card for Engineers */}
                    <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-1/3 transform hover:scale-105 transition-transform duration-300 border border-gray-200 flex flex-col">
                        <UserCheck className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">For Engineers</h2>
                        <p className="text-gray-600 mb-6 flex-grow">
                            Showcase your skills, set your availability, and get matched with projects that fit your expertise and schedule.
                        </p>
                        <button
                            onClick={() => setRole(Role.ENGINEER)}
                            // Secondary button style
                            className="w-full bg-white text-blue-600 border border-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-300 shadow-sm"
                        >
                            Manage Your Profile
                        </button>
                    </div>
                     {/* Card for Investors */}
                    <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-1/3 transform hover:scale-105 transition-transform duration-300 border border-gray-200 flex flex-col">
                        <TrendingUp className="w-16 h-16 mx-auto mb-4 text-green-600" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">For Investors</h2>
                        <p className="text-gray-600 mb-6 flex-grow">
                            Join us in revolutionizing the freelance tech industry. Download our guide to learn about our growth and investment opportunities.
                        </p>
                        <a
                            href="/investors_guide.txt"
                            download="TechSubbies_Investor_Guide.txt"
                            className="w-full block text-center bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-sm"
                        >
                            Download Investor Guide
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
