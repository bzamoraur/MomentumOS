import { describe, it, expect } from "vitest";
import type { DailyEntry, WeeklyCommitment, WeeklyReview } from "./types";
import {
  startOfWeek,
  previousWeekStart,
  endOfWeek,
  entriesForWeek,
  isWeekReviewable,
  findCommitment,
  findReview,
  weekToClose,
} from "./week";

const entry = (date: string): DailyEntry => ({
  date,
  keystone: "",
  notDoing: "",
  priorities: [],
});

describe("startOfWeek", () => {
  it("snaps to Monday for a Monday-start week", () => {
    // 2026-06-26 is a Friday.
    expect(startOfWeek("2026-06-26", "monday")).toBe("2026-06-22");
    // 2026-06-22 is itself the Monday.
    expect(startOfWeek("2026-06-22", "monday")).toBe("2026-06-22");
    // 2026-06-21 is a Sunday -> previous Monday.
    expect(startOfWeek("2026-06-21", "monday")).toBe("2026-06-15");
  });

  it("snaps to Sunday for a Sunday-start week", () => {
    expect(startOfWeek("2026-06-26", "sunday")).toBe("2026-06-21");
    expect(startOfWeek("2026-06-21", "sunday")).toBe("2026-06-21");
  });
});

describe("previousWeekStart / endOfWeek", () => {
  it("steps a week back and forward correctly", () => {
    expect(previousWeekStart("2026-06-22")).toBe("2026-06-15");
    expect(endOfWeek("2026-06-22")).toBe("2026-06-28");
  });
});

describe("entriesForWeek", () => {
  it("includes only dates within [weekOf, weekOf+6]", () => {
    const entries = [
      entry("2026-06-21"), // before
      entry("2026-06-22"), // start
      entry("2026-06-25"), // inside
      entry("2026-06-28"), // end
      entry("2026-06-29"), // after
    ];
    expect(entriesForWeek(entries, "2026-06-22").map((e) => e.date)).toEqual([
      "2026-06-22",
      "2026-06-25",
      "2026-06-28",
    ]);
  });

  it("is total on empty input", () => {
    expect(entriesForWeek([], "2026-06-22")).toEqual([]);
  });
});

describe("isWeekReviewable", () => {
  it("is reviewable only once the week has fully elapsed (today >= weekOf+7)", () => {
    expect(isWeekReviewable("2026-06-22", "2026-06-28")).toBe(false); // last day
    expect(isWeekReviewable("2026-06-22", "2026-06-29")).toBe(true); // +7
    expect(isWeekReviewable("2026-06-22", "2026-07-10")).toBe(true);
  });
});

describe("findCommitment / findReview", () => {
  const commitments: WeeklyCommitment[] = [
    { weekOf: "2026-06-15", commitment: "Protect deep work" },
  ];
  const reviews: WeeklyReview[] = [
    { weekOf: "2026-06-15", outcome: "partial", reviewedOn: "2026-06-22" },
  ];
  it("returns the match or null (total)", () => {
    expect(findCommitment(commitments, "2026-06-15")?.commitment).toBe("Protect deep work");
    expect(findCommitment(commitments, "2026-06-22")).toBeNull();
    expect(findCommitment([], "2026-06-15")).toBeNull();
    expect(findReview(reviews, "2026-06-15")?.outcome).toBe("partial");
    expect(findReview(reviews, "2026-06-22")).toBeNull();
  });
});

describe("weekToClose", () => {
  const commitments: WeeklyCommitment[] = [
    { weekOf: "2026-06-08", commitment: "A" },
    { weekOf: "2026-06-15", commitment: "B" },
    { weekOf: "2026-06-22", commitment: "C" }, // not yet elapsed at 'today'
  ];
  const today = "2026-06-24"; // 06-08 and 06-15 elapsed; 06-22 not

  it("returns the oldest elapsed, unreviewed week", () => {
    expect(weekToClose(commitments, [], today)).toBe("2026-06-08");
  });

  it("skips weeks that already have a review", () => {
    const reviews: WeeklyReview[] = [
      { weekOf: "2026-06-08", outcome: "kept", reviewedOn: "2026-06-15" },
    ];
    expect(weekToClose(commitments, reviews, today)).toBe("2026-06-15");
  });

  it("returns null when everything elapsed is reviewed (no guilt backlog)", () => {
    const reviews: WeeklyReview[] = [
      { weekOf: "2026-06-08", outcome: "kept", reviewedOn: "2026-06-15" },
      { weekOf: "2026-06-15", outcome: "missed", reviewedOn: "2026-06-22" },
    ];
    expect(weekToClose(commitments, reviews, today)).toBeNull();
  });

  it("returns null when no week has elapsed yet", () => {
    expect(weekToClose([{ weekOf: "2026-06-22", commitment: "C" }], [], "2026-06-24")).toBeNull();
  });
});
