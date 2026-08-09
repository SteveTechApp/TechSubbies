import { API_BASE_URL } from './apiConfig';
import { secureFetch } from './httpClient';

export type SigningSession = {
  provider: 'local' | 'dropbox_sign';
  signUrl: string | null;
  expiresAt: number | null;
  signer: 'engineer' | 'company';
  signerName: string;
};

class ESignatureService {
  async createSigningSession(contractId: string): Promise<SigningSession> {
    const response = await secureFetch(`${API_BASE_URL}/esign/contracts/${contractId}/session`, {
      method: 'POST',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Could not open the secure signing service.');
    }
    return data as SigningSession;
  }
}

export const eSignatureService = new ESignatureService();
