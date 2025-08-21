import { LitElement, html } from 'lit';
import { store } from '../store.ts';
import { MOCK_COMPANIES } from '../services/mockDataGenerator.ts';
import { Users, Building, ClipboardList, DollarSign, Calendar, Handshake } from 'lucide-react';
import React from 'react';
import { renderReactIcon } from '../utils/react-icon-renderer.ts';
import './InvestorPage.ts';

class LandingPage extends LitElement {
    
    renderStatCard(icon, value, label) {
        return html`
            <div class="bg-white p-6 rounded-lg shadow-lg flex items-center">
                <span class="[&>svg]:w-12 [&>svg]:h-12 [&>svg]:text-blue-500 [&>svg]:mr-4">${renderReactIcon(React.createElement(icon))}</span>
                <div>
                    <p class="text-3xl font-bold text-gray-800">${value}</p>
                    <p class="text-gray-500">${label}</p>
                </div>
            </div>
        `;
    }

    renderFeatureCard(icon, title, description) {
        return html`
            <div class="bg-white p-6 rounded-lg border border-gray-200">
                <div class="flex items-center mb-3">
                    <span class="[&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-blue-500 [&>svg]:mr-3">${renderReactIcon(React.createElement(icon))}</span>
                    <h3 class="text-xl font-bold">${title}</h3>
                </div>
                <p class="text-gray-600">${description}</p>
            </div>
        `;
    }

    render() {
        const { engineers, jobs } = store;

        return html`
            <main class="bg-gray-50">
                <!-- Hero Section -->
                <section class="text-center py-20 px-4 bg-white">
                    <h1 class="text-5xl font-extrabold text-gray-800 mb-4">Find Your Next Tech Subcontractor. Instantly.</h1>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">The free-to-use platform for companies to find and hire expert freelance engineers with verified availability. No placement fees. No hassle.</p>
                    <div class="flex justify-center space-x-4">
                        <button class="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Post a Job for FREE</button>
                        <button class="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition">Find Talent</button>
                    </div>
                </section>

                <!-- Stats Section -->
                <section class="py-16">
                    <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                        ${this.renderStatCard(Users, `${engineers.length}+`, 'Vetted Engineers')}
                        ${this.renderStatCard(Building, `${MOCK_COMPANIES.length}+`, 'Active Companies')}
                        ${this.renderStatCard(ClipboardList, `${jobs.length}+`, 'Jobs Posted')}
                    </div>
                </section>

                <!-- Features Section -->
                <section class="py-16 bg-white">
                    <div class="container mx-auto px-4">
                        <h2 class="text-4xl font-bold text-center mb-12">Why TechSubbies is Different</h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            ${this.renderFeatureCard(DollarSign, 'Zero Cost for Companies', 'It is completely free for companies to post jobs and find engineers. We believe in removing barriers to connect talent with opportunity.')}
                            ${this.renderFeatureCard(Calendar, 'Real-Time Availability', 'Our integrated calendar system means you only see engineers who are actually available for your project dates, saving you time.')}
                            ${this.renderFeatureCard(Handshake, 'Direct Engagement', 'Communicate and negotiate directly with engineers. We facilitate the connection and get out of your way. No middleman fees.')}
                        </div>
                    </div>
                </section>

                <investor-page></investor-page>
            </main>
        `;
    }

    createRenderRoot() {
        return this; // Use light DOM
    }
}

customElements.define('landing-page', LandingPage);
