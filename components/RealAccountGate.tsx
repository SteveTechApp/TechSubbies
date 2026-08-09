import React from "react";

export default function RealAccountGate({
  hasRealAccount,
  children,
}: {
  hasRealAccount: boolean;
  children: React.ReactNode;
}) {
  if (hasRealAccount) return <>{children}</>;

  return (
    <section className="min-h-[65vh] bg-slate-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-cyan-300/20 bg-slate-900 p-8">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">Real account required</p>
        <h1 className="mt-4 text-3xl font-bold">Account security is not part of demo access</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Demo sessions contain no real password or verified email. Sign in to a registered account to manage security settings.
        </p>
        <a href="/login" className="mt-6 inline-flex rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200">
          Sign in to a real account
        </a>
      </div>
    </section>
  );
}
