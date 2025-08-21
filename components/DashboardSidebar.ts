import { LitElement, html } from 'lit';
import { store } from '../store.ts';
import { Role } from '../types.ts';
import { renderReactIcon } from '../utils/react-icon-renderer.ts';
import { LayoutDashboard, User, CalendarDays, Search, Settings, PlusCircle, Briefcase, Users, Building, BarChart2, SlidersHorizontal, type LucideIcon } from 'lucide-react';
import React from 'react';

class DashboardSidebar extends LitElement {
    activeView: string;

    static get properties() {
        return {
            activeView: { type: String }
        };
    }

    constructor() {
        super();
        this.activeView = '';
    }

    _setActiveView(view: string) {
        this.dispatchEvent(new CustomEvent('view-changed', { detail: view }));
    }

    getLinksForRole(role: Role) {
        switch (role) {
            case Role.ENGINEER:
                return [
                    { label: 'Dashboard', icon: LayoutDashboard }, { label: 'My Profile', icon: User }, { label: 'Availability', icon: CalendarDays }, { label: 'Job Search', icon: Search }, { label: 'Settings', icon: Settings },
                ];
            case Role.COMPANY:
                return [
                    { label: 'Dashboard', icon: LayoutDashboard }, { label: 'Post a Job', icon: PlusCircle }, { label: 'Find Talent', icon: Search }, { label: 'My Jobs', icon: Briefcase }, { label: 'Settings', icon: Settings },
                ];
            case Role.RESOURCING_COMPANY:
                return [
                    { label: 'Dashboard', icon: LayoutDashboard }, { label: 'Manage Engineers', icon: Users }, { label: 'Find Jobs', icon: Search }, { label: 'Company Profile', icon: Building }, { label: 'Settings', icon: Settings },
                ];
            case Role.ADMIN:
                return [
                    { label: 'Dashboard', icon: BarChart2 }, { label: 'Manage Users', icon: Users }, { label: 'Manage Jobs', icon: Briefcase }, { label: 'Platform Settings', icon: SlidersHorizontal },
                ];
            default:
                return [];
        }
    }

    render() {
        const { user } = store;
        if (!user) return html``;

        const links = this.getLinksForRole(user.role);

        return html`
            <aside class="w-64 bg-gray-100 p-4 border-r border-gray-200 flex flex-col">
                <div class="flex-grow">
                    <nav>
                        <ul>
                            ${links.map(link => this.renderNavLink(link))}
                        </ul>
                    </nav>
                </div>
            </aside>
        `;
    }

    renderNavLink({ label, icon }: { label: string, icon: LucideIcon }) {
        const isActive = this.activeView === label;
        return html`
            <li>
                <button @click=${() => this._setActiveView(label)} class="w-full flex items-center p-3 my-1 text-left rounded-md transition-colors ${isActive ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'}">
                    <span class="[&>svg]:w-5 [&>svg]:h-5 [&>svg]:mr-3">${renderReactIcon(React.createElement(icon))}</span>
                    <span class="font-medium">${label}</span>
                </button>
            </li>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

customElements.define('dashboard-sidebar', DashboardSidebar);