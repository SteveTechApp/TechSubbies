import React from "react";

const linkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  border: "1px solid rgba(103, 232, 249, 0.48)",
  background: "rgba(8, 47, 73, 0.92)",
  color: "#ffffff",
  padding: "9px 12px",
  fontSize: "12px",
  fontWeight: 800,
  textDecoration: "none",
  marginLeft: "8px",
};

function TechSubbiesFeatureLinks() {
  return (
    <div
      style={{
        position: "fixed",
        right: "18px",
        bottom: "18px",
        zIndex: 9999,
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        justifyContent: "flex-end",
      }}
    >
      <a href="/watch-demo" style={linkStyle}>Watch demo</a>
      <a href="/engineer/profile-setup" style={linkStyle}>Engineer profile setup</a>
      <a href="/engineer/skills-profile" style={linkStyle}>Skills builder</a>
    </div>
  );
}

export default TechSubbiesFeatureLinks;
export { TechSubbiesFeatureLinks };