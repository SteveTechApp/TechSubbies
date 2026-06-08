import React, { useMemo, useState } from "react";
import { demoJourneys } from "../data/demoJourneys";
import type { DemoAudienceType, DemoJourney } from "../types/demoJourney";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #050b14 0%, #08111f 52%, #020617 100%)",
    color: "#ffffff",
    padding: "24px",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  shell: {
    maxWidth: "1440px",
    margin: "0 auto",
  },
  header: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "16px",
    alignItems: "start",
    marginBottom: "18px",
  },
  eyebrow: {
    color: "#67e8f9",
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    margin: "0 0 8px",
  },
  title: {
    color: "#ffffff",
    fontSize: "34px",
    lineHeight: 1.08,
    margin: "0 0 10px",
  },
  copy: {
    color: "rgba(255,255,255,0.75)",
    fontSize: "14px",
    lineHeight: 1.55,
    margin: 0,
  },
  homeLink: {
    display: "inline-flex",
    border: "1px solid rgba(103,232,249,0.42)",
    background: "rgba(8,47,73,0.72)",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: 800,
    textDecoration: "none",
  },
  customerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px",
    marginBottom: "16px",
  },
  customerButton: {
    border: "2px solid rgba(103,232,249,0.34)",
    background: "linear-gradient(180deg, rgba(15,23,42,0.96), rgba(8,31,48,0.78))",
    color: "#ffffff",
    borderRadius: "20px",
    padding: "20px",
    textAlign: "left",
    cursor: "pointer",
    minHeight: "158px",
    boxShadow: "0 16px 42px rgba(0,0,0,0.24)",
    transition: "transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
  },
  customerButtonActive: {
    border: "3px solid #67e8f9",
    background: "linear-gradient(180deg, rgba(8,80,106,0.96), rgba(8,47,73,0.94))",
    color: "#ffffff",
    borderRadius: "20px",
    padding: "19px",
    textAlign: "left",
    cursor: "pointer",
    minHeight: "158px",
    boxShadow: "0 0 0 5px rgba(103,232,249,0.16), 0 22px 58px rgba(6,182,212,0.24)",
    transform: "translateY(-2px)",
  },
  customerTitle: {
    color: "#67e8f9",
    fontSize: "17px",
    fontWeight: 900,
    margin: "0 0 10px",
  },
  customerCta: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    border: "1px solid rgba(187,247,208,0.42)",
    background: "rgba(22,101,52,0.66)",
    color: "#ffffff",
    padding: "7px 10px",
    fontSize: "12px",
    fontWeight: 900,
    marginTop: "14px",
    boxShadow: "0 10px 26px rgba(34,197,94,0.14)",
  },
  customerCtaActive: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    border: "1px solid rgba(187,247,208,0.74)",
    background: "rgba(22,163,74,0.92)",
    color: "#ffffff",
    padding: "7px 10px",
    fontSize: "12px",
    fontWeight: 900,
    marginTop: "14px",
    boxShadow: "0 10px 26px rgba(34,197,94,0.24)",
  },
  selectedBar: {
    border: "1px solid rgba(103,232,249,0.28)",
    background: "rgba(8,47,73,0.52)",
    borderRadius: "18px",
    padding: "14px 16px",
    marginBottom: "16px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "14px",
    alignItems: "center",
  },
  selectedTitle: {
    color: "#ffffff",
    fontSize: "19px",
    fontWeight: 900,
    margin: "0 0 4px",
  },
  progressPill: {
    color: "#67e8f9",
    border: "1px solid rgba(103,232,249,0.38)",
    borderRadius: "999px",
    padding: "8px 11px",
    fontSize: "12px",
    fontWeight: 900,
    whiteSpace: "nowrap",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.25fr) minmax(360px, 0.75fr)",
    gap: "14px",
    alignItems: "start",
  },
  card: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.78)",
    borderRadius: "22px",
    padding: "18px",
    boxShadow: "0 18px 60px rgba(0,0,0,0.24)",
  },
  demoFrame: {
    border: "1px solid rgba(103,232,249,0.24)",
    background: "rgba(2,6,23,0.54)",
    borderRadius: "20px",
    overflow: "hidden",
  },
  fakeBrowser: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gap: "10px",
    alignItems: "center",
    borderBottom: "1px solid rgba(148,163,184,0.16)",
    padding: "12px 14px",
    background: "rgba(2,6,23,0.78)",
  },
  dotRow: {
    display: "flex",
    gap: "6px",
  },
  dot: {
    width: "9px",
    height: "9px",
    borderRadius: "999px",
    background: "#67e8f9",
  },
  routeText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "12px",
  },
  status: {
    color: "#67e8f9",
    border: "1px solid rgba(103,232,249,0.34)",
    borderRadius: "999px",
    padding: "7px 10px",
    fontSize: "12px",
    fontWeight: 900,
    textTransform: "capitalize",
  },
  demoBody: {
    padding: "18px",
  },
  pageName: {
    color: "#67e8f9",
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    margin: "0 0 6px",
  },
  stepTitle: {
    color: "#ffffff",
    fontSize: "28px",
    lineHeight: 1.1,
    margin: "0 0 12px",
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "10px",
    margin: "14px 0",
  },
  metric: {
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(15,23,42,0.78)",
    borderRadius: "15px",
    padding: "12px",
  },
  metricLabel: {
    color: "rgba(255,255,255,0.58)",
    fontSize: "11px",
    margin: "0 0 5px",
  },
  metricValue: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: 900,
    margin: "0 0 3px",
  },
  metricDetail: {
    color: "rgba(255,255,255,0.62)",
    fontSize: "11px",
    margin: 0,
  },
  panelGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  panel: {
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(15,23,42,0.74)",
    borderRadius: "16px",
    padding: "14px",
  },
  panelTitle: {
    color: "#67e8f9",
    fontSize: "13px",
    fontWeight: 900,
    margin: "0 0 10px",
  },
  line: {
    color: "rgba(255,255,255,0.78)",
    fontSize: "13px",
    lineHeight: 1.45,
    margin: "0 0 8px",
    display: "flex",
    gap: "8px",
  },
  bullet: {
    width: "8px",
    height: "8px",
    borderRadius: "999px",
    background: "#67e8f9",
    flex: "0 0 auto",
    marginTop: "6px",
  },
  sideTitle: {
    color: "#67e8f9",
    fontSize: "13px",
    fontWeight: 900,
    margin: "0 0 8px",
  },
  sideHeading: {
    color: "#ffffff",
    fontSize: "21px",
    lineHeight: 1.18,
    margin: "0 0 8px",
  },
  infoBlock: {
    border: "1px solid rgba(148,163,184,0.15)",
    background: "rgba(2,6,23,0.42)",
    borderRadius: "15px",
    padding: "13px",
    marginTop: "10px",
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "14px",
  },
  controlButton: {
    border: "1px solid rgba(103,232,249,0.42)",
    background: "rgba(8,47,73,0.78)",
    color: "#ffffff",
    borderRadius: "14px",
    padding: "12px",
    cursor: "pointer",
    fontWeight: 900,
  },
  stepList: {
    display: "grid",
    gap: "8px",
    marginTop: "10px",
  },
  stepButton: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(2,6,23,0.42)",
    color: "#ffffff",
    borderRadius: "14px",
    padding: "10px",
    cursor: "pointer",
    textAlign: "left",
  },
  stepButtonActive: {
    border: "2px solid #67e8f9",
    background: "rgba(8,47,73,0.75)",
    color: "#ffffff",
    borderRadius: "14px",
    padding: "9px",
    cursor: "pointer",
    textAlign: "left",
  },
  stepButtonTitle: {
    display: "block",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 900,
    marginBottom: "3px",
  },
  stepButtonText: {
    display: "block",
    color: "rgba(255,255,255,0.62)",
    fontSize: "11px",
    lineHeight: 1.35,
  },
};

function getInitialJourneyId(): DemoAudienceType {
  if (typeof window === "undefined") {
    return "engineer";
  }

  const hash = window.location.hash.replace("#", "");

  if (hash === "hiring_company" || hash === "resourcing_company" || hash === "engineer") {
    return hash;
  }

  return "engineer";
}

function getJourneyById(id: DemoAudienceType): DemoJourney {
  const found = demoJourneys.find((journey) => journey.id === id);

  if (found) {
    return found;
  }

  return demoJourneys[0];
}

function WatchDemoPage() {
  const [selectedJourneyId, setSelectedJourneyId] = useState<DemoAudienceType>(getInitialJourneyId());
  const [stepIndex, setStepIndex] = useState(0);

  const selectedJourney = useMemo(() => getJourneyById(selectedJourneyId), [selectedJourneyId]);
  const selectedStep = selectedJourney.steps[Math.max(0, Math.min(stepIndex, selectedJourney.steps.length - 1))];

  function selectJourney(id: DemoAudienceType) {
    setSelectedJourneyId(id);
    setStepIndex(0);

    if (typeof window !== "undefined") {
      window.location.hash = id;
    }
  }

  function goPrevious() {
    setStepIndex((current) => {
      if (current <= 0) {
        return selectedJourney.steps.length - 1;
      }

      return current - 1;
    });
  }

  function goNext() {
    setStepIndex((current) => {
      if (current >= selectedJourney.steps.length - 1) {
        return 0;
      }

      return current + 1;
    });
  }

  return (
    <main style={styles.page}>
        <style>
          {`
            @keyframes techsubbiesNextStepPulse {
              0% {
                box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.42), 0 14px 34px rgba(34, 197, 94, 0.16);
              }
              50% {
                box-shadow: 0 0 0 7px rgba(34, 197, 94, 0.10), 0 18px 42px rgba(34, 197, 94, 0.26);
              }
              100% {
                box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.42), 0 14px 34px rgba(34, 197, 94, 0.16);
              }
            }

            @keyframes techsubbiesNextStepSweep {
              0% {
                background-position: 0% 0%;
              }
              25% {
                background-position: 100% 0%;
              }
              50% {
                background-position: 100% 100%;
              }
              75% {
                background-position: 0% 100%;
              }
              100% {
                background-position: 0% 0%;
              }
            }

            .techsubbies-next-step-highlight {
              position: relative !important;
              isolation: isolate;
              overflow: visible !important;
              border-color: rgba(34, 197, 94, 0.92) !important;
              background: rgba(20, 83, 45, 0.90) !important;
              animation: techsubbiesNextStepPulse 1.35s ease-in-out infinite;
            }

            .techsubbies-next-step-highlight::after {
              content: "";
              position: absolute;
              inset: -5px;
              border-radius: 18px;
              padding: 2px;
              background:
                radial-gradient(circle 13px at var(--sweep-x, 0%) var(--sweep-y, 0%), rgba(187, 247, 208, 1), rgba(34, 197, 94, 0.95) 38%, rgba(34, 197, 94, 0.15) 58%, transparent 70%),
                linear-gradient(90deg, rgba(34, 197, 94, 0.18), rgba(187, 247, 208, 0.98), rgba(34, 197, 94, 0.18));
              background-size: 220% 220%, 220% 220%;
              background-position: 0% 0%, 0% 0%;
              pointer-events: none;
              z-index: -1;
              animation: techsubbiesNextStepSweep 1.15s linear infinite;
              -webkit-mask:
                linear-gradient(#000 0 0) content-box,
                linear-gradient(#000 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
            }
.techsubbies-next-step-highlight::before {
              content: "";
              position: absolute;
              inset: -12px;
              border-radius: 24px;
              border: 1px solid rgba(34, 197, 94, 0.18);
              pointer-events: none;
              z-index: -2;
            }
          `}
        </style>
      <div style={styles.shell}>
        <header style={styles.header}>
          <section>
            <p style={styles.eyebrow}>Watch a demo</p>
            <h1 style={styles.title}>Choose a customer type and step through the TechSubbies process.</h1>
            <p style={styles.copy}>
              Select one of the three demo options below. The selected journey updates immediately and shows
              the process, platform response and expected result.
            </p>
          </section>

          <a style={styles.homeLink} href="/">
            Back to landing page
          </a>
        </header>

        <section style={styles.customerGrid}>
          {demoJourneys.map((journey) => {
            const active = journey.id === selectedJourneyId;
            const style = active ? styles.customerButtonActive : styles.customerButton;

            return (
              <button
                key={journey.id}
                type="button"
                style={style}
                onClick={() => selectJourney(journey.id)}
              >
                <p style={styles.customerTitle}>{journey.label}</p>
                <p style={styles.copy}>{journey.summary}</p>
                <span style={active ? styles.customerCtaActive : styles.customerCta}>
                  {active ? "Selected demo" : "Choose this demo"}
                </span>
              </button>
            );
          })}
        </section>

        <section style={styles.selectedBar}>
          <div>
            <p style={styles.selectedTitle}>Selected demo: {selectedJourney.label}</p>
            <p style={styles.copy}>{selectedJourney.primaryOutcome}</p>
          </div>
          <span style={styles.progressPill}>
            Step {stepIndex + 1} of {selectedJourney.steps.length}
          </span>
        </section>

        <section style={styles.mainGrid}>
          <article style={styles.card}>
            <div style={styles.demoFrame}>
              <div style={styles.fakeBrowser}>
                <div style={styles.dotRow}>
                  <span style={styles.dot} />
                  <span style={styles.dot} />
                  <span style={styles.dot} />
                </div>
                <div style={styles.routeText}>/watch-demo#{selectedJourney.id}</div>
                <div style={styles.status}>{selectedStep.status}</div>
              </div>

              <div style={styles.demoBody}>
                <p style={styles.pageName}>{selectedStep.pageName}</p>
                <h2 style={styles.stepTitle}>{selectedStep.povTitle}</h2>
                <p style={styles.copy}>{selectedStep.description}</p>

                <section style={styles.metricGrid}>
                  {selectedStep.metrics.map((metric) => (
                    <article key={metric.label} style={styles.metric}>
                      <p style={styles.metricLabel}>{metric.label}</p>
                      <p style={styles.metricValue}>{metric.value}</p>
                      <p style={styles.metricDetail}>{metric.detail}</p>
                    </article>
                  ))}
                </section>

                <section style={styles.panelGrid}>
                  {selectedStep.mockPanels.map((panel) => (
                    <article key={panel.title} style={styles.panel}>
                      <h3 style={styles.panelTitle}>{panel.title}</h3>
                      {panel.lines.map((line) => (
                        <p key={line} style={styles.line}>
                          <span style={styles.bullet} />
                          <span>{line}</span>
                        </p>
                      ))}
                    </article>
                  ))}
                </section>
              </div>
            </div>
          </article>

          <aside>
            <section style={styles.card}>
              <p style={styles.sideTitle}>What the user does</p>
              <h2 style={styles.sideHeading}>{selectedStep.userAction}</h2>

              <div style={styles.infoBlock}>
                <p style={styles.sideTitle}>What TechSubbies does</p>
                <p style={styles.copy}>{selectedStep.platformResponse}</p>
              </div>

              <div style={styles.infoBlock}>
                <p style={styles.sideTitle}>Expected result</p>
                <p style={styles.copy}>{selectedStep.expectedResult}</p>
              </div>

              <div style={styles.controls}>
                <button type="button" style={styles.controlButton} onClick={goPrevious}>
                  Previous step
                </button>
                <button
                  type="button"
                  className="techsubbies-next-step-highlight"
                  style={styles.controlButton}
                  onClick={goNext}
                >
                  Next step
                </button>
              </div>
            </section>

            <section style={{ ...styles.card, marginTop: "14px" }}>
              <p style={styles.sideTitle}>Demo steps</p>
              <div style={styles.stepList}>
                {selectedJourney.steps.map((step, index) => {
                  const active = index === stepIndex;
                  const style = active ? styles.stepButtonActive : styles.stepButton;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      style={style}
                      onClick={() => setStepIndex(index)}
                    >
                      <span style={styles.stepButtonTitle}>{index + 1}. {step.pageName}</span>
                      <span style={styles.stepButtonText}>{step.expectedResult}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

export { WatchDemoPage };
export default WatchDemoPage;