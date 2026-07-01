import React, { useMemo, useState } from "react";
import {
  opportunityVisibilityGuaranteeFaq,
  sampleGuaranteeMonth,
  techSubbiesServiceBoundary,
} from "../data/opportunityGuarantee";
import { assessOpportunityVisibilityGuarantee } from "../services/opportunityGuaranteeEngine";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 15% 0%, rgba(56,189,248,0.18), transparent 34%), linear-gradient(135deg, #06111f 0%, #081827 48%, #030712 100%)",
    color: "#ffffff",
    padding: "28px",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  shell: {
    maxWidth: "1180px",
    margin: "0 auto",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
    marginBottom: "18px",
  },
  backLink: {
    color: "#67e8f9",
    textDecoration: "none",
    border: "1px solid rgba(103,232,249,0.36)",
    borderRadius: "999px",
    padding: "9px 13px",
    fontSize: "13px",
    fontWeight: 800,
  },
  eyebrow: {
    color: "#67e8f9",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    margin: "0 0 8px",
  },
  title: {
    color: "#ffffff",
    fontSize: "38px",
    lineHeight: 1.05,
    margin: "0 0 10px",
    maxWidth: "920px",
  },
  copy: {
    color: "rgba(255,255,255,0.76)",
    fontSize: "15px",
    lineHeight: 1.65,
    margin: 0,
  },
  hero: {
    border: "1px solid rgba(103,232,249,0.22)",
    background: "rgba(15,23,42,0.72)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 20px 70px rgba(0,0,0,0.28)",
    marginBottom: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 0.72fr)",
    gap: "16px",
    alignItems: "start",
  },
  card: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.78)",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
  },
  cardTitle: {
    color: "#67e8f9",
    fontSize: "16px",
    fontWeight: 900,
    margin: "0 0 8px",
  },
  faqButton: {
    width: "100%",
    textAlign: "left",
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(2,6,23,0.48)",
    color: "#ffffff",
    borderRadius: "16px",
    padding: "13px 14px",
    cursor: "pointer",
    fontWeight: 800,
    marginTop: "8px",
  },
  answer: {
    border: "1px solid rgba(103,232,249,0.18)",
    borderTop: 0,
    borderRadius: "0 0 16px 16px",
    margin: "-8px 0 8px",
    padding: "13px 14px",
    background: "rgba(8,47,73,0.26)",
  },
  pillGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
    marginTop: "12px",
  },
  miniCard: {
    border: "1px solid rgba(103,232,249,0.18)",
    background: "rgba(2,6,23,0.42)",
    borderRadius: "16px",
    padding: "13px",
  },
  smallTitle: {
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 900,
    margin: "0 0 6px",
  },
  status: {
    border: "1px solid rgba(103,232,249,0.34)",
    background: "rgba(8,47,73,0.46)",
    borderRadius: "18px",
    padding: "14px",
    marginTop: "12px",
  },
  statusValue: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: 900,
    margin: "0 0 6px",
  },
  list: {
    color: "rgba(255,255,255,0.74)",
    fontSize: "14px",
    lineHeight: 1.7,
    paddingLeft: "18px",
    marginBottom: 0,
  },
};

function HowItWorksFaqPage() {
  const [openIndex, setOpenIndex] = useState(0);
  const guaranteeAssessment = useMemo(
    () => assessOpportunityVisibilityGuarantee(sampleGuaranteeMonth),
    [],
  );

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <div style={styles.topbar}>
          <div>
            <p style={styles.eyebrow}>How it works</p>
            <h1 style={styles.title}>TechSubbies is a skills and availability matching service.</h1>
          </div>
          <a href="/" style={styles.backLink}>Back to app</a>
        </div>

        <section style={styles.hero}>
          <p style={styles.copy}>
            TechSubbies helps customers discover independent AV and IT contractors by visible skills,
            role profile, location and availability. The commercial arrangement remains directly between
            the customer and contractor. TechSubbies does not recruit, employ, manage or pay engineers.
          </p>
        </section>

        <section style={styles.grid}>
          <article style={styles.card}>
            <h2 style={styles.cardTitle}>Frequently asked questions</h2>

            {opportunityVisibilityGuaranteeFaq.map((item, index) => (
              <div key={item.question}>
                <button
                  style={styles.faqButton}
                  onClick={() => setOpenIndex(index)}
                  type="button"
                >
                  {item.question}
                </button>

                {openIndex === index ? (
                  <div style={styles.answer}>
                    <p style={styles.copy}>{item.answer}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </article>

          <aside>
            <section style={styles.card}>
              <h2 style={styles.cardTitle}>Service boundary</h2>
              <div style={styles.pillGrid}>
                {techSubbiesServiceBoundary.map((item) => (
                  <article key={item.title} style={styles.miniCard}>
                    <p style={styles.smallTitle}>{item.title}</p>
                    <p style={styles.copy}>{item.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section style={{ ...styles.card, marginTop: 16 }}>
              <h2 style={styles.cardTitle}>Opportunity Visibility Guarantee</h2>
              <p style={styles.copy}>
                If an eligible paying engineer member receives no suitable opportunity alerts during a paid
                subscription month, TechSubbies adds one additional month to their subscription at no extra cost.
              </p>

              <div style={styles.status}>
                <p style={styles.statusValue}>{guaranteeAssessment.title}</p>
                <p style={styles.copy}>{guaranteeAssessment.summary}</p>
                <ul style={styles.list}>
                  {guaranteeAssessment.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section style={{ ...styles.card, marginTop: 16 }}>
              <h2 style={styles.cardTitle}>What the app logs</h2>
              <ul style={styles.list}>
                <li>Opportunity created and sent</li>
                <li>Why the contractor matched</li>
                <li>Profile, location and availability status at the time</li>
                <li>Viewed, accepted, declined, ignored or expired status</li>
                <li>Customer and contractor messages inside the platform</li>
                <li>Whether the opportunity counted toward the guarantee</li>
              </ul>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}

export { HowItWorksFaqPage };
export default HowItWorksFaqPage;
