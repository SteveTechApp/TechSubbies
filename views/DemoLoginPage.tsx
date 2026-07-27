import React, { useState } from "react";
import {
  isDemoAccessEnabled,
  setDemoSession,
  validateDemoLogin,
  type DemoSession,
} from "../data/demoAccounts";
import apiService from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import { dashboardPathForRole } from "../utils/accountRoutes";

type DemoLoginPageProps = {
  onSignedIn?: (session: DemoSession) => void;
};

function inputClass() {
  return "w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300";
}

export default function DemoLoginPage({ onSignedIn }: DemoLoginPageProps) {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const realUser = await apiService.loginWithPassword(email, password);
      setUser(realUser);
      window.location.href = dashboardPathForRole(realUser.role);
      return;
    } catch (reason) {
      // Only use the development fallback when the entered credentials
      // actually belong to a demo account. This preserves useful backend
      // errors for developers signing in with real accounts.
      const account = isDemoAccessEnabled ? validateDemoLogin(email, password) : null;
      if (account) {
        const session = setDemoSession(account);
        if (onSignedIn) onSignedIn(session);
        else window.location.href = "/opportunity-intake";
        return;
      }
      setError(reason instanceof Error ? reason.message : "Login failed. Check your email and password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
        <section className="rounded-3xl border border-cyan-300/20 bg-slate-900 p-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
            TechSubbies secure access
          </p>
          <h1 className="mt-4 text-3xl font-bold text-white">
            Sign in to access protected tools
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Public pages stay open. Project intake, matching tools, dashboards, engineer records and admin areas require a signed-in session.
          </p>

          {isDemoAccessEnabled && <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
            <h2 className="font-bold text-cyan-200">Demo admin account</h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              <div>Email: <span className="font-mono text-white">admin@techsubbies.demo</span></div>
              <div>Password: <span className="font-mono text-white">password</span></div>
              <div>Role: <span className="font-mono text-white">Admin</span></div>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              This is a local development login. If you created a real account through one of the sign-up wizards, sign in with that email and password instead.
            </p>
            <button
              type="button"
              onClick={() => {
                setEmail("admin@techsubbies.demo");
                setPassword("password");
                setError("");
              }}
              className="mt-4 rounded-lg border border-cyan-200/30 px-3 py-2 text-xs font-bold text-cyan-100 hover:bg-cyan-200/10"
            >
              Use demo credentials
            </button>
          </div>}
        </section>

        <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-xl font-bold text-cyan-300">Login</h2>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-300/30 bg-red-300/10 p-4 text-sm font-semibold text-red-100">
              {error}
            </div>
          )}

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-200">Email</span>
            <input
              required
              type="email"
              className={`${inputClass()} mt-2`}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-200">Password</span>
            <input
              required
              className={`${inputClass()} mt-2`}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          <a
            href="/forgot-password"
            className="mt-4 block text-center text-sm font-semibold text-cyan-200 hover:text-cyan-100"
          >
            Forgot password?
          </a>

          <a
            href="/"
            className="mt-4 block text-center text-sm font-semibold text-slate-400 hover:text-cyan-200"
          >
            Return to public site
          </a>
        </form>
      </div>
    </div>
  );
}
