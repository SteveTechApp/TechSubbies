import React, { useState } from 'react';

interface ClientBriefBarProps {
    onSearch: (brief: string) => void;
    isLoading: boolean;
}

export const ClientBriefBar = ({ onSearch, isLoading }: ClientBriefBarProps) => {
    const [brief, setBrief] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (brief.trim()) {
            onSearch(brief);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <label htmlFor="client-brief" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Client Brief
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
                <textarea
                    id="client-brief"
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="e.g., 'Need a 4-input multiviewer for a control room with 4K output' or 'Simple 1-to-4 HDMI splitter for a retail store'"
                    rows={2}
                    className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="submit"
                    disabled={isLoading || !brief.trim()}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                    {isLoading ? 'Finding...' : 'Find Matches'}
                </button>
            </div>
        </form>
    );
};