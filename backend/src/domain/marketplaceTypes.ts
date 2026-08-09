export const ENGINEER_PROFILE_SCHEMA_VERSION = 2 as const;
export const JOB_SCHEMA_VERSION = 2 as const;

export type ResponsibilityLevel = "assist" | "deliver" | "diagnose" | "lead";
export type CapabilityClaim = "support" | "independent" | "not-offered";

export interface CapabilityEvidenceDTO {
  type?: string;
  note?: string;
  [key: string]: unknown;
}

export interface CapabilityDTO {
  skillId: string;
  claim: CapabilityClaim;
  evidenceNote: string;
}

export interface CanonicalCapabilityProfileDTO {
  roleId: string;
  overallCapability: ResponsibilityLevel;
  capabilities: CapabilityDTO[];
  keywords: string[];
  productExperience: Record<string, string>;
  productTags: string[];
  brandTags: string[];
  platformTags: string[];
  certificationTags: string[];
  customKeywords: string[];
  evidence: CapabilityEvidenceDTO[];
  profileNote: string;
}

export interface CanonicalEngineerProfileDTO extends Record<string, unknown> {
  profileSchemaVersion: typeof ENGINEER_PROFILE_SCHEMA_VERSION;
  capabilityProfiles: CanonicalCapabilityProfileDTO[];
  roleSkillProfiles: CanonicalCapabilityProfileDTO[];
}

export interface CanonicalSkillRequirementDTO {
  skillId: string;
  required: boolean;
  roleId?: string;
}

export interface CanonicalPrerequisiteDTO {
  label: string;
  category: string;
  minimumExperience: string;
}

export interface CanonicalRoleRequirementDTO {
  roleId: string;
  quantity: number;
  responsibility: ResponsibilityLevel;
  skills: CanonicalSkillRequirementDTO[];
  prerequisites: CanonicalPrerequisiteDTO[];
}

export interface CanonicalJobDTO extends Record<string, unknown> {
  jobSchemaVersion: typeof JOB_SCHEMA_VERSION;
  title: string;
  requestedExpectationId: string;
  roleId: string;
  roleIds: string[];
  roleRequirements: CanonicalRoleRequirementDTO[];
  skillRequirements: CanonicalSkillRequirementDTO[];
  prerequisites: CanonicalPrerequisiteDTO[];
}

export interface PersistedJobDTO extends CanonicalJobDTO {
  id: string;
  companyId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceApplicationDTO extends Record<string, unknown> {
  id: string;
  jobId: string;
  engineerId: string;
  status: string;
}

export type ShortlistOutcome = "eligible" | "review" | "excluded";

export interface ShortlistCandidateDTO {
  applicationId: string;
  engineerId: string;
  engineerName: string;
  outcome: ShortlistOutcome;
  score: number;
  roleMatch: boolean;
  responsibilityFit: boolean;
  matchedPrerequisites: string[];
  missingPrerequisites: string[];
  matchedSkills: string[];
  missingSkills: string[];
  availability: { confidence: "fresh" | "aging" | "stale" | "unconfirmed"; confirmedAt: string | null };
  evidenceCount: number;
  reasons: string[];
  risks: string[];
}

export interface ShortlistResponseDTO {
  job: Pick<PersistedJobDTO, "id" | "title" | "roleId">;
  generatedAt: string;
  method: string;
  candidates: ShortlistCandidateDTO[];
}
