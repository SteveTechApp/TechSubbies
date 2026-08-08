import type { UserRow } from "./db.js";

// Shapes a database user row into the { id, role, profile } object the
// frontend already expects (see types/index.ts `User` on the frontend),
// while never leaking the password hash.
export function toPublicUser(user: UserRow) {
  let profile: unknown = {};
  try {
    profile = JSON.parse(user.profile);
  } catch {
    profile = {};
  }

  return {
    id: user.id,
    role: user.role,
    emailVerified: Boolean(user.emailVerified),
    profile: {
      id: user.id,
      name: user.name,
      ...(typeof profile === "object" && profile !== null ? profile : {}),
    },
  };
}

function safeStrings(value: unknown, max = 20): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
    .map((item) => item.trim().slice(0, 120))
    .slice(0, max);
}

// Accessibility requirements can be useful for booking/site planning but are
// private by default. Directory consumers receive only the professional
// preferences plus accessibility details the engineer explicitly opted to
// share with companies.
function marketplaceInclusivePreferences(value: unknown) {
  if (!value || typeof value !== "object") return undefined;
  const input = value as Record<string, unknown>;
  const accessibility = input.accessibility && typeof input.accessibility === "object"
    ? input.accessibility as Record<string, unknown>
    : {};

  const output: Record<string, unknown> = {
    languages: safeStrings(input.languages, 12),
    workModes: safeStrings(input.workModes, 3),
    alternativeEvidenceRoutes: safeStrings(input.alternativeEvidenceRoutes, 7),
  };

  if (accessibility.shareWithCompanies === true && accessibility.needsAdjustments === true) {
    output.accessibility = {
      needsAdjustments: true,
      shareWithCompanies: true,
      adjustments: safeStrings(accessibility.adjustments, 20),
      note: typeof accessibility.note === "string" ? accessibility.note.slice(0, 1000) : "",
    };
  }

  return output;
}

// Directory/search responses must never expose account contact, identity or
// payment details. Matching-safe professional fields remain available.
export function toDirectoryUser(user: UserRow) {
  const publicUser = toPublicUser(user);
  const profile = { ...(publicUser.profile as Record<string, unknown>) };
  [
    "contact",
    "email",
    "phone",
    "address",
    "dateOfBirth",
    "identity",
    "bankDetails",
    "paymentDetails",
    "notificationSettings",
    "documents",
  ].forEach((key) => delete profile[key]);

  if ("inclusivePreferences" in profile) {
    const safe = marketplaceInclusivePreferences(profile.inclusivePreferences);
    if (safe) profile.inclusivePreferences = safe;
    else delete profile.inclusivePreferences;
  }

  // Defensive removal of any earlier experimental top-level accessibility
  // fields so they cannot bypass the explicit sharing gate above.
  delete profile.accessibilityAdjustments;
  delete profile.accessibilityNote;

  return { ...publicUser, profile };
}
