import Header from "../components/Header";
import React from "react";

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #050b14 0%, #08111f 52%, #020617 100%)", color: "#ffffff", padding: 28, fontFamily: "Inter, system-ui, sans-serif" },
  header: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 16, alignItems: "start", marginBottom: 22 },
  eyebrow: { color: "#67e8f9", fontSize: 12, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px" },
  title: { fontSize: 36, lineHeight: 1.05, margin: "0 0 10px" },
  copy: { color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.55, margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 1180 },
  card: { border: "1px solid rgba(148,163,184,0.18)", background: "rgba(15,23,42,0.78)", borderRadius: 22, padding: 20 },
  cardTitle: { color: "#67e8f9", fontSize: 18, fontWeight: 900, margin: "0 0 10px" },
  link: { display: "inline-flex", border: "1px solid rgba(103,232,249,0.42)", background: "rgba(8,47,73,0.72)", color: "#ffffff", borderRadius: 999, padding: "10px 14px", fontSize: 13, fontWeight: 800, textDecoration: "none" },
  cta: { display: "inline-flex", marginTop: 14, border: "1px solid rgba(103,232,249,0.48)", background: "rgba(8,47,73,0.78)", color: "#ffffff", borderRadius: 999, padding: "11px 15px", fontSize: 13, fontWeight: 900, textDecoration: "none" }
};

function EngineerProfileSetupPage() {
  return (
    <>
      <Header />
      <main style={styles.page}>
      <header style={styles.header}>
        <section>
          <p style={styles.eyebrow}>Engineer profile setup</p>
          <h1 style={styles.title}>Complete your engineer profile in two clear stages.</h1>
          <p style={styles.copy}>Separate identity, business details and compliance from granular role-based technical skills.</p>
        </section>
        <a href="/" style={styles.link}>Back to landing page</a>
      </header>
      <section style={styles.grid}>
        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Personal / business profile</h2>
          <p style={styles.copy}>Identity, business details, compliance, availability, travel range and work preferences.</p>
          <a href="/engineer/personal-business-profile" style={styles.cta}>Open personal / business profile</a>
        </article>
        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Skills builder</h2>
          <p style={styles.copy}>Role-based AV, IT and hybrid skills, ratings, product tags and evidence prompts.</p>
          <a href="/engineer/skills-profile" style={styles.cta}>Open skills builder</a>
        </article>
      </section>
    </main>
    </>
  );
}

export default EngineerProfileSetupPage;
export { EngineerProfileSetupPage };