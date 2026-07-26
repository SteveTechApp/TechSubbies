import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  AccountSecurityPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from "./AccountAccessPages";
import apiService from "../services/apiService";

const authState = vi.hoisted(() => ({
  user: { emailVerified: false },
  logout: vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => authState,
}));

vi.mock("../services/apiService", () => ({
  default: {
    requestPasswordReset: vi.fn(),
    confirmPasswordReset: vi.fn(),
    confirmEmailVerification: vi.fn(),
    resendEmailVerification: vi.fn(),
    changePassword: vi.fn(),
  },
}));

describe("account access pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, "", "/");
    authState.user.emailVerified = false;
  });

  it("requests password reset instructions without revealing account existence", async () => {
    vi.mocked(apiService.requestPasswordReset).mockResolvedValue();
    const user = userEvent.setup();
    render(<ForgotPasswordPage />);

    await user.type(screen.getByLabelText("Email"), "engineer@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset instructions" }));

    expect(apiService.requestPasswordReset).toHaveBeenCalledWith("engineer@example.com");
    expect(await screen.findByText("If that account exists, reset instructions have been sent.")).toBeVisible();
  });

  it("does not submit reset passwords that do not match", async () => {
    window.history.replaceState({}, "", "/reset-password?token=reset-token");
    const user = userEvent.setup();
    render(<ResetPasswordPage />);

    await user.type(screen.getByLabelText("New password"), "new-password");
    await user.type(screen.getByLabelText("Confirm password"), "different-password");
    await user.click(screen.getByRole("button", { name: "Reset password" }));

    expect(screen.getByText("Passwords do not match.")).toBeVisible();
    expect(apiService.confirmPasswordReset).not.toHaveBeenCalled();
  });

  it("submits the reset token and matching password", async () => {
    window.history.replaceState({}, "", "/reset-password?token=reset-token");
    vi.mocked(apiService.confirmPasswordReset).mockResolvedValue();
    const user = userEvent.setup();
    render(<ResetPasswordPage />);

    await user.type(screen.getByLabelText("New password"), "new-password");
    await user.type(screen.getByLabelText("Confirm password"), "new-password");
    await user.click(screen.getByRole("button", { name: "Reset password" }));

    expect(apiService.confirmPasswordReset).toHaveBeenCalledWith("reset-token", "new-password");
    expect(await screen.findByText("Password reset. You can now sign in.")).toBeVisible();
  });

  it("rejects an incomplete email verification link locally", () => {
    render(<VerifyEmailPage />);

    expect(screen.getByText("This verification link is incomplete.")).toBeVisible();
    expect(apiService.confirmEmailVerification).not.toHaveBeenCalled();
  });

  it("confirms an email verification token", async () => {
    window.history.replaceState({}, "", "/verify-email?token=verify-token");
    vi.mocked(apiService.confirmEmailVerification).mockResolvedValue();
    render(<VerifyEmailPage />);

    await waitFor(() => expect(apiService.confirmEmailVerification).toHaveBeenCalledWith("verify-token"));
    expect(await screen.findByText("Email verified successfully.")).toBeVisible();
  });

  it("lets an unverified user request another verification email", async () => {
    vi.mocked(apiService.resendEmailVerification).mockResolvedValue();
    render(<AccountSecurityPage />);

    fireEvent.click(screen.getByRole("button", { name: "Resend verification email" }));

    expect(apiService.resendEmailVerification).toHaveBeenCalledOnce();
    expect(await screen.findByText("Verification email queued.")).toBeVisible();
  });
});
