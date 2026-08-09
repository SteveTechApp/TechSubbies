export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 500,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorBody(error: AppError) {
  return { error: error.message, code: error.code, ...(error.details ? { details: error.details } : {}) };
}

export function defaultHttpErrorCode(statusCode: number) {
  if (statusCode === 400 || statusCode === 422) return "INVALID_REQUEST";
  if (statusCode === 401) return "AUTHENTICATION_REQUIRED";
  if (statusCode === 403) return "FORBIDDEN";
  if (statusCode === 404) return "NOT_FOUND";
  if (statusCode === 409) return "CONFLICT";
  if (statusCode === 429) return "RATE_LIMITED";
  return statusCode >= 500 ? "INTERNAL_ERROR" : "REQUEST_FAILED";
}
