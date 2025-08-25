import React from 'react';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { Page } from '../types/index.ts';

interface LegalPageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
    documentType: 'terms' | 'privacy';
}

const LegalContent = ({ documentType }: { documentType: 'terms' | 'privacy' }) => {
    const content = {
        terms: {
            title: "Terms of Service",
            lastUpdated: "July 26, 2024",
            sections: [
                { title: "1. Acceptance of Terms", text: "By accessing or using TechSubbies.com, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services." },
                { title: "2. Service Description", text: "TechSubbies.com is a platform that connects freelance technology professionals ('Engineers') with businesses ('Companies') seeking their services. We are not a party to any agreement or contract between Engineers and Companies." },
                { title: "3. User Accounts", text: "You must register for an account to access certain features. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete." },
                { title: "4. Code of Conduct", text: "Users are expected to communicate professionally and respectfully. We do not tolerate harassment, spam, or any illegal activities on the platform. Violation of this code of conduct may result in account suspension or termination." },
                { title: "5. Disclaimers", text: "The service is provided 'as is' without warranty of any kind. We do not guarantee the quality, suitability, or legality of the services provided by Engineers or the projects posted by Companies." },
            ]
        },
        privacy: {
            title: "Privacy Policy",
            lastUpdated: "July 26, 2024",
            sections: [
                { title: "1. Information We Collect", text: "We collect information you provide directly to us, such as when you create an account, create or modify your profile, post a job, or otherwise communicate with us. This information may include your name, email address, phone number, payment information, and other information you choose to provide." },
                { title: "2. How We Use Your Information", text: "We use the information we collect to provide, maintain, and improve our services, including to connect Engineers with Companies, process transactions, and send you technical notices, updates, security alerts, and support messages." },
                { title: "3. Information Sharing", text: "We may share your information with the other party in a transaction (e.g., we share an Engineer's profile with a Company they apply to). We do not sell your personal data to third-party marketers." },
                { title: "4. Data Security", text: "We implement reasonable measures to help protect your information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction." },
                { title: "5. Your Choices", text: "You may update, correct, or delete information about you at any time by logging into your online account. If you wish to delete your account, please contact us, but note that we may retain certain information as required by law or for legitimate business purposes." },
            ]
        }
    };

    const selectedDoc = content[documentType];

    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{selectedDoc.title}</h1>
                <p className="text-gray-500 mb-8">Last Updated: {selectedDoc.lastUpdated}</p>
                <div className="prose prose-lg max-w-none">
                    {selectedDoc.sections.map(section => (
                        <div key={section.title} className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-700">{section.title}</h2>
                            <p className="text-gray-600">{section.text} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const LegalPage = ({ onNavigate, onHowItWorksClick, documentType }: LegalPageProps) => {
    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
            <main className="flex-grow pt-24">
                <LegalContent documentType={documentType} />
            </main>
            <Footer onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
        </div>
    );
};