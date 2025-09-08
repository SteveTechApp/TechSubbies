
import { Badge } from '../types';
import { Award, CheckCircle, ShieldCheck, Star, Briefcase, TrendingUp } from '../components/Icons';

export const BADGES: { [key: string]: Badge } = {
    'verified-id': {
        id: 'verified-id',
        name: 'ID Verified',
        description: 'This user has verified their identity with a government-issued document.',
        icon: ShieldCheck,
        color: 'bg-green-100 text-green-800',
    },
    'top-contributor': {
        id: 'top-contributor',
        name: 'Top Rated',
        description: 'Maintains an average rating of 4.8 stars or higher across all completed contracts.',
        icon: Star,
        color: 'bg-yellow-100 text-yellow-800',
    },
    'contracts-10': {
        id: 'contracts-10',
        name: '10+ Contracts',
        description: 'Successfully completed 10 or more contracts on the platform.',
        icon: Briefcase,
        color: 'bg-blue-100 text-blue-800',
    },
    'rising-star': {
        id: 'rising-star',
        name: 'Rising Star',
        description: 'Received excellent reviews on their first three contracts.',
        icon: TrendingUp,
        color: 'bg-purple-100 text-purple-800',
    },
    'insurance-verified': {
        id: 'insurance-verified',
        name: 'Insurance Verified',
        description: 'Professional Indemnity and Public Liability insurance documents have been verified.',
        icon: CheckCircle,
        color: 'bg-teal-100 text-teal-800',
    },
     'cts-certified': {
        id: 'cts-certified',
        name: 'CTS Certified',
        description: 'Holds a valid Certified Technology Specialist (CTS) certification from AVIXA.',
        icon: Award,
        color: 'bg-orange-100 text-orange-800',
    }
};
