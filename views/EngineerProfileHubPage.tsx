import React, { useState } from "react";
import { FileUploadInput } from "../components/FileUploadInput";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/InteractionContext";
import { EngineerProfile, Role } from "../types";

type HubCardProps = {
  title: string;
  copy: string;
  buttonLabel: string;
  href: string;
  priority?: boolean;
};

type UploadRecord = {
  id: string;
  title: string;
  issuer?: string;
  category?: string;
  level?: string;
  issuedDate?: string;
  expiryDate?: string;
  verificationStatus?: "pending" | "verified" | "rejected" | "expired";
  visibility?: "private" | "verified_companies" | "public";
  notes?: string;
  fileUrl?: string;
};

type EvidenceRecord = {
  id: string;
  title: string;
  customer?: string;
  projectType?: string;
  siteType?: string;
  date?: string;
  outcome?: string;
  permissionStatus?: "not_requested" | "permission_granted" | "anonymised" | "private_only";
  visibility?: "private" | "verified_companies" | "public";
  documentUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
};

const id = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
const fileName = (fileUrl?: string) => fileUrl?.split("/").pop() || "uploaded-document";

const pageClass = "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 px-6 py-8 pb-20";
const shellClass = "mx-auto w-[min(1120px,calc(100vw-48px))]";
const labelClass = "block text-xs font-extrabold text-slate-300 mb-1";
const inputClass = "w-full rounded-xl border border-slate-600/50 bg-slate-950/50 px-3 py-2 text-white outline-none focus:border-cyan-300";
const panelClass = "rounded-[22px] border border-cyan-300/20 bg-slate-900/85 p-5 shadow-2xl";
const recordClass = "mt-4 rounded-2xl border border-slate-500/20 bg-slate-950/45 p-4";
const buttonClass = "rounded-full border border-cyan-300/40 bg-cyan-950/80 px-4 py-2.5 text-sm font-extrabold text-white";
const saveButtonClass = "rounded-full border border-green-200/40 bg-green-600 px-4 py-2.5 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50";

const defaultCredential = (): UploadRecord => ({
  id: id("qual"),
  title: "",
  issuer: "",
  category: "Professional certificate",
  verificationStatus: "pending",
  visibility: "verified_companies",
});

const defaultEvidence = (): EvidenceRecord => ({
  id: id("case"),
  title: "",
  customer: "",
  projectType: "",
  permissionStatus: "not_requested",
  visibility: "verified_companies",
});

const engineerFromUser = (user: ReturnType<typeof useAuth>["user"]): EngineerProfile | null => {
  if (!user || user.role !== Role.ENGINEER) return null;
  return user.profile as EngineerProfile;
};

const credentialsFromProfile = (profile: EngineerProfile | null): UploadRecord[] => {
  const extended = ((profile as any)?.professionalCredentials || []) as UploadRecord[];
  if (extended.length > 0) return extended;

  const mapped = (profile?.certifications || []).map((cert) => {
    const extendedCert = cert as any;
    const firstDoc = cert.documents?.[0];
    return {
      id: extendedCert.id || id("qual"),
      title: cert.name,
      issuer: extendedCert.issuer || "",
      category: extendedCert.category || "Professional certificate",
      level: extendedCert.level || "",
      issuedDate: extendedCert.issuedDate || "",
      expiryDate: extendedCert.expiryDate || "",
      verificationStatus: cert.verified ? "verified" : "pending",
      visibility: extendedCert.visibility || "verified_companies",
      notes: extendedCert.notes || "",
      fileUrl: firstDoc?.url || "",
    } as UploadRecord;
  });

  return mapped.length > 0 ? mapped : [defaultCredential()];
};

const evidenceFromProfile = (profile: EngineerProfile | null): EvidenceRecord[] => {
  const extended = ((profile as any)?.workEvidence || []) as EvidenceRecord[];
  if (extended.length > 0) return extended;

  const mapped = (profile?.caseStudies || []).map((caseStudy) => {
    const extendedCase = caseStudy as any;
    return {
      id: caseStudy.id,
      title: caseStudy.name,
      customer: extendedCase.customer || "",
      projectType: extendedCase.projectType || "",
      siteType: extendedCase.siteType || "",
      date: extendedCase.date || "",
      outcome: extendedCase.outcome || "",
      permissionStatus: extendedCase.permissionStatus || "not_requested",
      visibility: extendedCase.visibility || "verified_companies",
      documentUrl: extendedCase.documentUrl || caseStudy.url || "",
      imageUrl: extendedCase.imageUrl || "",
      videoUrl: extendedCase.videoUrl || "",
    } as EvidenceRecord;
  });

  return mapped.length > 0 ? mapped : [defaultEvidence()];
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label>
    <span className={labelClass}>{label}</span>
    {children}
  </label>
);

const PageShell = ({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) => (
  <main className={pageClass}>
    <div className={shellClass}>
      <a href="/" className="text-sm font-extrabold text-cyan-300 no-underline">Back to landing page</a>
      <p className="mb-2 mt-7 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">{eyebrow}</p>
      <h1 className="mb-4 text-4xl font-black leading-tight text-white md:text-5xl">{title}</h1>
      <p className="mb-7 max-w-3xl text-sm leading-7 text-slate-300">{intro}</p>
      {children}
    </div>
  </main>
);

const HubCard = ({ title, copy, buttonLabel, href, priority }: HubCardProps) => (
  <article className={`flex min-h-[178px] flex-col justify-between rounded-2xl border p-5 shadow-2xl ${priority ? "border-cyan-300/40 bg-cyan-950/35 shadow-cyan-900/20" : "border-cyan-300/20 bg-slate-900/80"}`}>
    <div>
      <h2 className="mb-3 text-lg font-black text-cyan-300">{title}</h2>
      <p className="text-sm leading-6 text-slate-300">{copy}</p>
    </div>
    <a href={href} className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-950/80 px-4 text-sm font-extrabold text-white no-underline">{buttonLabel}</a>
  </article>
);

export const EngineerProfileHubPage = () => (
  <PageShell eyebrow="For Engineers" title="Engineer Profile Hub" intro="Keep personal identity, business details, compliance evidence, qualifications, availability and previous work proof in separate profile sections.">
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <HubCard title="Personal & Insurance Profile" copy="Personal details, business information, insurance documents, verification and official paperwork." buttonLabel="Manage profile" href="/engineer/personal-business-profile" />
      <HubCard title="Skills Builder" copy="Role-based AV/IT skills, product knowledge, certifications, self-ratings and specialist capability." buttonLabel="Build skills profile" href="/role-skills" />
      <HubCard title="Availability & Working Area" copy="Location, working radius, calendar availability, weekend rules, public holidays and travel preferences." buttonLabel="Set availability" href="/engineer/availability" />
      <HubCard title="Product Awareness / Experience" copy="Skills-based awareness of AV brands, platforms, signal technologies and product categories." buttonLabel="Add product awareness" href="/engineer/product-awareness" />
      <HubCard title="Professional Certificates & Awards" copy="Upload certificates, record professional qualifications, add issuer details, expiry dates and supporting evidence." buttonLabel="Upload certificates & awards" href="/engineer/certificates-awards" priority />
      <HubCard title="Customer Feedback & Case Studies" copy="Store client feedback, testimonials, project examples, photographs, documents and short videos from previous work." buttonLabel="Add feedback & case studies" href="/engineer/feedback-case-studies" priority />
    </section>
  </PageShell>
);

export const EngineerCertificatesAwardsPage = () => {
  const { user } = useAuth();
  const { updateEngineerProfile } = useAppContext();
  const engineerProfile = engineerFromUser(user);
  const [records, setRecords] = useState<UploadRecord[]>(() => credentialsFromProfile(engineerProfile));
  const completed = records.filter((record) => record.title || record.fileUrl).length;

  const update = (recordId: string, field: keyof UploadRecord, value: string) => setRecords((current) => current.map((record) => record.id === recordId ? { ...record, [field]: value } : record));

  const save = () => {
    const cleaned = records.filter((record) => record.title || record.fileUrl);
    const certifications = cleaned.map((record) => ({
      name: record.title || fileName(record.fileUrl),
      verified: record.verificationStatus === "verified",
      issuer: record.issuer,
      category: record.category,
      level: record.level,
      issuedDate: record.issuedDate,
      expiryDate: record.expiryDate,
      verificationStatus: record.verificationStatus || "pending",
      visibility: record.visibility || "verified_companies",
      notes: record.notes,
      documents: record.fileUrl ? [{ id: `${record.id}-doc`, name: fileName(record.fileUrl), url: record.fileUrl, verified: record.verificationStatus === "verified" }] : [],
    })) as any;

    updateEngineerProfile({ certifications, professionalCredentials: cleaned } as any);
  };

  return (
    <PageShell eyebrow="Profile evidence" title="Professional Certificates & Awards" intro="Capture structured qualification data as well as the certificate file. This gives companies useful filters instead of just a loose document upload area.">
      {!engineerProfile && <div className="mb-4 rounded-xl border border-amber-300/40 bg-amber-950/30 p-3 text-sm text-amber-200">Preview mode: the logged-in user is not an engineer, so profile saving is disabled.</div>}
      <section className={panelClass}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-lg font-black text-cyan-300">Qualification records</h2><p className="mt-1 text-xs text-slate-400">{completed} record(s) started. Verification should be handled by admin or approved resourcing workflow.</p></div>
          <div className="flex flex-wrap gap-2"><button type="button" className={buttonClass} onClick={() => setRecords((current) => [...current, defaultCredential()])}>Add qualification</button><button type="button" className={saveButtonClass} disabled={!engineerProfile} onClick={save}>Save to profile</button></div>
        </div>
        {records.map((record) => (
          <article key={record.id} className={recordClass}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Certificate / qualification name"><input className={inputClass} value={record.title} onChange={(e) => update(record.id, "title", e.target.value)} placeholder="e.g. CTS, ECS, IPAF, vendor training" /></Field>
              <Field label="Issuer / awarding body"><input className={inputClass} value={record.issuer || ""} onChange={(e) => update(record.id, "issuer", e.target.value)} placeholder="e.g. AVIXA, ECS, manufacturer" /></Field>
              <Field label="Category"><select className={inputClass} value={record.category || "Professional certificate"} onChange={(e) => update(record.id, "category", e.target.value)}><option>Professional certificate</option><option>Industry qualification</option><option>Manufacturer training</option><option>Safety / site access</option><option>Award / recognition</option></select></Field>
              <Field label="Level / grade"><input className={inputClass} value={record.level || ""} onChange={(e) => update(record.id, "level", e.target.value)} placeholder="e.g. Level 3, Advanced, Gold" /></Field>
              <Field label="Issued date"><input className={inputClass} type="date" value={record.issuedDate || ""} onChange={(e) => update(record.id, "issuedDate", e.target.value)} /></Field>
              <Field label="Expiry / renewal date"><input className={inputClass} type="date" value={record.expiryDate || ""} onChange={(e) => update(record.id, "expiryDate", e.target.value)} /></Field>
              <Field label="Verification status"><select className={inputClass} value={record.verificationStatus || "pending"} onChange={(e) => update(record.id, "verificationStatus", e.target.value)}><option value="pending">Pending</option><option value="verified">Verified</option><option value="rejected">Rejected</option><option value="expired">Expired</option></select></Field>
              <Field label="Visibility"><select className={inputClass} value={record.visibility || "verified_companies"} onChange={(e) => update(record.id, "visibility", e.target.value)}><option value="private">Private</option><option value="verified_companies">Verified companies only</option><option value="public">Public profile</option></select></Field>
              <div><FileUploadInput label="Upload evidence" fileUrl={record.fileUrl} isVerified={record.verificationStatus === "verified"} onFileChange={(fileUrl) => update(record.id, "fileUrl", fileUrl)} /></div>
            </div>
            <div className="mt-3"><Field label="Notes / scope covered"><textarea className={inputClass} value={record.notes || ""} onChange={(e) => update(record.id, "notes", e.target.value)} placeholder="Briefly describe what this proves, any level achieved, practical scope or renewal requirement." /></Field></div>
          </article>
        ))}
      </section>
    </PageShell>
  );
};

export const EngineerFeedbackCaseStudiesPage = () => {
  const { user } = useAuth();
  const { updateEngineerProfile } = useAppContext();
  const engineerProfile = engineerFromUser(user);
  const [records, setRecords] = useState<EvidenceRecord[]>(() => evidenceFromProfile(engineerProfile));

  const update = (recordId: string, field: keyof EvidenceRecord, value: string) => setRecords((current) => current.map((record) => record.id === recordId ? { ...record, [field]: value } : record));

  const save = () => {
    const cleaned = records.filter((record) => record.title || record.outcome || record.documentUrl || record.imageUrl || record.videoUrl);
    const caseStudies = cleaned.map((record) => ({
      id: record.id,
      name: record.title || "Previous work evidence",
      url: record.documentUrl || record.imageUrl || record.videoUrl || `techsubbies://case-study/${record.id}`,
      customer: record.customer,
      projectType: record.projectType,
      siteType: record.siteType,
      date: record.date,
      outcome: record.outcome,
      permissionStatus: record.permissionStatus || "not_requested",
      visibility: record.visibility || "verified_companies",
      verificationStatus: "pending",
      documentUrl: record.documentUrl,
      imageUrl: record.imageUrl,
      videoUrl: record.videoUrl,
    })) as any;

    updateEngineerProfile({ caseStudies, workEvidence: cleaned } as any);
  };

  return (
    <PageShell eyebrow="Profile evidence" title="Customer Feedback & Case Studies" intro="Capture previous work in a structured way so companies can assess evidence, not just read generic claims. Support written feedback, documents, photos and short video proof.">
      {!engineerProfile && <div className="mb-4 rounded-xl border border-amber-300/40 bg-amber-950/30 p-3 text-sm text-amber-200">Preview mode: the logged-in user is not an engineer, so profile saving is disabled.</div>}
      <section className={panelClass}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-lg font-black text-cyan-300">Work evidence records</h2><p className="mt-1 text-xs text-slate-400">Useful case studies should include task, site type, outcome, proof media and permission status.</p></div>
          <div className="flex flex-wrap gap-2"><button type="button" className={buttonClass} onClick={() => setRecords((current) => [...current, defaultEvidence()])}>Add case study</button><button type="button" className={saveButtonClass} disabled={!engineerProfile} onClick={save}>Save to profile</button></div>
        </div>
        {records.map((record) => (
          <article key={record.id} className={recordClass}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Project / case study title"><input className={inputClass} value={record.title} onChange={(e) => update(record.id, "title", e.target.value)} placeholder="e.g. UC room rollout, rack build, service visit" /></Field>
              <Field label="Customer / site name"><input className={inputClass} value={record.customer || ""} onChange={(e) => update(record.id, "customer", e.target.value)} placeholder="Use anonymised name if needed" /></Field>
              <Field label="Project type"><input className={inputClass} value={record.projectType || ""} onChange={(e) => update(record.id, "projectType", e.target.value)} placeholder="Install, commissioning, support, maintenance" /></Field>
              <Field label="Site type"><input className={inputClass} value={record.siteType || ""} onChange={(e) => update(record.id, "siteType", e.target.value)} placeholder="Office, education, hospitality, retail" /></Field>
              <Field label="Completion date"><input className={inputClass} type="date" value={record.date || ""} onChange={(e) => update(record.id, "date", e.target.value)} /></Field>
              <Field label="Customer permission"><select className={inputClass} value={record.permissionStatus || "not_requested"} onChange={(e) => update(record.id, "permissionStatus", e.target.value)}><option value="not_requested">Not requested</option><option value="permission_granted">Permission granted</option><option value="anonymised">Anonymised</option><option value="private_only">Private evidence only</option></select></Field>
              <Field label="Visibility"><select className={inputClass} value={record.visibility || "verified_companies"} onChange={(e) => update(record.id, "visibility", e.target.value)}><option value="private">Private</option><option value="verified_companies">Verified companies only</option><option value="public">Public profile</option></select></Field>
            </div>
            <div className="mt-3"><Field label="Customer feedback / outcome"><textarea className={inputClass} value={record.outcome || ""} onChange={(e) => update(record.id, "outcome", e.target.value)} placeholder="Add customer feedback, measurable outcome, issue resolved or work completed." /></Field></div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <FileUploadInput label="Upload document / testimonial" fileUrl={record.documentUrl} isVerified={false} onFileChange={(fileUrl) => update(record.id, "documentUrl", fileUrl)} />
              <FileUploadInput label="Upload photo evidence" fileUrl={record.imageUrl} isVerified={false} onFileChange={(fileUrl) => update(record.id, "imageUrl", fileUrl)} />
              <FileUploadInput label="Upload short video" fileUrl={record.videoUrl} isVerified={false} onFileChange={(fileUrl) => update(record.id, "videoUrl", fileUrl)} />
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
};
