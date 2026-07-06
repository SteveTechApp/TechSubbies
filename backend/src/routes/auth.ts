import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createUser, findUserByEmail } from "../lib/db.js";
import { signToken } from "../middleware/auth.js";
import { toPublicUser } from "../lib/publicUser.js";

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.string().min(1),
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
  const { email, password, role, name, profileData } = parsed.data;

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
  return res.status(201).json({ token, user: toPublicUser(user) });
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
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = signToken(user.id);
  return res.json({ token, user: toPublicUser(user) });
});
