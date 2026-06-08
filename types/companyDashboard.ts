export type CompanyAccountTier = "free" | "starter" | "pro" | "enterprise";

export type EngineerOwnershipModel =
  | "engineer_owned"
  | "company_managed"
  | "linked_shared";

export type EngineerStatus =
  | "active"
  | "suspended"
  | "hidden"
  | "removed"
  | "pending_invite";

export type VerificationStatus =
  | "verified"
  | "pending"
  | "expired"
  | "rejected"
  | "not_required";

export type DocumentScope = "company" | "group" | "engineer";

export type DocumentCategory =
  | "insurance"
  | "health_safety"
  | "company_registration"
  | "accreditation"
  | "certification"
  | "right_to_work"
  | "training"
  | "other";

export type BulkUpdateTargetMode =
  | "all_engineers"
  | "selected_groups"
  | "selected_engineers";

export type CompanyRole =
  | "owner"
  | "admin"
  | "resourcing_manager"
  | "compliance_manager"
  | "viewer"
  | "engineer";

export interface CompanyAccount {
  id: string;
  name: string;
  tier: CompanyAccountTier;
  primaryRegion: string;
  countryCode: string;
  engineerLimit: number | "unlimited";
  rolesEnabled: boolean;
  auditTrailEnabled: boolean;
  createdAt: string;
}

export interface EngineerGroup {
  id: string;
  name: string;
  description: string;
  skillFocus: string[];
  regionFocus?: string;
  active: boolean;
}

export interface ComplianceDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  scope: DocumentScope;
  owner: "company" | "engineer" | "shared";
  appliesToEngineerIds: string[];
  appliesToGroupIds: string[];
  verificationStatus: VerificationStatus;
  issuedAt?: string;
  expiresAt?: string;
  reference?: string;
  notes?: string;
}

export interface EngineerProfile {
  id: string;
  displayName: string;
  email?: string;
  location: string;
  travelRadiusMiles: number;
  ownershipModel: EngineerOwnershipModel;
  status: EngineerStatus;
  groups: string[];
  skills: string[];
  specialistProfiles: string[];
  willingToTakeBasicWork: boolean;
  onlySpecialistWork: boolean;
  calendarSyncEnabled: boolean;
  nextAvailableDate?: string;
  verificationStatus: VerificationStatus;
  profileCompleteness: number;
  companyNotes?: string;
  lastUpdatedAt: string;
}

export interface CompanyDashboardSummary {
  totalEngineers: number;
  activeEngineers: number;
  suspendedEngineers: number;
  hiddenEngineers: number;
  pendingInvites: number;
  availableNow: number;
  verifiedEngineers: number;
  profilesNeedingAttention: number;
  expiringDocuments: number;
  expiredDocuments: number;
  groupCount: number;
  topSkillCoverage: Array<{
    skill: string;
    engineerCount: number;
  }>;
}

export interface EngineerFilter {
  searchText: string;
  groupId: string;
  status: EngineerStatus | "all";
  verificationStatus: VerificationStatus | "all";
  skill: string;
}

export interface CompanyDocumentUpdateRequest {
  document: ComplianceDocument;
  targetMode: BulkUpdateTargetMode;
  targetGroupIds: string[];
  targetEngineerIds: string[];
  actorName: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actorName: string;
  affectedEngineerIds: string[];
  affectedGroupIds: string[];
  documentId?: string;
  notes: string;
  createdAt: string;
}

export interface BulkUpdateResult {
  affectedEngineerIds: string[];
  updatedDocuments: ComplianceDocument[];
  auditLogEntry: AuditLogEntry;
}