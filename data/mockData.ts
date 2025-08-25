import { EngineerProfile, CompanyProfile, Job, User, Role, Discipline, Currency, Skill, RatedSkill, Conversation, Message, Application, Review } from '../types/index.ts';
import { JOB_ROLE_DEFINITIONS } from './jobRoles.ts';

// NEW: Gendered names for more realistic profile images
const MALE_FIRST_NAMES = ['Neil', 'David', 'Aiden', 'Charlie', 'Ethan', 'George', 'Isaac', 'Leo', 'Noah', 'Thomas', 'William', 'Riley', 'Sam'];
const FEMALE_FIRST_NAMES = ['Samantha', 'Emily', 'Bella', 'Daisy', 'Freya', 'Hannah', 'Jasmine', 'Mia', 'Olivia', 'Poppy', 'Sophia', 'Zoe'];
const LAST_NAMES = ['Bishop', 'Greene', 'Chen', 'Carter', 'Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Roberts', 'Walker', 'Wright', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Hall'];
const LOCATIONS = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Bristol', 'Edinburgh', 'Liverpool', 'Sheffield', 'Cardiff', 'Belfast', 'Newcastle', 'Nottingham'];
const COMPANY_NAMES = ['Innovate', 'Synergy', 'Apex', 'Pinnacle', 'Fusion', 'Quantum', 'Starlight', 'Nexus', 'Momentum', 'Digital', 'Vision', 'Core', 'Link', 'Signal'];
const COMPANY_SUFFIXES = ['Solutions', 'Systems', 'Integrations', 'AV', 'IT Services', 'Group', 'Ltd', 'Pro', 'Tech', 'Networks'];

// PAID AV Engineer (Independent)
const MOCK_ENGINEER_1: EngineerProfile = {
    id: 'eng-1',
    name: 'Neil Bishop',
    firstName: 'Neil',
    middleName: 'John',
    surname: 'Bishop',
    title: 'Mr',
    status: 'active',
    discipline: Discipline.AV,
    avatar: 'https://xsgames.co/randomusers/assets/avatars/male/74.jpg',
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
    isBoosted: true,
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
    status: 'active',
    discipline: Discipline.IT,
    avatar: 'https://xsgames.co/randomusers/assets/avatars/female/10.jpg',
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
    status: 'active',
    discipline: Discipline.IT,
    avatar: 'https://xsgames.co/randomusers/assets/avatars/male/15.jpg',
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
const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateMockEngineers = (count: number): EngineerProfile[] => {
    const engineers: EngineerProfile[] = [];
    const disciplines = [Discipline.AV, Discipline.IT, Discipline.BOTH];

    for (let i = 0; i < count; i++) {
        const profileTier = Math.random() > 0.6 ? 'paid' : 'free';
        const jobRoleDef = getRandom(JOB_ROLE_DEFINITIONS);

        const isMale = Math.random() > 0.5;
        const firstName = isMale ? getRandom(MALE_FIRST_NAMES) : getRandom(FEMALE_FIRST_NAMES);
        const lastName = getRandom(LAST_NAMES);
        const name = `${firstName} ${lastName}`;
        const gender = isMale ? 'male' : 'female';
        const avatarIndex = getRandomInt(0, 78);
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
            status: 'active',
            discipline: discipline,
            avatar: `https://xsgames.co/randomusers/assets/avatars/${gender}/${avatarIndex}.jpg`,
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
            
            if (Math.random() < 0.2) { // ~20% of premium users are boosted
                engineer.isBoosted = true;
            }
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
            status: 'active',
            avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s/g, '')}`,
            website: `www.${name.replace(/\s/g, '').toLowerCase()}.com`,
            consentToFeature: Math.random() < 0.2, // ~20% of companies consent to be featured
            logo: `https://logo.clearbit.com/${name.replace(/\s/g, '').toLowerCase().replace('ltd','')}.com?size=100`
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
            status: 'active',
        };
        
        jobs.push(job);
    }
    return jobs;
};

// --- EXPORT THE DATA ---
export const MOCK_ENGINEERS = [MOCK_ENGINEER_1, MOCK_ENGINEER_2, MOCK_ENGINEER_3, ...generateMockEngineers(20)];

export const MOCK_COMPANIES: CompanyProfile[] = [
    { id: 'comp-1', name: 'Pro AV Solutions', avatar: 'https://i.pravatar.cc/150?u=proav', consentToFeature: true, status: 'active', logo: 'https://i.imgur.com/cO0k4Sj.png' },
    { id: 'comp-2', name: 'Starlight Events', avatar: 'https://i.pravatar.cc/150?u=starlight', consentToFeature: true, status: 'active', logo: 'https://i.imgur.com/U5n41QT.png' },
    { id: 'comp-3', name: 'Nexus IT Integrators', avatar: 'https://i.pravatar.cc/150?u=nexusit', consentToFeature: true, status: 'active', logo: 'https://i.imgur.com/dJeEvD5.png' },
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
    status: 'active',
};

export const MOCK_JOBS: Job[] = [
    MOCK_JOB_1,
    ...generateMockJobs(15, MOCK_COMPANIES)
];

const MOCK_RESOURCING_COMPANY_1: CompanyProfile = { id: 'res-1', name: 'AV Placements', avatar: 'https://i.pravatar.cc/150?u=avplacements', status: 'active', logo: 'https://i.imgur.com/2yF5t1x.png' };
const MOCK_ADMIN_PROFILE: CompanyProfile = { id: 'admin-1', name: 'Steve Goodwin', avatar: 'https://i.imgur.com/RfjB4zR.jpg', status: 'active', logo: 'https://i.imgur.com/2yF5t1x.png' };

const MOCK_FREE_ENGINEER: EngineerProfile = {
    ...MOCK_ENGINEER_2,
    id: 'eng-free',
    name: 'Emily Carter',
    firstName: 'Emily',
    surname: 'Carter',
    status: 'active',
    avatar: 'https://xsgames.co/randomusers/assets/avatars/female/20.jpg',
    profileTier: 'free',
    resourcingCompanyId: undefined,
    contact: { ...MOCK_ENGINEER_2.contact, email: 'emily.carter@example.com' },
};
export const MOCK_USER_FREE_ENGINEER: User = { id: 'user-free', role: Role.ENGINEER, profile: MOCK_FREE_ENGINEER };


export const MOCK_USERS: { [key in Role]: User } = {
    [Role.ENGINEER]: { id: 'user-1', role: Role.ENGINEER, profile: MOCK_ENGINEER_1 },
    [Role.COMPANY]: { id: 'user-2', role: Role.COMPANY, profile: MOCK_COMPANY_1 },
    [Role.RESOURCING_COMPANY]: { id: 'user-3', role: Role.RESOURCING_COMPANY, profile: MOCK_RESOURCING_COMPANY_1 },
    [Role.ADMIN]: { id: 'user-4', role: Role.ADMIN, profile: MOCK_ADMIN_PROFILE },
};

export const ALL_MOCK_USERS: User[] = [
    ...MOCK_ENGINEERS.map((profile, i) => ({
        id: `user-eng-${profile.id}`,
        role: Role.ENGINEER,
        profile
    })),
    ...MOCK_COMPANIES.map(profile => ({
        id: `user-comp-${profile.id}`,
        role: Role.COMPANY,
        profile
    })),
     { id: 'user-res-1', role: Role.RESOURCING_COMPANY, profile: MOCK_RESOURCING_COMPANY_1 },
     { id: 'user-admin-1', role: Role.ADMIN, profile: MOCK_ADMIN_PROFILE }
];

export const MOCK_APPLICATIONS: Application[] = [
    { jobId: 'job-1', engineerId: 'eng-1', date: new Date('2024-06-20'), completed: true, reviewed: true },
    { jobId: 'job-1', engineerId: 'gen-eng-5', date: new Date('2024-06-21'), completed: false, reviewed: false },
    { jobId: 'gen-job-1', engineerId: 'eng-2', date: new Date('2024-07-01'), completed: true, reviewed: false },
];

export const MOCK_REVIEWS: Review[] = [
    { 
        id: 'rev-1',
        jobId: 'job-1',
        companyId: 'comp-1',
        engineerId: 'eng-1',
        peerRating: 5, // Technical
        customerRating: 5, // Communication
        comment: "Neil was an absolute professional. His expertise in Crestron was evident from day one and he was a pleasure to have on site. Highly recommended.",
        date: new Date('2024-07-28')
    },
];


// --- MESSAGING MOCK DATA ---
export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'convo-1',
        participantIds: ['user-eng-eng-1', 'user-comp-comp-1'], // Neil Bishop & Pro AV
        lastMessageTimestamp: new Date(new Date().setHours(new Date().getHours() - 1)),
        lastMessageText: "Perfect, I've just sent over the revised quote. Let me know what you think."
    },
    {
        id: 'convo-2',
        participantIds: ['user-eng-eng-2', 'user-res-1'], // Samantha Greene & AV Placements
        lastMessageTimestamp: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(11, 0)),
        lastMessageText: "Yes, I'm available from that date. Please feel free to submit my profile."
    }
];

export const MOCK_MESSAGES: Message[] = [
    // Convo 1: Neil Bishop (user-eng-eng-1) & Pro AV (user-comp-comp-1)
    { id: 'msg-1', conversationId: 'convo-1', senderId: 'user-comp-comp-1', text: "Hi Neil, we were impressed with your profile. We have a project starting soon, are you available?", timestamp: new Date(new Date().setHours(new Date().getHours() - 2)), isRead: true },
    { id: 'msg-2', conversationId: 'convo-1', senderId: 'user-eng-eng-1', text: "Hi there! Thanks for reaching out. Yes, my calendar is up to date. I'm available from the 1st of August. Can you tell me more about the project?", timestamp: new Date(new Date().setHours(new Date().getHours() - 1, 50)), isRead: true },
    { id: 'msg-3', conversationId: 'convo-1', senderId: 'user-comp-comp-1', text: "It's a large corporate HQ installation. Primarily Crestron and Biamp. I can send over the spec sheet if you're interested.", timestamp: new Date(new Date().setHours(new Date().getHours() - 1, 40)), isRead: true },
    { id: 'msg-4', conversationId: 'convo-1', senderId: 'user-eng-eng-1', text: "Perfect, I've just sent over the revised quote. Let me know what you think.", timestamp: new Date(new Date().setHours(new Date().getHours() - 1)), isRead: false },
    // Convo 2: Samantha Greene (user-eng-eng-2) & AV Placements (user-res-1)
    { id: 'msg-5', conversationId: 'convo-2', senderId: 'user-res-1', text: "Hi Samantha, a new IT support role came up that looks like a great fit for you. Are you happy for us to put you forward?", timestamp: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(10, 0)), isRead: true },
    { id: 'msg-6', conversationId: 'convo-2', senderId: 'user-eng-eng-2', text: "Yes, I'm available from that date. Please feel free to submit my profile.", timestamp: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(11, 0)), isRead: true },
];