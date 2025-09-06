
import React, { useState } from 'react';
// FIX: Corrected module imports to remove file extensions.
import { EngineerProfile, Role } from '../types';
import { MessageCircle, Star, Trophy, Share2 } from '../components/Icons';
import { TopTrumpCard } from '../components/TopTrumpCard';
import { ReviewCard } from '../components/ReviewCard';
import { useAppContext } from '../context/AppContext';
import { BadgeDisplay } from '../components/BadgeDisplay';
import { ShareProfileModal } from '../components/ShareProfileModal';

interface EngineerProfileViewProps {
    profile: EngineerProfile | null;
    isEditable: boolean;
    onEdit: () => void;
}

export const EngineerProfileView = ({ profile, isEditable, onEdit }: EngineerProfileViewProps) => {
    const { user, startConversationAndNavigate, reviews, allUsers } = useAppContext();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    if (!profile) {
        return <div>Loading profile...</div>;
    }

    const canMessage = user && (user.role === Role.COMPANY || user.role === Role.RESOURCING_COMPANY);
    
    const handleNavigateToMessages = () => {
      // This is a placeholder; actual navigation is handled by the calling dashboard.
      console.log("Navigating to messages...");
    };

    const profileReviews = reviews
        .filter(r => r.engineerId === profile.id)
        .sort((a,b) => b.date.getTime() - a.date.getTime());

    const findCompanyById = (companyId: string) => {
        const companyUser = allUsers.find(u => u.profile.id === companyId && (u.role === Role.COMPANY || u.role === Role.RESOURCING_COMPANY));
        return companyUser?.profile;
    };
    
    const profileUrl = `https://techsubbies.com/engineer/${profile.id}`;

    return (
        <div className="relative font-sans max-w-4xl mx-auto py-4">
            {canMessage && (
                 <div className="absolute top-8 right-0 sm:right-4 z-20 flex items-center gap-2">
                     <button
                        onClick={() => setIsShareModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 shadow-lg border"
                        aria-label={`Share ${profile.name}'s profile`}
                    >
                        <Share2 size={16} className="mr-2" /> Share
                    </button>
                    <button
                        onClick={() => startConversationAndNavigate(profile.id, handleNavigateToMessages)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg"
                        aria-label={`Message ${profile.name}`}
                    >
                        <MessageCircle size={16} className="mr-2" /> Message
                    </button>
                </div>
            )}
           
            <TopTrumpCard profile={profile} isEditable={isEditable} onEdit={onEdit} />

            {profile.badges.length > 0 && (
                <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <Trophy size={22} className="mr-2 text-yellow-500" />
                        Achievements
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {profile.badges.map(badge => (
                            <BadgeDisplay key={badge.id} badge={badge} />
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <Star size={22} className="mr-2 text-yellow-500" />
                    Feedback & Reviews
                </h2>
                {profileReviews.length > 0 ? (
                    <div className="space-y-4">
                        {profileReviews.map(review => {
                            const company = findCompanyById(review.companyId);
                            return <ReviewCard key={review.id} review={review} company={company} />;
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">This engineer has not received any reviews yet.</p>
                )}
            </div>
            
             <ShareProfileModal 
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                profileUrl={profileUrl}
                profileName={profile.name}
            />
        </div>
    );
};