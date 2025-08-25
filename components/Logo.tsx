import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => (
  <div className={["flex items-center", className].join(" ")}>
    <svg viewBox="0 0 450 90" className="h-full w-auto">
      {/* Icon - updated to better match user image */}
      <g>
        <rect x="0" y="0" width="64" height="64" rx="14" fill="#2563EB" />
        <g stroke="white" strokeWidth="4.5" fill="none">
           <ellipse cx="32" cy="32" rx="12" ry="22" />
           <ellipse cx="32" cy="32" rx="22" ry="12" />
        </g>
      </g>
      
      {/* Main Text - updated font weight and colors */}
      <g transform="translate(80, 0)">
        <text y="40" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif" fontWeight="bold" fontSize="42" dominantBaseline="middle">
            <tspan fill="#2563EB">Tech</tspan>
            <tspan fill="#1F2937">Subbies</tspan>
            <tspan fill="#1F2937">.com</tspan>
        </text>
      </g>
      
      {/* Strapline - updated to match user image */}
      <text y="78" x="0" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif" fontSize="15">
          <tspan fill="#4B5563">AV &amp; IT Professional Network</tspan>
          <tspan fill="#2563EB" fontWeight="bold"> • </tspan>
          <tspan fill="#2563EB" fontStyle="italic">Where Expertise Meets Opportunity</tspan>
      </text>
    </svg>
  </div>
);