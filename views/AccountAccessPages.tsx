import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/apiService";

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-[70vh] bg-slate-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-lg rounded-3xl border border-cyan-300/20 bg-slate-900 p-7 shadow-2xl">
        <h1 className="text-2xl font-bold text-cyan-200">{title}</h1>
        {children}
      </div>
    </div>
  );
}

const inputClass = "mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300";
const buttonClass = "mt-6 w-full rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-200 disabled:opacity-60";

function Message({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null;
  return <div className={`mt-5 rounded-xl border p-4 text-sm ${error ? "border-red-300/30 bg-red-300/10 text-red-100" : "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"}`}>{error || success}</div>;
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      await apiService.requestPasswordReset(email);
      setSuccess("If that account exists, reset instructions have been sent.");
    } catch (reason: any) {
      setError(reason.message);
    } finally { setBusy(false); }
  }

  return <Shell title="Forgot your password?"><p className="mt-3 text-sm text-slate-400">Enter the email used for your TechSubbies account.</p><Message error={error} success={success} /><form onSubmit={submit}><label className="mt-5 block text-sm font-semibold">Email<input required type="email" autoComplete="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} /></label><button disabled={busy} className={buttonClass}>{busy ? "Sending..." : "Send reset instructions"}</button></form></Shell>;
}

export function ResetPasswordPage() {
  const token = new URLSearchParams(window.location.search).get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState({ error: "", success: "" });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirm) return setMessage({ error: "Passwords do not match.", success: "" });
    try {
      await apiService.confirmPasswordReset(token, password);
      setMessage({ error: "", success: "Password reset. You can now sign in." });
    } catch (reason: any) { setMessage({ error: reason.message, success: "" }); }
  }

  return <Shell title="Choose a new password"><Message {...message} />{!token ? <Message error="This reset link is incomplete." /> : <form onSubmit={submit}><label className="mt-5 block text-sm font-semibold">New password<input required minLength={8} type="password" autoComplete="new-password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} /></label><label className="mt-4 block text-sm font-semibold">Confirm password<input required minLength={8} type="password" autoComplete="new-password" className={inputClass} value={confirm} onChange={(e) => setConfirm(e.target.value)} /></label><button className={buttonClass}>Reset password</button></form>}</Shell>;
}

export function VerifyEmailPage() {
  const token = new URLSearchParams(window.location.search).get("token") || "";
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!token) { setError("This verification link is incomplete."); return; }
    apiService.confirmEmailVerification(token).then(() => setMessage("Email verified successfully.")).catch((reason) => setError(reason.message));
  }, [token]);
  return <Shell title="Verify your email"><Message error={error} success={error ? "" : message} /><a href="/login" className="mt-6 block text-center font-semibold text-cyan-200">Continue to sign in</a></Shell>;
}

export function AccountSecurityPage() {
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ error: "", success: "" });
  const [events, setEvents] = useState<Array<{ id: string; eventType: string; outcome: string; createdAt: string }>>([]);
  const [revoking, setRevoking] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deletionPassword, setDeletionPassword] = useState("");
  const [deletionRequest, setDeletionRequest] = useState<{
    status: string;
    reference?: string;
    requestedAt: string;
    responseDueAt?: string;
    cancelledAt: string | null;
    reviewedAt?: string | null;
    resolutionNote?: string | null;
    processedAt?: string | null;
  } | null>(null);

  useEffect(() => {
    apiService.listSecurityEvents().then(setEvents).catch(() => undefined);
    apiService.getDeletionRequest().then(setDeletionRequest).catch(() => undefined);
  }, []);

  async function change(event: React.FormEvent) {
    event.preventDefault();
    try {
      await apiService.changePassword(currentPassword, newPassword);
      setMessage({ error: "", success: "Password changed. Please sign in again." });
      window.setTimeout(logout, 1000);
    } catch (reason: any) { setMessage({ error: reason.message, success: "" }); }
  }

  const eventLabels: Record<string, string> = {
    "account.registered": "Account created",
    "login.succeeded": "Successful sign in",
    "login.failed": "Failed sign-in attempt",
    "email.verified": "Email verified",
    "password.reset": "Password reset",
    "password.changed": "Password changed",
    "sessions.revoked": "All sessions signed out",
  };

  async function downloadDataExport() {
    setExporting(true);
    try {
      const data = await apiService.exportMyAccountData();
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `techsubbies-account-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage({ error: "", success: "Your account data export has downloaded." });
    } catch (reason: any) {
      setMessage({ error: reason.message, success: "" });
    } finally {
      setExporting(false);
    }
  }

  async function submitDeletionRequest() {
    try {
      const request = await apiService.requestAccountDeletion(deletionPassword);
      setDeletionRequest(request);
      setDeletionPassword("");
      setMessage({ error: "", success: "Account deletion request submitted for review." });
    } catch (reason: any) {
      setMessage({ error: reason.message, success: "" });
    }
  }

  async function cancelDeletionRequest() {
    try {
      const request = await apiService.cancelAccountDeletion();
      setDeletionRequest(request);
      setMessage({ error: "", success: "Account deletion request cancelled." });
    } catch (reason: any) {
      setMessage({ error: reason.message, success: "" });
    }
  }

  const newDeletionRequestForm = (
    <>
      <label className="mt-4 block text-sm font-semibold">
        Confirm password
        <input type="password" autoComplete="current-password" className={inputClass} value={deletionPassword} onChange={(event) => setDeletionPassword(event.target.value)} />
      </label>
      <button disabled={!deletionPassword} className="mt-4 w-full rounded-xl border border-red-300/30 px-5 py-3 font-bold text-red-100 disabled:opacity-60" onClick={submitDeletionRequest}>
        Request account deletion
      </button>
    </>
  );

  const deletionRequestPanel = deletionRequest?.status === "pending" ? (
    <div className="mt-4 rounded-xl border border-amber-300/30 bg-amber-300/10 p-4">
      <p className="font-semibold text-amber-200">Pending privacy review</p>
      <p className="mt-1 text-sm text-slate-300">Deletion requested on {new Date(deletionRequest.requestedAt).toLocaleDateString()}. We will email you when its status changes.</p>
      {deletionRequest.responseDueAt && <p className="mt-2 text-sm text-slate-300">Response target: <strong>{new Date(deletionRequest.responseDueAt).toLocaleDateString()}</strong></p>}
      {deletionRequest.reference && <p className="mt-1 break-all text-xs text-slate-400">Reference: {deletionRequest.reference}</p>}
      <button className="mt-4 w-full rounded-xl border border-white/20 px-5 py-3 font-bold" onClick={cancelDeletionRequest}>Cancel deletion request</button>
    </div>
  ) : deletionRequest?.status === "approved" ? (
    <div className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-300/10 p-4">
      <p className="font-semibold text-emerald-200">Approved for processing</p>
      <p className="mt-1 text-sm text-slate-300">Your account remains active until anonymisation is completed. You will receive a final confirmation email.</p>
      {deletionRequest.reference && <p className="mt-2 break-all text-xs text-slate-400">Reference: {deletionRequest.reference}</p>}
    </div>
  ) : deletionRequest?.status === "rejected" ? (
    <>
      <div className="mt-4 rounded-xl border border-red-300/30 bg-red-300/10 p-4">
        <p className="font-semibold text-red-200">Action required</p>
        <p className="mt-1 text-sm text-slate-300">{deletionRequest.resolutionNote || "The request could not be processed. Resolve outstanding requirements before trying again."}</p>
      </div>
      {newDeletionRequestForm}
    </>
  ) : deletionRequest?.status === "cancelled" ? (
    <>
      <p className="mt-4 text-sm text-slate-300">Your previous request was cancelled. You can submit another request below.</p>
      {newDeletionRequestForm}
    </>
  ) : newDeletionRequestForm;

  return <Shell title="Account security"><p className="mt-3 text-sm text-slate-400">Email status: <strong className={user?.emailVerified ? "text-emerald-300" : "text-amber-300"}>{user?.emailVerified ? "Verified" : "Not verified"}</strong></p>{!user?.emailVerified && <button className={buttonClass} onClick={() => apiService.resendEmailVerification().then(() => setMessage({ error: "", success: "Verification email queued." })).catch((reason) => setMessage({ error: reason.message, success: "" }))}>Resend verification email</button>}<Message {...message} /><form onSubmit={change}><label className="mt-5 block text-sm font-semibold">Current password<input required type="password" autoComplete="current-password" className={inputClass} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></label><label className="mt-4 block text-sm font-semibold">New password<input required minLength={8} type="password" autoComplete="new-password" className={inputClass} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></label><button className={buttonClass}>Change password</button></form><section className="mt-8 border-t border-white/10 pt-6"><h2 className="text-lg font-bold text-cyan-200">Your data</h2><p className="mt-2 text-sm text-slate-400">Download a portable JSON copy of your profile and marketplace activity.</p><button disabled={exporting} className="mt-4 w-full rounded-xl border border-cyan-300/30 px-5 py-3 font-bold text-cyan-100 hover:bg-cyan-300/10 disabled:opacity-60" onClick={downloadDataExport}>{exporting ? "Preparing export..." : "Download my data"}</button></section><section className="mt-8 border-t border-white/10 pt-6"><h2 className="text-lg font-bold text-cyan-200">Active sessions</h2><p className="mt-2 text-sm text-slate-400">If you suspect another device has access, sign out every session including this one.</p><button disabled={revoking} className="mt-4 w-full rounded-xl border border-red-300/30 px-5 py-3 font-bold text-red-100 hover:bg-red-300/10 disabled:opacity-60" onClick={() => { setRevoking(true); apiService.revokeAllSessions().then(() => { setMessage({ error: "", success: "All devices signed out. Please sign in again." }); window.setTimeout(logout, 1000); }).catch((reason) => { setMessage({ error: reason.message, success: "" }); setRevoking(false); }); }}>{revoking ? "Signing out..." : "Sign out all devices"}</button></section><section className="mt-8 border-t border-red-300/20 pt-6"><h2 className="text-lg font-bold text-red-200">Delete account</h2><p className="mt-2 text-sm text-slate-400">Request account deletion for privacy review. Transaction records may be retained where legally required.</p>{deletionRequestPanel}</section><section className="mt-8 border-t border-white/10 pt-6"><h2 className="text-lg font-bold text-cyan-200">Recent security activity</h2>{events.length === 0 ? <p className="mt-3 text-sm text-slate-400">No security activity is available yet.</p> : <ul className="mt-3 space-y-2">{events.map((event) => <li key={event.id} className="rounded-xl border border-white/10 bg-slate-950 p-3"><div className="text-sm font-semibold">{eventLabels[event.eventType] || "Account security event"}</div><time className="mt-1 block text-xs text-slate-500" dateTime={event.createdAt}>{new Date(event.createdAt).toLocaleString()}</time></li>)}</ul>}</section></Shell>;
}
