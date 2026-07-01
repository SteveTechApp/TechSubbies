import React from "react";

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(103,232,249,0.18)",
  background: "rgba(15,23,42,0.76)",
  borderRadius: 20,
  padding: 18
};

const titleStyle: React.CSSProperties = {
  color: "#67e8f9",
  fontSize: 16,
  fontWeight: 900,
  margin: "0 0 8px"
};

const listStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.76)",
  lineHeight: 1.7,
  paddingLeft: 18,
  marginBottom: 0
};

export function EngineerAvailabilityPage() {
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #06111f 0%, #081827 55%, #020617 100%)", color: "#ffffff", padding: 28, fontFamily: "Inter, system-ui, sans-serif" }}>
      <section style={{ maxWidth: 1120, margin: "0 auto" }}>
        <a href="/engineer/profile" style={{ color: "#67e8f9", textDecoration: "none", fontWeight: 800 }}>Back to Engineer Profile Hub</a>
        <p style={{ color: "#67e8f9", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.14em", marginTop: 24 }}>Subcontractors</p>
        <h1 style={{ fontSize: 38, marginBottom: 10 }}>Availability & Working Area</h1>
        <p style={{ color: "rgba(255,255,255,0.76)", lineHeight: 1.65 }}>
          This section controls where, when and how an engineer wants to be discovered for suitable opportunities.
        </p>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14, marginTop: 22 }}>
          <article style={cardStyle}>
            <h2 style={titleStyle}>Location and radius</h2>
            <ul style={listStyle}>
              <li>Base location</li>
              <li>Normal working radius</li>
              <li>Maximum travel distance</li>
              <li>Overnight work preference</li>
              <li>Travel buffer between jobs</li>
            </ul>
          </article>

          <article style={cardStyle}>
            <h2 style={titleStyle}>Calendar and working pattern</h2>
            <ul style={listStyle}>
              <li>Working days</li>
              <li>Preferred hours</li>
              <li>Google / Microsoft calendar sync</li>
              <li>Manual unavailable dates</li>
              <li>Minimum notice period</li>
            </ul>
          </article>

          <article style={cardStyle}>
            <h2 style={titleStyle}>Weekend and holiday rules</h2>
            <ul style={listStyle}>
              <li>Work weekends: yes, no or premium only</li>
              <li>Work public holidays: yes, no or ask first</li>
              <li>Private holidays</li>
              <li>Emergency callout preference</li>
              <li>Auto-accept eligibility rules</li>
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
}

export default EngineerAvailabilityPage;

