// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InteractiveDeck } from "./interactive-deck";
import { STORAGE_KEY, BACKUP_KEY, emptyState, serialize } from "@/lib/repository";
import { toISODate } from "@/lib/date";

const KEYSTONE_PLACEHOLDER = "What is the one thing that defines today?";

beforeEach(() => {
  window.localStorage.clear();
});

describe("InteractiveDeck", () => {
  it("is empty-first: nothing is persisted until the user edits", async () => {
    const user = userEvent.setup();
    render(<InteractiveDeck />);

    const keystone = await screen.findByPlaceholderText(KEYSTONE_PLACEHOLDER);
    // mounted, but no write yet
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();

    await user.type(keystone, "Ship the deck");

    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(raw).toContain("Ship the deck");
  });

  it("enforces the priority cap (a preference of 3)", async () => {
    const user = userEvent.setup();
    render(<InteractiveDeck />);
    await screen.findByPlaceholderText(KEYSTONE_PLACEHOLDER);

    for (const title of ["One", "Two", "Three"]) {
      await user.type(screen.getByPlaceholderText("Add a priority"), title);
      await user.click(screen.getByRole("button", { name: "Add" }));
    }

    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText(/At your cap/)).toBeInTheDocument();
    // the add affordance is gone at the cap
    expect(screen.queryByPlaceholderText("Add a priority")).toBeNull();
  });

  it("fails safe into read-only recovery on corrupt data, backing it up write-once", async () => {
    window.localStorage.setItem(STORAGE_KEY, "{corrupt-not-json");
    render(<InteractiveDeck />);

    expect(await screen.findByText("Recovery mode")).toBeInTheDocument();
    // editing is blocked (no input rendered)
    expect(screen.queryByPlaceholderText(KEYSTONE_PLACEHOLDER)).toBeNull();
    // the original blob is backed up, untouched
    expect(window.localStorage.getItem(BACKUP_KEY)).toBe("{corrupt-not-json");
  });

  it("does not overwrite the deck while in recovery mode", async () => {
    window.localStorage.setItem(STORAGE_KEY, "{corrupt");
    render(<InteractiveDeck />);
    await screen.findByText("Recovery mode");
    // the corrupt source blob is left intact (no silent wipe / overwrite)
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("{corrupt");
  });

  it("records the end-of-day keystone-protected answer", async () => {
    const user = userEvent.setup();
    render(<InteractiveDeck />);
    await screen.findByPlaceholderText(KEYSTONE_PLACEHOLDER);

    await user.click(screen.getByRole("button", { name: "Protected" }));

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEY)).toContain(
        '"keystoneProtected":true',
      );
    });
  });

  it("keeps a saved leverage kind selectable after it is disabled in preferences", async () => {
    const today = toISODate(new Date());
    const s = emptyState();
    s.preferences.leveragePrompts = ["irreversible_decision"]; // reusable_ip disabled
    s.entries[today] = {
      date: today,
      keystone: "K",
      notDoing: "",
      priorities: [],
      leverage: { kind: "reusable_ip" }, // saved earlier, now not in prompts
    };
    window.localStorage.setItem(STORAGE_KEY, serialize(s));

    render(<InteractiveDeck />);
    await screen.findByPlaceholderText(KEYSTONE_PLACEHOLDER);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("reusable_ip"); // not orphaned to blank
    expect(
      screen.getByRole("option", { name: "Reusable IP captured" }),
    ).toBeInTheDocument();
  });

  it("shows the minimum-viable-day note until a priority is added", async () => {
    const user = userEvent.setup();
    render(<InteractiveDeck />);
    await screen.findByPlaceholderText(KEYSTONE_PLACEHOLDER);

    expect(screen.getByText(/Minimum: a keystone/)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Add a priority"), "First");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.queryByText(/Minimum: a keystone/)).toBeNull();
  });
});
