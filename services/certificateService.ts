import { API_BASE_URL } from './apiConfig';
import { secureFetch } from './httpClient';

export type CertificateVisibility = 'private' | 'marketplace';
export type CertificateVerificationStatus = 'pending' | 'verified' | 'rejected';

export type EvidenceItem = {
  id: string;
  purpose: 'cv' | 'certification' | 'skill_evidence';
  fileName: string;
  contentType: string;
  declaredSizeBytes: number;
  storedSizeBytes: number | null;
  status: 'pending' | 'ready';
};

export type CertificateRecord = {
  id: string;
  evidenceId: string;
  name: string;
  issuer: string;
  certificateNumber: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
  verificationStatus: CertificateVerificationStatus;
  visibility: CertificateVisibility;
  reviewNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminCertificateQueueItem = CertificateRecord & {
  ownerUserId: string;
  ownerName: string;
  ownerEmail: string;
  evidenceFileName: string;
  evidenceContentType: string;
};

async function responseJson<T>(response: Response, fallback: string): Promise<T> {
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || fallback);
  return data as T;
}

export async function uploadCertificationEvidence(file: File): Promise<EvidenceItem> {
  const metadataResponse = await secureFetch(`${API_BASE_URL}/evidence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      purpose: 'certification',
      fileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    }),
  });
  const metadata = await responseJson<EvidenceItem>(metadataResponse, 'Could not create evidence record.');

  const uploadResponse = await secureFetch(`${API_BASE_URL}/evidence/${metadata.id}/content`, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  return responseJson<EvidenceItem>(uploadResponse, 'Could not upload certificate evidence.');
}

export async function submitCertificate(input: {
  evidenceId: string;
  name: string;
  issuer: string;
  certificateNumber?: string;
  issuedAt?: string;
  expiresAt?: string;
  visibility: CertificateVisibility;
}): Promise<CertificateRecord> {
  const response = await secureFetch(`${API_BASE_URL}/certificates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return responseJson<CertificateRecord>(response, 'Could not submit certificate for verification.');
}

export async function listMyCertificates(): Promise<CertificateRecord[]> {
  const response = await secureFetch(`${API_BASE_URL}/certificates/mine`);
  return responseJson<CertificateRecord[]>(response, 'Could not load certificates.');
}

export async function setCertificateVisibility(
  certificateId: string,
  visibility: CertificateVisibility
): Promise<CertificateRecord> {
  const response = await secureFetch(`${API_BASE_URL}/certificates/${certificateId}/visibility`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visibility }),
  });
  return responseJson<CertificateRecord>(response, 'Could not update certificate visibility.');
}

export async function listAdminCertificates(
  status: CertificateVerificationStatus = 'pending'
): Promise<AdminCertificateQueueItem[]> {
  const response = await secureFetch(`${API_BASE_URL}/admin/certificates?status=${encodeURIComponent(status)}`);
  const data = await responseJson<{ certificates: AdminCertificateQueueItem[] }>(response, 'Could not load certificate verification queue.');
  return data.certificates;
}

export async function reviewCertificate(
  certificateId: string,
  status: 'verified' | 'rejected',
  note: string
): Promise<{ certificate: CertificateRecord; notificationSent: boolean }> {
  const response = await secureFetch(`${API_BASE_URL}/admin/certificates/${certificateId}/review`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, note }),
  });
  return responseJson(response, 'Could not review certificate.');
}

export async function runExpiryReminderSweep(): Promise<{ due: number; sent: number }> {
  const response = await secureFetch(`${API_BASE_URL}/admin/certificates/expiry-reminders/run`, {
    method: 'POST',
  });
  return responseJson(response, 'Could not run certificate expiry reminders.');
}

export async function downloadEvidence(evidenceId: string, fileName = 'evidence') {
  const response = await secureFetch(`${API_BASE_URL}/evidence/${evidenceId}/content`);
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || 'Could not download evidence.');
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
