import { ForumPost, ForumComment, Notification, NotificationType } from '../../types';

export const MOCK_FORUM_POSTS: ForumPost[] = [
    {
        id: 'post-1',
        authorId: 'user-eng-eng-1', // Neil Bishop
        title: 'Best practices for large-scale DM NVX deployments?',
        content: "Hey everyone, I'm about to start a project with over 150 DM NVX endpoints. I've done smaller systems before, but I'm looking for any tips or 'gotchas' for a deployment of this size. Specifically interested in network switch configuration (Cisco SG550X) and best practices for managing the Virtual Matrix in a multi-floor building. Any advice would be appreciated!",
        tags: ['crestron', 'dm-nvx', 'networking', 'av-over-ip'],
        timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
        upvotes: 28,
        downvotes: 1,
        status: 'approved',
    },
    {
        id: 'post-2',
        authorId: 'user-eng-eng-3', // David Chen
        title: 'Thoughts on using Terraform for managing MS Teams Rooms configs?',
        content: "Has anyone here explored using Infrastructure as Code (IaC) tools like Terraform to manage configurations for Microsoft Teams Rooms? I'm thinking about standardizing our MTR deployments and version-controlling the configs seems like a good path. Is it overkill? What are the pros and cons you've experienced?",
        tags: ['msteams', 'iac', 'terraform', 'automation', 'it'],
        timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
        upvotes: 42,
        downvotes: 0,
        status: 'approved',
    },
    {
        id: 'post-3',
        authorId: 'user-eng-eng-2', // Samantha Greene
        title: 'Entry-level certs for AV - Is CTS still the way to go?',
        content: "Hi all, I'm an IT support engineer looking to cross-skill more into the AV world. I keep seeing the AVIXA CTS certification mentioned. For those of you who have it, do you feel it's the best starting point for someone with a solid IT background but less formal AV experience? Are there other certs I should be looking at first? Thanks!",
        tags: ['certifications', 'training', 'avixa-cts', 'career'],
        timestamp: new Date(new Date().setHours(new Date().getHours() - 5)),
        upvotes: 15,
        downvotes: 0,
        status: 'approved',
    },
];

export const MOCK_FORUM_COMMENTS: ForumComment[] = [
    // Comments for post-1
    { id: 'comment-1', postId: 'post-1', authorId: 'user-eng-eng-3', parentId: null, content: "Great question. For a system that size, make sure you have IGMP snooping configured correctly on your switches. It's critical. Also, I'd highly recommend setting up a dedicated VLAN for all your NVX traffic to keep it isolated.", timestamp: new Date(new Date().setDate(new Date().getDate() - 1)), upvotes: 12, downvotes: 0 },
    { id: 'comment-2', postId: 'post-1', authorId: 'user-eng-eng-steve', parentId: 'comment-1', content: "This is key. Also, use the multicast address range that Crestron recommends in their documentation. Don't just use the defaults if you can avoid it.", timestamp: new Date(new Date().setDate(new Date().getDate() - 1)), upvotes: 8, downvotes: 0 },
    { id: 'comment-3', postId: 'post-1', authorId: 'user-eng-eng-1', parentId: 'comment-1', content: "Thanks both, that's really helpful. I've already planned for a dedicated VLAN. I'll double-check the IGMP snooping querier settings.", timestamp: new Date(new Date().setHours(new Date().getHours() - 20)), upvotes: 3, downvotes: 0 },

    // Comments for post-2
    { id: 'comment-4', postId: 'post-2', authorId: 'user-eng-eng-1', parentId: null, content: "This is a fascinating idea. I've used PowerShell scripts for bulk config, but never Terraform. The main benefit I see is the state management and the ability to see a 'plan' before you apply changes. I'd be interested to see a proof of concept.", timestamp: new Date(new Date().setDate(new Date().getDate() - 2)), upvotes: 9, downvotes: 0 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        userId: 'user-eng-eng-1',
        type: NotificationType.JOB_OFFER,
        text: "Pro AV Solutions has offered you the 'Senior AV Commissioning Engineer' job.",
        link: 'My Network',
        isRead: false,
        timestamp: new Date(new Date().setHours(new Date().getHours() - 3)),
    },
    {
        id: 'notif-2',
        userId: 'user-eng-eng-1',
        type: NotificationType.MESSAGE,
        text: "You have a new message from Pro AV Solutions.",
        link: 'Messages',
        isRead: false,
        timestamp: new Date(new Date().setHours(new Date().getHours() - 1)),
    },
     {
        id: 'notif-3',
        userId: 'user-eng-eng-1',
        type: NotificationType.NEW_JOB_MATCH,
        text: "A new job, 'Lead AV Installer', matches your skills.",
        link: 'Job Search',
        isRead: true,
        timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
    }
];