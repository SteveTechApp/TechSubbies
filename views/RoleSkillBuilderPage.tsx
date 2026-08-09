import React, { useMemo, useState } from "react";
import { roleSkillTaxonomy, commonProductAndBrandTags } from "../data/roleSkillTaxonomy";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/apiService";

type RoleMarket = "AV" | "IT" | "Hybrid";

type Skill = {
  id: string;
  label: string;
  group: string;
  required: boolean;
  tags: string[];
};

type Role = {
  id: string;
  title: string;
  market: RoleMarket;
  family: string;
  summary: string;
  tags: string[];
  skills: Skill[];
  aliases?: string[];
  responsibilities?: string[];
  knowledgeRequirements?: Array<{ topic: string; expectation: string; suggestedTags: string[]; prerequisiteEligible: boolean }>;
  boundaries?: string[];
  distinguishedFrom?: Array<{ roleId: string; distinction: string }>;
};

const legacyRoles: Role[] = [
  {
    id: "av-installer",
    title: "AV Installation Engineer",
    market: "AV",
    family: "Installation",
    summary: "Installs displays, cabling, racks, containment and basic AV signal infrastructure.",
    tags: ["HDMI", "HDBaseT", "Samsung", "LG", "WyreStorm", "Extron"],
    skills: [
      { id: "drawings", label: "Read and follow site drawings", group: "Site practice", required: true, tags: [] },
      { id: "safe-fixing", label: "Safe fixing, drilling and display mounting", group: "Site practice", required: true, tags: ["VESA"] },
      { id: "cat6", label: "Terminate and test Cat6/Cat6A", group: "Cabling", required: true, tags: ["Cat6", "Cat6A"] },
      { id: "rack", label: "Rack dressing and device labelling", group: "Rack work", required: false, tags: ["Rack build"] },
      { id: "signal-test", label: "Basic HDMI, HDBaseT and USB-C signal testing", group: "Signal", required: true, tags: ["HDMI", "HDBaseT", "USB-C"] }
    ]
  },
  {
    id: "avoip",
    title: "AV-over-IP Commissioning Engineer",
    market: "Hybrid",
    family: "Commissioning",
    summary: "Commissions AVoIP systems using endpoints, controllers, VLANs and multicast-aware switching.",
    tags: ["AVoIP", "WyreStorm", "Cisco", "Netgear", "Ubiquiti", "IGMP", "VLAN"],
    skills: [
      { id: "vlans", label: "Configure or validate VLANs", group: "Network readiness", required: true, tags: ["VLAN", "Cisco", "Netgear"] },
      { id: "igmp", label: "Validate IGMP snooping and multicast behaviour", group: "Network readiness", required: true, tags: ["IGMP", "Multicast"] },
      { id: "endpoints", label: "Set up encoders, decoders and controller", group: "AVoIP platform", required: true, tags: ["AVoIP"] },
      { id: "edid", label: "Resolve EDID, HDCP, resolution and scaling issues", group: "Signal", required: true, tags: ["EDID", "HDCP"] },
      { id: "handover", label: "Produce commissioning and handover documentation", group: "Handover", required: false, tags: [] }
    ]
  },
  {
    id: "uc-room",
    title: "UC Room Engineer",
    market: "Hybrid",
    family: "UC / collaboration",
    summary: "Installs and supports Teams Rooms, Zoom Rooms, cameras, microphones, speakers and USB paths.",
    tags: ["Teams Rooms", "Zoom Rooms", "Logitech", "Yealink", "Shure", "Biamp", "USB"],
    skills: [
      { id: "teams", label: "Set up and test Microsoft Teams Rooms", group: "UC platforms", required: true, tags: ["Teams Rooms"] },
      { id: "zoom", label: "Set up and test Zoom Rooms", group: "UC platforms", required: false, tags: ["Zoom Rooms"] },
      { id: "usb", label: "Diagnose USB host, hub, cable and extension issues", group: "USB", required: true, tags: ["USB"] },
      { id: "camera", label: "Set up cameras and framing", group: "Camera", required: true, tags: ["Logitech", "Yealink"] },
      { id: "audio", label: "Test microphones, speakers, echo and speech pickup", group: "Audio", required: true, tags: ["Shure", "Biamp"] }
    ]
  },
  {
    id: "network",
    title: "Network Engineer",
    market: "IT",
    family: "Networking",
    summary: "Configures wired networks, switching, VLANs, DHCP, DNS and basic routing support.",
    tags: ["Cisco", "Meraki", "Ubiquiti", "Aruba", "Fortinet", "VLAN", "DHCP", "DNS"],
    skills: [
      { id: "switching", label: "Configure VLANs, trunks and access ports", group: "Switching", required: true, tags: ["VLAN"] },
      { id: "dhcp", label: "Diagnose DHCP, DNS and gateway issues", group: "IP services", required: true, tags: ["DHCP", "DNS"] },
      { id: "stp", label: "Understand STP, LACP and loop prevention", group: "Switching", required: false, tags: ["STP", "LACP"] },
      { id: "testing", label: "Use ping, traceroute and packet capture", group: "Testing", required: true, tags: ["Wireshark"] },
      { id: "docs", label: "Document network changes and IP schedules", group: "Documentation", required: false, tags: [] }
    ]
  },
  {
    id: "led",
    title: "LED Wall Technician",
    market: "AV",
    family: "LED",
    summary: "Builds, maps, tests and supports LED walls, processors, cabinets and signal paths.",
    tags: ["Novastar", "Brompton", "Colorlight", "LED", "HDMI"],
    skills: [
      { id: "cabinet", label: "Handle, fit and align LED cabinets", group: "Physical build", required: true, tags: ["LED"] },
      { id: "power", label: "Understand LED power loading and safety", group: "Power", required: true, tags: [] },
      { id: "mapping", label: "Pixel mapping and test patterns", group: "Processing", required: true, tags: ["Novastar", "Brompton"] },
      { id: "processor", label: "Set up common LED processors", group: "Processing", required: true, tags: ["Novastar", "Brompton", "Colorlight"] },
      { id: "fault", label: "Fault-find modules, cards, signal and content issues", group: "Support", required: false, tags: [] }
    ]
  }
];

const commonTags = commonProductAndBrandTags;

// Keep the UI driven by the canonical taxonomy. The original local seed above is
// retained only for backward-compatible ids in saved browser drafts.
const availableRoles: Role[] = roleSkillTaxonomy.map((role) => ({
  id: role.id,
  title: role.title,
  market: role.market === "av" ? "AV" : role.market === "it" ? "IT" : "Hybrid",
  family: role.family,
  summary: role.summary,
  tags: role.recommendedTags,
  skills: role.skillGroups.flatMap((group) => group.skills.map((skill) => ({
    id: skill.id,
    label: skill.label,
    group: group.title,
    required: skill.requiredForGoodMatch,
    tags: skill.suggestedTags,
  }))),
  aliases: role.aliases || [],
  responsibilities: role.coreResponsibilities || [],
  knowledgeRequirements: role.knowledgeRequirements || [],
  boundaries: role.roleBoundaries || [],
  distinguishedFrom: role.distinguishedFrom || [],
}));

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #050b14 0%, #08111f 52%, #020617 100%)",
    color: "#ffffff",
    padding: "24px",
    fontFamily: "Inter, system-ui, sans-serif",
    overflowX: "hidden"
  },
  shell: { maxWidth: "1500px", margin: "0 auto" },
  header: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "16px",
    alignItems: "start",
    marginBottom: "18px"
  },
  eyebrow: { color: "#67e8f9", fontSize: 12, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px" },
  title: { color: "#ffffff", fontSize: 34, lineHeight: 1.08, margin: "0 0 10px" },
  copy: { color: "rgba(255,255,255,0.74)", fontSize: 14, lineHeight: 1.55, margin: 0 },
  link: {
    display: "inline-flex",
    border: "1px solid rgba(103,232,249,0.42)",
    background: "rgba(8,47,73,0.72)",
    color: "#ffffff",
    borderRadius: 999,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 800,
    textDecoration: "none"
  },
  filterCard: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.78)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14
  },
  filterGrid: { display: "grid", gridTemplateColumns: "minmax(220px, 1fr) 180px", gap: 10 },
  input: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 13,
    border: "1px solid rgba(148,163,184,0.28)",
    background: "rgba(2,6,23,0.62)",
    color: "#ffffff",
    padding: "11px 12px",
    outline: "none"
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(260px, 330px) minmax(0, 1fr) minmax(300px, 360px)",
    gap: 14,
    alignItems: "start"
  },
  card: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.78)",
    borderRadius: 20,
    padding: 16
  },
  cardTitle: { color: "#67e8f9", fontSize: 14, fontWeight: 900, margin: "0 0 10px" },
  roleButton: {
    width: "100%",
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(2,6,23,0.42)",
    color: "#ffffff",
    borderRadius: 14,
    padding: 11,
    textAlign: "left",
    cursor: "pointer",
    marginBottom: 8
  },
  roleButtonActive: {
    width: "100%",
    border: "2px solid #67e8f9",
    background: "rgba(8,47,73,0.78)",
    color: "#ffffff",
    borderRadius: 14,
    padding: 10,
    textAlign: "left",
    cursor: "pointer",
    marginBottom: 8
  },
  skillRow: {
    borderTop: "1px solid rgba(148,163,184,0.13)",
    paddingTop: 12,
    marginTop: 12
  },
  ratingRow: { display: "flex", gap: 5, flexWrap: "wrap", marginTop: 10 },
  ratingButton: {
    width: 34,
    height: 32,
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,0.24)",
    background: "rgba(15,23,42,0.72)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 900
  },
  ratingButtonActive: {
    width: 34,
    height: 32,
    borderRadius: 10,
    border: "2px solid #67e8f9",
    background: "rgba(8,47,73,0.92)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 900
  },
  pill: {
    display: "inline-flex",
    border: "1px solid rgba(103,232,249,0.34)",
    background: "rgba(8,47,73,0.56)",
    color: "#67e8f9",
    borderRadius: 999,
    padding: "6px 9px",
    fontSize: 11,
    fontWeight: 900,
    margin: "4px 5px 0 0"
  },
  metricGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  metric: {
    border: "1px solid rgba(148,163,184,0.15)",
    background: "rgba(2,6,23,0.42)",
    borderRadius: 15,
    padding: 12
  },
  metricValue: { color: "#ffffff", fontSize: 24, fontWeight: 900, margin: "0 0 4px" },
  metricLabel: { color: "rgba(255,255,255,0.62)", fontSize: 12, margin: 0 },
  tagButton: {
    border: "1px solid rgba(148,163,184,0.20)",
    background: "rgba(15,23,42,0.70)",
    color: "#ffffff",
    borderRadius: 999,
    padding: "6px 8px",
    fontSize: 11,
    cursor: "pointer",
    margin: "4px 5px 0 0"
  }
};

function RoleSkillBuilderPage() {
  const { user, setUser } = useAuth();
  const [search, setSearch] = useState("");
  const [market, setMarket] = useState("All");
  const [selectedRole, setSelectedRole] = useState<Role>(availableRoles[0]);
  const [overallCapability, setOverallCapability] = useState<"assist" | "deliver" | "diagnose" | "lead">("deliver");
  const [capabilityClaims, setCapabilityClaims] = useState<Record<string, "independent" | "support" | "not-offered">>({});
  const [tags, setTags] = useState<string[]>([]);
  const [productExperience, setProductExperience] = useState<Record<string, "aware" | "installed" | "configured" | "commissioned" | "programmed" | "certified">>({});
  const [evidenceNote, setEvidenceNote] = useState("");
  const [customKeyword, setCustomKeyword] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const filteredRoles = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return availableRoles.filter((role) => {
      if (market !== "All" && role.market !== market) return false;
      if (!searchText) return true;

      const haystack = [role.title, role.market, role.family, role.summary, role.tags.join(" "), (role.aliases || []).join(" "), (role.responsibilities || []).join(" "), (role.knowledgeRequirements || []).map((item) => `${item.topic} ${item.expectation} ${item.suggestedTags.join(" ")}`).join(" "), role.skills.map((skill) => skill.label).join(" ")].join(" ").toLowerCase();
      return haystack.includes(searchText);
    });
  }, [search, market]);

  const getClaim = (skillId: string) => capabilityClaims[skillId] || "not-offered";
  const independentCount = selectedRole.skills.filter((skill) => getClaim(skill.id) === "independent").length;
  const supportedCount = selectedRole.skills.filter((skill) => getClaim(skill.id) === "support").length;
  const missingRequired = selectedRole.skills.filter((skill) => skill.required && getClaim(skill.id) !== "independent");

  function addTag(tag: string) {
    const clean = tag.trim();
    if (!clean) return;
    setTags((current) => current.includes(clean) ? current : [...current, clean]);
    setProductExperience((current) => ({ ...current, [clean]: current[clean] || "installed" }));
  }

  async function saveRoleProfile() {
    if (!user) { setSaveStatus("Sign in with an engineer account to save this profile."); return; }
    setSaveStatus("Saving…");
    const profile = {
      roleId: selectedRole.id,
      roleTitle: selectedRole.title,
      overallCapability,
      capabilities: selectedRole.skills.map((skill) => ({ skillId: skill.id, claim: getClaim(skill.id) })),
      ratings: selectedRole.skills.map((skill) => ({ skillId: skill.id, rating: getClaim(skill.id) === "independent" ? 3 : getClaim(skill.id) === "support" ? 2 : 0, willingToDo: getClaim(skill.id) !== "not-offered", needsSupervision: getClaim(skill.id) === "support", canLead: overallCapability === "lead", tags: skill.tags })),
      productTags: tags,
      productExperience,
      evidence: evidenceNote ? [{ type: "project-or-credential", note: evidenceNote }] : [],
      updatedAt: new Date().toISOString(),
    };
    const existing = ((user.profile as any).roleSkillProfiles || []).filter((item: any) => item.roleId !== selectedRole.id);
    try {
      const updated = await apiService.updateMyProfile({ roleSkillProfiles: [...existing, profile] });
      if (!updated) throw new Error("A backend-backed account is required.");
      setUser(updated);
      setSaveStatus("Saved to your profile.");
    } catch (error: any) { setSaveStatus(error.message || "Could not save profile."); }
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <section>
            <p style={styles.eyebrow}>TechSubbies role skill builder</p>
            <h1 style={styles.title}>Show what you can deliver without completing an examination.</h1>
            <p style={styles.copy}>Choose the role, confirm a few distinguishing capabilities, and record practical product experience plus one supporting example.</p>
          </section>
          <a href="/engineer/profile-setup" style={styles.link}>Back to profile setup</a>
        </header>

        <section style={styles.filterCard}>
          <p style={styles.cardTitle}>Find the right role</p>
          <div style={styles.filterGrid}>
            <input style={styles.input} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search role, skill, product or platform" />
            <select style={styles.input} value={market} onChange={(event) => setMarket(event.target.value)}>
              <option>All</option>
              <option>AV</option>
              <option>IT</option>
              <option>Hybrid</option>
            </select>
          </div>
        </section>

        <section style={styles.mainGrid}>
          <aside style={styles.card}>
            <p style={styles.cardTitle}>Role results</p>
            {filteredRoles.map((role) => (
              <button key={role.id} type="button" style={role.id === selectedRole.id ? styles.roleButtonActive : styles.roleButton} onClick={() => { setSelectedRole(role); setCapabilityClaims({}); setTags([]); setProductExperience({}); setEvidenceNote(""); }}>
                <strong>{role.title}</strong>
                <br />
                <span style={{ color: "rgba(255,255,255,0.62)", fontSize: 12 }}>{role.market} · {role.family}</span>
                <br />
                <span style={{ color: "rgba(255,255,255,0.62)", fontSize: 12 }}>{role.summary}</span>
              </button>
            ))}
          </aside>

          <section style={styles.card}>
            <p style={styles.eyebrow}>Selected role</p>
            <h2 style={{ fontSize: 28, margin: "0 0 10px" }}>{selectedRole.title}</h2>
            <p style={styles.copy}>{selectedRole.summary}</p>
            {(selectedRole.responsibilities || []).length > 0 && <div style={{ marginTop: 10 }}>{selectedRole.responsibilities!.map((item) => <span key={item} style={styles.pill}>{item}</span>)}</div>}
            {(selectedRole.boundaries || []).length > 0 && <div style={{ marginTop: 12, border: "1px solid rgba(251,191,36,.3)", borderRadius: 12, padding: 12 }}><p style={{ ...styles.cardTitle, color: "#fcd34d" }}>Role boundary</p>{selectedRole.boundaries!.map((item) => <p key={item} style={styles.copy}>• {item}</p>)}</div>}
            {(selectedRole.knowledgeRequirements || []).length > 0 && <div style={{ marginTop: 14 }}><p style={styles.cardTitle}>Specific knowledge expected</p>{selectedRole.knowledgeRequirements!.map((item) => <article key={item.topic} style={styles.skillRow}><h3 style={{ margin: "0 0 4px", fontSize: 15 }}>{item.topic}</h3><p style={styles.copy}>{item.expectation}{item.prerequisiteEligible ? " · May be set as a client prerequisite" : ""}</p><div>{item.suggestedTags.map((tag) => <button key={tag} type="button" style={styles.tagButton} onClick={() => addTag(tag)}>+ {tag}</button>)}</div></article>)}</div>}
            <div style={{ marginTop: 8 }}>
              <span style={styles.pill}>{selectedRole.market}</span>
              <span style={styles.pill}>{selectedRole.family}</span>
            </div>

            <div style={{ marginTop: 14 }}>
              <p style={styles.cardTitle}>At what level can you perform this role?</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6 }}>
                {([['assist','Assist','Under instruction'],['deliver','Deliver','Independent normal work'],['diagnose','Diagnose','Complex faults'],['lead','Lead','Own delivery']] as const).map(([value,label,detail]) => (
                  <button key={value} type="button" style={overallCapability === value ? styles.roleButtonActive : styles.roleButton} onClick={() => setOverallCapability(value)}><strong>{label}</strong><br/><span style={{ fontSize: 11, opacity: .7 }}>{detail}</span></button>
                ))}
              </div>
            </div>

            {selectedRole.skills.map((skill) => {
              const claim = getClaim(skill.id);
              return (
                <article key={skill.id} style={styles.skillRow}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: "0 0 4px", fontSize: 15 }}>{skill.label}</h3>
                    <span style={{ ...styles.pill, margin: 0 }}>{claim === "independent" ? "Yes, independently" : claim === "support" ? "With support" : "Not offered"}</span>
                  </div>
                  <p style={styles.copy}>{skill.group}{skill.required ? " · Required for a good match" : ""}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 6, marginTop: 10 }}>
                    {([['independent','Yes, independently'],['support','With support'],['not-offered','Not offered']] as const).map(([value,label]) => (
                      <button key={value} type="button" style={claim === value ? styles.roleButtonActive : styles.roleButton} onClick={() => setCapabilityClaims((current) => ({ ...current, [skill.id]: value }))}>{label}</button>
                    ))}
                  </div>
                  <div>
                    {skill.tags.map((tag) => <button key={tag} type="button" style={styles.tagButton} onClick={() => addTag(tag)}>+ {tag}</button>)}
                  </div>
                </article>
              );
            })}
          </section>

          <aside style={styles.card}>
            <p style={styles.cardTitle}>Profile strength</p>
            <div style={styles.metricGrid}>
              <div style={styles.metric}>
                <p style={{ ...styles.metricValue, textTransform: "capitalize" }}>{overallCapability}</p>
                <p style={styles.metricLabel}>Overall role level</p>
              </div>
              <div style={styles.metric}>
                <p style={styles.metricValue}>{independentCount}</p>
                <p style={styles.metricLabel}>Independent</p>
              </div>
              <div style={styles.metric}>
                <p style={styles.metricValue}>{supportedCount}</p>
                <p style={styles.metricLabel}>With support</p>
              </div>
              <div style={styles.metric}>
                <p style={styles.metricValue}>{tags.length}</p>
                <p style={styles.metricLabel}>Product tags</p>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <p style={styles.cardTitle}>Products, brands and platforms</p>
              {selectedRole.tags.concat(commonTags.slice(0, 10)).map((tag) => (
                <button key={tag} type="button" style={styles.tagButton} onClick={() => addTag(tag)}>+ {tag}</button>
              ))}
            </div>

            <div style={{ marginTop: 14 }}>
              <p style={styles.cardTitle}>Selected tags</p>
              {tags.length === 0 ? <p style={styles.copy}>No tags added yet.</p> : tags.map((tag) => <span key={tag} style={styles.pill}>{tag}</span>)}
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <input style={styles.input} value={customKeyword} onChange={(event) => setCustomKeyword(event.target.value)} placeholder="Software or manufacturer keyword" />
                <button type="button" style={{ ...styles.link, cursor: "pointer" }} onClick={() => { addTag(customKeyword); setCustomKeyword(""); }}>Add</button>
              </div>
            </div>

            {tags.length > 0 && <div style={{ marginTop: 14 }}><p style={styles.cardTitle}>Practical product experience</p>{tags.map((tag) => <label key={tag} style={{ display: "grid", gridTemplateColumns: "1fr 150px", gap: 8, alignItems: "center", marginTop: 8 }}><span style={styles.copy}>{tag}</span><select style={styles.input} value={productExperience[tag] || "installed"} onChange={(event) => setProductExperience((current) => ({ ...current, [tag]: event.target.value as any }))}><option value="aware">Aware</option><option value="installed">Installed</option><option value="configured">Configured</option><option value="commissioned">Commissioned / troubleshot</option><option value="programmed">Programmed / administered</option><option value="certified">Certified</option></select></label>)}</div>}

            <div style={{ marginTop: 14 }}><p style={styles.cardTitle}>One supporting example</p><textarea style={{ ...styles.input, minHeight: 80 }} value={evidenceNote} onChange={(event) => setEvidenceNote(event.target.value)} placeholder="Project, certification, commissioning sheet, code/configuration example or client reference" /></div>

            <div style={{ marginTop: 14 }}>
              <p style={styles.cardTitle}>Missing required skills</p>
              {missingRequired.length === 0 ? <p style={styles.copy}>No required gaps for a good match.</p> : missingRequired.map((skill) => <span key={skill.id} style={styles.pill}>{skill.label}</span>)}
            </div>
            <button type="button" style={{ ...styles.link, width: "100%", justifyContent: "center", marginTop: 16, cursor: "pointer" }} onClick={saveRoleProfile}>Save role profile</button>
            {saveStatus && <p style={{ ...styles.copy, marginTop: 8 }}>{saveStatus}</p>}
          </aside>
        </section>
      </div>
    </main>
  );
}

export default RoleSkillBuilderPage;
export { RoleSkillBuilderPage };
