import React, { useMemo, useState } from "react";

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
};

const roles: Role[] = [
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

const commonTags = ["WyreStorm", "Crestron", "Extron", "Q-SYS", "Biamp", "Shure", "Logitech", "Yealink", "Microsoft Teams Rooms", "Zoom Rooms", "Cisco", "Meraki", "Ubiquiti", "Aruba", "Fortinet", "Dante", "NDI", "HDBaseT", "AVoIP", "Novastar", "Brompton"];

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
  const [search, setSearch] = useState("");
  const [market, setMarket] = useState("All");
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [tags, setTags] = useState<string[]>([]);

  const filteredRoles = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return roles.filter((role) => {
      if (market !== "All" && role.market !== market) return false;
      if (!searchText) return true;

      const haystack = [role.title, role.market, role.family, role.summary, role.tags.join(" "), role.skills.map((skill) => skill.label).join(" ")].join(" ").toLowerCase();
      return haystack.includes(searchText);
    });
  }, [search, market]);

  const ratedCount = selectedRole.skills.filter((skill) => (ratings[skill.id] || 0) > 0).length;
  const goodCount = selectedRole.skills.filter((skill) => (ratings[skill.id] || 0) >= 3).length;
  const missingRequired = selectedRole.skills.filter((skill) => skill.required && (ratings[skill.id] || 0) < 3);
  const completeness = Math.round((ratedCount / selectedRole.skills.length) * 100);

  function addTag(tag: string) {
    setTags((current) => current.includes(tag) ? current : [...current, tag]);
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <section>
            <p style={styles.eyebrow}>TechSubbies role skill builder</p>
            <h1 style={styles.title}>Build a granular skills profile around the actual job role.</h1>
            <p style={styles.copy}>Select an AV, IT or hybrid role, rate each relevant skill, and add product, brand and evidence tags.</p>
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
              <button key={role.id} type="button" style={role.id === selectedRole.id ? styles.roleButtonActive : styles.roleButton} onClick={() => { setSelectedRole(role); setRatings({}); }}>
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
            <div style={{ marginTop: 8 }}>
              <span style={styles.pill}>{selectedRole.market}</span>
              <span style={styles.pill}>{selectedRole.family}</span>
            </div>

            {selectedRole.skills.map((skill) => (
              <article key={skill.id} style={styles.skillRow}>
                <h3 style={{ margin: "0 0 4px", fontSize: 15 }}>{skill.label}</h3>
                <p style={styles.copy}>{skill.group}{skill.required ? " · Required for a good match" : ""}</p>
                <div style={styles.ratingRow}>
                  {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <button key={rating} type="button" style={(ratings[skill.id] || 0) === rating ? styles.ratingButtonActive : styles.ratingButton} onClick={() => setRatings({ ...ratings, [skill.id]: rating })}>
                      {rating}
                    </button>
                  ))}
                </div>
                <div>
                  {skill.tags.map((tag) => <button key={tag} type="button" style={styles.tagButton} onClick={() => addTag(tag)}>+ {tag}</button>)}
                </div>
              </article>
            ))}
          </section>

          <aside style={styles.card}>
            <p style={styles.cardTitle}>Profile strength</p>
            <div style={styles.metricGrid}>
              <div style={styles.metric}>
                <p style={styles.metricValue}>{completeness}%</p>
                <p style={styles.metricLabel}>Skills rated</p>
              </div>
              <div style={styles.metric}>
                <p style={styles.metricValue}>{goodCount}</p>
                <p style={styles.metricLabel}>Can do independently</p>
              </div>
              <div style={styles.metric}>
                <p style={styles.metricValue}>{missingRequired.length}</p>
                <p style={styles.metricLabel}>Required gaps</p>
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
            </div>

            <div style={{ marginTop: 14 }}>
              <p style={styles.cardTitle}>Missing required skills</p>
              {missingRequired.length === 0 ? <p style={styles.copy}>No required gaps for a good match.</p> : missingRequired.map((skill) => <span key={skill.id} style={styles.pill}>{skill.label}</span>)}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default RoleSkillBuilderPage;
export { RoleSkillBuilderPage };
