import { LitElement, html } from 'lit';
import { store, User } from '../store.ts';
import { renderReactIcon } from '../utils/react-icon-renderer.ts';
import { LogOut, LogIn } from 'lucide-react';
import React from 'react';

// Import dependent components to ensure they are registered
import './Logo.ts';
import './HowItWorksModal.ts';
import '../views/LoginSelector.ts';

class Header extends LitElement {
    user: User | null;
    isHowItWorksOpen: boolean;
    isLoginSelectorOpen: boolean;

    static get properties() {
        return {
            user: { attribute: false },
            isHowItWorksOpen: { state: true },
            isLoginSelectorOpen: { state: true }
        };
    }

    constructor() {
        super();
        this.user = store.user;
        this.isHowItWorksOpen = false;
        this.isLoginSelectorOpen = false;
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
    }

    render() {
        return html`
            <header class="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
                <logo-element class="text-gray-800"></logo-element>
                <nav>
                    ${this.user ? this.renderUserMenu() : this.renderGuestMenu()}
                </nav>
            </header>
            <how-it-works-modal .isOpen=${this.isHowItWorksOpen} @close=${() => this.isHowItWorksOpen = false}></how-it-works-modal>
            ${!this.user ? html`<login-selector .isOpen=${this.isLoginSelectorOpen} @close=${() => this.isLoginSelectorOpen = false}></login-selector>` : ''}
        `;
    }

    renderUserMenu() {
        return html`
            <div class="flex items-center space-x-4">
                <span class="text-gray-700 hidden sm:block">Welcome, ${this.user?.profile?.name}</span>
                <img src=${this.user?.profile?.avatar} alt="User Avatar" class="w-10 h-10 rounded-full border-2 border-blue-500" />
                <button @click=${() => store.logout()} class="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                    <span class="[&>svg]:w-4 [&>svg]:h-4 [&>svg]:mr-2">${renderReactIcon(React.createElement(LogOut))}</span>
                    Logout
                </button>
            </div>
        `;
    }

    renderGuestMenu() {
        return html`
            <div class="flex items-center space-x-2">
                <button @click=${() => this.isHowItWorksOpen = true} class="px-4 py-2 text-gray-700 hover:text-blue-600">
                    How It Works
                </button>
                <a href="#investors" class="px-4 py-2 text-gray-700 hover:text-blue-600">
                    For Investors
                </a>
                <button @click=${() => this.isLoginSelectorOpen = true} class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    <span class="[&>svg]:w-4 [&>svg]:h-4 [&>svg]:mr-2">${renderReactIcon(React.createElement(LogIn))}</span>
                    Login / Sign Up
                </button>
            </div>
        `;
    }

    createRenderRoot() {
        return this; // Use light DOM to inherit global styles
    }
}

customElements.define('header-element', Header);