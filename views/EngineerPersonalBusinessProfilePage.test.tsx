import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import EngineerPersonalBusinessProfilePage from "./EngineerPersonalBusinessProfilePage";

describe("engineer personal and business profile copy", () => {
  beforeEach(() => localStorage.clear());

  it("renders clean list markers and omits the internal LinkedIn warning", () => {
    const { container } = render(<EngineerPersonalBusinessProfilePage />);

    expect(screen.queryByText(/Do not scrape logged-in LinkedIn pages/i)).not.toBeInTheDocument();
    expect(screen.getByText("Companies should see only relevant public details.")).toBeInTheDocument();
    expect(container.textContent).not.toContain("€¢");
  });

  it("explains that a LinkedIn URL saves the link but cannot import profile content", () => {
    render(<EngineerPersonalBusinessProfilePage />);

    fireEvent.change(screen.getByLabelText(/LinkedIn profile URL/i), {
      target: { value: "www.linkedin.com/in/steve-goodwin-a9688114" },
    });
    fireEvent.change(screen.getByLabelText(/Personal \/ company website/i), {
      target: { value: "www.linkedin.com/in/steve-goodwin-a9688114" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Analyse and suggest fields/i }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "LinkedIn does not provide profile content from a public URL alone"
    );
    expect(screen.getByLabelText(/LinkedIn profile URL/i)).toHaveValue(
      "https://www.linkedin.com/in/steve-goodwin-a9688114"
    );
    expect(screen.getByLabelText(/Personal \/ company website/i)).toHaveValue("");
  });
});
