import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  listAdminCertificates,
  reviewCertificate,
  runExpiryReminderSweep,
} from '../../services/certificateService';
import { CertificateVerificationView } from './CertificateVerificationView';

vi.mock('../../services/certificateService', () => ({
  listAdminCertificates: vi.fn(),
  reviewCertificate: vi.fn(),
  runExpiryReminderSweep: vi.fn(),
  downloadEvidence: vi.fn(),
}));

const pending = {
  id: 'certificate-1',
  ownerUserId: 'engineer-1',
  evidenceId: 'evidence-1',
  name: 'CTS-I',
  issuer: 'AVIXA',
  certificateNumber: 'CTS-I-123',
  issuedAt: '2026-01-01T00:00:00.000Z',
  expiresAt: '2027-01-01T00:00:00.000Z',
  verificationStatus: 'pending' as const,
  visibility: 'marketplace' as const,
  reviewNote: null,
  reviewedAt: null,
  createdAt: '2026-08-08T10:00:00.000Z',
  updatedAt: '2026-08-08T10:00:00.000Z',
  ownerName: 'Alex Engineer',
  ownerEmail: 'alex@example.com',
  evidenceFileName: 'cts-i.pdf',
  evidenceContentType: 'application/pdf',
};

describe('CertificateVerificationView', () => {
  it('loads pending certificates and verifies one with a review note', async () => {
    vi.mocked(listAdminCertificates)
      .mockResolvedValueOnce([pending])
      .mockResolvedValueOnce([]);
    vi.mocked(reviewCertificate).mockResolvedValue({
      certificate: { ...pending, verificationStatus: 'verified' },
      notificationSent: true,
    });

    render(<CertificateVerificationView />);

    expect(await screen.findByText('CTS-I')).toBeVisible();
    expect(screen.getByText('Alex Engineer')).toBeVisible();
    await userEvent.type(screen.getByLabelText('Review note for CTS-I'), 'Issuer record confirmed.');
    await userEvent.click(screen.getByRole('button', { name: 'Verify' }));

    await waitFor(() => expect(reviewCertificate).toHaveBeenCalledWith(
      'certificate-1',
      'verified',
      'Issuer record confirmed.'
    ));
    expect(await screen.findByText(/verified and the engineer was notified/i)).toBeVisible();
  });

  it('requires a meaningful rejection reason and can run expiry reminders', async () => {
    vi.mocked(listAdminCertificates).mockResolvedValue([pending]);
    vi.mocked(runExpiryReminderSweep).mockResolvedValue({ due: 2, sent: 2 });

    render(<CertificateVerificationView />);
    expect(await screen.findByText('CTS-I')).toBeVisible();

    await userEvent.click(screen.getByRole('button', { name: 'Reject' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/at least 10 characters/i);
    expect(reviewCertificate).not.toHaveBeenCalledWith('certificate-1', 'rejected', expect.anything());

    await userEvent.click(screen.getByRole('button', { name: 'Run expiry reminders' }));
    expect(await screen.findByText(/2 sent from 2 due reminders/i)).toBeVisible();
  });
});
