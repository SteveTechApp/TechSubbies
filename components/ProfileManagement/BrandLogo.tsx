import React from "react";

type BrandLogoProps = {
  className?: string;
};

export default function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 font-bold text-slate-900 ${className}`}>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">
        TS
      </span>
      <span>TechSubbies</span>
    </div>
  );
}