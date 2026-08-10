import React, { useMemo, useState } from "react";
type TradingStatus =
  | "Sole trader"
  | "Limited company"
  | "Umbrella / payroll"
  | "Company engineer"
  | "Not set";

type AvailabilityStatus =
  | "Available"
  | "Limited availability"
  | "Booked"
  | "Not currently available";

type ParsedCvPatch = Partial<EngineerBusinessProfile> & {
  fileName: string;
};

type EngineerBusinessProfile = {
  fullName: string;
  publicName: string;
  headline: string;
  email: string;
  phone: string;
  country: string;
  baseLocation: string;
  postcode: string;
  travelRadiusMiles: number;
  profileSummary: string;

  tradingStatus: TradingStatus;
  businessName: string;
  companyNumber: string;
  vatRegistered: boolean;
  vatNumber: string;
  website: string;
  linkedIn: string;

  availabilityStatus: AvailabilityStatus;
  standardDayRate: number;
  halfDayRate: number;
  weekendRate: number;
  nightRate: number;
  travelCharge: string;
  willingToTravel: boolean;
  willingToWorkNights: boolean;
  willingToWorkWeekends: boolean;
  willingToWorkAsSupport: boolean;
  specialistOnly: boolean;
  willingToLead: boolean;

  hasRightToWork: boolean;
  identityVerified: boolean;
  hasPublicLiability: boolean;
  publicLiabilityExpiry: string;
  hasProfessionalIndemnity: boolean;
  professionalIndemnityExpiry: string;
  hasOwnTransport: boolean;
  hasOwnTools: boolean;
  hasLaptop: boolean;
  hasPpe: boolean;
  hasCscsOrEcs: boolean;
  cscsOrEcsExpiry: string;
  hasIpaf: boolean;
  ipafExpiry: string;
  hasPasma: boolean;
  pasmaExpiry: string;
  hasDbs: boolean;
  dbsExpiry: string;
  acceptsSiteRules: boolean;

  toolsSummary: string;
  certificationSummary: string;
  insuranceNotes: string;
  documentNotes: string;
  privateAdminNotes: string;
};

const storageKey = "techsubbies_engineer_personal_business_profile";
const onboardingDraftKey = "techsubbies_engineer_onboarding_draft";

const defaultProfile: EngineerBusinessProfile = {
  fullName: "",
  publicName: "",
  headline: "AV / IT field engineer",
  email: "",
  phone: "",
  country: "United Kingdom",
  baseLocation: "",
  postcode: "",
  travelRadiusMiles: 50,
  profileSummary: "",

  tradingStatus: "Sole trader",
  businessName: "",
  companyNumber: "",
  vatRegistered: false,
  vatNumber: "",
  website: "",
  linkedIn: "",

  availabilityStatus: "Available",
  standardDayRate: 350,
  halfDayRate: 220,
  weekendRate: 450,
  nightRate: 500,
  travelCharge: "Mileage or travel by agreement",
  willingToTravel: true,
  willingToWorkNights: false,
  willingToWorkWeekends: false,
  willingToWorkAsSupport: true,
  specialistOnly: false,
  willingToLead: false,

  hasRightToWork: false,
  identityVerified: false,
  hasPublicLiability: false,
  publicLiabilityExpiry: "",
  hasProfessionalIndemnity: false,
  professionalIndemnityExpiry: "",
  hasOwnTransport: false,
  hasOwnTools: false,
  hasLaptop: false,
  hasPpe: false,
  hasCscsOrEcs: false,
  cscsOrEcsExpiry: "",
  hasIpaf: false,
  ipafExpiry: "",
  hasPasma: false,
  pasmaExpiry: "",
  hasDbs: false,
  dbsExpiry: "",
  acceptsSiteRules: false,

  toolsSummary: "",
  certificationSummary: "",
  insuranceNotes: "",
  documentNotes: "",
  privateAdminNotes: "",
};

function readSavedProfile(): EngineerBusinessProfile {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    return defaultProfile;
  }

  try {
    return {
      ...defaultProfile,
      ...(JSON.parse(raw) as Partial<EngineerBusinessProfile>),
    };
  } catch {
    window.localStorage.removeItem(storageKey);
    return defaultProfile;
  }
}

function inputClass() {
  return "w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300";
}

function selectClass() {
  return "w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300";
}

function textareaClass() {
  return "min-h-24 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300";
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-2 block text-xs leading-5 text-slate-500">{hint}</span>}
    </label>
  );
}

function ToggleCard({
  title,
  detail,
  active,
  onClick,
}: {
  title: string;
  detail: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border p-4 text-left transition",
        active
          ? "border-cyan-300 bg-cyan-300 text-slate-950"
          : "border-white/10 bg-slate-950 text-slate-300 hover:border-cyan-300/60",
      ].join(" ")}
    >
      <div className="text-sm font-bold">{title}</div>
      <div className="mt-1 text-xs leading-5 opacity-75">{detail}</div>
    </button>
  );
}

function scoreProfile(profile: EngineerBusinessProfile) {
  const requiredItems = [
    profile.fullName,
    profile.email,
    profile.phone,
    profile.country,
    profile.baseLocation,
    profile.postcode,
    profile.profileSummary,
    profile.tradingStatus,
    profile.standardDayRate > 0,
    profile.hasRightToWork,
    profile.identityVerified,
    profile.hasPublicLiability,
    profile.hasOwnTransport,
    profile.hasOwnTools,
    profile.hasPpe,
    profile.acceptsSiteRules,
  ];

  return Math.round((requiredItems.filter(Boolean).length / requiredItems.length) * 100);
}

function missingItems(profile: EngineerBusinessProfile) {
  const items: string[] = [];

  if (!profile.fullName) {
    items.push("Full name");
  }

  if (!profile.email) {
    items.push("Email");
  }

  if (!profile.phone) {
    items.push("Phone");
  }

  if (!profile.baseLocation) {
    items.push("Base location");
  }

  if (!profile.postcode) {
    items.push("Postcode");
  }

  if (!profile.profileSummary) {
    items.push("Profile summary");
  }

  if (!profile.hasRightToWork) {
    items.push("Right to work confirmation");
  }

  if (!profile.identityVerified) {
    items.push("Identity verification");
  }

  if (!profile.hasPublicLiability) {
    items.push("Public liability insurance");
  }

  if (!profile.acceptsSiteRules) {
    items.push("Site rules acceptance");
  }

  return items;
}

async function extractCvText(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "txt") {
    return file.text();
  }

  const arrayBuffer = await file.arrayBuffer();

  if (extension === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  if (extension === "pdf") {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    const document = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    const pages: string[] = [];

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(
        content.items
          .map((item) => ("str" in item ? item.str : ""))
          .filter(Boolean)
          .join(" ")
      );
    }

    return pages.join("\n");
  }

  throw new Error("Choose a PDF, DOCX or TXT file.");
}

function parseCvText(source: string, fileName: string): ParsedCvPatch {
  const lines = source
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const email = source.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = source.match(/(?:\+44\s?\d{4}|0\d{4})[\s-]?\d{3}[\s-]?\d{3}/)?.[0] || "";
  const likelyName = lines.find(
    (line) => line.length <= 60 && /^[A-Za-z][A-Za-z' -]+$/.test(line) && !/curriculum|vitae|profile|summary|contact/i.test(line)
  ) || "";
  const headline = lines.find(
    (line) => line !== likelyName && line.length >= 8 && line.length <= 100 && /engineer|technician|consultant|specialist|manager|developer|architect|support/i.test(line)
  ) || "";
  const descriptiveLines = lines.filter(
    (line) => line.length >= 45 && !line.includes("@") && !/^https?:/i.test(line)
  );
  const matchingLines = (pattern: RegExp, limit: number) => lines.filter((line) => pattern.test(line)).slice(0, limit).join("\n");

  return {
    fileName,
    fullName: likelyName,
    publicName: likelyName,
    email,
    phone,
    headline,
    profileSummary: descriptiveLines.slice(0, 4).join(" ").slice(0, 1000),
    certificationSummary: matchingLines(/cert|cts|dante|ipaf|pasma|cscs|ecs|microsoft|azure|aws|comptia|ccna|q-sys|biamp/i, 10),
    toolsSummary: matchingLines(/tools|tester|laptop|label|crimp|fluke|meter|termination|commissioning/i, 8),
  };
}

function readinessLabel(score: number) {
  if (score >= 90) {
    return "Ready to present";
  }

  if (score >= 70) {
    return "Usable with warnings";
  }

  if (score >= 50) {
    return "Incomplete";
  }

  return "Not ready";
}

export default function EngineerPersonalBusinessProfilePage() {
  const [profile, setProfile] = useState<EngineerBusinessProfile>(() => readSavedProfile());
  const [savedMessage, setSavedMessage] = useState("");
  const [parsedCv, setParsedCv] = useState<ParsedCvPatch | null>(null);
  const [cvMessage, setCvMessage] = useState("");
  const [isParsingCv, setIsParsingCv] = useState(false);
  const completion = useMemo(() => scoreProfile(profile), [profile]);
  const gaps = useMemo(() => missingItems(profile), [profile]);

  function update(patch: Partial<EngineerBusinessProfile>) {
    setProfile((current) => ({
      ...current,
      ...patch,
    }));
    setSavedMessage("");
  }

  async function handleCvUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsingCv(true);
    setParsedCv(null);
    setCvMessage(`Parsing ${file.name}...`);

    try {
      const text = await extractCvText(file);
      if (!text.trim()) throw new Error("No readable text was found in this CV.");
      setParsedCv(parseCvText(text, file.name));
      setCvMessage("CV parsed locally. Review the suggested fields before applying them.");
    } catch (error) {
      setCvMessage(error instanceof Error ? error.message : "The CV could not be parsed.");
    } finally {
      setIsParsingCv(false);
    }
  }

  function applyParsedCv() {
    if (!parsedCv) return;

    update({
      fullName: parsedCv.fullName || profile.fullName,
      publicName: parsedCv.publicName || profile.publicName,
      email: parsedCv.email || profile.email,
      phone: parsedCv.phone || profile.phone,
      headline: parsedCv.headline || profile.headline,
      profileSummary: parsedCv.profileSummary || profile.profileSummary,
      certificationSummary: parsedCv.certificationSummary || profile.certificationSummary,
      toolsSummary: parsedCv.toolsSummary || profile.toolsSummary,
    });
    setSavedMessage("Reviewed CV suggestions applied. Save the profile to keep them.");
  }

  function saveProfile() {
    window.localStorage.setItem(storageKey, JSON.stringify(profile, null, 2));
    setSavedMessage("Profile saved locally. Backend save can be connected next.");
  }

  function clearProfile() {
    window.localStorage.removeItem(storageKey);
    setProfile(defaultProfile);
    setSavedMessage("Local profile cleared.");
  }

  function importOnboardingDraft() {
    const raw = window.localStorage.getItem(onboardingDraftKey);

    if (!raw) {
      setSavedMessage("No onboarding draft found.");
      return;
    }

    try {
      const draft = JSON.parse(raw) as {
        account?: Partial<EngineerBusinessProfile>;
        readiness?: Partial<Record<string, boolean>>;
        documentNotes?: string;
      };

      update({
        fullName: draft.account?.fullName || profile.fullName,
        email: draft.account?.email || profile.email,
        phone: draft.account?.phone || profile.phone,
        businessName: draft.account?.businessName || profile.businessName,
        tradingStatus: (draft.account?.tradingStatus as TradingStatus) || profile.tradingStatus,
        country: draft.account?.country || profile.country,
        baseLocation: draft.account?.baseLocation || profile.baseLocation,
        postcode: draft.account?.postcode || profile.postcode,
        travelRadiusMiles: draft.account?.travelRadiusMiles || profile.travelRadiusMiles,
        hasRightToWork: Boolean(draft.readiness?.hasRightToWork || profile.hasRightToWork),
        hasPublicLiability: Boolean(draft.readiness?.hasPublicLiability || profile.hasPublicLiability),
        hasProfessionalIndemnity: Boolean(draft.readiness?.hasProfessionalIndemnity || profile.hasProfessionalIndemnity),
        hasOwnTransport: Boolean(draft.readiness?.hasOwnTransport || profile.hasOwnTransport),
        hasOwnTools: Boolean(draft.readiness?.hasOwnTools || profile.hasOwnTools),
        hasLaptop: Boolean(draft.readiness?.hasLaptop || profile.hasLaptop),
        hasPpe: Boolean(draft.readiness?.hasPpe || profile.hasPpe),
        acceptsSiteRules: Boolean(draft.readiness?.acceptsSiteRules || profile.acceptsSiteRules),
        willingToWorkNights: Boolean(draft.readiness?.willingToWorkNights || profile.willingToWorkNights),
        willingToWorkWeekends: Boolean(draft.readiness?.willingToWorkWeekends || profile.willingToWorkWeekends),
        willingToTravel: Boolean(draft.readiness?.willingToTravel || profile.willingToTravel),
        documentNotes: draft.documentNotes || profile.documentNotes,
      });

      setSavedMessage("Onboarding draft imported.");
    } catch {
      setSavedMessage("Could not import onboarding draft.");
    }
  }

  return (
        <div className="min-h-screen ">
            <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <header className="mb-6 rounded-3xl border border-cyan-300/20 bg-slate-900 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
                Engineer profile
              </p>
              <h1 className="mt-3 text-3xl font-bold text-white">
                Personal and business profile
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Manage the information companies need before inviting you to site: identity, trading status, rates, travel preferences, insurance, tools and compliance readiness.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-3">
                <div className="text-xl font-bold text-cyan-300">{completion}%</div>
                <div className="text-xs text-slate-500">Complete</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-3">
                <div className="text-xl font-bold text-cyan-300">{readinessLabel(completion)}</div>
                <div className="text-xs text-slate-500">Profile state</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-3">
                <div className="text-xl font-bold text-cyan-300">{gaps.length}</div>
                <div className="text-xs text-slate-500">Open gaps</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveProfile}
              className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200"
            >
              Save profile
            </button>

            <button
              type="button"
              onClick={importOnboardingDraft}
              className="rounded-xl border border-cyan-300/40 px-5 py-3 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10"
            >
              Import onboarding draft
            </button>

            <button
              type="button"
              onClick={clearProfile}
              className="rounded-xl border border-red-300/40 px-5 py-3 text-sm font-bold text-red-100 hover:bg-red-300/10"
            >
              Clear local profile
            </button>
          </div>

          {savedMessage && (
            <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm font-semibold text-cyan-100">
              {savedMessage}
            </div>
          )}
        </header>

        <main className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-cyan-300/20 bg-slate-900 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">CV import</p>
              <h2 className="mt-3 text-xl font-bold text-white">Upload and parse a formal CV</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Upload a PDF, DOCX or TXT CV. It is parsed locally and suggested fields are not applied until you review them.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <label className="cursor-pointer rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200">
                  {isParsingCv ? "Parsing CV..." : "Choose CV"}
                  <input
                    className="sr-only"
                    type="file"
                    accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    disabled={isParsingCv}
                    onChange={handleCvUpload}
                  />
                </label>
                {parsedCv && (
                  <button
                    type="button"
                    onClick={applyParsedCv}
                    className="rounded-xl border border-cyan-300/40 px-5 py-3 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10"
                  >
                    Apply reviewed CV fields
                  </button>
                )}
              </div>

              {cvMessage && <p role="status" className="mt-4 text-sm leading-6 text-cyan-100">{cvMessage}</p>}

              {parsedCv && (
                <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-5 text-sm leading-6 text-slate-300">
                  <h3 className="font-bold text-cyan-200">Suggestions from {parsedCv.fileName}</h3>
                  <dl className="mt-3 grid gap-x-6 gap-y-2 md:grid-cols-2">
                    <div><dt className="font-bold text-white">Name</dt><dd>{parsedCv.fullName || "Not found"}</dd></div>
                    <div><dt className="font-bold text-white">Email</dt><dd>{parsedCv.email || "Not found"}</dd></div>
                    <div><dt className="font-bold text-white">Phone</dt><dd>{parsedCv.phone || "Not found"}</dd></div>
                    <div><dt className="font-bold text-white">Headline</dt><dd>{parsedCv.headline || "Not found"}</dd></div>
                  </dl>
                  <div className="mt-3"><span className="font-bold text-white">Summary:</span> {parsedCv.profileSummary || "Not found"}</div>
                </div>
              )}
            </section>
            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-cyan-300">1. Personal profile</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                This is the core information companies use to identify and contact you.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Full legal name">
                  <input className={inputClass()} value={profile.fullName} onChange={(event) => update({ fullName: event.target.value })} />
                </Field>

                <Field label="Public display name" hint="Leave blank to use your full name.">
                  <input className={inputClass()} value={profile.publicName} onChange={(event) => update({ publicName: event.target.value })} />
                </Field>

                <Field label="Headline">
                  <input className={inputClass()} value={profile.headline} onChange={(event) => update({ headline: event.target.value })} />
                </Field>

                <Field label="Email">
                  <input className={inputClass()} value={profile.email} onChange={(event) => update({ email: event.target.value })} />
                </Field>

                <Field label="Phone">
                  <input className={inputClass()} value={profile.phone} onChange={(event) => update({ phone: event.target.value })} />
                </Field>

                <Field label="Country">
                  <input className={inputClass()} value={profile.country} onChange={(event) => update({ country: event.target.value })} />
                </Field>

                <Field label="Base location">
                  <input className={inputClass()} value={profile.baseLocation} onChange={(event) => update({ baseLocation: event.target.value })} />
                </Field>

                <Field label="Postcode / ZIP">
                  <input className={inputClass()} value={profile.postcode} onChange={(event) => update({ postcode: event.target.value })} />
                </Field>

                <Field label="Travel radius in miles">
                  <input type="number" min={0} className={inputClass()} value={profile.travelRadiusMiles} onChange={(event) => update({ travelRadiusMiles: Number(event.target.value) })} />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Profile summary" hint="Explain the kind of work you are suitable for. Be specific rather than generic.">
                  <textarea className={textareaClass()} value={profile.profileSummary} onChange={(event) => update({ profileSummary: event.target.value })} />
                </Field>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-cyan-300">2. Business and trading details</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Trading status">
                  <select className={selectClass()} value={profile.tradingStatus} onChange={(event) => update({ tradingStatus: event.target.value as TradingStatus })}>
                    <option>Sole trader</option>
                    <option>Limited company</option>
                    <option>Umbrella / payroll</option>
                    <option>Company engineer</option>
                    <option>Not set</option>
                  </select>
                </Field>

                <Field label="Business / trading name">
                  <input className={inputClass()} value={profile.businessName} onChange={(event) => update({ businessName: event.target.value })} />
                </Field>

                <Field label="Company number" hint="Optional. Only needed for registered companies.">
                  <input className={inputClass()} value={profile.companyNumber} onChange={(event) => update({ companyNumber: event.target.value })} />
                </Field>

                <Field label="VAT number" hint="Only shown where VAT registered.">
                  <input className={inputClass()} value={profile.vatNumber} onChange={(event) => update({ vatNumber: event.target.value })} />
                </Field>

                <Field label="Website">
                  <input className={inputClass()} value={profile.website} onChange={(event) => update({ website: event.target.value })} />
                </Field>

                <Field label="LinkedIn / profile URL">
                  <input className={inputClass()} value={profile.linkedIn} onChange={(event) => update({ linkedIn: event.target.value })} />
                </Field>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <ToggleCard
                  active={profile.vatRegistered}
                  title="VAT registered"
                  detail="Show companies whether VAT may apply to invoices."
                  onClick={() => update({ vatRegistered: !profile.vatRegistered })}
                />

                <ToggleCard
                  active={profile.hasProfessionalIndemnity}
                  title="Professional indemnity"
                  detail="Important for consultancy, design, commissioning or specialist work."
                  onClick={() => update({ hasProfessionalIndemnity: !profile.hasProfessionalIndemnity })}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-cyan-300">3. Rates and work preferences</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Availability status">
                  <select className={selectClass()} value={profile.availabilityStatus} onChange={(event) => update({ availabilityStatus: event.target.value as AvailabilityStatus })}>
                    <option>Available</option>
                    <option>Limited availability</option>
                    <option>Booked</option>
                    <option>Not currently available</option>
                  </select>
                </Field>

                <Field label="Standard day rate">
                  <input type="number" min={0} className={inputClass()} value={profile.standardDayRate} onChange={(event) => update({ standardDayRate: Number(event.target.value) })} />
                </Field>

                <Field label="Half-day rate">
                  <input type="number" min={0} className={inputClass()} value={profile.halfDayRate} onChange={(event) => update({ halfDayRate: Number(event.target.value) })} />
                </Field>

                <Field label="Weekend rate">
                  <input type="number" min={0} className={inputClass()} value={profile.weekendRate} onChange={(event) => update({ weekendRate: Number(event.target.value) })} />
                </Field>

                <Field label="Night rate">
                  <input type="number" min={0} className={inputClass()} value={profile.nightRate} onChange={(event) => update({ nightRate: Number(event.target.value) })} />
                </Field>

                <Field label="Travel charge">
                  <input className={inputClass()} value={profile.travelCharge} onChange={(event) => update({ travelCharge: event.target.value })} />
                </Field>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <ToggleCard active={profile.willingToTravel} title="Willing to travel" detail="Allow jobs beyond local area where agreed." onClick={() => update({ willingToTravel: !profile.willingToTravel })} />
                <ToggleCard active={profile.willingToWorkNights} title="Night work" detail="Show availability for night work." onClick={() => update({ willingToWorkNights: !profile.willingToWorkNights })} />
                <ToggleCard active={profile.willingToWorkWeekends} title="Weekend work" detail="Show availability for weekend work." onClick={() => update({ willingToWorkWeekends: !profile.willingToWorkWeekends })} />
                <ToggleCard active={profile.willingToWorkAsSupport} title="Support work" detail="Accept junior/support work where suitable." onClick={() => update({ willingToWorkAsSupport: !profile.willingToWorkAsSupport })} />
                <ToggleCard active={profile.specialistOnly} title="Specialist-only" detail="Avoid basic labour matches." onClick={() => update({ specialistOnly: !profile.specialistOnly })} />
                <ToggleCard active={profile.willingToLead} title="Willing to lead" detail="Only enable if you can own site coordination." onClick={() => update({ willingToLead: !profile.willingToLead })} />
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-cyan-300">4. Compliance and site readiness</h2>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <ToggleCard active={profile.hasRightToWork} title="Right to work" detail="Required before accepting work." onClick={() => update({ hasRightToWork: !profile.hasRightToWork })} />
                <ToggleCard active={profile.identityVerified} title="Identity verified" detail="Photo ID or approved identity check." onClick={() => update({ identityVerified: !profile.identityVerified })} />
                <ToggleCard active={profile.hasPublicLiability} title="Public liability" detail="Insurance required by most companies." onClick={() => update({ hasPublicLiability: !profile.hasPublicLiability })} />
                <ToggleCard active={profile.hasOwnTransport} title="Own transport" detail="Can attend site independently." onClick={() => update({ hasOwnTransport: !profile.hasOwnTransport })} />
                <ToggleCard active={profile.hasOwnTools} title="Own tools" detail="Has normal tools for selected roles." onClick={() => update({ hasOwnTools: !profile.hasOwnTools })} />
                <ToggleCard active={profile.hasLaptop} title="Laptop" detail="Needed for IT, commissioning and admin tasks." onClick={() => update({ hasLaptop: !profile.hasLaptop })} />
                <ToggleCard active={profile.hasPpe} title="PPE" detail="Basic site PPE available." onClick={() => update({ hasPpe: !profile.hasPpe })} />
                <ToggleCard active={profile.hasCscsOrEcs} title="CSCS / ECS" detail="Useful for construction-site access." onClick={() => update({ hasCscsOrEcs: !profile.hasCscsOrEcs })} />
                <ToggleCard active={profile.hasIpaf} title="IPAF" detail="Working at height / MEWP access." onClick={() => update({ hasIpaf: !profile.hasIpaf })} />
                <ToggleCard active={profile.hasPasma} title="PASMA" detail="Tower/scaffold competence where required." onClick={() => update({ hasPasma: !profile.hasPasma })} />
                <ToggleCard active={profile.hasDbs} title="DBS" detail="May be required for education or sensitive sites." onClick={() => update({ hasDbs: !profile.hasDbs })} />
                <ToggleCard active={profile.acceptsSiteRules} title="Accepts site packs" detail="RAMS, induction, escalation and conduct." onClick={() => update({ acceptsSiteRules: !profile.acceptsSiteRules })} />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Public liability expiry">
                  <input type="date" className={inputClass()} value={profile.publicLiabilityExpiry} onChange={(event) => update({ publicLiabilityExpiry: event.target.value })} />
                </Field>

                <Field label="Professional indemnity expiry">
                  <input type="date" className={inputClass()} value={profile.professionalIndemnityExpiry} onChange={(event) => update({ professionalIndemnityExpiry: event.target.value })} />
                </Field>

                <Field label="CSCS / ECS expiry">
                  <input type="date" className={inputClass()} value={profile.cscsOrEcsExpiry} onChange={(event) => update({ cscsOrEcsExpiry: event.target.value })} />
                </Field>

                <Field label="IPAF expiry">
                  <input type="date" className={inputClass()} value={profile.ipafExpiry} onChange={(event) => update({ ipafExpiry: event.target.value })} />
                </Field>

                <Field label="PASMA expiry">
                  <input type="date" className={inputClass()} value={profile.pasmaExpiry} onChange={(event) => update({ pasmaExpiry: event.target.value })} />
                </Field>

                <Field label="DBS expiry">
                  <input type="date" className={inputClass()} value={profile.dbsExpiry} onChange={(event) => update({ dbsExpiry: event.target.value })} />
                </Field>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-cyan-300">5. Tools, certifications and notes</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Tools summary">
                  <textarea className={textareaClass()} value={profile.toolsSummary} onChange={(event) => update({ toolsSummary: event.target.value })} />
                </Field>

                <Field label="Certifications summary">
                  <textarea className={textareaClass()} value={profile.certificationSummary} onChange={(event) => update({ certificationSummary: event.target.value })} />
                </Field>

                <Field label="Insurance notes">
                  <textarea className={textareaClass()} value={profile.insuranceNotes} onChange={(event) => update({ insuranceNotes: event.target.value })} />
                </Field>

                <Field label="Document notes">
                  <textarea className={textareaClass()} value={profile.documentNotes} onChange={(event) => update({ documentNotes: event.target.value })} />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Private admin notes" hint="For the engineer only. Do not show this in the public profile.">
                  <textarea className={textareaClass()} value={profile.privateAdminNotes} onChange={(event) => update({ privateAdminNotes: event.target.value })} />
                </Field>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="sticky top-6 rounded-3xl border border-cyan-300/20 bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-cyan-300">Public profile preview</h2>

              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300 text-xl font-black text-slate-950">
                    {(profile.publicName || profile.fullName || "E").slice(0, 1).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="font-bold text-white">{profile.publicName || profile.fullName || "Unnamed engineer"}</h3>
                    <p className="text-sm text-cyan-200">{profile.headline}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {profile.profileSummary || "No profile summary added yet."}
                </p>

                <div className="mt-4 grid gap-2 text-sm text-slate-300">
                  <div>Location: {profile.baseLocation || "Not set"}</div>
                  <div>Travel: {profile.travelRadiusMiles} miles</div>
                  <div>Day rate: £{profile.standardDayRate}</div>
                  <div>Availability: {profile.availabilityStatus}</div>
                  <div>Trading: {profile.tradingStatus}</div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-5">
                <h3 className="font-bold text-white">Readiness status</h3>
                <div className="mt-3 text-3xl font-bold text-cyan-300">{completion}%</div>
                <p className="mt-2 text-sm text-slate-400">{readinessLabel(completion)}</p>

                {gaps.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                    <div className="text-sm font-bold text-amber-100">Open gaps</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-50">
                      {gaps.slice(0, 8).map((gap) => (
                        <li key={gap}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-5">
                <h3 className="font-bold text-white">Profile rules</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-400">
                  <li>Companies should see only relevant public details.</li>
                  <li>Sensitive documents should be verified securely later.</li>
                  <li>Rates are indicators, not final contract terms.</li>
                  <li>Site-readiness must be checked per project.</li>
                  <li>This page currently saves locally for development testing.</li>
                </ul>
              </div>
            </section>
          </aside>
        </main>
      </div>
    </div>
          </div>
    );
}


