import React from 'react';
import { EngineerProfile } from '../types/index.ts';
import { Edit } from '../components/Icons.tsx';
import { TopTrumpCard } from '../components/TopTrumpCard.tsx';

export const EngineerProfileView = ({ profile, isEditable, onEdit }: { profile: EngineerProfile | null, isEditable: boolean, onEdit: () => void }) => {

    if (!profile) return <div>Loading profile...</div>;

    return (
        <div className="relative font-sans max-w-4xl mx-auto py-4">
            {isEditable && (
                <button
                    onClick={onEdit}
                    className="absolute top-8 right-0 sm:right-4 z-20 flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 shadow-lg"
                    aria-label="Edit Profile"
                >
                    <Edit size={16} className="mr-2" /> Edit
                </button>
            )}
           
            <TopTrumpCard profile={profile} />

        </div>
    );
};