
import React from 'react';
import { EngineerProfile } from '../../types';

interface ProfileSocialsProps {
    formData: EngineerProfile;
    setFormData: React.Dispatch<React.SetStateAction<EngineerProfile>>;
}

export const ProfileSocials = ({ formData, setFormData }: ProfileSocialsProps) => {
    
    // This is a placeholder as social links are not on the main EngineerProfile type
    // In a real implementation, you would extend the type
    const [socials, setSocials] = React.useState({
        twitter: '',
        github: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSocials(prev => ({...prev, [name]: value}));
        // Here you would update the main form data
        // setFormData(prev => ({...prev, socials: {...prev.socials, [name]: value}}))
    };


    return (
        <div className="space-y-4">
             <div>
                <label className="block font-medium mb-1 text-sm">X (Twitter) Profile URL</label>
                <input type="url" name="twitter" value={socials.twitter} onChange={handleChange} placeholder="https://x.com/your-handle" className="w-full border p-2 rounded" />
            </div>
             <div>
                <label className="block font-medium mb-1 text-sm">GitHub Profile URL</label>
                <input type="url" name="github" value={socials.github} onChange={handleChange} placeholder="https://github.com/your-username" className="w-full border p-2 rounded" />
            </div>
            <p className="text-xs text-gray-500">Adding social links can help companies get a better sense of your professional presence.</p>
        </div>
    );
};
