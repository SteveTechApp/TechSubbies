import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/apiService";

export default function EmailVerificationBanner() {
  const { user } = useAuth();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (user?.emailVerified !== false) return null;

  async function resend() {
    setStatus("sending");
    try {
      await apiService.resendEmailVerification();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <aside
      aria-label="Email verification required"
      className="border-b border-amber-300/25 bg-amber-300/10 px-5 py-3 text-amber-50"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <strong className="text-sm">Verify your email to use marketplace actions.</strong>
          <p className="mt-1 text-xs text-amber-100/75">
            You can still browse and complete your profile while verification is pending.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={status === "sending" || status === "sent"}
            onClick={resend}
            className="rounded-lg border border-amber-200/30 px-3 py-2 text-xs font-bold hover:bg-amber-200/10 disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : status === "sent" ? "Email sent" : "Resend email"}
          </button>
          <a href="/account/security" className="text-xs font-bold underline underline-offset-4">
            Account security
          </a>
        </div>
        {status === "error" && (
          <span role="alert" className="text-xs text-red-200">
            We could not send the email. Try again from Account security.
          </span>
        )}
      </div>
    </aside>
  );
}
