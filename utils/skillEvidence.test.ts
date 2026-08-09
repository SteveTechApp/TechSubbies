import { describe, it, expect } from 'vitest';
import {
    computeSkillEvidence,
    findCompletedJobEvidenceForSkill,
    findVerifiedCertificateEvidenceForSkill,
} from './skillEvidence';
import { Job, Review, Certification, Currency, ExperienceLevel, JobType, SkillImportance } from '../types';

const baseJob: Job = {
    id: 'job-1',
    companyId: 'company-1',
    title: 'AV Install - Kings Cross',
    description: 'desc',
    location: 'London',
    dayRate: '400',
    duration: '5 days',
    currency: Currency.GBP,
    startDate: null,
    postedDate: new Date('2026-01-01'),
    jobType: JobType.CONTRACT,
    experienceLevel: ExperienceLevel.SENIOR,
    jobRole: 'AV Engineer',
    skillRequirements: [{ name: 'Crestron Programming', importance: SkillImportance.ESSENTIAL, requiredLevel: 60 }],
    status: 'closed',
};

const baseReview: Review = {
    id: 'review-1',
    jobId: 'job-1',
    companyId: 'company-1',
    engineerId: 'eng-1',
    peerRating: 5,
    customerRating: 5,
    comment: 'Great work',
    date: new Date('2026-02-01'),
};

describe('computeSkillEvidence', () => {
    it('returns the self-rating unchanged when there is no evidence yet', () => {
        const result = computeSkillEvidence({
            skillName: 'Crestron Programming',
            selfRating: 55,
            completedJobs: [],
            verifiedCertificates: [],
        });
        expect(result.effectiveRating).toBe(55);
        expect(result.hasEvidence).toBe(false);
        expect(result.trail).toHaveLength(1);
        expect(result.trail[0].source).toBe('self-declared');
    });

    it('pulls the effective rating up when completed jobs were rated highly', () => {
        const result = computeSkillEvidence({
            skillName: 'Crestron Programming',
            selfRating: 40,
            completedJobs: [{ jobTitle: 'Job A', peerRatingOutOf5: 5, date: new Date('2026-01-15') }],
            verifiedCertificates: [],
        });
        expect(result.effectiveRating).toBeGreaterThan(40);
        expect(result.hasEvidence).toBe(true);
    });

    it('pulls the effective rating down when completed jobs were rated poorly', () => {
        const result = computeSkillEvidence({
            skillName: 'Crestron Programming',
            selfRating: 80,
            completedJobs: [{ jobTitle: 'Job A', peerRatingOutOf5: 1, date: new Date('2026-01-15') }],
            verifiedCertificates: [],
        });
        expect(result.effectiveRating).toBeLessThan(80);
    });

    it('boosts the effective rating when a verified certificate is present', () => {
        const withoutCert = computeSkillEvidence({
            skillName: 'Networking',
            selfRating: 50,
            completedJobs: [],
            verifiedCertificates: [],
        });
        const withCert = computeSkillEvidence({
            skillName: 'Networking',
            selfRating: 50,
            completedJobs: [],
            verifiedCertificates: ['Cisco CCNA'],
        });
        expect(withCert.effectiveRating).toBeGreaterThan(withoutCert.effectiveRating);
        expect(withCert.trail.some((e) => e.source === 'verified-certificate')).toBe(true);
    });

    it('caps the influence of a large number of completed jobs rather than letting it swamp the self-rating', () => {
        const threeJobs = computeSkillEvidence({
            skillName: 'Crestron Programming',
            selfRating: 20,
            completedJobs: [
                { jobTitle: 'A', peerRatingOutOf5: 5, date: new Date('2026-01-01') },
                { jobTitle: 'B', peerRatingOutOf5: 5, date: new Date('2026-01-02') },
                { jobTitle: 'C', peerRatingOutOf5: 5, date: new Date('2026-01-03') },
            ],
            verifiedCertificates: [],
        });
        const tenJobs = computeSkillEvidence({
            skillName: 'Crestron Programming',
            selfRating: 20,
            completedJobs: Array.from({ length: 10 }, (_, i) => ({
                jobTitle: `Job ${i}`,
                peerRatingOutOf5: 5,
                date: new Date('2026-01-01'),
            })),
            verifiedCertificates: [],
        });
        // Weight is capped at 3 jobs' worth (45), so 10 jobs shouldn't pull
        // the rating any further than 3 already did.
        expect(tenJobs.effectiveRating).toBe(threeJobs.effectiveRating);
    });

    it('orders the trail as self-declared first, then completed jobs, then certificates', () => {
        const result = computeSkillEvidence({
            skillName: 'Crestron Programming',
            selfRating: 50,
            completedJobs: [{ jobTitle: 'Job A', peerRatingOutOf5: 4, date: new Date('2026-01-15') }],
            verifiedCertificates: ['Crestron Certified Programmer'],
        });
        expect(result.trail.map((e) => e.source)).toEqual([
            'self-declared',
            'completed-job',
            'verified-certificate',
        ]);
        expect(result.trail[1].label).toContain('Rated 4/5 on "Job A"');
        expect(result.trail[2].label).toContain('Crestron Certified Programmer');
    });
});

describe('findCompletedJobEvidenceForSkill', () => {
    it('includes a completed job when the engineer was reviewed and the job required the skill', () => {
        const evidence = findCompletedJobEvidenceForSkill('Crestron Programming', [baseJob], [baseReview], 'eng-1');
        expect(evidence).toHaveLength(1);
        expect(evidence[0]).toMatchObject({ jobTitle: 'AV Install - Kings Cross', peerRatingOutOf5: 5 });
    });

    it('excludes reviews belonging to a different engineer', () => {
        const evidence = findCompletedJobEvidenceForSkill('Crestron Programming', [baseJob], [baseReview], 'someone-else');
        expect(evidence).toHaveLength(0);
    });

    it('excludes jobs that did not require the skill', () => {
        const evidence = findCompletedJobEvidenceForSkill('Fibre Termination', [baseJob], [baseReview], 'eng-1');
        expect(evidence).toHaveLength(0);
    });

    it('ignores reviews whose job cannot be found', () => {
        const orphanReview: Review = { ...baseReview, jobId: 'missing-job' };
        const evidence = findCompletedJobEvidenceForSkill('Crestron Programming', [baseJob], [orphanReview], 'eng-1');
        expect(evidence).toHaveLength(0);
    });
});

describe('findVerifiedCertificateEvidenceForSkill', () => {
    const certifications: Certification[] = [
        { name: 'Cisco CCNA', verified: true },
        { name: 'Crestron Certified Programmer', verified: true },
        { name: 'Unverified AV Cert', verified: false },
    ];

    it('matches a verified certificate whose name relates to the skill', () => {
        const evidence = findVerifiedCertificateEvidenceForSkill('Cisco', certifications);
        expect(evidence).toEqual(['Cisco CCNA']);
    });

    it('excludes certificates that are not verified', () => {
        const evidence = findVerifiedCertificateEvidenceForSkill('AV Cert', certifications);
        expect(evidence).toHaveLength(0);
    });

    it('excludes certificates that do not relate to the skill', () => {
        const evidence = findVerifiedCertificateEvidenceForSkill('Fibre Termination', certifications);
        expect(evidence).toHaveLength(0);
    });
});
