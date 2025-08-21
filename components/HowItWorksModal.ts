import { LitElement, html, css } from 'lit';
import { X, PenSquare, Search, Handshake, UserCog, CalendarDays, Briefcase } from 'lucide-react';
import React from 'react';
import { renderReactIcon } from '../utils/react-icon-renderer.ts';

class HowItWorksModal extends LitElement {
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

    static styles = css`
        :host([isOpen]) .modal-content {
             transform: scale(1);
        }
        .modal-content {
            transform: scale(0.95);
            transition: transform 0.2s ease-out;
        }
    `;

    render() {
        if (!this.isOpen) return html``;

        return html`
            <div @click=${this._onClose} class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                <div @click=${(e: Event) => e.stopPropagation()} class="modal-content bg-white rounded-lg p-8 m-4 max-w-4xl w-full relative">
                    <button @click=${this._onClose} class="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                        ${renderReactIcon(React.createElement(X, { size: 24 }))}
                    </button>
                    <h2 class="text-3xl font-bold text-center mb-2">How TechSubbies Works</h2>
                    <p class="text-center text-gray-500 mb-8">A streamlined process for companies and engineers.</p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="border-r-0 md:border-r pr-8">
                            <h3 class="text-2xl font-semibold text-center text-blue-600 mb-6">For Companies</h3>
                            <div class="space-y-6">
                                ${this.renderStep(PenSquare, '1. Post a Job (Free)', 'Describe your project and the skills you need. It takes minutes and costs nothing.')}
                                ${this.renderStep(Search, '2. Find Talent Instantly', 'Search our database of vetted engineers. Filter by skills, availability, and day rate.')}
                                ${this.renderStep(Handshake, '3. Engage Directly', 'Connect with the right talent. No middlemen, no placement fees.')}
                            </div>
                        </div>
                        <div>
                            <h3 class="text-2xl font-semibold text-center text-green-600 mb-6">For Engineers</h3>
                            <div class="space-y-6">
                                ${this.renderStep(UserCog, '1. Create Your Profile', 'Showcase your skills, experience, and certifications to stand out.')}
                                ${this.renderStep(CalendarDays, '2. Set Your Availability', 'Keep your calendar up-to-date so companies know when you\'re ready for new projects.')}
                                ${this.renderStep(Briefcase, '3. Get Hired', 'Companies apply to you. Receive offers directly and manage your contracts.')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderStep(icon: any, title: string, description: string) {
        return html`
            <div class="flex flex-col items-center text-center">
                <div class="bg-blue-100 text-blue-600 rounded-full p-4 mb-3">
                    ${renderReactIcon(React.createElement(icon, { size: 32 }))}
                </div>
                <h3 class="font-bold text-lg mb-1">${title}</h3>
                <p class="text-gray-600">${description}</p>
            </div>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

customElements.define('how-it-works-modal', HowItWorksModal);