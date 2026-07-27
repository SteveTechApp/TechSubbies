import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DemoLoginPage from "./DemoLoginPage";
import apiService from "../services/apiService";

const auth = vi.hoisted(() => ({ setUser: vi.fn() }));
const demo = vi.hoisted(() => ({
  session: {
    id: "demo-admin",
    name: "Demo Admin",
    email: "admin@techsubbies.demo",
    role: "Admin" as const,
    signedInAt: "2026-01-01T00:00:00.000Z",
  },
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => auth,
}));

vi.mock("../services/apiService", () => ({
  default: { loginWithPassword: vi.fn() },
}));

vi.mock("../data/demoAccounts", () => ({
  isDemoAccessEnabled: true,
  setDemoSession: vi.fn(() => demo.session),
  validateDemoLogin: vi.fn((email: string, password: string) =>
    email === "admin@techsubbies.demo" && password === "password"
      ? { ...demo.session, password }
      : null
  ),
}));

describe("sign-in page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts empty and fills demo credentials only when requested", async () => {
    const user = userEvent.setup();
    render(<DemoLoginPage />);

    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Password")).toHaveValue("");

    await user.click(screen.getByRole("button", { name: "Use demo credentials" }));
    expect(screen.getByLabelText("Email")).toHaveValue("admin@techsubbies.demo");
    expect(screen.getByLabelText("Password")).toHaveValue("password");
  });

  it("preserves a real backend error instead of replacing it with a demo error", async () => {
    vi.mocked(apiService.loginWithPassword).mockRejectedValue(new Error("Invalid credentials."));
    const user = userEvent.setup();
    render(<DemoLoginPage />);

    await user.type(screen.getByLabelText("Email"), "real@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Invalid credentials.")).toBeVisible();
  });

  it("uses the isolated demo fallback only for matching demo credentials", async () => {
    vi.mocked(apiService.loginWithPassword).mockRejectedValue(new TypeError("Backend unavailable"));
    const onSignedIn = vi.fn();
    const user = userEvent.setup();
    render(<DemoLoginPage onSignedIn={onSignedIn} />);

    await user.click(screen.getByRole("button", { name: "Use demo credentials" }));
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(onSignedIn).toHaveBeenCalledWith(demo.session);
    expect(auth.setUser).not.toHaveBeenCalled();
  });
});
