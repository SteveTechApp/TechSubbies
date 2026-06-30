import React, { useMemo, useState } from "react";
import { FileUploadInput } from "../components/FileUploadInput";

type HubCardProps = {
  title: string;
  copy: string;
  buttonLabel: string;
  href: string;
  tone?: "default" | "priority";
};

type UploadRecord = {
  id: string;
  title: string;
  issuer?: string;
  category?: string;
  issuedDate?: string;
  expiryDate?: string;
  notes?: string;
  fileUrl?: string;
};

type EvidenceRecord = {
  id: string;
  title: string;
  customer?: string;
  projectType?: string;
  date?: string;
  outcome?: string;
  documentUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
};

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const pageStyles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617 0%, #061525 48%, #020617 100%)",
    color: "#e5edf7",
    padding: "32px 24px 80px",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  shell: {
    width: "min(1120px, calc(100vw - 48px))",
    margin: "0 auto",
  },
  backLink: {
    color: "#67e8f9",
    fontSize: "14px",
    fontWeight: 900,
    textDecoration: "none",
  },
  eyebrow: {
    color: "#67e8f9",
    fontSize: "13px",
    fontWeight: 900,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    margin: "28px 0 10px",
  },
  title: {
    color: "#ffffff",
    fontSize: "clamp(30px, 4vw, 48px)",
    lineHeight: 1.05,
    margin: "0 0 14px",
  },
  intro: {
    color: "rgba(226, 232, 240, 0.82)",
    maxWidth: "760px",
    fontSize: "15px",
    lineHeight: 1.7,
    margin: "0 0 26px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "14px",
  },
  card: {
    border: "1px solid rgba(103, 232, 249, 0.18)",
    background: "linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(8, 25, 42, 0.88))",
    borderRadius: "18px",
    padding: "18px",
    minHeight: "178px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 20px 54px rgba(0, 0, 0, 0.24)",
  },
  priorityCard: {
    border: "1px solid rgba(103, 232, 249, 0.4)",
    background: "linear-gradient(180deg, rgba(8, 47, 73, 0.96), rgba(15, 23, 42, 0.9))",
    borderRadius: "18px",
    padding: "18px",
    minHeight: "178px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 0 0 4px rgba(103, 232, 249, 0.08), 0 24px 64px rgba(6, 182, 212, 0.18)",
  },
  cardTitle: {
    color: "#67e8f9",
    fontSize: "17px",
    lineHeight: 1.25,
    margin: "0 0 10px",
    fontWeight: 900,
  },
  copy: {
    color: "rgba(226, 232, 240, 0.84)",
    fontSize: "14px",
    lineHeight: 1.58,
    margin: 0,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: "42px",
    border: "1px solid rgba(103, 232, 249, 0.34)",
    background: "rgba(8, 47, 73, 0.82)",
    color: "#ffffff",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 900,
    textDecoration: "none",
    marginTop: "18px",
  },
  panel: {
    border: "1px solid rgba(103, 232, 249, 0.22)",
    background: "rgba(15, 23, 42, 0.86)",
    borderRadius: "22px",
    padding: "22px",
    boxShadow: "0 22px 64px rgba(0, 0, 0, 0.26)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },
  label: {
    color: "#cbd5e1",
    display: "block",
    fontSize: "12px",
    fontWeight: 800,
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    border: "1px solid rgba(148, 163, 184, 0.24)",
    background: "rgba(2, 6, 23, 0.52)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "10px 12px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    minHeight: "90px",
    border: "1px solid rgba(148, 163, 184, 0.24)",
    background: "rgba(2, 6, 23, 0.52)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "10px 12px",
    outline: "none",
  },
  secondaryButton: {
    border: "1px solid rgba(103, 232, 249, 0.36)",
    background: "rgba(8, 47, 73, 0.88)",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "11px 16px",
    fontSize: "14px",
    fontWeight: 900,
    cursor: "pointer",
  },
  record: {
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(2, 6, 23, 0.44)",
    borderRadius: "16px",
    padding: "14px",
    marginTop: "14px",
  },
  small: {
    color: "rgba(226, 232, 240, 0.68)",
    fontSize: "12px",
    lineHeight: 1.5,
    margin: "8px 0 0",
  },
};

const HubCard = ({ title, copy, buttonLabel, href, tone = "default" }: HubCardProps) => (
  <article style={tone === "priority" ? pageStyles.priorityCard : pageStyles.card}>
    <div>
      <h2 style={pageStyles.cardTitle}>{title}</h2>
      <p style={pageStyles.copy}>{copy}</p>
    </div>
    <a href={href} style={pageStyles.button}>{buttonLabel}</a>
  </article>
);

const PageShell = ({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) => (
  <main style={pageStyles.page}>
    <div style={pageStyles.shell}>
      <a href="/" style={pageStyles.backLink}>Back to landing page</a>
      <p style={pageStyles.eyebrow}>{eyebrow}</p>
      <h1 style={pageStyles.title}>{title}</h1>
      <p style={pageStyles.intro}>{intro}</p>
      {children}
    </div>
  </main>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label>
    <span style={pageStyles.label}>{label}</span>
    {children}
  </label>
);

export const EngineerProfileHubPage = () => (
  <PageShell
    eyebrow="For Engineers"
    title="Engineer Profile Hub"
    intro="Keep personal identity, business details, compliance evidence, qualifications, availability and previous work proof in separate profile sections."
  >
    <section style={pageStyles.grid}>
      <HubCard
        title="Personal & Insurance Profile"
        copy="Personal details, business information, insurance documents, verification and official paperwork."
        buttonLabel="Manage profile"
        href="/engineer/personal-business-profile"
      />
      <HubCard
        title="Skills Builder"
        copy="Role-based AV/IT skills, product knowledge, certifications, self-ratings and specialist capability."
        buttonLabel="Build skills profile"
        href="/role-skills"
      />
      <HubCard
        title="Availability & Working Area"
        copy="Location, working radius, calendar availability, weekend rules, public holidays and travel preferences."
        buttonLabel="Set availability"
        href="/engineer/availability"
      />
      <HubCard
        title="Product Awareness / Experience"
        copy="Skills-based awareness of AV brands, platforms, signal technologies and product categories."
        buttonLabel="Add product awareness"
        href="/engineer/product-awareness"
      />
      <HubCard
        title="Professional Certificates & Awards"
        copy="Upload certificates, record professional qualifications, add issuer details, expiry dates and supporting evidence."
        buttonLabel="Upload certificates & awards"
        href="/engineer/certificates-awards"
        tone="priority"
      />
      <HubCard
        title="Customer Feedback & Case Studies"
        copy="Store client feedback, testimonials, project examples, photographs, documents and short videos from previous work."
        buttonLabel="Add feedback & case studies"
        href="/engineer/feedback-case-studies"
        tone="priority"
      />
    </section>
  </PageShell>
);

export const EngineerCertificatesAwardsPage = () => {
  const [records, setRecords] = useState<UploadRecord[]>([
    { id: createId("qual"), title: "", issuer: "", category: "Professional certificate" },
  ]);

  const completionCount = useMemo(() => records.filter((record) => record.title || record.fileUrl).length, [records]);

  const updateRecord = (id: string, field: keyof UploadRecord, value: string) => {
    setRecords((current) => current.map((record) => record.id === id ? { ...record, [field]: value } : record));
  };

  return (
    <PageShell
      eyebrow="Profile evidence"
      title="Professional Certificates & Awards"
      intro="Capture structured qualification data as well as the certificate file. This gives companies useful filters instead of just a loose document upload area."
    >
      <section style={pageStyles.panel}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h2 style={pageStyles.cardTitle}>Qualification records</h2>
            <p style={pageStyles.small}>{completionCount} record(s) started. Verification status should be handled by admin or approved resourcing-company workflow.</p>
          </div>
          <button
            type="button"
            style={pageStyles.secondaryButton}
            onClick={() => setRecords((current) => [...current, { id: createId("qual"), title: "", issuer: "", category: "Professional certificate" }])}
          >
            Add qualification
          </button>
        </div>

        {records.map((record) => (
          <article key={record.id} style={pageStyles.record}>
            <div style={pageStyles.formGrid}>
              <Field label="Certificate / qualification name">
                <input style={pageStyles.input} value={record.title} onChange={(event) => updateRecord(record.id, "title", event.target.value)} placeholder="e.g. CTS, ECS, IPAF, vendor training" />
              </Field>
              <Field label="Issuer / awarding body">
                <input style={pageStyles.input} value={record.issuer || ""} onChange={(event) => updateRecord(record.id, "issuer", event.target.value)} placeholder="e.g. AVIXA, ECS, manufacturer" />
              </Field>
              <Field label="Category">
                <select style={pageStyles.input} value={record.category || "Professional certificate"} onChange={(event) => updateRecord(record.id, "category", event.target.value)}>
                  <option>Professional certificate</option>
                  <option>Industry qualification</option>
                  <option>Manufacturer training</option>
                  <option>Safety / site access</option>
                  <option>Award / recognition</option>
                </select>
              </Field>
              <Field label="Issued date">
                <input style={pageStyles.input} type="date" value={record.issuedDate || ""} onChange={(event) => updateRecord(record.id, "issuedDate", event.target.value)} />
              </Field>
              <Field label="Expiry / renewal date">
                <input style={pageStyles.input} type="date" value={record.expiryDate || ""} onChange={(event) => updateRecord(record.id, "expiryDate", event.target.value)} />
              </Field>
              <div style={{ alignSelf: "end" }}>
                <FileUploadInput label="Upload evidence" fileUrl={record.fileUrl} isVerified={false} onFileChange={(fileUrl) => updateRecord(record.id, "fileUrl", fileUrl)} />
              </div>
            </div>
            <div style={{ marginTop: "12px" }}>
              <Field label="Notes / scope covered">
                <textarea style={pageStyles.textarea} value={record.notes || ""} onChange={(event) => updateRecord(record.id, "notes", event.target.value)} placeholder="Briefly describe what this proves, any level achieved, practical scope or renewal requirement." />
              </Field>
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
};

export const EngineerFeedbackCaseStudiesPage = () => {
  const [records, setRecords] = useState<EvidenceRecord[]>([
    { id: createId("case"), title: "", customer: "", projectType: "" },
  ]);

  const updateRecord = (id: string, field: keyof EvidenceRecord, value: string) => {
    setRecords((current) => current.map((record) => record.id === id ? { ...record, [field]: value } : record));
  };

  return (
    <PageShell
      eyebrow="Profile evidence"
      title="Customer Feedback & Case Studies"
      intro="Capture previous work in a structured way so companies can assess evidence, not just read generic claims. Support written feedback, documents, photos and short video proof."
    >
      <section style={pageStyles.panel}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h2 style={pageStyles.cardTitle}>Work evidence records</h2>
            <p style={pageStyles.small}>Useful case studies should include task, site type, outcome, proof media and permission status.</p>
          </div>
          <button
            type="button"
            style={pageStyles.secondaryButton}
            onClick={() => setRecords((current) => [...current, { id: createId("case"), title: "", customer: "", projectType: "" }])}
          >
            Add case study
          </button>
        </div>

        {records.map((record) => (
          <article key={record.id} style={pageStyles.record}>
            <div style={pageStyles.formGrid}>
              <Field label="Project / case study title">
                <input style={pageStyles.input} value={record.title} onChange={(event) => updateRecord(record.id, "title", event.target.value)} placeholder="e.g. UC room rollout, rack build, service visit" />
              </Field>
              <Field label="Customer / site name">
                <input style={pageStyles.input} value={record.customer || ""} onChange={(event) => updateRecord(record.id, "customer", event.target.value)} placeholder="Use anonymised name if needed" />
              </Field>
              <Field label="Project type">
                <input style={pageStyles.input} value={record.projectType || ""} onChange={(event) => updateRecord(record.id, "projectType", event.target.value)} placeholder="Install, commissioning, support, maintenance" />
              </Field>
              <Field label="Completion date">
                <input style={pageStyles.input} type="date" value={record.date || ""} onChange={(event) => updateRecord(record.id, "date", event.target.value)} />
              </Field>
            </div>

            <div style={{ marginTop: "12px" }}>
              <Field label="Customer feedback / outcome">
                <textarea style={pageStyles.textarea} value={record.outcome || ""} onChange={(event) => updateRecord(record.id, "outcome", event.target.value)} placeholder="Add customer feedback, measurable outcome, issue resolved or work completed." />
              </Field>
            </div>

            <div style={{ ...pageStyles.formGrid, marginTop: "12px" }}>
              <FileUploadInput label="Upload document / testimonial" fileUrl={record.documentUrl} isVerified={false} onFileChange={(fileUrl) => updateRecord(record.id, "documentUrl", fileUrl)} />
              <FileUploadInput label="Upload photo evidence" fileUrl={record.imageUrl} isVerified={false} onFileChange={(fileUrl) => updateRecord(record.id, "imageUrl", fileUrl)} />
              <FileUploadInput label="Upload short video" fileUrl={record.videoUrl} isVerified={false} onFileChange={(fileUrl) => updateRecord(record.id, "videoUrl", fileUrl)} />
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
};
