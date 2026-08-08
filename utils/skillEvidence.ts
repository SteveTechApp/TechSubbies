// The "skills matrix evidence loop": a self-rated skill (0-100, see
// utils/skillBands.ts) is a useful starting point, but it shouldn't be the
// only thing driving matching and trust forever. Once an engineer has
// completed jobs that needed a skill (reviewed by the hiring company) or has
// a verified certificate relevant to it, that real-world evidence should
// pull the "effective" rating toward what's actually been proven - while
// the self-rating stays visible and still counts, especially for engineers
// who haven't completed a job or earned a certificate yet.

import { Certification, Job, Review } from '../types';

export type SkillEvidenceSource = 'self-declared' | 'completed-job' | 'verified-certificate';
export type DeliveryContext = 'assisted' | 'independent' | 'lead';
export type ProjectScale = 'small' | 'medium' | 'large' | 'programme';

export interface SkillEvidenceEntry {
    source: SkillEvidenceSource;
    label: string;
    date?: Date;
    deliveryContext?: DeliveryContext;
    projectScale?: ProjectScale;
}

export interface CompletedJobEvidence {
    jobTitle: string;
    peerRatingOutOf5: number;
    date: Date;
    deliveryContext?: DeliveryContext;
    projectScale?: ProjectScale;
}

export interface SkillEvidenceInput {
    skillName: string;
    selfRating: number;
    completedJobs: CompletedJobEvidence[];
    verifiedCertificates: string[];
}

export interface SkillEvidenceResult {
    skillName: string;
    selfRating: number;
    effectiveRating: number;
    trail: SkillEvidenceEntry[];
    hasEvidence: boolean;
    // Most recent completed-job evidence for this skill. Certificates are
    // deliberately not used as a proxy for "last used" because verification
    // date and practical-use date are different facts.
    lastUsedDate?: Date;
    deliveryContexts: DeliveryContext[];
    projectScales: ProjectScale[];
}

const SELF_RATING_WEIGHT = 40;
const JOB_EVIDENCE_WEIGHT = 15;
const MAX_JOB_EVIDENCE_WEIGHT = 45;
const CERTIFICATE_WEIGHT = 8;
const MAX_CERTIFICATE_WEIGHT = 20;
const CERTIFICATE_IMPLIED_RATING = 90;

function starsToRating(stars: number): number {
    return Math.max(0, Math.min(100, ((stars - 1) / 4) * 100));
}

function deliveryLabel(value: DeliveryContext): string {
    return value === 'lead' ? 'lead delivery' : value === 'assisted' ? 'assisted delivery' : 'independent delivery';
}

function scaleLabel(value: ProjectScale): string {
    return value === 'programme' ? 'programme / multi-site' : `${value} project`;
}

export function computeSkillEvidence(input: SkillEvidenceInput): SkillEvidenceResult {
    const { skillName, selfRating, completedJobs, verifiedCertificates } = input;

    const trail: SkillEvidenceEntry[] = [
        { source: 'self-declared', label: `Self-rated ${selfRating}/100` },
    ];

    const datedJobs = completedJobs.slice().sort((a, b) => b.date.getTime() - a.date.getTime());
    const lastUsedDate = datedJobs[0]?.date;
    const deliveryContexts = Array.from(new Set(datedJobs.flatMap(job => job.deliveryContext ? [job.deliveryContext] : [])));
    const projectScales = Array.from(new Set(datedJobs.flatMap(job => job.projectScale ? [job.projectScale] : [])));

    if (completedJobs.length === 0 && verifiedCertificates.length === 0) {
        return {
            skillName,
            selfRating,
            effectiveRating: selfRating,
            trail,
            hasEvidence: false,
            deliveryContexts,
            projectScales,
        };
    }

    let weightedSum = selfRating * SELF_RATING_WEIGHT;
    let totalWeight = SELF_RATING_WEIGHT;

    if (completedJobs.length > 0) {
        const avgJobRating =
            completedJobs.reduce((sum, j) => sum + starsToRating(j.peerRatingOutOf5), 0) / completedJobs.length;
        const jobWeight = Math.min(completedJobs.length * JOB_EVIDENCE_WEIGHT, MAX_JOB_EVIDENCE_WEIGHT);
        weightedSum += avgJobRating * jobWeight;
        totalWeight += jobWeight;

        datedJobs.forEach((j) => {
            const context = [
                j.deliveryContext ? deliveryLabel(j.deliveryContext) : '',
                j.projectScale ? scaleLabel(j.projectScale) : '',
            ].filter(Boolean).join(' · ');
            trail.push({
                source: 'completed-job',
                label: `Rated ${j.peerRatingOutOf5}/5 on "${j.jobTitle}"${context ? ` · ${context}` : ''}`,
                date: j.date,
                deliveryContext: j.deliveryContext,
                projectScale: j.projectScale,
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

    return {
        skillName,
        selfRating,
        effectiveRating,
        trail,
        hasEvidence: true,
        lastUsedDate,
        deliveryContexts,
        projectScales,
    };
}

function normalize(value: string): string {
    return value.trim().toLowerCase();
}

function normalizeDeliveryContext(value: unknown): DeliveryContext | undefined {
    if (value === 'assisted' || value === 'independent' || value === 'lead') return value;
    return undefined;
}

function normalizeProjectScale(value: unknown): ProjectScale | undefined {
    if (value === 'small' || value === 'medium' || value === 'large' || value === 'programme') return value;
    return undefined;
}

function legacyDeliveryContext(job: Job): DeliveryContext | undefined {
    const arrangement = String(job.supervisionArrangement || '').toLowerCase();
    if (['supervised', 'lead_engineer_present', 'qualified_engineer_present'].includes(arrangement)) return 'assisted';
    return undefined;
}

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
        .map(({ review, job }) => {
            const contextualJob = job as Job & { deliveryContext?: unknown; projectScale?: unknown };
            return {
                jobTitle: job!.title,
                peerRatingOutOf5: review.peerRating,
                date: new Date(review.date),
                deliveryContext: normalizeDeliveryContext(contextualJob.deliveryContext) || legacyDeliveryContext(job!),
                projectScale: normalizeProjectScale(contextualJob.projectScale),
            };
        });
}

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
