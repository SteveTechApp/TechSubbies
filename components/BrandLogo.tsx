import React from "react";

interface BrandLogoProps {
  compact?: boolean;
}

function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <span
      aria-label="TechSubbies.com"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "flex-start",
        lineHeight: 1,
      }}
    >
      <img
        src="/brand/techsubbies-logo.png"
        alt="TechSubbies.com"
        style={{
          display: "block",
          height: compact ? "30px" : "42px",
          width: "auto",
          maxWidth: compact ? "220px" : "320px",
          objectFit: "contain",
        }}
      />
    </span>
  );
}

export { BrandLogo };
export default BrandLogo;