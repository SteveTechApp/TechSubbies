import { describe, expect, it } from 'vitest';
import { applyJobSuggestion } from './AIJobHelper';
import type { JobPostDraft } from '../types';

const draft = {
    title: 'Engineer',
    description: 'Original scope',
    jobRole: 'AV Engineer',
    dayRate: '500',
} as JobPostDraft;

describe('AI job suggestions', () => {
    it('updates only the explicitly selected draft field', () => {
        expect(applyJobSuggestion(draft, { kind: 'description', value: 'Improved scope' })).toMatchObject({
            title: 'Engineer',
            description: 'Improved scope',
            dayRate: '500',
        });
    });

    it('persists the midpoint of a suggested day-rate range in the submitted field', () => {
        const updated = applyJobSuggestion(draft, { kind: 'day-rate', value: { min_rate: 425, max_rate: 575 } });
        expect(updated.dayRate).toBe('500');
        expect(updated).not.toHaveProperty('minDayRate');
        expect(updated).not.toHaveProperty('maxDayRate');
    });
});
