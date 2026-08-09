const DEVELOPMENT_API_URL = "/api";

export function resolveApiBaseUrl(configured: string | undefined, production: boolean): string {
  const value = configured?.trim();
  if (!value) {
    if (production) {
      throw new Error("VITE_API_BASE_URL must be configured for a production build.");
    }
    return DEVELOPMENT_API_URL;
  }

  const normalized = value.replace(/\/+$/, "");
  if (normalized.startsWith("/")) return normalized;

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error("VITE_API_BASE_URL must be an absolute URL or a root-relative path.");
  }

  if (production && parsed.protocol !== "https:") {
    throw new Error("VITE_API_BASE_URL must use HTTPS in production.");
  }
  return normalized;
}

export const API_BASE_URL = resolveApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL,
  import.meta.env.PROD
);
