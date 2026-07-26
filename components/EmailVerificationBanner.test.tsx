import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmailVerificationBanner from "./EmailVerificationBanner";
import apiService from "../services/apiService";

const authState = vi.hoisted(() => ({
  user: null as null | { emailVerified?: boolean },
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => authState,
}));

vi.mock("../services/apiService", () => ({
  default: {
    resendEmailVerification: vi.fn(),
  },
}));

describe("EmailVerificationBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = null;
  });

  it("stays hidden for signed-out and verified users", () => {
    const { rerender } = render(<EmailVerificationBanner />);
    expect(screen.queryByLabelText("Email verification required")).not.toBeInTheDocument();

    authState.user = { emailVerified: true };
    rerender(<EmailVerificationBanner />);
    expect(screen.queryByLabelText("Email verification required")).not.toBeInTheDocument();
  });

  it("shows guidance for an explicitly unverified account", () => {
    authState.user = { emailVerified: false };
    render(<EmailVerificationBanner />);

    expect(screen.getByText("Verify your email to use marketplace actions.")).toBeVisible();
    expect(screen.getByRole("link", { name: "Account security" })).toHaveAttribute("href", "/account/security");
  });

  it("resends verification and prevents repeated requests", async () => {
    authState.user = { emailVerified: false };
    vi.mocked(apiService.resendEmailVerification).mockResolvedValue();
    const user = userEvent.setup();
    render(<EmailVerificationBanner />);

    await user.click(screen.getByRole("button", { name: "Resend email" }));

    expect(apiService.resendEmailVerification).toHaveBeenCalledOnce();
    expect(await screen.findByRole("button", { name: "Email sent" })).toBeDisabled();
  });

  it("shows recovery guidance when resend fails", async () => {
    authState.user = { emailVerified: false };
    vi.mocked(apiService.resendEmailVerification).mockRejectedValue(new Error("offline"));
    const user = userEvent.setup();
    render(<EmailVerificationBanner />);

    await user.click(screen.getByRole("button", { name: "Resend email" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We could not send the email. Try again from Account security."
    );
  });
});
