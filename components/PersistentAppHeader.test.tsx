import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PersistentAppHeader from "./PersistentAppHeader";
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
});
