export type ConfidenceLevel = "self-declared" | "supported" | "reviewed" | "client-validated" | "proven";

export interface CapabilityEvidence {
  roleId: string;
  capabilityId?: string;
  productTag?: string;
  confidence: ConfidenceLevel;
  source: "profile" | "evidence" | "completion-validation" | "certification";
  summary: string;
  observedAt?: string;
}

export interface CompletionValidation {
  id: string;
  contractId: string;
  engineerId: string;
  validatorId: string;
  roleId: string;
  responsibilityMet: boolean;
  capabilitiesObserved: string[];
  unexpectedSupervisionRequired: boolean;
  wouldUseAgainForRole: boolean;
  comments?: string;
  createdAt: string;
}

export interface TalentPoolEntry {
  id: string;
  ownerCompanyId: string;
  engineerId: string;
  engineerName?: string;
  list: "preferred" | "approved" | "backup" | "restricted";
  approvedRoleIds: string[];
  approvedClientOrSite?: string;
  privateNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CapabilityPassport {
  engineerId: string;
  sectorProfiles: unknown[];
  roleProfiles: Array<{ roleId: string; overallCapability?: string; confidence: ConfidenceLevel; supportingEvidence: CapabilityEvidence[] }>;
  certifications: unknown[];
  readiness: Record<string, unknown>;
  availabilityConfidence: { score: number; label: "stale" | "unconfirmed" | "recently-confirmed"; lastConfirmedAt?: string };
}

export interface ExplainableShortlistEntry {
  engineerId: string;
  outcome: "eligible" | "review" | "excluded";
  score: number;
  reasons: string[];
  risks: string[];
  prerequisitesMet: string[];
  prerequisitesMissing: string[];
}
