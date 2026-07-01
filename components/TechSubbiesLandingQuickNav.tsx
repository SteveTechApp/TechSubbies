import React from "react";

const navWrap: React.CSSProperties = {
  position: "fixed",
  top: 14,
  right: 18,
  zIndex: 9999,
  display: "flex",
  gap: 10,
  alignItems: "center",
  flexWrap: "wrap"
};

const navButton: React.CSSProperties = {
  cursor: "pointer",
  border: "1px solid rgba(103,232,249,0.36)",
  background: "rgba(2,6,23,0.92)",
  color: "#ffffff",
  borderRadius: 999,
  padding: "9px 13px",
  fontSize: 13,
  fontWeight: 900
};

const navMenu: React.CSSProperties = {
  position: "absolute",
  right: 0,
  marginTop: 8,
  minWidth: 285,
  border: "1px solid rgba(103,232,249,0.28)",
  background: "rgba(15,23,42,0.98)",
  borderRadius: 16,
  padding: 8,
  boxShadow: "0 24px 60px rgba(0,0,0,0.38)"
};

const navLink: React.CSSProperties = {
  display: "block",
  color: "#ffffff",
  textDecoration: "none",
  padding: "10px 11px",
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 800
};

export function TechSubbiesLandingQuickNav() {
  return (
    <div style={navWrap}>
      <details>
        <summary style={navButton}>How it works</summary>
        <div style={navMenu}>
          <a href="/watch-demo" style={navLink}>Demo Mode</a>
          <a href="/how-it-works/faq" style={navLink}>FAQ</a>
        </div>
      </details>

      <details>
        <summary style={navButton}>Subcontractors</summary>
        <div style={navMenu}>
          <a href="/engineer/profile" style={navLink}>Engineer Profile Hub</a>
          <a href="/engineer/personal-business-profile" style={navLink}>Personal & Insurance Profile</a>
          <a href="/engineer/skills-profile" style={navLink}>Skills Builder</a>
          <a href="/engineer/availability" style={navLink}>Availability & Working Area</a>
        </div>
      </details>
    </div>
  );
}

export default TechSubbiesLandingQuickNav;

