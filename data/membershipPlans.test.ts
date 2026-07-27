import { describe, expect, it } from 'vitest';
import { ProfileTier } from '../types';
import {
    formatMonthlyMembershipPrice,
    MEMBERSHIP_PLAN_BY_TIER,
    MEMBERSHIP_PLANS,
    membershipPlanForSpecialistRoles,
} from './membershipPlans';

describe('membership plans', () => {
    it('defines one unique plan for every profile tier', () => {
        expect(MEMBERSHIP_PLANS.map(plan => plan.tier)).toEqual(Object.values(ProfileTier));
        expect(new Set(MEMBERSHIP_PLANS.map(plan => plan.tier)).size).toBe(MEMBERSHIP_PLANS.length);
    });

    it('uses the published monthly prices and role limits', () => {
        expect(formatMonthlyMembershipPrice(MEMBERSHIP_PLAN_BY_TIER[ProfileTier.BASIC])).toBe('£0/month');
        expect(MEMBERSHIP_PLAN_BY_TIER[ProfileTier.PROFESSIONAL]).toMatchObject({ monthlyPrice: 7, specialistRoleLimit: 1 });
        expect(MEMBERSHIP_PLAN_BY_TIER[ProfileTier.SKILLS]).toMatchObject({ monthlyPrice: 15, specialistRoleLimit: 3 });
        expect(MEMBERSHIP_PLAN_BY_TIER[ProfileTier.BUSINESS]).toMatchObject({ monthlyPrice: 35, specialistRoleLimit: 5 });
    });

    it('selects the smallest plan that accommodates specialist profiles', () => {
        expect(membershipPlanForSpecialistRoles(0).tier).toBe(ProfileTier.BASIC);
        expect(membershipPlanForSpecialistRoles(1).tier).toBe(ProfileTier.PROFESSIONAL);
        expect(membershipPlanForSpecialistRoles(3).tier).toBe(ProfileTier.SKILLS);
        expect(membershipPlanForSpecialistRoles(4).tier).toBe(ProfileTier.BUSINESS);
    });
});
