export type ComplianceOwnerType =
  | "ENGINEER"
  | "COMPANY"
  | "RESOURCING_COMPANY"
  | "PROJECT";

export type ComplianceDocumentCategory =
  | "SAFETY_SITE_ACCESS"
  | "AV_INDUSTRY"
  | "IT_NETWORKING_SECURITY"
  | "MANUFACTURER_PLATFORM"
  | "PROJECT_MANAGEMENT"
  | "INSURANCE"
  | "COMPANY_QUALITY_STANDARD"
  | "REGIONAL_COMPLIANCE"
  | "BACKGROUND_CHECK"
  | "WORK_EVIDENCE";

export type ComplianceRequirementLevel =
  | "PROJECT_MANDATORY"
  | "STRONGLY_PREFERRED"
  | "USEFUL_EVIDENCE"
  | "COMPANY_LEVEL_ONLY"
  | "REGION_SPECIFIC"
  | "ROLE_NOT_RELEVANT";

export type ComplianceVerificationStatus =
  | "NOT_SUPPLIED"
  | "SELF_DECLARED"
  | "EVIDENCE_SUPPLIED"
  | "DOCUMENT_UPLOADED"
  | "DOCUMENT_VERIFIED"
  | "PLATFORM_VERIFIED"
  | "EXPIRED"
  | "REJECTED";

export type ComplianceExpiryStatus =
  | "NO_EXPIRY"
  | "VALID"
  | "EXPIRING_SOON"
  | "EXPIRED"
  | "UNKNOWN";

export type TrustBadgeKey =
  | "ID_VERIFIED"
  | "COUNTRY_VERIFIED"
  | "INSURANCE_VERIFIED"
  | "SAFETY_VERIFIED"
  | "SKILL_EVIDENCE_SUPPLIED"
  | "CERTIFIED"
  | "MANUFACTURER_CERTIFIED"
  | "COMPANY_QUALITY_VERIFIED"
  | "PROJECT_MANAGEMENT_VERIFIED"
  | "BACKGROUND_CHECKED"
  | "PLATFORM_VERIFIED"
  | "WORK_PROVEN";

export interface ComplianceRequirementLevelDefinition {
  key: ComplianceRequirementLevel;
  label: string;
  description: string;
  matchScoreWeight: number;
}

export interface ComplianceCredentialDefinition {
  key: string;
  category: ComplianceDocumentCategory;
  title: string;
  description: string;
  typicalOwners: ComplianceOwnerType[];
  appliesToMarkets: Array<"AV" | "IT" | "AV_IT" | "GENERAL">;
  examples: string[];
  defaultRequirementLevel: ComplianceRequirementLevel;
  expires: boolean;
  recommendedExpiryMonths?: number;
  requiresOfficialDocument: boolean;
  notes: string;
}

export interface RoleComplianceRequirement {
  roleKey: string;
  roleTitle: string;
  requirementSummary: string;
  requirements: Array<{
    requirementLevel: ComplianceRequirementLevel;
    credentialKeys: string[];
    reason: string;
  }>;
}

export interface UploadedComplianceDocument {
  id: string;
  ownerId: string;
  ownerType: ComplianceOwnerType;
  credentialKey: string;
  documentTitle: string;
  issuer?: string;
  certificateNumber?: string;
  countryCode?: string;
  issueDate?: string;
  expiryDate?: string;
  verificationStatus: ComplianceVerificationStatus;
  evidenceFileName?: string;
  verifiedBy?: string;
  lastCheckedDate?: string;
  notes?: string;
}

export interface ComplianceMatchResult {
  credentialKey: string;
  title: string;
  requirementLevel: ComplianceRequirementLevel;
  verificationStatus: ComplianceVerificationStatus;
  expiryStatus: ComplianceExpiryStatus;
  matchScoreWeight: number;
  blocksMatch: boolean;
  warning?: string;
}

export interface TrustBadgeDefinition {
  key: TrustBadgeKey;
  label: string;
  description: string;
  credentialKeys: string[];
}