import { describe, it, expect } from "vitest";
import { formatLongDate, daysBetween, toISODate } from "./date";

describe("formatLongDate", () => {
  it("formats an ISO date independent of timezone", () => {
    expect(formatLongDate("2026-06-26")).toBe("Friday, 26 June 2026");
    expect(formatLongDate("2026-01-01")).toBe("Thursday, 1 January 2026");
  });
});

describe("daysBetween", () => {
  it("counts whole days, directionally", () => {
    expect(daysBetween("2026-06-22", "2026-06-26")).toBe(4);
    expect(daysBetween("2026-06-26", "2026-06-26")).toBe(0);
    expect(daysBetween("2026-06-26", "2026-06-22")).toBe(-4);
  });
});

describe("toISODate", () => {
  it("uses local calendar components, not UTC (no evening date-roll)", () => {
    // Constructed with LOCAL components; reading LOCAL components must agree,
    // independent of the runner timezone. The UTC bug would fail at 23:59.
    expect(toISODate(new Date(2026, 5, 26, 23, 59))).toBe("2026-06-26");
    expect(toISODate(new Date(2026, 0, 1, 0, 0))).toBe("2026-01-01");
  });

  it("zero-pads month and day", () => {
    expect(toISODate(new Date(2026, 2, 9, 12, 0))).toBe("2026-03-09");
  });

  it("handles a spring-forward DST date", () => {
    // 2026-03-08 is US spring-forward; the local calendar date is unaffected.
    expect(toISODate(new Date(2026, 2, 8, 12, 0))).toBe("2026-03-08");
  });
});
