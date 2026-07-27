import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./DashboardSidebar', () => ({
    DashboardSidebar: ({ setActiveView, onNavigate }: {
        setActiveView: (view: string) => void;
        onNavigate?: () => void;
    }) => (
        <nav data-testid="dashboard-navigation">
            <button onClick={() => {
                setActiveView('Applications');
                onNavigate?.();
            }}>
                Applications
            </button>
        </nav>
    ),
}));

import { DashboardShell } from './DashboardShell';

describe('DashboardShell mobile navigation', () => {
    it('opens from the labelled menu button and closes with Escape', () => {
        render(
            <DashboardShell activeView="Dashboard" setActiveView={vi.fn()}>
                <p>Dashboard content</p>
            </DashboardShell>
        );

        const menuButton = screen.getByRole('button', { name: 'Open dashboard navigation' });
        const navigationContainer = screen.getByTestId('dashboard-navigation').parentElement!;
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
        expect(navigationContainer).toHaveClass('-translate-x-full');

        fireEvent.click(menuButton);
        expect(menuButton).toHaveAttribute('aria-expanded', 'true');
        expect(navigationContainer).toHaveClass('translate-x-0');

        fireEvent.keyDown(window, { key: 'Escape' });
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
        expect(navigationContainer).toHaveClass('-translate-x-full');
    });

    it('selects a destination and closes the navigation drawer', () => {
        const setActiveView = vi.fn();
        render(
            <DashboardShell activeView="Dashboard" setActiveView={setActiveView}>
                <p>Dashboard content</p>
            </DashboardShell>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Open dashboard navigation' }));
        fireEvent.click(screen.getByRole('button', { name: 'Applications' }));

        expect(setActiveView).toHaveBeenCalledWith('Applications');
        expect(screen.getByRole('button', { name: 'Open dashboard navigation' }))
            .toHaveAttribute('aria-expanded', 'false');
        expect(screen.getByTestId('dashboard-navigation').parentElement)
            .toHaveClass('-translate-x-full');
    });
});
