import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SignContractModal } from './SignContractModal';
import { eSignatureService } from '../services/eSignatureService';

vi.mock('../services/eSignatureService', () => ({
  eSignatureService: { createSigningSession: vi.fn() },
}));

const contract = {
  id: 'contract-1',
  jobTitle: 'AV Commissioning Engineer',
  description: 'Commission the installed AV system.',
} as any;

describe('SignContractModal', () => {
  beforeEach(() => vi.clearAllMocks());

  it('opens the provider URL without recording a typed-name signature', async () => {
    vi.mocked(eSignatureService.createSigningSession).mockResolvedValue({
      provider: 'dropbox_sign',
      signUrl: 'https://sign.example/session',
      expiresAt: 123456,
      signer: 'engineer',
      signerName: 'Engineer One',
    });
    const onSubmit = vi.fn();
    render(<SignContractModal isOpen onClose={vi.fn()} contract={contract} onSubmit={onSubmit} />);

    await userEvent.click(screen.getByLabelText(/reviewed the contract/i));
    await userEvent.click(screen.getByRole('button', { name: /continue to secure signing/i }));

    expect(await screen.findByTitle('Secure contract signing')).toHaveAttribute('src', 'https://sign.example/session');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('retains the local signing fallback for development mode', async () => {
    vi.mocked(eSignatureService.createSigningSession).mockResolvedValue({
      provider: 'local',
      signUrl: null,
      expiresAt: null,
      signer: 'company',
      signerName: 'Client One',
    });
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(<SignContractModal isOpen onClose={onClose} contract={contract} onSubmit={onSubmit} />);

    await userEvent.click(screen.getByLabelText(/reviewed the contract/i));
    await userEvent.click(screen.getByRole('button', { name: /continue to secure signing/i }));

    expect(onSubmit).toHaveBeenCalledWith('Client One');
    expect(onClose).toHaveBeenCalled();
  });
});
