import { LitElement, html } from 'lit';
import { Zap } from 'lucide-react';
import React from 'react';
import { renderReactIcon } from '../utils/react-icon-renderer.ts';

class Logo extends LitElement {
    static get properties() {
        return {
            className: { type: String }
        };
    }

    constructor() {
        super();
        this.className = '';
    }
    
    render() {
        return html`
            <div class="flex items-center font-bold text-2xl ${this.className}">
                <span class="[&>svg]:w-7 [&>svg]:h-7 [&>svg]:text-blue-500 [&>svg]:mr-2">
                    ${renderReactIcon(React.createElement(Zap))}
                </span>
                <span>TechSubbies</span>
            </div>
        `;
    }
    
    createRenderRoot() {
        return this; // Render without shadow DOM to use global Tailwind styles
    }
}

customElements.define('logo-element', Logo);
