import { EngineerProfile, CompanyProfile, Discipline, Currency, ProfileTier, Compliance, RatedSkill } from '../../types/index.ts';
import { JOB_ROLE_DEFINITIONS } from '../jobRoles.ts';
import { MALE_FIRST_NAMES, FEMALE_FIRST_NAMES, LAST_NAMES, LOCATIONS, COMPANY_NAMES, COMPANY_SUFFIXES } from './mockConstants.ts';
import { MOCK_ENGINEER_STEVE, MOCK_ENGINEER_1, MOCK_ENGINEER_2, MOCK_ENGINEER_3, MOCK_RESOURCING_COMPANY_1 } from './mockStaticProfiles.ts';
import { AVATARS } from '../assets.ts';

// --- Helpers ---
const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- Generator Functions ---
const generateMockEngineers = (count: number): EngineerProfile[] => {
    const engineers: EngineerProfile[] = [];
    for (let i = 0; i < count; i++) {
        const tierRoll = Math.random();
        let profileTier: ProfileTier;
        if (tierRoll < 0.6) profileTier = ProfileTier.BASIC;
        else if (tierRoll < 0.85) profileTier = ProfileTier.PROFESSIONAL;
        else if (tierRoll < 0.98) profileTier = ProfileTier.SKILLS;
        else profileTier = ProfileTier.BUSINESS;

        const jobRoleDef = getRandom(JOB_ROLE_DEFINITIONS);
        const allSkillsForRole = jobRoleDef.skillCategories.flatMap(category => category.skills.map(s => s.name));
        const isMale = Math.random() > 0.5;
        const firstName = isMale ? getRandom(MALE_FIRST_NAMES) : getRandom(FEMALE_FIRST_NAMES);
        const name = `${firstName} ${getRandom(LAST_NAMES)}`;
        
        let minDayRate, maxDayRate;
        if (profileTier === ProfileTier.BASIC) {
            maxDayRate = getRandomInt(150, 195);
            minDayRate = Math.max(120, maxDayRate - getRandomInt(20, 40));
        } else {
            minDayRate = getRandomInt(10, 30) * 25;
            maxDayRate = minDayRate + getRandomInt(2, 10) * 25;
        }

        const engineer: EngineerProfile = {
            id: `gen-eng-${i}`, name, firstName, surname: name.split(' ')[1], status: 'active',
            discipline: getRandom([Discipline.AV, Discipline.IT, Discipline.BOTH]),
            avatar: `https://i.pravatar.cc/150?u=gen-eng-${i}`,
            location: `${getRandom(LOCATIONS)}, UK`, currency: Currency.GBP, minDayRate, maxDayRate,
            experience: getRandomInt(3, 20), availability: new Date(new Date().getTime() + getRandomInt(1, 90) * 24 * 60 * 60 * 1000),
            description: `A skilled ${name.split(' ')[1]} with ${name.length % 10 + 5} years of experience.`,
            profileTier, certifications: [], caseStudies: [],
            contact: { email: `${firstName.toLowerCase()}@example.com`, phone: `07${getRandomInt(100000000, 999999999)}`, website: ``, linkedin: `` },
            compliance: { professionalIndemnity: { hasCoverage: Math.random() < 0.8, amount: 1000000, isVerified: false }, publicLiability: { hasCoverage: Math.random() < 0.8, amount: 2000000, isVerified: false }, siteSafe: Math.random() < 0.6, cscsCard: Math.random() < 0.7, ownPPE: Math.random() < 0.9, hasOwnTransport: Math.random() < 0.85, hasOwnTools: Math.random() < 0.7, powerToolCompetency: Math.random() < 0.5 ? getRandomInt(50, 90) : 0, accessEquipmentTrained: Math.random() < 0.4 ? getRandomInt(50, 90) : 0, firstAidTrained: Math.random() < 0.3, carriesSpares: Math.random() < 0.4 },
            identity: { documentType: 'none', isVerified: false },
            resourcingCompanyId: Math.random() < 0.1 ? 'res-1' : undefined,
            profileViews: getRandomInt(0, 500), searchAppearances: getRandomInt(0, 3000), jobInvites: getRandomInt(0, 10),
            calendarSyncUrl: `https://api.techsubbies.com/calendar/gen-eng-${i}.ics`,
            joinDate: new Date(new Date().setDate(new Date().getDate() - getRandomInt(10, 365))),
            badges: [],
        };

        if (profileTier !== ProfileTier.BASIC) {
            engineer.skills = allSkillsForRole.slice(0, 3).map(skillName => ({ name: skillName, rating: getRandomInt(70, 98) }));
            engineer.subscriptionEndDate = new Date(new Date().setDate(new Date().getDate() + getRandomInt(1, 30)));
            engineer.securityNetCreditsUsed = 0;
            engineer.jobDigestOptIn = true;
            if (profileTier === ProfileTier.SKILLS || profileTier === ProfileTier.BUSINESS) {
                 const ratedSkills: RatedSkill[] = allSkillsForRole.map(skillName => ({ name: skillName, rating: getRandomInt(65, 99) }));
                engineer.selectedJobRoles = [{ roleName: jobRoleDef.name, skills: ratedSkills, overallScore: Math.round(ratedSkills.reduce((acc, s) => acc + s.rating, 0) / ratedSkills.length) }];
            }
        }
        engineers.push(engineer);
    }
    return engineers;
};

const generateMockCompanies = (count: number): CompanyProfile[] => {
    return Array.from({ length: count }, (_, i) => {
        const name = `${getRandom(COMPANY_NAMES)} ${getRandom(COMPANY_SUFFIXES)}`;
        return {
            id: `gen-comp-${i}`, name, status: 'active',
            avatar: `https://i.pravatar.cc/150?u=gen-comp-${i}`,
            website: `www.${name.replace(/\s/g, '').toLowerCase()}.com`,
            consentToFeature: Math.random() < 0.2, logo: '', 
            companyRegNumber: `GB${getRandomInt(10000000, 99999999)}`, isVerified: true,
        };
    });
};


// --- Final Exports ---
export const MOCK_ENGINEERS = [MOCK_ENGINEER_STEVE, MOCK_ENGINEER_1, MOCK_ENGINEER_2, MOCK_ENGINEER_3, ...generateMockEngineers(20)];

export const MOCK_COMPANIES: CompanyProfile[] = [
    { id: 'comp-1', name: 'Pro AV Solutions', avatar: AVATARS.defaultCompany, consentToFeature: true, status: 'active', logo: 'proav', companyRegNumber: 'VALID-12345', isVerified: true },
    { id: 'comp-2', name: 'Starlight Events', avatar: AVATARS.defaultCompany, consentToFeature: true, status: 'active', logo: 'starlight', companyRegNumber: 'VALID-67890', isVerified: true },
    { id: 'comp-3', name: 'Nexus IT Integrators', avatar: AVATARS.defaultCompany, consentToFeature: true, status: 'active', logo: 'nexus', companyRegNumber: 'VALID-11223', isVerified: true },
    MOCK_RESOURCING_COMPANY_1,
    ...generateMockCompanies(15)
];
