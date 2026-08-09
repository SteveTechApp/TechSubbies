import type { UserRow } from "./db.js";
import { decodePersistedObject } from "./persistedData.js";
import { ENGINEER_PROFILE_SCHEMA_VERSION } from "../domain/marketplaceTypes.js";

// Shapes a database user row into the { id, role, profile } object the
// frontend already expects (see types/index.ts `User` on the frontend),
// while never leaking the password hash.
export function toPublicUser(user: UserRow) {
  const profile=decodePersistedObject(user.profile,{entity:"user profile",id:user.id,...(user.role==="Engineer"?{versionKey:"profileSchemaVersion",maximumVersion:ENGINEER_PROFILE_SCHEMA_VERSION}:{})});

  const publicProfile = typeof profile === "object" && profile !== null ? structuredClone(profile as Record<string, unknown>) : {};
  redactPrivateProfileData(publicProfile as Record<string, unknown>);
  return {
    id: user.id,
    role: user.role,
    profile: {
      id: user.id,
      name: user.name,
      ...publicProfile,
    },
  };
}

export function toPrivateUser(user: UserRow) {
  const profile=decodePersistedObject(user.profile,{entity:"user profile",id:user.id,...(user.role==="Engineer"?{versionKey:"profileSchemaVersion",maximumVersion:ENGINEER_PROFILE_SCHEMA_VERSION}:{})});
  return {id:user.id,role:user.role,emailVerified:Boolean(user.emailVerifiedAt),profile:{id:user.id,name:user.name,...profile}};
}

const privateKeys=new Set(["email","phone","mobile","telephone","privateNotes","unavailableDates","holidays","bankDetails","bankAccount","sortCode","taxId","nationalInsuranceNumber","emergencyContact"]);
function redactPrivateProfileData(value:Record<string,unknown>){for(const key of Object.keys(value)){if(privateKeys.has(key)){delete value[key];continue;}const child=value[key];if(child&&typeof child==="object"&&!Array.isArray(child))redactPrivateProfileData(child as Record<string,unknown>);}}
