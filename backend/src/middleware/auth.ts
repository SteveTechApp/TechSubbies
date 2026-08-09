import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../lib/db.js";

export interface AuthedRequest extends Request {
  userId?: string;
  authUser?: UserRow;
}

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be configured in production.");
  }
  return secret || "insecure-dev-secret-change-me";
}

export function signToken(userId: string,sessionVersion=0): string {
  return jwt.sign({ sub: userId,sv:sessionVersion }, jwtSecret(), { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any, issuer: "techsubbies-api", audience: "techsubbies-app" });
}

// Browser sessions use an HttpOnly cookie. Bearer tokens remain supported
// for non-browser API clients and automated tests.
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const cookieToken = parseCookies(req)[SESSION_COOKIE];
  const bearerToken = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;
  const token = cookieToken || bearerToken;
  if (!token) return res.status(401).json({ error: "Authentication is required." });
  try {
    const payload = jwt.verify(token, jwtSecret(), { issuer: "techsubbies-api", audience: "techsubbies-app" }) as { sub: string;sv?:number };
    const user=findUserById(payload.sub);if(!user||user.sessionVersion!==(payload.sv||0))return res.status(401).json({error:"Session has been revoked."});
    req.userId = payload.sub;
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

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Marketplace reads remain available according to each route's existing
// access policy. Any action that changes marketplace state requires both a
// valid session and a verified email address.
export function requireVerifiedEmailForMutation(req: AuthedRequest, res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) return next();

  return requireAuth(req, res, () => {
    if (!req.authUser?.emailVerified) {
      return res.status(403).json({
        error: "Verify your email address before performing marketplace actions.",
        code: "EMAIL_VERIFICATION_REQUIRED",
      });
    }
    next();
  });
}
