import { LitElement, html } from 'lit';
import { Zap, Layers, TrendingUp, BrainCircuit, Rocket } from 'lucide-react';
import React from 'react';
import { renderReactIcon } from '../utils/react-icon-renderer.ts';

class InvestorPage extends LitElement {
    
    render() {
        return html`
            <section id="investors" class="py-20 bg-gray-100">
                <div class="container mx-auto px-4">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl font-extrabold text-gray-800">An Investment in the Future of Work</h2>
                        <p class="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">TechSubbies.com is poised to become the essential infrastructure for the freelance technical economy. Discover why we're a high-growth opportunity.</p>
                    </div>

                    <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-16">
                        <h3 class="text-2xl font-bold mb-4 text-center">Executive Summary</h3>
                        <p class="text-gray-700 text-center">In today's fast-paced digital economy, project managers waste countless hours searching for specialized tech talent and vetting availability. TechSubbies.com solves this by providing instant access to a curated network of qualified freelance tech engineers with real-time availability, dramatically reducing hiring time from weeks to days.</p>
                    </div>

                    <div class="mb-16">
                        <h3 class="text-3xl font-bold text-center mb-10">Investment Highlights</h3>
                        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            ${this.renderHighlightCard(Zap, 'Disruptive Business Model', 'Free access for companies drives massive adoption and network effects, creating a deep pool of opportunities for our paying engineer user base.')}
                            ${this.renderHighlightCard(Layers, 'Multiple Revenue Streams', 'Revenue is generated through a high-volume, low-cost subscription model for talent, supplemented by high-margin, value-added services.')}
                            ${this.renderHighlightCard(TrendingUp, 'High-Demand Market', 'The global gig economy and the increasing reliance on a flexible, specialized tech workforce are fueling massive market growth.')}
                            ${this.renderHighlightCard(BrainCircuit, 'Technology Differentiation', 'Advanced search filters, AI-powered team building, and real-time availability tracking set our platform apart.')}
                            ${this.renderHighlightCard(Rocket, 'First-Mover Advantage', 'We are targeting a high-value vertical with a purpose-built solution designed for the unique needs of the technical contracting industry.')}
                        </div>
                    </div>

                    <div class="mb-16 bg-blue-50 py-12 rounded-lg">
                        <h3 class="text-3xl font-bold text-center mb-10">Our Modern Revenue Model</h3>
                        <div class="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 px-4">
                            ${this.renderRevenueCard('1', 'Subscriptions', 'A low-cost monthly subscription for engineers and resourcing companies unlocks premium features, encouraging a large, active user base.')}
                            ${this.renderRevenueCard('2', '"Boost Profile" Credits', 'A pay-per-use feature allowing engineers to purchase credits that temporarily place their profile at the top of relevant search results.')}
                            ${this.renderRevenueCard('3', 'Targeted Advertising', 'Premium advertising slots for industry-specific manufacturers and training companies to reach their ideal audience.')}
                        </div>
                    </div>

                    <div class="mb-16">
                        <h3 class="text-3xl font-bold text-center mb-10">Financial Projections</h3>
                        <div class="max-w-4xl mx-auto overflow-x-auto">
                            <table class="w-full text-left bg-white shadow-md rounded-lg">
                                <thead>
                                    <tr class="bg-gray-200">
                                        <th class="p-4 font-bold">Year</th>
                                        <th class="p-4 font-bold">Pro/Expert Users</th>
                                        <th class="p-4 font-bold">Resourcing Accounts</th>
                                        <th class="p-4 font-bold">Ancillary Revenue</th>
                                        <th class="p-4 font-bold text-blue-600">Total Annual Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-b">
                                        <td class="p-4 font-bold">1</td>
                                        <td class="p-4">750</td>
                                        <td class="p-4">50</td>
                                        <td class="p-4">£30,000</td>
                                        <td class="p-4 font-bold text-gray-800">£215,500</td>
                                    </tr>
                                    <tr class="border-b bg-gray-50">
                                        <td class="p-4 font-bold">2</td>
                                        <td class="p-4">1,800</td>
                                        <td class="p-4">150</td>
                                        <td class="p-4">£95,000</td>
                                        <td class="p-4 font-bold text-gray-800">£598,000</td>
                                    </tr>
                                    <tr>
                                        <td class="p-4 font-bold">3</td>
                                        <td class="p-4">3,700</td>
                                        <td class="p-4">300</td>
                                        <td class="p-4">£250,000</td>
                                        <td class="p-4 font-bold text-gray-800">£1,350,000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="text-center bg-blue-600 text-white p-12 rounded-lg">
                        <h3 class="text-3xl font-bold">Join Us in Building the Future</h3>
                        <p class="mt-4 mb-6 max-w-2xl mx-auto">TechSubbies.com presents a high-growth investment opportunity in a rapidly expanding global market. With a scalable business model, robust technology, and multiple revenue streams, the platform is poised for substantial success.</p>
                        <a href="mailto:invest@techsubbies.com" class="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105">Contact Us for Investment Enquiries</a>
                    </div>
                </div>
            </section>
        `;
    }

    renderHighlightCard(icon, title, description) {
        return html`
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center mb-4">
                    <span class="[&>svg]:w-10 [&>svg]:h-10 [&>svg]:text-blue-500 [&>svg]:mr-4">${renderReactIcon(React.createElement(icon))}</span>
                    <h3 class="text-xl font-bold text-gray-800">${title}</h3>
                </div>
                <p class="text-gray-600">${description}</p>
            </div>
        `;
    }

    renderRevenueCard(number, title, description) {
        return html`
            <div class="bg-white p-6 rounded-lg border border-gray-200">
                <div class="flex items-center mb-3">
                    <div class="text-3xl font-bold text-blue-500 mr-4">${number}</div>
                    <h3 class="text-xl font-bold">${title}</h3>
                </div>
                <p class="text-gray-600">${description}</p>
            </div>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

customElements.define('investor-page', InvestorPage);
