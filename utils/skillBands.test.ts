import { describe, it, expect } from 'vitest';
import { getSkillBand, getSkillBandLabel, meetsRequiredLevel, DEFAULT_SKILL_RATING } from './skillBands';

describe('skillBands', () => {
    it('has a default rating of 25 ("Average")', () => {
        expect(DEFAULT_SKILL_RATING).toBe(25);
        expect(getSkillBandLabel(DEFAULT_SKILL_RATING)).toBe('Average');
    });

    it('maps the boundary values to the expected bands', () => {
        expect(getSkillBandLabel(0)).toBe('Beginner');
        expect(getSkillBandLabel(14)).toBe('Beginner');
        expect(getSkillBandLabel(15)).toBe('Average');
        expect(getSkillBandLabel(34)).toBe('Average');
        expect(getSkillBandLabel(35)).toBe('Good');
        expect(getSkillBandLabel(59)).toBe('Good');
        expect(getSkillBandLabel(60)).toBe('Excellent');
        expect(getSkillBandLabel(79)).toBe('Excellent');
        expect(getSkillBandLabel(80)).toBe('Expert');
        expect(getSkillBandLabel(100)).toBe('Expert');
    });

    it('clamps out-of-range ratings instead of throwing', () => {
        expect(getSkillBandLabel(-10)).toBe('Beginner');
        expect(getSkillBandLabel(150)).toBe('Expert');
    });

    it('meetsRequiredLevel is true only when the rating is at or above the requirement', () => {
        expect(meetsRequiredLevel(60, 60)).toBe(true);
        expect(meetsRequiredLevel(61, 60)).toBe(true);
        expect(meetsRequiredLevel(59, 60)).toBe(false);
    });
});
