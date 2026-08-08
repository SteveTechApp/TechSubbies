import React, { ReactNode, useEffect, useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { RealtimeBridge } from './RealtimeBridge';
import { Menu } from './Icons';

interface DashboardShellProps {
    activeView: string;
    setActiveView: (view: string) => void;
    children: ReactNode;
}

export const DashboardShell = ({ activeView, setActiveView, children }: DashboardShellProps) => {
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);

    useEffect(() => {
        if (!isNavigationOpen) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsNavigationOpen(false);
        };
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [isNavigationOpen]);

    return (
        <div className="flex h-screen min-w-0 bg-gray-100">
            <RealtimeBridge />
            {isNavigationOpen && (
                <button
                    type="button"
                    aria-label="Close dashboard navigation"
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setIsNavigationOpen(false)}
                />
            )}
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-out md:static md:z-auto md:translate-x-0 ${
                isNavigationOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <DashboardSidebar
                    activeView={activeView}
                    setActiveView={setActiveView}
                    onNavigate={() => setIsNavigationOpen(false)}
                    onClose={() => setIsNavigationOpen(false)}
                />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-14 flex-shrink-0 items-center gap-3 border-b bg-white px-4 shadow-sm md:hidden">
                    <button
                        type="button"
                        aria-label="Open dashboard navigation"
                        aria-expanded={isNavigationOpen}
                        onClick={() => setIsNavigationOpen(true)}
                        className="rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Menu size={22} />
                    </button>
                    <p className="truncate font-semibold text-gray-900">{activeView}</p>
                </header>
                <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};
