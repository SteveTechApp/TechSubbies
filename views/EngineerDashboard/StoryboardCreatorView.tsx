
import React, { useState, useCallback } from 'react';
import { EngineerProfile } from '../../types';
import { Save, Image, Upload, ArrowLeft } from '../../components/Icons';

interface StoryboardPanelData {
    id: number;
    image: string | null;
    description: string;
    notes1: string; // e.g., Action
    notes2: string; // e.g., Dialogue/Notes
}

const initialPanels: StoryboardPanelData[] = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    image: null,
    description: '',
    notes1: '',
    notes2: '',
}));

interface StoryboardPanelProps {
    panel: StoryboardPanelData;
    onUpdate: (id: number, data: Partial<StoryboardPanelData>) => void;
}

const StoryboardPanel = ({ panel, onUpdate }: StoryboardPanelProps) => {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdate(panel.id, { image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onUpdate(panel.id, { [name]: value });
    };

    return (
        <div className="bg-white border-2 border-gray-300 rounded-lg p-2 flex flex-col gap-2 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
            <div className="aspect-[16/10] bg-gray-100 rounded-md flex items-center justify-center relative overflow-hidden">
                {panel.image ? (
                    <img src={panel.image} alt={`Panel ${panel.id}`} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-center text-gray-400 p-2">
                        <Image size={40} className="mx-auto" />
                        <p className="text-xs mt-1">Add Image</p>
                    </div>
                )}
                <label htmlFor={`upload-${panel.id}`} className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload size={20} className="mr-2"/>
                    <span className="text-sm font-semibold">Upload</span>
                </label>
                <input type="file" id={`upload-${panel.id}`} accept="image/*" className="sr-only" onChange={handleImageChange} />
            </div>
            <textarea
                name="description"
                value={panel.description}
                onChange={handleTextChange}
                placeholder={`Scene ${panel.id} Description...`}
                rows={3}
                className="w-full border border-gray-200 p-1.5 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <div className="grid grid-cols-2 gap-2">
                <input
                    type="text"
                    name="notes1"
                    value={panel.notes1}
                    onChange={handleTextChange}
                    placeholder="Action/FX"
                    className="w-full border border-gray-200 p-1.5 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <input
                    type="text"
                    name="notes2"
                    value={panel.notes2}
                    onChange={handleTextChange}
                    placeholder="Dialogue/Notes"
                    className="w-full border border-gray-200 p-1.5 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
            </div>
        </div>
    );
};

export const StoryboardCreatorView = ({ profile, setActiveView }: { profile: EngineerProfile, setActiveView: (view: string) => void; }) => {
    const [panels, setPanels] = useState<StoryboardPanelData[]>(initialPanels);
    const [title, setTitle] = useState('My Visual Case Study');

    const handleUpdatePanel = useCallback((id: number, data: Partial<StoryboardPanelData>) => {
        setPanels(prevPanels =>
            prevPanels.map(p => (p.id === id ? { ...p, ...data } : p))
        );
    }, []);
    
    const handleSave = () => {
        console.log({ title, panels });
        alert(`Storyboard "${title}" saved! (Check console for data)`);
        setActiveView('Manage Profile');
    };

    return (
        <div>
             <button 
                onClick={() => setActiveView('Dashboard')} 
                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
            </button>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4 border-b pb-4">
                    <div>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-3xl font-bold bg-transparent border-b-2 border-transparent focus:border-gray-300 outline-none p-1 -m-1 w-full"
                        />
                        <p className="text-gray-500 mt-1">Create a visual story to showcase one of your projects.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                        <Save size={18} className="mr-2" />
                        Save & Close
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {panels.map(panel => (
                        <StoryboardPanel key={panel.id} panel={panel} onUpdate={handleUpdatePanel} />
                    ))}
                </div>
            </div>
        </div>
    );
};