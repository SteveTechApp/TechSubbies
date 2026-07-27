import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PersistentAppHeader, { isNavLinkVisible } from "./PersistentAppHeader";
import { Role } from "../types";

const auth = vi.hoisted(() => ({
  user: null as any,
  logout: vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => auth,
}));

vi.mock("../data/demoAccounts", () => ({
  getDemoSession: () => null,
  clearDemoSession: vi.fn(),
}));

describe("PersistentAppHeader account state", () => {
  beforeEach(() => {
    auth.user = null;
    vi.clearAllMocks();
  });

  it("offers sign-in when there is no authenticated account", () => {
    render(<PersistentAppHeader />);

    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute("href", "/login");
  });

  it("shows a real backend account instead of the login action", () => {
    auth.user = {
      id: "engineer-1",
      role: Role.ENGINEER,
      emailVerified: true,
      profile: {
        name: "Alex Engineer",
        contact: { email: "alex@example.com" },
      },
    };
    render(<PersistentAppHeader />);

    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
    expect(screen.getByText("Alex Engineer")).toBeVisible();
    expect(screen.getByText(Role.ENGINEER)).toBeVisible();
    expect(screen.getByRole("button", { name: "Logout" })).toBeVisible();
  });

  it("filters protected workflow links for the signed-in role", () => {
    expect(isNavLinkVisible(
      { label: "Engineer profile", href: "/engineer/profile", protected: true, allowedRoles: [Role.ENGINEER] },
      Role.COMPANY,
      true,
      true
    )).toBe(false);
    expect(isNavLinkVisible(
      { label: "Post project", href: "/opportunity-intake", protected: true, allowedRoles: [Role.COMPANY] },
      Role.COMPANY,
      true,
      true
    )).toBe(true);
  });

  it("keeps discovery links visible to visitors but hides real-account settings from demos", () => {
    const accountSecurity = {
      label: "Account security",
      href: "/account/security",
      protected: true,
      requiresRealAccount: true,
    };
    expect(isNavLinkVisible(accountSecurity, undefined, false, false)).toBe(true);
    expect(isNavLinkVisible(accountSecurity, Role.ADMIN, true, false)).toBe(false);
  });
});
