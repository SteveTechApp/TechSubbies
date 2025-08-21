import { LitElement, html, css } from 'lit';
import { X, Trash2, Plus } from 'lucide-react';
import React from 'react';
import { EngineerProfile } from '../types.ts';
import { renderReactIcon } from '../utils/react-icon-renderer.ts';

class EditSkillProfileModal extends LitElement {
    isOpen: boolean;
    userProfile: EngineerProfile;
    editedProfile: EngineerProfile;

    static get properties() {
        return {
            isOpen: { type: Boolean },
            userProfile: { attribute: false },
            editedProfile: { state: true }
        };
    }

    constructor() {
        super();
        this.isOpen = false;
        this.userProfile = {} as EngineerProfile;
        this.editedProfile = {} as EngineerProfile;
    }

    willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
        if (changedProperties.has('userProfile')) {
            this.editedProfile = JSON.parse(JSON.stringify(this.userProfile));
        }
    }

    _onClose = () => this.dispatchEvent(new CustomEvent('close'));
    _onSave = () => this.dispatchEvent(new CustomEvent('save', { detail: this.editedProfile }));

    handleInputChange(e: Event) {
        const { name, value } = e.target as HTMLInputElement;
        this.editedProfile = { ...this.editedProfile, [name]: value };
    }

    handleSkillChange(index: number, field: string, value: string | number) {
        const newSkills = [...this.editedProfile.skills];
        newSkills[index] = { ...newSkills[index], [field]: value };
        this.editedProfile = { ...this.editedProfile, skills: newSkills };
    }

    addSkill() {
        this.editedProfile = {
            ...this.editedProfile,
            skills: [...this.editedProfile.skills, { name: '', rating: 3 }]
        };
    }

    removeSkill(index: number) {
        this.editedProfile = {
            ...this.editedProfile,
            skills: this.editedProfile.skills.filter((_, i) => i !== index)
        };
    }
    
    render() {
        if (!this.isOpen || !this.editedProfile) return html``;

        return html`
            <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div class="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold">Edit Profile</h2>
                        <button @click=${this._onClose}>${renderReactIcon(React.createElement(X, { className: 'text-gray-500' }))}</button>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label class="block font-medium mb-1">Full Name</label>
                            <input type="text" name="name" .value=${this.editedProfile.name || ''} @input=${this.handleInputChange} class="w-full border p-2 rounded">
                        </div>
                        <div>
                            <label class="block font-medium mb-1">Tagline / Role</label>
                            <input type="text" name="tagline" .value=${this.editedProfile.tagline || ''} @input=${this.handleInputChange} class="w-full border p-2 rounded">
                        </div>
                        <div>
                            <label class="block font-medium mb-1">Bio / Description</label>
                            <textarea name="description" .value=${this.editedProfile.description || ''} @input=${this.handleInputChange} rows="4" class="w-full border p-2 rounded"></textarea>
                        </div>
                        <h3 class="text-xl font-bold pt-4 border-t">Skills</h3>
                        ${this.editedProfile.skills?.map((skill, index) => html`
                            <div class="flex items-center space-x-2">
                                <input type="text" placeholder="Skill Name" .value=${skill.name} @input=${(e: Event) => this.handleSkillChange(index, 'name', (e.target as HTMLInputElement).value)} class="w-full border p-2 rounded">
                                <input type="range" min="1" max="5" .value=${String(skill.rating)} @input=${(e: Event) => this.handleSkillChange(index, 'rating', parseInt((e.target as HTMLInputElement).value))} class="w-32">
                                <span class="w-8 text-center">${skill.rating}</span>
                                <button @click=${() => this.removeSkill(index)} class="text-red-500">${renderReactIcon(React.createElement(Trash2, { size: 18 }))}</button>
                            </div>
                        `)}
                        <button @click=${this.addSkill} class="flex items-center text-blue-600">
                            ${renderReactIcon(React.createElement(Plus, { size: 18, className: 'mr-1' }))} Add Skill
                        </button>
                        <div class="flex justify-end space-x-4 pt-6">
                            <button @click=${this._onClose} class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                            <button @click=${this._onSave} class="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

customElements.define('edit-skill-profile-modal', EditSkillProfileModal);