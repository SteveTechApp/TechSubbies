import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { SettingsView } from './SettingsView';

vi.mock('../../context/InteractionContext', () => ({
    useAppContext: () => ({ reactivateProfile: vi.fn() }),
}));

describe('Engineer SettingsView', () => {
    it('routes account deletion through the real Account Security workflow', () => {
        render(
            <MemoryRouter>
                <SettingsView
                    profile={{ status: 'active', jobDigestOptIn: false, jobAlertsEnabled: false } as any}
                    onSave={vi.fn()}
                    setActiveView={vi.fn()}
                />
            </MemoryRouter>
        );

        const link = screen.getByRole('link', { name: 'Review deletion options' });
        expect(link).toHaveAttribute('href', '/account/security');
        expect(screen.queryByText(/deletion is not implemented/i)).not.toBeInTheDocument();
        expect(screen.getByText(/privacy review/i)).toBeVisible();
    });
});
