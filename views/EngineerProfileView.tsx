import React, { useState } from 'react';
import { EngineerProfile, Role, ProfileTier, CaseStudy } from '../types';
import { MessageCircle, Star, Trophy, Share2, Handshake, Mail, Phone, Globe, Linkedin, ShieldCheck, CheckCircle, Award, X as XIcon, FileText, Download, Sparkles, Clapperboard, Briefcase } from '../components/Icons';
import { TopTrumpCard } from '../components/TopTrumpCard';
import { ReviewCard } from '../components/ReviewCard';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
// FIX: Replaced incorrect context hook 'useInteractions' with the correct hook 'useAppContext'.
import { useAppContext } from '../context/InteractionContext';
import { ShareProfileModal } from '../components/ShareProfileModal';
import { CVSearch } from '../components/CVSearch';
import { StoryboardViewer } from '../components/StoryboardViewer';

interface EngineerProfileViewProps {
    profile: EngineerProfile | null;
    isEditable: boolean;
    onEdit: () => void;
}

export const EngineerProfileView = ({ profile, isEditable, onEdit }: EngineerProfileViewProps) => {
    const { user } = useAuth();
    const { reviews, allUsers } = useData();
    const { startConversationAndNavigate, proposeCollaboration } = useAppContext();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [viewingStoryboard, setViewingStoryboard] = useState<CaseStudy | null>(null);

    if (!profile) {
        return <div>Loading profile...</div>;
    }

    const canMessage = user && (user.role === Role.COMPANY || user.role === Role.RESOURCING_COMPANY);
    const isEngineerViewing = user && user.role === Role.ENGINEER && user.profile.id !== profile.id;
    const isCompanyViewing = user && (user.role === Role.COMPANY || user.role === Role.RESOURCING_COMPANY);
    
    const handleNavigateToMessages = () => {
      // This is a placeholder; actual navigation is handled by the calling dashboard.
      console.log("Navigating to messages...");
    };

    const handleProposeCollaboration = () => {
        if (!profile) return;
        // The callback could be used by the parent dashboard to switch to the 'Messages' view.
        const navigateCallback = () => console.log("Navigation to messages should be handled by the parent dashboard.");
        proposeCollaboration(profile.id, navigateCallback);
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
        <div className="relative font-sans max-w-4xl mx-auto py-4 space-y-6">
            <div className="absolute top-8 right-0 sm:right-4 z-20 flex items-center gap-2">
                 <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 shadow-lg border"
                    aria-label={`Share ${profile.name}'s profile`}
                >
                    <Share2 size={16} className="mr-2" /> Share
                </button>
                {isEngineerViewing && (
                    <button
                        onClick={handleProposeCollaboration}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg"
                        aria-label={`Propose collaboration with ${profile.name}`}
                    >
                        <Handshake size={16} className="mr-2" /> Propose Collaboration
                    </button>
                )}
                {canMessage && (
                    <button
                        onClick={() => startConversationAndNavigate(profile.id, handleNavigateToMessages)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg"
                        aria-label={`Message ${profile.name}`}
                    >
                        <MessageCircle size={16} className="mr-2" /> Message
                    </button>
                )}
            </div>
           
            <TopTrumpCard profile={profile} isEditable={isEditable} onEdit={onEdit} />

            {/* --- NEW AI Match Score Section --- */}
            {profile.matchScore !== undefined && (
                <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-purple-500">
                    <h2 className="text-2xl font-bold mb-2 flex items-center">
                        <Sparkles size={22} className="mr-2 text-purple-500" />
                        AI Match Score
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 p-4">
                        <div className="relative w-32 h-32 flex-shrink-0">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                                <circle
                                    className={
                                        profile.matchScore >= 85 ? 'stroke-green-500' : 
                                        profile.matchScore >= 70 ? 'stroke-blue-500' : 
                                        profile.matchScore >= 50 ? 'stroke-yellow-500' : 'stroke-gray-500'
                                    }
                                    strokeWidth="8"
                                    strokeDasharray={2 * Math.PI * 42}
                                    strokeDashoffset={(2 * Math.PI * 42) - (profile.matchScore / 100) * (2 * Math.PI * 42)}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    r="42"
                                    cx="50"
                                    cy="50"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl font-bold text-gray-800">{Math.round(profile.matchScore)}</span>
                                <span className="text-lg font-bold text-gray-800">%</span>
                            </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <p className="text-gray-600">
                                This score represents the AI's assessment of how well this engineer's skills, experience, and specialist roles align with the requirements of the job you selected for the search.
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                Note: This is a guide. Always conduct your own interviews and due diligence.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* CV / Resume Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <FileText size={22} className="mr-2 text-gray-500" />
                    CV / Resume
                </h2>
                {profile.cv ? (
                    <div>
                        <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md border">
                            <div className="flex items-center gap-3">
                                <FileText size={20} className="text-blue-600" />
                                <span className="font-semibold">{profile.cv.fileName}</span>
                            </div>
                            <a href={profile.cv.fileUrl} download className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold flex items-center gap-2">
                                <Download size={14} /> Download
                            </a>
                        </div>

                        {profile.cv.isSearchable && isCompanyViewing ? (
                            <CVSearch cvFileUrl={profile.cv.fileUrl} />
                        ) : (
                           !profile.cv.isSearchable && (
                                <div className="mt-4 text-center p-4 bg-yellow-50 rounded-lg border-2 border-dashed border-yellow-300">
                                    <h3 className="text-lg font-bold text-yellow-800">CV Not Searchable</h3>
                                    <p className="text-yellow-700 mt-1">This engineer has a Basic Profile. Their CV has been uploaded but is not searchable by clients.</p>
                                    {isEditable && (
                                        <button onClick={() => alert('This would navigate to the billing page.')} className="mt-3 bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600">
                                            Upgrade to Enable Search
                                        </button>
                                    )}
                                </div>
                           )
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No CV has been uploaded.</p>
                )}
            </div>

            {/* Specialist Roles & Expertise Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <Star size={22} className="mr-2 text-yellow-500" />
                    Specialist Roles & Expertise
                </h2>
                {profile.profileTier === ProfileTier.BASIC ? (
                    <div className="text-center p-6 bg-gray-100 rounded-lg border-2 border-dashed">
                        <h3 className="text-lg font-bold text-gray-800">This is a Premium Feature</h3>
                        <p className="text-gray-600 mt-2">Engineers with a Skills Profile showcase detailed expertise and rank higher in search results.</p>
                        {isEditable && (
                            <button onClick={() => alert('This would navigate to the billing page.')} className="mt-4 bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700">
                                Upgrade to View & Edit
                            </button>
                        )}
                    </div>
                ) : (
                    profile.selectedJobRoles && profile.selectedJobRoles.length > 0 ? (
                        <div className="space-y-6">
                            {profile.selectedJobRoles.map((role, index) => (
                                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-lg font-semibold text-blue-800">{role.roleName}</h4>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-blue-600">{role.overallScore}</span>
                                            <span className="text-sm text-gray-500 block">Overall Score</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {role.skills.map(skill => {
                                            const ratingColor = skill.rating > 75 ? 'bg-green-500' : skill.rating > 50 ? 'bg-blue-500' : 'bg-yellow-500';
                                            return (
                                                <div key={skill.name}>
                                                    <div className="flex justify-between text-sm font-medium text-gray-700">
                                                        <span>{skill.name}</span>
                                                        <span>{skill.rating}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                        <div className={`${ratingColor} h-2 rounded-full`} style={{width: `${skill.rating}%`}}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No specialist roles defined. Add roles in 'Manage Profile' to get better job matches.</p>
                    )
                )}
            </div>

            {/* Case Studies Section */}
            {profile.caseStudies && profile.caseStudies.length > 0 && (
                 <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <Briefcase size={22} className="mr-2 text-indigo-500" />
                        Portfolio & Case Studies
                    </h2>
                    <div className="space-y-2">
                        {profile.caseStudies.map(cs => {
                            const isStoryboard = cs.url.startsWith('techsubbies://storyboard');
                            return (
                                <div key={cs.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-md border">
                                    <div className="flex items-center gap-3">
                                        {isStoryboard ? <Clapperboard size={20} className="text-indigo-600"/> : <Globe size={20} className="text-blue-600" />}
                                        <span className="font-semibold">{cs.name}</span>
                                    </div>
                                    {isStoryboard ? (
                                        <button onClick={() => setViewingStoryboard(cs)} className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold">
                                            View Storyboard
                                        </button>
                                    ) : (
                                        <a href={cs.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold">
                                            View Link
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Certifications & Compliance Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <ShieldCheck size={22} className="mr-2 text-blue-500" />
                    Certifications & Compliance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Certifications</h3>
                        {profile.certifications && profile.certifications.length > 0 ? (
                            <ul className="space-y-4">
                                {profile.certifications.map((cert, index) => (
                                    <li key={index}>
                                        <div className="flex items-center">
                                            {cert.verified ? <CheckCircle size={18} className="mr-2 text-green-600 flex-shrink-0" /> : <Award size={18} className="mr-2 text-gray-400 flex-shrink-0" />}
                                            <span className="text-gray-800 font-medium">{cert.name}</span>
                                            {cert.verified && <span className="ml-auto text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex-shrink-0">Verified</span>}
                                        </div>
                                        {cert.documents && cert.documents.length > 0 && (
                                            <ul className="mt-2 pl-8 space-y-1">
                                                {cert.documents.map(doc => (
                                                    <li key={doc.id} className="flex items-center text-sm">
                                                        <FileText size={14} className="mr-2 text-gray-500 flex-shrink-0" />
                                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{doc.name}</a>
                                                        {doc.verified ? (
                                                            <span className="ml-auto text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex-shrink-0">Verified</span>
                                                        ) : (
                                                            <span className="ml-auto text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full flex-shrink-0">Pending</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm">No certifications listed.</p>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Compliance</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                                <CheckCircle size={16} className={`mr-2 flex-shrink-0 ${profile.compliance.professionalIndemnity?.hasCoverage ? 'text-green-600' : 'text-gray-300'}`} />
                                Professional Indemnity (£{profile.compliance.professionalIndemnity?.amount?.toLocaleString() || 'N/A'})
                                {profile.compliance.professionalIndemnity?.isVerified && <span className="ml-auto text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Verified</span>}
                            </li>
                            <li className="flex items-center">
                                <CheckCircle size={16} className={`mr-2 flex-shrink-0 ${profile.compliance.publicLiability?.hasCoverage ? 'text-green-600' : 'text-gray-300'}`} />
                                Public Liability (£{profile.compliance.publicLiability?.amount?.toLocaleString() || 'N/A'})
                                {profile.compliance.publicLiability?.isVerified && <span className="ml-auto text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Verified</span>}
                            </li>
                             <li className="flex items-center">
                                <CheckCircle size={16} className={`mr-2 flex-shrink-0 ${profile.compliance.cscsCard ? 'text-green-600' : 'text-gray-300'}`} />
                                CSCS Card
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Contact & Links Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <Mail size={22} className="mr-2 text-gray-500" />
                    Contact & Links
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {profile.contact.email && <a href={`mailto:${profile.contact.email}`} className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"><Mail size={18} className="mr-3 text-gray-400 flex-shrink-0" /> <span className="truncate">{profile.contact.email}</span></a>}
                    {profile.contact.phone && <a href={`tel:${profile.contact.phone}`} className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"><Phone size={18} className="mr-3 text-gray-400 flex-shrink-0" /> {profile.contact.phone}</a>}
                    {profile.contact.website && <a href={profile.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"><Globe size={18} className="mr-3 text-gray-400 flex-shrink-0" /> <span className="truncate">{profile.contact.website}</span></a>}
                    {profile.contact.linkedin && <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"><Linkedin size={18} className="mr-3 text-gray-400 flex-shrink-0" /> LinkedIn Profile</a>}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <Trophy size={22} className="mr-2 text-yellow-500" />
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

            {viewingStoryboard && (
                <StoryboardViewer
                    isOpen={!!viewingStoryboard}
                    onClose={() => setViewingStoryboard(null)}
                    storyboard={viewingStoryboard}
                />
            )}
        </div>
    );
};