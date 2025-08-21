import { LitElement, html, css } from 'lit';
import { store, User } from './store.ts';
import { Role } from './types.ts';

// Import all view components to register them
import './components/Header.ts';
import './components/Footer.ts';
import './views/LandingPage.ts';
import './views/EngineerDashboard.ts';
import './views/CompanyDashboard.ts';
import './views/ResourcingDashboard.ts';
import './views/AdminDashboard.ts';

class App extends LitElement {
    user: User | null;
    
    static get properties() {
        return {
            user: { state: true }
        };
    }

    constructor() {
        super();
        this.user = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.user = store.user;
        store.subscribe(this._updateUser);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        store.unsubscribe(this._updateUser);
    }

    _updateUser = (user: User | null) => {
        this.user = user;
    };

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        .flex-grow {
            flex-grow: 1;
        }
    `;

    render() {
        if (!this.user) {
            return html`
                <div class="flex flex-col min-h-screen">
                    <header-element></header-element>
                    <main class="flex-grow">
                        <landing-page></landing-page>
                    </main>
                    <footer-element></footer-element>
                </div>
            `;
        }

        return html`
            <div class="flex flex-col min-h-screen bg-gray-50">
                <header-element .user=${this.user}></header-element>
                <main class="flex-grow">${this.renderDashboard()}</main>
            </div>
        `;
    }

    renderDashboard() {
        switch (this.user?.role) {
            case Role.ENGINEER:
                return html`<engineer-dashboard></engineer-dashboard>`;
            case Role.COMPANY:
                return html`<company-dashboard></company-dashboard>`;
            case Role.RESOURCING_COMPANY:
                return html`<resourcing-dashboard></resourcing-dashboard>`;
            case Role.ADMIN:
                return html`<admin-dashboard></admin-dashboard>`;
            default:
                 return html`
                    <main class="flex-grow">
                        <landing-page></landing-page>
                    </main>
                    <footer-element></footer-element>
                 `;
        }
    }
}

customElements.define('app-shell', App);