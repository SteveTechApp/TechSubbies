import React, { useMemo, useState } from "react";

import PersistentAppHeader from "../components/PersistentAppHeader";
import {
  cloneSkillRequirements,
  getRoleExpectation,
  responsibilityBandDescriptions,
  responsibilityBandLabels,
  roleExpectations,
  type ResponsibilityBand,
  type SkillRequirement,
} from "../data/roleExpectations";

type EngineerSignUpWizardProps = {
  onCancel?: () => void;
};

type Step = 1 | 2 | 3 | 4 | 5 | 6;

type AccountDetails = {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  tradingStatus: string;
  country: string;
  baseLocation: string;
  postcode: string;
  travelRadiusMiles: number;
};

type ReadinessDetails = {
  hasRightToWork: boolean;
  hasPublicLiability: boolean;
  hasProfessionalIndemnity: boolean;
  hasOwnTransport: boolean;
  hasOwnTools: boolean;
  hasLaptop: boolean;
  hasPpe: boolean;
  acceptsSiteRules: boolean;
  willingToWorkNights: boolean;
  willingToWorkWeekends: boolean;
  willingToTravel: boolean;
  calendarReady: boolean;
};

type EngineerSkill = SkillRequirement & {
  selfLevel: 0 | 1 | 2 | 3 | 4 | 5;
  evidenceNote: string;
};

type EngineerRoleProfile = {
  id: string;
  expectationId: string;
  enabled: boolean;
  maximumResponsibility: ResponsibilityBand;
  targetDayRate: number;
  willingToWorkAsSupport: boolean;
  willingToLead: boolean;
  specialistOnly: boolean;
  skills: EngineerSkill[];
  profileNote: string;
};

const defaultAccount: AccountDetails = {
  fullName: "",
  email: "",
  phone: "",
  businessName: "",
  tradingStatus: "Sole trader",
  country: "United Kingdom",
  baseLocation: "",
  postcode: "",
  travelRadiusMiles: 50,
};

const defaultReadiness: ReadinessDetails = {
  hasRightToWork: false,
  hasPublicLiability: false,
  hasProfessionalIndemnity: false,
  hasOwnTransport: false,
  hasOwnTools: false,
  hasLaptop: false,
  hasPpe: false,
  acceptsSiteRules: false,
  willingToWorkNights: false,
  willingToWorkWeekends: false,
  willingToTravel: true,
  calendarReady: false,
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 100000)}`;
}

function makeRoleProfile(expectationId: string): EngineerRoleProfile {
  const expectation = getRoleExpectation(expectationId);

  return {
    id: makeId("profile"),
    expectationId,
    enabled: true,
    maximumResponsibility: expectation.responsibilityBand,
    targetDayRate: expectation.responsibilityBand === "labour" ? 180 : expectation.responsibilityBand === "junior" ? 240 : expectation.responsibilityBand === "specialist" ? 550 : expectation.responsibilityBand === "lead" ? 600 : 350,
    willingToWorkAsSupport: expectation.responsibilityBand !== "specialist",
    willingToLead: expectation.canLeadOthers,
    specialistOnly: expectation.responsibilityBand === "specialist",
    skills: cloneSkillRequirements(expectation.requiredSkills).map((skill) => ({
      ...skill,
      selfLevel: skill.minimumLevel,
      evidenceNote: "",
    })),
    profileNote: "",
  };
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

function StepButton({
  number,
  label,
  active,
  onClick,
}: {
  number: Step;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border px-4 py-3 text-left transition",
        active
          ? "border-cyan-300 bg-cyan-300 text-slate-950"
          : "border-white/10 bg-slate-900 text-slate-300 hover:border-cyan-300/60",
      ].join(" ")}
    >
      <div className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">Step {number}</div>
      <div className="mt-1 text-sm font-bold">{label}</div>
    </button>
  );
}

function ToggleCard({
  active,
  title,
  detail,
  onClick,
}: {
  active: boolean;
  title: string;
  detail: string;
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

function readinessScore(readiness: ReadinessDetails) {
  const values = [
    readiness.hasRightToWork,
    readiness.hasPublicLiability,
    readiness.hasOwnTransport,
    readiness.hasOwnTools,
    readiness.hasLaptop,
    readiness.hasPpe,
    readiness.acceptsSiteRules,
    readiness.willingToTravel,
    readiness.calendarReady,
  ];

  return Math.round((values.filter(Boolean).length / values.length) * 100);
}

function profileScore(profiles: EngineerRoleProfile[]) {
  const activeProfiles = profiles.filter((profile) => profile.enabled);

  if (activeProfiles.length === 0) {
    return 0;
  }

  const totalSkills = activeProfiles.reduce((sum, profile) => sum + profile.skills.length, 0);
  const ratedSkills = activeProfiles.reduce(
    (sum, profile) => sum + profile.skills.filter((skill) => skill.selfLevel > 0).length,
    0
  );

  if (totalSkills === 0) {
    return 0;
  }

  return Math.round((ratedSkills / totalSkills) * 100);
}

type SubscriptionEstimate = {
  tierName: "Free" | "Starter" | "Pro" | "Unlimited";
  monthlyPrice: string;
  profileAllowance: string;
  paidProfileCount: number;
  totalProfileCount: number;
  specialistProfileCount: number;
  leadProfileCount: number;
  explanation: string;
  warnings: string[];
};

function getSubscriptionEstimate(profiles: EngineerRoleProfile[]): SubscriptionEstimate {
  const activeProfiles = profiles.filter((profile) => profile.enabled);

  const totalProfileCount = activeProfiles.length;

  const specialistProfileCount = activeProfiles.filter((profile) => {
    const expectation = getRoleExpectation(profile.expectationId);
    return expectation.responsibilityBand === "specialist" || profile.specialistOnly;
  }).length;

  const leadProfileCount = activeProfiles.filter((profile) => {
    const expectation = getRoleExpectation(profile.expectationId);
    return expectation.responsibilityBand === "lead" || profile.willingToLead;
  }).length;

  const paidProfileCount = activeProfiles.filter((profile) => {
    const expectation = getRoleExpectation(profile.expectationId);

    if (expectation.responsibilityBand === "labour") {
      return false;
    }

    if (expectation.responsibilityBand === "junior" && !profile.specialistOnly && !profile.willingToLead) {
      return false;
    }

    return true;
  }).length;

  const warnings: string[] = [];

  if (specialistProfileCount > 0) {
    warnings.push("Specialist profiles should require stronger evidence before they rank as strong matches.");
  }

  if (leadProfileCount > 0) {
    warnings.push("Lead profiles should require proof of site coordination, communication and delivery ownership.");
  }

  if (totalProfileCount > paidProfileCount) {
    warnings.push("Basic labour or junior support profiles are treated as low-cost access profiles in this estimate.");
  }

  if (paidProfileCount === 0) {
    return {
      tierName: "Free",
      monthlyPrice: "£0/month",
      profileAllowance: "Basic profile access",
      paidProfileCount,
      totalProfileCount,
      specialistProfileCount,
      leadProfileCount,
      explanation:
        "This looks like a free basic profile. Suitable for low-responsibility support visibility, but it should not rank strongly for specialist or lead opportunities.",
      warnings,
    };
  }

  if (paidProfileCount <= 3) {
    return {
      tierName: "Starter",
      monthlyPrice: "Indicative £9/month",
      profileAllowance: "Up to 3 paid role profiles",
      paidProfileCount,
      totalProfileCount,
      specialistProfileCount,
      leadProfileCount,
      explanation:
        "This suits an engineer with a small number of credible paid role profiles, such as AV installer, IT field engineer or one specialist focus.",
      warnings,
    };
  }

  if (paidProfileCount <= 8) {
    return {
      tierName: "Pro",
      monthlyPrice: "Indicative £19/month",
      profileAllowance: "Up to 8 paid role profiles",
      paidProfileCount,
      totalProfileCount,
      specialistProfileCount,
      leadProfileCount,
      explanation:
        "This suits a multi-skilled engineer who wants to be visible across several AV, IT, hybrid or specialist role profiles.",
      warnings,
    };
  }

  return {
    tierName: "Unlimited",
    monthlyPrice: "Indicative £39/month",
    profileAllowance: "Unlimited paid role profiles",
    paidProfileCount,
    totalProfileCount,
    specialistProfileCount,
    leadProfileCount,
    explanation:
      "This suits a broad technical profile, senior freelancer, small technical team or engineer who wants maximum role visibility.",
    warnings,
  };
}
export function EngineerSignUpWizard({ onCancel }: EngineerSignUpWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const [account, setAccount] = useState<AccountDetails>(defaultAccount);
  const [readiness, setReadiness] = useState<ReadinessDetails>(defaultReadiness);
  const [roleProfiles, setRoleProfiles] = useState<EngineerRoleProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [documentNotes, setDocumentNotes] = useState("");
  const [published, setPublished] = useState(false);

  const selectedProfile = roleProfiles.find((profile) => profile.id === selectedProfileId) || roleProfiles[0];

  const groupedExpectations = useMemo(() => {
    return {
      AV: roleExpectations.filter((item) => item.roleFamily === "AV"),
      IT: roleExpectations.filter((item) => item.roleFamily === "IT"),
      Hybrid: roleExpectations.filter((item) => item.roleFamily === "Hybrid"),
    };
  }, []);

  const activeProfiles = roleProfiles.filter((profile) => profile.enabled);
  const readinessPercent = readinessScore(readiness);
  const profilePercent = profileScore(roleProfiles);
  const subscription = getSubscriptionEstimate(roleProfiles);

  function addRoleProfile(expectationId: string) {
    if (roleProfiles.some((profile) => profile.expectationId === expectationId)) {
      const existing = roleProfiles.find((profile) => profile.expectationId === expectationId);

      if (existing) {
        setSelectedProfileId(existing.id);
      }

      return;
    }

    const next = makeRoleProfile(expectationId);
    setRoleProfiles((current) => current.includes(next) ? current.filter((id) => id !== next) : [...current, next]);
    setSelectedProfileId(next.id);
  }

  function updateProfile(id: string, patch: Partial<EngineerRoleProfile>) {
    setRoleProfiles((current) =>
      current.map((profile) => {
        if (profile.id !== id) {
          return profile;
        }

        return {
          ...profile,
          ...patch,
        };
      })
    );
  }

  function updateSkill(profileId: string, skillName: string, patch: Partial<EngineerSkill>) {
    setRoleProfiles((current) =>
      current.map((profile) => {
        if (profile.id !== profileId) {
          return profile;
        }

        return {
          ...profile,
          skills: profile.skills.map((skill) => {
            if (skill.skill !== skillName) {
              return skill;
            }

            return {
              ...skill,
              ...patch,
            };
          }),
        };
      })
    );
  }

  function publishProfile() {
    const draft = {
      account,
      readiness,
      roleProfiles: activeProfiles,
      documentNotes,
      publishedAt: new Date().toISOString(),
    };

    window.localStorage.setItem("techsubbies_engineer_onboarding_draft", JSON.stringify(draft, null, 2));
    setPublished(true);
  }

  return (
        <div className="min-h-screen ">
            <PersistentAppHeader />
            <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <header className="mb-6 rounded-3xl border border-cyan-300/20 bg-slate-900 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
                Engineer onboarding
              </p>
              <h1 className="mt-3 text-3xl font-bold text-white">
                Build a credible work-ready profile
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Set up your role profiles, real skill levels, evidence notes, site readiness and availability expectations. The same role rules are used when companies create opportunities.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center md:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-3">
                <div className="text-xl font-bold text-cyan-300">{activeProfiles.length}</div>
                <div className="text-xs text-slate-500">Role profiles</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-3">
                <div className="text-xl font-bold text-cyan-300">{profilePercent}%</div>
                <div className="text-xs text-slate-500">Skills rated</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-3">
                <div className="text-xl font-bold text-cyan-300">{readinessPercent}%</div>
                <div className="text-xs text-slate-500">Site ready</div>
              </div>
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3">
                <div className="text-lg font-bold text-cyan-200">{subscription.tierName}</div>
                <div className="text-xs text-slate-400">{subscription.monthlyPrice}</div>
              </div>
            </div>
          </div>
        </header>

        <nav className="mb-6 grid gap-3 md:grid-cols-6">
          <StepButton number={1} label="Identity" active={step === 1} onClick={() => setStep(1)} />
          <StepButton number={2} label="Readiness" active={step === 2} onClick={() => setStep(2)} />
          <StepButton number={3} label="Roles" active={step === 3} onClick={() => setStep(3)} />
          <StepButton number={4} label="Skills" active={step === 4} onClick={() => setStep(4)} />
          <StepButton number={5} label="Evidence" active={step === 5} onClick={() => setStep(5)} />
          <StepButton number={6} label="Review" active={step === 6} onClick={() => setStep(6)} />
        </nav>

        {step === 1 && (
          <main className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-xl font-bold text-cyan-300">1. Identity and trading details</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Capture enough information to create a profile that companies can trust before inviting you to site.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Full name">
                <input className={inputClass()} value={account.fullName} onChange={(event) => setAccount({ ...account, fullName: event.target.value })} />
              </Field>

              <Field label="Email">
                <input className={inputClass()} value={account.email} onChange={(event) => setAccount({ ...account, email: event.target.value })} />
              </Field>

              <Field label="Phone">
                <input className={inputClass()} value={account.phone} onChange={(event) => setAccount({ ...account, phone: event.target.value })} />
              </Field>

              <Field label="Business / trading name">
                <input className={inputClass()} value={account.businessName} onChange={(event) => setAccount({ ...account, businessName: event.target.value })} />
              </Field>

              <Field label="Trading status">
                <select className={selectClass()} value={account.tradingStatus} onChange={(event) => setAccount({ ...account, tradingStatus: event.target.value })}>
                  <option>Sole trader</option>
                  <option>Limited company</option>
                  <option>Umbrella / payroll</option>
                  <option>Agency / company engineer</option>
                  <option>Not set yet</option>
                </select>
              </Field>

              <Field label="Country">
                <input className={inputClass()} value={account.country} onChange={(event) => setAccount({ ...account, country: event.target.value })} />
              </Field>

              <Field label="Base location">
                <input className={inputClass()} value={account.baseLocation} onChange={(event) => setAccount({ ...account, baseLocation: event.target.value })} />
              </Field>

              <Field label="Postcode / ZIP">
                <input className={inputClass()} value={account.postcode} onChange={(event) => setAccount({ ...account, postcode: event.target.value })} />
              </Field>

              <Field label="Normal travel radius in miles">
                <input type="number" min={0} className={inputClass()} value={account.travelRadiusMiles} onChange={(event) => setAccount({ ...account, travelRadiusMiles: Number(event.target.value) })} />
              </Field>
            </div>

            <div className="mt-6 flex justify-between">
              {onCancel && (
                <button type="button" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 hover:border-cyan-300/60" onClick={() => { if (window.confirm('Are you sure? This will return you to the start of the signup process.')) { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}>Cancel</button>
              )}

              <button type="button" onClick={() => setStep(2)} className="ml-auto rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200">
                Continue to readiness
              </button>
            </div>
          </main>
        )}

        {step === 2 && (
          <main className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-xl font-bold text-cyan-300">2. Site readiness</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              This helps companies understand whether you can actually attend site, not just whether you have the right skill tags.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ToggleCard active={readiness.hasRightToWork} title="Right to work" detail="You can legally work in the country you are accepting jobs in." onClick={() => setReadiness({ ...readiness, hasRightToWork: !readiness.hasRightToWork })} />
              <ToggleCard active={readiness.hasPublicLiability} title="Public liability" detail="You hold or can provide valid public liability insurance." onClick={() => setReadiness({ ...readiness, hasPublicLiability: !readiness.hasPublicLiability })} />
              <ToggleCard active={readiness.hasProfessionalIndemnity} title="Professional indemnity" detail="Useful for design, consultancy or higher-risk specialist work." onClick={() => setReadiness({ ...readiness, hasProfessionalIndemnity: !readiness.hasProfessionalIndemnity })} />
              <ToggleCard active={readiness.hasOwnTransport} title="Own transport" detail="You can travel to site without relying on the hiring company." onClick={() => setReadiness({ ...readiness, hasOwnTransport: !readiness.hasOwnTransport })} />
              <ToggleCard active={readiness.hasOwnTools} title="Own tools" detail="You have normal tools expected for your selected roles." onClick={() => setReadiness({ ...readiness, hasOwnTools: !readiness.hasOwnTools })} />
              <ToggleCard active={readiness.hasLaptop} title="Laptop" detail="Required for commissioning, IT support, programming and admin tasks." onClick={() => setReadiness({ ...readiness, hasLaptop: !readiness.hasLaptop })} />
              <ToggleCard active={readiness.hasPpe} title="PPE" detail="You have normal PPE for site attendance." onClick={() => setReadiness({ ...readiness, hasPpe: !readiness.hasPpe })} />
              <ToggleCard active={readiness.acceptsSiteRules} title="Accept site rules" detail="You understand site packs, RAMS, induction and escalation discipline." onClick={() => setReadiness({ ...readiness, acceptsSiteRules: !readiness.acceptsSiteRules })} />
              <ToggleCard active={readiness.calendarReady} title="Calendar ready" detail="You are willing to keep availability accurate for matching." onClick={() => setReadiness({ ...readiness, calendarReady: !readiness.calendarReady })} />
              <ToggleCard active={readiness.willingToWorkNights} title="Night work" detail="You are willing to be considered for night work." onClick={() => setReadiness({ ...readiness, willingToWorkNights: !readiness.willingToWorkNights })} />
              <ToggleCard active={readiness.willingToWorkWeekends} title="Weekend work" detail="You are willing to be considered for weekend work." onClick={() => setReadiness({ ...readiness, willingToWorkWeekends: !readiness.willingToWorkWeekends })} />
              <ToggleCard active={readiness.willingToTravel} title="Travel" detail="You are willing to travel beyond your normal local area when agreed." onClick={() => setReadiness({ ...readiness, willingToTravel: !readiness.willingToTravel })} />
            </div>

            <div className="mt-6 flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 hover:border-cyan-300/60">
                Back
              </button>
              <button type="button" onClick={() => setStep(3)} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200">
                Continue to roles
              </button>
            </div>
          </main>
        )}

        {step === 3 && (
          <main className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-xl font-bold text-cyan-300">3. Choose your role profiles</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Select the roles you genuinely want to be matched for. You can accept basic support work separately without overstating specialist ability.
            </p>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {(["AV", "IT", "Hybrid"] as const).map((family) => (
                <section key={family} className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <h3 className="font-bold text-cyan-300">{family} roles</h3>
                  <div className="mt-4 space-y-2">
                    {groupedExpectations[family].map((expectation) => {
                      const added = roleProfiles.some((profile) => profile.expectationId === expectation.id);

                      return (
                        <button
                          key={expectation.id}
                          type="button"
                          onClick={() => addRoleProfile(expectation.id)}
                          className={[
                            "w-full rounded-xl border p-3 text-left text-sm transition",
                            added
                              ? "border-cyan-300 bg-cyan-300 text-slate-950"
                              : "border-white/10 bg-slate-900 text-slate-300 hover:border-cyan-300/60",
                          ].join(" ")}
                        >
                          <div className="font-bold">{expectation.roleTitle}</div>
                          <div className="mt-1 text-xs opacity-75">
                            {responsibilityBandLabels[expectation.responsibilityBand]}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
              <h3 className="font-bold text-cyan-200">Selected profiles</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeProfiles.map((profile) => {
                  const expectation = getRoleExpectation(profile.expectationId);

                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => setSelectedProfileId((current) => current === profile.id ? "" : profile.id)}
                      className="rounded-full border border-cyan-300/30 bg-slate-950 px-3 py-2 text-xs font-semibold text-cyan-100"
                    >
                      {expectation.roleTitle}
                    </button>
                  );
                })}
              </div>
            </div>

            <section className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="font-bold text-cyan-200">Expected subscription tier</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {subscription.explanation}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950 p-4 text-right">
                  <div className="text-2xl font-bold text-white">{subscription.tierName}</div>
                  <div className="mt-1 text-sm font-semibold text-cyan-200">{subscription.monthlyPrice}</div>
                  <div className="mt-1 text-xs text-slate-500">{subscription.profileAllowance}</div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-slate-950 p-3">
                  <div className="text-lg font-bold text-white">{subscription.totalProfileCount}</div>
                  <div className="text-xs text-slate-500">Visible profiles</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950 p-3">
                  <div className="text-lg font-bold text-white">{subscription.paidProfileCount}</div>
                  <div className="text-xs text-slate-500">Paid profiles</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950 p-3">
                  <div className="text-lg font-bold text-white">{subscription.specialistProfileCount}</div>
                  <div className="text-xs text-slate-500">Specialist profiles</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950 p-3">
                  <div className="text-lg font-bold text-white">{subscription.leadProfileCount}</div>
                  <div className="text-xs text-slate-500">Lead profiles</div>
                </div>
              </div>

              {subscription.warnings.length > 0 && (
                <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                  <div className="text-sm font-bold text-amber-100">Pricing and verification notes</div>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-amber-50">
                    {subscription.warnings.map((warning) => (
                      <li key={warning}>€¢ {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Pricing is indicative and should later be moved into a shared pricing rules file with regional/local-market adjustments.
              </p>
            </section>
            <div className="mt-6 flex justify-between">
              <button type="button" onClick={() => setStep(2)} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 hover:border-cyan-300/60">
                Back
              </button>
              <button type="button" onClick={() => setStep(4)} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200">
                Continue to skills
              </button>
            </div>
          </main>
        )}

        {step === 4 && selectedProfile && (
          <main className="grid gap-5 lg:grid-cols-[320px_1fr]">
            <aside className="rounded-3xl border border-white/10 bg-slate-900 p-5">
              <h2 className="text-lg font-bold text-cyan-300">4. Configure role skills</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Rate yourself honestly. Companies will see gaps, evidence and responsibility limits.
              </p>

              <div className="mt-5 space-y-3">
                {activeProfiles.map((profile) => {
                  const expectation = getRoleExpectation(profile.expectationId);

                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => setSelectedProfileId((current) => current === profile.id ? "" : profile.id)}
                      className={[
                        "w-full rounded-2xl border p-4 text-left transition",
                        selectedProfile.id === profile.id
                          ? "border-cyan-300 bg-cyan-300 text-slate-950"
                          : "border-white/10 bg-slate-950 text-slate-300 hover:border-cyan-300/60",
                      ].join(" ")}
                    >
                      <div className="font-bold">{expectation.roleTitle}</div>
                      <div className="mt-1 text-xs opacity-75">
                        {profile.skills.length} skills
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              {(() => {
                const expectation = getRoleExpectation(selectedProfile.expectationId);

                return (
                  <>
                    <h2 className="text-xl font-bold text-cyan-300">{expectation.roleTitle}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                      {expectation.responsibilityStatement}
                    </p>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <Field label="Maximum responsibility">
                        <select
                          className={selectClass()}
                          value={selectedProfile.maximumResponsibility}
                          onChange={(event) =>
                            updateProfile(selectedProfile.id, {
                              maximumResponsibility: event.target.value as ResponsibilityBand,
                            })
                          }
                        >
                          {Object.keys(responsibilityBandLabels).map((band) => (
                            <option key={band} value={band}>
                              {responsibilityBandLabels[band as ResponsibilityBand]}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Target day rate">
                        <input
                          type="number"
                          min={0}
                          className={inputClass()}
                          value={selectedProfile.targetDayRate}
                          onChange={(event) => updateProfile(selectedProfile.id, { targetDayRate: Number(event.target.value) })}
                        />
                      </Field>

                      <Field label="Role visibility">
                        <select
                          className={selectClass()}
                          value={selectedProfile.enabled ? "enabled" : "disabled"}
                          onChange={(event) => updateProfile(selectedProfile.id, { enabled: event.target.value === "enabled" })}
                        >
                          <option value="enabled">Visible for matching</option>
                          <option value="disabled">Keep as draft</option>
                        </select>
                      </Field>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <ToggleCard active={selectedProfile.willingToWorkAsSupport} title="Accept support work" detail="Allow lower-responsibility support work when available." onClick={() => updateProfile(selectedProfile.id, { willingToWorkAsSupport: !selectedProfile.willingToWorkAsSupport })} />
                      <ToggleCard active={selectedProfile.willingToLead} title="Willing to lead" detail="Only enable if you can supervise others and own site delivery." onClick={() => updateProfile(selectedProfile.id, { willingToLead: !selectedProfile.willingToLead })} />
                      <ToggleCard active={selectedProfile.specialistOnly} title="Specialist-only" detail="Avoid generic labour matches for this profile." onClick={() => updateProfile(selectedProfile.id, { specialistOnly: !selectedProfile.specialistOnly })} />
                    </div>

                    <div className="mt-6 space-y-3">
                      {selectedProfile.skills.map((skill) => (
                        <article key={skill.skill} className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="font-bold text-white">{skill.skill}</h3>
                              <p className="mt-1 text-xs text-slate-500">
                                Role expects minimum level {skill.minimumLevel}. Your profile level is {skill.selfLevel}.
                              </p>
                            </div>

                            {skill.selfLevel < skill.minimumLevel && (
                              <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-xs font-bold text-amber-100">
                                Below role expectation
                              </span>
                            )}
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <Field label="Your level">
                              <select
                                className={selectClass()}
                                value={skill.selfLevel}
                                onChange={(event) =>
                                  updateSkill(selectedProfile.id, skill.skill, {
                                    selfLevel: Number(event.target.value) as EngineerSkill["selfLevel"],
                                  })
                                }
                              >
                                <option value={0}>0 - Not claimed</option>
                                <option value={1}>1 - Aware</option>
                                <option value={2}>2 - Assisted</option>
                                <option value={3}>3 - Competent</option>
                                <option value={4}>4 - Advanced</option>
                                <option value={5}>5 - Lead / specialist</option>
                              </select>
                            </Field>

                            <Field label="Evidence note" hint="Example: project type, certification, supervisor sign-off, previous install, client reference.">
                              <input
                                className={inputClass()}
                                value={skill.evidenceNote}
                                onChange={(event) => updateSkill(selectedProfile.id, skill.skill, { evidenceNote: event.target.value })}
                                placeholder="Optional evidence note"
                              />
                            </Field>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="mt-5">
                      <Field label="Profile note" hint="Explain what you are comfortable doing in this role and what should be excluded.">
                        <textarea
                          className={textareaClass()}
                          value={selectedProfile.profileNote}
                          onChange={(event) => updateProfile(selectedProfile.id, { profileNote: event.target.value })}
                        />
                      </Field>
                    </div>
                  </>
                );
              })()}

              <div className="mt-6 flex justify-between">
                <button type="button" onClick={() => setStep(3)} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 hover:border-cyan-300/60">
                  Back
                </button>
                <button type="button" onClick={() => setStep(5)} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200">
                  Continue to evidence
                </button>
              </div>
            </section>
          </main>
        )}

        {step === 5 && (
          <main className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-xl font-bold text-cyan-300">5. Evidence and documents</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              This stage records what the engineer needs to prove later. In the live backend this should connect to secure document upload and verification.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <section className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                <h3 className="font-bold text-cyan-200">Documents to prepare</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  <li>€¢ Photo ID / identity verification</li>
                  <li>€¢ Right-to-work evidence where required</li>
                  <li>€¢ Public liability insurance</li>
                  <li>€¢ Professional indemnity if offering design, consultancy or specialist commissioning</li>
                  <li>€¢ ECS/CSCS or local equivalent where construction-site access is needed</li>
                  <li>€¢ IPAF/PASMA or local equivalent where working at height is expected</li>
                  <li>€¢ Vendor certifications, project references and examples of completed work</li>
                </ul>
              </section>

              <section className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                <h3 className="font-bold text-cyan-200">Verification rules</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  <li>€¢ Self-rating is allowed but should be marked as unverified.</li>
                  <li>€¢ Specialist roles should require evidence before strong-match ranking.</li>
                  <li>€¢ Site-readiness documents need expiry dates.</li>
                  <li>€¢ Company feedback should update skill confidence after each job.</li>
                  <li>€¢ Tags should never override skill level, evidence or compliance.</li>
                </ul>
              </section>
            </div>

            <div className="mt-5">
              <Field label="Document and evidence notes">
                <textarea
                  className={textareaClass()}
                  value={documentNotes}
                  onChange={(event) => setDocumentNotes(event.target.value)}
                  placeholder="Example: CTS held, Dante Level 2, public liability expires March 2027, has laptop and cable tester..."
                />
              </Field>
            </div>

            <div className="mt-6 flex justify-between">
              <button type="button" onClick={() => setStep(4)} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 hover:border-cyan-300/60">
                Back
              </button>
              <button type="button" onClick={() => setStep(6)} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200">
                Review profile
              </button>
            </div>
          </main>
        )}

        {step === 6 && (
          <main className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-xl font-bold text-cyan-300">6. Review and publish</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              This is the profile package that should feed matching: identity, readiness, role profiles, skill levels, evidence and responsibility limits.
            </p>

            {published && (
              <div className="mt-5 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-4 text-sm font-semibold text-emerald-100">
                Draft profile saved locally. Backend save/publish can be connected next.
              </div>
            )}

            <section className="mt-6 rounded-2xl border border-white/10 bg-slate-950 p-5">
              <h3 className="font-bold text-white">{account.fullName || "Unnamed engineer"}</h3>
              <div className="mt-3 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
                <div>Email: {account.email || "Not set"}</div>
                <div>Phone: {account.phone || "Not set"}</div>
                <div>Business: {account.businessName || "Not set"}</div>
                <div>Status: {account.tradingStatus}</div>
                <div>Location: {account.baseLocation || "Not set"}</div>
                <div>Travel radius: {account.travelRadiusMiles} miles</div>
              </div>
            </section>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <section className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                <h3 className="font-bold text-cyan-200">Readiness</h3>
                <div className="mt-3 text-3xl font-bold text-white">{readinessPercent}%</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  This is not a final compliance approval. It tells companies how close the engineer is to site-ready.
                </p>
              </section>

              <section className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                <h3 className="font-bold text-cyan-200">Role profiles</h3>
                <div className="mt-3 text-3xl font-bold text-white">{activeProfiles.length}</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Each role profile carries its own responsibility level, skills, evidence and rate expectation.
                </p>
              </section>
            </div>

            <div className="mt-5 space-y-4">
              {activeProfiles.map((profile) => {
                const expectation = getRoleExpectation(profile.expectationId);
                const belowExpectation = profile.skills.filter((skill) => skill.selfLevel < skill.minimumLevel);

                return (
                  <section key={profile.id} className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="font-bold text-white">{expectation.roleTitle}</h3>
                        <p className="mt-1 text-sm text-cyan-200">
                          Max responsibility: {responsibilityBandLabels[profile.maximumResponsibility]} · £{profile.targetDayRate}/day
                        </p>
                      </div>

                      {belowExpectation.length > 0 && (
                        <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-xs font-bold text-amber-100">
                          {belowExpectation.length} gap(s)
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {responsibilityBandDescriptions[profile.maximumResponsibility]}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill.skill}
                          className={[
                            "rounded-full border px-3 py-2 text-xs font-semibold",
                            skill.selfLevel >= skill.minimumLevel
                              ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
                              : "border-amber-300/30 bg-amber-300/10 text-amber-100",
                          ].join(" ")}
                        >
                          {skill.skill}: L{skill.selfLevel}
                        </span>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            <section className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="font-bold text-cyan-200">Subscription expectation</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{subscription.explanation}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    This estimate is based on visible paid profiles, specialist profiles and lead responsibility settings.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950 p-4 text-right">
                  <div className="text-2xl font-bold text-white">{subscription.tierName}</div>
                  <div className="mt-1 text-sm font-semibold text-cyan-200">{subscription.monthlyPrice}</div>
                  <div className="mt-1 text-xs text-slate-500">{subscription.profileAllowance}</div>
                </div>
              </div>
            </section>
            <div className="mt-6 flex justify-between">
              <button type="button" onClick={() => setStep(5)} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 hover:border-cyan-300/60">
                Back
              </button>

              <button type="button" onClick={publishProfile} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200">
                Save draft profile
              </button>
            </div>
          </main>
        )}
      </div>
    </div>
          </div>
    );
}

export default EngineerSignUpWizard;



