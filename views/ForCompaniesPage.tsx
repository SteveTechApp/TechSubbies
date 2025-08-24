import React from 'react';
import { Footer } from '../components/Footer.tsx';
import { PageHeader } from '../components/PageHeader.tsx';
import { FeatureCard } from '../components/FeatureCard.tsx';
import { PenSquare, Search, Handshake } from '../components/Icons.tsx';

interface ForCompaniesPageProps {
    onNavigateHome: () => void;
    onLoginClick: () => void;
}

export const ForCompaniesPage = ({ onNavigateHome, onLoginClick }: ForCompaniesPageProps) => {
    return (
        <div className="bg-gray-50">
            <PageHeader onBack={onNavigateHome} />
            <main>
                {/* Hero Section */}
                <section 
                    className="relative text-white text-center min-h-[50vh] flex items-center justify-center px-4 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1520085601670-6a3fb8b5535a?q=80&w=2070&auto=format&fit=crop')" }}
                >
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">The Talent You Need. The Moment You Need It.</h1>
                        <p className="text-lg md:text-xl mx-auto mb-8">Stop searching, start building. Post jobs for free and instantly access our network of vetted AV & IT freelance engineers with confirmed availability.</p>
                        <button onClick={onLoginClick} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Find Talent for Free</button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center mb-12">Hiring, Without the Hassle</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <FeatureCard icon={PenSquare} title="Post Jobs for Free">
                                Describe your project and requirements in minutes. Our platform is completely free for companies to post jobs and find talent. No hidden costs.
                            </FeatureCard>
                            <FeatureCard icon={Search} title="Find Vetted Specialists">
                                Search our database of qualified engineers with advanced filters for specialist skills, day rate, and real-time availability.
                            </FeatureCard>
                            <FeatureCard icon={Handshake} title="Engage Directly. No Fees.">
                                Connect, negotiate, and contract directly with freelancers. We get out of the way, saving you from costly placement fees and delays.
                            </FeatureCard>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-20 bg-gray-800 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold mb-4">Ready to Build Your Team?</h2>
                        <p className="text-xl mb-8">Find the perfect tech subcontractor for your next project today.</p>
                        <button onClick={onLoginClick} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Post Your First Job</button>
                    </div>
                </section>
            </main>
            <Footer onLoginClick={onLoginClick} />
        </div>
    );
};