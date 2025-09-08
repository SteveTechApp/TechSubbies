
// FIX: Created file to house generated mock profiles, resolving "not a module" error.
import { EngineerProfile, CompanyProfile, Role, Discipline, ProfileTier, Currency, Country, ResourcingCompanyProfile } from '../../types';
import { MALE_FIRST_NAMES, FEMALE_FIRST_NAMES, LAST_NAMES, LOCATIONS, COMPANY_NAMES, COMPANY_SUFFIXES } from './mockConstants';
import { MOCK_RESOURCING_COMPANY_1, MOCK_ENGINEER_STEVE, MOCK_FREE_ENGINEER } from './mockStaticProfiles';
import { BADGES } from '../badges';

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateMockEngineers = (count: number): EngineerProfile[] => {
    const engineers: EngineerProfile[] = [];
    for (let i = 0; i < count; i++) {
        const isMale = Math.random() > 0.5;
        const firstName = isMale ? getRandom(MALE_FIRST_NAMES) : getRandom(FEMALE_FIRST_NAMES);
        const name = `${firstName} ${getRandom(LAST_NAMES)}`;
        const experience = getRandomInt(3, 25);
        const tier = Math.random() > 0.6 ? ProfileTier.SKILLS : (Math.random() > 0.4 ? ProfileTier.PROFESSIONAL : ProfileTier.BASIC);
        const minRate = getRandomInt(15, 40) * 10;
        const maxRate = minRate + getRandomInt(5, 15) * 10;

        engineers.push({
            id: `gen-eng-${i}`,
            name,
            avatar: `https://xsgames.co/randomusers/assets/avatars/${isMale ? 'male' : 'female'}/${i}.jpg`,
            status: 'active',
            role: Role.ENGINEER,
            discipline: getRandom([Discipline.AV, Discipline.IT, Discipline.BOTH]),
            location: `${getRandom(LOCATIONS)}, UK`,
            country: Country.UK,
            description: `A skilled and reliable ${name} with ${experience} years of experience in the industry.`,
            experience,
            profileTier: tier,
            minDayRate: minRate,
            maxDayRate: tier === ProfileTier.BASIC ? Math.min(maxRate, 195) : maxRate,
            currency: Currency.GBP,
            availability: new Date(new Date().getTime() + getRandomInt(-10, 60) * 24 * 60 * 60 * 1000),
            skills: [{ name: 'Troubleshooting', rating: getRandomInt(60, 95) }, { name: 'Teamwork', rating: getRandomInt(70, 100) }],
            compliance: { professionalIndemnity: { hasCoverage: Math.random() > 0.3, isVerified: false }, publicLiability: { hasCoverage: Math.random() > 0.2, isVerified: false }, siteSafe: Math.random() > 0.5, cscsCard: Math.random() > 0.4, ownPPE: true, hasOwnTransport: Math.random() > 0.3, hasOwnTools: Math.random() > 0.2, powerToolCompetency: getRandomInt(50, 100), accessEquipmentTrained: getRandomInt(40, 90), firstAidTrained: Math.random() > 0.7, carriesSpares: Math.random() > 0.6 },
            identity: { documentType: 'none', isVerified: false },
            profileViews: getRandomInt(20, 200),
            searchAppearances: getRandomInt(300, 2500),
            jobInvites: getRandomInt(0, 20),
            isBoosted: i === 0, // Boost the first engineer
            reputation: getRandomInt(70, 99),
            complianceScore: getRandomInt(50, 98),
            resourcingCompanyId: (i === 1 || i === 2) ? 'res-1' : undefined,
            calendarSyncUrl: `https://techsubbies.com/cal/gen-eng-${i}.ics`,
            badges: i === 0 ? [BADGES['rising-star']] : [],
            contact: { email: `${name.replace(' ', '.').toLowerCase()}@email.com`, phone: '07123456789' }
        });
    }
    return engineers;
};

const generateMockCompanies = (count: number): CompanyProfile[] => {
    return Array.from({ length: count }, (_, i) => {
        const name = `${getRandom(COMPANY_NAMES)} ${getRandom(COMPANY_SUFFIXES)}`;
        return {
            id: `gen-comp-${i}`,
            name,
            avatar: `https://robohash.org/${name}.png?set=set4`,
            logo: `https://robohash.org/${name}.png?set=set4`,
            status: 'active',
            role: Role.COMPANY,
            website: `https://${name.replace(/\s/g, '').toLowerCase()}.com`,
            location: `${getRandom(LOCATIONS)}, UK`,
            contact: { name: 'Hiring Manager', email: `contact@${name.replace(/\s/g, '').toLowerCase()}.com` }
        };
    });
};

export const MOCK_ENGINEERS: EngineerProfile[] = [
    MOCK_ENGINEER_STEVE,
    MOCK_FREE_ENGINEER,
    ...generateMockEngineers(20),
];

export const MOCK_COMPANIES: (CompanyProfile | ResourcingCompanyProfile)[] = [
    { id: 'comp-1', name: 'Pro AV Solutions', avatar: 'https://i.imgur.com/L45aA6d.jpg', logo: 'https://i.imgur.com/your-logo-url.png', status: 'active', role: Role.COMPANY, website: 'https://www.proav.com', location: 'London, UK', contact: { name: 'Steve G.', email: 'steve.g@proav.com' } },
    { id: 'comp-2', name: 'Starlight Events', avatar: 'https://i.imgur.com/your-avatar-url.png', logo: 'https://i.imgur.com/your-logo-url.png', status: 'active', role: Role.COMPANY, website: 'https://www.starlight.com', location: 'Manchester, UK', contact: { name: 'Sarah Jones', email: 'sarah@starlight.com' } },
    { id: 'comp-3', name: 'Nexus IT', avatar: 'https://i.imgur.com/your-avatar-url.png', logo: 'https://i.imgur.com/your-logo-url.png', status: 'active', role: Role.COMPANY, website: 'https://www.nexusit.com', location: 'Birmingham, UK', contact: { name: 'Emily C.', email: 'emily.c@nexusit.com' } },
    MOCK_RESOURCING_COMPANY_1,
    ...generateMockCompanies(10)
];
