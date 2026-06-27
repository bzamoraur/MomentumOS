// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PreferencesForm } from "./preferences-form";
import { STORAGE_KEY } from "@/lib/repository";

function readPrefs() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw).preferences : null;
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("PreferencesForm", () => {
  it("changes the priority cap and persists", async () => {
    const user = userEvent.setup();
    render(<PreferencesForm />);
    await screen.findByText("Daily priority cap");

    await user.click(screen.getByRole("button", { name: "Increase cap" }));
    await waitFor(() => expect(readPrefs().maxPriorities).toBe(4));

    await user.click(screen.getByRole("button", { name: "Decrease cap" }));
    await user.click(screen.getByRole("button", { name: "Decrease cap" }));
    await waitFor(() => expect(readPrefs().maxPriorities).toBe(2));
  });

  it("toggles the week start and persists", async () => {
    const user = userEvent.setup();
    render(<PreferencesForm />);
    await screen.findByText("Week starts on");

    await user.click(screen.getByRole("button", { name: "sunday" }));
    await waitFor(() => expect(readPrefs().weekStartsOn).toBe("sunday"));
  });

  it("toggles a leverage prompt off and persists", async () => {
    const user = userEvent.setup();
    render(<PreferencesForm />);
    await screen.findByText("Leverage prompts");

    await user.click(
      screen.getByRole("button", { name: /Biggest irreversible decision/ }),
    );
    await waitFor(() =>
      expect(readPrefs().leveragePrompts).not.toContain("irreversible_decision"),
    );
  });
});
