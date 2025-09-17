import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { MOCK_ENGINEER_STEVE } from '../data/modules/mockStaticProfiles';
import { STEVE_GOODWIN_CV_TEXT, JOHN_SMITH_CV_TEXT } from '../data/mockCVs';
import { BrainCircuit, Loader } from './Icons';

interface CVSearchProps {
    cvFileUrl: string;
}

// In a real app, you'd fetch the CV content from the URL.
// For this demo, we'll map the mock URL to the mock text content.
const getMockCVContent = (url: string) => {
    if (url.includes('steve-goodwin')) {
        return STEVE_GOODWIN_CV_TEXT;
    }
    if (url.includes('john-smith')) {
        return JOHN_SMITH_CV_TEXT;
    }
    return 'Error: CV content not found for this demo user.';
};


export const CVSearch = ({ cvFileUrl }: CVSearchProps) => {
    const { geminiService } = useAppContext();
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setResult('');
        setError('');

        const cvContent = getMockCVContent(cvFileUrl);
        const response = await geminiService.queryCV(cvContent, query);

        if (response.error) {
            setError(response.error);
        } else {
            setResult(response.answer || 'No answer was returned.');
        }

        setIsLoading(false);
    };

    return (
        <div className="mt-4 p-4 border-2 border-dashed border-purple-300 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-bold text-purple-800 flex items-center mb-2">
                <BrainCircuit size={20} className="mr-2" />
                AI-Powered CV Search
            </h3>
            <p className="text-sm text-purple-700 mb-3">Ask a question about this engineer's experience based on their CV.</p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., 'Summarize their Crestron experience'"
                    className="w-full border-gray-300 rounded-md shadow-sm p-2"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
                >
                    {isLoading ? <Loader className="animate-spin w-5 h-5" /> : 'Ask AI'}
                </button>
            </form>

            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

            {result && (
                <div className="mt-3 p-3 bg-white rounded-md border border-purple-200 animate-fade-in-up">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{result}</p>
                </div>
            )}
        </div>
    );
};