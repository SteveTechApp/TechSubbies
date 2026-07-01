import React, { useMemo, useState } from "react";
import { sampleCandidateProfiles, sampleOpportunityRequirements } from "../data/sampleOpportunityMatching";
import { getOutcomeLabel, rankCandidatesForOpportunity } from "../services/opportunityMatchEngine";

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f8fafc 0%, #eef6ff 48%, #f8fafc 100%)",
  color: "#0f172a",
  padding: 24,
  fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
};

const shellStyle: React.CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto"
};

const topBarStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "center",
  marginBottom: 18
};

const backStyle: React.CSSProperties = {
  color: "#0f172a",
  textDecoration: "none",
  border: "1px solid rgba(15,23,42,0.14)",
  borderRadius: 999,
  padding: "9px 13px",
  fontWeight: 900,
  background: "rgba(255,255,255,0.82)"
};

const eyebrowStyle: React.CSSProperties = {
  color: "#0284c7",
  fontSize: 12,
  fontWeight: 950,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  margin: "0 0 8px"
};

const titleStyle: React.CSSProperties = {
  fontSize: 40,
  lineHeight: 1.05,
  margin: "0 0 10px",
  letterSpacing: "-0.045em"
};

const introStyle: React.CSSProperties = {
  color: "#475569",
  fontSize: 15,
  lineHeight: 1.6,
  maxWidth: 880,
  margin: 0
};

const layoutStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "360px minmax(0, 1fr)",
  gap: 16,
  alignItems: "start"
};

const panelStyle: React.CSSProperties = {
  border: "1px solid rgba(15,23,42,0.1)",
  background: "rgba(255,255,255,0.92)",
  borderRadius: 22,
  padding: 16,
  boxShadow: "0 18px 50px rgba(15,23,42,0.08)"
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  border: "1px solid rgba(15,23,42,0.1)",
  background: "#ffffff",
  borderRadius: 16,
  padding: 12,
  marginBottom: 8,
  cursor: "pointer",
  color: "#0f172a"
};

const activeButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  border: "1px solid rgba(37,99,235,0.45)",
  background: "#eff6ff"
};

const resultGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
  marginTop: 14
};

const resultCardStyle: React.CSSProperties = {
  border: "1px solid rgba(15,23,42,0.1)",
  borderRadius: 18,
  background: "#ffffff",
  padding: 14
};

const metricRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 8,
  marginTop: 10
};

const metricStyle: React.CSSProperties = {
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 14,
  padding: 10,
  background: "#f8fafc"
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: 999,
  padding: "6px 9px",
  fontSize: 12,
  fontWeight: 950,
  color: "#ffffff",
  background: "#2563eb"
};

function outcomeStyle(outcome: string): React.CSSProperties {
  if (outcome === "GOOD MATCH") {
    return { ...badgeStyle, background: "#16a34a" };
  }

  if (outcome === "PARTIAL MATCH") {
    return { ...badgeStyle, background: "#d97706" };
  }

  return { ...badgeStyle, background: "#dc2626" };
}

function OpportunityMatchingDemoPage() {
  const [selectedId, setSelectedId] = useState(sampleOpportunityRequirements[0]?.id ?? "");
  const selectedOpportunity =
    sampleOpportunityRequirements.find((opportunity) => opportunity.id === selectedId) ??
    sampleOpportunityRequirements[0];

  const rankedResults = useMemo(() => {
    return rankCandidatesForOpportunity(selectedOpportunity, sampleCandidateProfiles);
  }, [selectedOpportunity]);

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <div style={topBarStyle}>
          <div>
            <p style={eyebrowStyle}>Matching Engine V1</p>
            <h1 style={titleStyle}>Opportunity-to-skills matching</h1>
            <p style={introStyle}>
              This upgrade scores real skill requirements against candidate role skills and product knowledge tags.
              It gives users a clear GOOD MATCH, PARTIAL MATCH or NO MATCH result with reasons, risks and next questions.
            </p>
          </div>

          <a href="/watch-demo" style={backStyle}>
            Back to demo mode
          </a>
        </div>

        <section style={layoutStyle}>
          <aside style={panelStyle}>
            <p style={eyebrowStyle}>Sample opportunities</p>
            {sampleOpportunityRequirements.map((opportunity) => (
              <button
                key={opportunity.id}
                type="button"
                style={opportunity.id === selectedOpportunity.id ? activeButtonStyle : buttonStyle}
                onClick={() => setSelectedId(opportunity.id)}
              >
                <strong>{opportunity.title}</strong>
                <p style={{ color: "#64748b", margin: "6px 0 0", lineHeight: 1.45 }}>{opportunity.summary}</p>
              </button>
            ))}
          </aside>

          <article style={panelStyle}>
            <p style={eyebrowStyle}>{selectedOpportunity.market} · {selectedOpportunity.locationMode}</p>
            <h2 style={{ fontSize: 28, margin: "0 0 8px" }}>{selectedOpportunity.title}</h2>
            <p style={introStyle}>{selectedOpportunity.summary}</p>

            <div style={resultGridStyle}>
              {rankedResults.map((result) => {
                const candidate = sampleCandidateProfiles.find((profile) => profile.id === result.candidateId);

                return (
                  <section key={result.candidateId} style={resultCardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                      <div>
                        <h3 style={{ margin: 0 }}>{candidate?.displayName ?? result.candidateId}</h3>
                        <p style={{ color: "#64748b", margin: "5px 0 0", fontSize: 13 }}>
                          {candidate?.roleTitles.join(" · ")}
                        </p>
                      </div>
                      <span style={outcomeStyle(result.outcome)}>{getOutcomeLabel(result.outcome)}</span>
                    </div>

                    <div style={metricRowStyle}>
                      <div style={metricStyle}><strong>{result.score}%</strong><br /><span>Overall</span></div>
                      <div style={metricStyle}><strong>{result.mustHaveScore}%</strong><br /><span>Must-have</span></div>
                      <div style={metricStyle}><strong>{result.productScore}%</strong><br /><span>Product</span></div>
                      <div style={metricStyle}><strong>{result.roleFitScore}%</strong><br /><span>Role fit</span></div>
                    </div>

                    <h4>Reasons</h4>
                    <ul>
                      {result.reasons.map((reason) => <li key={reason}>{reason}</li>)}
                    </ul>

                    <h4>Risks / gaps</h4>
                    <ul>
                      {result.risks.map((risk) => <li key={risk}>{risk}</li>)}
                    </ul>

                    <h4>Next questions</h4>
                    <ul>
                      {result.nextQuestions.map((question) => <li key={question}>{question}</li>)}
                    </ul>
                  </section>
                );
              })}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

export { OpportunityMatchingDemoPage };
export default OpportunityMatchingDemoPage;

