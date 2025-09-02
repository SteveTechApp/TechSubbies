import React from 'react';
import { Badge } from '../types/index.ts';

interface BadgeDisplayProps {
    badge: Badge;
}

export const BadgeDisplay = ({ badge }: BadgeDisplayProps) => (
    <div className="tooltip-container">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${badge.color}`}>
            <badge.icon size={16} />
            <span>{badge.name}</span>
        </div>
        <span className="tooltip-text">{badge.description}</span>
    </div>
);
