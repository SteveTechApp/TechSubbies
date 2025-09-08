import { Job, CompanyProfile, Currency, JobType, ExperienceLevel, ResourcingCompanyProfile } from '../../types';
// FIX: Corrected import path for MOCK_COMPANIES to resolve module error.
import { MOCK_COMPANIES } from './mockGeneratedProfiles';
import { JOB_ROLE_DEFINITIONS } from '../jobRoles';
import { LOCATIONS, DURATIONS, JOB_TYPES, EXP_LEVELS } from './mockConstants';

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const MOCK_COMPANY_1 = MOCK_COMPANIES.find(c => c.id === 'comp-1')!;

const MOCK_JOB_1: Job = {
    id: 'job-1',
    companyId: MOCK_COMPANY_1.id,
    title: 'Senior AV Commissioning Engineer',
    description: 'Lead the commissioning of a new corporate headquarters in Canary Wharf. Must be an expert in Crestron DM NVX, Biamp Tesira, and Dante. Client-facing role requiring excellent communication and documentation skills.',
    location: 'London, UK',
    dayRate: '550',
    currency: Currency.GBP,
    duration: '6 weeks',
    postedDate: new Date('2024-06-15'),
    startDate: new Date('2024-07-29'),
    status: 'active',
    jobType: JobType.CONTRACT,
    experienceLevel: ExperienceLevel.SENIOR,
    jobRole: 'AV Systems Engineer',
    skillRequirements: [
        { name: 'System commissioning and testing procedures', importance: 'essential' },
        { name: 'Troubleshooting complex AV systems', importance: 'essential' },
        { name: 'Network protocols (TCP/IP, IGMP, PTP)', importance: 'essential' },
        { name: 'Performance optimization', importance: 'desirable' },
    ],
};

// FIX: Updated the 'companies' parameter type to accept both CompanyProfile and ResourcingCompanyProfile.
const generateMockJobs = (count: number, companies: (CompanyProfile | ResourcingCompanyProfile)[]): Job[] => {
    if (companies.length === 0) return [];
    return Array.from({ length: count }, (_, i) => {
        const roleDef = getRandom(JOB_ROLE_DEFINITIONS);
        const company = getRandom(companies);
        const allSkillsForRole = roleDef.skillCategories.flatMap(category => category.skills);
        return {
            id: `gen-job-${i}`,
            companyId: company.id,
            title: roleDef.name,
            description: `We are looking for a skilled ${roleDef.name} for an upcoming project. The ideal candidate will have strong experience in ${allSkillsForRole.slice(0, 3).map(s => s.name).join(', ')}. This is a contract role with potential for extension.`,
            location: Math.random() > 0.2 ? `${getRandom(LOCATIONS)}, UK` : 'Remote',
            dayRate: String(getRandomInt(13, 30) * 25),
            currency: Currency.GBP,
            duration: getRandom(DURATIONS),
            postedDate: new Date(new Date().getTime() - getRandomInt(1, 30) * 24 * 60 * 60 * 1000),
            startDate: new Date(new Date().getTime() + getRandomInt(1, 60) * 24 * 60 * 60 * 1000),
            status: 'active',
            jobType: getRandom(JOB_TYPES),
            experienceLevel: getRandom(EXP_LEVELS),
            jobRole: roleDef.name,
            skillRequirements: allSkillsForRole.slice(0, 5).map((skill, index) => ({
                name: skill.name,
                importance: index < 2 ? 'essential' : 'desirable', // Make first 2 essential
            })),
        };
    });
};

export const MOCK_JOBS: Job[] = [
    MOCK_JOB_1,
    ...generateMockJobs(15, MOCK_COMPANIES)
];