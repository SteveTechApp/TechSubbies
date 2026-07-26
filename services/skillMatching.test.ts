import { describe, it, expect } from 'vitest';
import { computeSkillRequirementScore, findEngineerSkillRating, getEffectiveSkillRating, getRequiredLevel, shortlistByRequirementScore } from './skillMatching';
import { Currency, EngineerProfile, ExperienceLevel, Job, JobType, Review, SkillImportance } from '../types';

function makeEngineer(skills: { name: string; rating: number }[]): EngineerProfile {
    return {
        id: 'eng-1',
        selectedJobRoles: [{ roleName: 'Test Role', skills, overallScore: 0 }],
    } as unknown as EngineerProfile;
}

function makeJob(skillRequirements: Job['skillRequirements']): Job {
    return { id: 'job-1', skillRequirements } as unknown as Job;
}

describe('getRequiredLevel', () => {
    it('uses requiredLevel when present', () => {
        expect(getRequiredLevel({ name: 'X', importance: SkillImportance.ESSENTIAL, requiredLevel: 72 })).toBe(72);
    });

    it('falls back to a band based on importance for older records without requiredLevel', () => {
        expect(getRequiredLevel({ name: 'X', importance: SkillImportance.ESSENTIAL })).toBe(60);
        expect(getRequiredLevel({ name: 'X', importance: SkillImportance.DESIRABLE })).toBe(35);
    });
});

describe('findEngineerSkillRating', () => {
    it('finds a rating by name, case-insensitively, across specialist roles', () => {
        const engineer = makeEngineer([{ name: 'Crestron Ecosystem', rating: 80 }]);
        expect(findEngineerSkillRating(engineer, 'crestron ecosystem')).toBe(80);
    });

    it('returns null when the engineer has never rated that skill', () => {
        const engineer = makeEngineer([{ name: 'Crestron Ecosystem', rating: 80 }]);
        expect(findEngineerSkillRating(engineer, 'DSP Configuration')).toBeNull();
    });
});

describe('computeSkillRequirementScore', () => {
    it('gives full credit when every required skill is met or exceeded', () => {
        const engineer = makeEngineer([
            { name: 'Skill A', rating: 70 },
            { name: 'Skill B', rating: 60 },
        ]);
        const job = makeJob([
            { name: 'Skill A', importance: SkillImportance.ESSENTIAL, requiredLevel: 60 },
            { name: 'Skill B', importance: SkillImportance.ESSENTIAL, requiredLevel: 60 },
        ]);

        expect(computeSkillRequirementScore(engineer, job)).toBe(100);
    });

    it('gives zero credit for a required skill the engineer has never rated', () => {
        const engineer = makeEngineer([{ name: 'Skill A', rating: 70 }]);
        const job = makeJob([{ name: 'Skill Nobody Has', importance: SkillImportance.ESSENTIAL, requiredLevel: 60 }]);

        expect(computeSkillRequirementScore(engineer, job)).toBe(0);
    });

    it('gives partial credit proportional to how close the rating is', () => {
        const engineer = makeEngineer([{ name: 'Skill A', rating: 30 }]);
        const job = makeJob([{ name: 'Skill A', importance: SkillImportance.ESSENTIAL, requiredLevel: 60 }]);

        // 30/60 * 100 = 50
        expect(computeSkillRequirementScore(engineer, job)).toBe(50);
    });

    it('treats a job with no requirements as a perfect match for everyone', () => {
        const engineer = makeEngineer([]);
        const job = makeJob([]);
        expect(computeSkillRequirementScore(engineer, job)).toBe(100);
    });
});

describe('getEffectiveSkillRating', () => {
    const completedJob: Job = {
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
        skillRequirements: [{ name: 'Skill A', importance: SkillImportance.ESSENTIAL, requiredLevel: 60 }],
        status: 'closed',
    };
    const goodReview: Review = {
        id: 'review-1',
        jobId: 'job-1',
        companyId: 'company-1',
        engineerId: 'eng-1',
        peerRating: 5,
        customerRating: 5,
        comment: 'Great work',
        date: new Date('2026-02-01'),
    };

    it('returns null when the engineer has never rated the skill, same as findEngineerSkillRating', () => {
        const engineer = makeEngineer([{ name: 'Skill A', rating: 70 }]);
        expect(getEffectiveSkillRating(engineer, 'Skill Nobody Has', { jobs: [completedJob], reviews: [goodReview] })).toBeNull();
    });

    it('returns the plain self-rating when there is no completed-job or certificate evidence', () => {
        const engineer = makeEngineer([{ name: 'Skill A', rating: 40 }]);
        expect(getEffectiveSkillRating(engineer, 'Skill A', { jobs: [], reviews: [] })).toBe(40);
    });

    it('pulls the rating up when a completed, highly-reviewed job backs the skill', () => {
        const engineer = makeEngineer([{ name: 'Skill A', rating: 40 }]);
        const effective = getEffectiveSkillRating(engineer, 'Skill A', { jobs: [completedJob], reviews: [goodReview] });
        expect(effective).toBeGreaterThan(40);
    });
});

describe('computeSkillRequirementScore with evidence context', () => {
    it('uses the evidence-adjusted rating instead of the plain self-rating when a context is supplied', () => {
        const engineer = makeEngineer([{ name: 'Skill A', rating: 40 }]);
        const job = makeJob([{ name: 'Skill A', importance: SkillImportance.ESSENTIAL, requiredLevel: 60 }]);
        const completedJob: Job = { ...job, id: 'job-1', title: 'Past Job', skillRequirements: job.skillRequirements };
        const review: Review = {
            id: 'review-1',
            jobId: 'job-1',
            companyId: 'company-1',
            engineerId: 'eng-1',
            peerRating: 5,
            customerRating: 5,
            comment: 'Great',
            date: new Date('2026-02-01'),
        };

        const plainScore = computeSkillRequirementScore(engineer, job);
        const evidenceScore = computeSkillRequirementScore(engineer, job, { jobs: [completedJob], reviews: [review] });

        expect(evidenceScore).toBeGreaterThan(plainScore);
    });
});

describe('shortlistByRequirementScore', () => {
    it('ranks engineers highest-scoring first and respects the limit', () => {
        const strong = makeEngineer([{ name: 'Skill A', rating: 90 }]);
        strong.id = 'strong';
        const weak = makeEngineer([{ name: 'Skill A', rating: 10 }]);
        weak.id = 'weak';
        const job = makeJob([{ name: 'Skill A', importance: SkillImportance.ESSENTIAL, requiredLevel: 60 }]);

        const shortlist = shortlistByRequirementScore([weak, strong], job, 1);

        expect(shortlist).toHaveLength(1);
        expect(shortlist[0].id).toBe('strong');
        expect(shortlist[0].requirementScore).toBe(100);
    });
});
