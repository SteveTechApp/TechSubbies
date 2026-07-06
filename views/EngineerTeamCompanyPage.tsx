import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Role, User } from "../types";
import apiService from "../services/apiService";

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(103,232,249,0.18)",
  background: "rgba(15,23,42,0.76)",
  borderRadius: 20,
  padding: 22,
  marginTop: 18,
};

const titleStyle: React.CSSProperties = {
  color: "#67e8f9",
  fontSize: 20,
  fontWeight: 900,
  margin: "0 0 8px",
};

const copyStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.76)",
  lineHeight: 1.6,
  margin: "0 0 14px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 360,
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(103,232,249,0.3)",
  background: "rgba(2,6,23,0.6)",
  color: "#fff",
};

const buttonStyle: React.CSSProperties = {
  border: "1px solid rgba(103,232,249,0.35)",
  background: "rgba(8,47,73,0.42)",
  color: "#ffffff",
  borderRadius: 999,
  padding: "10px 18px",
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.2)",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "10px 0",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

interface RequestSummary {
  id: string;
  requesterId?: string;
  partnerId?: string;
  engineerId?: string;
  resourcingCompanyId?: string;
  status: string;
}

export function EngineerTeamCompanyPage() {
  const { user } = useAuth();

  const [partnerStatus, setPartnerStatus] = useState<{
    incoming: RequestSummary[];
    outgoing: RequestSummary[];
    partner: User | null;
  }>({ incoming: [], outgoing: [], partner: null });

  const [companyRequests, setCompanyRequests] = useState<RequestSummary[]>([]);
  const [resourcingCompanies, setResourcingCompanies] = useState<User[]>([]);
  const [attachedCompany, setAttachedCompany] = useState<User | null>(null);

  const [partnerEmailInput, setPartnerEmailInput] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const [loading, setLoading] = useState(true);
  const [partnerBusy, setPartnerBusy] = useState(false);
  const [companyBusy, setCompanyBusy] = useState(false);
  const [partnerMessage, setPartnerMessage] = useState("");
  const [companyMessage, setCompanyMessage] = useState("");

  const loadAll = async () => {
    setLoading(true);
    const [status, myCompanyRequests, companies] = await Promise.all([
      apiService.getMyPartnershipStatus(),
      apiService.getMyCompanyAttachmentRequests(),
      apiService.listResourcingCompanies(),
    ]);
    setPartnerStatus(status);
    setCompanyRequests(myCompanyRequests);
    setResourcingCompanies(companies);

    const accepted = myCompanyRequests.find((r: RequestSummary) => r.status === "accepted");
    if (accepted?.resourcingCompanyId) {
      const company = await apiService.getUserById(accepted.resourcingCompanyId);
      setAttachedCompany(company);
    } else {
      setAttachedCompany(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && user.role === Role.ENGINEER) {
      loadAll();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!user) {
    return (
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #06111f 0%, #081827 55%, #020617 100%)", color: "#fff", padding: 28 }}>
        <p>Please <a href="/login" style={{ color: "#67e8f9" }}>sign in</a> to manage your team and company settings.</p>
      </main>
    );
  }

  if (user.role !== Role.ENGINEER) {
    return (
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #06111f 0%, #081827 55%, #020617 100%)", color: "#fff", padding: 28 }}>
        <p>This page is only available for engineer accounts.</p>
      </main>
    );
  }

  const handleSendPartnerRequest = async () => {
    setPartnerBusy(true);
    setPartnerMessage("");
    try {
      const result = await apiService.requestPartnership(partnerEmailInput.trim());
      setPartnerMessage(result.status === "accepted" ? "You're now teamed up!" : "Partner request sent.");
      setPartnerEmailInput("");
      await loadAll();
    } catch (err: any) {
      setPartnerMessage(err.message || "Could not send that request.");
    } finally {
      setPartnerBusy(false);
    }
  };

  const handleRespondPartner = async (requestId: string, accept: boolean) => {
    setPartnerBusy(true);
    setPartnerMessage("");
    try {
      await apiService.respondToPartnershipRequest(requestId, accept);
      setPartnerMessage(accept ? "Partner request accepted." : "Partner request declined.");
      await loadAll();
    } catch (err: any) {
      setPartnerMessage(err.message || "Could not respond to that request.");
    } finally {
      setPartnerBusy(false);
    }
  };

  const handleRemovePartner = async () => {
    setPartnerBusy(true);
    setPartnerMessage("");
    try {
      await apiService.removePartnership();
      setPartnerMessage("Partner removed.");
      await loadAll();
    } catch (err: any) {
      setPartnerMessage(err.message || "Could not remove your partner.");
    } finally {
      setPartnerBusy(false);
    }
  };

  const handleRequestCompany = async () => {
    if (!selectedCompanyId) return;
    setCompanyBusy(true);
    setCompanyMessage("");
    try {
      await apiService.requestCompanyAttachment(selectedCompanyId);
      setCompanyMessage("Request sent - waiting for the company to approve.");
      await loadAll();
    } catch (err: any) {
      setCompanyMessage(err.message || "Could not send that request.");
    } finally {
      setCompanyBusy(false);
    }
  };

  const pendingOutgoingCompanyRequest = companyRequests.find((r) => r.status === "pending");

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #06111f 0%, #081827 55%, #020617 100%)", color: "#ffffff", padding: 28, fontFamily: "Inter, system-ui, sans-serif" }}>
      <section style={{ maxWidth: 820, margin: "0 auto" }}>
        <a href="/engineer/profile" style={{ color: "#67e8f9", textDecoration: "none", fontWeight: 800 }}>Back to Profile Hub</a>
        <p style={{ color: "#67e8f9", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.14em", marginTop: 24 }}>Subcontractors</p>
        <h1 style={{ fontSize: 34, marginBottom: 10 }}>Team & Resourcing Company</h1>
        <p style={copyStyle}>
          Pair up with another engineer as a team, or attach yourself to a resourcing company.
        </p>

        {loading ? (
          <p style={copyStyle}>Loading...</p>
        ) : (
          <>
            {/* --- Partner section --- */}
            <div style={cardStyle}>
              <h2 style={titleStyle}>Team partner</h2>
              <p style={copyStyle}>
                Team up with another engineer. Once you both accept, if a customer search matches you both, you'll be
                shown together as a team.
              </p>

              {partnerMessage && <p style={{ color: "#67e8f9", marginBottom: 12 }}>{partnerMessage}</p>}

              {partnerStatus.partner ? (
                <div>
                  <p style={{ color: "#fff", fontWeight: 700 }}>
                    Teamed with: {partnerStatus.partner.profile.name}
                  </p>
                  <button style={secondaryButtonStyle} disabled={partnerBusy} onClick={handleRemovePartner}>
                    Remove partner
                  </button>
                </div>
              ) : (
                <>
                  {partnerStatus.incoming.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <p style={{ fontWeight: 700, marginBottom: 6 }}>Incoming requests</p>
                      {partnerStatus.incoming.map((req) => (
                        <div key={req.id} style={rowStyle}>
                          <span>Partner request pending your response</span>
                          <span style={{ display: "flex", gap: 8 }}>
                            <button style={buttonStyle} disabled={partnerBusy} onClick={() => handleRespondPartner(req.id, true)}>
                              Accept
                            </button>
                            <button style={secondaryButtonStyle} disabled={partnerBusy} onClick={() => handleRespondPartner(req.id, false)}>
                              Decline
                            </button>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {partnerStatus.outgoing.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <p style={{ fontWeight: 700, marginBottom: 6 }}>Waiting for a response</p>
                      {partnerStatus.outgoing.map((req) => (
                        <div key={req.id} style={rowStyle}>
                          <span>Request sent - waiting for them to accept</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p style={{ fontWeight: 700, marginBottom: 6 }}>Send a partner request</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <input
                      style={inputStyle}
                      type="email"
                      placeholder="partner@example.com"
                      value={partnerEmailInput}
                      onChange={(e) => setPartnerEmailInput(e.target.value)}
                    />
                    <button style={buttonStyle} disabled={partnerBusy || !partnerEmailInput} onClick={handleSendPartnerRequest}>
                      Send request
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* --- Resourcing company section --- */}
            <div style={cardStyle}>
              <h2 style={titleStyle}>Resourcing company</h2>
              <p style={copyStyle}>
                Attach yourself to a resourcing company. They'll need to approve your request before you appear under
                their managed engineers.
              </p>

              {companyMessage && <p style={{ color: "#67e8f9", marginBottom: 12 }}>{companyMessage}</p>}

              {attachedCompany ? (
                <p style={{ color: "#fff", fontWeight: 700 }}>
                  Attached to: {attachedCompany.profile.name}
                </p>
              ) : pendingOutgoingCompanyRequest ? (
                <p style={copyStyle}>Request pending - waiting for the company to approve.</p>
              ) : (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <select
                    style={{ ...inputStyle, maxWidth: 320 }}
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                  >
                    <option value="">Select a resourcing company...</option>
                    {resourcingCompanies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.profile.name}
                      </option>
                    ))}
                  </select>
                  <button style={buttonStyle} disabled={companyBusy || !selectedCompanyId} onClick={handleRequestCompany}>
                    Request to join
                  </button>
                </div>
              )}

              {resourcingCompanies.length === 0 && !attachedCompany && !pendingOutgoingCompanyRequest && (
                <p style={{ ...copyStyle, marginTop: 10 }}>No resourcing companies are registered on the backend yet.</p>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default EngineerTeamCompanyPage;
