import React, { useMemo, useState } from "react";
import {
  cloneSkillRequirements,
  getRoleExpectation,
  responsibilityBandDescriptions,
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
  workingArrangement: "supervised" | "independent" | "lead";
  skills: SkillRequirement[];
  tags: string;
};

const emptyProject: ProjectDetails = {
  projectName: "",
  clientName: "",
  siteLocation: "",
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

function makeNeed(expectationId = roleExpectations[0].id): EngineerNeed {
  const expectation = getRoleExpectation(expectationId);

  return {
    id: makeId("need"),
    expectationId,
    quantity: 1,
    dayRate: 350,
    durationDays: 1,
    startDate: "",
    finishDate: "",
    workingArrangement: expectation.canLeadOthers ? "lead" : expectation.canWorkAlone ? "independent" : "supervised",
    skills: cloneSkillRequirements(expectation.requiredSkills),
    tags: "",
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

export default function LiveOpportunityIntakePage() {
  const [step, setStep] = useState<Step>(1);
  const [project, setProject] = useState<ProjectDetails>(emptyProject);
  const [needs, setNeeds] = useState<EngineerNeed[]>([makeNeed()]);
  const [selectedNeedId, setSelectedNeedId] = useState<string>("");
  const [newSkillName, setNewSkillName] = useState("");

  const selectedNeed = needs.find((need) => need.id === selectedNeedId) || needs[0];
  const selectedExpectation = selectedNeed ? getRoleExpectation(selectedNeed.expectationId) : roleExpectations[0];

  const totalEngineerDays = useMemo(() => {
    return needs.reduce((sum, need) => sum + need.quantity * need.durationDays, 0);
  }, [needs]);

  const labourBudget = useMemo(() => {
    return needs.reduce((sum, need) => sum + need.quantity * need.durationDays * need.dayRate, 0);
  }, [needs]);

  const projectReadiness = useMemo(() => {
    const values = [
      project.projectName,
      project.clientName,
      project.siteLocation,
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

  function changeExpectation(needId: string, expectationId: string) {
    const expectation = getRoleExpectation(expectationId);

    updateNeed(needId, {
      expectationId,
      workingArrangement: expectation.canLeadOthers ? "lead" : expectation.canWorkAlone ? "independent" : "supervised",
      skills: cloneSkillRequirements(expectation.requiredSkills),
    });
  }

  function addNeed() {
    const next = makeNeed();
    setNeeds((current) => [...current, next]);
    setSelectedNeedId(next.id);
  }

  function removeNeed(id: string) {
    const remaining = needs.filter((need) => need.id !== id);

    if (remaining.length === 0) {
      const replacement = makeNeed();
      setNeeds([replacement]);
      setSelectedNeedId(replacement.id);
      return;
    }

    setNeeds(remaining);
    setSelectedNeedId(remaining[0].id);
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
          <StepButton number={2} label="Role expectations" active={step === 2} onClick={() => setStep(2)} />
          <StepButton number={3} label="Skill levels" active={step === 3} onClick={() => setStep(3)} />
          <StepButton number={4} label="Review exchange" active={step === 4} onClick={() => setStep(4)} />
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
                  <option>Weekend work</option>
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
                Continue to role expectations
              </button>
            </div>
          </main>
        )}

        {step === 2 && (
          <main className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-cyan-300">2. Role expectations</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  Choose the correct role and responsibility level. This decides what the engineer must know, what they should own and what must not be assumed.
                </p>
              </div>

              <button type="button" onClick={addNeed} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200">
                Add role
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {needs.map((need) => {
                const expectation = getRoleExpectation(need.expectationId);
                const warnings = expectationWarnings(need, expectation, project);

                return (
                  <section key={need.id} className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <button type="button" className="text-left" onClick={() => setSelectedNeedId(need.id)}>
                        <div className="text-lg font-bold text-white">{expectation.roleTitle}</div>
                        <div className="mt-1 text-sm text-cyan-200">
                          {responsibilityBandLabels[expectation.responsibilityBand]} · {expectation.roleFamily}
                        </div>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                          {responsibilityBandDescriptions[expectation.responsibilityBand]}
                        </p>
                      </button>

                      <button type="button" onClick={() => removeNeed(need.id)} className="self-start rounded-xl border border-red-300/40 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-300/10">
                        Remove
                      </button>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <Field label="Role expectation">
                        <select className={selectClass()} value={need.expectationId} onChange={(event) => changeExpectation(need.id, event.target.value)}>
                          <optgroup label="AV roles">
                            {groupedExpectations.AV.map((item) => (
                              <option key={item.id} value={item.id}>{item.roleTitle}</option>
                            ))}
                          </optgroup>
                          <optgroup label="IT roles">
                            {groupedExpectations.IT.map((item) => (
                              <option key={item.id} value={item.id}>{item.roleTitle}</option>
                            ))}
                          </optgroup>
                          <optgroup label="Hybrid roles">
                            {groupedExpectations.Hybrid.map((item) => (
                              <option key={item.id} value={item.id}>{item.roleTitle}</option>
                            ))}
                          </optgroup>
                        </select>
                      </Field>

                      <Field label="Engineers needed">
                        <input type="number" min={1} className={inputClass()} value={need.quantity} onChange={(event) => updateNeed(need.id, { quantity: Number(event.target.value) })} />
                      </Field>

                      <Field label="Day rate">
                        <input type="number" min={0} className={inputClass()} value={need.dayRate} onChange={(event) => updateNeed(need.id, { dayRate: Number(event.target.value) })} />
                      </Field>

                      <Field label="Duration in days">
                        <input type="number" min={1} className={inputClass()} value={need.durationDays} onChange={(event) => updateNeed(need.id, { durationDays: Number(event.target.value) })} />
                      </Field>

                      <Field label="Start date">
                        <input type="date" className={inputClass()} value={need.startDate} onChange={(event) => updateNeed(need.id, { startDate: event.target.value })} />
                      </Field>

                      <Field label="Finish date">
                        <input type="date" className={inputClass()} value={need.finishDate} onChange={(event) => updateNeed(need.id, { finishDate: event.target.value })} />
                      </Field>

                      <Field label="Working arrangement">
                        <select className={selectClass()} value={need.workingArrangement} onChange={(event) => updateNeed(need.id, { workingArrangement: event.target.value as EngineerNeed["workingArrangement"] })}>
                          <option value="supervised">Supervised / under lead</option>
                          <option value="independent">Independent standard work</option>
                          <option value="lead">Lead / responsible engineer</option>
                        </select>
                      </Field>
                    </div>

                    <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                      <div className="text-sm font-bold text-cyan-200">Expectation passed to both sides</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{expectation.responsibilityStatement}</p>
                    </div>

                    {warnings.length > 0 && (
                      <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                        <div className="text-sm font-bold text-amber-100">Warnings / boundaries</div>
                        <ul className="mt-2 space-y-1 text-sm leading-6 text-amber-50">
                          {warnings.slice(0, 5).map((warning) => (
                            <li key={warning}>€¢ {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setStep(3)} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200">
                Continue to skill levels
              </button>
            </div>
          </main>
        )}

        {step === 3 && selectedNeed && (
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
                      <div className="mt-1 text-xs opacity-70">{need.skills.length} required skills</div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-cyan-300">{selectedExpectation.roleTitle}</h2>
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

              <div className="mt-6 flex justify-end">
                <button type="button" onClick={() => setStep(4)} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200">
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
                <div>Type: {project.projectType}</div>
                <div>Environment: {project.environment}</div>
                <div>Hours: {project.workingHours}</div>
              </div>
            </section>

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

                    <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-4">
                      <div>Rate: £{need.dayRate}/day</div>
                      <div>Duration: {need.durationDays} day(s)</div>
                      <div>Start: {need.startDate || "Not set"}</div>
                      <div>Finish: {need.finishDate || "Not set"}</div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {need.skills.map((skill) => (
                        <span key={skill.skill} className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100">
                          {skill.skill}: L{skill.minimumLevel} / I{skill.importance}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                        <div className="text-sm font-bold text-cyan-200">Not included unless separately selected</div>
                        <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-400">
                          {expectation.notIncludedUnlessSelected.map((item) => (
                            <li key={item}>€¢ {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                        <div className="text-sm font-bold text-amber-100">Warnings</div>
                        <ul className="mt-2 space-y-1 text-sm leading-6 text-amber-50">
                          {warnings.slice(0, 6).map((warning) => (
                            <li key={warning}>€¢ {warning}</li>
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

