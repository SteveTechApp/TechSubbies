import { Application, Review, Conversation, Message, ApplicationStatus } from '../../types/index.ts';

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
