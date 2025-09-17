import React, { useMemo } from 'react';
import { EngineerProfile } from '../../types';
import { CheckCircle, ArrowRight } from './Icons';

interface ProfileCompletionIndicatorProps {
    profile: EngineerProfile;
}

interface CompletionInfo {
    percentage: number;
    missingItems: { key: string; label: string; priority: number }[];
}

const calculateCompletion = (profile: EngineerProfile): CompletionInfo => {
    let score = 0;
    const maxScore = 100;
    const missingItems: { key: string; label: string; priority: number }[] = [];

    // Profile Essentials (20 pts)
    if (profile.description && profile.description.length > 50) {
        score += 20;
    } else {
        missingItems.push({ key: 'description', label: 'Write a compelling bio (over 50 characters)', priority: 1 });
    }
    
    // Contact Information (10 pts)
    if (profile.contact?.phone) score += 5;
    if (profile.contact?.linkedin) score += 5;
    if (!profile.contact?.phone || !profile.contact?.linkedin) {
        missingItems.push({ key: 'contact', label: 'Add your phone number and LinkedIn URL', priority: 3 });
    }

    // Skills & Specialist Roles (35 pts)
    if (profile.skills && profile.skills.length >= 3) {
        score += 10;
    } else {
        missingItems.push({ key: 'skills', label: 'Add at least 3 core skills', priority: 1 });
    }

    if (profile.selectedJobRoles && profile.selectedJobRoles.length > 0) {
        score += 25;
    } else {
        missingItems.push({ key: 'roles', label: 'Add at least one Specialist Role to showcase your expertise', priority: 1 });
    }

    // Certifications (10 pts)
    if (profile.certifications && profile.certifications.length > 0) {
        score += 10;
    } else {
        missingItems.push({ key: 'certs', label: 'List your industry certifications', priority: 2 });
    }

    // Compliance (15 pts)
    let complianceScore = 0;
    if (profile.compliance.professionalIndemnity.hasCoverage) complianceScore += 5;
    if (profile.compliance.publicLiability.hasCoverage) complianceScore += 5;
    if (profile.compliance.cscsCard || profile.compliance.siteSafe) complianceScore += 5;
    score += complianceScore;

    if (complianceScore < 15) {
        missingItems.push({ key: 'compliance', label: 'Complete your Compliance Details (Insurance, Safety Cards)', priority: 2 });
    }

    // Portfolio (10 pts)
    if (profile.caseStudies && profile.caseStudies.length > 0) {
        score += 10;
    } else {
        missingItems.push({ key: 'portfolio', label: 'Add a link to your portfolio or a case study', priority: 3 });
    }
    
    const percentage = Math.round((score / maxScore) * 100);

    return { percentage, missingItems: missingItems.sort((a,b) => a.priority - b.priority) };
};

export const ProfileCompletionIndicator = ({ profile }: ProfileCompletionIndicatorProps) => {
    const { percentage, missingItems } = useMemo(() => calculateCompletion(profile), [profile]);

    const progressColor =
        percentage < 50 ? 'bg-red-500' :
        percentage < 85 ? 'bg-yellow-500' :
        'bg-green-500';

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-2">Profile Strength</h2>
            <div className="flex items-center gap-4 mb-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className={`h-4 rounded-full transition-all duration-500 ${progressColor}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className={`text-xl font-bold ${progressColor.replace('bg-', 'text-')}`}>{percentage}%</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
                A complete profile ranks higher in search results and significantly increases your chances of getting matched with high-value contracts.
            </p>

            {missingItems.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-800 mb-2">To-Do List to Improve Your Profile:</h3>
                    <ul className="space-y-2">
                        {missingItems.slice(0,3).map(item => (
                             <li key={item.key} className="flex items-center text-sm text-gray-700">
                                <ArrowRight size={16} className="mr-2 text-blue-500 flex-shrink-0" />
                                <span>{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {percentage === 100 && (
                 <div className="flex items-center text-lg text-green-700 font-semibold p-3 bg-green-50 rounded-md">
                    <CheckCircle size={24} className="mr-3" />
                    <span>Great job! Your profile is complete and fully optimized.</span>
                </div>
            )}
        </div>
    );
};