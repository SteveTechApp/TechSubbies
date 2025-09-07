import React from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Page } from '../types';

interface LegalPageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
    documentType: 'terms' | 'privacy' | 'security';
}

const LegalContent = ({ documentType }: { documentType: 'terms' | 'privacy' | 'security' }) => {
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
        },
        security: {
            title: "Data Security & GDPR Compliance",
            lastUpdated: "July 27, 2024",
            sections: [
                { title: "1. Our Commitment to Data Security", text: "At TechSubbies.com, the security of your personal and professional data is a top priority. We are committed to implementing and maintaining robust security measures to protect your information from unauthorized access, alteration, disclosure, or destruction." },
                { 
                    title: "2. How We Protect Your Data", 
                    text: "We employ a multi-layered security approach to safeguard your data:",
                    list: [
                        "Encryption in Transit: All data transferred between your browser and our servers is encrypted using industry-standard Transport Layer Security (TLS/SSL).",
                        "Encryption at Rest: Sensitive personal data and documents stored in our databases and file systems are encrypted at rest, ensuring they are protected even in the event of a physical security breach.",
                        "Access Control: We enforce strict access control policies internally. Our employees can only access user data on a need-to-know basis to perform their job functions (e.g., customer support).",
                        "Regular Audits: Our systems undergo regular security audits and penetration testing to identify and remediate potential vulnerabilities.",
                    ]
                },
                { 
                    title: "3. GDPR Compliance", 
                    text: "As a platform operating within the UK and EU, we are fully committed to complying with the General Data Protection Regulation (GDPR). We adhere to its core principles:",
                    list: [
                        "Lawfulness, Fairness, and Transparency: We process your data lawfully and transparently, and we clearly inform you of how we use it.",
                        "Purpose Limitation: We only collect and process data for the specific purposes of operating the TechSubbies.com platform.",
                        "Data Minimization: We only collect the data that is necessary to provide our services.",
                        "Integrity and Confidentiality: We ensure the confidentiality and integrity of your data through our security measures."
                    ]
                },
                { 
                    title: "4. Your Rights Under GDPR", 
                    text: "You have several rights regarding your personal data:",
                    list: [
                        "The Right of Access: You can request a copy of the personal data we hold about you.",
                        "The Right to Rectification: You can update and correct your personal data at any time through your profile settings.",
                        "The Right to Erasure (Right to be Forgotten): You can request the deletion of your account and associated personal data.",
                        "The Right to Data Portability: You can request a copy of your data in a machine-readable format.",
                    ]
                },
                { title: "5. Data Processing and Storage", text: "Your data is processed and stored in secure, certified data centers. We only use reputable third-party subprocessors (e.g., for payment processing) who are also compliant with GDPR and maintain high security standards." },
                { title: "6. Contact Us", text: "If you have any questions about our security practices or wish to exercise your GDPR rights, please contact our Data Protection Officer at dpo@techsubbies.com." },
            ]
        }
    };

    const selectedDoc = content[documentType];

    return (
        <div className="bg-white py-3">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-xl font-extrabold text-gray-800 mb-1">{selectedDoc.title}</h1>
                <p className="text-gray-500 mb-3 text-sm">Last Updated: {selectedDoc.lastUpdated}</p>
                <div className="prose max-w-none">
                    {selectedDoc.sections.map(section => (
                        <div key={section.title} className="mb-3">
                            <h2 className="text-base font-bold text-gray-700">{section.title}</h2>
                            <p className="text-gray-600">{section.text}</p>
                             {section.list && (
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    {section.list.map((item, index) => (
                                        <li key={index} className="text-gray-600">{item}</li>
                                    ))}
                                </ul>
                            )}
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
            <main className="flex-grow pt-14">
                <LegalContent documentType={documentType} />
            </main>
            <Footer onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
        </div>
    );
};