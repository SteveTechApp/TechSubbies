import { assertDatabaseRuntimeSupported } from "./databaseProvider.js";

const PLACEHOLDER_SECRETS = new Set([
  "insecure-dev-secret-change-me",
  "change-this-to-a-long-random-string",
  "test-secret",
]);

export function validateRuntimeConfig(env: NodeJS.ProcessEnv = process.env) {
  assertDatabaseRuntimeSupported(env);
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

  if (env.EMAIL_PROVIDER !== "resend") {
    problems.push('EMAIL_PROVIDER must be "resend" in production');
  }
  if (!env.RESEND_API_KEY?.trim()) {
    problems.push("RESEND_API_KEY is required in production");
  }
  const emailFrom = env.EMAIL_FROM?.trim() || "";
  if (!emailFrom.includes("@")) {
    problems.push("EMAIL_FROM must contain a valid sender address");
  }

  if (env.EVIDENCE_STORAGE_PROVIDER !== "s3") {
    problems.push('EVIDENCE_STORAGE_PROVIDER must be "s3" in production');
  }
  if (!env.EVIDENCE_S3_BUCKET?.trim()) {
    problems.push("EVIDENCE_S3_BUCKET is required in production");
  }
  if (!env.AWS_REGION?.trim()) {
    problems.push("AWS_REGION is required for evidence storage in production");
  }
  if (!env.AWS_ACCESS_KEY_ID?.trim()) {
    problems.push("AWS_ACCESS_KEY_ID is required for evidence storage in production");
  }
  if (!env.AWS_SECRET_ACCESS_KEY?.trim()) {
    problems.push("AWS_SECRET_ACCESS_KEY is required for evidence storage in production");
  }

  if (env.ESIGN_PROVIDER !== "dropbox_sign") {
    problems.push('ESIGN_PROVIDER must be "dropbox_sign" in production');
  }
  if (!env.DROPBOX_SIGN_API_KEY?.trim()) {
    problems.push("DROPBOX_SIGN_API_KEY is required in production");
  }
  if (!env.DROPBOX_SIGN_CLIENT_ID?.trim()) {
    problems.push("DROPBOX_SIGN_CLIENT_ID is required in production");
  }
  if (!env.DROPBOX_SIGN_CONTRACT_TEMPLATE_ID?.trim()) {
    problems.push("DROPBOX_SIGN_CONTRACT_TEMPLATE_ID is required in production");
  }
  if (env.DROPBOX_SIGN_TEST_MODE === "true") {
    problems.push("DROPBOX_SIGN_TEST_MODE must not be enabled in production");
  }

  if (env.BILLING_PROVIDER !== "stripe") {
    problems.push('BILLING_PROVIDER must be "stripe" in production');
  }
  if (!env.STRIPE_SECRET_KEY?.trim()) {
    problems.push("STRIPE_SECRET_KEY is required in production");
  }
  if (env.STRIPE_SECRET_KEY?.startsWith("sk_test_")) {
    problems.push("STRIPE_SECRET_KEY must not use a test key in production");
  }
  if (!env.STRIPE_WEBHOOK_SECRET?.trim()) {
    problems.push("STRIPE_WEBHOOK_SECRET is required in production");
  }
  if (!env.STRIPE_PRICE_SILVER?.trim()) {
    problems.push("STRIPE_PRICE_SILVER is required in production");
  }
  if (!env.STRIPE_PRICE_GOLD?.trim()) {
    problems.push("STRIPE_PRICE_GOLD is required in production");
  }
  if (!env.STRIPE_PRICE_PLATINUM?.trim()) {
    problems.push("STRIPE_PRICE_PLATINUM is required in production");
  }

  if (problems.length) {
    throw new Error(`Unsafe production configuration:\n- ${problems.join("\n- ")}`);
  }
}

export function frontendOrigin(env: NodeJS.ProcessEnv = process.env): string {
  return env.FRONTEND_ORIGIN || "http://localhost:5173";
}
