import { describe, expect, it } from 'vitest';
import { ApplicationStatus } from '../types';
import { getApplicationPipelineCounts, matchesApplicationPipeline } from './applicationPipeline';

const applications = [
    { jobId: 'job-1', engineerId: 'eng-1', date: new Date(), status: ApplicationStatus.APPLIED, reviewed: false },
    { jobId: 'job-1', engineerId: 'eng-2', date: new Date(), status: ApplicationStatus.VIEWED, reviewed: true },
    { jobId: 'job-1', engineerId: 'eng-3', date: new Date(), status: ApplicationStatus.OFFERED, reviewed: true },
    { jobId: 'job-1', engineerId: 'eng-4', date: new Date(), status: ApplicationStatus.HIRED, reviewed: true },
    { jobId: 'job-1', engineerId: 'eng-5', date: new Date(), status: ApplicationStatus.COMPLETED, reviewed: true },
    { jobId: 'job-1', engineerId: 'eng-6', date: new Date(), status: ApplicationStatus.REJECTED, reviewed: true },
];

describe('application pipeline', () => {
    it('groups applied and viewed candidates as in review', () => {
        expect(matchesApplicationPipeline(ApplicationStatus.APPLIED, 'review')).toBe(true);
        expect(matchesApplicationPipeline(ApplicationStatus.VIEWED, 'review')).toBe(true);
        expect(matchesApplicationPipeline(ApplicationStatus.OFFERED, 'review')).toBe(false);
    });

    it('groups hired and completed engagements together', () => {
        expect(getApplicationPipelineCounts(applications)).toEqual({
            all: 6,
            review: 2,
            offered: 1,
            hired: 2,
            rejected: 1,
        });
    });
});
