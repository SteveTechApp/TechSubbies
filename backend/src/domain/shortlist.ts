import type { UserRow } from "../lib/db.js";
import { normaliseRoleId } from "./roleCatalog.js";
import type { MarketplaceApplicationDTO, PersistedJobDTO, ShortlistCandidateDTO, ShortlistOutcome } from "./marketplaceTypes.js";
import { decodePersistedObject } from "../lib/persistedData.js";
import { ENGINEER_PROFILE_SCHEMA_VERSION } from "./marketplaceTypes.js";

const clean = (value: unknown): string => String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const level: Record<string, number> = { assist: 1, supervised: 1, deliver: 2, independent: 2, diagnose: 3, lead: 4 };
const record = (value: unknown): Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value)
  ? value as Record<string, unknown>
  : {};
const array = (value: unknown): unknown[] => Array.isArray(value) ? value : [];
const first = (...values: unknown[]): unknown => values.find((value) => value !== undefined && value !== null);
const values = (input: unknown): string[] => array(input).map((value) => {
  if (typeof value === "string") return value;
  const item = record(value);
  return String(first(item.label, item.skillId, item.skill, item.name, ""));
}).filter(Boolean);
const isOfferedSkill = (value: unknown): boolean => {
  const item = record(value);
  return !["not-offered", "none", "0"].includes(String(first(item.claim, item.selfLevel, "")));
};

export function assessApplicant(job: PersistedJobDTO, application: MarketplaceApplicationDTO, user: UserRow, nowMs = Date.now()): ShortlistCandidateDTO {
  const profile = decodePersistedObject(user.profile, { entity: "engineer profile", id: user.id, versionKey: "profileSchemaVersion", maximumVersion: ENGINEER_PROFILE_SCHEMA_VERSION });
  const profiles = [...array(profile.capabilityProfiles), ...array(profile.roleSkillProfiles), ...array(profile.roleProfiles)].map(record);
  const roleProfile = profiles.find((item) => normaliseRoleId(String(first(item.roleId, item.expectationId, ""))) === job.roleId);
  const roleMatch = Boolean(roleProfile);
  const selectedProfile = roleProfile || {};
  const searchable = new Set<string>();
  const add = (value: unknown) => { const key = clean(value); if (key) searchable.add(key); };
  [profile.productTags, profile.brandTags, profile.platformTags, profile.certificationTags, profile.customKeywords,
    selectedProfile.keywords, selectedProfile.productTags, selectedProfile.brandTags, selectedProfile.platformTags,
    selectedProfile.certificationTags, selectedProfile.customKeywords].forEach((value) => values(value).forEach(add));
  Object.entries(record(selectedProfile.productExperience)).forEach(([key, value]) => { add(key); add(`${key} ${value}`); });

  const candidateSkills = [...array(selectedProfile.capabilities), ...array(selectedProfile.ratings), ...array(selectedProfile.skills)];
  candidateSkills.filter(isOfferedSkill).forEach((value) => {
    const item = record(value);
    add(first(item.skillId, item.skill, item.name));
  });
  const hasDeclaredEvidence = (requirement: string) => {
    const key = clean(requirement).replace(/\b(experience|knowledge|required|prerequisite)\b/g, "").replace(/\s+/g, " ").trim();
    return [...searchable].some((declared) => declared === key || (declared.length >= 4 && key.includes(declared)) || (key.length >= 4 && declared.includes(key)));
  };

  const prerequisites = values(job.prerequisites);
  const matchedPrerequisites = prerequisites.filter(hasDeclaredEvidence);
  const missingPrerequisites = prerequisites.filter((item) => !hasDeclaredEvidence(item));
  const requiredSkillValues = array(job.skillRequirements).filter((value) => record(value).required !== false);
  const requiredSkills = values(requiredSkillValues);
  const skillSet = new Set(candidateSkills.filter(isOfferedSkill).map((value) => {
    const item = record(value);
    return clean(first(item.skillId, item.skill, item.name));
  }).filter(Boolean));
  const matchedSkills = requiredSkills.filter((item) => skillSet.has(clean(item)));
  const missingSkills = requiredSkills.filter((item) => !skillSet.has(clean(item)));

  const roleRequirement = job.roleRequirements.find((item) => item.roleId === job.roleId) || job.roleRequirements[0];
  const legacyNeed = record(array(job.engineerNeeds)[0]);
  const requested = level[clean(first(roleRequirement?.responsibility, legacyNeed.workingArrangement, job.workingArrangement, "independent"))] || 2;
  const offered = level[clean(first(selectedProfile.overallCapability, selectedProfile.maximumResponsibility, ""))] || 0;
  const responsibilityFit = offered >= requested;
  const confirmedAt = typeof profile.availabilityConfirmedAt === "string" ? profile.availabilityConfirmedAt : null;
  const age = confirmedAt ? nowMs - new Date(confirmedAt).getTime() : Infinity;
  const confidence = age <= 7 * 86_400_000 ? "fresh" : age <= 30 * 86_400_000 ? "aging" : confirmedAt ? "stale" : "unconfirmed";
  const evidenceCount = array(selectedProfile.evidence).length + array(profile.uploadedEvidenceNotes).length + candidateSkills.filter((value) => {
    const item = record(value);
    return Boolean(item.evidenceNote || item.evidence);
  }).length;

  const reasons: string[] = [];
  const risks: string[] = [];
  if (roleMatch) reasons.push("Declared profile for the requested specialist role."); else risks.push("No declared profile for the requested specialist role.");
  if (responsibilityFit) reasons.push("Declared responsibility level meets the working arrangement."); else risks.push("Declared responsibility level is below or missing for this requirement.");
  if (prerequisites.length && matchedPrerequisites.length) reasons.push(`${matchedPrerequisites.length} of ${prerequisites.length} mandatory prerequisites evidenced.`);
  if (missingPrerequisites.length) risks.push(`Missing mandatory prerequisites: ${missingPrerequisites.join(", ")}.`);
  if (requiredSkills.length && matchedSkills.length) reasons.push(`${matchedSkills.length} of ${requiredSkills.length} requested capabilities declared.`);
  if (missingSkills.length) risks.push(`Capabilities to verify: ${missingSkills.join(", ")}.`);
  if (confidence === "fresh") reasons.push("Availability confirmed within 7 days."); else risks.push(confidence === "unconfirmed" ? "Availability has not been confirmed." : "Availability confirmation is not recent.");
  if (evidenceCount) reasons.push(`${evidenceCount} profile evidence item${evidenceCount === 1 ? "" : "s"} recorded.`); else risks.push("No supporting profile evidence recorded.");
  const score = Math.max(0, Math.min(100, (roleMatch ? 40 : 0) + (responsibilityFit ? 20 : 0) + (prerequisites.length ? Math.round(20 * matchedPrerequisites.length / prerequisites.length) : 20) + (requiredSkills.length ? Math.round(10 * matchedSkills.length / requiredSkills.length) : 10) + (confidence === "fresh" ? 5 : confidence === "aging" ? 3 : 0) + Math.min(5, evidenceCount)));
  const outcome: ShortlistOutcome = !roleMatch || missingPrerequisites.length ? "excluded" : (!responsibilityFit || missingSkills.length || confidence !== "fresh" ? "review" : "eligible");
  return { applicationId: application.id, engineerId: user.id, engineerName: user.name, outcome, score, roleMatch, responsibilityFit, matchedPrerequisites, missingPrerequisites, matchedSkills, missingSkills, availability: { confidence, confirmedAt }, evidenceCount, reasons, risks };
}

export function buildShortlist(job: PersistedJobDTO, applications: MarketplaceApplicationDTO[], users: UserRow[]): ShortlistCandidateDTO[] {
  const byId = new Map(users.map((user) => [user.id, user]));
  const order: Record<ShortlistOutcome, number> = { eligible: 0, review: 1, excluded: 2 };
  return applications.map((application) => {
    const user = byId.get(application.engineerId);
    return user && user.role === "Engineer" ? assessApplicant(job, application, user) : null;
  }).filter((item): item is ShortlistCandidateDTO => Boolean(item)).sort((a, b) => order[a.outcome] - order[b.outcome] || b.score - a.score || a.engineerName.localeCompare(b.engineerName));
}
