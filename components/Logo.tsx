import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => (
  <div className={["flex items-center", className].join(" ")}>
    <svg viewBox="0 0 520 55" className="h-full w-auto" preserveAspectRatio="xMinYMid meet">
      <text 
        x="0"
        y="32" 
        fontFamily="'Orbitron', system-ui, sans-serif"
        fontWeight="bold" 
        fontSize="52" 
        dominantBaseline="middle"
        fill="#1F2937"
        letterSpacing="-1.5"
      >
        TechSubbies.com
      </text>
    </svg>
  </div>
);