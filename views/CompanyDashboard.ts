import { LitElement, html, css } from 'lit';
import { store, User } from '../store.ts';
import { Job } from '../types.ts';
import { renderReactIcon } from '../utils/react-icon-renderer.ts';
import { MapPin } from 'lucide-react';
import React from 'react';

// Import required components
import '../components/DashboardSidebar.ts';
import '../components/JobPostModal.ts';
import '../components/AIEngineerCostAnalysis.ts';

// Utility to safely format dates and prevent rendering errors
const formatDate = (date: Date | string | null): string => {
    if (!date) return 'TBD';
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'Invalid Date';
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
};

class CompanyDashboard extends LitElement {
    user: User | null;
    activeView: string;
    isJobModalOpen: boolean;

    static get properties() {
        return {
            user: { state: true },
            activeView: { state: true },
            isJobModalOpen: { state: true }
        };
    }

    constructor() {
        super();
        this.user = store.user;
        this.activeView = 'Dashboard';
        this.isJobModalOpen = false;
    }

    get myJobs() {
        return store.jobs.filter(j => j.companyId === this.user?.profile?.id);
    }
    
    connectedCallback() {
        super.connectedCallback();
        store.subscribe(this.handleUserChange);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        store.unsubscribe(this.handleUserChange);
    }

    handleUserChange = (user: User | null) => {
        this.user = user;
    };
    
    handleViewChanged(e: CustomEvent<string>) {
        const newView = e.detail;
        if (newView === 'Post a Job') {
            this.isJobModalOpen = true;
        } else {
            this.activeView = newView;
        }
    }

    handlePostJob = (e: CustomEvent<any>) => {
        store.postJob(e.detail);
        this.isJobModalOpen = false;
        this.activeView = 'My Jobs';
    };

    static styles = css`
        :host { display: flex; }
        main { flex-grow: 1; }
    `;
    
    render() {
        if (!this.user) return html``;

        return html`
            <dashboard-sidebar .activeView=${this.activeView} @view-changed=${this.handleViewChanged}></dashboard-sidebar>
            <main class="flex-grow p-8 bg-gray-50">
                ${this.renderActiveView()}
            </main>
            <job-post-modal
                .isOpen=${this.isJobModalOpen}
                @close=${() => this.isJobModalOpen = false}
                @post-job=${this.handlePostJob}>
            </job-post-modal>
        `;
    }
    
    renderActiveView() {
        switch(this.activeView) {
            case 'Dashboard':
                return this.renderDashboardView();
            case 'My Jobs':
                return this.renderMyJobsView();
            default:
                return html`
                    <div class="bg-white p-6 rounded-lg shadow">
                        <h1 class="text-2xl font-bold">${this.activeView} - Coming Soon</h1>
                        <p class="mt-4">The functionality for "${this.activeView}" is under development.</p>
                    </div>
                `;
        }
    }
    
    renderDashboardView() {
        const { engineers } = store;
        const myJobs = this.myJobs;
        return html`
            <div>
                <h1 class="text-3xl font-bold mb-6">Welcome, ${this.user?.profile?.name}!</h1>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div class="bg-white p-6 rounded-lg shadow">
                        <h2 class="font-bold text-xl">Active Jobs</h2>
                        <p class="text-4xl font-extrabold text-blue-600">${myJobs.length}</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow">
                        <h2 class="font-bold text-xl">Total Engineers</h2>
                        <p class="text-4xl font-extrabold text-green-600">${engineers.length}</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow">
                        <h2 class="font-bold text-xl">Applications</h2>
                        <p class="text-4xl font-extrabold text-yellow-600">12</p> <!-- Mock data -->
                    </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-bold mb-4">Featured Engineer vs. Your Latest Job</h2>
                    ${myJobs.length > 0 && engineers.length > 0
                        ? html`<ai-cost-analysis .job=${myJobs[0]} .engineer=${engineers[0]}></ai-cost-analysis>`
                        : html`<p>Post a job to see AI analysis.</p>`
                    }
                </div>
            </div>
        `;
    }

    renderMyJobsView() {
        const myJobs = this.myJobs;
        return html`
            <div>
                <h1 class="text-3xl font-bold mb-6">My Posted Jobs</h1>
                <div class="bg-white p-6 rounded-lg shadow">
                    ${myJobs.length > 0
                        ? html`
                            <div class="space-y-4">
                                ${myJobs.map(job => html`
                                    <div class="p-4 border rounded-md flex justify-between items-center">
                                        <div>
                                            <h3 class="font-bold text-lg text-blue-700">${job.title}</h3>
                                            <p class="text-gray-600 flex items-center mt-1">
                                                <span class="[&>svg]:w-4 [&>svg]:h-4 [&>svg]:mr-2 [&>svg]:text-gray-400">${renderReactIcon(React.createElement(MapPin))}</span>
                                                ${job.location}
                                            </p>
                                        </div>
                                        <div class="text-right text-gray-500 text-sm">
                                            <p>Posted: ${formatDate(job.postedDate)}</p>
                                            <p>Starts: ${formatDate(job.startDate)}</p>
                                        </div>
                                    </div>
                                `)}
                            </div>`
                        : html`<p class="text-center text-gray-500 py-4">You have not posted any jobs yet.</p>`
                    }
                </div>
            </div>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

customElements.define('company-dashboard', CompanyDashboard);