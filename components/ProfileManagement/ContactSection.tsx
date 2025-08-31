import React from 'react';
import { Contact } from '../../types/index.ts';
import { SectionWrapper } from './SectionWrapper.tsx';

interface ContactSectionProps {
    contactData: Contact;
    onContactChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContactSection = ({ contactData, onContactChange }: ContactSectionProps) => (
    <SectionWrapper title="Contact Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block font-medium mb-1">Email Address</label>
                <input type="email" name="email" value={contactData.email || ''} onChange={onContactChange} className="w-full border p-2 rounded" />
            </div>
            <div>
                <label className="block font-medium mb-1">Mobile Phone</label>
                <input type="tel" name="phone" value={contactData.phone || ''} onChange={onContactChange} className="w-full border p-2 rounded" />
            </div>
            <div>
                <label className="block font-medium mb-1">Website</label>
                <input type="url" name="website" value={contactData.website || ''} onChange={onContactChange} className="w-full border p-2 rounded" />
            </div>
            <div>
                <label className="block font-medium mb-1">LinkedIn Profile</label>
                <input type="url" name="linkedin" value={contactData.linkedin || ''} onChange={onContactChange} className="w-full border p-2 rounded" />
            </div>
        </div>
    </SectionWrapper>
);
