import { EngineerProfile, Badge, ConditionContext } from '../types/index.ts';
import { Award, CheckCircle, Trophy } from '../components/Icons.tsx';

export const BADGES: Badge[] = [
    {
        id: 'founding-member',
        name: 'Founding Member',
        description: 'Joined TechSubbies.com in its first year (2023).',
        icon: Award,
        color: 'bg-purple-100 text-purple-800',
        condition: (profile: EngineerProfile) => new Date(profile.joinDate).getFullYear() <= 2023
    },
    {
        id: 'verified-specialist',
        name: 'Verified Specialist',
        description: 'Has at least one verified certification on their profile.',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800',
        condition: (profile: EngineerProfile) => profile.certifications.some(c => c.verified)
    },
    {
        id: 'contracts-1',
        name: '1+ Contract Completed',
        description: 'Successfully completed at least one contract through the platform.',
        icon: Trophy,
        color: 'bg-blue-100 text-blue-800',
        condition: (profile: EngineerProfile, context: ConditionContext) => context.completedContracts >= 1
    },
    {
        id: 'contracts-5',
        name: '5+ Contracts Completed',
        description: 'Successfully completed five or more contracts through the platform.',
        icon: Trophy,
        color: 'bg-blue-100 text-blue-800',
        condition: (profile: EngineerProfile, context: ConditionContext) => context.completedContracts >= 5
    },
    {
        id: 'contracts-10',
        name: '10+ Contracts Completed',
        description: 'A seasoned veteran who has completed ten or more contracts.',
        icon: Trophy,
        color: 'bg-blue-100 text-blue-800',
        condition: (profile: EngineerProfile, context: ConditionContext) => context.completedContracts >= 10
    },
    {
        id: 'top-contributor',
        name: 'Top Contributor',
        description: 'Highly active and valued member of the Tech Forum community.',
        icon: Award,
        color: 'bg-yellow-100 text-yellow-800',
        condition: (profile: EngineerProfile, context: ConditionContext) => context.forumScore >= 50
    },
];
