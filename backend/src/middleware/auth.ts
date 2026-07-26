import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserById, type UserRow } from "../lib/db.js";

export interface AuthedRequest extends Request {
  userId?: string;
  authUser?: UserRow;
}

const JWT_SECRET = process.env.JWT_SECRET || "insecure-dev-secret-change-me";

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
}

// Protects routes that require a signed-in user. Expects
// `Authorization: Bearer <token>` and attaches `req.userId` on success.
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header." });
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    const user = findUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: "The account for this session no longer exists." });
    }
    req.userId = user.id;
    req.authUser = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

// Authentication and role checks remain separate so ownership-based routes
// can use requireAuth alone, while role-sensitive routes declare their
// allowed account types at the route boundary.
export function requireRole(...allowedRoles: string[]) {
  const allowed = new Set(allowedRoles);

  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.authUser) {
      return res.status(401).json({ error: "Authentication is required." });
    }
    if (!allowed.has(req.authUser.role)) {
      return res.status(403).json({ error: "Your account role is not allowed to perform this action." });
    }
    next();
  };
}
