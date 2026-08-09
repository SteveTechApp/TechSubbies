import { randomBytes, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export const SESSION_COOKIE = "techsubbies_session";
export const CSRF_COOKIE = "techsubbies_csrf";

export function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie;
  if (!header) return {};

  return Object.fromEntries(
    header.split(";").flatMap((part) => {
      const separator = part.indexOf("=");
      if (separator < 0) return [];
      const key = part.slice(0, separator).trim();
      const value = part.slice(separator + 1).trim();
      try {
        return [[key, decodeURIComponent(value)]];
      } catch {
        return [];
      }
    })
  );
}

export function setAuthCookies(res: Response, token: string) {
  const production = process.env.NODE_ENV === "production";
  const common = {
    secure: production,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie(SESSION_COOKIE, token, { ...common, httpOnly: true });
  res.cookie(CSRF_COOKIE, randomBytes(32).toString("base64url"), {
    ...common,
    httpOnly: false,
  });
}

export function clearAuthCookies(res: Response) {
  const production = process.env.NODE_ENV === "production";
  const options = { secure: production, sameSite: "lax" as const, path: "/" };
  res.clearCookie(SESSION_COOKIE, { ...options, httpOnly: true });
  res.clearCookie(CSRF_COOKIE, { ...options, httpOnly: false });
}

export function requireCsrf(req: Request, res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

  const cookies = parseCookies(req);
  // Bearer-authenticated API clients remain supported and are not vulnerable
  // to browser cookie CSRF. Cookie sessions must prove the double-submit token.
  if (!cookies[SESSION_COOKIE]) return next();

  const cookieToken = cookies[CSRF_COOKIE] || "";
  const headerToken = req.header("x-csrf-token") || "";
  const cookieBytes = Buffer.from(cookieToken);
  const headerBytes = Buffer.from(headerToken);
  if (
    !cookieToken ||
    cookieBytes.length !== headerBytes.length ||
    !timingSafeEqual(cookieBytes, headerBytes)
  ) {
    return res.status(403).json({ error: "Invalid or missing CSRF token." });
  }
  next();
}

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
}
