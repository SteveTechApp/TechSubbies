import React from 'react';
import { Page } from '../types';
import { prospectusContent } from '../data/prospectusContent';

interface InvestorRelationsPageProps {
  onNavigate: (page: Page) => void;
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="py-12">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 border-b-2 border-blue-200 pb-2">{title}</h2>
            <div className="prose lg:prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: children as string }} />
        </div>
    </section>
);

export const InvestorRelationsPage = ({ onNavigate }: InvestorRelationsPageProps) => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-800 text-white text-center py-20">
        <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold">Investor Relations</h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
                Join us in revolutionizing the freelance technical industry. Explore our vision, market strategy, and the opportunity to invest in a high-growth SaaS platform.
            </p>
        </div>
      </section>

      <main>
        <Section title="Executive Summary">
          {prospectusContent.executiveSummary}
        </Section>
        <Section title="Market Opportunity">
          {prospectusContent.marketOpportunity}
        </Section>
        <Section title="Our Competitive Advantage">
          {prospectusContent.competitiveAdvantage}
        </Section>
        <Section title="Use of Funds - Seed Round (£500,000)">
          {prospectusContent.useOfFunds}
        </Section>
      </main>

       {/* Contact CTA */}
        <section className="bg-blue-600 py-20 text-white">
            <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold">Request Our Full Prospectus</h2>
            <p className="mt-4 text-blue-200 max-w-xl mx-auto">
                For detailed financial projections, market analysis, and information about our seed funding round, please get in touch.
            </p>
            <a href="mailto:investors@techsubbies.com" className="mt-6 inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105">
                Contact Investor Relations
            </a>
            </div>
        </section>
    </div>
  );
};
