import React from "react";

const cardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: 220,
  border: "1px solid rgba(103,232,249,0.18)",
  background: "rgba(15,23,42,0.76)",
  borderRadius: 20,
  padding: 18,
  textDecoration: "none",
  color: "#ffffff"
};

const titleStyle: React.CSSProperties = {
  color: "#67e8f9",
  fontSize: 18,
  fontWeight: 900,
  margin: "0 0 8px"
};

const copyStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.76)",
  lineHeight: 1.65,
  margin: 0
};

const buttonStyle: React.CSSProperties = {
  marginTop: "auto",
  border: "1px solid rgba(103,232,249,0.35)",
  background: "rgba(8,47,73,0.42)",
  color: "#ffffff",
  borderRadius: 999,
  padding: "10px 13px",
  fontWeight: 900,
  textAlign: "center"
};

export function EngineerProfileHubPage() {
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #06111f 0%, #081827 55%, #020617 100%)", color: "#ffffff", padding: 28, fontFamily: "Inter, system-ui, sans-serif" }}>
      <section style={{ maxWidth: 1120, margin: "0 auto" }}>
        <a href="/" style={{ color: "#67e8f9", textDecoration: "none", fontWeight: 800 }}>Back to landing page</a>
        <p style={{ color: "#67e8f9", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.14em", marginTop: 24 }}>Subcontractors</p>
        <h1 style={{ fontSize: 38, marginBottom: 10 }}>Engineer Profile Hub</h1>
        <p style={{ color: "rgba(255,255,255,0.76)", lineHeight: 1.65 }}>
          Keep personal identity, business details and insurance separate from skills and availability.
        </p>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14, marginTop: 22 }}>
          <a href="/engineer/personal-business-profile" style={cardStyle}>
            <h2 style={titleStyle}>Personal & Insurance Profile</h2>
            <p style={copyStyle}>Personal details, business information, insurance documents, verification and official paperwork.</p>
            <span style={buttonStyle}>Manage profile</span>
          </a>

          <a href="/engineer/skills-profile" style={cardStyle}>
            <h2 style={titleStyle}>Skills Builder</h2>
            <p style={copyStyle}>Role-based AV/IT skills, product knowledge, certifications, self-ratings and specialist capability.</p>
            <span style={buttonStyle}>Build skills profile</span>
          </a>

          <a href="/engineer/availability" style={cardStyle}>
            <h2 style={titleStyle}>Availability & Working Area</h2>
            <p style={copyStyle}>Location, working radius, calendar availability, weekend rules, public holidays and travel preferences.</p>
            <span style={buttonStyle}>Set availability</span>
          </a>

          <a href="/engineer/product-awareness" style={cardStyle}>
            <h2 style={titleStyle}>Product Awareness / Experience</h2>
            <p style={copyStyle}>Skills-based awareness of AV brands, platforms, signal technologies and product categories.</p>
            <span style={buttonStyle}>Add product awareness</span>
          </a>
        </section>
      </section>
    </main>
  );
}

export default EngineerProfileHubPage;


