// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WeeklyReview } from "./weekly-review";
import { emptyState, serialize, STORAGE_KEY } from "@/lib/repository";
import { toISODate, addDays } from "@/lib/date";
import { startOfWeek } from "@/lib/week";

function readState() {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("WeeklyReview", () => {
  it("closes an elapsed unreviewed week with a once-only verdict", async () => {
    const user = userEvent.setup();
    // A commitment two weeks ago is guaranteed elapsed relative to real 'today'.
    const today = toISODate(new Date());
    const weekOf = startOfWeek(addDays(today, -14), "monday");
    const s = emptyState();
    s.commitments = [{ weekOf, commitment: "Protect deep work" }];
    s.entries[weekOf] = {
      date: weekOf,
      keystone: "Lock the storyline",
      keystoneProtected: true,
      notDoing: "No vendor demos",
      priorities: [],
    };
    window.localStorage.setItem(STORAGE_KEY, serialize(s));

    render(<WeeklyReview />);

    expect(await screen.findByText("Close last week")).toBeInTheDocument();
    expect(screen.getByText("Protect deep work")).toBeInTheDocument();

    // The verdict is the user's call.
    await user.click(screen.getByRole("button", { name: "kept" }));
    await user.click(screen.getByRole("button", { name: "Close the week" }));

    await waitFor(() => {
      const saved = readState();
      expect(saved.reviews).toHaveLength(1);
      expect(saved.reviews[0].outcome).toBe("kept");
      expect(saved.reviews[0].weekOf).toBe(weekOf);
    });

    // Week is now closed -> nothing left to close (no re-grade path in the UI).
    expect(await screen.findByText("Nothing to close")).toBeInTheDocument();
  });

  it("shows nothing-to-close on an empty store and persists an optional commitment", async () => {
    const user = userEvent.setup();
    render(<WeeklyReview />);

    expect(await screen.findByText(/first weekly review unlocks/i)).toBeInTheDocument();

    await user.type(
      screen.getByPlaceholderText("One behavioral change (optional)"),
      "Ship PR3b",
    );

    await waitFor(() => {
      const saved = readState();
      expect(saved.commitments.some((c: { commitment: string }) => c.commitment === "Ship PR3b")).toBe(true);
    });
  });
});
