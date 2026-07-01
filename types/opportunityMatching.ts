export type MatchOutcome = "NO MATCH" | "PARTIAL MATCH" | "GOOD MATCH";

export type SkillMatchStatus = "matched" | "missing" | "near-match" | "not-required";

export type ProductExperienceLevel =
  | "aware"
  | "assisted"
  | "installed"
  | "configured"
  | "administered"
  | "commissioned"
  | "programmed"
  | "troubleshot"
  | "certified";

export type SkillRequirement = {
  id: string;
  label: string;
  priority: "must-have" | "nice-to-have";
  aliases?: string[];
};

export type ProductRequirement = {
  tagId: string;
  label: string;
  minimumLevel: ProductExperienceLevel;
  priority: "must-have" | "nice-to-have";
};

export type OpportunityRequirement = {
  id: string;
  title: string;
  market: "AV" | "IT" | "AV+IT";
  roleIds: string[];
  summary: string;
  locationMode: "onsite" | "remote" | "hybrid";
  skillRequirements: SkillRequirement[];
  productRequirements: ProductRequirement[];
  notes?: string[];
};

export type CandidateSkillProfile = {
  id: string;
  displayName: string;
  market: "AV" | "IT" | "AV+IT";
  roleIds: string[];
  roleTitles: string[];
  skills: string[];
  productExperience: Record<string, ProductExperienceLevel>;
  evidence?: string[];
  availabilitySummary?: string;
};

export type RequirementResult = {
  label: string;
  priority: "must-have" | "nice-to-have";
  status: SkillMatchStatus;
  reason: string;
};

export type ProductRequirementResult = {
  label: string;
  tagId: string;
  priority: "must-have" | "nice-to-have";
  requiredLevel: ProductExperienceLevel;
  candidateLevel?: ProductExperienceLevel;
  status: SkillMatchStatus;
  reason: string;
};

export type OpportunityMatchResult = {
  opportunityId: string;
  candidateId: string;
  outcome: MatchOutcome;
  score: number;
  roleFitScore: number;
  mustHaveScore: number;
  niceToHaveScore: number;
  productScore: number;
  matchedMustHave: number;
  missingMustHave: number;
  matchedNiceToHave: number;
  missingNiceToHave: number;
  matchedProducts: number;
  missingProducts: number;
  reasons: string[];
  risks: string[];
  nextQuestions: string[];
  skillResults: RequirementResult[];
  productResults: ProductRequirementResult[];
};
