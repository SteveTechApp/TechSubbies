import { Application, Review, Conversation, Message, ApplicationStatus, Contract, ContractStatus, ContractType, Currency, Milestone, MilestoneStatus, Transaction, TransactionType, Timesheet, Project, Discipline, TimesheetStatus, CollaborationPost, Invoice, InvoiceStatus, PaymentTerms } from '../../types';

export const MOCK_APPLICATIONS: Application[] = [
    { jobId: 'job-1', engineerId: 'eng-1', date: new Date('2024-06-20'), status: ApplicationStatus.COMPLETED, reviewed: true },
    { jobId: 'job-1', engineerId: 'gen-eng-5', date: new Date('2024-06-21'), status: ApplicationStatus.OFFERED, reviewed: false },
    { jobId: 'gen-job-1', engineerId: 'eng-2', date: new Date('2024-07-01'), status: ApplicationStatus.COMPLETED, reviewed: false },
    { jobId: 'gen-job-2', engineerId: 'eng-1', date: new Date('2024-07-02'), status: ApplicationStatus.APPLIED, reviewed: false },
];

export const MOCK_REVIEWS: Review[] = [
    { 
        id: 'rev-1',
        jobId: 'job-1',
        companyId: 'comp-1',
        engineerId: 'eng-1',
        peerRating: 5,
        customerRating: 5,
        comment: "Neil was an absolute professional. His expertise in Crestron was evident from day one and he was a pleasure to have on site. Highly recommended.",
        date: new Date('2024-07-28')
    },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'convo-1',
        participantIds: ['user-eng-eng-1', 'user-comp-comp-1'],
        lastMessageTimestamp: new Date(new Date().setHours(new Date().getHours() - 1)),
        lastMessageText: "Perfect, I've just sent over the revised quote. Let me know what you think."
    },
    {
        id: 'convo-2',
        participantIds: ['user-eng-eng-2', 'user-comp-res-1'],
        lastMessageTimestamp: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(11, 0)),
        lastMessageText: "Yes, I'm available from that date. Please feel free to submit my profile."
    }
];

export const MOCK_MESSAGES: Message[] = [
    { id: 'msg-1', conversationId: 'convo-1', senderId: 'user-comp-comp-1', text: "Hi Neil, we were impressed with your profile. We have a project starting soon, are you available?", timestamp: new Date(new Date().setHours(new Date().getHours() - 2)), isRead: true },
    { id: 'msg-2', conversationId: 'convo-1', senderId: 'user-eng-eng-1', text: "Hi there! Thanks for reaching out. Yes, my calendar is up to date. I'm available from the 1st of August. Can you tell me more about the project?", timestamp: new Date(new Date().setHours(new Date().getHours() - 1, 50)), isRead: true },
    { id: 'msg-3', conversationId: 'convo-1', senderId: 'user-comp-comp-1', text: "It's a large corporate HQ installation. Primarily Crestron and Biamp. I can send over the spec sheet if you're interested.", timestamp: new Date(new Date().setHours(new Date().getHours() - 1, 40)), isRead: true },
    { id: 'msg-4', conversationId: 'convo-1', senderId: 'user-eng-eng-1', text: "Perfect, I've just sent over the revised quote. Let me know what you think.", timestamp: new Date(new Date().getHours() - 1), isRead: false },
    { id: 'msg-5', conversationId: 'convo-2', senderId: 'user-comp-res-1', text: "Hi Samantha, a new IT support role came up that looks like a great fit for you. Are you happy for us to put you forward?", timestamp: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(10, 0)), isRead: true },
    { id: 'msg-6', conversationId: 'convo-2', senderId: 'user-eng-eng-2', text: "Yes, I'm available from that date. Please feel free to submit my profile.", timestamp: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(11, 0)), isRead: true },
];

export const MOCK_TIMESHEETS: Timesheet[] = [
    // FIX: Changed status from string 'paid' to the enum member `TimesheetStatus.PAID`.
    { id: 'ts-1', contractId: 'contract-1', engineerId: 'eng-1', period: 'Week ending 2024-08-02', days: 5, status: TimesheetStatus.PAID }
];

export const MOCK_CONTRACTS: Contract[] = [
    {
        id: 'contract-1',
        jobId: 'job-1',
        companyId: 'comp-1',
        engineerId: 'eng-1',
        type: ContractType.DAY_RATE,
        description: `This Day Rate Agreement is made between Pro AV Solutions ("the Client") and Neil Bishop ("the Contractor"). The Contractor agrees to provide services as described herein. This platform, TechSubbies.com, is a facilitator and is not a party to this agreement. Any disputes must be resolved directly between the Client and the Contractor.`,
        amount: '550',
        currency: Currency.GBP,
        status: ContractStatus.ACTIVE,
        engineerSignature: { name: 'Neil Bishop', date: new Date('2024-07-20') },
        companySignature: { name: 'Steve Goodwin', date: new Date('2024-07-21') },
        milestones: [],
        timesheets: MOCK_TIMESHEETS,
    },
    {
        id: 'contract-2',
        jobId: 'gen-job-1',
        companyId: 'comp-2',
        engineerId: 'eng-2',
        type: ContractType.SOW,
        description: `This Statement of Work (SOW) is made between Starlight Events ("the Client") and Samantha Greene ("the Contractor"). The Contractor will complete the milestones as defined in this contract. Payment will be released from escrow upon successful completion and approval of each milestone.`,
        amount: 2500,
        currency: Currency.GBP,
        status: ContractStatus.ACTIVE,
        engineerSignature: { name: 'Samantha Greene', date: new Date('2024-07-25') },
        companySignature: { name: 'Starlight Events', date: new Date('2024-07-25') },
        milestones: [
            { id: 'm1', description: 'Phase 1: Initial Site Survey & Report', amount: 500, status: MilestoneStatus.COMPLETED_PAID },
            { id: 'm2', description: 'Pre-wire & First Fix', amount: 1000, status: MilestoneStatus.SUBMITTED_FOR_APPROVAL },
            { id: 'm3', description: 'Final Installation & Handover', amount: 1000, status: MilestoneStatus.AWAITING_FUNDING },
        ],
    }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'txn-1', userId: 'user-eng-eng-1', contractId: 'contract-2', type: TransactionType.PAYOUT, description: "Payout for Milestone: Phase 1: Initial Site Survey & Report", amount: 475, date: new Date('2024-07-28') },
    { id: 'txn-2', userId: 'user-eng-eng-1', contractId: 'contract-2', type: TransactionType.PLATFORM_FEE, description: "Platform Fee (5%) for Milestone: Phase 1", amount: -25, date: new Date('2024-07-28') },
    { id: 'txn-3', userId: 'user-comp-comp-2', contractId: 'contract-2', type: TransactionType.ESCROW_FUNDING, description: "Funded Milestone: Phase 1: Initial Site Survey & Report", amount: -500, date: new Date('2024-07-26') },
    { id: 'txn-4', userId: 'user-eng-eng-1', contractId: 'contract-1', type: TransactionType.PAYOUT, description: "Payout for Timesheet: Week ending 2024-08-02", amount: 2612.50, date: new Date('2024-08-03') },
    { id: 'txn-5', userId: 'user-comp-comp-1', contractId: 'contract-1', type: TransactionType.PLATFORM_FEE, description: "Platform Fee for Timesheet: Week ending 2024-08-02", amount: -137.50, date: new Date('2024-08-03') },
];


export const MOCK_PROJECTS: Project[] = [
    {
        id: 'proj-1',
        companyId: 'comp-1',
        name: 'Project Alpha: Corporate HQ Fit-Out',
        description: 'Full audiovisual and network infrastructure installation for a new 5-floor corporate headquarters in Canary Wharf.',
        status: 'planning',
        roles: [
            { id: 'role-1', title: 'AV Systems Designer', discipline: Discipline.AV, startDate: new Date('2024-08-01'), endDate: new Date('2024-08-30'), assignedEngineerId: null },
            { id: 'role-2', title: 'Lead Network Engineer', discipline: Discipline.IT, startDate: new Date('2024-08-15'), endDate: new Date('2024-10-15'), assignedEngineerId: 'eng-3' },
            { id: 'role-3', title: 'Crestron Programmer', discipline: Discipline.AV, startDate: new Date('2024-09-01'), endDate: new Date('2024-11-01'), assignedEngineerId: null },
            { id: 'role-4', title: 'AV Commissioning Engineer', discipline: Discipline.AV, startDate: new Date('2024-10-15'), endDate: new Date('2024-11-30'), assignedEngineerId: 'eng-1' },
            { id: 'role-5', title: 'On-site IT Support', discipline: Discipline.IT, startDate: new Date('2024-11-15'), endDate: new Date('2024-12-15'), assignedEngineerId: 'eng-2' },
        ],
    },
];

export const MOCK_COLLABORATION_POSTS: CollaborationPost[] = [
    {
        id: 'collab-1',
        postedByEngineerId: 'eng-steve',
        title: 'Need Crestron Programmer for Overflow Work',
        description: 'Looking for an experienced Crestron programmer to assist with a large corporate project for the next 4-6 weeks. Must be proficient in SIMPL and C#. Remote work possible for the right candidate.',
        location: 'London / Remote',
        rate: '500',
        currency: Currency.GBP,
        duration: '4-6 weeks',
        startDate: new Date('2024-09-01'),
        postedDate: new Date('2024-07-25'),
        status: 'open',
    },
    {
        id: 'collab-2',
        postedByEngineerId: 'gen-eng-1', // David Greene from mock generation
        title: 'Partner for Small Business IT Rollout',
        description: 'Seeking a freelance IT engineer to partner on a multi-site retail IT installation project. Work involves network setup, POS installation, and user training. Must have own transport and tools.',
        location: 'Manchester, UK',
        rate: '350',
        currency: Currency.GBP,
        duration: '3 weeks',
        startDate: new Date('2024-08-15'),
        postedDate: new Date('2024-07-22'),
        status: 'open',
    }
];

export const MOCK_INVOICES: Invoice[] = [
    {
        id: 'inv-1',
        contractId: 'contract-2',
        companyId: 'comp-2',
        engineerId: 'eng-2',
        items: [{ description: 'Milestone: Pre-wire & First Fix', amount: 1000 }],
        total: 1000,
        issueDate: new Date('2024-08-10'),
        dueDate: new Date('2024-08-24'),
        status: InvoiceStatus.SENT,
    }
];
