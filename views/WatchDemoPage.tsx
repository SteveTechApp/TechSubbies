import React, { useEffect, useMemo, useState } from "react";
import { demoJourneys } from "../data/demoJourneys";
import type { DemoAudienceType, DemoJourney } from "../types/demoJourney";

const STEP_DURATION_MS = 7800;

const journeyOrder: DemoAudienceType[] = [
  "engineer",
  "resourcing_company",
  "hiring_company",
];

const userTypeCopy: Record<
  DemoAudienceType,
  {
    label: string;
    shortLabel: string;
    description: string;
    role: string;
    outcome: string;
  }
> = {
  engineer: {
    label: "Engineer Demo",
    shortLabel: "Individual subcontractor",
    description:
      "An individual AV, IT or hybrid engineer creates a verified profile, adds skills, documents and availability, then receives better-fit project opportunities.",
    role: "Supply side: one person offering technical capability.",
    outcome: "A searchable, verified subcontractor profile ready for matching.",
  },
  hiring_company: {
    label: "Client Demo",
    shortLabel: "Companies looking for technical resources",
    description:
      "A company posts a project, defines the technical requirement and reviews matched subcontractors by skills, location, dates and compliance.",
    role: "Demand side: businesses looking for technical resource.",
    outcome: "A clear shortlist of available, relevant subcontractors.",
  },
  resourcing_company: {
    label: "Resourcing Company Demo",
    shortLabel: "Companies managing multiple engineers",
    description:
      "A resourcing company manages multiple subcontracting engineers, including compliance, availability, groups and opportunity matching.",
    role: "Supply management: companies managing multiple engineers.",
    outcome: "A managed engineer pool with compliance, availability and opportunity visibility.",
  },
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #050b14 0%, #08111f 52%, #020617 100%)",
    color: "#ffffff",
    padding: 16,
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  shell: {
    width: "100%",
    maxWidth: "none",
    margin: "0",
  },
  focusshell: {
    width: "100%",
    maxWidth: "none",
    margin: "0",
  },
  header: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 16,
    alignItems: "start",
    marginBottom: 18,
  },
  eyebrow: {
    color: "#67e8f9",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    margin: "0 0 8px",
  },
  title: {
    color: "#ffffff",
    fontSize: 38,
    lineHeight: 1.08,
    margin: "0 0 10px",
    maxWidth: 980,
  },
  copy: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 1.55,
    margin: 0,
  },
  homeLink: {
    display: "inline-flex",
    border: "1px solid rgba(103,232,249,0.42)",
    background: "rgba(8,47,73,0.72)",
    color: "#ffffff",
    borderRadius: 999,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 800,
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  userTypeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginBottom: 16,
  },
  userTypeCard: {
    border: "1px solid rgba(148,163,184,0.2)",
    background: "linear-gradient(180deg, rgba(15,23,42,0.94), rgba(8,31,48,0.72))",
    color: "#ffffff",
    borderRadius: 20,
    padding: 18,
    textAlign: "left",
    cursor: "pointer",
    minHeight: 210,
    boxShadow: "0 16px 42px rgba(0,0,0,0.24)",
  },
  userTypeCardActive: {
    border: "2px solid #67e8f9",
    background: "linear-gradient(180deg, rgba(8,80,106,0.96), rgba(8,47,73,0.94))",
    color: "#ffffff",
    borderRadius: 20,
    padding: 17,
    textAlign: "left",
    cursor: "pointer",
    minHeight: 210,
    boxShadow: "0 0 0 5px rgba(103,232,249,0.16), 0 22px 58px rgba(6,182,212,0.24)",
    transform: "translateY(-2px)",
  },
  userTypeTitle: {
    color: "#67e8f9",
    fontSize: 18,
    fontWeight: 900,
    margin: "0 0 4px",
  },
  userTypeSubtitle: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 800,
    margin: "0 0 10px",
  },
  smallInfo: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 12,
    lineHeight: 1.45,
    margin: "10px 0 0",
  },
  selectedBar: {
    border: "1px solid rgba(103,232,249,0.28)",
    background: "rgba(8,47,73,0.52)",
    borderRadius: 18,
    padding: "14px 16px",
    marginBottom: 16,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 14,
    alignItems: "center",
  },
  selectedTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: 900,
    margin: "0 0 4px",
  },
  progressPill: {
    color: "#67e8f9",
    border: "1px solid rgba(103,232,249,0.38)",
    borderRadius: 999,
    padding: "8px 11px",
    fontSize: 12,
    fontWeight: 900,
    whiteSpace: "nowrap",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.25fr) minmax(360px, 0.75fr)",
    gap: 14,
    alignItems: "start",
  },
  card: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.78)",
    borderRadius: 22,
    padding: 18,
    boxShadow: "0 18px 60px rgba(0,0,0,0.24)",
  },
  focusHeader: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 12,
    alignItems: "center",
    border: "1px solid rgba(103,232,249,0.24)",
    background: "rgba(2,6,23,0.78)",
    borderRadius: 18,
    padding: "12px 14px",
    marginBottom: 14,
    boxShadow: "0 16px 46px rgba(0,0,0,0.26)",
  },
  focusDemoCard: {
    border: "1px solid rgba(103,232,249,0.30)",
    background: "rgba(15,23,42,0.82)",
    borderRadius: 24,
    padding: 16,
    boxShadow: "0 26px 90px rgba(0,0,0,0.38)",
  },
  demoFrame: {
    border: "1px solid rgba(103,232,249,0.24)",
    background: "rgba(2,6,23,0.54)",
    borderRadius: 20,
    overflow: "hidden",
  },
  focusDemoFrame: {
    border: "1px solid rgba(103,232,249,0.30)",
    background: "rgba(2,6,23,0.70)",
    borderRadius: 22,
    overflow: "hidden",
    minHeight: "calc(100vh - 220px)",
  },
  fakeBrowser: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gap: 10,
    alignItems: "center",
    borderBottom: "1px solid rgba(148,163,184,0.16)",
    padding: "12px 14px",
    background: "rgba(2,6,23,0.78)",
  },
  dotRow: {
    display: "flex",
    gap: 6,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    background: "#67e8f9",
  },
  routeText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  status: {
    color: "#67e8f9",
    border: "1px solid rgba(103,232,249,0.34)",
    borderRadius: 999,
    padding: "7px 10px",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "capitalize",
  },
  demoBody: {
    padding: 18,
  },
  focusDemoBody: {
    padding: 25,
  },
  pageName: {
    color: "#67e8f9",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    margin: "0 0 6px",
  },
  stepTitle: {
    color: "#ffffff",
    fontSize: 30,
    lineHeight: 1.1,
    margin: "0 0 12px",
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 10,
    margin: "14px 0",
  },
  metric: {
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(15,23,42,0.78)",
    borderRadius: 15,
    padding: 12,
  },
  metricLabel: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 11,
    margin: "0 0 5px",
  },
  metricValue: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: 900,
    margin: "0 0 3px",
  },
  metricDetail: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 11,
    margin: 0,
  },
  panelGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  panel: {
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(15,23,42,0.74)",
    borderRadius: 16,
    padding: 14,
  },
  panelTitle: {
    color: "#67e8f9",
    fontSize: 13,
    fontWeight: 900,
    margin: "0 0 10px",
  },
  line: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    lineHeight: 1.45,
    margin: "0 0 8px",
    display: "flex",
    gap: 8,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "#67e8f9",
    flex: "0 0 auto",
    marginTop: 6,
  },
  sideTitle: {
    color: "#67e8f9",
    fontSize: 13,
    fontWeight: 900,
    margin: "0 0 8px",
  },
  sideHeading: {
    color: "#ffffff",
    fontSize: 21,
    lineHeight: 1.18,
    margin: "0 0 8px",
  },
  infoBlock: {
    border: "1px solid rgba(148,163,184,0.15)",
    background: "rgba(2,6,23,0.42)",
    borderRadius: 15,
    padding: 13,
    marginTop: 10,
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 10,
    marginTop: 14,
  },
  controlButton: {
    border: "1px solid rgba(103,232,249,0.42)",
    background: "rgba(8,47,73,0.78)",
    color: "#ffffff",
    borderRadius: 14,
    padding: 12,
    cursor: "pointer",
    fontWeight: 900,
  },
  playButton: {
    border: "1px solid rgba(187,247,208,0.62)",
    background: "rgba(22,101,52,0.82)",
    color: "#ffffff",
    borderRadius: 14,
    padding: 12,
    cursor: "pointer",
    fontWeight: 900,
  },
  stepList: {
    display: "grid",
    gap: 8,
    marginTop: 10,
  },
  stepButton: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(2,6,23,0.42)",
    color: "#ffffff",
    borderRadius: 14,
    padding: 10,
    cursor: "pointer",
    textAlign: "left",
  },
  stepButtonActive: {
    border: "2px solid #67e8f9",
    background: "rgba(8,47,73,0.75)",
    color: "#ffffff",
    borderRadius: 14,
    padding: 9,
    cursor: "pointer",
    textAlign: "left",
  },
  stepButtonTitle: {
    display: "block",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 900,
    marginBottom: 3,
  },
  stepButtonText: {
    display: "block",
    color: "rgba(255,255,255,0.62)",
    fontSize: 11,
    lineHeight: 1.35,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    background: "rgba(148,163,184,0.18)",
    overflow: "hidden",
    marginTop: 14,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #22c55e, #67e8f9)",
    transition: "width 300ms ease",
  },
  autoProgressTrack: {
    height: 5,
    borderRadius: 999,
    background: "rgba(148,163,184,0.18)",
    overflow: "hidden",
    marginTop: 12,
  },
  autoProgressFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, rgba(34,197,94,0.95), rgba(103,232,249,0.95))",
    transformOrigin: "left center",
  },
  focusFooter: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gap: 12,
    alignItems: "center",
    marginTop: 14,
  },
};

function getInitialJourneyId(): DemoAudienceType {
  if (typeof window === "undefined") {
    return "engineer";
  }

  const hash = window.location.hash.replace("#", "");

  if (hash === "engineer" || hash === "hiring_company" || hash === "resourcing_company") {
    return hash;
  }

  return "engineer";
}

function getJourneyById(id: DemoAudienceType): DemoJourney {
  return demoJourneys.find((journey) => journey.id === id) || demoJourneys[0];
}

function WatchDemoPage() {
  const [selectedJourneyId, setSelectedJourneyId] = useState<DemoAudienceType>(getInitialJourneyId());
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const selectedJourney = useMemo(() => getJourneyById(selectedJourneyId), [selectedJourneyId]);
  const selectedCopy = userTypeCopy[selectedJourneyId];
  const selectedStep = selectedJourney.steps[stepIndex] || selectedJourney.steps[0];
  const walkthroughProgress = Math.round(((stepIndex + 1) / selectedJourney.steps.length) * 100);

  function selectJourney(id: DemoAudienceType) {
    setSelectedJourneyId(id);
    setStepIndex(0);
    setIsPlaying(false);

    if (typeof window !== "undefined") {
      window.location.hash = id;
    }
  }

  function goPrevious(manual = true) {
    if (manual) {
      setIsPlaying(false);
    }

    setStepIndex((current) => {
      if (current <= 0) {
        return selectedJourney.steps.length - 1;
      }

      return current - 1;
    });
  }

  function goNext(manual = true) {
    if (manual) {
      setIsPlaying(false);
    }

    setStepIndex((current) => {
      if (current >= selectedJourney.steps.length - 1) {
        return 0;
      }

      return current + 1;
    });
  }

  function restartDemo() {
    setStepIndex(0);
    setIsPlaying(true);

    if (typeof window !== "undefined") {
      window.location.hash = selectedJourneyId;
    }
  }

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setTimeout(() => {
      goNext(false);
    }, STEP_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [isPlaying, selectedJourneyId, stepIndex]);

  return (
    <main style={styles.page}>
      <style>
        {`
          @keyframes techsubbiesDemoEnter {
            0% {
              opacity: 0;
              transform: translateY(10px) scale(0.99);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes techsubbiesAutoProgress {
            from {
              transform: scaleX(0);
            }

            to {
              transform: scaleX(1);
            }
          }

          @keyframes techsubbiesCardGlow {
            0%, 100% {
              box-shadow: 0 0 0 5px rgba(103,232,249,0.14), 0 22px 58px rgba(6,182,212,0.18);
            }

            50% {
              box-shadow: 0 0 0 8px rgba(103,232,249,0.22), 0 26px 68px rgba(6,182,212,0.28);
            }
          }

          .techsubbies-demo-scene {
            animation: techsubbiesDemoEnter 420ms ease both;
          }

          .techsubbies-user-type-active {
            animation: techsubbiesCardGlow 1.8s ease-in-out infinite;
          }

          .techsubbies-auto-progress {
            animation-name: techsubbiesAutoProgress;
            animation-timing-function: linear;
            animation-fill-mode: both;
          }

          @media (max-width: 980px) {
            .techsubbies-watch-demo-user-grid,
            .techsubbies-watch-demo-main-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      {isPlaying ? (
        <div style={styles.focusShell}>
          <section style={styles.focusHeader}>
            <div>
              <p style={styles.selectedTitle}>
                {selectedCopy.label}: {selectedStep.pageName}
              </p>
              <p style={styles.copy}>
                Demo walkthrough · Step {stepIndex + 1} of {selectedJourney.steps.length} · {selectedCopy.shortLabel}
              </p>
            </div>

            <button
              type="button"
              style={styles.playButton}
              onClick={() => setIsPlaying(false)}
            >
              Pause and show details
            </button>
          </section>

          <article style={styles.focusDemoCard}>
            <div style={styles.focusDemoFrame}>
              <div style={styles.fakeBrowser}>
                <div style={styles.dotRow}>
                  <span style={styles.dot} />
                  <span style={styles.dot} />
                  <span style={styles.dot} />
                </div>
                <div style={styles.routeText}>/watch-demo#{selectedJourney.id}</div>
                <div style={styles.status}>{selectedStep.status}</div>
              </div>

              <div
                key={selectedStep.id}
                className="techsubbies-demo-scene"
                style={styles.focusDemoBody}
              >
                <p style={styles.pageName}>{selectedStep.pageName}</p>
                <h2 style={styles.stepTitle}>{selectedStep.povTitle}</h2>
                <p style={styles.copy}>{selectedStep.description}</p>

                <div style={styles.autoProgressTrack}>
                  <div
                    key={`${selectedStep.id}-focus-progress`}
                    className="techsubbies-auto-progress"
                    style={{
                      ...styles.autoProgressFill,
                      animationDuration: `${STEP_DURATION_MS}ms`,
                    }}
                  />
                </div>

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

            <footer style={styles.focusFooter}>
              <button
                type="button"
                style={styles.controlButton}
                onClick={() => goPrevious(false)}
              >
                Previous step
              </button>

              <div>
                <p style={styles.copy}>{selectedStep.userAction}</p>
                <div style={styles.progressTrack}>
                  <div style={{ ...styles.progressFill, width: `${walkthroughProgress}%` }} />
                </div>
              </div>

              <button
                type="button"
                style={styles.controlButton}
                onClick={() => goNext(false)}
              >
                Skip step
              </button>
            </footer>
          </article>
        </div>
      ) : (
        <div style={styles.shell}>
          <header style={styles.header}>
            <section>
              <p style={styles.eyebrow}>Watch demo</p>
              <h1 style={styles.title}>Choose a TechSubbies demo.</h1>
              <p style={styles.copy}>
                Choose Engineer Demo, Resourcing Company Demo or Client Demo. Press play to watch that specific workflow in focus mode.
              </p>
            </section>

            <a style={styles.homeLink} href="/">
              Back to landing page
            </a>
          </header>

          <section className="techsubbies-watch-demo-user-grid" style={styles.userTypeGrid}>
            {journeyOrder.map((journeyId) => {
              const active = journeyId === selectedJourneyId;
              const copy = userTypeCopy[journeyId];
              const journey = getJourneyById(journeyId);

              return (
                <button
                  key={journeyId}
                  type="button"
                  className={active ? "techsubbies-user-type-active" : undefined}
                  style={active ? styles.userTypeCardActive : styles.userTypeCard}
                  onClick={() => selectJourney(journeyId)}
                >
                  <p style={styles.userTypeTitle}>{copy.label}</p>
                  <p style={styles.userTypeSubtitle}>{copy.shortLabel}</p>
                  <p style={styles.copy}>{copy.description}</p>
                  <p style={styles.smallInfo}>{copy.role}</p>
                  <p style={styles.smallInfo}>{journey.steps.length} screen walkthrough</p>
                </button>
              );
            })}
          </section>

          <section style={styles.selectedBar}>
            <div>
              <p style={styles.selectedTitle}>
                {selectedCopy.label}: {selectedCopy.shortLabel}
              </p>
              <p style={styles.copy}>{selectedCopy.outcome}</p>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `${walkthroughProgress}%` }} />
              </div>
            </div>

            <span style={styles.progressPill}>
              Paused · Step {stepIndex + 1} of {selectedJourney.steps.length}
            </span>
          </section>

          <section className="techsubbies-watch-demo-main-grid" style={styles.mainGrid}>
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

                <div
                  key={selectedStep.id}
                  className="techsubbies-demo-scene"
                  style={styles.demoBody}
                >
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
                <p style={styles.sideTitle}>Demo overview</p>
                <h2 style={styles.sideHeading}>{selectedJourney.headline}</h2>
                <p style={styles.copy}>{selectedJourney.primaryOutcome}</p>

                <div style={styles.infoBlock}>
                  <p style={styles.sideTitle}>What the user does</p>
                  <p style={styles.copy}>{selectedStep.userAction}</p>
                </div>

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
                    Previous
                  </button>
                  <button
                    type="button"
                    style={styles.playButton}
                    onClick={() => setIsPlaying(true)}
                  >
                    Play focus demo
                  </button>
                  <button type="button" style={styles.controlButton} onClick={() => goNext(true)}>
                    Next
                  </button>
                </div>

                <div style={styles.controls}>
                  <button type="button" style={styles.controlButton} onClick={restartDemo}>
                    Restart this demo
                  </button>
                </div>
              </section>

              <section style={{ ...styles.card, marginTop: 14 }}>
                <p style={styles.sideTitle}>Walkthrough sequence</p>
                <div style={styles.stepList}>
                  {selectedJourney.steps.map((step, index) => {
                    const active = index === stepIndex;

                    return (
                      <button
                        key={step.id}
                        type="button"
                        style={active ? styles.stepButtonActive : styles.stepButton}
                        onClick={() => {
                          setStepIndex(index);
                          setIsPlaying(false);
                        }}
                      >
                        <span style={styles.stepButtonTitle}>
                          {index + 1}. {step.pageName}
                        </span>
                        <span style={styles.stepButtonText}>{step.expectedResult}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </aside>
          </section>
        </div>
      )}
    </main>
  );
}

export { WatchDemoPage };
export default WatchDemoPage;







