import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../lib/db.js";

export interface AuthedRequest extends Request {
  userId?: string;
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

// Protects routes that require a signed-in user. Expects
// `Authorization: Bearer <token>` and attaches `req.userId` on success.
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header." });
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, jwtSecret(), { issuer: "techsubbies-api", audience: "techsubbies-app" }) as { sub: string;sv?:number };
    const user=findUserById(payload.sub);if(!user||user.sessionVersion!==(payload.sv||0))return res.status(401).json({error:"Session has been revoked."});
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
