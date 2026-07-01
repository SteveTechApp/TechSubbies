import React, { useMemo, useState } from "react";
import {
  companyComplianceDocuments,
  companyEngineers,
  demoCompanyAccount,
  engineerGroups,
} from "../data/companyDashboard";
import {
  applyCompanyDocumentUpdate,
  filterEngineers,
  getCompanyDashboardSummary,
  getStatusLabel,
  getUniqueSkills,
  getVerificationLabel,
  removeEngineerFromCompany,
  updateEngineerStatus,
} from "../services/companyDashboardEngine";
import type {
  AuditLogEntry,
  BulkUpdateTargetMode,
  CompanyDocumentUpdateRequest,
  ComplianceDocument,
  EngineerFilter,
  EngineerProfile,
} from "../types/companyDashboard";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#07111f",
    color: "#ffffff",
    padding: "24px",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  header: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "16px",
    alignItems: "start",
    marginBottom: "18px",
  },
  eyebrow: {
    color: "#67e8f9",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    margin: "0 0 8px",
  },
  title: {
    color: "#ffffff",
    fontSize: "30px",
    lineHeight: 1.1,
    margin: "0 0 8px",
  },
  copy: {
    color: "rgba(255,255,255,0.76)",
    fontSize: "14px",
    lineHeight: 1.6,
    margin: 0,
  },
  pill: {
    border: "1px solid rgba(103,232,249,0.38)",
    background: "rgba(8,31,48,0.92)",
    color: "#67e8f9",
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "12px",
    marginBottom: "16px",
  },
  card: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.78)",
    borderRadius: "18px",
    padding: "16px",
    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
  },
  cardTitle: {
    color: "#67e8f9",
    fontSize: "13px",
    fontWeight: 800,
    margin: "0 0 8px",
  },
  metric: {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: 800,
    margin: "0 0 4px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.65fr) minmax(340px, 0.85fr)",
    gap: "14px",
    alignItems: "start",
  },
  toolbar: {
    display: "grid",
    gridTemplateColumns: "minmax(180px, 1fr) 160px 160px 180px",
    gap: "10px",
    marginBottom: "12px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "12px",
    border: "1px solid rgba(148,163,184,0.28)",
    background: "rgba(2,6,23,0.62)",
    color: "#ffffff",
    padding: "10px 12px",
    outline: "none",
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px",
  },
  button: {
    border: "1px solid rgba(103,232,249,0.42)",
    background: "rgba(8,47,73,0.7)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "9px 11px",
    cursor: "pointer",
    fontWeight: 700,
  },
  dangerButton: {
    border: "1px solid rgba(248,113,113,0.44)",
    background: "rgba(127,29,29,0.56)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "9px 11px",
    cursor: "pointer",
    fontWeight: 700,
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 8px",
  },
  th: {
    color: "#67e8f9",
    fontSize: "12px",
    textAlign: "left",
    padding: "0 10px 4px",
  },
  td: {
    background: "rgba(2,6,23,0.55)",
    borderTop: "1px solid rgba(148,163,184,0.14)",
    borderBottom: "1px solid rgba(148,163,184,0.14)",
    padding: "12px 10px",
    fontSize: "13px",
    verticalAlign: "top",
  },
  small: {
    color: "rgba(255,255,255,0.62)",
    fontSize: "12px",
    lineHeight: 1.45,
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(15,23,42,0.9)",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "4px 8px",
    fontSize: "11px",
    margin: "2px 4px 2px 0",
  },
  split: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  auditItem: {
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(2,6,23,0.38)",
    borderRadius: "14px",
    padding: "10px",
    marginTop: "8px",
  },
};

function readableToken(value: string): string {
  return value.split("_").join(" ");
}

function makeDemoDocument(): ComplianceDocument {
  const now = new Date();

  return {
    id: "doc-company-upload-" + String(now.getTime()),
    name: "New company insurance certificate",
    category: "insurance",
    scope: "company",
    owner: "company",
    appliesToEngineerIds: [],
    appliesToGroupIds: [],
    verificationStatus: "pending",
    issuedAt: now.toISOString().slice(0, 10),
    expiresAt: "2027-06-30",
    reference: "UPLOAD-" + String(now.getTime()),
    notes: "Demo Bulk resourcing company update. Replace with real upload and verification workflow later.",
  };
}

function StatusBadge({ status }: { status: EngineerProfile["status"] }) {
  return <span style={styles.chip}>{getStatusLabel(status)}</span>;
}

function VerificationBadge({ status }: { status: EngineerProfile["verificationStatus"] }) {
  return <span style={styles.chip}>{getVerificationLabel(status)}</span>;
}

function CompanyEngineerDashboardPage() {
  const [engineers, setEngineers] = useState<EngineerProfile[]>(companyEngineers);
  const [documents, setDocuments] = useState<ComplianceDocument[]>(companyComplianceDocuments);
  const [selectedEngineerId, setSelectedEngineerId] = useState<string>(companyEngineers[0] ? companyEngineers[0].id : "");
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [bulkMode, setBulkMode] = useState<BulkUpdateTargetMode>("all_engineers");
  const [selectedGroupId, setSelectedGroupId] = useState<string>(engineerGroups[0] ? engineerGroups[0].id : "");
  const [filters, setFilters] = useState<EngineerFilter>({
    searchText: "",
    groupId: "all",
    status: "all",
    verificationStatus: "all",
    skill: "all",
  });

  const summary = useMemo(
    () => getCompanyDashboardSummary(engineers, documents, engineerGroups.length),
    [engineers, documents],
  );

  const skills = useMemo(() => getUniqueSkills(engineers), [engineers]);

  const filteredEngineers = useMemo(
    () => filterEngineers(engineers, filters),
    [engineers, filters],
  );

  const selectedEngineer =
    engineers.find((engineer) => engineer.id === selectedEngineerId) ||
    filteredEngineers[0];

  function setFilterValue<K extends keyof EngineerFilter>(key: K, value: EngineerFilter[K]) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function applyDemoCompanyUpdate() {
    const targetGroupIds = bulkMode === "selected_groups" ? [selectedGroupId] : [];
    const targetEngineerIds = bulkMode === "selected_engineers" && selectedEngineer ? [selectedEngineer.id] : [];

    const request: CompanyDocumentUpdateRequest = {
      document: makeDemoDocument(),
      targetMode: bulkMode,
      targetGroupIds,
      targetEngineerIds,
      actorName: "Company admin",
    };

    const result = applyCompanyDocumentUpdate(engineers, documents, request);

    setDocuments(result.updatedDocuments);
    setAuditLog((current) => [result.auditLogEntry, ...current]);
  }

  function changeEngineerStatus(engineerId: string, status: EngineerProfile["status"]) {
    setEngineers((current) => updateEngineerStatus(current, engineerId, status));
  }

  function removeEngineer(engineerId: string) {
    setEngineers((current) => removeEngineerFromCompany(current, engineerId));
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <section>
          <p style={styles.eyebrow}>TechSubbies resourcing company account</p>
          <h1 style={styles.title}>Resourcing company engineer management dashboard</h1>
          <p style={styles.copy}>
            Manage all subcontracting engineers in one place, apply resourcing-company compliance updates, drill into groups,
            and control individual engineer records without removing engineer independence.
          </p>
        </section>
        <aside style={styles.pill}>
          {demoCompanyAccount.name} · {demoCompanyAccount.tier.toUpperCase()} tier
        </aside>
      </header>

      <section style={styles.metricGrid}>
        <article style={styles.card}>
          <p style={styles.cardTitle}>Total engineers</p>
          <p style={styles.metric}>{summary.totalEngineers}</p>
          <p style={styles.copy}>{summary.activeEngineers} active · {summary.pendingInvites} pending invite</p>
        </article>

        <article style={styles.card}>
          <p style={styles.cardTitle}>Available within 7 days</p>
          <p style={styles.metric}>{summary.availableNow}</p>
          <p style={styles.copy}>Based on linked or manually entered availability.</p>
        </article>

        <article style={styles.card}>
          <p style={styles.cardTitle}>Compliance attention</p>
          <p style={styles.metric}>{summary.profilesNeedingAttention}</p>
          <p style={styles.copy}>{summary.expiringDocuments} document(s) close to expiry.</p>
        </article>

        <article style={styles.card}>
          <p style={styles.cardTitle}>Groups</p>
          <p style={styles.metric}>{summary.groupCount}</p>
          <p style={styles.copy}>Use groups for bulk updates and targeted resourcing.</p>
        </article>
      </section>

      <section style={styles.layout}>
        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Engineer pool</h2>

          <div style={styles.toolbar}>
            <input
              style={styles.input}
              value={filters.searchText}
              onChange={(event) => setFilterValue("searchText", event.target.value)}
              placeholder="Search engineer, skill, location or note"
            />

            <select
              style={styles.input}
              value={filters.groupId}
              onChange={(event) => setFilterValue("groupId", event.target.value)}
            >
              <option value="all">All groups</option>
              {engineerGroups.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>

            <select
              style={styles.input}
              value={filters.status}
              onChange={(event) => setFilterValue("status", event.target.value as EngineerFilter["status"])}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
              <option value="suspended">Suspended</option>
              <option value="pending_invite">Pending invite</option>
              <option value="removed">Removed</option>
            </select>

            <select
              style={styles.input}
              value={filters.skill}
              onChange={(event) => setFilterValue("skill", event.target.value)}
            >
              <option value="all">All skills</option>
              {skills.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Engineer</th>
                <th style={styles.th}>Skills</th>
                <th style={styles.th}>Availability</th>
                <th style={styles.th}>Compliance</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEngineers.map((engineer) => (
                <tr key={engineer.id}>
                  <td style={styles.td}>
                    <strong>{engineer.displayName}</strong>
                    <div style={styles.small}>{engineer.location} · {engineer.travelRadiusMiles} miles</div>
                    <div style={styles.small}>{readableToken(engineer.ownershipModel)}</div>
                  </td>
                  <td style={styles.td}>
                    {engineer.skills.slice(0, 4).map((skill) => (
                      <span key={skill} style={styles.chip}>{skill}</span>
                    ))}
                  </td>
                  <td style={styles.td}>
                    <div>{engineer.nextAvailableDate || "Not set"}</div>
                    <div style={styles.small}>
                      Calendar sync: {engineer.calendarSyncEnabled ? "Enabled" : "Manual"}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <StatusBadge status={engineer.status} />
                    <VerificationBadge status={engineer.verificationStatus} />
                    <div style={styles.small}>{engineer.profileCompleteness}% complete</div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.buttonRow}>
                      <button style={styles.button} onClick={() => setSelectedEngineerId(engineer.id)}>
                        View
                      </button>
                      <button style={styles.button} onClick={() => changeEngineerStatus(engineer.id, "hidden")}>
                        Hide
                      </button>
                      <button style={styles.button} onClick={() => changeEngineerStatus(engineer.id, "active")}>
                        Activate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <aside>
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Bulk resourcing company update</h2>
            <p style={styles.copy}>
              Apply a new company document to all engineers, a selected group, or one individual profile.
            </p>

            <div style={{ marginTop: 12 }}>
              <label style={styles.small}>Update target</label>
              <select
                style={styles.input}
                value={bulkMode}
                onChange={(event) => setBulkMode(event.target.value as BulkUpdateTargetMode)}
              >
                <option value="all_engineers">All engineers</option>
                <option value="selected_groups">Selected group</option>
                <option value="selected_engineers">Selected engineer</option>
              </select>
            </div>

            <div style={{ marginTop: 10 }}>
              <label style={styles.small}>Group target</label>
              <select
                style={styles.input}
                value={selectedGroupId}
                onChange={(event) => setSelectedGroupId(event.target.value)}
              >
                {engineerGroups.map((group) => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.buttonRow}>
              <button style={styles.button} onClick={applyDemoCompanyUpdate}>
                Apply demo insurance update
              </button>
            </div>
          </section>

          {selectedEngineer ? (
            <section style={{ ...styles.card, marginTop: 14 }}>
              <h2 style={styles.cardTitle}>Selected engineer</h2>
              <p style={styles.metric}>{selectedEngineer.displayName}</p>
              <p style={styles.copy}>{selectedEngineer.companyNotes}</p>

              <div style={styles.split}>
                <div>
                  <p style={styles.small}>Status</p>
                  <StatusBadge status={selectedEngineer.status} />
                </div>
                <div>
                  <p style={styles.small}>Verification</p>
                  <VerificationBadge status={selectedEngineer.verificationStatus} />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                {selectedEngineer.specialistProfiles.map((profile) => (
                  <span key={profile} style={styles.chip}>{profile}</span>
                ))}
              </div>

              <div style={styles.buttonRow}>
                <button style={styles.button} onClick={() => changeEngineerStatus(selectedEngineer.id, "suspended")}>
                  Suspend
                </button>
                <button style={styles.button} onClick={() => changeEngineerStatus(selectedEngineer.id, "hidden")}>
                  Hide from matching
                </button>
                <button style={styles.button} onClick={() => changeEngineerStatus(selectedEngineer.id, "active")}>
                  Reactivate
                </button>
                <button style={styles.dangerButton} onClick={() => removeEngineer(selectedEngineer.id)}>
                  Remove from company
                </button>
              </div>
            </section>
          ) : null}

          <section style={{ ...styles.card, marginTop: 14 }}>
            <h2 style={styles.cardTitle}>Audit trail</h2>
            <p style={styles.copy}>
              Resourcing-company changes should always record who changed what and which engineer records were affected.
            </p>

            {auditLog.length === 0 ? (
              <p style={{ ...styles.small, marginTop: 10 }}>
                No changes in this session. Use the bulk update action to create a demo audit record.
              </p>
            ) : null}

            {auditLog.map((entry) => (
              <div key={entry.id} style={styles.auditItem}>
                <strong>{readableToken(entry.action)}</strong>
                <div style={styles.small}>{entry.notes}</div>
                <div style={styles.small}>By {entry.actorName} · {entry.createdAt}</div>
              </div>
            ))}
          </section>
        </aside>
      </section>
    </main>
  );
}

export { CompanyEngineerDashboardPage };
export default CompanyEngineerDashboardPage;

