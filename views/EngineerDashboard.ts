import { LitElement, html, css } from 'lit';
import { store, User } from '../store.ts';
import { geminiService } from '../services/geminiService.ts';
import { Skill, EngineerProfile } from '../types.ts';
import { renderReactIcon } from '../utils/react-icon-renderer.ts';
import { Loader, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

// Import required components
import '../components/DashboardSidebar.ts';
import './EngineerProfileView.ts';
import '../components/EditSkillProfileModal.ts';
import '../components/AISkillDiscovery.ts';

class EngineerDashboard extends LitElement {
    user: User | null;
    activeView: string;
    isEditModalOpen: boolean;
    isGeneratingDesc: boolean;

    static get properties() {
        return {
            user: { state: true },
            activeView: { state: true },
            isEditModalOpen: { state: true },
            isGeneratingDesc: { state: true }
        };
    }
    
    constructor() {
        super();
        this.user = store.user;
        this.activeView = 'Dashboard';
        this.isEditModalOpen = false;
        this.isGeneratingDesc = false;
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
    
    handleProfileSave = (e: CustomEvent<EngineerProfile>) => {
        store.updateUserProfile(e.detail);
        this.isEditModalOpen = false;
    };

    handleGenerateDescription = async () => {
        if (!this.user) return;
        this.isGeneratingDesc = true;
        const desc = await geminiService.generateDescriptionForProfile(this.user.profile);
        store.updateUserProfile({ description: desc });
        this.isGeneratingDesc = false;
    };

    addSkillsFromAI = (e: CustomEvent<Skill[]>) => {
        if (!this.user) return;
        const newSkills = e.detail;
        const currentProfile = this.user.profile;
        const currentSkillNames = currentProfile.skills.map(s => s.name.toLowerCase());
        const uniqueNewSkills = newSkills.filter(ns => !currentSkillNames.includes(ns.name.toLowerCase()));
        
        store.updateUserProfile({
            skills: [...currentProfile.skills, ...uniqueNewSkills]
        });
    };
    
    handleUpdateAvailability = (newDate: Date) => {
        store.updateUserProfile({ availability: newDate });
    };

    static styles = css`
        :host { display: flex; }
        main { flex-grow: 1; }
    `;

    render() {
        if (!this.user) return html`<div>Loading...</div>`;
        return html`
            <dashboard-sidebar .activeView=${this.activeView} @view-changed=${(e: CustomEvent<string>) => this.activeView = e.detail}></dashboard-sidebar>
            <main class="flex-grow p-8 bg-gray-50">
                ${this.renderActiveView()}
            </main>
            <edit-skill-profile-modal
                .isOpen=${this.isEditModalOpen}
                .userProfile=${this.user.profile}
                @close=${() => this.isEditModalOpen = false}
                @save=${this.handleProfileSave}>
            </edit-skill-profile-modal>
        `;
    }

    renderActiveView() {
        switch (this.activeView) {
            case 'Dashboard':
                return this.renderDashboardView();
            case 'My Profile':
                return html`<engineer-profile-view .profile=${this.user.profile} .isEditable=${true} @edit=${() => this.isEditModalOpen = true}></engineer-profile-view>`;
            case 'Availability':
                return this.renderAvailabilityView();
            default:
                return html`
                    <div class="bg-white p-6 rounded-lg shadow">
                        <h1 class="text-2xl font-bold">${this.activeView} - Coming Soon</h1>
                        <p class="mt-4">The functionality for "${this.activeView}" is under construction.</p>
                    </div>
                `;
        }
    }

    renderDashboardView() {
        return html`
            <div>
                <h1 class="text-3xl font-bold mb-6">Welcome back, ${this.user?.profile?.name.split(' ')[0]}!</h1>
                <ai-skill-discovery @skills-added=${this.addSkillsFromAI}></ai-skill-discovery>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-bold">Profile Summary</h2>
                    <p class="my-4 text-gray-700">${this.user?.profile?.description || ''}</p>
                    <button @click=${this.handleGenerateDescription} ?disabled=${this.isGeneratingDesc} class="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300">
                        ${this.isGeneratingDesc 
                            ? html`<span class="[&>svg]:animate-spin [&>svg]:w-5 [&>svg]:h-5 [&>svg]:mr-2">${renderReactIcon(React.createElement(Loader))}</span>`
                            : html`<span class="[&>svg]:w-5 [&>svg]:h-5 [&>svg]:mr-2">${renderReactIcon(React.createElement(Sparkles))}</span>`
                        }
                        ${this.isGeneratingDesc ? 'Generating...' : 'Generate Bio with AI'}
                    </button>
                </div>
            </div>
        `;
    }
    
    renderAvailabilityView() {
        return html`<availability-view .profile=${this.user.profile} @update-availability=${(e: CustomEvent<Date>) => this.handleUpdateAvailability(e.detail)}></availability-view>`;
    }

    createRenderRoot() {
        return this;
    }
}
customElements.define('engineer-dashboard', EngineerDashboard);

class AvailabilityView extends LitElement {
    profile: EngineerProfile;
    newDateStr: string;
    currentMonth: number;
    currentYear: number;

    static get properties() {
        return {
            profile: { attribute: false },
            newDateStr: { state: true },
            currentMonth: { state: true },
            currentYear: { state: true }
        };
    }
    
    constructor() {
        super();
        this.profile = {} as EngineerProfile;
        this.newDateStr = '';
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
    }

    connectedCallback() {
        super.connectedCallback();
        this.newDateStr = this.getInitialDateString();
    }

    getInitialDateString() {
        try {
            const date = new Date(this.profile.availability);
            if (isNaN(date.getTime())) throw new Error("Invalid date");
            return date.toISOString().split('T')[0];
        } catch (e) {
            return new Date().toISOString().split('T')[0];
        }
    }

    handleUpdate() {
        this.dispatchEvent(new CustomEvent('update-availability', { detail: new Date(this.newDateStr) }));
    }

    render() {
        const today = new Date();
        const monthDate = new Date(this.currentYear, this.currentMonth, 1);
        const monthName = monthDate.toLocaleString('default', { month: 'long' });
    
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const firstDayOfWeek = new Date(this.currentYear, this.currentMonth, 1).getDay();
    
        const blanks = Array(firstDayOfWeek).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
        
        return html`
            <h1 class="text-3xl font-bold mb-6">My Availability</h1>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-1">
                    <div class="bg-white p-6 rounded-lg shadow">
                        <h2 class="text-xl font-bold mb-4">Update Your Status</h2>
                        <p class="text-gray-600 mb-4">Companies will see you as available from this date onwards.</p>
                        <label class="block font-medium mb-1">Available from date:</label>
                        <input type="date" .value=${this.newDateStr} @change=${(e: Event) => this.newDateStr = (e.target as HTMLInputElement).value} class="w-full border p-2 rounded mb-4">
                        <button @click=${this.handleUpdate} class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Update Availability</button>
                    </div>
                </div>
                <div class="lg:col-span-2">
                    <div class="bg-white p-6 rounded-lg shadow">
                        <div class="flex justify-between items-center mb-4">
                            <button @click=${this.prevMonth} class="p-2 rounded-full hover:bg-gray-100">${renderReactIcon(React.createElement(ChevronLeft))}</button>
                            <h2 class="text-xl font-bold">${monthName} ${this.currentYear}</h2>
                            <button @click=${this.nextMonth} class="p-2 rounded-full hover:bg-gray-100">${renderReactIcon(React.createElement(ChevronRight))}</button>
                        </div>
                        <div class="grid grid-cols-7 gap-2 text-center font-semibold text-gray-500">
                            ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => html`<div>${day}</div>`)}
                        </div>
                        <div class="grid grid-cols-7 gap-2 mt-2">
                            ${[...blanks, ...days].map((day) => {
                                if (!day) return html`<div class="w-10 h-10"></div>`;
                                const dayDate = new Date(this.currentYear, this.currentMonth, day);
                                const availabilityDate = new Date(this.profile.availability);
                                const isToday = isSameDay(dayDate, today);
                                const isAvailable = availabilityDate && !isNaN(availabilityDate.getTime()) ? isSameDay(dayDate, availabilityDate) : false;
                                return html`
                                    <div class="w-10 h-10 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-500 text-white' : ''} ${isAvailable ? 'ring-2 ring-green-500' : ''} ${day ? 'hover:bg-gray-100' : ''}">
                                        ${day}
                                    </div>
                                `;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    prevMonth() {
        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else {
            this.currentMonth--;
        }
    }

    nextMonth() {
        if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else {
            this.currentMonth++;
        }
    }

    createRenderRoot() {
        return this;
    }
}
customElements.define('availability-view', AvailabilityView);