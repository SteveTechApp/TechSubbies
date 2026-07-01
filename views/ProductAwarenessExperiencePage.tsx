import React, { useState } from "react";
import { productAwarenessProfiles } from "../data/productAwarenessProfiles";

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f8fafc 0%, #eef6ff 48%, #f8fafc 100%)",
  color: "#0f172a",
  padding: "24px",
  fontFamily: "Inter, system-ui, sans-serif"
};

const shellStyle: React.CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto"
};

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(15,23,42,0.1)",
  background: "#ffffff",
  borderRadius: 18,
  padding: 16,
  boxShadow: "0 14px 38px rgba(15,23,42,0.08)"
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  border: "1px solid rgba(15,23,42,0.1)",
  background: "#ffffff",
  borderRadius: 14,
  padding: 12,
  marginBottom: 8,
  cursor: "pointer",
  fontWeight: 900,
  color: "#0f172a"
};

const activeButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "#eff6ff",
  border: "1px solid rgba(37,99,235,0.36)"
};

function ProductAwarenessExperiencePage() {
  const [selectedId, setSelectedId] = useState(productAwarenessProfiles[0]?.id ?? "");
  const selected = productAwarenessProfiles.find((profile) => profile.id === selectedId) ?? productAwarenessProfiles[0];

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <a href="/engineer/profile" style={{ color: "#2563eb", fontWeight: 900, textDecoration: "none" }}>
          Back to profile hub
        </a>

        <h1 style={{ fontSize: 38, margin: "18px 0 8px" }}>Product Awareness / Experience</h1>
        <p style={{ color: "#475569", lineHeight: 1.6, maxWidth: 860 }}>
          This is skills-based product awareness, not a tools or equipment list. Use it to show experience
          with AV technologies, platforms, brands and system types that help customers judge suitability.
        </p>

        <section style={{ display: "grid", gridTemplateColumns: "340px minmax(0, 1fr)", gap: 16, marginTop: 18 }}>
          <aside style={cardStyle}>
            {productAwarenessProfiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                style={profile.id === selected.id ? activeButtonStyle : buttonStyle}
                onClick={() => setSelectedId(profile.id)}
              >
                {profile.title}
              </button>
            ))}
          </aside>

          <article style={cardStyle}>
            <p style={{ color: "#0284c7", fontSize: 12, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              {selected.category.replaceAll("-", " ")}
            </p>

            <h2 style={{ fontSize: 28, margin: "0 0 8px" }}>{selected.title}</h2>
            <p style={{ color: "#475569", lineHeight: 1.6 }}>{selected.summary}</p>

            {selected.awarenessAreas.map((area) => (
              <section key={area.title} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
                <article style={{ ...cardStyle, boxShadow: "none" }}>
                  <h3 style={{ marginTop: 0 }}>Must-have awareness</h3>
                  <ul style={{ color: "#334155", lineHeight: 1.65 }}>
                    {area.mustHave.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>

                <article style={{ ...cardStyle, boxShadow: "none" }}>
                  <h3 style={{ marginTop: 0 }}>Nice-to-have awareness</h3>
                  <ul style={{ color: "#334155", lineHeight: 1.65 }}>
                    {area.niceToHave.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </section>
            ))}
          </article>
        </section>
      </section>
    </main>
  );
}

export { ProductAwarenessExperiencePage };
export default ProductAwarenessExperiencePage;
