import { LitElement, html, css } from 'lit';
import '../components/DashboardSidebar.ts';

class AdminDashboard extends LitElement {
    activeView: string;

    static get properties() {
        return {
            activeView: { state: true }
        };
    }

    constructor() {
        super();
        this.activeView = 'Dashboard';
    }
    
    static styles = css`
        :host { display: flex; }
        main { flex-grow: 1; }
    `;

    render() {
        return html`
            <dashboard-sidebar .activeView=${this.activeView} @view-changed=${(e: CustomEvent<string>) => this.activeView = e.detail}></dashboard-sidebar>
            <main class="flex-grow p-8 bg-gray-50">
                <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-bold">${this.activeView}</h2>
                    <p class="mt-4">This feature is currently under development. Please check back later!</p>
                </div>
            </main>
        `;
    }
    
    createRenderRoot() {
        return this;
    }
}

customElements.define('admin-dashboard', AdminDashboard);