import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { Role } from '../../types';
import { SettingsView } from './SettingsView';

const profile: any = {
    id: 'resourcing-1',
    role: Role.RESOURCING_COMPANY,
    name: 'Original Agency',
    website: 'https://original.example.com',
    managedEngineerIds: [],
};

describe('Resourcing SettingsView', () => {
    it('waits for persisted settings and confirms success inline', async () => {
        const onSave = vi.fn().mockResolvedValue(undefined);
        render(
            <MemoryRouter>
                <SettingsView profile={profile} onSave={onSave} />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('Company Name'), { target: { value: 'Updated Agency' } });
        fireEvent.click(screen.getByRole('button', { name: 'Save Settings' }));

        await waitFor(() => expect(onSave).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Updated Agency' })
        ));
        expect(screen.getByRole('status')).toHaveTextContent('Settings saved successfully.');
    });

    it('keeps the form open and reports persistence failures', async () => {
        const onSave = vi.fn().mockRejectedValue(new Error('Profile service unavailable.'));
        render(
            <MemoryRouter>
                <SettingsView profile={profile} onSave={onSave} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Save Settings' }));

        expect(await screen.findByRole('status')).toHaveTextContent('Profile service unavailable.');
        expect(screen.getByRole('button', { name: 'Save Settings' })).toBeEnabled();
    });
});
