import React from 'react';

export const Logo: React.FC = () => (
    <svg width="170" height="40" viewBox="0 0 170 40" xmlns="http://www.w3.org/2000/svg">
        {/* Icon part */}
        <g className="text-blue-600" transform="translate(0,0)">
            {/* Head */}
            <circle cx="20" cy="13" r="6" fill="currentColor"/>
            {/* Body */}
            <path d="M10 34 C10 24, 30 24, 30 34 Z" fill="currentColor"/>
            {/* Tech frame/element */}
            <path d="M2,20 C2,10 10,2 20,2" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M38,20 C38,30 30,38 20,38" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </g>
        {/* Text part */}
        <text x="45" y="27" fontFamily="system-ui, sans-serif" fontSize="20" fontWeight="bold" className="fill-current text-gray-800">
            TechSubbies
        </text>
    </svg>
);