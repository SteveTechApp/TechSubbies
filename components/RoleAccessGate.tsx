import React from "react";
import { Role } from "../types";

type RoleAccessGateProps = {
  currentRole?: string;
  allowedRoles: Role[];
  children: React.ReactNode;
};

export function canAccessRole(currentRole: string | undefined, allowedRoles: Role[]) {
  return currentRole === Role.ADMIN || Boolean(currentRole && allowedRoles.includes(currentRole as Role));
}

export default function RoleAccessGate({ currentRole, allowedRoles, children }: RoleAccessGateProps) {
  if (canAccessRole(currentRole, allowedRoles)) return <>{children}</>;

  return (
    <section className="min-h-[65vh] bg-slate-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-amber-300/20 bg-slate-900 p-8">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200">Different account role required</p>
        <h1 className="mt-4 text-3xl font-bold">This tool is not available for your account</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          This workflow is designed for {allowedRoles.join(" or ")} accounts. Your signed-in role is{" "}
          <strong className="text-slate-200">{currentRole || "unknown"}</strong>.
        </p>
        <a href="/" className="mt-6 inline-flex rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-200">
          Return to your dashboard
        </a>
      </div>
    </section>
  );
}
