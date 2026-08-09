import { randomUUID } from "node:crypto";
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";

const SAFE_REQUEST_ID = /^[a-zA-Z0-9_-]{1,100}$/;

export function requestContext(req: Request, res: Response, next: NextFunction) {
  const incoming = req.header("x-request-id") || "";
  const requestId = SAFE_REQUEST_ID.test(incoming) ? incoming : randomUUID();
  res.locals.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startedAt = Date.now();
  res.on("finish", () => {
    if (process.env.NODE_ENV !== "production" && process.env.LOG_REQUESTS !== "true") return;
    console.info(JSON.stringify({
      event: "http_request",
      requestId: res.locals.requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
    }));
  });
  next();
}

export const safeErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const requestId = res.locals.requestId || randomUUID();
  console.error(JSON.stringify({
    event: "unhandled_error",
    requestId,
    name: error instanceof Error ? error.name : "UnknownError",
  }));
  if (res.headersSent) return;
  res.status(500).json({
    error: "An unexpected server error occurred.",
    requestId,
  });
};
