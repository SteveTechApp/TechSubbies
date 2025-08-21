import { LitElement, html } from 'lit';
import { geminiService } from '../services/geminiService.ts';
import { BrainCircuit, Loader, Plus } from 'lucide-react';
import React from 'react';
import { Skill } from '../types.ts';
import { renderReactIcon } from '../utils/react-icon-renderer.ts';

class AISkillDiscovery extends LitElement {
    _role: string;
    isLoading: boolean;
    discoveredSkills: Skill[] | null;
    error: string;

    static get properties() {
        return {
            _role: { state: true },
            isLoading: { state: true },
            discoveredSkills: { state: true },
            error: { state: true }
        };
    }

    constructor() {
        super();
        this._role = '';
        this.isLoading = false;
        this.discoveredSkills = null;
        this.error = '';
    }

    async handleDiscover() {
        if (!this._role.trim()) {
            this.error = 'Please enter a role or job title.';
            return;
        }
        this.isLoading = true;
        this.error = '';
        this.discoveredSkills = null;
        const result = await geminiService.generateSkillsForRole(this._role);
        this.isLoading = false;
        if (result && result.skills) {
            this.discoveredSkills = result.skills;
        } else {
            this.error = 'Could not discover skills for this role. Please try another.';
        }
    }

    handleAddSkills() {
        if (this.discoveredSkills) {
            this.dispatchEvent(new CustomEvent('skills-added', { detail: this.discoveredSkills }));
        }
        this.discoveredSkills = null;
        this._role = '';
    }

    render() {
        return html`
            <div class="bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-6 my-6">
                <div class="flex items-center mb-3">
                    <span class="[&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-blue-600 [&>svg]:mr-3">${renderReactIcon(React.createElement(BrainCircuit))}</span>
                    <h3 class="text-xl font-bold text-blue-800">AI Skill Discovery</h3>
                </div>
                <p class="text-gray-600 mb-4">Don't want to add skills manually? Enter a job title (e.g., "AV Programmer") and let our AI suggest relevant skills for you.</p>
                <div class="flex items-center space-x-2">
                    <input
                        type="text"
                        .value=${this._role}
                        @input=${(e: Event) => this._role = (e.target as HTMLInputElement).value}
                        placeholder="e.g., Senior Network Engineer"
                        class="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500">
                    <button
                        @click=${this.handleDiscover}
                        ?disabled=${this.isLoading}
                        class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center">
                        ${this.isLoading ? renderReactIcon(React.createElement(Loader, { className: 'animate-spin w-5 h-5' })) : 'Discover'}
                    </button>
                </div>
                ${this.error ? html`<p class="text-red-500 mt-2">${this.error}</p>` : ''}
                ${this.discoveredSkills ? html`
                    <div class="mt-4 animate-fade-in-up">
                        <h4 class="font-bold">Suggested Skills:</h4>
                        <div class="flex flex-wrap gap-2 my-2">
                            ${this.discoveredSkills.map(skill => html`
                                <span class="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    ${skill.name} (Rated: ${skill.rating}/5)
                                </span>
                            `)}
                        </div>
                        <button @click=${this.handleAddSkills} class="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 flex items-center">
                            <span class="[&>svg]:w-5 [&>svg]:h-5 [&>svg]:mr-1">${renderReactIcon(React.createElement(Plus))}</span>
                            Add to My Profile
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    createRenderRoot() {
        return this;
    }
}
customElements.define('ai-skill-discovery', AISkillDiscovery);