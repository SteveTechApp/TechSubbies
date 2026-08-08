import React, { FormEvent, useEffect, useState } from 'react';
import {
  downloadEvidence,
  listMyCertificates,
  setCertificateVisibility,
  submitCertificate,
  uploadCertificationEvidence,
  type CertificateRecord,
  type CertificateVisibility,
} from '../../services/certificateService';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

function statusClass(status: CertificateRecord['verificationStatus']) {
  if (status === 'verified') return 'bg-green-100 text-green-800';
  if (status === 'rejected') return 'bg-red-100 text-red-800';
  return 'bg-amber-100 text-amber-800';
}

export const CertificatesView = () => {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [issuedAt, setIssuedAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [visibility, setVisibility] = useState<CertificateVisibility>('private');

  const load = async () => {
    setLoading(true);
    try {
      setCertificates(await listMyCertificates());
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load certificates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!file) return setError('Choose a PDF, JPEG or PNG certificate file.');
    if (!ACCEPTED_TYPES.includes(file.type)) return setError('Certificate evidence must be a PDF, JPEG or PNG.');
    if (file.size > MAX_FILE_BYTES) return setError('Certificate evidence must be 10 MB or smaller.');
    if (!name.trim() || !issuer.trim()) return setError('Certificate name and issuer are required.');

    setSaving(true);
    try {
      const evidence = await uploadCertificationEvidence(file);
      await submitCertificate({
        evidenceId: evidence.id,
        name: name.trim(),
        issuer: issuer.trim(),
        certificateNumber: certificateNumber.trim() || undefined,
        issuedAt: issuedAt || undefined,
        expiresAt: expiresAt || undefined,
        visibility,
      });
      setFile(null);
      setName('');
      setIssuer('');
      setCertificateNumber('');
      setIssuedAt('');
      setExpiresAt('');
      setVisibility('private');
      setSuccess('Certificate submitted for verification.');
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not submit certificate.');
    } finally {
      setSaving(false);
    }
  };

  const changeVisibility = async (certificate: CertificateRecord, next: CertificateVisibility) => {
    try {
      const updated = await setCertificateVisibility(certificate.id, next);
      setCertificates((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSuccess(next === 'marketplace'
        ? 'Marketplace visibility selected. It only becomes active after verification.'
        : 'Certificate evidence is private.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update visibility.');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Certificates</h1>
        <p className="mt-1 text-sm text-gray-500">Upload certification evidence, track verification and control who can view verified evidence.</p>
      </div>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
      {success && <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">{success}</div>}

      <form onSubmit={submit} className="rounded-lg bg-white p-5 shadow">
        <h2 className="text-base font-bold text-gray-900">Submit certificate for verification</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">Certificate name
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" placeholder="e.g. CTS-I" />
          </label>
          <label className="text-sm font-medium text-gray-700">Issuer
            <input value={issuer} onChange={(e) => setIssuer(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" placeholder="e.g. AVIXA" />
          </label>
          <label className="text-sm font-medium text-gray-700">Certificate number
            <input value={certificateNumber} onChange={(e) => setCertificateNumber(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-gray-700">Evidence file
            <input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm" />
            <span className="mt-1 block text-xs text-gray-500">PDF, JPEG or PNG, maximum 10 MB.</span>
          </label>
          <label className="text-sm font-medium text-gray-700">Issue date
            <input type="date" value={issuedAt} onChange={(e) => setIssuedAt(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-gray-700">Expiry date
            <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-gray-700 md:col-span-2">Evidence visibility
            <select value={visibility} onChange={(e) => setVisibility(e.target.value as CertificateVisibility)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2">
              <option value="private">Private — only you and TechSubbies Admin</option>
              <option value="marketplace">Marketplace — verified companies and resourcing companies after approval</option>
            </select>
          </label>
        </div>
        <button disabled={saving} className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Uploading and submitting…' : 'Submit for verification'}
        </button>
      </form>

      <section className="rounded-lg bg-white p-5 shadow">
        <h2 className="text-base font-bold text-gray-900">My certificates</h2>
        {loading ? <p className="mt-4 text-sm text-gray-500">Loading certificates…</p> : certificates.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">No certificates have been submitted yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {certificates.map((certificate) => (
              <article key={certificate.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{certificate.name}</h3>
                      <span className={`rounded px-2 py-1 text-xs font-semibold ${statusClass(certificate.verificationStatus)}`}>{certificate.verificationStatus}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{certificate.issuer}{certificate.certificateNumber ? ` · ${certificate.certificateNumber}` : ''}</p>
                    {certificate.expiresAt && <p className="mt-1 text-xs text-gray-500">Expires {new Date(certificate.expiresAt).toLocaleDateString('en-GB')}</p>}
                    {certificate.reviewNote && <p className="mt-2 text-sm text-gray-700">Review: {certificate.reviewNote}</p>}
                  </div>
                  <div className="flex flex-col gap-2 sm:min-w-52">
                    <select
                      aria-label={`Visibility for ${certificate.name}`}
                      value={certificate.visibility}
                      onChange={(e) => void changeVisibility(certificate, e.target.value as CertificateVisibility)}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value="private">Private</option>
                      <option value="marketplace">Marketplace</option>
                    </select>
                    <button type="button" onClick={() => void downloadEvidence(certificate.evidenceId, `${certificate.name}-evidence`)} className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Download evidence</button>
                  </div>
                </div>
                {certificate.visibility === 'marketplace' && certificate.verificationStatus !== 'verified' && (
                  <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">Marketplace access remains disabled until this certificate is verified.</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
