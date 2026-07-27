import { describe, expect, it } from "vitest";
import { resolveApiBaseUrl } from "./apiConfig";

describe("resolveApiBaseUrl", () => {
  it("uses localhost only during development", () => {
    expect(resolveApiBaseUrl(undefined, false)).toBe("http://localhost:4000/api");
  });

  it("normalizes configured absolute and same-origin URLs", () => {
    expect(resolveApiBaseUrl("https://api.techsubbies.com/api/", true)).toBe("https://api.techsubbies.com/api");
    expect(resolveApiBaseUrl("/api/", true)).toBe("/api");
  });

  it("rejects missing or insecure production configuration", () => {
    expect(() => resolveApiBaseUrl(undefined, true)).toThrow(/must be configured/);
    expect(() => resolveApiBaseUrl("http://api.techsubbies.com/api", true)).toThrow(/HTTPS/);
  });

  it("rejects malformed configuration", () => {
    expect(() => resolveApiBaseUrl("not a url", false)).toThrow(/absolute URL/);
  });
});
