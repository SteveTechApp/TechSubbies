import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { SettingsView as CompanySettingsView } from './CompanyDashboard/SettingsView';
import { SettingsView as ResourcingSettingsView } from './ResourcingDashboard/SettingsView';

describe.each([
    ['company', CompanySettingsView],
    ['resourcing company', ResourcingSettingsView],
])('%s settings', (_role, SettingsComponent) => {
    it('links commercial accounts to the shared Account Security workflow', () => {
        render(
            <MemoryRouter>
                <SettingsComponent profile={{ name: 'Test organisation' } as any} onSave={vi.fn()} />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: 'Account security and privacy' })).toBeVisible();
        expect(screen.getByRole('link', { name: 'Open Account Security' }))
            .toHaveAttribute('href', '/account/security');
    });
});
