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
    profile: {
      id: user.id,
      name: user.name,
      ...(typeof profile === "object" && profile !== null ? profile : {}),
    },
  };
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

  return { ...publicUser, profile };
}
