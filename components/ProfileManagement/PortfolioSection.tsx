import React from 'react';
import { EngineerProfile, ProfileTier } from '../../types/index.ts';
import { Plus, Trash2 } from '../Icons.tsx';

const generateUniqueId = () => `id-${Math.random().toString(36).substring(2, 10)}`;

const UpgradeCta = ({ requiredTier, onUpgradeClick }: { requiredTier: string, onUpgradeClick: () => void }) => (
    <div className="text-center p-8 bg-gray-100 rounded-lg border-2 border-dashed">
        <h3 className="text-xl font-bold text-gray-800">This is a Premium Feature</h3>
        <p className="text-gray-600 mt-2">Upgrade to a "{requiredTier}" profile to unlock this feature.</p>
        <button type="button" onClick={onUpgradeClick} className="mt-4 bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700">Upgrade Now</button>
    </div>
);

interface PortfolioSectionProps {
    profile: EngineerProfile;
    formData: Partial<EngineerProfile>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<EngineerProfile>>>;
    setActiveView: (view: string) => void;
}

export const PortfolioSection = ({ profile, formData, setFormData, setActiveView }: PortfolioSectionProps) => {

    const caseStudies = formData.caseStudies || [];
    const canUseStoryboards = profile.profileTier === ProfileTier.SKILLS || profile.profileTier === ProfileTier.BUSINESS;

    const addCaseStudy = () => {
        setFormData(prev => ({...prev, caseStudies: [...(prev.caseStudies || []), { id: generateUniqueId(), name: 'Project Name', url: 'https://' }]}));
    };
    
    const removeCaseStudy = (id: string) => {
        setFormData(prev => ({ ...prev, caseStudies: prev.caseStudies?.filter(cs => cs.id !== id) }));
    };

    const handleCaseStudyChange = (id: string, field: 'name' | 'url', value: string) => {
        setFormData(prev => ({ ...prev, caseStudies: prev.caseStudies?.map(cs => cs.id === id ? { ...cs, [field]: value } : cs) }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold mb-3">Case Studies / Portfolio</h3>
                <div className="space-y-4">
                    {caseStudies.map(cs => (
                        <div key={cs.id} className="flex items-center gap-2">
                            <input type="text" placeholder="Project Name" value={cs.name} onChange={e => handleCaseStudyChange(cs.id, 'name', e.target.value)} className="w-1/3 border p-2 rounded" />
                            <input type="text" placeholder="https://example.com/project" value={cs.url} onChange={e => handleCaseStudyChange(cs.id, 'url', e.target.value)} className="w-2/3 border p-2 rounded" />
                            <button type="button" onClick={() => removeCaseStudy(cs.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                        </div>
                    ))}
                    <button type="button" onClick={addCaseStudy} className="flex items-center text-blue-600 font-semibold hover:text-blue-800 pt-2">
                        <Plus size={18} className="mr-1" /> Add Case Study
                    </button>
                </div>
            </div>
            
            <div>
                <h3 className="text-xl font-bold mb-3">Visual Case Studies (Storyboards)</h3>
                 {!canUseStoryboards ? <UpgradeCta requiredTier="Skills" onUpgradeClick={() => setActiveView('Billing')} /> : (
                    <div>
                        <p className="text-gray-600 mb-4">Create engaging, step-by-step visual stories of your projects to impress potential clients.</p>
                        <div className="space-y-3 mb-4">
                            {/* This would be a map of actual storyboards */}
                            <div className="p-3 border rounded-md flex justify-between items-center bg-gray-50">
                                <div>
                                    <p className="font-semibold">Corporate HQ AV Integration</p>
                                    <p className="text-xs text-gray-500">Last updated: 3 days ago</p>
                                </div>
                                <div>
                                    <button type="button" onClick={() => setActiveView('Create Storyboard')} className="text-blue-600 hover:underline text-sm font-semibold p-2">View/Edit</button>
                                    <button type="button" onClick={() => alert("Delete functionality not implemented.")} className="text-red-600 hover:underline text-sm font-semibold p-2">Delete</button>
                                </div>
                            </div>
                        </div>
                        <button type="button" onClick={() => setActiveView('Create Storyboard')} className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                            <Plus size={18} className="mr-2" /> Create New Storyboard
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};