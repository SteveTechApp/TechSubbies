// The "skills matrix evidence loop": a self-rated skill (0-100, see
// utils/skillBands.ts) is a useful starting point, but it shouldn't be the
// only thing driving matching and trust forever. Once an engineer has
// completed jobs that needed a skill (reviewed by the hiring company) or has
// a verified certificate relevant to it, that real-world evidence should
// pull the "effective" rating toward what's actually been proven - while
// the self-rating stays visible and still counts, especially for engineers
// who haven't completed a job or earned a certificate yet.
//
// This module is pure and framework-agnostic, following the same pattern as
// utils/availability.ts, utils/leadSupervision.ts and utils/teamComposition.ts:
// it takes plain data in and returns plain data out, so it can be called from
// the matching engine, the engineer's own skill editor, or a future company-
// facing profile view without duplicating the blending logic.

import { Certification, Job, Review } from '../types';

export type SkillEvidenceSource = 'self-declared' | 'completed-job' | 'verified-certificate';

export interface SkillEvidenceEntry {
    source: SkillEvidenceSource;
    label: string;
    date?: Date;
}

export interface CompletedJobEvidence {
    jobTitle: string;
    // "Technical Skill & Professionalism" star rating left by the hiring
    // company on a completed job (see components/ReviewModal.tsx) - 1 to 5.
    peerRatingOutOf5: number;
    date: Date;
}

export interface SkillEvidenceInput {
    skillName: string;
    selfRating: number; // 0-100, always present - see utils/skillBands.ts
    completedJobs: CompletedJobEvidence[];
    verifiedCertificates: string[];
}

export interface SkillEvidenceResult {
    skillName: string;
    selfRating: number;
    // What matching/display should actually use. Equal to selfRating when
    // there's no evidence yet, otherwise a blend pulled toward proven
    // performance.
    effectiveRating: number;
    trail: SkillEvidenceEntry[];
    hasEvidence: boolean;
}

// Self-rating always keeps this much say in the final number, even once
// evidence exists, so one bad day on one job (or one early self-rating)
// can't swing the score wildly in either direction.
const SELF_RATING_WEIGHT = 40;
// Each completed job contributes this much weight, up to the cap below -
// a handful of completed jobs should matter a lot, but shouldn't make the
// self-rating irrelevant on its own.
const JOB_EVIDENCE_WEIGHT = 15;
const MAX_JOB_EVIDENCE_WEIGHT = 45;
// Certificates don't come with a numeric score, so they're treated as solid
// (but not perfect) proof of competence and given a smaller, capped weight.
const CERTIFICATE_WEIGHT = 8;
const MAX_CERTIFICATE_WEIGHT = 20;
const CERTIFICATE_IMPLIED_RATING = 90;

function starsToRating(stars: number): number {
    // 1 star -> 0, 5 stars -> 100.
    return Math.max(0, Math.min(100, ((stars - 1) / 4) * 100));
}

export function computeSkillEvidence(input: SkillEvidenceInput): SkillEvidenceResult {
    const { skillName, selfRating, completedJobs, verifiedCertificates } = input;

    const trail: SkillEvidenceEntry[] = [
        { source: 'self-declared', label: `Self-rated ${selfRating}/100` },
    ];

    if (completedJobs.length === 0 && verifiedCertificates.length === 0) {
        return { skillName, selfRating, effectiveRating: selfRating, trail, hasEvidence: false };
    }

    let weightedSum = selfRating * SELF_RATING_WEIGHT;
    let totalWeight = SELF_RATING_WEIGHT;

    if (completedJobs.length > 0) {
        const avgJobRating =
            completedJobs.reduce((sum, j) => sum + starsToRating(j.peerRatingOutOf5), 0) / completedJobs.length;
        const jobWeight = Math.min(completedJobs.length * JOB_EVIDENCE_WEIGHT, MAX_JOB_EVIDENCE_WEIGHT);
        weightedSum += avgJobRating * jobWeight;
        totalWeight += jobWeight;

        completedJobs
            .slice()
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .forEach((j) => {
                trail.push({
                    source: 'completed-job',
                    label: `Rated ${j.peerRatingOutOf5}/5 on "${j.jobTitle}"`,
                    date: j.date,
                });
            });
    }

    if (verifiedCertificates.length > 0) {
        const certWeight = Math.min(verifiedCertificates.length * CERTIFICATE_WEIGHT, MAX_CERTIFICATE_WEIGHT);
        weightedSum += CERTIFICATE_IMPLIED_RATING * certWeight;
        totalWeight += certWeight;

        verifiedCertificates.forEach((name) => {
            trail.push({ source: 'verified-certificate', label: `Verified certificate: ${name}` });
        });
    }

    const effectiveRating = Math.max(0, Math.min(100, Math.round(weightedSum / totalWeight)));

    return { skillName, selfRating, effectiveRating, trail, hasEvidence: true };
}

function normalize(value: string): string {
    return value.trim().toLowerCase();
}

// A completed job "counts" as evidence for a skill if the hiring company
// left a review for it and the job actually listed that skill as a
// requirement - so evidence is always tied to real, relevant work rather
// than just any finished contract.
export function findCompletedJobEvidenceForSkill(
    skillName: string,
    jobs: Job[],
    reviews: Review[],
    engineerId: string
): CompletedJobEvidence[] {
    const normalizedSkill = normalize(skillName);

    return reviews
        .filter((review) => review.engineerId === engineerId)
        .map((review) => {
            const job = jobs.find((j) => j.id === review.jobId);
            return { review, job };
        })
        .filter(
            ({ job }) =>
                job !== undefined &&
                (job.skillRequirements || []).some((req) => normalize(req.name) === normalizedSkill)
        )
        .map(({ review, job }) => ({
            jobTitle: job!.title,
            peerRatingOutOf5: review.peerRating,
            date: new Date(review.date),
        }));
}

// A certificate counts as evidence for a skill if it's verified and its
// name is a reasonably close match to the skill (e.g. a "Cisco CCNA"
// certificate backing a "Networking" or "Cisco" skill). There's no formal
// certificate-to-skill mapping table in the app yet, so this uses a simple,
// conservative substring match in either direction rather than guessing.
export function findVerifiedCertificateEvidenceForSkill(
    skillName: string,
    certifications: Certification[]
): string[] {
    const normalizedSkill = normalize(skillName);

    return certifications
        .filter((cert) => cert.verified)
        .filter((cert) => {
            const normalizedCert = normalize(cert.name);
            return normalizedCert.includes(normalizedSkill) || normalizedSkill.includes(normalizedCert);
        })
        .map((cert) => cert.name);
}
