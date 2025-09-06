import { EngineerProfile, CompanyProfile, ProfileTier, Discipline, Currency, Language, Country } from '../../types/index.ts';
import { MALE_FIRST_NAMES, FEMALE_FIRST_NAMES, LAST_NAMES, LOCATIONS, COMPANY_NAMES, COMPANY_SUFFIXES } from './mockConstants.ts';
import { JOB_ROLE_DEFINITIONS } from '../jobRoles.ts';
import { AVATARS } from '../assets.ts';

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateEmail = (name: string) => `${name.toLowerCase().replace(' ', '.')}@example.com`;

const generateMockEngineers = (count: number): EngineerProfile[] => {
    return Array.from({ length: count }, (_, i) => {
        const isMale = Math.random() > 0.5;
        const firstName = isMale ? getRandom(MALE_FIRST_NAMES) : getRandom(FEMALE_FIRST_NAMES);
        const name = `${firstName} ${getRandom(LAST_NAMES)}`;
        const discipline = getRandom([Discipline.AV, Discipline.IT, Discipline.BOTH]);
        const experience = getRandomInt(3, 25);
        const profileTier = getRandom([ProfileTier.BASIC, ProfileTier.PROFESSIONAL, ProfileTier.SKILLS, ProfileTier.BUSINESS]);
        const jobRoleDef = getRandom(JOB_ROLE_DEFINITIONS.filter(r => r.category.includes(discipline) || discipline === Discipline.BOTH));
        
        return {
            id: `gen-eng-${i}`,
            name,
            avatar: `https://xsgames.co/randomusers/assets/avatars/${isMale ? 'male' : 'female'}/${i % 78}.jpg`,
            description: `A skilled ${discipline} with ${experience} years of experience specializing in ${jobRoleDef.name}.`,
            discipline,
            location: `${getRandom(LOCATIONS)}, UK`,
            country: Country.UK,
            experience,
            profileTier,
            minDayRate: getRandomInt(12, 25) * 25,
            maxDayRate: getRandomInt(26, 40) * 25,
            currency: Currency.GBP,
            availability: new Date(new Date().getTime() + getRandomInt(-30, 60) * 24 * 3600 * 1000),
            skills: jobRoleDef.skillCategories[0].skills.slice(0, 5).map(s => ({ name: s.name, rating: getRandomInt(60, 95) })),
            selectedJobRoles: [{
                roleName: jobRoleDef.name,
                skills: jobRoleDef.skillCategories.flatMap(c => c.skills).slice(0, 10).map(s => ({ name: s.name, rating: getRandomInt(60, 95) })),
                overallScore: getRandomInt(70, 95)
            }],
            certifications: [{ name: 'CTS', verified: Math.random() > 0.5 }],
            compliance: { professionalIndemnity: { hasCoverage: true, isVerified: false, amount: 1000000 }, publicLiability: { hasCoverage: true, isVerified: true, amount: 5000000 }, siteSafe: true, cscsCard: true, ownPPE: true, hasOwnTransport: true, hasOwnTools: true, powerToolCompetency: 75, accessEquipmentTrained: 80, firstAidTrained: false, carriesSpares: false },
            identity: { documentType: 'passport', isVerified: true },
            joinDate: new Date(2023, getRandomInt(0, 11), getRandomInt(1, 28)),
            profileViews: getRandomInt(50, 1000),
            searchAppearances: getRandomInt(200, 5000),
            jobInvites: getRandomInt(5, 50),
            reputation: getRandomInt(75, 99),
            complianceScore: getRandomInt(60, 98),
            status: 'active',
            language: Language.ENGLISH,
            badges: [],
            warnings: 0,
            isBanned: false,
            banHistory: [],
            contact: {
                email: generateEmail(name),
                phone: `07${getRandomInt(100, 999)} ${getRandomInt(100, 999)}`,
            }
        };
    });
};

const generateMockCompanies = (count: number): CompanyProfile[] => {
    return Array.from({ length: count }, (_, i) => {
        const name = `${getRandom(COMPANY_NAMES)} ${getRandom(COMPANY_SUFFIXES)}`;
        const domain = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
        return {
            id: `gen-comp-${i}`,
            name,
            website: `https://${domain}`,
            location: `${getRandom(LOCATIONS)}, UK`,
            country: Country.UK,
// FIX: Added the missing 'currency' property to satisfy the CompanyProfile type.
            currency: Currency.GBP,
            contact: { email: `contact@${domain}`, phone: `020 ${getRandomInt(1000, 9999)} ${getRandomInt(1000, 9999)}` },
            avatar: `https://logo.clearbit.com/${domain}`,
            logo: `https://logo.clearbit.com/${domain}`,
            status: 'active',
            language: Language.ENGLISH,
            consentToFeature: Math.random() > 0.5,
            warnings: 0,
            isBanned: false,
            banHistory: [],
        };
    });
};

// Add specific profiles for demo consistency
const MOCK_ENGINEER_NEIL: EngineerProfile = {
    id: 'eng-1', name: 'Neil Bishop', avatar: AVATARS.neil,
    description: "Highly experienced Senior AV Engineer with a focus on large-scale corporate and live event projects. Expert in Crestron, Biamp, and complex system commissioning.",
    discipline: Discipline.AV, location: 'London, UK', country: Country.UK, experience: 18, profileTier: ProfileTier.BUSINESS,
    minDayRate: 500, maxDayRate: 650, currency: Currency.GBP, availability: new Date('2024-08-01'),
    skills: [{ name: 'Crestron', rating: 95 }, { name: 'Biamp Tesira', rating: 92 }, { name: 'Dante Level 3', rating: 90 }],
    selectedJobRoles: [{
        roleName: 'AV Commissioning Engineer',
        skills: [{ name: 'System testing', rating: 98 }, { name: 'DSP configuration', rating: 95 }],
        overallScore: 96
    }],
    certifications: [{ name: 'CTS-I', verified: true }, { name: 'Crestron Certified Programmer', verified: true }],
    compliance: { professionalIndemnity: { hasCoverage: true, isVerified: true, amount: 2000000 }, publicLiability: { hasCoverage: true, isVerified: true, amount: 5000000 }, siteSafe: true, cscsCard: true, ownPPE: true, hasOwnTransport: true, hasOwnTools: true, powerToolCompetency: 85, accessEquipmentTrained: 90, firstAidTrained: true, carriesSpares: true },
    identity: { documentType: 'passport', isVerified: true }, joinDate: new Date('2023-03-20'),
    profileViews: 890, searchAppearances: 3200, jobInvites: 45, reputation: 98, complianceScore: 95, status: 'active', language: Language.ENGLISH,
    badges: [],
    warnings: 0, isBanned: false, banHistory: [], contact: { email: 'neil.bishop@example.com', phone: '07123 456789' }
};

const MOCK_ENGINEER_SAMANTHA: EngineerProfile = {
    id: 'eng-2', name: 'Samantha Greene', avatar: AVATARS.samantha,
    description: "Versatile IT and AV engineer with a background in live events and corporate IT support. Proficient in network setup, troubleshooting, and video conferencing systems.",
    discipline: Discipline.BOTH, location: 'Manchester, UK', country: Country.UK, experience: 8, profileTier: ProfileTier.SKILLS,
    minDayRate: 350, maxDayRate: 450, currency: Currency.GBP, availability: new Date('2024-07-25'),
    skills: [{ name: 'Networking', rating: 90 }, { name: 'MS Teams Rooms', rating: 88 }, { name: 'Video Production', rating: 82 }],
    selectedJobRoles: [{
        roleName: 'Live Events Technician',
        skills: [{ name: 'Video switching', rating: 90 }, { name: 'Audio mixing', rating: 85 }],
        overallScore: 88
    }],
    certifications: [{ name: 'Network+', verified: true }, { name: 'Dante Level 2', verified: true }],
    compliance: { professionalIndemnity: { hasCoverage: true, isVerified: true, amount: 1000000 }, publicLiability: { hasCoverage: true, isVerified: true, amount: 2000000 }, siteSafe: true, cscsCard: false, ownPPE: true, hasOwnTransport: true, hasOwnTools: true, powerToolCompetency: 70, accessEquipmentTrained: 60, firstAidTrained: true, carriesSpares: false },
    identity: { documentType: 'drivers_license', isVerified: true }, joinDate: new Date('2023-08-11'),
    profileViews: 450, searchAppearances: 1800, jobInvites: 22, reputation: 92, complianceScore: 80, status: 'active', language: Language.ENGLISH,
    badges: [],
    warnings: 0, isBanned: false, banHistory: [], contact: { email: 'samantha.greene@example.com', phone: '07234 567890' }
};

const MOCK_ENGINEER_DAVID: EngineerProfile = {
    id: 'eng-3', name: 'David Chen', avatar: AVATARS.david,
    description: "Cloud and Network Architect with expertise in AWS and Cisco environments. Specializes in designing and implementing secure, scalable network infrastructure for enterprise clients.",
    discipline: Discipline.IT, location: 'Edinburgh, UK', country: Country.UK, experience: 12, profileTier: ProfileTier.BUSINESS,
    minDayRate: 600, maxDayRate: 750, currency: Currency.GBP, availability: new Date('2024-09-15'),
    skills: [{ name: 'AWS', rating: 96 }, { name: 'Cisco Routing & Switching', rating: 94 }, { name: 'Cybersecurity', rating: 90 }],
    selectedJobRoles: [{
        roleName: 'Network Architect',
        skills: [{ name: 'Network Design (HLD/LLD)', rating: 97 }, { name: 'Firewall Configuration', rating: 92 }],
        overallScore: 95
    }],
    certifications: [{ name: 'AWS Solutions Architect - Professional', verified: true }, { name: 'CCNP Enterprise', verified: true }],
    compliance: { professionalIndemnity: { hasCoverage: true, isVerified: true, amount: 2000000 }, publicLiability: { hasCoverage: true, isVerified: true, amount: 5000000 }, siteSafe: false, cscsCard: false, ownPPE: true, hasOwnTransport: false, hasOwnTools: true, powerToolCompetency: 20, accessEquipmentTrained: 0, firstAidTrained: false, carriesSpares: false },
    identity: { documentType: 'passport', isVerified: true }, joinDate: new Date('2023-05-01'),
    profileViews: 620, searchAppearances: 2500, jobInvites: 30, reputation: 97, complianceScore: 70, status: 'active', language: Language.ENGLISH,
    badges: [],
    warnings: 0, isBanned: false, banHistory: [], contact: { email: 'david.chen@example.com', phone: '07345 678901' }
};

const MOCK_COMPANY_1: CompanyProfile = {
    id: 'comp-1', name: 'Pro AV Solutions', website: 'https://proav.com', location: 'London, UK', country: Country.UK,
// FIX: Added the missing 'currency' property to satisfy the CompanyProfile type.
    currency: Currency.GBP,
    contact: { email: 'contact@proav.com', phone: '020 7946 0991' }, avatar: 'https://i.pravatar.cc/150?u=proav', logo: 'https://logo.clearbit.com/proav.com', status: 'active', language: Language.ENGLISH, consentToFeature: true,
    warnings: 0, isBanned: false, banHistory: [],
};

const MOCK_COMPANY_2: CompanyProfile = {
    id: 'comp-2', name: 'Starlight Events', website: 'https://starlight.com', location: 'Manchester, UK', country: Country.UK,
// FIX: Added the missing 'currency' property to satisfy the CompanyProfile type.
    currency: Currency.GBP,
    contact: { email: 'contact@starlight.com', phone: '0161 496 0123' }, avatar: 'https://i.pravatar.cc/150?u=starlight', logo: 'https://logo.clearbit.com/starlight.com', status: 'active', language: Language.ENGLISH, consentToFeature: true,
    warnings: 0, isBanned: false, banHistory: [],
};

const MOCK_COMPANY_3: CompanyProfile = {
    id: 'comp-3', name: 'Nexus IT', website: 'https://nexusit.com', location: 'Birmingham, UK', country: Country.UK,
// FIX: Added the missing 'currency' property to satisfy the CompanyProfile type.
    currency: Currency.GBP,
    contact: { email: 'contact@nexusit.com', phone: '0121 496 0456' }, avatar: 'https://i.pravatar.cc/150?u=nexusit', logo: 'https://logo.clearbit.com/nexusit.com', status: 'active', language: Language.ENGLISH, consentToFeature: false,
    warnings: 0, isBanned: false, banHistory: [],
};

export const MOCK_ENGINEERS: EngineerProfile[] = [MOCK_ENGINEER_NEIL, MOCK_ENGINEER_SAMANTHA, MOCK_ENGINEER_DAVID, ...generateMockEngineers(20)];
export const MOCK_COMPANIES: CompanyProfile[] = [MOCK_COMPANY_1, MOCK_COMPANY_2, MOCK_COMPANY_3, ...generateMockCompanies(10)];