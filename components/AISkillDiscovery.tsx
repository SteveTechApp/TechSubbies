import React, { useState } from 'react';
import { BrainCircuit, Loader, PlusCircle, Check, RefreshCw } from 'lucide-react';
import { generateSkillsForRole } from '../services/geminiService';
import { SkillDiscoveryResult } from '../types';

export const AISkillDiscovery: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SkillDiscoveryResult | null>(null);
    const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

    const handleGenerate = async () => {
        if (!query.trim()) {
            setError('Please enter a job category.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAddedItems(new Set());

        try {
            const response = await generateSkillsForRole(query);
            if (response) {
                setResult(response);
            } else {
                setError('Failed to get a valid response from the AI. Please try again.');
                setResult(null);
            }
        } catch (e) {
            setError('An unexpected error occurred.');
            setResult(null);
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddItem = (item: string) => {
        setAddedItems(prev => new Set(prev).add(item));
    };

    const handleAddAllTitles = () => {
        if (!result) return;
        const newAddedItems = new Set(addedItems);
        result.suggestedJobTitles.forEach(title => newAddedItems.add(title));
        setAddedItems(newAddedItems);
    };

    const handleAddAllSkills = () => {
        if (!result) return;
        const newAddedItems = new Set(addedItems);
        result.nicheSkills.forEach(skill => newAddedItems.add(skill.name));
        setAddedItems(newAddedItems);
    };

    const allTitlesAdded = result && result.suggestedJobTitles.every(title => addedItems.has(title));
    const allSkillsAdded = result && result.nicheSkills.every(skill => addedItems.has(skill.name));


    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <BrainCircuit className="mr-3 text-blue-600" />
                    AI-Powered Skill Discovery
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Enter a broad job category to discover related niche roles and skills to add to the platform.
                </p>
            </div>
            <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., Live Events Technician, Broadcast Engineer..."
                        className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="animate-spin mr-2" size={20} />
                                Generating...
                            </>
                        ) : result ? (
                            <>
                                <RefreshCw className="mr-2" size={20} />
                                Refresh
                            </>
                        ) : (
                             'Generate'
                        )}
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {result && (
                <div className="p-6 border-t grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Suggested Job Titles */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Suggested Job Titles</h3>
                             <button
                                onClick={handleAddAllTitles}
                                disabled={allTitlesAdded}
                                className="flex items-center text-sm font-semibold py-1 px-3 rounded-md transition-colors disabled:bg-green-500 disabled:text-white bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                {allTitlesAdded ? <Check size={16} className="mr-1" /> : <PlusCircle size={16} className="mr-1" />}
                                {allTitlesAdded ? 'All Added' : 'Add All'}
                            </button>
                        </div>
                        <ul className="space-y-3">
                            {result.suggestedJobTitles.map((title) => (
                                <li key={title} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
                                    <span className="font-medium text-gray-700">{title}</span>
                                    <button
                                        onClick={() => handleAddItem(title)}
                                        disabled={addedItems.has(title)}
                                        className="flex items-center text-sm font-semibold py-1 px-3 rounded-md transition-colors disabled:bg-green-500 disabled:text-white bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    >
                                        {addedItems.has(title) ? <Check size={16} className="mr-1" /> : <PlusCircle size={16} className="mr-1" />}
                                        {addedItems.has(title) ? 'Added' : 'Add'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Niche Skills */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Niche Skills</h3>
                            <button
                                onClick={handleAddAllSkills}
                                disabled={allSkillsAdded}
                                className="flex items-center text-sm font-semibold py-1 px-3 rounded-md transition-colors disabled:bg-green-500 disabled:text-white bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                {allSkillsAdded ? <Check size={16} className="mr-1" /> : <PlusCircle size={16} className="mr-1" />}
                                {allSkillsAdded ? 'All Added' : 'Add All'}
                            </button>
                        </div>
                        <div className="space-y-3">
                            {result.nicheSkills.map((skill) => (
                                <div key={skill.name} className="bg-gray-50 p-3 rounded-md border">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-gray-700">{skill.name}</h4>
                                        <button
                                           onClick={() => handleAddItem(skill.name)}
                                           disabled={addedItems.has(skill.name)}
                                           className="flex items-center text-sm font-semibold py-1 px-3 rounded-md transition-colors disabled:bg-green-500 disabled:text-white bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        >
                                           {addedItems.has(skill.name) ? <Check size={16} className="mr-1" /> : <PlusCircle size={16} className="mr-1" />}
                                           {addedItems.has(skill.name) ? 'Added' : 'Add'}
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};