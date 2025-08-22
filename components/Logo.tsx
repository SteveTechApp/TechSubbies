import React from 'react';

interface LogoProps {
  className?: string;
}

const TechSubbiesLogoIcon = ({ className }: { className?: string }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9 20V14H5V10H9V4H15V10H19V14H15V20H9Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);


export const Logo = ({ className }: LogoProps) => (
    <div className={["flex items-center font-bold text-2xl", className || ""].join(" ")}>
        <TechSubbiesLogoIcon className="text-blue-500 mr-2" />
        <span>TechSubbies</span>
    </div>
);