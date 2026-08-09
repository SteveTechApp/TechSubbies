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
