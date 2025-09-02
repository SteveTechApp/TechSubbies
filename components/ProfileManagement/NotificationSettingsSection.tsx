import React from 'react';
import { EngineerProfile, ProfileTier } from '../../types/index.ts';
import { CheckboxInput } from '../SignUp/CheckboxInput.tsx';

interface NotificationSettingsSectionProps {
    profile: EngineerProfile;
    formData: Partial<EngineerProfile>;
    onProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NotificationSettingsSection = ({ profile, formData, onProfileChange }: NotificationSettingsSectionProps) => (
    <div>
        {profile.profileTier !== ProfileTier.BASIC ? (
            <div>
                <CheckboxInput
                    label="Receive Weekly Job Digest"
                    name="jobDigestOptIn"
                    checked={formData.jobDigestOptIn || false}
                    onChange={onProfileChange}
                />
                <p className="text-xs text-gray-500 mt-1 pl-10">Get a curated list of top-matching jobs sent to your email every week.</p>
            </div>
        ) : (
            <p className="text-gray-600">Upgrade to a Skills Profile to manage advanced notifications and receive personalized job digests.</p>
        )}
    </div>
);