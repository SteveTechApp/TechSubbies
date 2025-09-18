import React from 'react';
import { CaseStudy, StoryboardPanelData } from '../types';
import { X, Image } from './Icons';

interface StoryboardViewerProps {
    isOpen: boolean;
    onClose: () => void;
    storyboard: CaseStudy;
}

const Panel = ({ panel }: { panel: StoryboardPanelData }) => (
    <div className="bg-gray-100 border rounded-lg overflow-hidden shadow-sm">
        <div className="aspect-[16/10] bg-gray-200 flex items-center justify-center">
            {panel.image ? (
                <img src={panel.image} alt={`Panel ${panel.id}`} className="w-full h-full object-cover" />
            ) : (
                <Image size={48} className="text-gray-400" />
            )}
        </div>
        <div className="p-3 text-sm">
            <p className="text-gray-800">{panel.description}</p>
            <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                <p><strong>Action:</strong> {panel.notes1}</p>
                <p><strong>Notes:</strong> {panel.notes2}</p>
            </div>
        </div>
    </div>
);

export const StoryboardViewer = ({ isOpen, onClose, storyboard }: StoryboardViewerProps) => {
    if (!isOpen || !storyboard.panels) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col relative animate-fade-in-up"
                style={{ animationDuration: '0.3s' }}
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-4 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{storyboard.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close modal">
                        <X size={24} />
                    </button>
                </header>
                <main className="flex-grow overflow-y-auto custom-scrollbar p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {storyboard.panels.map(panel => (
                            <Panel key={panel.id} panel={panel} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};
