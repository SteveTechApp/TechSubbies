export type OpportunityMatchStatus =
  | "sent"
  | "viewed"
  | "accepted"
  | "declined"
  | "ignored"
  | "expired"
  | "countered"
  | "withdrawn"
  | "customer_selected_other"
  | "unsuitable";

export type OpportunitySuitabilityFailure =
  | "outside_role"
  | "outside_skills"
  | "outside_location"
  | "outside_availability"
  | "outside_rate_preference"
  | "missing_required_documents"
  | "incomplete_opportunity"
  | "customer_withdrew_before_review"
  | "already_filled_before_review";

export type ServiceBoundaryPoint = {
  title: string;
  description: string;
};

export type SuitableOpportunityAlert = {
  id: string;
  customerName: string;
  roleCategory: string;
  requiredSkills: string[];
  location: string;
  distanceMiles: number;
  date: string;
  startTime: string;
  durationHours: number;
  rateVisible: boolean;
  availabilityMatched: boolean;
  skillMatched: boolean;
  locationMatched: boolean;
  preferenceMatched: boolean;
  status: OpportunityMatchStatus;
  sentAt: string;
  viewedAt?: string;
  respondedAt?: string;
  failureReasons?: OpportunitySuitabilityFailure[];
};

export type EngineerSubscriptionMonth = {
  memberId: string;
  memberName: string;
  paidPlanName: string;
  monthLabel: string;
  profileComplete: boolean;
  availabilityConfigured: boolean;
  contactVerified: boolean;
  activeSpecialistProfiles: number;
  blockedAllAvailability: boolean;
  suitableAlerts: SuitableOpportunityAlert[];
};

export type GuaranteeAssessment = {
  eligible: boolean;
  creditDue: boolean;
  title: string;
  summary: string;
  reasons: string[];
  countedOpportunityIds: string[];
};
