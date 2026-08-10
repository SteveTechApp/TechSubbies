import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import EngineerPersonalBusinessProfilePage from "./EngineerPersonalBusinessProfilePage";

describe("engineer personal and business profile copy", () => {
  beforeEach(() => localStorage.clear());

  it("offers CV parsing without the LinkedIn profile import feature", () => {
    const { container } = render(<EngineerPersonalBusinessProfilePage />);

    expect(screen.queryByText(/Profile Import Assistant/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Analyse and suggest fields/i })).not.toBeInTheDocument();
    expect(screen.getByText("Upload and parse a formal CV")).toBeInTheDocument();
    expect(screen.getByLabelText(/Choose CV/i)).toHaveAttribute("accept", expect.stringContaining(".pdf"));
    expect(screen.queryByText("5. Tools, certifications and notes")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Private admin notes")).not.toBeInTheDocument();
    expect(screen.getByText("Companies should see only relevant public details.")).toBeInTheDocument();
    expect(container.textContent).not.toContain("€¢");
  });

  it("parses a text CV and applies reviewed contact fields", async () => {
    render(<EngineerPersonalBusinessProfilePage />);
    const cv = new File(
      ["Steve Goodwin\nSenior AV Engineer\nsteve@example.com\n07700 900 123\nExperienced commissioning engineer delivering complex audiovisual projects."],
      "steve-goodwin-cv.txt",
      { type: "text/plain" }
    );

    fireEvent.change(screen.getByLabelText(/Choose CV/i), { target: { files: [cv] } });
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("CV parsed locally"));
    fireEvent.click(screen.getByRole("button", { name: /Apply reviewed CV fields/i }));

    expect(screen.getByLabelText("Full legal name")).toHaveValue("Steve Goodwin");
    expect(screen.getByLabelText("Email")).toHaveValue("steve@example.com");
  });
});
