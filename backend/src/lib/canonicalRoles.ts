// Server-side copy of the stable legacy crosswalk. Keeping canonicalization
// at the trust boundary prevents older clients from persisting legacy IDs.
const legacyRoleIds: Record<string, string> = {
  "av-labour-support": "free-basic-av-installation-engineer",
  "junior-av-installer": "av-installation-engineer",
  "competent-av-installer": "av-installation-engineer",
  "senior-av-installer": "av-lead-engineer-site-manager",
  "av-commissioning-engineer": "video-commissioning-engineer",
  "avoip-networked-av-engineer": "avoip-networked-av-engineer",
  "dsp-audio-engineer": "audio-commissioning-engineer",
  "uc-vc-engineer": "uc-meeting-room-engineer",
  "av-rack-builder": "av-rack-builder",
  "av-wireman-first-fix": "av-cable-wireman-first-fix",
  "led-install-engineer": "video-wall-led-specialist",
  "led-commissioning-engineer": "video-wall-led-specialist",
  "live-event-sound-technician": "live-event-engineer",
  "live-event-visual-technician": "live-event-engineer",
  "live-event-general-engineer": "live-event-engineer",
  "av-project-manager": "av-project-manager",
  "it-project-manager": "it-project-manager",
  "control-programmer": "control-system-programmer",
  "lead-site-engineer": "av-lead-engineer-site-manager",
  "it-labour-site-support": "free-basic-it-support-technician",
  "junior-it-field-engineer": "it-field-service-engineer",
  "it-deployment-engineer": "desktop-euc-technician",
  "it-field-engineer": "it-field-service-engineer",
  "senior-it-field-engineer": "it-technical-consultant-solutions-architect",
  "data-cabling-infrastructure-engineer": "it-network-cabling-infrastructure-technician",
  "network-support-engineer": "network-support-engineer",
  "network-engineer": "network-support-engineer",
  "senior-network-engineer": "firewall-network-security-engineer",
  "wifi-engineer": "wireless-wifi-engineer",
  "m365-endpoint-engineer": "microsoft-365-modern-workplace-admin",
  "server-infrastructure-engineer": "virtualisation-server-engineer",
  "cybersecurity-support-engineer": "cybersecurity-support-analyst",
  "it-lead-rollout-engineer": "it-project-manager",
};

const canonicalRoleIds = new Set([
  "free-basic-av-installation-engineer", "av-installation-engineer", "av-cable-wireman-first-fix",
  "av-rack-builder", "av-lead-engineer-site-manager", "av-service-fault-engineer", "uc-meeting-room-engineer",
  "live-event-engineer", "live-conferencing-technician", "control-system-programmer", "audio-commissioning-engineer",
  "video-commissioning-engineer", "video-wall-led-specialist", "avoip-networked-av-engineer", "av-design-consultant",
  "av-project-manager", "av-site-survey-engineer", "digital-signage-engineer", "projection-display-specialist",
  "streaming-recording-hybrid-technician", "free-basic-it-support-technician", "it-service-desk-technician",
  "desktop-euc-technician", "it-field-service-engineer", "it-network-cabling-infrastructure-technician",
  "network-support-engineer", "wireless-wifi-engineer", "windows-systems-administrator",
  "microsoft-365-modern-workplace-admin", "azure-entra-cloud-administrator", "cybersecurity-support-analyst",
  "firewall-network-security-engineer", "backup-disaster-recovery-technician", "virtualisation-server-engineer",
  "linux-support-engineer", "mac-apple-device-support-technician", "mdm-endpoint-management-specialist",
  "voip-unified-communications-engineer", "data-centre-technician", "database-data-platform-support-technician",
  "data-bi-analyst", "devops-automation-engineer", "it-project-manager", "it-technical-consultant-solutions-architect",
  "pos-epos-retail-it-engineer", "printer-mfd-support-technician",
]);

export function canonicalizeRoleId(roleId: unknown): string | undefined {
  if (typeof roleId !== "string" || !roleId.trim()) return undefined;
  const normalized = roleId.trim();
  return legacyRoleIds[normalized] || (canonicalRoleIds.has(normalized) ? normalized : undefined);
}

function firstCanonicalRoleId(...values: unknown[]): string | undefined {
  for (const value of values) {
    const canonical = canonicalizeRoleId(value);
    if (canonical) return canonical;
  }
  return undefined;
}

export function migrateRoleFields(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  let changed = false;
  const current = firstCanonicalRoleId(record.canonicalRoleId, record.roleId, record.jobRole);
  if (current && record.canonicalRoleId !== current) {
    record.canonicalRoleId = current;
    changed = true;
  }
  if (Array.isArray(record.roleProfiles)) {
    for (const profile of record.roleProfiles) {
      if (!profile || typeof profile !== "object") continue;
      const item = profile as Record<string, unknown>;
      const roleId = firstCanonicalRoleId(item.roleId, item.expectationId);
      if (roleId && item.roleId !== roleId) {
        item.roleId = roleId;
        changed = true;
      }
    }
  }
  if (Array.isArray(record.selectedJobRoles)) {
    for (const role of record.selectedJobRoles) {
      if (!role || typeof role !== "object") continue;
      const item = role as Record<string, unknown>;
      const roleId = canonicalizeRoleId(item.roleId);
      if (roleId && item.roleId !== roleId) {
        item.roleId = roleId;
        changed = true;
      }
    }
  }
  return changed;
}
