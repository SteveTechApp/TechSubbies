import { LitElement, html } from 'lit';
import { geminiService } from '../services/geminiService.ts';
import { BrainCircuit, Loader } from 'lucide-react';
import React from 'react';
import { Job, EngineerProfile } from '../types.ts';
import { renderReactIcon } from '../utils/react-icon-renderer.ts';

interface AnalysisResult {
    skill_match_assessment: string;
    rate_justification: string;
    overall_recommendation: string;
    confidence_score: number;
}

class AIEngineerCostAnalysis extends LitElement {
    job: Job;
    engineer: EngineerProfile;
    isLoading: boolean;
    analysisResult: AnalysisResult | null;
    error: string;

    static get properties() {
        return {
            job: { attribute: false },
            engineer: { attribute: false },
            isLoading: { state: true },
            analysisResult: { state: true },
            error: { state: true }
        };
    }

    constructor() {
        super();
        this.job = {} as Job;
        this.engineer = {} as EngineerProfile;
        this.isLoading = false;
        this.analysisResult = null;
        this.error = '';
    }

    async handleAnalyze() {
        this.isLoading = true;
        this.error = '';
        this.analysisResult = null;
        const result = await geminiService.analyzeEngineerCost(this.job.description, this.engineer);
        if (result) {
            this.analysisResult = result;
        } else {
            this.error = 'Could not perform analysis. The AI service may be unavailable.';
        }
        this.isLoading = false;
    }

    render() {
        if (!this.job || !this.engineer) return html``;
        return html`
            <div class="p-4 border-2 border-dashed rounded-md bg-gray-50">
                <h4 class="font-bold text-lg mb-2 flex items-center">
                    <span class="[&>svg]:w-6 [&>svg]:h-6 [&>svg]:mr-2 [&>svg]:text-purple-600">${renderReactIcon(React.createElement(BrainCircuit))}</span>
                    AI Cost-Effectiveness Analysis
                </h4>
                <p class="text-sm text-gray-600 mb-4">
                    Is ${this.engineer.name}'s day rate of ${this.engineer.currency}${this.engineer.dayRate} a good value for this job? Let our AI analyze the match.
                </p>
                ${!this.analysisResult ? html`
                    <button @click=${this.handleAnalyze} ?disabled=${this.isLoading} class="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-300">
                        ${this.isLoading ? 'Analyzing...' : 'Analyze Now'}
                    </button>
                ` : ''}
                ${this.isLoading ? html`<div class="mt-4">${renderReactIcon(React.createElement(Loader, { className: 'animate-spin' }))}</div>` : ''}
                ${this.error ? html`<p class="text-red-500 mt-2">${this.error}</p>` : ''}
                ${this.analysisResult ? this.renderResultDisplay() : ''}
            </div>
        `;
    }

    renderResultDisplay() {
        if (!this.analysisResult) return '';
        return html`
            <div class="space-y-3">
                <div>
                    <strong>Skill Match:</strong> ${this.analysisResult.skill_match_assessment}
                </div>
                <div>
                    <strong>Rate Justification:</strong> ${this.analysisResult.rate_justification}
                </div>
                <div class="p-3 bg-green-50 border border-green-200 rounded-md">
                    <strong>Overall Recommendation:</strong> ${this.analysisResult.overall_recommendation}
                </div>
                <div class="flex items-center">
                    <strong class="mr-2">Confidence:</strong>
                    <div class="w-full bg-gray-200 rounded-full h-4">
                        <div class="bg-blue-600 h-4 rounded-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none" style="width: ${this.analysisResult.confidence_score}%">
                            ${this.analysisResult.confidence_score}%
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

customElements.define('ai-cost-analysis', AIEngineerCostAnalysis);