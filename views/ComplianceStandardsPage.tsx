import React, { useMemo, useState } from "react";
import {
  COMPLIANCE_CREDENTIALS,
  COMPLIANCE_REQUIREMENT_LEVELS,
  ROLE_COMPLIANCE_REQUIREMENTS,
  TRUST_BADGES,
} from "../data/compliance";
import { ComplianceDocumentCategory } from "../types/compliance";

interface ComplianceStandardsPageProps {
  onNavigate?: (page: unknown) => void;
}

const categoryLabels: Record<ComplianceDocumentCategory, string> = {
  SAFETY_SITE_ACCESS: "Safety / site access",
  AV_INDUSTRY: "AV industry",
  IT_NETWORKING_SECURITY: "IT / networking / security",
  MANUFACTURER_PLATFORM: "Manufacturer / platform",
  PROJECT_MANAGEMENT: "Project management",
  INSURANCE: "Insurance",
  COMPANY_QUALITY_STANDARD: "Company quality standards",
  REGIONAL_COMPLIANCE: "Regional compliance",
  BACKGROUND_CHECK: "Background checks",
  WORK_EVIDENCE: "Work evidence",
};

const categoryOrder: ComplianceDocumentCategory[] = [
  "SAFETY_SITE_ACCESS",
  "AV_INDUSTRY",
  "IT_NETWORKING_SECURITY",
  "MANUFACTURER_PLATFORM",
  "PROJECT_MANAGEMENT",
  "INSURANCE",
  "COMPANY_QUALITY_STANDARD",
  "REGIONAL_COMPLIANCE",
  "BACKGROUND_CHECK",
  "WORK_EVIDENCE",
];

const cardClass =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

function ComplianceStandardsPage(_props: ComplianceStandardsPageProps) {
  const [activeCategory, setActiveCategory] =
    useState<ComplianceDocumentCategory>("SAFETY_SITE_ACCESS");

  const filteredCredentials = useMemo(() => {
    return COMPLIANCE_CREDENTIALS.filter((credential) => credential.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-5xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
            TechSubbies compliance taxonomy
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Certificates should improve trust, not block access unnecessarily.
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Safety, industry, manufacturer, IT, project management, insurance and company-quality
            standards are handled as role-specific and project-specific evidence. Basic access stays
            open. Mandatory checks are used only when the role, customer, site or region genuinely
            requires them.
          </p>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {COMPLIANCE_REQUIREMENT_LEVELS.map((level) => (
            <article key={level.key} className={cardClass}>
              <h2 className="text-base font-black text-slate-950">{level.label}</h2>
              <p className="mt-2 text-sm text-slate-600">{level.description}</p>
              <p className="mt-3 text-sm font-bold text-blue-700">
                Score weight: {level.matchScoreWeight}
              </p>
            </article>
          ))}
        </section>

        <div className="mb-8 grid gap-3 md:grid-cols-5">
          {categoryOrder.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${
                activeCategory === category
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        <section className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCredentials.map((credential) => (
            <article key={credential.key} className={cardClass}>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                  {credential.defaultRequirementLevel.replaceAll("_", " ")}
                </span>
                {credential.requiresOfficialDocument && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                    Official evidence
                  </span>
                )}
                {credential.expires && (
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-700">
                    Expiry tracked
                  </span>
                )}
              </div>

              <h2 className="mt-4 text-xl font-black text-slate-950">{credential.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{credential.description}</p>

              <div className="mt-4">
                <p className="text-sm font-black text-slate-900">Examples</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {credential.examples.map((example) => (
                    <li key={example}>€¢ {example}</li>
                  ))}
                </ul>
              </div>

              <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                {credential.notes}
              </p>
            </article>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-black text-slate-950">
            Role-specific requirement examples
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {ROLE_COMPLIANCE_REQUIREMENTS.map((role) => (
              <article key={role.roleKey} className={cardClass}>
                <h3 className="text-xl font-black text-slate-950">{role.roleTitle}</h3>
                <p className="mt-2 text-sm text-slate-600">{role.requirementSummary}</p>

                <div className="mt-4 space-y-4">
                  {role.requirements.map((requirement) => (
                    <div
                      key={`${role.roleKey}-${requirement.requirementLevel}-${requirement.credentialKeys.join("-")}`}
                      className="rounded-xl bg-slate-50 p-4"
                    >
                      <p className="text-sm font-black text-blue-700">
                        {requirement.requirementLevel.replaceAll("_", " ")}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{requirement.reason}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {requirement.credentialKeys.map((credentialKey) => {
                          const credential = COMPLIANCE_CREDENTIALS.find(
                            (item) => item.key === credentialKey
                          );

                          return (
                            <span
                              key={credentialKey}
                              className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700"
                            >
                              {credential?.title ?? credentialKey}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-2xl font-black text-emerald-950">Trust badges</h2>
          <p className="mt-2 text-emerald-900">
            Trust badges should be awarded from verified documents and evidence, not just from
            self-declared claims.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            {TRUST_BADGES.map((badge) => (
              <article key={badge.key} className="rounded-xl bg-white p-4">
                <h3 className="font-black text-slate-950">{badge.label}</h3>
                <p className="mt-2 text-sm text-slate-600">{badge.description}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export { ComplianceStandardsPage };
export default ComplianceStandardsPage;
