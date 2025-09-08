
import React from 'react';
import { Page } from '../types';

interface LegalPageProps {
  page: 'terms' | 'privacy' | 'security';
  onNavigate: (page: Page) => void;
}

const LEGAL_CONTENT = {
    terms: {
        title: "Terms of Service",
        content: `
            <p>Welcome to TechSubbies.com. By accessing or using our service, you agree to be bound by these terms. If you disagree with any part of the terms, then you may not access the service.</p>
            <h3 class="font-bold mt-4">1. Accounts</h3>
            <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
            <h3 class="font-bold mt-4">2. Platform Role</h3>
            <p>TechSubbies.com acts as a neutral venue for Companies to connect with freelance Engineers. We are not a recruitment agency and are not a party to any agreement formed between users of the platform. All contractual agreements are directly between the Company and the Engineer.</p>
            <h3 class="font-bold mt-4">3. Limitation of Liability</h3>
            <p>In no event shall TechSubbies.com, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
        `
    },
    privacy: {
        title: "Privacy Policy",
        content: `
            <p>This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
            <h3 class="font-bold mt-4">1. Information Collection and Use</h3>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you. This may include, but is not limited to, your name, email address, phone number, and professional qualifications.</p>
            <h3 class="font-bold mt-4">2. Data Use</h3>
            <p>TechSubbies.com uses the collected data to provide and maintain the Service, to notify you about changes to our Service, to allow you to participate in interactive features of our Service when you choose to do so, and to provide customer care and support.</p>
        `
    },
    security: {
        title: "Data Security",
        content: `
            <p>The security of your data is important to us. We strive to use commercially acceptable means to protect your Personal Data, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.</p>
            <h3 class="font-bold mt-4">1. Encryption</h3>
            <p>All data transmitted between your browser and our servers is encrypted using industry-standard TLS (Transport Layer Security). All data at rest, including database backups, is encrypted using AES-256.</p>
            <h3 class="font-bold mt-4">2. Access Control</h3>
            <p>We follow the principle of least privilege. Our employees and contractors only have access to the data they need to perform their jobs. Access is logged and regularly audited.</p>
        `
    }
};

export const LegalPage = ({ page, onNavigate }: LegalPageProps) => {
    const { title, content } = LEGAL_CONTENT[page];

    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-6">{title}</h1>
                <div 
                    className="prose lg:prose-lg"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
};
