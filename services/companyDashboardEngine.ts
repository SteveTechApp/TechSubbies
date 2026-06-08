import type {
  AuditLogEntry,
  BulkUpdateResult,
  CompanyDashboardSummary,
  CompanyDocumentUpdateRequest,
  ComplianceDocument,
  EngineerFilter,
  EngineerProfile,
} from "../types/companyDashboard";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

function daysUntil(dateText: string, today: Date): number {
  const target = new Date(dateText + "T00:00:00");
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / MS_PER_DAY);
}

export function getUniqueSkills(engineers: EngineerProfile[]): string[] {
  const skills = new Set<string>();

  engineers.forEach((engineer) => {
    engineer.skills.forEach((skill) => skills.add(skill));
  });

  return Array.from(skills).sort((a, b) => a.localeCompare(b));
}

export function filterEngineers(
  engineers: EngineerProfile[],
  filters: EngineerFilter,
): EngineerProfile[] {
  const searchText = normalise(filters.searchText);

  return engineers.filter((engineer) => {
    const searchable = normalise([
      engineer.displayName,
      engineer.email || "",
      engineer.location,
      engineer.skills.join(" "),
      engineer.specialistProfiles.join(" "),
      engineer.companyNotes || "",
    ].join(" "));

    if (searchText.length > 0 && searchable.indexOf(searchText) === -1) {
      return false;
    }

    if (filters.groupId !== "all" && engineer.groups.indexOf(filters.groupId) === -1) {
      return false;
    }

    if (filters.status !== "all" && engineer.status !== filters.status) {
      return false;
    }

    if (filters.verificationStatus !== "all" && engineer.verificationStatus !== filters.verificationStatus) {
      return false;
    }

    if (filters.skill !== "all" && engineer.skills.indexOf(filters.skill) === -1) {
      return false;
    }

    return true;
  });
}

export function getCompanyDashboardSummary(
  engineers: EngineerProfile[],
  documents: ComplianceDocument[],
  groupCount: number,
  today: Date = new Date(),
): CompanyDashboardSummary {
  const activeEngineers = engineers.filter((engineer) => engineer.status === "active");

  const availableNow = activeEngineers.filter((engineer) => {
    if (!engineer.nextAvailableDate) {
      return false;
    }

    return daysUntil(engineer.nextAvailableDate, today) <= 7;
  });

  const expiringDocuments = documents.filter((document) => {
    if (!document.expiresAt) {
      return false;
    }

    const remainingDays = daysUntil(document.expiresAt, today);
    return remainingDays >= 0 && remainingDays <= 45;
  });

  const expiredDocuments = documents.filter((document) => {
    if (!document.expiresAt) {
      return false;
    }

    return daysUntil(document.expiresAt, today) < 0;
  });

  const profilesNeedingAttention = engineers.filter((engineer) => {
    if (engineer.profileCompleteness < 80) {
      return true;
    }

    if (engineer.verificationStatus !== "verified") {
      return true;
    }

    return false;
  });

  const skillCounts = new Map<string, number>();

  activeEngineers.forEach((engineer) => {
    engineer.skills.forEach((skill) => {
      skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
    });
  });

  const topSkillCoverage = Array.from(skillCounts.entries())
    .map(([skill, engineerCount]) => ({ skill, engineerCount }))
    .sort((a, b) => b.engineerCount - a.engineerCount)
    .slice(0, 6);

  return {
    totalEngineers: engineers.length,
    activeEngineers: activeEngineers.length,
    suspendedEngineers: engineers.filter((engineer) => engineer.status === "suspended").length,
    hiddenEngineers: engineers.filter((engineer) => engineer.status === "hidden").length,
    pendingInvites: engineers.filter((engineer) => engineer.status === "pending_invite").length,
    availableNow: availableNow.length,
    verifiedEngineers: engineers.filter((engineer) => engineer.verificationStatus === "verified").length,
    profilesNeedingAttention: profilesNeedingAttention.length,
    expiringDocuments: expiringDocuments.length,
    expiredDocuments: expiredDocuments.length,
    groupCount,
    topSkillCoverage,
  };
}

export function getAffectedEngineerIds(
  engineers: EngineerProfile[],
  request: CompanyDocumentUpdateRequest,
): string[] {
  if (request.targetMode === "all_engineers") {
    return engineers
      .filter((engineer) => engineer.status !== "removed")
      .map((engineer) => engineer.id);
  }

  if (request.targetMode === "selected_groups") {
    return engineers
      .filter((engineer) => engineer.status !== "removed")
      .filter((engineer) => engineer.groups.some((groupId) => request.targetGroupIds.indexOf(groupId) >= 0))
      .map((engineer) => engineer.id);
  }

  return engineers
    .filter((engineer) => engineer.status !== "removed")
    .filter((engineer) => request.targetEngineerIds.indexOf(engineer.id) >= 0)
    .map((engineer) => engineer.id);
}

export function applyCompanyDocumentUpdate(
  engineers: EngineerProfile[],
  existingDocuments: ComplianceDocument[],
  request: CompanyDocumentUpdateRequest,
  now: Date = new Date(),
): BulkUpdateResult {
  const affectedEngineerIds = getAffectedEngineerIds(engineers, request);

  const updatedDocument: ComplianceDocument = {
    ...request.document,
    appliesToEngineerIds: affectedEngineerIds,
    appliesToGroupIds: request.targetMode === "selected_groups" ? request.targetGroupIds : request.document.appliesToGroupIds,
  };

  const otherDocuments = existingDocuments.filter((document) => document.id !== updatedDocument.id);

  const auditLogEntry: AuditLogEntry = {
    id: "audit-" + String(now.getTime()),
    action: "company_document_update",
    actorName: request.actorName,
    affectedEngineerIds,
    affectedGroupIds: request.targetGroupIds,
    documentId: updatedDocument.id,
    notes: updatedDocument.name + " applied to " + String(affectedEngineerIds.length) + " engineer profile(s).",
    createdAt: now.toISOString(),
  };

  return {
    affectedEngineerIds,
    updatedDocuments: [...otherDocuments, updatedDocument],
    auditLogEntry,
  };
}

export function updateEngineerStatus(
  engineers: EngineerProfile[],
  engineerId: string,
  status: EngineerProfile["status"],
): EngineerProfile[] {
  return engineers.map((engineer) => {
    if (engineer.id !== engineerId) {
      return engineer;
    }

    return {
      ...engineer,
      status,
      lastUpdatedAt: new Date().toISOString().slice(0, 10),
    };
  });
}

export function removeEngineerFromCompany(
  engineers: EngineerProfile[],
  engineerId: string,
): EngineerProfile[] {
  return updateEngineerStatus(engineers, engineerId, "removed");
}

export function getStatusLabel(status: EngineerProfile["status"]): string {
  const labels: Record<EngineerProfile["status"], string> = {
    active: "Active",
    suspended: "Suspended",
    hidden: "Hidden",
    removed: "Removed",
    pending_invite: "Pending invite",
  };

  return labels[status];
}

export function getVerificationLabel(status: EngineerProfile["verificationStatus"]): string {
  const labels: Record<EngineerProfile["verificationStatus"], string> = {
    verified: "Verified",
    pending: "Pending",
    expired: "Expired",
    rejected: "Rejected",
    not_required: "Not required",
  };

  return labels[status];
}