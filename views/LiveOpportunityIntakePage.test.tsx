import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LiveOpportunityIntakePage from "./LiveOpportunityIntakePage";

describe("labour workspace", () => {
  it("starts empty and turns saved engineer types into editable cards", () => {
    render(<LiveOpportunityIntakePage />);

    fireEvent.click(screen.getByRole("button", { name: /Step 2 Labour workspace/i }));

    expect(screen.getByText("Start building your project team")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Step 3 Skill levels/i })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Add Engineer" }));
    expect(screen.getByText("New engineer type")).toBeInTheDocument();
    expect(screen.queryByText("Start building your project team")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add to workspace" }));
    expect(screen.getByRole("button", { name: /AV Labour \/ Site Support/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continue to skill levels/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Step 3 Skill levels/i })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: /AV Labour \/ Site Support/i }));
    expect(screen.getByText("Edit engineer type")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });
});
