import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => (
  <div className={["flex items-center", className].join(" ")}>
    <svg viewBox="0 0 380 70" className="h-full w-auto" preserveAspectRatio="xMinYMid meet">
      {/* Icon */}
      <g>
        <rect x="0" y="0" width="64" height="64" rx="14" fill="#2563EB" />
        <g stroke="white" strokeWidth="4.5" fill="none">
           <ellipse cx="32" cy="32" rx="12" ry="22" />
           <ellipse cx="32" cy="32" rx="22" ry="12" />
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
            <tspan fill="#64748b" fontSize="42">.com</tspan>
        </text>
      </g>
    </svg>
  </div>
);
