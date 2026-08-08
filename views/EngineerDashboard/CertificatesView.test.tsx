import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  listMyCertificates,
  setCertificateVisibility,
} from '../../services/certificateService';
import { CertificatesView } from './CertificatesView';

vi.mock('../../services/certificateService', () => ({
  listMyCertificates: vi.fn(),
  setCertificateVisibility: vi.fn(),
  submitCertificate: vi.fn(),
  uploadCertificationEvidence: vi.fn(),
  downloadEvidence: vi.fn(),
}));

const certificate = {
  id: 'certificate-1',
  evidenceId: 'evidence-1',
  name: 'CTS',
  issuer: 'AVIXA',
  certificateNumber: 'CTS-123',
  issuedAt: '2026-01-01T00:00:00.000Z',
  expiresAt: '2027-01-01T00:00:00.000Z',
  verificationStatus: 'pending' as const,
  visibility: 'private' as const,
  reviewNote: null,
  reviewedAt: null,
  createdAt: '2026-08-08T10:00:00.000Z',
  updatedAt: '2026-08-08T10:00:00.000Z',
};

describe('CertificatesView', () => {
  it('shows verification status and keeps marketplace visibility gated until approval', async () => {
    vi.mocked(listMyCertificates).mockResolvedValue([certificate]);
    vi.mocked(setCertificateVisibility).mockResolvedValue({ ...certificate, visibility: 'marketplace' });

    render(<CertificatesView />);

    expect(await screen.findByText('CTS')).toBeVisible();
    expect(screen.getByText('pending')).toBeVisible();

    await userEvent.selectOptions(screen.getByLabelText('Visibility for CTS'), 'marketplace');
    await waitFor(() => expect(setCertificateVisibility).toHaveBeenCalledWith('certificate-1', 'marketplace'));
    expect(await screen.findByText(/only becomes active after verification/i)).toBeVisible();
    expect(screen.getByText(/marketplace access remains disabled until this certificate is verified/i)).toBeVisible();
  });
});
