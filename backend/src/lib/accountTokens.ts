import { createHash, randomBytes } from "node:crypto";
import { db } from "./db.js";

export type AccountTokenType = "verify-email" | "reset-password";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function issueAccountToken(userId: string, type: AccountTokenType, ttlMs: number): string {
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  db.prepare("DELETE FROM account_tokens WHERE userId = ? AND type = ?").run(userId, type);
  db.prepare(
    "INSERT INTO account_tokens (tokenHash, userId, type, expiresAt, createdAt) VALUES (?, ?, ?, ?, ?)"
  ).run(hashToken(token), userId, type, new Date(now.getTime() + ttlMs).toISOString(), now.toISOString());
  return token;
}

export function consumeAccountToken(token: string, type: AccountTokenType): string | null {
  const tokenHash = hashToken(token);
  const row = db
    .prepare("SELECT userId, expiresAt FROM account_tokens WHERE tokenHash = ? AND type = ?")
    .get(tokenHash, type) as unknown as { userId: string; expiresAt: string } | undefined;
  if (!row) return null;

  db.prepare("DELETE FROM account_tokens WHERE tokenHash = ?").run(tokenHash);
  if (new Date(row.expiresAt).getTime() <= Date.now()) return null;
  return row.userId;
}
