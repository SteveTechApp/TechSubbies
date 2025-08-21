import React from 'react';
import { Zap } from './Icons.tsx';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => (
    <div className={["flex items-center font-bold text-2xl", className || ""].join(" ")}>
        <Zap className="text-blue-500 mr-2" />
        <span>TechSubbies</span>
    </div>
);