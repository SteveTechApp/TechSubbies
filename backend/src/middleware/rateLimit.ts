import type { NextFunction, Request, Response } from "express";

type RateLimitOptions = {
  windowMs: number;
  max: number;
  name: string;
  key?: (req: Request) => string;
};

type Entry = { count: number; resetAt: number };

export function createRateLimiter(options: RateLimitOptions) {
  const entries = new Map<string, Entry>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = options.key?.(req) || req.ip || req.socket.remoteAddress || "unknown";
    let entry = entries.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + options.windowMs };
      entries.set(key, entry);
    }

    entry.count += 1;
    const remaining = Math.max(0, options.max - entry.count);
    const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    res.setHeader("RateLimit-Limit", String(options.max));
    res.setHeader("RateLimit-Remaining", String(remaining));
    res.setHeader("RateLimit-Reset", String(retryAfterSeconds));

    if (entry.count > options.max) {
      res.setHeader("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        error: `Too many ${options.name} requests. Please try again later.`,
      });
    }
    next();
  };
}
