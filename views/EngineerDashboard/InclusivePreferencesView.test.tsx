import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { EngineerProfile } from '../../types';
import { InclusivePreferencesView } from './InclusivePreferencesView';

const profile = ({
  inclusivePreferences: {
    languages: ['English'],
    workModes: ['on-site'],
    accessibility: {
      needsAdjustments: false,
      shareWithCompanies: false,
      adjustments: [],
      note: '',
    },
    alternativeEvidenceRoutes: [],
  },
} as unknown) as EngineerProfile;

describe('InclusivePreferencesView', () => {
  it('saves work preferences, alternative evidence routes and private accessibility by default', async () => {
    const onSave = vi.fn(async (_profileData: Partial<EngineerProfile>) => undefined);
    render(<InclusivePreferencesView profile={profile} onSave={onSave} />);

    fireEvent.click(screen.getByRole('button', { name: /^Remote\b/i }));
    fireEvent.change(screen.getByLabelText('Languages'), { target: { value: 'English, Polish' } });
    fireEvent.click(screen.getByLabelText('Portfolio / project examples'));
    fireEvent.click(screen.getByLabelText('I may need adjustments'));
    fireEvent.click(screen.getByLabelText('Seated work where practical'));
    fireEvent.click(screen.getByRole('button', { name: 'Save preferences' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    const payload = onSave.mock.calls[0][0] as any;
    expect(payload.inclusivePreferences).toMatchObject({
      languages: ['English', 'Polish'],
      workModes: ['on-site', 'remote'],
      alternativeEvidenceRoutes: ['portfolio'],
      accessibility: {
        needsAdjustments: true,
        shareWithCompanies: false,
        adjustments: ['Seated work where practical'],
      },
    });
  });

  it('requires a separate explicit action before accessibility details are shared', async () => {
    const onSave = vi.fn(async (_profileData: Partial<EngineerProfile>) => undefined);
    render(<InclusivePreferencesView profile={profile} onSave={onSave} />);

    fireEvent.click(screen.getByLabelText('I may need adjustments'));
    fireEvent.click(screen.getByLabelText('Step-free / accessible site access'));
    fireEvent.click(screen.getByText(/Share these adjustment details with companies/i).closest('label')!.querySelector('input')!);
    fireEvent.click(screen.getByRole('button', { name: 'Save preferences' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect((onSave.mock.calls[0][0] as any).inclusivePreferences.accessibility.shareWithCompanies).toBe(true);
  });
});
