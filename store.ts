import { Role, Job, EngineerProfile, User } from './types.ts';
import { MOCK_USERS, MOCK_JOBS, MOCK_ENGINEERS } from './services/mockDataGenerator.ts';

const generateUniqueId = () => Math.random().toString(36).substring(2, 10);

type Subscriber = (user: User | null) => void;

class AppStore {
    public user: User | null = null;
    public jobs: Job[] = MOCK_JOBS;
    public engineers: EngineerProfile[] = MOCK_ENGINEERS;
    private subscribers: Subscriber[] = [];

    constructor() {
        // You could potentially load initial state from localStorage here
    }

    subscribe(callback: Subscriber) {
        this.subscribers.push(callback);
    }

    unsubscribe(callback: Subscriber) {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    private notify() {
        this.subscribers.forEach(callback => callback(this.user));
    }

    login(role: Role) {
        if (MOCK_USERS[role]) {
            this.user = MOCK_USERS[role];
            this.notify();
        }
    }

    logout() {
        this.user = null;
        this.notify();
    }
    
    updateUserProfile(updatedProfile: Partial<EngineerProfile>) {
        if (this.user) {
            this.user = {
                ...this.user,
                profile: {
                    ...this.user.profile,
                    ...updatedProfile,
                }
            };
            // Also update the main engineers list if the user is an engineer
            const engineerIndex = this.engineers.findIndex(e => e.id === this.user?.profile.id);
            if (engineerIndex !== -1) {
                this.engineers[engineerIndex] = { ...this.engineers[engineerIndex], ...updatedProfile };
            }
            this.notify();
        }
    }

    postJob(jobData: any) {
        const newJob: Job = {
            ...jobData,
            id: `job-${generateUniqueId()}`,
            companyId: this.user?.profile?.id,
            postedDate: new Date(),
            startDate: jobData.startDate ? new Date(jobData.startDate) : null,
        };
        this.jobs = [newJob, ...this.jobs];
        this.notify(); // Although this doesn't affect the user, we notify in case some components depend on job list
    }
}

export const store = new AppStore();
export type { User }; // Re-export for convenience
