import { LitElement, html } from 'lit';
import { Currency } from '../types.ts';
import { geminiService } from '../services/geminiService.ts';
import { X, Lightbulb } from 'lucide-react';
import React from 'react';
import { renderReactIcon } from '../utils/react-icon-renderer.ts';

interface SuggestedTeamMember {
    role: string;
    skills: string[];
}

interface JobDetails {
    title: string;
    description: string;
    location: string;
    dayRate: string;
    duration: string;
    currency: Currency;
    startDate: string;
}

class JobPostModal extends LitElement {
    isOpen: boolean;
    jobDetails: JobDetails;
    suggestedTeam: SuggestedTeamMember[] | null;
    isSuggesting: boolean;

    static get properties() {
        return {
            isOpen: { type: Boolean },
            jobDetails: { state: true },
            suggestedTeam: { state: true },
            isSuggesting: { state: true }
        };
    }

    constructor() {
        super();
        this.isOpen = false;
        this.jobDetails = {
            title: '', description: '', location: '', dayRate: '500', duration: '4 weeks', currency: Currency.GBP, startDate: ''
        };
        this.suggestedTeam = null;
        this.isSuggesting = false;
    }

    _onClose = () => this.dispatchEvent(new CustomEvent('close'));
    _onPostJob = () => this.dispatchEvent(new CustomEvent('post-job', { detail: this.jobDetails }));

    handleChange(e: Event) {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        this.jobDetails = { ...this.jobDetails, [name]: value };
    }

    async handleSuggestTeam() {
        if (!this.jobDetails.description) return;
        this.isSuggesting = true;
        const result = await geminiService.suggestTeamForProject(this.jobDetails.description);
        this.suggestedTeam = result?.team || null;
        this.isSuggesting = false;
    }

    render() {
        if (!this.isOpen) return html``;

        return html`
            <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                <div class="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold">Post a New Job</h2>
                        <button @click=${this._onClose}>${renderReactIcon(React.createElement(X, { className: 'text-gray-500' }))}</button>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Job Title</label>
                            <input name="title" placeholder="e.g., Lead AV Engineer" @input=${this.handleChange} class="w-full border p-2 rounded">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Job Description</label>
                            <textarea name="description" placeholder="Describe the project, responsibilities, and required skills..." @input=${this.handleChange} rows="6" class="w-full border p-2 rounded"></textarea>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Location</label>
                                <input name="location" placeholder="e.g., London, UK" @input=${this.handleChange} class="w-full border p-2 rounded">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Duration</label>
                                <input name="duration" placeholder="e.g., 6 weeks" @input=${this.handleChange} class="w-full border p-2 rounded">
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Currency</label>
                                <select name="currency" @change=${this.handleChange} class="w-full border p-2 rounded bg-white h-[42px]">
                                    <option value=${Currency.GBP}>GBP (£)</option>
                                    <option value=${Currency.USD}>USD ($)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Day Rate</label>
                                <input type="number" name="dayRate" placeholder="e.g., 550" @input=${this.handleChange} class="w-full border p-2 rounded">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Start Date</label>
                                <input type="date" name="startDate" .value=${this.jobDetails.startDate} @input=${this.handleChange} class="w-full border p-2 rounded h-[42px]">
                            </div>
                        </div>
                        <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
                            <h3 class="font-bold text-blue-800 mb-2 flex items-center">${renderReactIcon(React.createElement(Lightbulb, { className: 'w-5 h-5 mr-2' }))} AI Team Suggestion</h3>
                            <p class="text-sm text-gray-600 mb-3">Based on your job description, let AI suggest the roles you might need to hire.</p>
                            <button @click=${this.handleSuggestTeam} ?disabled=${this.isSuggesting || !this.jobDetails.description} class="px-4 py-2 text-sm bg-blue-600 text-white rounded disabled:bg-blue-300">
                                ${this.isSuggesting ? 'Thinking...' : 'Suggest Roles'}
                            </button>
                            ${this.suggestedTeam ? html`
                                <div class="mt-4">
                                    <h4 class="font-semibold">Suggested Team Structure:</h4>
                                    <ul class="list-disc pl-5 mt-2">
                                        ${this.suggestedTeam.map(member => html`
                                            <li><strong>${member.role}:</strong> ${member.skills.join(', ')}</li>
                                        `)}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="flex justify-end space-x-4 mt-6">
                        <button @click=${this._onClose} class="px-6 py-2 bg-gray-200 rounded">Cancel</button>
                        <button @click=${this._onPostJob} class="px-6 py-2 bg-blue-600 text-white rounded">Post Job</button>
                    </div>
                </div>
            </div>
        `;
    }

    createRenderRoot() {
        return this;
    }
}
customElements.define('job-post-modal', JobPostModal);