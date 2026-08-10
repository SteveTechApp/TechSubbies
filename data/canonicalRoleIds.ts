// Lightweight compatibility mapping for code paths that only need to attach
// canonical IDs. Keep this separate from canonicalRoleRegistry so common
// services do not download the complete AV and IT skill catalogues.
export const responsibilityExpectationCanonicalRoleIds: Record<string, string> = {
  'av-labour-support': 'free-basic-av-installation-engineer',
  'junior-av-installer': 'av-installation-engineer',
  'competent-av-installer': 'av-installation-engineer',
  'senior-av-installer': 'av-lead-engineer-site-manager',
  'av-commissioning-engineer': 'video-commissioning-engineer',
  'avoip-networked-av-engineer': 'avoip-networked-av-engineer',
  'dsp-audio-engineer': 'audio-commissioning-engineer',
  'uc-vc-engineer': 'uc-meeting-room-engineer',
  'av-rack-builder': 'av-rack-builder',
  'av-wireman-first-fix': 'av-cable-wireman-first-fix',
  'led-install-engineer': 'video-wall-led-specialist',
  'led-commissioning-engineer': 'video-wall-led-specialist',
  'live-event-sound-technician': 'live-event-engineer',
  'live-event-visual-technician': 'live-event-engineer',
  'live-event-general-engineer': 'live-event-engineer',
  'av-project-manager': 'av-project-manager',
  'it-project-manager': 'it-project-manager',
  'control-programmer': 'control-system-programmer',
  'lead-site-engineer': 'av-lead-engineer-site-manager',
  'it-labour-site-support': 'free-basic-it-support-technician',
  'junior-it-field-engineer': 'it-field-service-engineer',
  'it-deployment-engineer': 'desktop-euc-technician',
  'it-field-engineer': 'it-field-service-engineer',
  'senior-it-field-engineer': 'it-technical-consultant-solutions-architect',
  'data-cabling-infrastructure-engineer': 'it-network-cabling-infrastructure-technician',
  'network-support-engineer': 'network-support-engineer',
  'network-engineer': 'network-support-engineer',
  'senior-network-engineer': 'firewall-network-security-engineer',
  'wifi-engineer': 'wireless-wifi-engineer',
  'm365-endpoint-engineer': 'microsoft-365-modern-workplace-admin',
  'server-infrastructure-engineer': 'virtualisation-server-engineer',
  'cybersecurity-support-engineer': 'cybersecurity-support-analyst',
  'it-lead-rollout-engineer': 'it-project-manager',
};

export function canonicalRoleIdForLegacy(roleId: string): string {
  return responsibilityExpectationCanonicalRoleIds[roleId] || roleId;
}

export function unmappedResponsibilityExpectationIds(expectationIds: string[]): string[] {
  return expectationIds.filter(id => !responsibilityExpectationCanonicalRoleIds[id]);
}
