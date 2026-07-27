import { describe, expect, it } from "vitest";
import { Role } from "../types";
import { dashboardPathForRole } from "./accountRoutes";

describe("dashboardPathForRole", () => {
  it.each([
    [Role.ENGINEER, "/engineer/dashboard"],
    [Role.COMPANY, "/company/dashboard"],
    [Role.RESOURCING_COMPANY, "/resourcing/dashboard"],
    [Role.ADMIN, "/admin/dashboard"],
  ])("maps %s accounts to %s", (role, path) => {
    expect(dashboardPathForRole(role)).toBe(path);
  });

  it("falls back safely for an unknown role", () => {
    expect(dashboardPathForRole("Unknown")).toBe("/");
  });
});
