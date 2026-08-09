import { AppError } from "./errors.js";

interface DecodeOptions {
  entity: string;
  id: string;
  versionKey?: string;
  maximumVersion?: number;
}

export function decodePersistedObject(value: string, options: DecodeOptions): Record<string, unknown> {
  let decoded: unknown;
  try {
    decoded = JSON.parse(value);
  } catch {
    throw new AppError("PERSISTED_DATA_CORRUPT", `Stored ${options.entity} data is corrupt.`, 500, { entity: options.entity, id: options.id });
  }

  if (!decoded || typeof decoded !== "object" || Array.isArray(decoded)) {
    throw new AppError("PERSISTED_DATA_CORRUPT", `Stored ${options.entity} data is not an object.`, 500, { entity: options.entity, id: options.id });
  }

  if (options.versionKey && options.maximumVersion !== undefined) {
    const rawVersion = (decoded as Record<string, unknown>)[options.versionKey];
    if (rawVersion !== undefined && (!Number.isInteger(rawVersion) || Number(rawVersion) < 1)) {
      throw new AppError("PERSISTED_SCHEMA_INVALID", `Stored ${options.entity} schema version is invalid.`, 500, { entity: options.entity, id: options.id, versionKey: options.versionKey });
    }
    if (typeof rawVersion === "number" && rawVersion > options.maximumVersion) {
      throw new AppError("PERSISTED_SCHEMA_UNSUPPORTED", `Stored ${options.entity} uses a newer schema version.`, 409, { entity: options.entity, id: options.id, supportedVersion: options.maximumVersion, storedVersion: rawVersion });
    }
  }

  return decoded as Record<string, unknown>;
}
