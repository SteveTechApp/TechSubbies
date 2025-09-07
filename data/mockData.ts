import { User, Role } from '../types';
// FIX: Corrected module imports after refactoring mockProfiles.ts to solve module resolution error.
import { MOCK_ENGINEERS, MOCK_COMPANIES } from './modules/mockGeneratedProfiles';
import { MOCK_RESOURCING_COMPANY_1, MOCK_ADMIN_PROFILE, MOCK_FREE_ENGINEER, MOCK_ENGINEER_STEVE } from './modules/mockStaticProfiles';
import { MOCK_JOBS } from './modules/mockJobs';
import { MOCK_APPLICATIONS, MOCK_REVIEWS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_CONTRACTS, MOCK_TRANSACTIONS, MOCK_PROJECTS } from './modules/mockInteractions';
import { MOCK_FORUM_POSTS, MOCK_FORUM_COMMENTS, MOCK_NOTIFICATIONS } from './modules/mockForum';


// --- SIMULATED PRE-AUTHENTICATION ---
// In a real application, this would come from an authentication service (e.g., Firebase Auth, Auth0)
// *before* the user reaches the role selection screen. For this demo, we mock the signed-in user.
export const PRE_AUTH_USER = {
    email: 'SteveGoodwin1972@gmail.com',
    name: 'Steve Goodwin',
};


// Re-export all the mock data for use throughout the application.
// This keeps the import paths consistent in other files despite the refactoring.
export { 
    MOCK_ENGINEERS, MOCK_COMPANIES, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_REVIEWS, 
    MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_FORUM_POSTS, MOCK_FORUM_COMMENTS, MOCK_NOTIFICATIONS,
    MOCK_CONTRACTS,
    MOCK_TRANSACTIONS,
    MOCK_PROJECTS
};


// --- Define specific user roles for login simulation ---

const MOCK_COMPANY_1 = MOCK_COMPANIES.find(c => c.id === 'comp-1')!;

export const MOCK_USER_FREE_ENGINEER: User = { id: 'user-free', role: Role.ENGINEER, profile: MOCK_FREE_ENGINEER };

export const MOCK_USERS: { [key in Role]: User } = {
    [Role.ENGINEER]: { id: 'user-1', role: Role.ENGINEER, profile: MOCK_ENGINEERS.find(e => e.id === 'eng-1')! },
    [Role.COMPANY]: { id: 'user-2', role: Role.COMPANY, profile: MOCK_COMPANY_1 },
    [Role.RESOURCING_COMPANY]: { id: 'user-3', role: Role.RESOURCING_COMPANY, profile: MOCK_RESOURCING_COMPANY_1 },
    [Role.ADMIN]: { id: 'user-4', role: Role.ADMIN, profile: MOCK_ADMIN_PROFILE },
};


// --- Create a comprehensive list of all users for searching/linking ---

export const ALL_MOCK_USERS: User[] = [
    ...MOCK_ENGINEERS.map((profile) => ({
        id: `user-eng-${profile.id}`,
        role: Role.ENGINEER,
        profile
    })),
    ...MOCK_COMPANIES.map(profile => ({
        id: `user-comp-${profile.id}`,
        role: profile.id.startsWith('res-') ? Role.RESOURCING_COMPANY : Role.COMPANY,
        profile
    })),
     { id: 'user-admin-1', role: Role.ADMIN, profile: MOCK_ADMIN_PROFILE }
];

// Add Steve's user object separately if he's not in the generated engineers
if (!ALL_MOCK_USERS.some(u => u.profile.id === 'eng-steve')) {
    ALL_MOCK_USERS.push({ id: 'user-eng-steve', role: Role.ENGINEER, profile: MOCK_ENGINEER_STEVE });
}