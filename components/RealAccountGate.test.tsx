import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import RealAccountGate from "./RealAccountGate";

describe("RealAccountGate", () => {
  it("renders account settings for a backend-authenticated user", () => {
    render(<RealAccountGate hasRealAccount><div>Security settings</div></RealAccountGate>);
    expect(screen.getByText("Security settings")).toBeVisible();
  });

  it("explains why demo sessions cannot manage account security", () => {
    render(<RealAccountGate hasRealAccount={false}><div>Security settings</div></RealAccountGate>);
    expect(screen.queryByText("Security settings")).not.toBeInTheDocument();
    expect(screen.getByText("Account security is not part of demo access")).toBeVisible();
    expect(screen.getByRole("link", { name: "Sign in to a real account" })).toHaveAttribute("href", "/login");
  });
});
