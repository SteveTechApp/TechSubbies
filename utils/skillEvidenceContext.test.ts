import { describe, expect, it } from 'vitest';
import { Currency, ExperienceLevel, Job, JobType, Review, SkillImportance } from '../types';
import { computeSkillEvidence, findCompletedJobEvidenceForSkill } from './skillEvidence';

const job: Job & { deliveryContext: 'lead'; projectScale: 'large' } = {
  id: 'job-context-1',
  companyId: 'company-1',
  title: 'Large control-system rollout',
  description: 'Context evidence test',
  location: 'London',
  dayRate: '600',
  duration: '10 days',
  currency: Currency.GBP,
  startDate: null,
  postedDate: new Date('2026-01-01'),
  jobType: JobType.CONTRACT,
  experienceLevel: ExperienceLevel.SENIOR,
  jobRole: 'Control System Programmer',
  canonicalRoleId: 'control-system-programmer',
  skillRequirements: [
    { name: 'Control programming', importance: SkillImportance.ESSENTIAL, requiredLevel: 70 },
  ],
  status: 'closed',
  deliveryContext: 'lead',
  projectScale: 'large',
};

const review: Review = {
  id: 'review-context-1',
  jobId: job.id,
  companyId: job.companyId,
  engineerId: 'engineer-1',
  peerRating: 5,
  customerRating: 5,
  comment: 'Led the delivery well',
  date: new Date('2026-02-20'),
};

describe('contextual skill evidence', () => {
  it('carries delivery context, project scale and last-used date from completed work', () => {
    const jobs = findCompletedJobEvidenceForSkill('Control programming', [job], [review], 'engineer-1');
    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toMatchObject({
      deliveryContext: 'lead',
      projectScale: 'large',
    });

    const result = computeSkillEvidence({
      skillName: 'Control programming',
      selfRating: 60,
      completedJobs: jobs,
      verifiedCertificates: [],
    });

    expect(result.lastUsedDate?.toISOString()).toBe('2026-02-20T00:00:00.000Z');
    expect(result.deliveryContexts).toEqual(['lead']);
    expect(result.projectScales).toEqual(['large']);
    expect(result.trail[1].label).toContain('lead delivery');
    expect(result.trail[1].label).toContain('large project');
  });

  it('does not change the numeric evidence score merely because context is lead or large', () => {
    const plain = computeSkillEvidence({
      skillName: 'Control programming',
      selfRating: 60,
      completedJobs: [{ jobTitle: 'A', peerRatingOutOf5: 4, date: new Date('2026-02-20') }],
      verifiedCertificates: [],
    });
    const contextual = computeSkillEvidence({
      skillName: 'Control programming',
      selfRating: 60,
      completedJobs: [{
        jobTitle: 'A',
        peerRatingOutOf5: 4,
        date: new Date('2026-02-20'),
        deliveryContext: 'lead',
        projectScale: 'programme',
      }],
      verifiedCertificates: [],
    });

    expect(contextual.effectiveRating).toBe(plain.effectiveRating);
  });

  it('recovers assisted context from legacy supervision data without inventing project scale', () => {
    const legacyJob: Job = {
      ...job,
      id: 'legacy-job',
      supervisionArrangement: 'lead_engineer_present',
    };
    delete (legacyJob as Job & { deliveryContext?: string }).deliveryContext;
    delete (legacyJob as Job & { projectScale?: string }).projectScale;
    const legacyReview = { ...review, jobId: legacyJob.id };

    const jobs = findCompletedJobEvidenceForSkill('Control programming', [legacyJob], [legacyReview], 'engineer-1');
    expect(jobs[0].deliveryContext).toBe('assisted');
    expect(jobs[0].projectScale).toBeUndefined();
  });
});
