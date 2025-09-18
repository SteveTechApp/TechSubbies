import React from 'react';

export const AccessibilityPage = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Accessibility Statement</h1>
            <div className="prose lg:prose-lg">
                <p>
                    TechSubbies.com is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
                </p>
                <h2>Conformance status</h2>
                <p>
                    The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. TechSubbies.com is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
                </p>
                <h2>Feedback</h2>
                <p>
                    We welcome your feedback on the accessibility of TechSubbies.com. Please let us know if you encounter accessibility barriers:
                </p>
                <ul>
                    <li>E-mail: accessibility@techsubbies.com</li>
                </ul>
                <p>
                    We try to respond to feedback within 5 business days.
                </p>
            </div>
        </div>
    );
};