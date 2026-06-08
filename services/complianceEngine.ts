import {
  COMPLIANCE_CREDENTIALS,
  COMPLIANCE_REQUIREMENT_LEVELS,
  ROLE_COMPLIANCE_REQUIREMENTS,
  TRUST_BADGES,
} from "../data/compliance";
import {
  ComplianceExpiryStatus,
  ComplianceMatchResult,
  ComplianceRequirementLevel,
  ComplianceVerificationStatus,
  UploadedComplianceDocument,
} from "../types/compliance";

const verifiedStatuses: ComplianceVerificationStatus[] = [
  "DOCUMENT_VERIFIED",
  "PLATFORM_VERIFIED",
];

const evidenceStatuses: ComplianceVerificationStatus[] = [
  "EVIDENCE_SUPPLIED",
  "DOCUMENT_UPLOADED",
  "DOCUMENT_VERIFIED",
  "PLATFORM_VERIFIED",
];

export function getComplianceCredential(credentialKey: string) {
  return COMPLIANCE_CREDENTIALS.find((credential) => credential.key === credentialKey);
}

export function getComplianceRequirementLevel(requirementLevel: ComplianceRequirementLevel) {
  return (
    COMPLIANCE_REQUIREMENT_LEVELS.find((level) => level.key === requirementLevel) ??
    COMPLIANCE_REQUIREMENT_LEVELS[2]
  );
}

export function getCredentialsByCategory(category: string) {
  return COMPLIANCE_CREDENTIALS.filter((credential) => credential.category === category);
}

export function getRoleComplianceProfile(roleKey: string) {
  return ROLE_COMPLIANCE_REQUIREMENTS.find((role) => role.roleKey === roleKey);
}

export function getDocumentForCredential(
  documents: UploadedComplianceDocument[],
  credentialKey: string
) {
  return documents.find((document) => document.credentialKey === credentialKey);
}

export function getExpiryStatus(
  expiryDate?: string,
  warningDays = 60
): ComplianceExpiryStatus {
  if (!expiryDate) {
    return "NO_EXPIRY";
  }

  const expiry = new Date(expiryDate);
  const now = new Date();

  if (Number.isNaN(expiry.getTime())) {
    return "UNKNOWN";
  }

  if (expiry.getTime() < now.getTime()) {
    return "EXPIRED";
  }

  const warningDate = new Date(now);
  warningDate.setDate(warningDate.getDate() + warningDays);

  if (expiry.getTime() <= warningDate.getTime()) {
    return "EXPIRING_SOON";
  }

  return "VALID";
}

export function isDocumentVerified(document?: UploadedComplianceDocument) {
  if (!document) {
    return false;
  }

  return verifiedStatuses.includes(document.verificationStatus);
}

export function hasUsefulEvidence(document?: UploadedComplianceDocument) {
  if (!document) {
    return false;
  }

  return evidenceStatuses.includes(document.verificationStatus);
}

export function getComplianceMatchResults(
  roleKey: string,
  documents: UploadedComplianceDocument[]
): ComplianceMatchResult[] {
  const roleProfile = getRoleComplianceProfile(roleKey);

  if (!roleProfile) {
    return [];
  }

  return roleProfile.requirements.flatMap((requirement) => {
    const level = getComplianceRequirementLevel(requirement.requirementLevel);

    return requirement.credentialKeys.map((credentialKey) => {
      const credential = getComplianceCredential(credentialKey);
      const document = getDocumentForCredential(documents, credentialKey);
      const expiryStatus = getExpiryStatus(document?.expiryDate);
      const verificationStatus = document?.verificationStatus ?? "NOT_SUPPLIED";
      const isMandatory = requirement.requirementLevel === "PROJECT_MANDATORY";
      const missingMandatory = isMandatory && !document;
      const expiredMandatory = isMandatory && expiryStatus === "EXPIRED";
      const unverifiedMandatory = isMandatory && document && !isDocumentVerified(document);

      let warning: string | undefined;

      if (missingMandatory) {
        warning = "Mandatory evidence has not been supplied.";
      }

      if (expiredMandatory) {
        warning = "Mandatory evidence has expired.";
      }

      if (unverifiedMandatory) {
        warning = "Mandatory evidence is supplied but not verified.";
      }

      return {
        credentialKey,
        title: credential?.title ?? credentialKey,
        requirementLevel: requirement.requirementLevel,
        verificationStatus,
        expiryStatus,
        matchScoreWeight: level.matchScoreWeight,
        blocksMatch: Boolean(missingMandatory || expiredMandatory || unverifiedMandatory),
        warning,
      };
    });
  });
}

export function calculateComplianceConfidence(
  roleKey: string,
  documents: UploadedComplianceDocument[]
) {
  const results = getComplianceMatchResults(roleKey, documents);

  if (results.length === 0) {
    return {
      score: 0,
      maximumScore: 0,
      percentage: 0,
      blocked: false,
      suppliedEvidenceCount: 0,
      verifiedEvidenceCount: 0,
    };
  }

  const maximumScore = results.reduce((total, result) => total + result.matchScoreWeight, 0);

  const score = results.reduce((total, result) => {
    const document = getDocumentForCredential(documents, result.credentialKey);

    if (!document) {
      return total;
    }

    if (result.expiryStatus === "EXPIRED") {
      return total;
    }

    if (isDocumentVerified(document)) {
      return total + result.matchScoreWeight;
    }

    if (hasUsefulEvidence(document)) {
      return total + Math.round(result.matchScoreWeight * 0.5);
    }

    return total;
  }, 0);

  const blocked = results.some((result) => result.blocksMatch);
  const suppliedEvidenceCount = results.filter((result) => result.verificationStatus !== "NOT_SUPPLIED").length;
  const verifiedEvidenceCount = results.filter((result) =>
    verifiedStatuses.includes(result.verificationStatus)
  ).length;

  return {
    score,
    maximumScore,
    percentage: maximumScore === 0 ? 0 : Math.round((score / maximumScore) * 100),
    blocked,
    suppliedEvidenceCount,
    verifiedEvidenceCount,
  };
}

export function getTrustBadgesForDocuments(documents: UploadedComplianceDocument[]) {
  return TRUST_BADGES.filter((badge) => {
    return badge.credentialKeys.some((credentialKey) => {
      const document = getDocumentForCredential(documents, credentialKey);

      if (!document) {
        return false;
      }

      return isDocumentVerified(document);
    });
  });
}

export function getMissingMandatoryCredentials(
  roleKey: string,
  documents: UploadedComplianceDocument[]
) {
  return getComplianceMatchResults(roleKey, documents).filter((result) => result.blocksMatch);
}

export function getCredentialRequirementSummary(roleKey: string) {
  const roleProfile = getRoleComplianceProfile(roleKey);

  if (!roleProfile) {
    return {
      roleKey,
      roleTitle: roleKey,
      mandatory: [],
      stronglyPreferred: [],
      usefulEvidence: [],
      companyLevelOnly: [],
      regionSpecific: [],
    };
  }

  const allRequirements = roleProfile.requirements.flatMap((requirement) => {
    return requirement.credentialKeys.map((credentialKey) => {
      return {
        requirementLevel: requirement.requirementLevel,
        credential: getComplianceCredential(credentialKey),
        reason: requirement.reason,
      };
    });
  });

  return {
    roleKey: roleProfile.roleKey,
    roleTitle: roleProfile.roleTitle,
    mandatory: allRequirements.filter((item) => item.requirementLevel === "PROJECT_MANDATORY"),
    stronglyPreferred: allRequirements.filter((item) => item.requirementLevel === "STRONGLY_PREFERRED"),
    usefulEvidence: allRequirements.filter((item) => item.requirementLevel === "USEFUL_EVIDENCE"),
    companyLevelOnly: allRequirements.filter((item) => item.requirementLevel === "COMPANY_LEVEL_ONLY"),
    regionSpecific: allRequirements.filter((item) => item.requirementLevel === "REGION_SPECIFIC"),
  };
}