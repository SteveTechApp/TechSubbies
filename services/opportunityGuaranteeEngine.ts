import type {
  EngineerSubscriptionMonth,
  GuaranteeAssessment,
  SuitableOpportunityAlert,
} from "../types/opportunityGuarantee";

export function isQualifiedSuitableOpportunity(alert: SuitableOpportunityAlert): boolean {
  const hardFailure =
    alert.failureReasons &&
    alert.failureReasons.some((reason) =>
      [
        "outside_role",
        "outside_skills",
        "outside_location",
        "outside_availability",
        "outside_rate_preference",
        "missing_required_documents",
        "incomplete_opportunity",
        "customer_withdrew_before_review",
        "already_filled_before_review",
      ].includes(reason),
    );

  return Boolean(
    alert.rateVisible &&
      alert.availabilityMatched &&
      alert.skillMatched &&
      alert.locationMatched &&
      alert.preferenceMatched &&
      !hardFailure,
  );
}

export function assessOpportunityVisibilityGuarantee(month: EngineerSubscriptionMonth): GuaranteeAssessment {
  const reasons: string[] = [];

  if (!month.profileComplete) {
    reasons.push("Profile is incomplete.");
  }

  if (!month.availabilityConfigured) {
    reasons.push("Availability is not configured.");
  }

  if (!month.contactVerified) {
    reasons.push("Contact details are not verified.");
  }

  if (month.activeSpecialistProfiles < 1) {
    reasons.push("No active specialist skills profile is enabled.");
  }

  if (month.blockedAllAvailability) {
    reasons.push("The member was unavailable for the full month.");
  }

  const eligible =
    month.profileComplete &&
    month.availabilityConfigured &&
    month.contactVerified &&
    month.activeSpecialistProfiles > 0 &&
    !month.blockedAllAvailability;

  const countedAlerts = month.suitableAlerts.filter(isQualifiedSuitableOpportunity);
  const countedOpportunityIds = countedAlerts.map((alert) => alert.id);

  if (!eligible) {
    return {
      eligible: false,
      creditDue: false,
      title: "Guarantee not eligible",
      summary:
        "The paid member is not eligible for an additional month because their account settings prevented reliable matching.",
      reasons,
      countedOpportunityIds,
    };
  }

  if (countedAlerts.length > 0) {
    return {
      eligible: true,
      creditDue: false,
      title: "Suitable opportunity sent",
      summary:
        "At least one suitable opportunity alert was sent during the subscription month, so no additional month is due.",
      reasons: ["A qualifying suitable opportunity alert was logged."],
      countedOpportunityIds,
    };
  }

  return {
    eligible: true,
    creditDue: true,
    title: "Additional month due",
    summary:
      "No qualified suitable opportunity alerts were sent during the paid subscription month. Add one additional month at no extra cost.",
    reasons: ["No suitable opportunity alerts were logged for this eligible member."],
    countedOpportunityIds,
  };
}
