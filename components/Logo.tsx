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
      d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M12 3V21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 7C8.07004 8.3501 8.07004 10.6499 9 12C9.92996 13.3501 9.92996 15.6499 9 17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M6.5 9.5C6.03502 10.325 6.03502 11.675 6.5 12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <rect x="14" y="6" width="2" height="2" rx="1" fill="currentColor" />
    <rect x="14" y="11" width="2" height="2" rx="1" fill="currentColor" />
    <rect x="14" y="16" width="2" height="2" rx="1" fill="currentColor" />
    <path
      d="M16 7H18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M16 12H19V17H16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Logo = ({ className }: LogoProps) => (
    <div className={["flex items-center font-bold text-2xl", className || ""].join(" ")}>
        <TechSubbiesLogoIcon className="text-blue-500 mr-2" />
        <span>TechSubbies</span>
    </div>
);
