import type {
  CandidateSkillProfile,
  MatchOutcome,
  OpportunityMatchResult,
  OpportunityRequirement,
  ProductExperienceLevel,
  ProductRequirement,
  ProductRequirementResult,
  RequirementResult,
  SkillRequirement
} from "../types/opportunityMatching";

const experienceRank: Record<ProductExperienceLevel, number> = {
  aware: 1,
  assisted: 2,
  installed: 3,
  configured: 4,
  administered: 4,
  commissioned: 5,
  programmed: 6,
  troubleshot: 6,
  certified: 7
};

function normalise(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function includesTerm(candidateValues: string[], target: string): boolean {
  const targetNormalised = normalise(target);

  return candidateValues.some((value) => {
    const candidateNormalised = normalise(value);
    return candidateNormalised === targetNormalised || candidateNormalised.includes(targetNormalised) || targetNormalised.includes(candidateNormalised);
  });
}

function evaluateSkillRequirement(
  candidate: CandidateSkillProfile,
  requirement: SkillRequirement
): RequirementResult {
  const candidateSkills = candidate.skills;
  const terms = [requirement.label, ...(requirement.aliases ?? [])];

  const matched = terms.some((term) => includesTerm(candidateSkills, term));

  if (matched) {
    return {
      label: requirement.label,
      priority: requirement.priority,
      status: "matched",
      reason: "Candidate profile includes this skill or a close equivalent."
    };
  }

  const nearMatch = candidateSkills.some((skill) => {
    const skillWords = normalise(skill).split(" ").filter(Boolean);
    const requirementWords = normalise(requirement.label).split(" ").filter(Boolean);
    const overlap = requirementWords.filter((word) => skillWords.includes(word)).length;
    return overlap >= 2;
  });

  if (nearMatch) {
    return {
      label: requirement.label,
      priority: requirement.priority,
      status: "near-match",
      reason: "Candidate profile contains related wording, but it should be checked before confirming suitability."
    };
  }

  return {
    label: requirement.label,
    priority: requirement.priority,
    status: "missing",
    reason: "Candidate profile does not currently show this requirement."
  };
}

function evaluateProductRequirement(
  candidate: CandidateSkillProfile,
  requirement: ProductRequirement
): ProductRequirementResult {
  const candidateLevel = candidate.productExperience[requirement.tagId];

  if (!candidateLevel) {
    return {
      label: requirement.label,
      tagId: requirement.tagId,
      priority: requirement.priority,
      requiredLevel: requirement.minimumLevel,
      status: "missing",
      reason: "Candidate profile does not show experience with this product, platform or technology tag."
    };
  }

  const candidateRank = experienceRank[candidateLevel] ?? 0;
  const requiredRank = experienceRank[requirement.minimumLevel] ?? 0;

  if (candidateRank >= requiredRank) {
    return {
      label: requirement.label,
      tagId: requirement.tagId,
      priority: requirement.priority,
      requiredLevel: requirement.minimumLevel,
      candidateLevel,
      status: "matched",
      reason: "Candidate product experience meets or exceeds the requested level."
    };
  }

  return {
    label: requirement.label,
    tagId: requirement.tagId,
    priority: requirement.priority,
    requiredLevel: requirement.minimumLevel,
    candidateLevel,
    status: "near-match",
    reason: "Candidate has some exposure, but not at the requested experience level."
  };
}

function scoreRequirementResults(results: RequirementResult[], priority: "must-have" | "nice-to-have"): number {
  const relevant = results.filter((result) => result.priority === priority);

  if (!relevant.length) {
    return 100;
  }

  const points = relevant.reduce((total, result) => {
    if (result.status === "matched") {
      return total + 1;
    }

    if (result.status === "near-match") {
      return total + 0.45;
    }

    return total;
  }, 0);

  return Math.round((points / relevant.length) * 100);
}

function scoreProductResults(results: ProductRequirementResult[]): number {
  if (!results.length) {
    return 100;
  }

  const points = results.reduce((total, result) => {
    if (result.status === "matched") {
      return total + 1;
    }

    if (result.status === "near-match") {
      return total + 0.45;
    }

    return total;
  }, 0);

  return Math.round((points / results.length) * 100);
}

function calculateRoleFit(candidate: CandidateSkillProfile, opportunity: OpportunityRequirement): number {
  if (!opportunity.roleIds.length) {
    return 100;
  }

  const matchedRoles = opportunity.roleIds.filter((roleId) => candidate.roleIds.includes(roleId)).length;

  if (matchedRoles > 0) {
    return 100;
  }

  const opportunityRoleText = opportunity.roleIds.join(" ");
  const candidateRoleText = candidate.roleTitles.join(" ");

  if (includesTerm([candidateRoleText], opportunityRoleText)) {
    return 70;
  }

  return 35;
}

function classify(score: number, missingMustHave: number, missingProducts: number): MatchOutcome {
  if (missingMustHave >= 2) {
    return "NO MATCH";
  }

  if (missingMustHave >= 1 && score < 76) {
    return "PARTIAL MATCH";
  }

  if (missingProducts >= 2 && score < 78) {
    return "PARTIAL MATCH";
  }

  if (score >= 82) {
    return "GOOD MATCH";
  }

  if (score >= 52) {
    return "PARTIAL MATCH";
  }

  return "NO MATCH";
}

export function scoreOpportunityCandidate(
  opportunity: OpportunityRequirement,
  candidate: CandidateSkillProfile
): OpportunityMatchResult {
  const skillResults = opportunity.skillRequirements.map((requirement) =>
    evaluateSkillRequirement(candidate, requirement)
  );

  const productResults = opportunity.productRequirements.map((requirement) =>
    evaluateProductRequirement(candidate, requirement)
  );

  const roleFitScore = calculateRoleFit(candidate, opportunity);
  const mustHaveScore = scoreRequirementResults(skillResults, "must-have");
  const niceToHaveScore = scoreRequirementResults(skillResults, "nice-to-have");
  const productScore = scoreProductResults(productResults);

  const matchedMustHave = skillResults.filter((result) => result.priority === "must-have" && result.status === "matched").length;
  const missingMustHave = skillResults.filter((result) => result.priority === "must-have" && result.status === "missing").length;
  const matchedNiceToHave = skillResults.filter((result) => result.priority === "nice-to-have" && result.status === "matched").length;
  const missingNiceToHave = skillResults.filter((result) => result.priority === "nice-to-have" && result.status === "missing").length;
  const matchedProducts = productResults.filter((result) => result.status === "matched").length;
  const missingProducts = productResults.filter((result) => result.priority === "must-have" && result.status === "missing").length;

  const score = Math.round(
    roleFitScore * 0.2 +
    mustHaveScore * 0.38 +
    niceToHaveScore * 0.17 +
    productScore * 0.25
  );

  const outcome = classify(score, missingMustHave, missingProducts);

  const reasons: string[] = [];
  const risks: string[] = [];
  const nextQuestions: string[] = [];

  if (roleFitScore >= 100) {
    reasons.push("Candidate role profile directly matches the opportunity role.");
  }

  if (matchedMustHave > 0) {
    reasons.push("Candidate matches " + matchedMustHave + " must-have skill requirement(s).");
  }

  if (matchedProducts > 0) {
    reasons.push("Candidate has matching product or platform experience.");
  }

  skillResults
    .filter((result) => result.priority === "must-have" && result.status !== "matched")
    .forEach((result) => {
      risks.push("Check required skill: " + result.label + ".");
      nextQuestions.push("Can the candidate provide evidence for " + result.label + "?");
    });

  productResults
    .filter((result) => result.priority === "must-have" && result.status !== "matched")
    .forEach((result) => {
      risks.push("Check product/platform experience: " + result.label + ".");
      nextQuestions.push("What level of hands-on experience does the candidate have with " + result.label + "?");
    });

  if (!risks.length) {
    risks.push("No major must-have gaps found from the supplied profile data.");
  }

  if (!nextQuestions.length) {
    nextQuestions.push("Confirm availability, location fit, day rate and project-specific constraints.");
  }

  return {
    opportunityId: opportunity.id,
    candidateId: candidate.id,
    outcome,
    score,
    roleFitScore,
    mustHaveScore,
    niceToHaveScore,
    productScore,
    matchedMustHave,
    missingMustHave,
    matchedNiceToHave,
    missingNiceToHave,
    matchedProducts,
    missingProducts,
    reasons,
    risks,
    nextQuestions,
    skillResults,
    productResults
  };
}

export function rankCandidatesForOpportunity(
  opportunity: OpportunityRequirement,
  candidates: CandidateSkillProfile[]
): OpportunityMatchResult[] {
  return candidates
    .map((candidate) => scoreOpportunityCandidate(opportunity, candidate))
    .sort((first, second) => second.score - first.score);
}

export function getOutcomeLabel(outcome: MatchOutcome): string {
  if (outcome === "GOOD MATCH") {
    return "Good match";
  }

  if (outcome === "PARTIAL MATCH") {
    return "Partial match";
  }

  return "No match";
}
