import type { EngineerProfile } from "../types";
import type { CapabilityEvidence, CapabilityPassport, CompletionValidation, ExplainableShortlistEntry } from "../types/trust";
import { normaliseRoleIdentity } from "./roleIdentity";

const confidenceRank = { "self-declared": 1, supported: 2, reviewed: 3, "client-validated": 4, proven: 5 } as const;

interface CompatibleRoleProfile {
  roleId: string;
  overallCapability?: string;
  evidence: Array<{ note?: string }>;
}

function record(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function compatibleRoleProfiles(engineer: EngineerProfile): CompatibleRoleProfile[] {
  const rawProfiles = record(engineer)?.roleSkillProfiles;
  if (!Array.isArray(rawProfiles)) return [];

  return rawProfiles.flatMap((value) => {
    const profile = record(value);
    if (!profile) return [];
    const identity = typeof profile.roleId === "string"
      ? profile.roleId
      : typeof profile.expectationId === "string" ? profile.expectationId : "";
    const roleId = normaliseRoleIdentity(identity);
    if (!roleId) return [];
    const evidence = Array.isArray(profile.evidence)
      ? profile.evidence.flatMap((item) => {
          if (typeof item === "string") return [{ note: item }];
          const evidenceRecord = record(item);
          return evidenceRecord && typeof evidenceRecord.note === "string"
            ? [{ note: evidenceRecord.note }]
            : [];
        })
      : [];
    return [{
      roleId,
      overallCapability: typeof profile.overallCapability === "string" ? profile.overallCapability : undefined,
      evidence,
    }];
  });
}

function availabilityConfirmedAt(engineer: EngineerProfile): string | undefined {
  const value = record(engineer)?.availabilityConfirmedAt;
  return typeof value === "string" ? value : undefined;
}

export function calculateAvailabilityConfidence(lastConfirmedAt?: string): CapabilityPassport["availabilityConfidence"] {
  if (!lastConfirmedAt) return { score: 20, label: "unconfirmed" };
  const ageDays = Math.max(0, (Date.now() - new Date(lastConfirmedAt).getTime()) / 86_400_000);
  if (ageDays <= 7) return { score: 100, label: "recently-confirmed", lastConfirmedAt };
  if (ageDays <= 30) return { score: 65, label: "recently-confirmed", lastConfirmedAt };
  return { score: 20, label: "stale", lastConfirmedAt };
}

export function buildCapabilityPassport(engineer: EngineerProfile, validations: CompletionValidation[] = []): CapabilityPassport {
  const profiles = compatibleRoleProfiles(engineer);
  return {
    engineerId: engineer.id,
    sectorProfiles: engineer.sectorProfiles || [],
    roleProfiles: profiles.map((profile) => {
      const roleId = profile.roleId;
      const roleValidations = validations.filter((item) => item.roleId === roleId && item.responsibilityMet);
      const supportingEvidence: CapabilityEvidence[] = [
        ...profile.evidence.map((item) => ({ roleId, confidence: "supported" as const, source: "evidence" as const, summary: item.note || "Profile evidence" })),
        ...roleValidations.map((item) => ({ roleId, confidence: "client-validated" as const, source: "completion-validation" as const, summary: `Validated after contract ${item.contractId}`, observedAt: item.createdAt })),
      ];
      const repeatPositive = roleValidations.filter((item) => item.wouldUseAgainForRole && !item.unexpectedSupervisionRequired).length;
      const confidence = repeatPositive >= 3 ? "proven" : roleValidations.length ? "client-validated" : supportingEvidence.length ? "supported" : "self-declared";
      return { roleId, overallCapability: profile.overallCapability, confidence, supportingEvidence };
    }),
    certifications: engineer.certifications || [],
    readiness: { complianceScore: engineer.complianceScore, identity: engineer.identity, compliance: engineer.compliance },
    availabilityConfidence: calculateAvailabilityConfidence(availabilityConfirmedAt(engineer)),
  };
}

export function explainCandidateMatch(input: { engineerId: string; roleMatch: boolean; responsibilityMatch: boolean; prerequisites: string[]; productExperience: Record<string,string>; evidence: CapabilityEvidence[]; availabilityScore: number }): ExplainableShortlistEntry {
  const normalise = (value: string) => value.trim().toLowerCase();
  const prerequisitesMet = input.prerequisites.filter((item) => Object.keys(input.productExperience).some((tag) => normalise(tag) === normalise(item)));
  const prerequisitesMissing = input.prerequisites.filter((item) => !prerequisitesMet.includes(item));
  const evidenceConfidence = input.evidence.reduce((best, item) => Math.max(best, confidenceRank[item.confidence]), 1);
  const score = Math.round((input.roleMatch ? 40 : 0) + (input.responsibilityMatch ? 25 : 0) + (input.prerequisites.length ? prerequisitesMet.length / input.prerequisites.length * 20 : 20) + Math.min(10, evidenceConfidence * 2) + Math.min(5, input.availabilityScore / 20));
  const outcome = !input.roleMatch || prerequisitesMissing.length ? "excluded" : !input.responsibilityMatch ? "review" : "eligible";
  return { engineerId: input.engineerId, outcome, score, prerequisitesMet, prerequisitesMissing, reasons: [input.roleMatch ? "Exact job-role profile held." : "Requested job-role profile is missing.", input.responsibilityMatch ? "Responsibility level is suitable." : "Responsibility level needs review.", prerequisitesMet.length ? `${prerequisitesMet.length} mandatory prerequisite(s) met.` : "No prerequisite match evidenced."].filter(Boolean), risks: [...(prerequisitesMissing.length ? [`Missing prerequisites: ${prerequisitesMissing.join(", ")}.`] : []), ...(input.availabilityScore < 50 ? ["Availability has not been confirmed recently."] : [])] };
}

export function checkOpportunityReadiness(input: { roleId?: string; roleTitle?: string; workingArrangement?: string; prerequisites?: string[]; location?: string; startDate?: string; scope?: string }) {
  const warnings: string[] = [];
  if (!input.roleId) warnings.push("Choose a canonical job role; a free-text engineer title is too ambiguous.");
  if (!input.workingArrangement) warnings.push("State whether the engineer will assist, deliver independently or lead.");
  if ((input.prerequisites || []).length > 3) warnings.push("More than three mandatory prerequisites may unnecessarily narrow the shortlist.");
  if (!input.location) warnings.push("Add a site or remote-work location.");
  if (!input.startDate) warnings.push("Add a required start date so availability can be validated.");
  if (!input.scope || input.scope.trim().length < 30) warnings.push("Describe the deliverable and completion evidence, not only the technology name.");
  return { ready: warnings.length === 0, warnings };
}

export function analyseTeamCoverage(requiredRoleIds: string[], members: Array<{ engineerId: string; roleIds: string[] }>) {
  const coveredRoleIds = requiredRoleIds.filter((roleId) => members.some((member) => member.roleIds.includes(roleId)));
  const missingRoleIds = requiredRoleIds.filter((roleId) => !coveredRoleIds.includes(roleId));
  return { coveredRoleIds, missingRoleIds, complete: missingRoleIds.length === 0 };
}

export function generateTechnicalWorkPack(input: { jobId: string; roleId: string; responsibility: string; scope: string; exclusions: string[]; prerequisites: string[]; siteContact: string; escalationContact: string; completionEvidence: string[] }) {
  return { version: 1, generatedAt: new Date().toISOString(), ...input, paymentNotice: "TechSubbies records scope and delivery only. Job invoicing and payment remain directly between the parties." };
}
