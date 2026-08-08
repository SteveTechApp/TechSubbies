import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  listPendingReviews: vi.fn(),
  review: vi.fn(),
}));

vi.mock('../../services/taxonomyService', () => ({
  taxonomyService: {
    listPendingReviews: mocks.listPendingReviews,
    review: mocks.review,
  },
}));

import { TaxonomyReviewView } from './TaxonomyReviewView';

const version = {
  id: 'version-1',
  roleId: 'av-test-role',
  version: 2,
  status: 'in_review',
  changeNote: 'Clarify commissioning responsibility boundaries.',
  createdBy: 'admin-1',
  createdAt: '2026-08-08T10:00:00.000Z',
  updatedAt: '2026-08-08T10:00:00.000Z',
  submittedAt: '2026-08-08T10:00:00.000Z',
  publishedAt: null,
  publishedBy: null,
  reviews: [],
  snapshot: {
    id: 'av-test-role', market: 'av', family: 'commissioning', title: 'AV Commissioning Engineer', shortTitle: 'Commissioning Engineer', level: 'specialist',
    summary: 'Commissions and validates integrated AV systems against the agreed design intent.', suitableFor: ['Commissioning'], typicalProjects: ['Corporate AV'], recommendedTags: [], evidenceTypes: ['Commissioning records'],
    skillGroups: [{ id: 'g1', title: 'Commissioning', description: 'Core', skills: [{ id: 's1', label: 'Validation', description: 'Validates systems', requiredForGoodMatch: true, evidenceRecommended: true, suggestedTags: [] }] }],
  },
};

describe('TaxonomyReviewView', () => {
  it('loads a pending version and submits a practitioner approval note', async () => {
    mocks.listPendingReviews.mockResolvedValue([version]);
    mocks.review.mockResolvedValue({ ...version, status: 'approved' });
    render(<TaxonomyReviewView />);

    expect(await screen.findByText('AV Commissioning Engineer')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Explain why this definition/i), {
      target: { value: 'This accurately reflects commissioning responsibilities in the field.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));

    await waitFor(() => expect(mocks.review).toHaveBeenCalledWith(
      'version-1',
      'approved',
      'This accurately reflects commissioning responsibilities in the field.'
    ));
    await waitFor(() => expect(screen.queryByText('AV Commissioning Engineer')).not.toBeInTheDocument());
  });
});
