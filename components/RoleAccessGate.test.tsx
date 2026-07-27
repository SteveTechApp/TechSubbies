import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import RoleAccessGate, { canAccessRole } from "./RoleAccessGate";
import { Role } from "../types";

describe("RoleAccessGate", () => {
  it("allows a matching account role", () => {
    render(
      <RoleAccessGate currentRole={Role.ENGINEER} allowedRoles={[Role.ENGINEER]}>
        <div>Engineer workflow</div>
      </RoleAccessGate>
    );
    expect(screen.getByText("Engineer workflow")).toBeVisible();
  });

  it("allows admins to support every role workflow", () => {
    expect(canAccessRole(Role.ADMIN, [Role.COMPANY])).toBe(true);
  });

  it("explains a role mismatch and offers a safe route back", () => {
    render(
      <RoleAccessGate currentRole={Role.ENGINEER} allowedRoles={[Role.COMPANY, Role.RESOURCING_COMPANY]}>
        <div>Company workflow</div>
      </RoleAccessGate>
    );
    expect(screen.queryByText("Company workflow")).not.toBeInTheDocument();
    expect(screen.getByText("This tool is not available for your account")).toBeVisible();
    expect(screen.getByRole("link", { name: "Return to your dashboard" })).toHaveAttribute("href", "/");
  });
});
