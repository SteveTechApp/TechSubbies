import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { JobPostStep1 } from './JobPostStep1';
import { Currency, ExperienceLevel, JobPostDraft, JobType } from '../../types';

function Wrapper() {
  const [jobDetails, setJobDetails] = useState<JobPostDraft>({
    canonicalRoleId: '',
    jobRole: '',
    title: '',
    description: 'Project description',
    location: 'London',
    dayRate: '450',
    duration: '3 days',
    currency: Currency.GBP,
    startDate: '2026-09-01',
    jobType: JobType.CONTRACT,
    experienceLevel: ExperienceLevel.SENIOR,
    supervisionArrangement: '',
    supervisionDisclaimerAccepted: false,
  });

  return (
    <JobPostStep1
      jobDetails={jobDetails}
      setJobDetails={setJobDetails}
      onNext={vi.fn()}
    />
  );
}

describe('JobPostStep1 canonical roles', () => {
  it('stores the canonical role id while retaining the approved role title for display', () => {
    render(<Wrapper />);

    const selector = screen.getAllByRole('combobox')[0] as HTMLSelectElement;
    fireEvent.change(selector, { target: { value: 'av-installation-engineer' } });

    expect(selector.value).toBe('av-installation-engineer');
    expect(screen.getByPlaceholderText('e.g., Lead AV Engineer')).toHaveValue('AV Installation Engineer');
    expect(screen.getByRole('button', { name: /Next: Define Skills/i })).toBeEnabled();
  });
});
