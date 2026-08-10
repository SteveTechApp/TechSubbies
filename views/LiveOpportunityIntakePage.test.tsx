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

    fireEvent.click(screen.getByRole("button", { name: /Add Engineer/ }));
    expect(screen.getByText("New engineer type")).toBeInTheDocument();
    expect(screen.queryByText("Start building your project team")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add to workspace" }));
    expect(screen.getByRole("button", { name: /AV Labour \/ Site Support/i })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Senior supervision required");
    expect(screen.getByRole("button", { name: /Continue to skill levels/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Step 3 Skill levels/i })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /Add Engineer/ }));
    fireEvent.change(screen.getByLabelText("Engineer type"), { target: { value: "senior-av-installer" } });
    fireEvent.click(screen.getByRole("button", { name: "Add to workspace" }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continue to skill levels/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Step 3 Skill levels/i })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: /AV Labour \/ Site Support/i }));
    expect(screen.getByText("Edit engineer type")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });

  it("prefills new engineer allocations from known project details", () => {
    render(<LiveOpportunityIntakePage />);

    const startDateField = screen.getByLabelText("Project start date").closest("label");
    const finishDateField = screen.getByLabelText("Project finish date").closest("label");
    const projectGridChildren = Array.from(startDateField?.parentElement?.children || []);
    const startDateIndex = projectGridChildren.indexOf(startDateField as Element);
    expect(projectGridChildren.indexOf(finishDateField as Element)).toBe(startDateIndex + 1);
    expect(startDateIndex % 2).toBe(0);

    fireEvent.change(screen.getByLabelText("Site location"), { target: { value: "Manchester Central" } });
    fireEvent.change(screen.getByLabelText("Project start date"), { target: { value: "2026-09-14" } });
    fireEvent.change(screen.getByLabelText("Project finish date"), { target: { value: "2026-09-16" } });
    fireEvent.change(screen.getByLabelText("Working hours"), { target: { value: "Night work" } });

    fireEvent.click(screen.getByRole("button", { name: /Step 2 Labour workspace/i }));
    fireEvent.click(screen.getByRole("button", { name: "Add Engineer" }));

    expect(screen.getByLabelText("Start date")).toHaveValue("2026-09-14");
    expect(screen.getByLabelText("Finish date")).toHaveValue("2026-09-16");
    expect(screen.getByLabelText("Duration in days")).toHaveValue(3);
    expect(screen.getByLabelText("Work location")).toHaveValue("Manchester Central");
    expect(screen.getByLabelText("Working hours")).toHaveValue("Night work");

    fireEvent.change(screen.getByLabelText("Work location"), { target: { value: "Liverpool Arena" } });
    expect(screen.getByLabelText("Work location")).toHaveValue("Liverpool Arena");
  });

  it("allows a restricted role to continue only with named external supervision", () => {
    render(<LiveOpportunityIntakePage />);

    fireEvent.click(screen.getByRole("button", { name: /Step 2 Labour workspace/i }));
    fireEvent.click(screen.getByRole("button", { name: /Add Engineer/ }));
    fireEvent.click(screen.getByRole("button", { name: "Add to workspace" }));

    const continueButton = screen.getByRole("button", { name: /Continue to skill levels/i });
    fireEvent.click(screen.getByLabelText(/Use client-provided supervision/i));
    expect(continueButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Named senior supervisor/), { target: { value: "Client Site Lead - Jane Smith" } });
    expect(continueButton).toBeEnabled();
    expect(screen.getByRole("button", { name: /Step 4 Review exchange/i })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: /Step 4 Review exchange/i }));
    expect(screen.getByText("Client-provided senior supervision")).toBeInTheDocument();
    expect(screen.getByText(/Client Site Lead - Jane Smith/)).toBeInTheDocument();
    expect(screen.getByText(/must not be treated as authorised to work alone/i)).toBeInTheDocument();
  });
});
