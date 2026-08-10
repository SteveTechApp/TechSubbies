import React, { useMemo, useState } from "react";
import {
  cloneSkillRequirements,
  getRoleExpectation,
  responsibilityBandLabels,
  roleExpectations,
  type RoleExpectation,
  type SkillRequirement,
} from "../data/roleExpectations";

type Step = 1 | 2 | 3 | 4;

type ProjectDetails = {
  projectName: string;
  clientName: string;
  siteLocation: string;
  startDate: string;
  finishDate: string;
  projectType: string;
  environment: string;
  workingHours: string;
  requiresWorkingAtHeight: boolean;
  requiresConstructionAccess: boolean;
  requiresSecureSiteAccess: boolean;
  notes: string;
};

type EngineerNeed = {
  id: string;
  expectationId: string;
  quantity: number;
  dayRate: number;
  durationDays: number;
  startDate: string;
  finishDate: string;
  siteLocation: string;
  workingHours: string;
  workingArrangement: "supervised" | "independent" | "lead";
  skills: SkillRequirement[];
  tags: string;
  expectationsAccepted: boolean;
};

const emptyProject: ProjectDetails = {
  projectName: "",
  clientName: "",
  siteLocation: "",
  startDate: "",
  finishDate: "",
  projectType: "Corporate AV",
  environment: "Occupied site",
  workingHours: "Normal working hours",
  requiresWorkingAtHeight: false,
  requiresConstructionAccess: false,
  requiresSecureSiteAccess: false,
  notes: "",
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 100000)}`;
}

function scheduledDurationDays(startDate: string, finishDate: string, workingHours: string) {
  if (!startDate || !finishDate) return 1;
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const finish = Date.parse(`${finishDate}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(finish) || finish < start) return 1;

  const includesWeekends = workingHours === "Weekend work" || workingHours === "Normal + weekend work" || workingHours === "Mixed hours";
  let days = 0;

  for (let timestamp = start; timestamp <= finish; timestamp += 86400000) {
    const day = new Date(timestamp).getUTCDay();
    if (includesWeekends || (day !== 0 && day !== 6)) days += 1;
  }

  return Math.max(1, days);
}

function makeNeed(project: ProjectDetails, expectationId = roleExpectations[0].id): EngineerNeed {
  const expectation = getRoleExpectation(expectationId);

  return {
    id: makeId("need"),
    expectationId,
    quantity: 1,
    dayRate: 350,
    durationDays: scheduledDurationDays(project.startDate, project.finishDate, project.workingHours),
    startDate: project.startDate,
    finishDate: project.finishDate,
    siteLocation: project.siteLocation,
    workingHours: project.workingHours,
    workingArrangement: expectation.canLeadOthers ? "lead" : expectation.canWorkAlone ? "independent" : "supervised",
    skills: cloneSkillRequirements(expectation.requiredSkills),
    tags: "",
    expectationsAccepted: false,
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
  disabled = false,
  onClick,
}: {
  number: Step;
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "rounded-2xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40",
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

function expectationWarnings(need: EngineerNeed, expectation: RoleExpectation, project: ProjectDetails): string[] {
  const warnings: string[] = [];

  if (!expectation.canWorkAlone && need.workingArrangement !== "supervised") {
    warnings.push("This role should normally be supervised. Do not treat it as a sole responsible engineer role.");
  }

  if (need.workingArrangement === "lead" && !expectation.canLeadOthers) {
    warnings.push("This role has been set as lead, but the selected expectation is not a lead responsibility template.");
  }

  if (expectation.requiresEvidence) {
    warnings.push("Evidence should be checked before confirming this engineer, such as previous work, certification, supervisor sign-off or project references.");
  }

  if (project.requiresConstructionAccess) {
    warnings.push("Construction access is required. Check ECS/CSCS or local equivalent, PPE, RAMS and site induction requirements.");
  }

  if (project.requiresWorkingAtHeight) {
    warnings.push("Working at height is required. Check IPAF, PASMA, ladder competence or local equivalent as appropriate.");
  }

  if (project.requiresSecureSiteAccess) {
    warnings.push("Secure site access is required. Check ID, right-to-work, onboarding, confidentiality and site clearance requirements.");
  }

  return [...warnings, ...expectation.mismatchWarnings];
}

function supervisionGaps(needs: EngineerNeed[]) {
  return needs.filter((need) => {
    const expectation = getRoleExpectation(need.expectationId);
    if (expectation.canWorkAlone && !expectation.requiresNamedSupervisor) return false;

    return !needs.some((candidate) => {
      if (candidate.id === need.id) return false;
      const supervisor = getRoleExpectation(candidate.expectationId);
      const compatibleFamily = supervisor.roleFamily === expectation.roleFamily || supervisor.roleFamily === "Hybrid";
      return compatibleFamily && supervisor.canLeadOthers && ["senior", "lead"].includes(supervisor.responsibilityBand);
    });
  });
}

export default function LiveOpportunityIntakePage() {
  const [step, setStep] = useState<Step>(1);
  const [project, setProject] = useState<ProjectDetails>(emptyProject);
  const [needs, setNeeds] = useState<EngineerNeed[]>([]);
  const [selectedNeedId, setSelectedNeedId] = useState<string>("");
  const [needDraft, setNeedDraft] = useState<EngineerNeed | null>(null);
  const [usesExternalSupervision, setUsesExternalSupervision] = useState(false);
  const [externalSupervisorName, setExternalSupervisorName] = useState("");
  const [newSkillName, setNewSkillName] = useState("");

  const selectedNeed = needs.find((need) => need.id === selectedNeedId);
  const selectedExpectation = selectedNeed ? getRoleExpectation(selectedNeed.expectationId) : null;

  const totalEngineerDays = useMemo(() => {
    return needs.reduce((sum, need) => sum + need.quantity * need.durationDays, 0);
  }, [needs]);

  const labourBudget = useMemo(() => {
    return needs.reduce((sum, need) => sum + need.quantity * need.durationDays * need.dayRate, 0);
  }, [needs]);
  const uncoveredSupervisedNeeds = useMemo(() => supervisionGaps(needs), [needs]);
  const hasConfirmedExternalSupervisor = usesExternalSupervision && Boolean(externalSupervisorName.trim());
  const labourTeamReady = needs.length > 0 && (uncoveredSupervisedNeeds.length === 0 || hasConfirmedExternalSupervisor);
  const basicExpectationsAccepted = needs.every((need) => {
    const expectation = getRoleExpectation(need.expectationId);
    return expectation.responsibilityBand !== "labour" || need.expectationsAccepted;
  });
  const reviewReady = labourTeamReady && basicExpectationsAccepted;

  const projectReadiness = useMemo(() => {
    const values = [
      project.projectName,
      project.clientName,
      project.siteLocation,
      project.startDate,
      project.finishDate,
      project.projectType,
      project.environment,
      project.workingHours,
    ];

    return Math.round((values.filter(Boolean).length / values.length) * 100);
  }, [project]);

  const groupedExpectations = useMemo(() => {
    return {
      AV: roleExpectations.filter((item) => item.roleFamily === "AV"),
      IT: roleExpectations.filter((item) => item.roleFamily === "IT"),
      Hybrid: roleExpectations.filter((item) => item.roleFamily === "Hybrid"),
    };
  }, []);

  function updateNeed(id: string, patch: Partial<EngineerNeed>) {
    setNeeds((current) =>
      current.map((need) => {
        if (need.id !== id) {
          return need;
        }

        return {
          ...need,
          ...patch,
        };
      })
    );
  }

  function addNeed() {
    setNeedDraft(makeNeed(project));
  }

  function editNeed(need: EngineerNeed) {
    setNeedDraft({ ...need, skills: cloneSkillRequirements(need.skills) });
  }

  function updateNeedDraft(patch: Partial<EngineerNeed>) {
    setNeedDraft((current) => current ? { ...current, ...patch } : current);
  }

  function updateNeedDraftDate(field: "startDate" | "finishDate", value: string) {
    setNeedDraft((current) => {
      if (!current) return current;
      const dates = { startDate: current.startDate, finishDate: current.finishDate, [field]: value };
      return { ...current, ...dates, durationDays: scheduledDurationDays(dates.startDate, dates.finishDate, current.workingHours) };
    });
  }

  function changeDraftExpectation(expectationId: string) {
    const expectation = getRoleExpectation(expectationId);
    updateNeedDraft({
      expectationId,
      workingArrangement: expectation.canLeadOthers ? "lead" : expectation.canWorkAlone ? "independent" : "supervised",
      skills: cloneSkillRequirements(expectation.requiredSkills),
      expectationsAccepted: false,
    });
  }

  function saveNeedDraft() {
    if (!needDraft) return;

    setNeeds((current) => {
      const exists = current.some((need) => need.id === needDraft.id);
      return exists
        ? current.map((need) => need.id === needDraft.id ? needDraft : need)
        : [...current, needDraft];
    });
    setSelectedNeedId(needDraft.id);
    setNeedDraft(null);
  }

  function removeNeed(id: string) {
    const remaining = needs.filter((need) => need.id !== id);

    setNeeds(remaining);
    setSelectedNeedId((current) => current === id ? (remaining[0]?.id || "") : current);
    setNeedDraft((current) => current?.id === id ? null : current);
  }

  function updateSkill(skillName: string, patch: Partial<SkillRequirement>) {
    if (!selectedNeed) {
      return;
    }

    updateNeed(selectedNeed.id, {
      skills: selectedNeed.skills.map((skill) => {
        if (skill.skill !== skillName) {
          return skill;
        }

        return {
          ...skill,
          ...patch,
        };
      }),
    });
  }

  function removeSkill(skillName: string) {
    if (!selectedNeed) {
      return;
    }

    updateNeed(selectedNeed.id, {
      skills: selectedNeed.skills.filter((skill) => skill.skill !== skillName),
    });
  }

  function addSkill() {
    if (!selectedNeed) {
      return;
    }

    const cleanName = newSkillName.trim();

    if (!cleanName) {
      return;
    }

    if (selectedNeed.skills.some((skill) => skill.skill.toLowerCase() === cleanName.toLowerCase())) {
      setNewSkillName("");
      return;
    }

    updateNeed(selectedNeed.id, {
      skills: [
        ...selectedNeed.skills,
        {
          skill: cleanName,
          minimumLevel: 3,
          importance: 3,
        },
      ],
    });

    setNewSkillName("");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <header className="mb-6 rounded-3xl border border-cyan-300/20 bg-slate-900 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
                Post a Project
              </p>
              <h1 className="mt-3 text-3xl font-bold text-white">
                Match the right responsibility level
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Select the role and responsibility band first. TechSubbies then applies the correct expectations for junior, competent, senior, lead and specialist work.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-3">
                <div className="text-xl font-bold text-cyan-300">{projectReadiness}%</div>
                <div className="text-xs text-slate-500">Project ready</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-3">
                <div className="text-xl font-bold text-cyan-300">{totalEngineerDays}</div>
                <div className="text-xs text-slate-500">Engineer days</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-3">
                <div className="text-xl font-bold text-cyan-300">£{labourBudget.toLocaleString()}</div>
                <div className="text-xs text-slate-500">Labour budget</div>
              </div>
            </div>
          </div>
        </header>

        <nav className="mb-6 grid gap-3 md:grid-cols-4">
          <StepButton number={1} label="Project basics" active={step === 1} onClick={() => setStep(1)} />
          <StepButton number={2} label="Labour workspace" active={step === 2} onClick={() => setStep(2)} />
          <StepButton number={3} label="Skill levels" active={step === 3} disabled={!labourTeamReady} onClick={() => { setSelectedNeedId(selectedNeedId || needs[0]?.id || ""); setStep(3); }} />
          <StepButton number={4} label="Review exchange" active={step === 4} disabled={!reviewReady} onClick={() => setStep(4)} />
        </nav>

        {step === 1 && (
          <main className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-xl font-bold text-cyan-300">1. Project basics</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Capture the site conditions first. These can increase the required level of professionalism, evidence and compliance.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Project name">
                <input className={inputClass()} value={project.projectName} onChange={(event) => setProject({ ...project, projectName: event.target.value })} />
              </Field>

              <Field label="Client / company">
                <input className={inputClass()} value={project.clientName} onChange={(event) => setProject({ ...project, clientName: event.target.value })} />
              </Field>

              <Field label="Site location">
                <input className={inputClass()} value={project.siteLocation} onChange={(event) => setProject({ ...project, siteLocation: event.target.value })} />
              </Field>

              <Field label="Project type">
                <select className={selectClass()} value={project.projectType} onChange={(event) => setProject({ ...project, projectType: event.target.value })}>
                  <option>Corporate AV</option>
                  <option>Education AV</option>
                  <option>Hospitality AV</option>
                  <option>Retail / signage</option>
                  <option>UC / VC rooms</option>
                  <option>IT deployment</option>
                  <option>Network refresh</option>
                  <option>Mixed AV and IT project</option>
                </select>
              </Field>

              <Field label="Project start date">
                <input type="date" className={inputClass()} value={project.startDate} onChange={(event) => setProject({ ...project, startDate: event.target.value })} />
              </Field>

              <Field label="Project finish date">
                <input type="date" min={project.startDate || undefined} className={inputClass()} value={project.finishDate} onChange={(event) => setProject({ ...project, finishDate: event.target.value })} />
              </Field>

              <Field label="Site environment">
                <select className={selectClass()} value={project.environment} onChange={(event) => setProject({ ...project, environment: event.target.value })}>
                  <option>Occupied site</option>
                  <option>Construction site</option>
                  <option>Out of hours only</option>
                  <option>Live customer environment</option>
                  <option>Secure site</option>
                  <option>Multi-site rollout</option>
                </select>
              </Field>

              <Field label="Working hours">
                <select className={selectClass()} value={project.workingHours} onChange={(event) => setProject({ ...project, workingHours: event.target.value })}>
                  <option>Normal working hours</option>
                  <option>Evening work</option>
                  <option>Night work</option>
                  <option>Normal + weekend work</option>
                  <option>Mixed hours</option>
                </select>
              </Field>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <button
                type="button"
                onClick={() => setProject({ ...project, requiresConstructionAccess: !project.requiresConstructionAccess })}
                className={[
                  "rounded-2xl border p-4 text-left text-sm font-semibold",
                  project.requiresConstructionAccess ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-white/10 bg-slate-950 text-slate-300",
                ].join(" ")}
              >
                Construction access required
              </button>

              <button
                type="button"
                onClick={() => setProject({ ...project, requiresWorkingAtHeight: !project.requiresWorkingAtHeight })}
                className={[
                  "rounded-2xl border p-4 text-left text-sm font-semibold",
                  project.requiresWorkingAtHeight ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-white/10 bg-slate-950 text-slate-300",
                ].join(" ")}
              >
                Working at height involved
              </button>

              <button
                type="button"
                onClick={() => setProject({ ...project, requiresSecureSiteAccess: !project.requiresSecureSiteAccess })}
                className={[
                  "rounded-2xl border p-4 text-left text-sm font-semibold",
                  project.requiresSecureSiteAccess ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-white/10 bg-slate-950 text-slate-300",
                ].join(" ")}
              >
                Secure site / onboarding
              </button>
            </div>

            <div className="mt-6">
              <Field label="Project notes">
                <textarea className={textareaClass()} value={project.notes} onChange={(event) => setProject({ ...project, notes: event.target.value })} />
              </Field>
            </div>

            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setStep(2)} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200">
                Continue to labour workspace
              </button>
            </div>
          </main>
        )}

        {step === 2 && (
          <main className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <div>
              <h2 className="text-xl font-bold text-cyan-300">2. Labour workspace</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Build the project team one engineer type at a time. Each saved allocation becomes a card that you can reopen and edit.
              </p>
            </div>

            {needs.length === 0 && !needDraft && (
              <section className="mt-6 flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-300/30 bg-slate-950/60 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-3xl font-black text-cyan-200">+</div>
                <h3 className="mt-5 text-xl font-bold text-white">Start building your project team</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">Add the first engineer type, set the quantity, dates and responsibility level, then save it to this workspace.</p>
                <button type="button" onClick={addNeed} className="mt-6 rounded-xl bg-cyan-300 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-200">
                  Add Engineer
                </button>
              </section>
            )}

            {needs.length > 0 && (
              <section className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {needs.map((need) => {
                    const expectation = getRoleExpectation(need.expectationId);
                    return (
                      <button key={need.id} type="button" onClick={() => editNeed(need)} className="group rounded-2xl border border-white/10 bg-slate-950 p-5 text-left transition hover:border-cyan-300/60 hover:bg-cyan-300/5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950">{expectation.roleFamily}</div>
                          <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-400 group-hover:text-cyan-200">Edit</span>
                        </div>
                        <h3 className="mt-4 font-bold text-white">{expectation.roleTitle}</h3>
                        <p className="mt-1 text-sm text-cyan-200">{need.quantity} engineer{need.quantity === 1 ? "" : "s"} · {need.durationDays} day{need.durationDays === 1 ? "" : "s"}</p>
                        <p className="mt-3 text-xs leading-5 text-slate-500">£{need.dayRate}/day · {responsibilityBandLabels[expectation.responsibilityBand]}</p>
                        {(need.startDate || need.siteLocation) && <p className="mt-2 text-xs leading-5 text-slate-500">{need.startDate || "Date not set"}{need.finishDate ? ` to ${need.finishDate}` : ""}{need.siteLocation ? ` · ${need.siteLocation}` : ""}</p>}
                      </button>
                    );
                  })}

                  <button type="button" onClick={addNeed} className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-300/30 bg-slate-950/40 p-5 text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-300/10">
                    <span className="text-3xl font-light">+</span>
                    <span className="mt-2 font-bold">Add Engineer</span>
                  </button>
                </div>
              </section>
            )}

            {needDraft && (() => {
              const expectation = getRoleExpectation(needDraft.expectationId);
              const existing = needs.some((need) => need.id === needDraft.id);
              const warnings = expectationWarnings(needDraft, expectation, project);
              return (
                <section className="mt-6 rounded-2xl border border-cyan-300/25 bg-slate-950 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">{existing ? "Edit engineer type" : "New engineer type"}</p>
                      <h3 className="mt-2 text-lg font-bold text-white">{expectation.roleTitle}</h3>
                    </div>
                    {existing && <button type="button" onClick={() => removeNeed(needDraft.id)} className="rounded-xl border border-red-300/40 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-300/10">Remove</button>}
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <Field label="Engineer type">
                      <select className={selectClass()} value={needDraft.expectationId} onChange={(event) => changeDraftExpectation(event.target.value)}>
                        <optgroup label="AV roles">{groupedExpectations.AV.map((item) => <option key={item.id} value={item.id}>{item.roleTitle}</option>)}</optgroup>
                        <optgroup label="IT roles">{groupedExpectations.IT.map((item) => <option key={item.id} value={item.id}>{item.roleTitle}</option>)}</optgroup>
                        <optgroup label="Hybrid roles">{groupedExpectations.Hybrid.map((item) => <option key={item.id} value={item.id}>{item.roleTitle}</option>)}</optgroup>
                      </select>
                    </Field>
                    <Field label="Engineers needed"><input type="number" min={1} className={inputClass()} value={needDraft.quantity} onChange={(event) => updateNeedDraft({ quantity: Number(event.target.value) })} /></Field>
                    <Field label="Day rate"><input type="number" min={0} className={inputClass()} value={needDraft.dayRate} onChange={(event) => updateNeedDraft({ dayRate: Number(event.target.value) })} /></Field>
                    <Field label="Duration in days"><input type="number" min={1} className={inputClass()} value={needDraft.durationDays} onChange={(event) => updateNeedDraft({ durationDays: Number(event.target.value) })} /></Field>
                    <Field label="Start date"><input type="date" className={inputClass()} value={needDraft.startDate} onChange={(event) => updateNeedDraftDate("startDate", event.target.value)} /></Field>
                    <Field label="Finish date"><input type="date" min={needDraft.startDate || undefined} className={inputClass()} value={needDraft.finishDate} onChange={(event) => updateNeedDraftDate("finishDate", event.target.value)} /></Field>
                    <Field label="Work location"><input className={inputClass()} value={needDraft.siteLocation} onChange={(event) => updateNeedDraft({ siteLocation: event.target.value })} /></Field>
                    <Field label="Working hours">
                      <select className={selectClass()} value={needDraft.workingHours} onChange={(event) => updateNeedDraft({ workingHours: event.target.value, durationDays: scheduledDurationDays(needDraft.startDate, needDraft.finishDate, event.target.value) })}>
                        <option>Normal working hours</option><option>Evening work</option><option>Night work</option><option>Normal + weekend work</option><option>Mixed hours</option>
                      </select>
                    </Field>
                    <Field label="Working arrangement">
                      <select className={selectClass()} value={needDraft.workingArrangement} onChange={(event) => updateNeedDraft({ workingArrangement: event.target.value as EngineerNeed["workingArrangement"] })}>
                        <option value="supervised">Supervised / under lead</option><option value="independent">Independent standard work</option><option value="lead">Lead / responsible engineer</option>
                      </select>
                    </Field>
                  </div>

                  <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4"><div className="text-sm font-bold text-cyan-200">Expectation passed to both sides</div><p className="mt-2 text-sm leading-6 text-slate-300">{expectation.responsibilityStatement}</p></div>
                  {warnings.length > 0 && <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4"><div className="text-sm font-bold text-amber-100">Warnings / boundaries</div><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-50">{warnings.slice(0, 5).map((warning) => <li key={warning}>{warning}</li>)}</ul></div>}

                  <div className="mt-5 flex flex-wrap justify-end gap-3">
                    <button type="button" onClick={() => setNeedDraft(null)} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 hover:border-cyan-300/60">Cancel</button>
                    <button type="button" onClick={saveNeedDraft} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200">{existing ? "Save changes" : "Add to workspace"}</button>
                  </div>
                </section>
              );
            })()}

            {needs.length > 0 && !needDraft && (
              <div className="mt-6 flex flex-col gap-4">
                {uncoveredSupervisedNeeds.length > 0 && (
                  <div role="alert" className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
                    <div className="font-bold text-amber-100">Senior supervision required</div>
                    <p className="mt-1">Add a compatible senior or lead engineer before continuing. The following allocation cannot work alone:</p>
                    <ul className="mt-2 list-disc pl-5">
                      {uncoveredSupervisedNeeds.map((need) => <li key={need.id}>{getRoleExpectation(need.expectationId).roleTitle}</li>)}
                    </ul>
                    <div className="mt-4 border-t border-amber-200/20 pt-4">
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 accent-cyan-300"
                          checked={usesExternalSupervision}
                          onChange={(event) => {
                            setUsesExternalSupervision(event.target.checked);
                            if (!event.target.checked) setExternalSupervisorName("");
                          }}
                        />
                        <span><strong>Use client-provided supervision.</strong> I confirm a senior/lead engineer outside this allocation will supervise the restricted role.</span>
                      </label>
                      {usesExternalSupervision && (
                        <label className="mt-4 block">
                          <span className="font-semibold text-amber-100">Named senior supervisor</span>
                          <input
                            className={`${inputClass()} mt-2 border-amber-200/30`}
                            value={externalSupervisorName}
                            onChange={(event) => setExternalSupervisorName(event.target.value)}
                            placeholder="Enter the responsible supervisor's name or role"
                          />
                          <span className="mt-2 block text-xs text-amber-100/70">This confirmation will be included in the final expectation exchange.</span>
                        </label>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={!labourTeamReady}
                    onClick={() => { setSelectedNeedId(needs[0].id); setStep(3); }}
                    className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue to skill levels
                  </button>
                </div>
              </div>
            )}
          </main>
        )}

        {step === 3 && selectedNeed && selectedExpectation && (
          <main className="grid gap-5 lg:grid-cols-[320px_1fr]">
            <aside className="rounded-3xl border border-white/10 bg-slate-900 p-5">
              <h2 className="text-lg font-bold text-cyan-300">3. Select role</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Configure one role at a time.</p>

              <div className="mt-5 space-y-3">
                {needs.map((need) => {
                  const expectation = getRoleExpectation(need.expectationId);

                  return (
                    <button
                      key={need.id}
                      type="button"
                      onClick={() => setSelectedNeedId(need.id)}
                      className={[
                        "w-full rounded-2xl border p-4 text-left transition",
                        selectedNeed.id === need.id ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-white/10 bg-slate-950 text-slate-300 hover:border-cyan-300/60",
                      ].join(" ")}
                    >
                      <div className="font-bold">{expectation.roleTitle}</div>
                      <div className="mt-1 text-xs opacity-70">
                        {expectation.responsibilityBand === "labour"
                          ? (need.expectationsAccepted ? "Expectations accepted" : "Acceptance required")
                          : `${need.skills.length} required skills`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-cyan-300">{selectedExpectation.roleTitle}</h2>
              {selectedExpectation.responsibilityBand === "labour" ? (
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-5">
                    <h3 className="font-bold text-cyan-100">General competency and expectations</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      This is a basic support role. No documentary proof or scored competency matrix is required. The engineer is expected to be generally competent, follow instructions and work within the stated supervision boundaries.
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{selectedExpectation.responsibilityStatement}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                      <h3 className="text-sm font-bold text-cyan-200">General expectations</h3>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-300">
                        {selectedExpectation.requiredSkills.map((item) => <li key={item.skill}>{item.skill}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                      <h3 className="text-sm font-bold text-amber-100">Responsibility boundaries</h3>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-50">
                        {selectedExpectation.notIncludedUnlessSelected.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 accent-cyan-300"
                      checked={selectedNeed.expectationsAccepted}
                      onChange={(event) => updateNeed(selectedNeed.id, { expectationsAccepted: event.target.checked })}
                    />
                    <span className="text-sm leading-6 text-slate-300">
                      <strong className="block text-white">Accept general competency and role expectations</strong>
                      I confirm the engineer is generally competent to perform these basic support duties, will follow site rules and instructions, and will remain within the stated supervision and responsibility boundaries.
                    </span>
                  </label>
                  <p className="text-xs leading-5 text-slate-500">This acceptance records the agreed expectations; it is not a request for certificates, documentary evidence or formal competency scoring.</p>
                </div>
              ) : (<>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                These skills are auto-populated from the selected role expectation. Adjust only where the project genuinely changes the requirement.
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
                <input className={inputClass()} value={newSkillName} onChange={(event) => setNewSkillName(event.target.value)} placeholder="Add another required skill..." />
                <button type="button" onClick={addSkill} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200">
                  Add skill
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {selectedNeed.skills.map((skill) => (
                  <article key={skill.skill} className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-bold text-white">{skill.skill}</h3>
                        <p className="mt-1 text-xs text-slate-500">Minimum level {skill.minimumLevel} · importance {skill.importance}</p>
                      </div>

                      <button type="button" onClick={() => removeSkill(skill.skill)} className="self-start rounded-xl border border-red-300/40 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-300/10">
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <Field label="Minimum competency">
                        <select className={selectClass()} value={skill.minimumLevel} onChange={(event) => updateSkill(skill.skill, { minimumLevel: Number(event.target.value) as SkillRequirement["minimumLevel"] })}>
                          <option value={0}>0 - Not required</option>
                          <option value={1}>1 - Aware</option>
                          <option value={2}>2 - Assisted</option>
                          <option value={3}>3 - Competent</option>
                          <option value={4}>4 - Advanced</option>
                          <option value={5}>5 - Lead / specialist</option>
                        </select>
                      </Field>

                      <Field label="Importance">
                        <select className={selectClass()} value={skill.importance} onChange={(event) => updateSkill(skill.skill, { importance: Number(event.target.value) as SkillRequirement["importance"] })}>
                          <option value={1}>1 - Useful</option>
                          <option value={2}>2 - Helpful</option>
                          <option value={3}>3 - Required</option>
                          <option value={4}>4 - Important</option>
                          <option value={5}>5 - Critical</option>
                        </select>
                      </Field>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-5">
                <Field label="Supporting tags" hint="Tags are supporting search metadata only. They should not override skill level, evidence or site readiness.">
                  <input className={inputClass()} value={selectedNeed.tags} onChange={(event) => updateNeed(selectedNeed.id, { tags: event.target.value })} placeholder="e.g. WyreStorm, Dante, Teams Rooms, London, night work" />
                </Field>
              </div>
              </>)}

              <div className="mt-6 flex justify-end">
                <button type="button" disabled={!reviewReady} onClick={() => setStep(4)} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40">
                  Review exchange
                </button>
              </div>
            </section>
          </main>
        )}

        {step === 4 && (
          <main className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-xl font-bold text-cyan-300">4. Review platform exchange</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              This is the expectation package that should be visible to both the company and the engineer before invitation or acceptance.
            </p>

            <section className="mt-6 rounded-2xl border border-white/10 bg-slate-950 p-5">
              <h3 className="text-lg font-bold text-white">{project.projectName || "Unnamed project"}</h3>
              <div className="mt-3 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
                <div>Client: {project.clientName || "Not set"}</div>
                <div>Location: {project.siteLocation || "Not set"}</div>
                <div>Dates: {project.startDate || "Not set"}{project.finishDate ? ` to ${project.finishDate}` : ""}</div>
                <div>Type: {project.projectType}</div>
                <div>Environment: {project.environment}</div>
                <div>Hours: {project.workingHours}</div>
              </div>
            </section>

            {hasConfirmedExternalSupervisor && uncoveredSupervisedNeeds.length > 0 && (
              <section className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-5">
                <h3 className="font-bold text-amber-100">Client-provided senior supervision</h3>
                <p className="mt-2 text-sm leading-6 text-amber-50">Named supervisor: <strong>{externalSupervisorName.trim()}</strong></p>
                <p className="mt-1 text-sm leading-6 text-amber-50">The junior/labour allocation remains supervised and must not be treated as authorised to work alone.</p>
              </section>
            )}

            <div className="mt-5 space-y-4">
              {needs.map((need) => {
                const expectation = getRoleExpectation(need.expectationId);
                const warnings = expectationWarnings(need, expectation, project);

                return (
                  <section key={need.id} className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="font-bold text-white">{expectation.roleTitle}</h3>
                        <p className="mt-1 text-sm text-cyan-200">
                          {responsibilityBandLabels[expectation.responsibilityBand]} · {need.workingArrangement}
                        </p>
                      </div>

                      <div className="rounded-xl bg-cyan-300 px-3 py-2 text-sm font-bold text-slate-950">
                        {need.quantity} engineer(s)
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-300">{expectation.responsibilityStatement}</p>

                    <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
                      <div>Rate: £{need.dayRate}/day</div>
                      <div>Duration: {need.durationDays} day(s)</div>
                      <div>Start: {need.startDate || "Not set"}</div>
                      <div>Finish: {need.finishDate || "Not set"}</div>
                      <div>Location: {need.siteLocation || project.siteLocation || "Not set"}</div>
                      <div>Hours: {need.workingHours || project.workingHours}</div>
                    </div>

                    {expectation.responsibilityBand === "labour" ? (
                      <div className="mt-4 rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-4 text-sm text-cyan-100">
                        <strong>General competency and expectations accepted.</strong> No documentary competency evidence has been requested for this basic support role.
                      </div>
                    ) : <div className="mt-4 flex flex-wrap gap-2">
                      {need.skills.map((skill) => (
                        <span key={skill.skill} className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100">
                          {skill.skill}: L{skill.minimumLevel} / I{skill.importance}
                        </span>
                      ))}
                    </div>}

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                        <div className="text-sm font-bold text-cyan-200">Not included unless separately selected</div>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-400">
                          {expectation.notIncludedUnlessSelected.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                        <div className="text-sm font-bold text-amber-100">Warnings</div>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-50">
                          {warnings.slice(0, 6).map((warning) => (
                            <li key={warning}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {need.tags && <div className="mt-4 text-sm text-slate-500">Supporting tags: {need.tags}</div>}
                  </section>
                );
              })}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

