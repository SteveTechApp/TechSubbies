import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => (
  <div className={["flex items-center", className].join(" ")}>
    {/* Base font size scales the logo. Adjusted width/height for the new stacked design. */}
    <div className="relative" style={{ width: '15.5em', height: '4.5em' }}>
      
      {/* 1. Laptop Icon (left side) */}
      <div className="absolute top-0 left-0" style={{ height: '3.5em' }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
          <path d="M56 48H8C6.89543 48 6 47.1046 6 46V12C6 9.79086 7.79086 8 10 8H54C56.2091 8 58 9.79086 58 12V46C58 47.1046 57.1046 48 56 48Z" fill="#4d5964" />
          <path d="M60 52H4C3.44772 52 3 51.5523 3 51V50C3 49.4477 3.44772 49 4 49H60C60.5523 49 61 49.4477 61 50V51C61 51.5523 60.5523 52 60 52Z" fill="#4d5964" />
          <rect x="10" y="12" width="44" height="32" rx="2" fill="#FFFFFF"/>
          <path d="M44 22C44 21.4477 43.5523 21 43 21H21C20.4477 21 20 21.4477 20 22V32.4142C20 32.9665 20.4477 33.4142 21 33.4142H28.5L32.5 37.4142V33.4142H43C43.5523 33.4142 44 32.9665 44 32.4142V22Z" fill="#1e73be"/>
          <circle cx="26" cy="27" r="2" fill="white"/>
          <circle cx="32" cy="27" r="2" fill="white"/>
          <circle cx="38" cy="27" r="2" fill="white"/>
        </svg>
      </div>

      {/* 2. Stacked Text: "Tech Subbies" */}
      <div className="absolute top-[0.1em] left-[4.2em] z-10 leading-none">
        <div className="font-bold" style={{ fontSize: '1.9em', color: '#4d5964' }}>Tech</div>
        <div className="font-bold" style={{ fontSize: '1.9em', color: '#1e73be' }}>Subbies</div>
      </div>

      {/* 3. Cable and connector part (the "E") */}
      <div className="absolute bottom-0 left-[2.8em] z-0" style={{ width: '10em', height: '2.5em' }}>
        <svg viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          {/* Cable path. Adjusted for new layout. */}
          <path d="M8 30 C 20 30, 30 40, 60 40 S 130 30, 170 30" stroke="#4d5964" strokeWidth="5" fill="none"/>
          
          <g fill="#4d5964">
            {/* Left connector piece */}
            <path d="M3 30H8V26H11V34H8V30Z"/>
            <rect x="-7" y="24" width="10" height="12" rx="2"/>

            {/* Right connector, shaped like a blocky 'E' */}
            <path d="M170 22 h 25 v 6 h -17 v 6 h 17 v 6 h -25 z" />
          </g>
        </svg>
      </div>
      
      {/* 4. ".com" Text, positioned to follow the 'E' connector */}
      <div className="absolute bottom-[0.3em] z-10 leading-none" style={{ left: '12.55em' }}>
        <span className="font-bold" style={{ fontSize: '1.9em', color: '#4d5964' }}>.com</span>
      </div>

    </div>
  </div>
);
