import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => (
  <div className={["flex items-center", className].join(" ")}>
    <svg viewBox="0 0 480 70" className="h-full w-auto" preserveAspectRatio="xMinYMid meet">
      {/* Icon */}
      <g>
        <rect x="0" y="0" width="64" height="64" rx="14" fill="#2563EB" />
        <g stroke="white" strokeWidth="3.5" fill="none">
           <circle cx="32" cy="32" r="23"/>
           <ellipse cx="32" cy="32" rx="10" ry="23" />
           <line x1="9" y1="32" x2="55" y2="32"/>
        </g>
      </g>
      
      {/* Main Text */}
      <g transform="translate(75, 0)">
        <text 
          y="32" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif" 
          fontWeight="bold" 
          fontSize="52" 
          dominantBaseline="middle"
          letterSpacing="-1"
        >
            <tspan fill="#2563EB">Tech</tspan>
            <tspan fill="#1F2937">Subbies</tspan>
            <tspan fill="#64748b" fontSize="52">.com</tspan>
        </text>
      </g>
    </svg>
  </div>
);