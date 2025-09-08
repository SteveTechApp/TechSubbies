
// FIX: Created file to house static mock profiles, resolving "not a module" error.
import {
    AdminProfile, ResourcingCompanyProfile, EngineerProfile, Role, Discipline,
    ProfileTier, Currency, Country,
} from '../../types';
import { BADGES } from '../badges';

export const MOCK_RESOURCING_COMPANY_1: ResourcingCompanyProfile = {
    id: 'res-1',
    name: 'AV Placements Ltd',
    avatar: 'https://i.imgur.com/3Y1Z4g2.png',
    logo: 'https://i.imgur.com/3Y1Z4g2.png',
    role: Role.RESOURCING_COMPANY,
    website: 'https://www.avplacements.com',
    location: 'Reading, UK',
    status: 'active',
    managedEngineerIds: ['eng-2', 'eng-3'],
    contact: {
        name: 'John Carter',
        email: 'john.carter@avplacements.com',
    }
};

export const MOCK_ADMIN_PROFILE: AdminProfile = {
    id: 'admin-1',
    name: 'Platform Admin',
    avatar: 'https://i.imgur.com/JQpB9z2.png',
    role: Role.ADMIN,
    status: 'active',
    permissions: ['all'],
};

export const MOCK_FREE_ENGINEER: EngineerProfile = {
    id: 'eng-free',
    name: 'John Smith',
    avatar: 'https://xsgames.co/randomusers/assets/avatars/male/46.jpg',
    status: 'active',
    role: Role.ENGINEER,
    discipline: Discipline.AV,
    location: 'Bristol, UK',
    country: Country.UK,
    description: 'Experienced AV technician looking for contract work in the South West. Reliable and hardworking.',
    experience: 5,
    profileTier: ProfileTier.BASIC,
    minDayRate: 150,
    maxDayRate: 195,
    currency: Currency.GBP,
    availability: new Date('2024-08-15'),
    skills: [],
    compliance: { professionalIndemnity: { hasCoverage: false, isVerified: false }, publicLiability: { hasCoverage: true, amount: 1000000, isVerified: false }, siteSafe: true, cscsCard: true, ownPPE: true, hasOwnTransport: true, hasOwnTools: true, powerToolCompetency: 70, accessEquipmentTrained: 60, firstAidTrained: false, carriesSpares: false },
    identity: { documentType: 'none', isVerified: false },
    profileViews: 12, searchAppearances: 150, jobInvites: 1, isBoosted: false, reputation: 65, complianceScore: 60,
    calendarSyncUrl: 'https://techsubbies.com/cal/eng-free.ics',
    badges: [],
    contact: { email: 'john.smith.demo@techsubbies.com', phone: '07123456789' }
};

export const MOCK_ENGINEER_STEVE: EngineerProfile = {
    id: 'eng-steve',
    name: 'Steve Goodwin',
    avatar: 'https://i.imgur.com/L45aA6d.jpg',
    status: 'active',
    role: Role.ENGINEER,
    discipline: Discipline.AV,
    location: 'Oxford, UK',
    country: Country.UK,
    description: 'Freelance AV Project Manager & Commissioning Engineer with 20+ years of experience delivering high-spec corporate and residential projects.',
    experience: 22,
    profileTier: ProfileTier.SKILLS,
    minDayRate: 500,
    maxDayRate: 650,
    currency: Currency.GBP,
    availability: new Date('2024-09-01'),
    skills: [{ name: 'Project Management', rating: 95 }, { name: 'Crestron', rating: 90 }, { name: 'Biamp', rating: 85 }],
    selectedJobRoles: [
        { roleName: 'AV Systems Engineer', skills: [{ name: 'Troubleshooting complex AV systems', rating: 95 }, { name: 'System commissioning and testing procedures', rating: 98 }], overallScore: 97 }
    ],
    certifications: [{ name: 'CTS-I', verified: true }, { name: 'Crestron Master Programmer', verified: true }],
    compliance: { professionalIndemnity: { hasCoverage: true, amount: 2000000, isVerified: true }, publicLiability: { hasCoverage: true, amount: 5000000, isVerified: true }, siteSafe: true, cscsCard: true, ownPPE: true, hasOwnTransport: true, hasOwnTools: true, powerToolCompetency: 80, accessEquipmentTrained: 75, firstAidTrained: true, carriesSpares: true },
    identity: { documentType: 'passport', isVerified: true },
    profileViews: 128, searchAppearances: 950, jobInvites: 15, isBoosted: false, reputation: 98, complianceScore: 95,
    calendarSyncUrl: 'https://techsubbies.com/cal/eng-steve.ics',
    badges: [BADGES['verified-id'], BADGES['contracts-10'], BADGES['top-contributor'], BADGES['cts-certified']],
    contact: { email: 'steve.goodwin.demo@techsubbies.com', phone: '07123456789' }
};
