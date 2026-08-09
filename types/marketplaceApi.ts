export type ShortlistOutcome = "eligible" | "review" | "excluded";

export interface MarketplaceShortlistCandidate {
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

export interface MarketplaceShortlistResponse {
  job: { id: string; title: string; roleId: string };
  generatedAt: string;
  method: string;
  candidates: MarketplaceShortlistCandidate[];
}

export type ContractResponseDTO = Omit<Contract, 'engineerSignature' | 'companySignature'> & {
  schemaVersion: typeof MARKETPLACE_API_SCHEMA_VERSION;
  engineerSignature: { name: string; date: string } | null;
  companySignature: { name: string; date: string } | null;
};

export type MembershipBillingStatusDTO = 'free' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'unpaid' | 'canceled' | 'paused';

export interface MembershipBillingStateDTO {
  schemaVersion: typeof MARKETPLACE_API_SCHEMA_VERSION;
  tier: ProfileTier;
  status: MembershipBillingStatusDTO;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  hasCustomer: boolean;
  hasSubscription: boolean;
  paymentIssue: boolean;
  lastPaymentFailedAt: string | null;
}
import type { Contract, Country, Currency, Discipline, ExperienceLevel, ProfileTier, Role, User } from './index';

export const MARKETPLACE_API_SCHEMA_VERSION = 1 as const;

export interface RegistrationRequestDTO {
  email: string;
  password: string;
  role: Role.ENGINEER | Role.COMPANY | Role.RESOURCING_COMPANY;
  name: string;
  profileData: Record<string, unknown>;
}

export interface EngineerRegistrationInput {
  name?: string;
  fullName?: string;
  email: string;
  password: string;
  discipline?: Discipline;
  location?: string;
  baseLocation?: string;
  country?: Country | string;
  experience?: number;
  experienceLevel?: ExperienceLevel;
  minDayRate?: number;
  maxDayRate?: number;
  currency?: Currency;
  availability?: string | Date;
  workingRadiusMiles?: number;
  compliance?: Record<string, unknown>;
  identity?: Record<string, unknown>;
  readiness?: Record<string, unknown>;
  roleProfiles?: unknown[];
  selectedJobRoles?: unknown[];
  documentNotes?: string;
}

export interface CompanyRegistrationInput {
  contactName: string;
  email: string;
  password: string;
  companyName: string;
  website: string;
  location: string;
  country?: Country;
  regNumber?: string;
}

export type RequestStatusDTO = 'pending' | 'accepted' | 'declined';

export interface PartnershipRequestDTO {
  id: string;
  requesterId: string;
  partnerId: string;
  status: RequestStatusDTO;
  createdAt: string;
  updatedAt: string;
}

export interface PartnershipMutationResponseDTO {
  status: RequestStatusDTO | 'removed';
  request?: PartnershipRequestDTO;
}

export interface PartnershipStatusResponseDTO {
  incoming: PartnershipRequestDTO[];
  outgoing: PartnershipRequestDTO[];
  partner: User | null;
}

export interface CompanyAttachmentRequestDTO {
  id: string;
  engineerId: string;
  resourcingCompanyId: string;
  status: RequestStatusDTO;
  createdAt: string;
  updatedAt: string;
  engineer?: User | null;
}

export interface CompanyAttachmentMutationResponseDTO {
  status: RequestStatusDTO;
  request: CompanyAttachmentRequestDTO;
}

export type PendingCompanyAttachmentRequestDTO = CompanyAttachmentRequestDTO & {
  engineer: User | null;
};

export interface WorkforceInsightsDTO {
  totals: {
    jobs: number;
    applications: number;
    contracts: number;
    completedContracts: number;
    validations: number;
    positiveValidations: number;
  };
  conversion: {
    applicationsPerJob: number;
    applicationToContractPercent: number;
    contractCompletionPercent: number;
  };
  availability: { freshnessPercent: number };
  roleDemand: Array<{ roleId: string; count: number }>;
  privacyNotice: string;
}

export interface CompanyAuditEventDTO {
  id: string;
  companyId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
}

export type AvailabilityWorkingDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type WeekendWorkPreference = 'no' | 'yes' | 'premium-only';

export interface EngineerAvailabilityInputDTO {
  availableFrom: string;
  baseLocation: string;
  travelRadiusMiles: number;
  workingDays: AvailabilityWorkingDay[];
  minimumNoticeDays: number;
  overnightWork: boolean;
  weekendWork: WeekendWorkPreference;
  emergencyCallout: boolean;
}

export interface ProjectTeamMemberDTO {
  engineerId: string;
  roleIds: string[];
}

export interface ProjectTeamInputDTO {
  name: string;
  requiredRoleIds: string[];
  members: ProjectTeamMemberDTO[];
}

export interface ProjectTeamDTO extends ProjectTeamInputDTO {
  id: string;
  companyId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ContractContactDTO {
  contractId: string;
  partyId: string;
  name: string;
  role: string;
  contact: {
    email?: string;
    phone?: string;
    linkedin?: string;
    website?: string;
  };
}
