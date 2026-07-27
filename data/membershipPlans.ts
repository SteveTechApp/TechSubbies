import { ProfileTier } from '../types';

export type MembershipPlan = {
    tier: ProfileTier;
    name: string;
    monthlyPrice: number;
    specialistRoleLimit: number;
    description: string;
    features: string[];
    cta: string;
    featured?: boolean;
};

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
    {
        tier: ProfileTier.BASIC,
        name: 'Basic Profile',
        monthlyPrice: 0,
        specialistRoleLimit: 0,
        description: 'Join the network, apply for opportunities and build your reputation.',
        features: [
            'Appear in standard search results',
            'Apply directly to every suitable opportunity',
            'Set your own rates and availability',
            'Build contract history and reviews',
        ],
        cta: 'Sign Up Free',
    },
    {
        tier: ProfileTier.PROFESSIONAL,
        name: 'Professional Profile',
        monthlyPrice: 7,
        specialistRoleLimit: 1,
        description: 'Showcase one specialist role and unlock professional profile tools.',
        features: [
            'Everything in Bronze',
            'One detailed specialist role profile',
            'AI skill discovery',
            'Training recommendations',
        ],
        cta: 'Choose Silver',
    },
    {
        tier: ProfileTier.SKILLS,
        name: 'Skills Profile',
        monthlyPrice: 15,
        specialistRoleLimit: 3,
        description: 'Build a richer multi-skilled profile and improve customer discovery.',
        features: [
            'Everything in Silver',
            'Up to three specialist role profiles',
            'AI career tools',
            'Enhanced search presentation',
        ],
        cta: 'Choose Gold',
        featured: true,
    },
    {
        tier: ProfileTier.BUSINESS,
        name: 'Business Profile',
        monthlyPrice: 35,
        specialistRoleLimit: 5,
        description: 'For broad senior profiles and freelancers operating a technical business.',
        features: [
            'Everything in Gold',
            'Up to five specialist role profiles',
            'Business profile features',
            'Priority support',
        ],
        cta: 'Choose Platinum',
    },
];

export const MEMBERSHIP_PLAN_BY_TIER = Object.fromEntries(
    MEMBERSHIP_PLANS.map(plan => [plan.tier, plan])
) as Record<ProfileTier, MembershipPlan>;

export const formatMonthlyMembershipPrice = (plan: MembershipPlan) =>
    plan.monthlyPrice === 0 ? '£0/month' : `£${plan.monthlyPrice}/month`;

export const membershipPlanForSpecialistRoles = (count: number) =>
    MEMBERSHIP_PLANS.find(plan => count <= plan.specialistRoleLimit)
    ?? MEMBERSHIP_PLANS[MEMBERSHIP_PLANS.length - 1];
