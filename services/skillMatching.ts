import { EngineerProfile, Job, JobSkillRequirement, Review } from '../types';
import { meetsRequiredLevel } from '../utils/skillBands';
import { computeSkillEvidence, findCompletedJobEvidenceForSkill, findVerifiedCertificateEvidenceForSkill } from '../utils/skillEvidence';

// Optional context that lets scoring use evidence-adjusted ratings (see
// utils/skillEvidence.ts) instead of the raw self-rating - i.e. a rating
// that's been pulled toward what's actually been proven on completed jobs
// and verified certificates. Passing this in is opt-in and backward
// compatible: callers that don't have jobs/reviews handy yet keep getting
// plain self-ratings, exactly as before.
export interface EvidenceContext {
    jobs: Job[];
    reviews: Review[];
}

// Looks up an engineer's evidence-adjusted rating for a named skill. Falls
// back to their plain self-rating when there's no completed-job or
// certificate evidence for that skill yet - the self-rating never
// disappears, it just stops being the only input once real evidence exists.
export function getEffectiveSkillRating(
    engineer: EngineerProfile,
    skillName: string,
    context: EvidenceContext
): number | null {
    const selfRating = findEngineerSkillRating(engineer, skillName);
    if (selfRating === null) return null;

    const completedJobs = findCompletedJobEvidenceForSkill(skillName, context.jobs, context.reviews, engineer.id);
    const verifiedCertificates = findVerifiedCertificateEvidenceForSkill(skillName, engineer.certifications || []);

    if (completedJobs.length === 0 && verifiedCertificates.length === 0) return selfRating;

    return computeSkillEvidence({ skillName, selfRating, completedJobs, verifiedCertificates }).effectiveRating;
}

// A job posted before the required-level slider existed won't have a
// requiredLevel on its skill requirements - fall back to a sensible band
// based on the older essential/desirable importance flag.
export function getRequiredLevel(requirement: JobSkillRequirement): number {
    if (typeof requirement.requiredLevel === 'number') {
        return requirement.requiredLevel;
    }
    return requirement.importance === 'essential' ? 60 : 35;
}

// Looks up an engineer's own 0-100 rating for a named skill across all of
// their specialist roles. Returns null if they haven't rated that skill at
// all (distinct from a genuine 0 rating).
export function findEngineerSkillRating(engineer: EngineerProfile, skillName: string): number | null {
    const normalized = skillName.trim().toLowerCase();
    const roles = engineer.selectedJobRoles || [];
    for (const role of roles) {
        const match = role.skills.find((s) => s.name.trim().toLowerCase() === normalized);
        if (match) return match.rating;
    }
    return null;
}

// Deterministic 0-100 score for how well an engineer's own skill ratings
// meet a job's required levels. Used to gate/sort candidates with real
// numbers before handing a shortlist to the AI for final ranking - so the
// slider values actually drive who gets considered, not just phrasing in
// an AI prompt.
export function computeSkillRequirementScore(engineer: EngineerProfile, job: Job, evidenceContext?: EvidenceContext): number {
    const requirements = job.skillRequirements || [];
    if (requirements.length === 0) return 100; // No specific requirements - everyone qualifies equally.

    let total = 0;
    for (const requirement of requirements) {
        const requiredLevel = getRequiredLevel(requirement);
        const rating = evidenceContext
            ? getEffectiveSkillRating(engineer, requirement.name, evidenceContext)
            : findEngineerSkillRating(engineer, requirement.name);

        if (rating === null) {
            total += 0; // Skill not on their profile at all.
        } else if (meetsRequiredLevel(rating, requiredLevel)) {
            total += 100; // Meets or exceeds what's required - full credit.
        } else {
            // Partial credit proportional to how close they are.
            total += Math.max(0, Math.round((rating / requiredLevel) * 100));
        }
    }

    return Math.round(total / requirements.length);
}

// Ranks engineers by their deterministic requirement score and returns the
// top N - a pre-filter so the AI only has to choose among genuinely
// qualified candidates rather than re-deriving numeric thresholds itself.
export function shortlistByRequirementScore(
    engineers: EngineerProfile[],
    job: Job,
    limit: number = 15,
    evidenceContext?: EvidenceContext
): (EngineerProfile & { requirementScore: number })[] {
    return engineers
        .map((engineer) => ({ ...engineer, requirementScore: computeSkillRequirementScore(engineer, job, evidenceContext) }))
        .sort((a, b) => b.requirementScore - a.requirementScore)
        .slice(0, limit);
}
