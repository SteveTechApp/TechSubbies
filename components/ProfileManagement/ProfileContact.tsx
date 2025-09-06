import React from 'react';
import { EngineerProfile } from '../../types/index.ts';

interface ProfileContactProps {
    formData: EngineerProfile;
    setFormData: React.Dispatch<React.SetStateAction<EngineerProfile>>;
}

export const ProfileContact = ({ formData, setFormData }: ProfileContactProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            contact: {
                ...prev.contact,
                [name]: value
            }
        }));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium mb-1 text-sm">Email Address</label>
                    <input type="email" name="email" value={formData.contact.email || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="block font-medium mb-1 text-sm">Phone Number</label>
                    <input type="tel" name="phone" value={formData.contact.phone || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium mb-1 text-sm">Website URL</label>
                    <input type="url" name="website" value={formData.contact.website || ''} onChange={handleChange} placeholder="https://your-portfolio.com" className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="block font-medium mb-1 text-sm">LinkedIn Profile URL</label>
                    <input type="url" name="linkedin" value={formData.contact.linkedin || ''} placeholder="https://linkedin.com/in/your-profile" className="w-full border p-2 rounded" />
                </div>
            </div>
        </div>
    );
};