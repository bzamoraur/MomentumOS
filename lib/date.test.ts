import { describe, it, expect } from "vitest";
import { formatLongDate, daysBetween } from "./date";

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
