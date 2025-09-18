import { EngineerProfile, CompanyProfile, Role, Discipline, ProfileTier, Currency, Country, ExperienceLevel } from '../../types';
import { MALE_FIRST_NAMES, FEMALE_FIRST_NAMES, LAST_NAMES, LOCATIONS, COMPANY_NAMES, COMPANY_SUFFIXES } from './mockConstants';
import { BADGES } from '../badges';

// --- MOCK DATA GENERATION ---
const generateEngineers = (count: number): EngineerProfile[] => {
    const engineers: EngineerProfile[] = [];
    const allFirstNames = [...MALE_FIRST_NAMES, ...FEMALE_FIRST_NAMES];

    for (let i = 0; i < count; i++) {
        const firstName = allFirstNames[i % allFirstNames.length];
        const lastName = LAST_NAMES[i % LAST_NAMES.length];
        const name = `${firstName} ${lastName}`;
        const experience = 2 + Math.floor(Math.random() * 18);
        const availability = new Date();
        availability.setDate(availability.getDate() + Math.floor(Math.random() * 60));

        engineers.push({
            id: `gen-eng-${i + 1}`,
            name,
            avatar: `https://xsgames.co/randomusers/assets/avatars/${MALE_FIRST_NAMES.includes(firstName) ? 'male' : 'female'}/${i % 78}.jpg`,
            status: 'active',
            role: Role.ENGINEER,
            discipline: i % 3 === 0 ? Discipline.IT : Discipline.AV,
            location: `${LOCATIONS[i % LOCATIONS.length]}, UK`,
            country: Country.UK,
            description: `A skilled ${i % 3 === 0 ? 'IT' : 'AV'} engineer with ${experience} years of experience.`,
            experience,
            experienceLevel: experience > 10 ? ExperienceLevel.EXPERT : experience > 5 ? ExperienceLevel.SENIOR : ExperienceLevel.MID_LEVEL,
            profileTier: i % 4 === 0 ? ProfileTier.BASIC : i % 4 === 1 ? ProfileTier.PROFESSIONAL : ProfileTier.SKILLS,
            minDayRate: 200 + (i * 10),
            maxDayRate: 300 + (i * 15),
            currency: Currency.GBP,
            availability,
            skills: [{ name: 'Troubleshooting', rating: 75 }, { name: 'Networking', rating: 80 }],
            compliance: {},
            identity: {},
            profileViews: 10 + Math.floor(Math.random() * 100),
            searchAppearances: 200 + Math.floor(Math.random() * 800),
            jobInvites: Math.floor(Math.random() * 10),
            reputation: 70 + Math.floor(Math.random() * 30),
            complianceScore: 60 + Math.floor(Math.random() * 40),
            calendarSyncUrl: `https://techsubbies.com/cal/gen-eng-${i+1}.ics`,
            badges: [],
            contact: { email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`},
            platformCredits: Math.floor(Math.random() * 5),
            // FIX: Added missing loyaltyPoints property to conform to the EngineerProfile interface.
            loyaltyPoints: 50 + Math.floor(Math.random() * 500),
        });
    }
    return engineers;
};

const generateCompanies = (count: number): CompanyProfile[] => {
    const companies: CompanyProfile[] = [];
    for (let i = 0; i < count; i++) {
        const name = `${COMPANY_NAMES[i % COMPANY_NAMES.length]} ${COMPANY_SUFFIXES[i % COMPANY_SUFFIXES.length]}`;
        companies.push({
            id: `gen-comp-${i + 1}`,
            name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            status: 'active',
            role: Role.COMPANY,
            website: `https://www.${name.toLowerCase().replace(/\s/g, '')}.com`,
            location: `${LOCATIONS[i % LOCATIONS.length]}, UK`,
            contact: {
                name: 'Hiring Manager',
                email: `hiring@${name.toLowerCase().replace(/\s/g, '')}.com`
            }
        });
    }
    return companies;
};


export const MOCK_ENGINEERS: EngineerProfile[] = generateEngineers(20);
export const MOCK_COMPANIES: CompanyProfile[] = generateCompanies(10);
