import { LitElement, html } from 'lit';
import { store } from '../store.ts';
import { Role } from '../types.ts';
import { User, Building, Users, UserCog, type LucideIcon } from 'lucide-react';
import React from 'react';
import { renderReactIcon } from '../utils/react-icon-renderer.ts';
import '../components/Logo.ts';

class LoginSelector extends LitElement {
    isOpen: boolean;

    static get properties() {
        return {
            isOpen: { type: Boolean }
        };
    }

    constructor() {
        super();
        this.isOpen = false;
    }

    _onClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    _handleLogin(role: Role) {
        store.login(role);
        this._onClose();
    }

    render() {
        if (!this.isOpen) return html``;

        return html`
            <div @click=${this._onClose} class="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50 p-4">
                <div @click=${(e: Event) => e.stopPropagation()} class="w-full max-w-4xl">
                    <div class="text-center mb-12">
                        <logo-element class="text-4xl justify-center mb-4 text-white"></logo-element>
                        <h1 class="text-3xl font-bold text-white">Explore the TechSubbies Demo</h1>
                        <p class="text-lg text-gray-300 mt-2">Please select a role to see the platform features.</p>
                    </div>
                    <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                        ${this.renderLoginButton(Role.ENGINEER, 'Engineer', User, 'Manage your profile, set your availability, and find your next contract.')}
                        ${this.renderLoginButton(Role.COMPANY, 'Company', Building, 'Post jobs for free, search for expert talent, and build your project teams.')}
                        ${this.renderLoginButton(Role.RESOURCING_COMPANY, 'Resourcing Company', Users, 'Manage multiple engineer profiles and streamline your subcontractor placements.')}
                        ${this.renderLoginButton(Role.ADMIN, 'Platform Admin', UserCog, 'Oversee platform activity, manage users and jobs, and view analytics.')}
                    </div>
                </div>
            </div>
        `;
    }

    renderLoginButton(role: Role, label: string, icon: LucideIcon, description: string) {
        return html`
            <button @click=${() => this._handleLogin(role)} class="fade-in-up text-left w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
                <div class="flex items-center mb-3">
                    <span class="[&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-blue-500 [&>svg]:mr-4">${renderReactIcon(React.createElement(icon))}</span>
                    <h2 class="text-2xl font-bold text-gray-800">${label}</h2>
                </div>
                <p class="text-gray-600">${description}</p>
            </button>
        `;
    }

    createRenderRoot() {
        return this;
    }
}
customElements.define('login-selector', LoginSelector);