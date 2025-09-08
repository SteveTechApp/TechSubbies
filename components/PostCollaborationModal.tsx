import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CollaborationPost, Currency } from '../types';
import { X, Save } from './Icons';

interface PostCollaborationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const initialData = {
    title: '',
    description: '',
    location: '',
    rate: '300',
    currency: Currency.GBP,
    duration: '2 weeks',
    startDate: new Date().toISOString().split('T')[0],
};

export const PostCollaborationModal = ({ isOpen, onClose }: PostCollaborationModalProps) => {
    const { postCollaboration } = useAppContext();
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        // Simple validation
        if (!formData.title || !formData.description || !formData.location) {
            alert("Please fill in all required fields.");
            return;
        }
        postCollaboration({ ...formData, startDate: new Date(formData.startDate) });
        onClose();
        setFormData(initialData); // Reset form
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><X /></button>
                <h2 className="text-2xl font-bold mb-4">Post a Collaboration Opportunity</h2>
                <div className="space-y-4">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" className="w-full border p-2 rounded" />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Project description, required skills, etc." rows={4} className="w-full border p-2 rounded" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location (e.g., London / Remote)" className="w-full border p-2 rounded" />
                        <input type="number" name="rate" value={formData.rate} onChange={handleChange} placeholder="Day Rate" className="w-full border p-2 rounded" />
                        <input name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (e.g., 2 weeks)" className="w-full border p-2 rounded" />
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                </div>
                <div className="flex justify-end mt-6 pt-4 border-t">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSubmit} className="flex items-center px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 ml-3">
                        <Save size={18} className="mr-2" /> Post Opportunity
                    </button>
                </div>
            </div>
        </div>
    );
};