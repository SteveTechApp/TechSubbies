import React, { useMemo, useState } from "react";
import { commonProductAndBrandTags, skillRatingLabels } from "../data/roleSkillTaxonomy";
import {
  addTag,
  createEmptyRoleSkillProfile,
  filterRoleSkillDefinitions,
  getDefaultRoleSkillDefinition,
  getMissingRequiredSkillLabels,
  getRoleFamilies,
  getRoleMarkets,
  getRoleSkillSummary,
  removeTag,
  toggleSkillWillingness,
  updateSkillEvidenceNote,
  updateSkillRating,
} from "../services/roleSkillEngine";
import type {
  EngineerRoleSkillProfile,
  RoleFamily,
  RoleMarket,
  RoleSkillDefinition,
  RoleSkillFilter,
  SkillRating,
} from "../types/roleSkills";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #050b14 0%, #08111f 52%, #020617 100%)",
    color: "#ffffff",
    padding: "24px",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  shell: {
    maxWidth: "1500px",
    margin: "0 auto",
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
    fontWeight: 900,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    margin: "0 0 8px",
  },
  title: {
    color: "#ffffff",
    fontSize: "34px",
    lineHeight: 1.08,
    margin: "0 0 10px",
  },
  copy: {
    color: "rgba(255,255,255,0.74)",
    fontSize: "14px",
    lineHeight: 1.55,
    margin: 0,
  },
  topLink: {
    display: "inline-flex",
    border: "1px solid rgba(103,232,249,0.42)",
    background: "rgba(8,47,73,0.72)",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: 800,
    textDecoration: "none",
  },
  filterCard: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.78)",
    borderRadius: "20px",
    padding: "16px",
    marginBottom: "14px",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(220px, 1fr) 180px 220px",
    gap: "10px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "13px",
    border: "1px solid rgba(148,163,184,0.28)",
    background: "rgba(2,6,23,0.62)",
    color: "#ffffff",
    padding: "11px 12px",
    outline: "none",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "340px minmax(0, 1fr) 360px",
    gap: "14px",
    alignItems: "start",
  },
  card: {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.78)",
    borderRadius: "20px",
    padding: "16px",
    boxShadow: "0 18px 60px rgba(0,0,0,0.22)",
  },
  cardTitle: {
    color: "#67e8f9",
    fontSize: "14px",
    fontWeight: 900,
    margin: "0 0 10px",
  },
  roleList: {
    display: "grid",
    gap: "8px",
    maxHeight: "720px",
    overflowY: "auto",
    paddingRight: "4px",
  },
  roleButton: {
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(2,6,23,0.42)",
    color: "#ffffff",
    borderRadius: "14px",
    padding: "11px",
    textAlign: "left",
    cursor: "pointer",
  },
  roleButtonActive: {
    border: "2px solid #67e8f9",
    background: "rgba(8,47,73,0.78)",
    color: "#ffffff",
    borderRadius: "14px",
    padding: "10px",
    textAlign: "left",
    cursor: "pointer",
  },
  roleButtonTitle: {
    color: "#ffffff",
    display: "block",
    fontSize: "13px",
    fontWeight: 900,
    marginBottom: "4px",
  },
  roleButtonMeta: {
    color: "rgba(255,255,255,0.58)",
    display: "block",
    fontSize: "11px",
    lineHeight: 1.35,
  },
  selectedHeader: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "12px",
    alignItems: "start",
    marginBottom: "12px",
  },
  selectedTitle: {
    color: "#ffffff",
    fontSize: "26px",
    lineHeight: 1.12,
    margin: "0 0 8px",
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid rgba(103,232,249,0.34)",
    background: "rgba(8,47,73,0.56)",
    color: "#67e8f9",
    borderRadius: "999px",
    padding: "6px 9px",
    fontSize: "11px",
    fontWeight: 900,
    margin: "2px 5px 2px 0",
    whiteSpace: "nowrap",
  },
  skillGroup: {
    border: "1px solid rgba(148,163,184,0.14)",
    background: "rgba(2,6,23,0.38)",
    borderRadius: "18px",
    padding: "14px",
    marginTop: "12px",
  },
  skillGroupTitle: {
    color: "#67e8f9",
    fontSize: "15px",
    fontWeight: 900,
    margin: "0 0 5px",
  },
  skillRow: {
    borderTop: "1px solid rgba(148,163,184,0.13)",
    paddingTop: "12px",
    marginTop: "12px",
  },
  skillTop: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "10px",
    alignItems: "start",
  },
  skillLabel: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 900,
    margin: "0 0 4px",
  },
  ratingRow: {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  ratingButton: {
    width: "34px",
    height: "32px",
    borderRadius: "10px",
    border: "1px solid rgba(148,163,184,0.24)",
    background: "rgba(15,23,42,0.72)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 900,
  },
  ratingButtonActive: {
    width: "34px",
    height: "32px",
    borderRadius: "10px",
    border: "2px solid #67e8f9",
    background: "rgba(8,47,73,0.92)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 900,
  },
  small: {
    color: "rgba(255,255,255,0.58)",
    fontSize: "12px",
    lineHeight: 1.45,
  },
  evidenceInput: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "12px",
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(2,6,23,0.48)",
    color: "#ffffff",
    padding: "9px 10px",
    marginTop: "8px",
    outline: "none",
  },
  toggle: {
    border: "1px solid rgba(148,163,184,0.2)",
    background: "rgba(15,23,42,0.72)",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "6px 9px",
    fontSize: "11px",
    cursor: "pointer",
    marginTop: "8px",
  },
  toggleOff: {
    border: "1px solid rgba(248,113,113,0.26)",
    background: "rgba(127,29,29,0.42)",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "6px 9px",
    fontSize: "11px",
    cursor: "pointer",
    marginTop: "8px",
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  metric: {
    border: "1px solid rgba(148,163,184,0.15)",
    background: "rgba(2,6,23,0.42)",
    borderRadius: "15px",
    padding: "12px",
  },
  metricValue: {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: 900,
    margin: "0 0 4px",
  },
  metricLabel: {
    color: "rgba(255,255,255,0.62)",
    fontSize: "12px",
    margin: 0,
  },
  tagBox: {
    border: "1px solid rgba(148,163,184,0.15)",
    background: "rgba(2,6,23,0.42)",
    borderRadius: "16px",
    padding: "12px",
    marginTop: "12px",
  },
  tagInputRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "8px",
    marginTop: "8px",
  },
  addButton: {
    border: "1px solid rgba(103,232,249,0.42)",
    background: "rgba(8,47,73,0.72)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "9px 11px",
    cursor: "pointer",
    fontWeight: 900,
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid rgba(103,232,249,0.24)",
    background: "rgba(8,47,73,0.46)",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "6px 8px",
    fontSize: "11px",
    margin: "4px 5px 0 0",
  },
  tagButton: {
    border: "0",
    background: "transparent",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 900,
  },
  quickTagButton: {
    border: "1px solid rgba(148,163,184,0.20)",
    background: "rgba(15,23,42,0.70)",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "6px 8px",
    fontSize: "11px",
    cursor: "pointer",
    margin: "4px 5px 0 0",
  },
};

function prettyToken(value: string): string {
  return value.split("_").join(" ");
}

function getRatingForSkill(profile: EngineerRoleSkillProfile, skillId: string) {
  return profile.ratings.find((item) => item.skillId === skillId);
}

function RoleSkillBuilderPage() {
  const defaultRole = getDefaultRoleSkillDefinition();

  const [filter, setFilter] = useState<RoleSkillFilter>({
    searchText: "",
    market: "all",
    family: "all",
  });

  const [selectedRole, setSelectedRole] = useState<RoleSkillDefinition>(defaultRole);
  const [profile, setProfile] = useState<EngineerRoleSkillProfile>(() => createEmptyRoleSkillProfile(defaultRole));
  const [tagInput, setTagInput] = useState("");

  const filteredRoles = useMemo(() => filterRoleSkillDefinitions(filter), [filter]);
  const summary = useMemo(() => getRoleSkillSummary(selectedRole, profile), [selectedRole, profile]);
  const missingRequiredSkills = useMemo(() => getMissingRequiredSkillLabels(selectedRole, profile), [selectedRole, profile]);

  function selectRole(role: RoleSkillDefinition) {
    setSelectedRole(role);
    setProfile(createEmptyRoleSkillProfile(role));
    setTagInput("");
  }

  function setSkillRating(skillId: string, rating: SkillRating) {
    setProfile((current) => updateSkillRating(current, skillId, rating));
  }

  function setEvidence(skillId: string, evidenceNote: string) {
    setProfile((current) => updateSkillEvidenceNote(current, skillId, evidenceNote));
  }

  function toggleWilling(skillId: string) {
    setProfile((current) => toggleSkillWillingness(current, skillId));
  }

  function addProfileTag(tag: string) {
    setProfile((current) => ({
      ...current,
      productTags: addTag(current.productTags, tag),
    }));
    setTagInput("");
  }

  function removeProfileTag(tag: string) {
    setProfile((current) => ({
      ...current,
      productTags: removeTag(current.productTags, tag),
    }));
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <section>
            <p style={styles.eyebrow}>TechSubbies role skill builder</p>
            <h1 style={styles.title}>Build a granular skills profile around the actual job role.</h1>
            <p style={styles.copy}>
              Select an AV, IT or hybrid role, rate each relevant skill, then add products, brands,
              platforms and evidence tags that help companies find the right engineer for real project work.
            </p>
          </section>

          <a href="/" style={styles.topLink}>
            Back to landing page
          </a>
        </header>

        <section style={styles.filterCard}>
          <p style={styles.cardTitle}>Find the right role</p>
          <div style={styles.filterGrid}>
            <input
              style={styles.input}
              value={filter.searchText}
              onChange={(event) => setFilter({ ...filter, searchText: event.target.value })}
              placeholder="Search role, skill, product, platform or project type"
            />

            <select
              style={styles.input}
              value={filter.market}
              onChange={(event) => setFilter({ ...filter, market: event.target.value as RoleMarket | "all" })}
            >
              {getRoleMarkets().map((market) => (
                <option key={market} value={market}>{market === "all" ? "All markets" : market.toUpperCase()}</option>
              ))}
            </select>

            <select
              style={styles.input}
              value={filter.family}
              onChange={(event) => setFilter({ ...filter, family: event.target.value as RoleFamily | "all" })}
            >
              {getRoleFamilies().map((family) => (
                <option key={family} value={family}>{family === "all" ? "All role families" : prettyToken(family)}</option>
              ))}
            </select>
          </div>
        </section>

        <section style={styles.mainGrid}>
          <aside style={styles.card}>
            <p style={styles.cardTitle}>Role results</p>
            <div style={styles.roleList}>
              {filteredRoles.map((role) => {
                const active = role.id === selectedRole.id;
                const buttonStyle = active ? styles.roleButtonActive : styles.roleButton;

                return (
                  <button key={role.id} type="button" style={buttonStyle} onClick={() => selectRole(role)}>
                    <span style={styles.roleButtonTitle}>{role.title}</span>
                    <span style={styles.roleButtonMeta}>
                      {role.market.toUpperCase()} · {prettyToken(role.family)} · {role.level}
                    </span>
                    <span style={styles.roleButtonMeta}>{role.summary}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section style={styles.card}>
            <div style={styles.selectedHeader}>
              <div>
                <p style={styles.eyebrow}>Selected role</p>
                <h2 style={styles.selectedTitle}>{selectedRole.title}</h2>
                <p style={styles.copy}>{selectedRole.summary}</p>
                <div style={{ marginTop: 8 }}>
                  <span style={styles.pill}>{selectedRole.market.toUpperCase()}</span>
                  <span style={styles.pill}>{prettyToken(selectedRole.family)}</span>
                  <span style={styles.pill}>{selectedRole.level}</span>
                </div>
              </div>
            </div>

            {selectedRole.skillGroups.map((group) => (
              <article key={group.id} style={styles.skillGroup}>
                <h3 style={styles.skillGroupTitle}>{group.title}</h3>
                <p style={styles.copy}>{group.description}</p>

                {group.skills.map((skill) => {
                  const current = getRatingForSkill(profile, skill.id);
                  const currentRating = current ? current.rating : 0;
                  const willing = current ? current.willingToDo : true;

                  return (
                    <div key={skill.id} style={styles.skillRow}>
                      <div style={styles.skillTop}>
                        <div>
                          <p style={styles.skillLabel}>{skill.label}</p>
                          <p style={styles.small}>{skill.description}</p>
                          {skill.requiredForGoodMatch ? <span style={styles.pill}>Required for good match</span> : null}
                          {skill.evidenceRecommended ? <span style={styles.pill}>Evidence useful</span> : null}
                        </div>

                        <div style={styles.ratingRow}>
                          {skillRatingLabels.map((rating) => {
                            const active = currentRating === rating.value;
                            const buttonStyle = active ? styles.ratingButtonActive : styles.ratingButton;

                            return (
                              <button
                                key={rating.value}
                                type="button"
                                title={rating.description}
                                style={buttonStyle}
                                onClick={() => setSkillRating(skill.id, rating.value)}
                              >
                                {rating.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <input
                        style={styles.evidenceInput}
                        value={current ? current.evidenceNote : ""}
                        onChange={(event) => setEvidence(skill.id, event.target.value)}
                        placeholder="Evidence note, project example, certificate or product experience"
                      />

                      <button
                        type="button"
                        style={willing ? styles.toggle : styles.toggleOff}
                        onClick={() => toggleWilling(skill.id)}
                      >
                        {willing ? "Willing to do this work" : "Do not match me for this skill"}
                      </button>
                    </div>
                  );
                })}
              </article>
            ))}
          </section>

          <aside>
            <section style={styles.card}>
              <p style={styles.cardTitle}>Profile strength</p>
              <div style={styles.metricGrid}>
                <div style={styles.metric}>
                  <p style={styles.metricValue}>{summary.profileStrength}</p>
                  <p style={styles.metricLabel}>Current strength</p>
                </div>
                <div style={styles.metric}>
                  <p style={styles.metricValue}>{summary.completenessPercent}%</p>
                  <p style={styles.metricLabel}>Skills rated</p>
                </div>
                <div style={styles.metric}>
                  <p style={styles.metricValue}>{summary.goodOrBetterSkills}</p>
                  <p style={styles.metricLabel}>Can do independently</p>
                </div>
                <div style={styles.metric}>
                  <p style={styles.metricValue}>{summary.missingRequiredSkills}</p>
                  <p style={styles.metricLabel}>Required gaps</p>
                </div>
              </div>

              <div style={styles.tagBox}>
                <p style={styles.cardTitle}>Missing required skills</p>
                {missingRequiredSkills.length === 0 ? (
                  <p style={styles.copy}>No required skill gaps for a good match.</p>
                ) : (
                  missingRequiredSkills.slice(0, 6).map((skill) => (
                    <span key={skill} style={styles.tag}>{skill}</span>
                  ))
                )}
              </div>
            </section>

            <section style={styles.card}>
              <p style={styles.cardTitle}>Products, brands and platforms</p>
              <p style={styles.copy}>
                Add products, platforms, brands or tools the engineer knows well. These tags should support search and matching.
              </p>

              <div style={styles.tagInputRow}>
                <input
                  style={styles.input}
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  placeholder="e.g. WyreStorm, Teams Rooms, Cisco"
                />
                <button type="button" style={styles.addButton} onClick={() => addProfileTag(tagInput)}>
                  Add
                </button>
              </div>

              <div style={{ marginTop: 10 }}>
                {profile.productTags.length === 0 ? <p style={styles.small}>No tags added yet.</p> : null}
                {profile.productTags.map((tag) => (
                  <span key={tag} style={styles.tag}>
                    {tag}
                    <button type="button" style={styles.tagButton} onClick={() => removeProfileTag(tag)}>×</button>
                  </span>
                ))}
              </div>

              <div style={styles.tagBox}>
                <p style={styles.cardTitle}>Suggested tags for this role</p>
                {selectedRole.recommendedTags.map((tag) => (
                  <button key={tag} type="button" style={styles.quickTagButton} onClick={() => addProfileTag(tag)}>
                    + {tag}
                  </button>
                ))}
              </div>

              <div style={styles.tagBox}>
                <p style={styles.cardTitle}>Common tags</p>
                {commonProductAndBrandTags.slice(0, 18).map((tag) => (
                  <button key={tag} type="button" style={styles.quickTagButton} onClick={() => addProfileTag(tag)}>
                    + {tag}
                  </button>
                ))}
              </div>
            </section>

            <section style={styles.card}>
              <p style={styles.cardTitle}>Evidence to request</p>
              {selectedRole.evidenceTypes.map((item) => (
                <span key={item} style={styles.tag}>{item}</span>
              ))}
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

export { RoleSkillBuilderPage };
export default RoleSkillBuilderPage;