import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createUser, findUserByEmail, findUserById, markEmailVerified, updateUserPassword } from "../lib/db.js";
import { requireAuth, signToken, type AuthedRequest } from "../middleware/auth.js";
import { toPublicUser } from "../lib/publicUser.js";
import { clearAuthCookies, setAuthCookies } from "../middleware/security.js";
import { consumeAccountToken, issueAccountToken } from "../lib/accountTokens.js";
import { sendEmail } from "../lib/email.js";
import { frontendOrigin } from "../lib/config.js";
import { recordAccountAudit } from "../lib/accountAudit.js";

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  // Privileged roles such as Admin must never be assignable through the
  // public registration endpoint.
  role: z.enum(["Engineer", "Company", "Resourcing Company"]),
  name: z.string().min(1),
  // Full role-specific profile object the frontend already builds
  // (EngineerProfile / CompanyProfile / ResourcingCompanyProfile shape).
  profileData: z.record(z.any()).optional().default({}),
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
  }
  const { password, role, name, profileData } = parsed.data;
  const email = parsed.data.email.trim().toLowerCase();

  if (findUserByEmail(email)) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = createUser({
    email,
    password: passwordHash,
    role,
    name,
    profile: JSON.stringify({ ...profileData, name, contact: { email, ...(profileData.contact || {}) } }),
  });

  const token = signToken(user.id);
  const verificationToken = issueAccountToken(user.id, "verify-email", 24 * 60 * 60 * 1000);
  let verificationEmailSent = true;
  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your TechSubbies email",
      text: `${frontendOrigin()}/verify-email?token=${encodeURIComponent(verificationToken)}`,
    });
  } catch (error) {
    verificationEmailSent = false;
    console.error("Verification email delivery failed after registration.", error);
  }
  setAuthCookies(res, token);
  recordAccountAudit({
    eventType: "account.registered",
    outcome: "success",
    userId: user.id,
    requestId: res.locals.requestId,
  });
  return res.status(201).json({
    ...(process.env.NODE_ENV === "production" ? {} : { token }),
    user: toPublicUser(user),
    verificationEmailSent,
  });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  const { email, password } = parsed.data;

  const user = findUserByEmail(email);
  if (!user) {
    recordAccountAudit({
      eventType: "login.failed",
      outcome: "failure",
      subject: email,
      requestId: res.locals.requestId,
    });
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    recordAccountAudit({
      eventType: "login.failed",
      outcome: "failure",
      userId: user.id,
      subject: email,
      requestId: res.locals.requestId,
    });
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = signToken(user.id);
  setAuthCookies(res, token);
  recordAccountAudit({
    eventType: "login.succeeded",
    outcome: "success",
    userId: user.id,
    requestId: res.locals.requestId,
  });
  return res.json({
    ...(process.env.NODE_ENV === "production" ? {} : { token }),
    user: toPublicUser(user),
  });
});

authRouter.post("/logout", (_req, res) => {
  clearAuthCookies(res);
  return res.status(204).end();
});

authRouter.post("/verification/request", requireAuth, async (req: AuthedRequest, res) => {
  const user = req.authUser!;
  if (user.emailVerified) return res.status(204).end();
  const token = issueAccountToken(user.id, "verify-email", 24 * 60 * 60 * 1000);
  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your TechSubbies email",
      text: `${frontendOrigin()}/verify-email?token=${encodeURIComponent(token)}`,
    });
  } catch {
    return res.status(503).json({ error: "Verification email is temporarily unavailable. Please try again." });
  }
  return res.status(202).json({ message: "Verification email queued." });
});

authRouter.post("/verification/confirm", async (req, res) => {
  const parsed = z.object({ token: z.string().min(20) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "A valid verification token is required." });
  const userId = consumeAccountToken(parsed.data.token, "verify-email");
  if (!userId || !markEmailVerified(userId)) {
    return res.status(400).json({ error: "This verification link is invalid or expired." });
  }
  recordAccountAudit({
    eventType: "email.verified",
    outcome: "success",
    userId,
    requestId: res.locals.requestId,
  });
  return res.json({ verified: true });
});

authRouter.post("/password-reset/request", async (req, res) => {
  const parsed = z.object({ email: z.string().email() }).safeParse(req.body);
  if (parsed.success) {
    const user = findUserByEmail(parsed.data.email.trim().toLowerCase());
    if (user) {
      const token = issueAccountToken(user.id, "reset-password", 60 * 60 * 1000);
      try {
        await sendEmail({
          to: user.email,
          subject: "Reset your TechSubbies password",
          text: `${frontendOrigin()}/reset-password?token=${encodeURIComponent(token)}`,
        });
      } catch (error) {
        // Preserve the identical response for known and unknown addresses.
        console.error("Password reset email delivery failed.", error);
      }
    }
  }
  // Identical response prevents account enumeration.
  return res.status(202).json({ message: "If that account exists, a reset email has been queued." });
});

authRouter.post("/password-reset/confirm", async (req, res) => {
  const parsed = z.object({
    token: z.string().min(20),
    newPassword: z.string().min(8),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "A valid token and password are required." });
  const userId = consumeAccountToken(parsed.data.token, "reset-password");
  if (!userId) return res.status(400).json({ error: "This reset link is invalid or expired." });
  await bcrypt.hash(parsed.data.newPassword, 12).then((hash) => updateUserPassword(userId, hash));
  recordAccountAudit({
    eventType: "password.reset",
    outcome: "success",
    userId,
    requestId: res.locals.requestId,
  });
  return res.status(204).end();
});

authRouter.post("/password/change", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Current and new passwords are required." });
  const user = findUserById(req.userId!)!;
  if (!(await bcrypt.compare(parsed.data.currentPassword, user.password))) {
    return res.status(401).json({ error: "Current password is incorrect." });
  }
  updateUserPassword(user.id, await bcrypt.hash(parsed.data.newPassword, 12));
  recordAccountAudit({
    eventType: "password.changed",
    outcome: "success",
    userId: user.id,
    requestId: res.locals.requestId,
  });
  return res.status(204).end();
});
