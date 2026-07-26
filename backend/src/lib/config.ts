const PLACEHOLDER_SECRETS = new Set([
  "insecure-dev-secret-change-me",
  "change-this-to-a-long-random-string",
  "test-secret",
]);

export function validateRuntimeConfig(env: NodeJS.ProcessEnv = process.env) {
  if (env.NODE_ENV !== "production") return;

  const problems: string[] = [];
  const jwtSecret = env.JWT_SECRET?.trim() || "";
  if (jwtSecret.length < 32 || PLACEHOLDER_SECRETS.has(jwtSecret)) {
    problems.push("JWT_SECRET must be a non-placeholder value of at least 32 characters");
  }

  const frontendOrigin = env.FRONTEND_ORIGIN?.trim() || "";
  try {
    const parsed = new URL(frontendOrigin);
    if (parsed.protocol !== "https:" || parsed.origin !== frontendOrigin) {
      problems.push("FRONTEND_ORIGIN must be one exact HTTPS origin");
    }
  } catch {
    problems.push("FRONTEND_ORIGIN must be a valid HTTPS origin");
  }

  if (problems.length) {
    throw new Error(`Unsafe production configuration:\n- ${problems.join("\n- ")}`);
  }
}

export function frontendOrigin(env: NodeJS.ProcessEnv = process.env): string {
  return env.FRONTEND_ORIGIN || "http://localhost:5173";
}
