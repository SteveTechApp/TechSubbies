import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => (
  <div className={["flex items-center", className].join(" ")}>
    <svg viewBox="0 0 450 90" className="h-12 w-auto sm:h-16">
      {/* Icon */}
      <g>
        <rect x="0" y="0" width="64" height="64" rx="14" fill="#1D73EB" />
        <g>
          <ellipse cx="24" cy="32" rx="10" ry="20" stroke="white" strokeWidth="4.5" fill="none" transform="rotate(-15 24 32)" />
          <ellipse cx="38" cy="32" rx="20" ry="10" stroke="white" strokeWidth="4.5" fill="none" />
        </g>
      </g>
      
      {/* Main Text */}
      <g transform="translate(80, 0)">
        <text y="40" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif" fontWeight="900" fontSize="42" dominantBaseline="middle">
            <tspan fill="#1D73EB">Tech</tspan>
            <tspan fill="#18293D">Subbies</tspan>
            <tspan fill="#6B7280">.com</tspan>
        </text>
      </g>
      
      {/* Strapline */}
      <text y="78" x="0" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif" fontSize="15">
          <tspan fill="#6B7280">AV &amp; IT Professional Network</tspan>
          <tspan fill="#1D73EB" fontWeight="bold"> • </tspan>
          <tspan fill="#1D73EB" fontStyle="italic">Where Expertise Meets Opportunity</tspan>
      </text>
    </svg>
  </div>
);