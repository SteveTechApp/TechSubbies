import { EngineerProfile, CompanyProfile, Job, User, Role, Discipline, Currency, Skill, RatedSkill } from '../types/index.ts';
import { JOB_ROLE_DEFINITIONS } from './jobRoles.ts';

// PAID AV Engineer (Independent)
const MOCK_ENGINEER_1: EngineerProfile = {
    id: 'eng-1',
    name: 'Neil Bishop',
    firstName: 'Neil',
    middleName: 'John',
    surname: 'Bishop',
    title: 'Mr',
    discipline: Discipline.AV,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop',
    location: 'London, UK',
    currency: Currency.GBP,
    dayRate: 550,
    experience: 15,
    availability: new Date('2024-08-01'),
    description: "Senior AV commissioning engineer with 15+ years' experience specializing in corporate and residential projects. Expert in Crestron, Biamp, and Q-SYS ecosystems, ensuring flawless system integration and performance.",
    companyName: 'AV Innovations',
    travelRadius: '< 500 miles',
    profileTier: 'paid',
    skills: [ // Summary skills for card view
        { name: 'AV Commissioning', rating: 98 }, 
        { name: 'Crestron Toolbox', rating: 95 }, 
        { name: 'Biamp Tesira', rating: 92 },
        { name: 'C# (for SIMPL#)', rating: 72 },
    ],
    selectedJobRoles: [
        {
            roleName: 'AV Commissioning Engineer',
            skills: [
                { name: 'System Commissioning', rating: 98 },
                { name: 'Crestron Toolbox', rating: 95 },
                { name: 'Biamp Tesira', rating: 92 },
                { name: 'Q-SYS Designer', rating: 88 },
                { name: 'Dante Level 3', rating: 96 },
                { name: 'Network Troubleshooting', rating: 90 },
            ],
            overallScore: 93
        },
        {
            roleName: 'Crestron Programmer',
            skills: [
                { name: 'SIMPL Windows', rating: 94 },
                { name: 'C# (for SIMPL#)', rating: 72 },
                { name: 'Crestron HTML5 UI', rating: 82 },
                { name: 'DM NVX Configuration', rating: 95 },
                { name: 'System Architecture', rating: 90 },
                { name: 'API Integration', rating: 85 },
            ],
            overallScore: 87
        }
    ],
    certifications: [
        { name: 'Crestron Certified Programmer', verified: true }, 
        { name: 'Biamp TesiraFORTE Certified', verified: true }, 
        { name: 'Dante Certification Level 3', verified: true }
    ],
    contact: {
        email: 'neil.bishop@example.com',
        phone: '07123456789',
        website: 'www.neilbishop.com',
        linkedin: 'linkedin.com/in/nelib',
    },
    socials: [
        { name: 'Social 1', url: 'social 1' },
        { name: 'Social 2', url: 'social 2' },
        { name: 'Social 3', url: 'social 3' },
    ],
    associates: [
        { name: 'Associate', value: 'John Smith' },
        { name: 'Associate 2', value: 'Jane Doe' },
    ],
    compliance: {
        professionalIndemnity: true,
        publicLiability: true,
        siteSafe: true,
        ownPPE: true,
        accessEquipmentTrained: false,
        firstAidTrained: true,
    },
    generalAvailability: 'Medium',
    caseStudies: [
        { id: 'cs-1', name: 'Corporate HQ Audiovisual Integration', url: 'https://example.com/case-study-1' },
        { id: 'cs-2', name: 'Luxury Residential Smart Home System', url: 'https://example.com/case-study-2' },
    ],
    customerRating: 5,
    peerRating: 5,
};

// FREE IT Engineer (Managed by AV Placements)
const MOCK_ENGINEER_2: EngineerProfile = {
    id: 'eng-2',
    name: 'Samantha Greene',
    firstName: 'Samantha',
    surname: 'Greene',
    title: 'Ms',
    discipline: Discipline.IT,
    avatar: 'https://i.pravatar.cc/150?u=samanthagreene',
    location: 'Manchester, UK',
    currency: Currency.GBP,
    dayRate: 350,
    experience: 8,
    availability: new Date('2024-07-20'),
    description: "Microsoft Certified support specialist focusing on SME infrastructure, Office 35, and user support. Passionate about creating efficient and secure IT environments.",
    companyName: 'Greene IT Solutions',
    travelRadius: '< 100 miles',
    profileTier: 'free',
    resourcingCompanyId: 'res-1', // Managed by AV Placements
    skills: [ // Only basic skills, no specialist roles
        { name: 'Microsoft 365 Admin', rating: 92 }, 
        { name: 'Active Directory', rating: 90 }, 
        { name: 'Network Troubleshooting', rating: 88 }, 
        { name: 'Hardware Support', rating: 85 },
    ],
    certifications: [
        { name: 'Microsoft 365 Certified: Modern Desktop Administrator Associate', verified: true }, 
    ],
    contact: { 
        email: 'sam.greene@example.com', 
        phone: '01234 567891', 
        website: 'https://sgreene.com', 
        linkedin: 'https://linkedin.com/in/samanthagreene' 
    },
    socials: [
        { name: 'Social 1', url: 'social 1 link' }
    ],
    associates: [
        { name: 'Associate 1', value: 'Managed by AV Placements' }
    ],
    compliance: {
        professionalIndemnity: true,
        publicLiability: true,
        siteSafe: false,
        ownPPE: true,
        accessEquipmentTrained: false,
        firstAidTrained: false,
    },
    generalAvailability: 'High',
    caseStudies: [
      { id: 'cs-3', name: 'SME Office 365 Migration', url: 'https://example.com/case-study-3'}
    ],
    customerRating: 4,
    peerRating: 5,
    googleCalendarLink: '#',
};

// PAID IT Engineer (Managed by AV Placements)
const MOCK_ENGINEER_3: EngineerProfile = {
    id: 'eng-3',
    name: 'David Chen',
    firstName: 'David',
    surname: 'Chen',
    discipline: Discipline.IT,
    avatar: 'https://i.pravatar.cc/150?u=davidchen',
    location: 'Birmingham, UK',
    currency: Currency.GBP,
    dayRate: 600,
    experience: 10,
    availability: new Date('2024-09-15'),
    description: "AWS Certified Solutions Architect with a deep background in Cisco networking. Specializes in designing and implementing scalable, secure cloud infrastructure and hybrid networks.",
    profileTier: 'paid',
    resourcingCompanyId: 'res-1', // Managed by AV Placements
    skills: [ // Summary skills for card view
        { name: 'Cloud Architecture (AWS)', rating: 95 },
        { name: 'Network Engineering', rating: 94 },
        { name: 'Cybersecurity', rating: 88 },
    ],
    selectedJobRoles: [
        {
            roleName: 'Cloud Engineer (AWS/Azure)',
            skills: [
                { name: 'AWS EC2/Azure VMs', rating: 98 },
                { name: 'VPC/VNet Networking', rating: 92 },
                { name: 'IAM/Azure AD', rating: 94 },
                { name: 'CloudFormation/Terraform', rating: 90 },
                { name: 'Serverless Functions', rating: 85 },
                { name: 'Cloud Monitoring', rating: 88 },
            ],
            overallScore: 91
        },
        {
            roleName: 'Network Engineer',
            skills: [
                { name: 'Cisco iOS/NX-OS', rating: 96 },
                { name: 'Routing (BGP/OSPF)', rating: 94 },
                { name: 'Switching (VLANs/STP)', rating: 95 },
                { name: 'Firewall Management', rating: 89 },
                { name: 'Network Monitoring', rating: 90 },
                { name: 'Wi-Fi Surveys', rating: 85 },
            ],
            overallScore: 92
        }
    ],
    certifications: [
        { name: 'AWS Certified Solutions Architect - Professional', verified: true },
        { name: 'Cisco Certified Network Professional (CCNP)', verified: true },
    ],
    contact: { email: 'david.chen@example.com', phone: '07111222333', website: 'https://chencloud.dev', linkedin: 'https://linkedin.com/in/davidchen' },
    caseStudies: [],
};

// --- START: Programmatic Data Generation for Scale ---
const FIRST_NAMES = ['Aiden', 'Bella', 'Charlie', 'Daisy', 'Ethan', 'Freya', 'George', 'Hannah', 'Isaac', 'Jasmine', 'Leo', 'Mia', 'Noah', 'Olivia', 'Poppy', 'Riley', 'Sophia', 'Thomas', 'William', 'Zoe'];
const LAST_NAMES = ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Roberts', 'Walker', 'Wright', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Hall'];
const LOCATIONS = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Bristol', 'Edinburgh', 'Liverpool', 'Sheffield', 'Cardiff', 'Belfast', 'Newcastle', 'Nottingham'];
const COMPANY_NAMES = ['Innovate', 'Synergy', 'Apex', 'Pinnacle', 'Fusion', 'Quantum', 'Starlight', 'Nexus', 'Momentum', 'Digital', 'Vision', 'Core', 'Link', 'Signal'];
const COMPANY_SUFFIXES = ['Solutions', 'Systems', 'Integrations', 'AV', 'IT Services', 'Group', 'Ltd', 'Pro', 'Tech', 'Networks'];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateMockEngineers = (count: number): EngineerProfile[] => {
    const engineers: EngineerProfile[] = [];
    const disciplines = [Discipline.AV, Discipline.IT, Discipline.BOTH];

    for (let i = 0; i < count; i++) {
        const profileTier = Math.random() > 0.6 ? 'paid' : 'free';
        const jobRoleDef = getRandom(JOB_ROLE_DEFINITIONS);
        const firstName = getRandom(FIRST_NAMES);
        const lastName = getRandom(LAST_NAMES);
        const name = `${firstName} ${lastName}`;
        const discipline = getRandom(disciplines);
        
        const summarySkills: Skill[] = jobRoleDef.skills.slice(0, 3).map(skillName => ({
            name: skillName,
            rating: getRandomInt(70, 98)
        }));

        const engineer: EngineerProfile = {
            id: `gen-eng-${i}`,
            name: name,
            firstName: firstName,
            surname: lastName,
            discipline: discipline,
            avatar: `https://i.pravatar.cc/150?u=${name.replace(' ', '')}`,
            location: `${getRandom(LOCATIONS)}, UK`,
            currency: Currency.GBP,
            dayRate: getRandomInt(13, 30) * 25, // 325 to 750 in 25 increments
            experience: getRandomInt(3, 20),
            availability: new Date(new Date().getTime() + getRandomInt(1, 90) * 24 * 60 * 60 * 1000),
            description: `A highly skilled ${discipline} with ${name.length % 10 + 5} years of experience in the field. Proficient in various technologies and dedicated to delivering high-quality results.`,
            profileTier: profileTier,
            skills: summarySkills,
            certifications: [],
            contact: {
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
                phone: `07${getRandomInt(100000000, 999999999)}`,
                website: `www.${firstName.toLowerCase()}${lastName.toLowerCase()}.com`,
                linkedin: `linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`
            },
            caseStudies: [],
            // 10% of generated engineers are managed by AV Placements
            resourcingCompanyId: Math.random() < 0.1 ? 'res-1' : undefined,
        };

        if (profileTier === 'paid') {
            const ratedSkills: RatedSkill[] = jobRoleDef.skills.map(skillName => ({
                name: skillName,
                rating: getRandomInt(65, 99)
            }));
            const totalScore = ratedSkills.reduce((acc, skill) => acc + skill.rating, 0);
            const overallScore = Math.round(totalScore / ratedSkills.length);
            
            engineer.selectedJobRoles = [{
                roleName: jobRoleDef.name,
                skills: ratedSkills,
                overallScore: overallScore
            }];
        }
        
        engineers.push(engineer);
    }
    return engineers;
};

const generateMockCompanies = (count: number): CompanyProfile[] => {
    const companies: CompanyProfile[] = [];
    for (let i = 0; i < count; i++) {
        const name = `${getRandom(COMPANY_NAMES)} ${getRandom(COMPANY_SUFFIXES)}`;
        companies.push({
            id: `gen-comp-${i}`,
            name: name,
            avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s/g, '')}`,
            website: `www.${name.replace(/\s/g, '').toLowerCase()}.com`,
            consentToFeature: Math.random() < 0.2, // ~20% of companies consent to be featured
        });
    }
    return companies;
};

const DURATIONS = ['2 weeks', '1 month', '6 weeks', '3 months', '6 months', '12 months', 'Ongoing'];

const generateMockJobs = (count: number, companies: CompanyProfile[]): Job[] => {
    const jobs: Job[] = [];
    if (companies.length === 0) return [];

    for (let i = 0; i < count; i++) {
        const roleDef = getRandom(JOB_ROLE_DEFINITIONS);
        const company = getRandom(companies);

        const job: Job = {
            id: `gen-job-${i}`,
            companyId: company.id,
            title: roleDef.name,
            description: `We are looking for a skilled ${roleDef.name} for an upcoming project. The ideal candidate will have strong experience in ${roleDef.skills.slice(0, 3).join(', ')}. This is a contract role with potential for extension. Please apply if you have the relevant skills and are available to start soon.`,
            location: Math.random() > 0.2 ? `${getRandom(LOCATIONS)}, UK` : 'Remote',
            dayRate: String(getRandomInt(13, 30) * 25),
            currency: Currency.GBP,
            duration: getRandom(DURATIONS),
            postedDate: new Date(new Date().getTime() - getRandomInt(1, 30) * 24 * 60 * 60 * 1000),
            startDate: new Date(new Date().getTime() + getRandomInt(1, 60) * 24 * 60 * 60 * 1000),
        };
        
        jobs.push(job);
    }
    return jobs;
};

// --- EXPORT THE DATA ---
export const MOCK_ENGINEERS = [MOCK_ENGINEER_1, MOCK_ENGINEER_2, MOCK_ENGINEER_3, ...generateMockEngineers(20)];

export const MOCK_COMPANIES: CompanyProfile[] = [
    { id: 'comp-1', name: 'Pro AV Solutions', avatar: 'https://i.pravatar.cc/150?u=proav', consentToFeature: true },
    { id: 'comp-2', name: 'Starlight Events', avatar: 'https://i.pravatar.cc/150?u=starlight', consentToFeature: true },
    { id: 'comp-3', name: 'Nexus IT Integrators', avatar: 'https://i.pravatar.cc/150?u=nexusit', consentToFeature: true },
    ...generateMockCompanies(15)
];

const MOCK_COMPANY_1: CompanyProfile = MOCK_COMPANIES.find(c => c.id === 'comp-1')!;

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
};

export const MOCK_JOBS: Job[] = [
    MOCK_JOB_1,
    ...generateMockJobs(15, MOCK_COMPANIES)
];

const MOCK_RESOURCING_COMPANY_1: CompanyProfile = { id: 'res-1', name: 'AV Placements', avatar: 'https://i.pravatar.cc/150?u=avplacements' };
const MOCK_ADMIN_PROFILE: CompanyProfile = { id: 'admin-1', name: 'Steve Goodwin', avatar: 'https://i.pravatar.cc/150?u=stevegoodwin' };

const MOCK_FREE_ENGINEER: EngineerProfile = {
    ...MOCK_ENGINEER_2,
    id: 'eng-free',
    name: 'Emily Carter',
    firstName: 'Emily',
    surname: 'Carter',
    avatar: 'https://i.pravatar.cc/150?u=emilycarter',
    profileTier: 'free',
    resourcingCompanyId: undefined,
};
export const MOCK_USER_FREE_ENGINEER: User = { id: 'user-free', role: Role.ENGINEER, profile: MOCK_FREE_ENGINEER };


export const MOCK_USERS: { [key in Role]: User } = {
    [Role.ENGINEER]: { id: 'user-1', role: Role.ENGINEER, profile: MOCK_ENGINEER_1 },
    [Role.COMPANY]: { id: 'user-2', role: Role.COMPANY, profile: MOCK_COMPANY_1 },
    [Role.RESOURCING_COMPANY]: { id: 'user-3', role: Role.RESOURCING_COMPANY, profile: MOCK_RESOURCING_COMPANY_1 },
    [Role.ADMIN]: { id: 'user-4', role: Role.ADMIN, profile: MOCK_ADMIN_PROFILE },
};