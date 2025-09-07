import React, { useState } from 'react';
import { X, Copy, CheckCircle, Linkedin, XIcon, Mail } from './Icons';

interface ShareProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profileUrl: string;
    profileName: string;
}

export const ShareProfileModal = ({ isOpen, onClose, profileUrl, profileName }: ShareProfileModalProps) => {
    const [copyText, setCopyText] = useState('Copy');

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(profileUrl).then(() => {
            setCopyText('Copied!');
            setTimeout(() => setCopyText('Copy'), 2000);
        });
    };

    const shareText = encodeURIComponent(`Check out this profile for ${profileName} on TechSubbies.com, the network for freelance AV & IT talent!`);
    const encodedUrl = encodeURIComponent(profileUrl);

    const socialLinks = [
        { name: 'LinkedIn', icon: Linkedin, url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=Tech%20Engineer%20Profile&summary=${shareText}` },
        { name: 'X', icon: XIcon, url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}` },
        { name: 'Email', icon: Mail, url: `mailto:?subject=TechSubbies.com%20Engineer%20Profile:%20${encodeURIComponent(profileName)}&body=${shareText}%0A%0A${encodedUrl}` }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg m-4 max-w-md w-full relative transform transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                    <h2 className="text-xl font-bold">Share Profile</h2>
                    <p className="text-sm text-gray-500">Share {profileName}'s profile via link or social media.</p>
                </header>
                <main className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Link</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={profileUrl}
                                readOnly
                                className="w-full border p-2 rounded bg-gray-100 text-gray-700"
                                onFocus={(e) => e.target.select()}
                            />
                            <button
                                onClick={handleCopy}
                                className={`flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium w-28 transition-colors ${
                                    copyText === 'Copied!' 
                                    ? 'bg-green-600 text-white border-green-600' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {copyText === 'Copied!' ? <CheckCircle size={16} className="mr-2"/> : <Copy size={16} className="mr-2"/>}
                                {copyText}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Or share directly on</label>
                        <div className="flex justify-center gap-4">
                            {socialLinks.map(link => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                    aria-label={`Share on ${link.name}`}
                                >
                                    <link.icon size={24} className="text-gray-700" />
                                </a>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};