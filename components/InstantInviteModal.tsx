import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Job, EngineerProfile, ProfileTier } from '../types';
import { X, Sparkles, Loader, Send, CheckCircle, User } from './Icons';

interface EngineerInviteCardProps {
    engineer: EngineerProfile;
    onInvite: (engineerId: string) => void;
    isInvited: boolean;
}

const EngineerInviteCard = ({ engineer, onInvite, isInvited }: EngineerInviteCardProps) => (
    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border">
        <img src={engineer.avatar} alt={engineer.name} className="w-14 h-14 rounded-full" />
        <div className="flex-grow">
            <h4 className="font-bold text-gray-800">{engineer.name}</h4>
            <p className="text-sm text-blue-600">{engineer.discipline}</p>
        </div>
        <div className="text-center">
            <div className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center">
                <Sparkles size={12} className="mr-1.5" />
                {Math.round(engineer.matchScore || 0)}% Match
            </div>
        </div>
        <button
            onClick={() => onInvite(engineer.id)}
            disabled={isInvited}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed w-40 transition-colors"
        >
            {isInvited ? <CheckCircle size={16} className="mr-2" /> : <Send size={16} className="mr-2" />}
            {isInvited ? 'Invited' : 'Invite to Apply'}
        </button>
    </div>
);

interface InstantInviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job | null;
}

export const InstantInviteModal = ({ isOpen, onClose, job }: InstantInviteModalProps) => {
    const { engineers, geminiService, inviteEngineerToJob } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [matchedEngineers, setMatchedEngineers] = useState<EngineerProfile[]>([]);
    const [invitedIds, setInvitedIds] = useState<string[]>([]);

    useEffect(() => {
        const runAiMatch = async () => {
            if (!job) return;

            setIsLoading(true);
            setMatchedEngineers([]);
            setInvitedIds([]);
            
            const availablePremiumEngineers = engineers.filter(
                e => e.status === 'active' && 
                     e.profileTier !== ProfileTier.BASIC && 
                     new Date(e.availability) <= new Date()
            );

            if (availablePremiumEngineers.length === 0) {
                setIsLoading(false);
                return;
            }

            const result = await geminiService.findBestMatchesForJob(job, availablePremiumEngineers);
            
            if (result && result.matches) {
                const topMatches = result.matches
                    .slice(0, 5) // Take top 5
                    .map(match => {
                        const engineer = engineers.find(e => e.id === match.id);
                        return engineer ? { ...engineer, matchScore: match.match_score } : null;
                    })
                    .filter((e): e is EngineerProfile => e !== null);
                setMatchedEngineers(topMatches);
            }
            setIsLoading(false);
        };
        
        if (isOpen && job) {
            runAiMatch();
        }

    }, [isOpen, job, engineers, geminiService]);

    if (!isOpen) return null;

    const handleInvite = (engineerId: string) => {
        if (job) {
            inviteEngineerToJob(job.id, engineerId);
            setInvitedIds(prev => [...prev, engineerId]);
        }
    };
    
    const renderContent = () => {
        if(isLoading) {
            return (
                <div className="flex flex-col items-center justify-center text-center h-64">
                    <Loader className="animate-spin w-10 h-10 text-blue-600 mb-4" />
                    <p className="font-semibold text-gray-700">Finding top talent for you...</p>
                    <p className="text-sm text-gray-500">Our AI is analyzing the best-fit engineers.</p>
                </div>
            )
        }
        if(matchedEngineers.length > 0) {
            return (
                 <div className="space-y-3">
                    {matchedEngineers.map(eng => (
                        <EngineerInviteCard 
                            key={eng.id}
                            engineer={eng}
                            onInvite={handleInvite}
                            isInvited={invitedIds.includes(eng.id)}
                        />
                    ))}
                </div>
            )
        }
        return (
             <div className="flex flex-col items-center justify-center text-center h-64">
                <User size={40} className="text-gray-400 mb-4" />
                <p className="font-semibold text-gray-700">No available premium engineers found.</p>
                <p className="text-sm text-gray-500">Don't worry, your job is live and engineers can still apply directly.</p>
            </div>
        )
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-50 rounded-lg p-6 m-4 max-w-3xl w-full relative transform transition-all duration-300" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <X size={24} />
                </button>
                <div className="text-center">
                    <Sparkles size={32} className="mx-auto text-purple-600 mb-2" />
                    <h2 className="text-2xl font-bold text-gray-800">Job Posted Successfully!</h2>
                    <p className="text-gray-600 mt-2 max-w-xl mx-auto">Why wait? Here are the top-matching, available engineers our AI found for your role. Send them an invite to apply now.</p>
                </div>
                
                <div className="my-6">
                    {renderContent()}
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                    <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700">
                        Finish & Close
                    </button>
                </div>
            </div>
        </div>
    );
};
