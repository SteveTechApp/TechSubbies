import React from 'react';
import { EngineerProfile } from '../../types/index.ts';
import { Plus, Trash2 } from '../Icons.tsx';

interface ProfileSocialsProps {
    formData: EngineerProfile;
    setFormData: React.Dispatch<React.SetStateAction<EngineerProfile>>;
}

export const ProfileSocials = ({ formData, setFormData }: ProfileSocialsProps) => {
    
    const addSocialLink = () => {
        const newLink = { name: '', url: '' };
        setFormData(prev => ({ ...prev, socials: [...(prev.socials || []), newLink] }));
    };
    
    const removeSocialLink = (index: number) => {
        setFormData(prev => ({ ...prev, socials: prev.socials?.filter((_, i) => i !== index) }));
    };

    const handleSocialChange = (index: number, field: 'name' | 'url', value: string) => {
        setFormData(prev => ({
            ...prev,
            socials: (prev.socials || []).map((link, i) => i === index ? { ...link, [field]: value } : link)
        }));
    };

    return (
        <div className="space-y-4">
            {(formData.socials || []).map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                    <input 
                        type="text" 
                        placeholder="Link Name (e.g., GitHub)" 
                        value={link.name} 
                        onChange={e => handleSocialChange(index, 'name', e.target.value)} 
                        className="w-1/3 border p-2 rounded" 
                    />
                    <input 
                        type="text" 
                        placeholder="https://github.com/your-profile" 
                        value={link.url} 
                        onChange={e => handleSocialChange(index, 'url', e.target.value)} 
                        className="w-2/3 border p-2 rounded" 
                    />
                    <button type="button" onClick={() => removeSocialLink(index)} className="text-red-500 hover:text-red-700 p-2">
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
            <button 
                type="button" 
                onClick={addSocialLink} 
                className="flex items-center text-blue-600 font-semibold hover:text-blue-800 pt-3 mt-3 border-t w-full"
            >
                <Plus size={18} className="mr-1" /> Add Social Link
            </button>
        </div>
    );
};