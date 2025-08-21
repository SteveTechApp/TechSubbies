import { LitElement, html } from 'lit';
import { EngineerProfile } from '../types.ts';
import { CURRENCY_ICONS } from '../constants.ts';
import { renderReactIcon } from '../utils/react-icon-renderer.ts';
import { MapPin, Edit, BarChart, CheckCircle, Award, ShieldCheck, Mail, Phone, Globe, Linkedin } from 'lucide-react';
import React from 'react';

class EngineerProfileView extends LitElement {
    profile: EngineerProfile | null;
    isEditable: boolean;

    static get properties() {
        return {
            profile: { attribute: false },
            isEditable: { type: Boolean }
        };
    }

    constructor() {
        super();
        this.profile = null;
        this.isEditable = false;
    }

    _onEdit = () => {
        this.dispatchEvent(new CustomEvent('edit'));
    }

    render() {
        if (!this.profile) return html`<div>Loading profile...</div>`;

        const { currency, dayRate, experience, skills, certifications, contact } = this.profile;
        const CurrencyIcon = CURRENCY_ICONS[currency];

        return html`
            <div class="bg-white p-8 rounded-lg shadow-lg relative">
                ${this.renderProfileHeader()}
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
                    ${this.renderStatCard(CurrencyIcon, 'Day Rate', `${currency}${dayRate}`)}
                    ${this.renderStatCard(BarChart, 'Experience', `${experience} Years`)}
                    ${this.renderStatCard(CheckCircle, 'Skills', skills.length)}
                    ${this.renderStatCard(Award, 'Certs', certifications.length)}
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="md:col-span-2">
                        <h3 class="text-2xl font-bold mb-4 border-b pb-2">About Me</h3>
                        <p class="text-gray-700 whitespace-pre-line">${this.profile.description || ''}</p>
                        <h3 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">Skills</h3>
                        <div class="flex flex-wrap gap-4">
                            ${skills.map(skill => html`
                                <div class="bg-blue-100 text-blue-800 px-4 py-2 rounded-md">
                                    <span class="font-semibold">${skill.name}</span>
                                    <div class="w-full bg-blue-200 rounded-full h-2.5 mt-1">
                                        <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${skill.rating * 20}%"></div>
                                    </div>
                                </div>
                            `)}
                        </div>
                    </div>
                    <div class="md:col-span-1">
                        <h3 class="text-2xl font-bold mb-4 border-b pb-2">Certifications</h3>
                        <ul class="space-y-3">
                            ${certifications.map(cert => html`
                                <li class="flex items-center">
                                    <span class="${cert.verified ? 'text-green-500' : 'text-gray-400'}">
                                      ${renderReactIcon(React.createElement(ShieldCheck, { size: 20, 'aria-label': cert.verified ? 'Verified' : 'Not Verified' }))}
                                    </span>
                                    <span class="ml-2">${cert.name}</span>
                                </li>
                            `)}
                        </ul>
                        <h3 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">Contact</h3>
                        <ul class="space-y-3">
                            <li class="flex items-center">${renderReactIcon(React.createElement(Mail, { size: 16, className: 'mr-2' }))} <a href="mailto:${contact.email}" class="text-blue-600 hover:underline">${contact.email}</a></li>
                            <li class="flex items-center">${renderReactIcon(React.createElement(Phone, { size: 16, className: 'mr-2' }))} ${contact.phone}</li>
                            <li class="flex items-center">${renderReactIcon(React.createElement(Globe, { size: 16, className: 'mr-2' }))} <a href=${contact.website} target="_blank" class="text-blue-600 hover:underline">Website</a></li>
                            <li class="flex items-center">${renderReactIcon(React.createElement(Linkedin, { size: 16, className: 'mr-2' }))} <a href=${contact.linkedin} target="_blank" class="text-blue-600 hover:underline">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    renderProfileHeader() {
        if (!this.profile) return '';
        return html`
            <div class="md:flex items-center">
                <img src=${this.profile.avatar} alt=${this.profile.name} class="w-32 h-32 rounded-full mx-auto md:mx-0 md:mr-8 border-4 border-blue-500">
                <div class="text-center md:text-left mt-4 md:mt-0">
                    <h1 class="text-4xl font-bold">${this.profile.name}</h1>
                    <h2 class="text-xl text-blue-600 font-semibold">${this.profile.tagline}</h2>
                    <div class="flex items-center justify-center md:justify-start text-gray-500 mt-2">
                        ${renderReactIcon(React.createElement(MapPin, { size: 16, className: 'mr-2' }))} ${this.profile.location}
                    </div>
                </div>
                ${this.isEditable ? html`
                    <button @click=${this._onEdit} class="absolute top-6 right-6 flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        ${renderReactIcon(React.createElement(Edit, { size: 16, className: 'mr-2' }))} Edit Profile
                    </button>
                ` : ''}
            </div>
        `;
    }

    renderStatCard(Icon: any, label: string, value: string | number) {
        return html`
            <div class="bg-gray-100 p-4 rounded-lg text-center">
                <span class="[&>svg]:w-8 [&>svg]:h-8 [&>svg]:mx-auto [&>svg]:text-blue-500 [&>svg]:mb-2">${renderReactIcon(React.createElement(Icon))}</span>
                <p class="font-semibold text-lg">${value}</p>
                <p class="text-sm text-gray-600">${label}</p>
            </div>
        `;
    }
    
    createRenderRoot() {
        return this;
    }
}
customElements.define('engineer-profile-view', EngineerProfileView);