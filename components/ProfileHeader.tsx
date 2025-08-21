import React from 'react';
import { MapPin, Edit } from './Icons.tsx';

interface ProfileHeaderProps {
    name: string;
    tagline: string;
    location: string;
    avatar: string;
    isEditable: boolean;
    onEdit: () => void;
}

export const ProfileHeader = ({ name, tagline, location, avatar, isEditable, onEdit }: ProfileHeaderProps) => (
    <div className="md:flex items-center">
        <img src={avatar} alt={name} className="w-32 h-32 rounded-full mx-auto md:mx-0 md:mr-8 border-4 border-blue-500" />
        <div className="text-center md:text-left mt-4 md:mt-0">
            <h1 className="text-4xl font-bold">{name}</h1>
            <h2 className="text-xl text-blue-600 font-semibold">{tagline}</h2>
            <div className="flex items-center justify-center md:justify-start text-gray-500 mt-2">
                <MapPin size={16} className="mr-2" /> {location}
            </div>
        </div>
        {isEditable && (
            <button
                onClick={onEdit}
                className="absolute top-6 right-6 flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                <Edit size={16} className="mr-2" /> Edit Profile
            </button>
        )}
    </div>
);