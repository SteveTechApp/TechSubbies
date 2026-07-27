import React, { useMemo, useState } from 'react';
import { FAQ_DATA } from '../data/faqData';
import { Role } from '../types';
import { Briefcase, LifeBuoy, Search, Settings, ShieldCheck } from './Icons';

interface DashboardHelpCenterProps {
    role: Role;
    setActiveView: (view: string) => void;
}

const quickActions: Record<Role, Array<{
    label: string;
    description: string;
    destination: string;
    icon: React.ComponentType<any>;
}>> = {
    [Role.ENGINEER]: [
        { label: 'Track applications', description: 'Review application and offer statuses.', destination: 'Applications', icon: Briefcase },
        { label: 'Review contracts', description: 'Check signatures, milestones and timesheets.', destination: 'Contracts', icon: ShieldCheck },
        { label: 'Account settings', description: 'Manage profile visibility and account access.', destination: 'Settings', icon: Settings },
    ],
    [Role.COMPANY]: [
        { label: 'Manage applicants', description: 'Review candidates and hiring decisions.', destination: 'My Jobs', icon: Briefcase },
        { label: 'Review contracts', description: 'Check signatures, milestones and timesheets.', destination: 'Contracts', icon: ShieldCheck },
        { label: 'Company settings', description: 'Update company and account information.', destination: 'Settings', icon: Settings },
    ],
    [Role.RESOURCING_COMPANY]: [
        { label: 'Manage engineers', description: 'Review your attached technical workforce.', destination: 'Manage Engineers', icon: Briefcase },
        { label: 'Review contracts', description: 'Check active engagements and agreements.', destination: 'Contracts', icon: ShieldCheck },
        { label: 'Company settings', description: 'Update company and account information.', destination: 'Settings', icon: Settings },
    ],
    [Role.ADMIN]: [
        { label: 'Manage users', description: 'Review accounts and access restrictions.', destination: 'Manage Users', icon: ShieldCheck },
        { label: 'Privacy requests', description: 'Process data rights requests and deadlines.', destination: 'Privacy Requests', icon: LifeBuoy },
        { label: 'Platform settings', description: 'Review platform configuration.', destination: 'Platform Settings', icon: Settings },
    ],
};

export const DashboardHelpCenter = ({ role, setActiveView }: DashboardHelpCenterProps) => {
    const [query, setQuery] = useState('');
    const roleFaqs = role === Role.ENGINEER
        ? FAQ_DATA.engineers
        : role === Role.COMPANY || role === Role.RESOURCING_COMPANY
            ? FAQ_DATA.companies
            : [];
    const faqs = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return [...roleFaqs, ...FAQ_DATA.general].filter(faq =>
            !normalizedQuery
            || faq.question.toLowerCase().includes(normalizedQuery)
            || faq.answer.toLowerCase().includes(normalizedQuery)
        );
    }, [query, roleFaqs]);

    return (
        <div className="mx-auto max-w-5xl">
            <div className="rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
                <div className="flex items-start gap-4">
                    <LifeBuoy className="mt-1 h-8 w-8 flex-shrink-0" />
                    <div>
                        <h1 className="text-3xl font-bold">Help Center</h1>
                        <p className="mt-2 max-w-2xl text-blue-100">
                            Find answers and jump directly to the tools you need in your TechSubbies workspace.
                        </p>
                    </div>
                </div>
                <label className="relative mt-6 block">
                    <span className="sr-only">Search help articles</span>
                    <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="search"
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Search contracts, applications, payments or account access"
                        className="w-full rounded-lg border-0 bg-white py-3 pl-10 pr-4 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    />
                </label>
            </div>

            <section className="mt-8" aria-labelledby="help-shortcuts-heading">
                <h2 id="help-shortcuts-heading" className="text-xl font-bold text-gray-900">Common tasks</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {quickActions[role].map(action => (
                        <button
                            key={action.destination}
                            type="button"
                            onClick={() => setActiveView(action.destination)}
                            className="rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <action.icon className="h-6 w-6 text-blue-600" />
                            <span className="mt-3 block font-bold text-gray-900">{action.label}</span>
                            <span className="mt-1 block text-sm text-gray-600">{action.description}</span>
                        </button>
                    ))}
                </div>
            </section>

            <section className="mt-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="help-answers-heading">
                <h2 id="help-answers-heading" className="text-xl font-bold text-gray-900">Answers</h2>
                <div className="mt-3 divide-y divide-gray-200">
                    {faqs.map(faq => (
                        <details key={faq.question} className="group py-4">
                            <summary className="cursor-pointer list-none pr-6 font-semibold text-gray-900 marker:hidden">
                                {faq.question}
                                <span className="float-right text-blue-600 group-open:rotate-45" aria-hidden="true">+</span>
                            </summary>
                            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">{faq.answer}</p>
                        </details>
                    ))}
                </div>
                {faqs.length === 0 && (
                    <div className="py-8 text-center">
                        <p className="font-semibold text-gray-900">No matching help articles</p>
                        <p className="mt-1 text-sm text-gray-600">Try a broader search or use one of the common-task shortcuts.</p>
                    </div>
                )}
            </section>
        </div>
    );
};
