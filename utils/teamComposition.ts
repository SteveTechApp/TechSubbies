// Budget-aware matching: given a pool of already skill-scored candidates,
// work out realistic ways to staff a role within a customer's budget - not
// just "who's the single best match", but also "a cheaper junior paired
// with a lead" when that's what it takes to fit the budget. This wraps
// whatever scored the candidates (services/opportunityMatchEngine.ts or
// services/skillMatching.ts) rather than replacing either - it only needs
// an id, day rate, experience level and match score per candidate.

export type CompositionExperienceLevel = 'Junior' | 'Mid-level' | 'Senior' | 'Expert' | string;

export interface CompositionCandidate {
    id: string;
    name: string;
    dayRate: number;
    experienceLevel: CompositionExperienceLevel;
    matchScore: number; // 0-100, from whichever engine scored this candidate
}

export interface TeamComposition {
    type: 'solo' | 'junior-plus-lead';
    members: CompositionCandidate[];
    totalDayRate: number;
    // Weighted so the person actually doing the work counts most, but a
    // paired lead's own competence still matters.
    combinedScore: number;
    // null when no budget ceiling was supplied - callers can then just show
    // cost without an in/out-of-budget badge.
    withinBudget: boolean | null;
}

const SENIOR_LEVELS = new Set(['senior', 'expert', 'lead']);
const JUNIOR_LEVELS = new Set(['junior']);

export function isSeniorLevel(level: CompositionExperienceLevel): boolean {
    return SENIOR_LEVELS.has(String(level).toLowerCase());
}

export function isJuniorLevel(level: CompositionExperienceLevel): boolean {
    return JUNIOR_LEVELS.has(String(level).toLowerCase());
}

// Builds every realistic staffing option from the candidate pool:
//  - "solo": each senior/expert-level candidate alone.
//  - "junior-plus-lead": each junior candidate paired with each senior/
//    expert-level candidate (satisfying the junior-must-have-a-lead rule -
//    see utils/leadSupervision.ts for the posting/contract-time version of
//    this same rule).
// Ranked by combinedScore (skill fit) first, regardless of budget - budget
// is a label on each option (withinBudget), never a filter, so a company
// can still see and choose an over-budget option deliberately rather than
// have it hidden.
export function buildTeamCompositions(
    candidates: CompositionCandidate[],
    budgetCeiling?: number
): TeamComposition[] {
    const seniors = candidates.filter((c) => isSeniorLevel(c.experienceLevel));
    const juniors = candidates.filter((c) => isJuniorLevel(c.experienceLevel));

    const withinBudget = (total: number): boolean | null =>
        budgetCeiling === undefined || budgetCeiling === null ? null : total <= budgetCeiling;

    const soloOptions: TeamComposition[] = seniors.map((senior) => ({
        type: 'solo',
        members: [senior],
        totalDayRate: senior.dayRate,
        combinedScore: senior.matchScore,
        withinBudget: withinBudget(senior.dayRate),
    }));

    const pairedOptions: TeamComposition[] = [];
    for (const junior of juniors) {
        for (const lead of seniors) {
            const totalDayRate = junior.dayRate + lead.dayRate;
            pairedOptions.push({
                type: 'junior-plus-lead',
                members: [junior, lead],
                totalDayRate,
                combinedScore: junior.matchScore * 0.7 + lead.matchScore * 0.3,
                withinBudget: withinBudget(totalDayRate),
            });
        }
    }

    return [...soloOptions, ...pairedOptions].sort((a, b) => b.combinedScore - a.combinedScore);
}
