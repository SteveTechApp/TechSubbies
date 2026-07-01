import React, { useMemo, useState } from "react";
import {
  allSkills,
  competencyLevels,
  engineerRoleTemplates,
  skillCategories,
} from "../data/skillTaxonomy";

type ProjectDetails = {
  projectName: string;
  clientName: string;
  siteLocation: string;
  projectType: string;
  environment: string;
  accessNotes: string;
  complianceNotes: string;
  projectNotes: string;
};

type RequiredSkill = {
  skill: string;
  level: number;
  importance: number;
};

type EngineerDemand = {
  id: string;
  roleTemplateId: string;
  roleTitle: string;
  quantity: number;
  dayRate: number;
  durationDays: number;
  startDate: string;
  finishDate: string;
  workSummary: string;
  requiredSkills: RequiredSkill[];
  searchTags: string;
};

const emptyProject: ProjectDetails = {
  projectName: "",
  clientName: "",
  siteLocation: "",
  projectType: "Corporate AV",
  environment: "Occupied site",
  accessNotes: "",
  complianceNotes: "",
  projectNotes: "",
};

function makeDemand(roleTemplateId = engineerRoleTemplates[0]?.id || "av-installer"): EngineerDemand {
  const template = engineerRoleTemplates.find((item) => item.id === roleTemplateId) || engineerRoleTemplates[0];

  return {
    id: crypto.randomUUID(),
    roleTemplateId: template.id,
    roleTitle: template.title,
    quantity: 1,
    dayRate: 350,
    durationDays: 1,
    startDate: "",
    finishDate: "",
    workSummary: template.summary,
    requiredSkills: template.defaultSkills.map((skill) => ({
      skill,
      level: 3,
      importance: 3,
    })),
    searchTags: "",
  };
}

function updateSkillRequirement(
  skills: RequiredSkill[],
  skill: string,
  patch: Partial<RequiredSkill>
): RequiredSkill[] {
  return skills.map((item) => {
    if (item.skill !== skill) {
      return item;
    }

    return {
      ...item,
      ...patch,
    };
  });
}

function removeSkillRequirement(skills: RequiredSkill[], skill: string): RequiredSkill[] {
  return skills.filter((item) => item.skill !== skill);
}

function addSkillRequirement(skills: RequiredSkill[], skill: string): RequiredSkill[] {
  if (!skill) {
    return skills;
  }

  if (skills.some((item) => item.skill === skill)) {
    return skills;
  }

  return [
    ...skills,
    {
      skill,
      level: 3,
      importance: 3,
    },
  ];
}

export default function OpportunityIntakePage() {
  const [step, setStep] = useState(1);
  const [project, setProject] = useState<ProjectDetails>(emptyProject);
  const [demands, setDemands] = useState<EngineerDemand[]>([makeDemand()]);
  const [selectedDemandId, setSelectedDemandId] = useState<string>(demands[0]?.id || "");

  const selectedDemand = demands.find((item) => item.id === selectedDemandId) || demands[0];

  const totals = useMemo(() => {
    const engineerDays = demands.reduce((sum, item) => sum + item.quantity * item.durationDays, 0);
    const estimatedLabour = demands.reduce((sum, item) => sum + item.quantity * item.durationDays * item.dayRate, 0);
    const weightedSkills = demands.reduce(
      (sum, item) => sum + item.requiredSkills.reduce((skillSum, skill) => skillSum + skill.level * skill.importance, 0),
      0
    );

    return {
      engineerDays,
      estimatedLabour,
      weightedSkills,
    };
  }, [demands]);

  const updateDemand = (id: string, patch: Partial<EngineerDemand>) => {
    setDemands((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          ...patch,
        };
      })
    );
  };

  const applyRoleTemplate = (demandId: string, roleTemplateId: string) => {
    const template = engineerRoleTemplates.find((item) => item.id === roleTemplateId);

    if (!template) {
      return;
    }

    updateDemand(demandId, {
      roleTemplateId: template.id,
      roleTitle: template.title,
      workSummary: template.summary,
      requiredSkills: template.defaultSkills.map((skill) => ({
        skill,
        level: 3,
        importance: 3,
      })),
    });
  };

  const addDemand = () => {
    const next = makeDemand();
    setDemands((current) => [...current, next]);
    setSelectedDemandId(next.id);
    setStep(2);
  };

  const removeDemand = (id: string) => {
    const remaining = demands.filter((item) => item.id !== id);

    if (remaining.length === 0) {
      const replacement = makeDemand();
      setDemands([replacement]);
      setSelectedDemandId(replacement.id);
      return;
    }

    setDemands(remaining);
    setSelectedDemandId(remaining[0].id);
  };

  const missingProjectFields = [
    project.projectName ? "" : "Project name",
    project.clientName ? "" : "Client name",
    project.siteLocation ? "" : "Site location",
  ].filter(Boolean);

  const matchLogic = [
    "Role match: engineer must have the selected role profile or closely related role.",
    "Skill match: each required skill is checked against the engineer profile skill list.",
    "Competency match: engineer rating must meet or exceed the required level.",
    "Weighted score: higher importance skills affect the match score more heavily.",
    "Availability match: engineer calendar must cover the selected start/finish dates.",
    "Rate match: engineer target rate must align with the offered day rate.",
    "Tags: tags are used only as secondary search terms, not as the main match method.",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 rounded-3xl border border-cyan-400/20 bg-slate-900/90 p-6 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            TechSubbies Post a Project
          </p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Build a skill-ranked engineer requirement
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                Capture the project, define the engineer roles required, then configure the exact skills and competency levels needed for each role. Tags remain useful, but only as supporting search terms.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-white/10 bg-slate-800 p-3">
                <div className="text-2xl font-bold text-cyan-300">{demands.length}</div>
                <div className="text-xs text-slate-400">Job types</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-800 p-3">
                <div className="text-2xl font-bold text-cyan-300">{totals.engineerDays}</div>
                <div className="text-xs text-slate-400">Engineer days</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-800 p-3">
                <div className="text-2xl font-bold text-cyan-300">£{totals.estimatedLabour.toLocaleString()}</div>
                <div className="text-xs text-slate-400">Labour budget</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-4">
          {[
            [1, "Project details"],
            [2, "Engineer demand"],
            [3, "Skill ranking"],
            [4, "Match profile"],
          ].map(([number, label]) => (
            <button
              key={number}
              type="button"
              onClick={() => setStep(Number(number))}
              className={[
                "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition",
                step === number
                  ? "border-cyan-300 bg-cyan-300 text-slate-950"
                  : "border-white/10 bg-slate-900 text-slate-200 hover:border-cyan-300/60",
              ].join(" ")}
            >
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/20 text-xs">
                {number}
              </span>
              {label}
            </button>
          ))}
        </div>

        {step === 1 && (
          <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-cyan-300">1. Main project details</h2>
              <p className="mt-1 text-sm text-slate-400">
                Capture enough project context to make engineer matching meaningful.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Project name</span>
                  <input
                    value={project.projectName}
                    onChange={(event) => setProject({ ...project, projectName: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                    placeholder="e.g. Oxford university lecture theatre refresh"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Client / company</span>
                  <input
                    value={project.clientName}
                    onChange={(event) => setProject({ ...project, clientName: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                    placeholder="Client or hiring company"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Site location</span>
                  <input
                    value={project.siteLocation}
                    onChange={(event) => setProject({ ...project, siteLocation: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                    placeholder="Town, postcode, region or country"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Project type</span>
                  <select
                    value={project.projectType}
                    onChange={(event) => setProject({ ...project, projectType: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                  >
                    <option>Corporate AV</option>
                    <option>Education AV</option>
                    <option>Hospitality AV</option>
                    <option>Retail / signage</option>
                    <option>IT deployment</option>
                    <option>Network refresh</option>
                    <option>UC / VC rooms</option>
                    <option>Mixed AV and IT project</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Site environment</span>
                  <select
                    value={project.environment}
                    onChange={(event) => setProject({ ...project, environment: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                  >
                    <option>Occupied site</option>
                    <option>Construction site</option>
                    <option>Out of hours only</option>
                    <option>Live customer environment</option>
                    <option>Secure site</option>
                    <option>Multi-site rollout</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Access notes</span>
                  <input
                    value={project.accessNotes}
                    onChange={(event) => setProject({ ...project, accessNotes: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                    placeholder="Parking, loading, access hours, induction, security"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-slate-200">Compliance / paperwork</span>
                  <textarea
                    value={project.complianceNotes}
                    onChange={(event) => setProject({ ...project, complianceNotes: event.target.value })}
                    className="mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                    placeholder="RAMS, insurance, DBS, ECS/CSCS, IPAF, PASMA, client onboarding, site induction"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-slate-200">Project notes</span>
                  <textarea
                    value={project.projectNotes}
                    onChange={(event) => setProject({ ...project, projectNotes: event.target.value })}
                    className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                    placeholder="Describe the project scope, rooms, systems, constraints and expected outcome"
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-200"
                >
                  Continue to engineer demand
                </button>
              </div>
            </div>

            <aside className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h3 className="font-bold text-cyan-300">Readiness check</h3>
              {missingProjectFields.length > 0 && (
                <div className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
                  Missing: {missingProjectFields.join(", ")}
                </div>
              )}
              {missingProjectFields.length === 0 && (
                <div className="mt-4 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-4 text-sm text-emerald-100">
                  Core project details are ready.
                </div>
              )}

              <div className="mt-4 text-sm leading-6 text-slate-300">
                Good matching needs context. A network-heavy AV job, a Teams Room job and a simple display install may all share tags, but need different competency weighting.
              </div>
            </aside>
          </section>
        )}

        {step === 2 && (
          <section className="grid gap-5 lg:grid-cols-[420px_1fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-cyan-300">2. Engineer demand</h2>
                  <p className="mt-1 text-sm text-slate-400">Choose the amount and type of engineers needed.</p>
                </div>
                <button
                  type="button"
                  onClick={addDemand}
                  className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-200"
                >
                  Add role
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {demands.map((demand) => (
                  <button
                    key={demand.id}
                    type="button"
                    onClick={() => setSelectedDemandId(demand.id)}
                    className={[
                      "w-full rounded-2xl border p-4 text-left transition",
                      selectedDemand?.id === demand.id
                        ? "border-cyan-300 bg-cyan-300/10"
                        : "border-white/10 bg-slate-950 hover:border-cyan-300/50",
                    ].join(" ")}
                  >
                    <div className="font-bold text-white">{demand.roleTitle}</div>
                    <div className="mt-1 text-sm text-slate-400">
                      {demand.quantity} engineer(s) · {demand.durationDays} day(s) · £{demand.dayRate}/day
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      {demand.requiredSkills.length} ranked skills configured
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedDemand && (
              <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="text-sm font-semibold text-slate-200">Engineer role / job type</span>
                    <select
                      value={selectedDemand.roleTemplateId}
                      onChange={(event) => applyRoleTemplate(selectedDemand.id, event.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                    >
                      {engineerRoleTemplates.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-200">Number of engineers</span>
                    <input
                      type="number"
                      min={1}
                      value={selectedDemand.quantity}
                      onChange={(event) => updateDemand(selectedDemand.id, { quantity: Number(event.target.value) })}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-200">Day rate</span>
                    <input
                      type="number"
                      min={0}
                      value={selectedDemand.dayRate}
                      onChange={(event) => updateDemand(selectedDemand.id, { dayRate: Number(event.target.value) })}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-200">Duration in days</span>
                    <input
                      type="number"
                      min={1}
                      value={selectedDemand.durationDays}
                      onChange={(event) => updateDemand(selectedDemand.id, { durationDays: Number(event.target.value) })}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-200">Start date</span>
                    <input
                      type="date"
                      value={selectedDemand.startDate}
                      onChange={(event) => updateDemand(selectedDemand.id, { startDate: event.target.value })}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-200">Finish date</span>
                    <input
                      type="date"
                      value={selectedDemand.finishDate}
                      onChange={(event) => updateDemand(selectedDemand.id, { finishDate: event.target.value })}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-sm font-semibold text-slate-200">Work description</span>
                    <textarea
                      value={selectedDemand.workSummary}
                      onChange={(event) => updateDemand(selectedDemand.id, { workSummary: event.target.value })}
                      className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                    />
                  </label>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={() => removeDemand(selectedDemand.id)}
                    className="rounded-xl border border-red-300/40 px-4 py-3 text-sm font-bold text-red-200 hover:bg-red-300/10"
                  >
                    Remove role
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-200"
                  >
                    Configure required skills
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {step === 3 && selectedDemand && (
          <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-cyan-300">3. Skill ranking</h2>
              <p className="mt-1 text-sm text-slate-400">
                Select required skills from the same taxonomy used for engineer profiles.
              </p>

              <label className="mt-5 block">
                <span className="text-sm font-semibold text-slate-200">Add skill</span>
                <select
                  value=""
                  onChange={(event) =>
                    updateDemand(selectedDemand.id, {
                      requiredSkills: addSkillRequirement(selectedDemand.requiredSkills, event.target.value),
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                >
                  <option value="">Choose a skill...</option>
                  {allSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-5 max-h-[520px] overflow-y-auto pr-2">
                {skillCategories.map((category) => (
                  <div key={category.id} className="mb-5">
                    <h3 className="mb-2 text-sm font-bold text-cyan-300">{category.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => {
                        const selected = selectedDemand.requiredSkills.some((item) => item.skill === skill);

                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() =>
                              updateDemand(selectedDemand.id, {
                                requiredSkills: selected
                                  ? removeSkillRequirement(selectedDemand.requiredSkills, skill)
                                  : addSkillRequirement(selectedDemand.requiredSkills, skill),
                              })
                            }
                            className={[
                              "rounded-full border px-3 py-2 text-xs font-semibold",
                              selected
                                ? "border-cyan-300 bg-cyan-300 text-slate-950"
                                : "border-white/10 bg-slate-950 text-slate-300 hover:border-cyan-300/60",
                            ].join(" ")}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedDemand.roleTitle}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Required skills, competency level and importance weighting.
                  </p>
                </div>
                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
                  Weighted requirement: {selectedDemand.requiredSkills.reduce((sum, item) => sum + item.level * item.importance, 0)}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {selectedDemand.requiredSkills.map((item) => (
                  <div key={item.skill} className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="font-bold text-white">{item.skill}</div>
                        <div className="text-xs text-slate-500">
                          Engineer profile must meet or exceed this level.
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          updateDemand(selectedDemand.id, {
                            requiredSkills: removeSkillRequirement(selectedDemand.requiredSkills, item.skill),
                          })
                        }
                        className="self-start rounded-lg border border-red-300/40 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-300/10"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Required competency
                        </span>
                        <select
                          value={item.level}
                          onChange={(event) =>
                            updateDemand(selectedDemand.id, {
                              requiredSkills: updateSkillRequirement(selectedDemand.requiredSkills, item.skill, {
                                level: Number(event.target.value),
                              }),
                            })
                          }
                          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
                        >
                          {competencyLevels.map((level) => (
                            <option key={level.level} value={level.level}>
                              {level.level} - {level.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Importance weighting
                        </span>
                        <select
                          value={item.importance}
                          onChange={(event) =>
                            updateDemand(selectedDemand.id, {
                              requiredSkills: updateSkillRequirement(selectedDemand.requiredSkills, item.skill, {
                                importance: Number(event.target.value),
                              }),
                            })
                          }
                          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
                        >
                          <option value={1}>1 - Useful</option>
                          <option value={2}>2 - Helpful</option>
                          <option value={3}>3 - Required</option>
                          <option value={4}>4 - Important</option>
                          <option value={5}>5 - Critical</option>
                        </select>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <label className="mt-6 block">
                <span className="text-sm font-semibold text-slate-200">Relevant search tags</span>
                <input
                  value={selectedDemand.searchTags}
                  onChange={(event) => updateDemand(selectedDemand.id, { searchTags: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"
                  placeholder="Optional: Crestron, WyreStorm, Dante, Teams Rooms, London, night work"
                />
                <span className="mt-2 block text-xs text-slate-500">
                  Tags help widen search, but should not override skill and competency matching.
                </span>
              </label>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-200"
                >
                  Review match profile
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-cyan-300">4. Match profile</h2>
              <p className="mt-1 text-sm text-slate-400">
                This is the structured requirement the matching engine should use.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950 p-5">
                <h3 className="font-bold text-white">{project.projectName || "Unnamed project"}</h3>
                <div className="mt-2 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                  <div>Client: {project.clientName || "Not set"}</div>
                  <div>Location: {project.siteLocation || "Not set"}</div>
                  <div>Type: {project.projectType}</div>
                  <div>Environment: {project.environment}</div>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {demands.map((demand) => (
                  <div key={demand.id} className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="font-bold text-white">{demand.roleTitle}</h3>
                        <p className="mt-1 text-sm text-slate-400">{demand.workSummary}</p>
                      </div>
                      <div className="rounded-xl bg-cyan-300 px-3 py-2 text-sm font-bold text-slate-950">
                        {demand.quantity} engineer(s)
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-4">
                      <div>Rate: £{demand.dayRate}/day</div>
                      <div>Duration: {demand.durationDays} day(s)</div>
                      <div>Start: {demand.startDate || "Not set"}</div>
                      <div>Finish: {demand.finishDate || "Not set"}</div>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
                          <tr>
                            <th className="px-4 py-3">Skill</th>
                            <th className="px-4 py-3">Required level</th>
                            <th className="px-4 py-3">Importance</th>
                            <th className="px-4 py-3">Score weight</th>
                          </tr>
                        </thead>
                        <tbody>
                          {demand.requiredSkills.map((skill) => (
                            <tr key={skill.skill} className="border-t border-white/10">
                              <td className="px-4 py-3 text-white">{skill.skill}</td>
                              <td className="px-4 py-3 text-slate-300">{skill.level}</td>
                              <td className="px-4 py-3 text-slate-300">{skill.importance}</td>
                              <td className="px-4 py-3 text-cyan-300">{skill.level * skill.importance}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {demand.searchTags && (
                      <div className="mt-4 text-sm text-slate-400">
                        Supporting tags: {demand.searchTags}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h3 className="font-bold text-cyan-300">Matching model</h3>
              <div className="mt-4 space-y-3">
                {matchLogic.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-slate-950 p-4 text-sm leading-6 text-slate-300">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                <div className="text-sm font-bold text-cyan-200">Recommended score bands</div>
                <div className="mt-3 space-y-2 text-sm text-slate-300">
                  <div>90€“100%: Strong match</div>
                  <div>70€“89%: Viable match</div>
                  <div>50€“69%: Partial match / review</div>
                  <div>&lt;50%: Poor match</div>
                </div>
              </div>
            </aside>
          </section>
        )}
      </div>
    </div>
  );
}

