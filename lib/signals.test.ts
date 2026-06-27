import { describe, it, expect } from "vitest";
import type { DailyEntry, Priority } from "./types";
import {
  lastN,
  isMeaningfulEntry,
  keystoneProtection,
  topPrioritySlip,
  tradeOffNamingRate,
  compoundingNeglectDays,
  plannedVsCompleted,
} from "./signals";

// --- tiny fixture builders -------------------------------------------------

function pri(title: string, done = false): Priority {
  return { id: title.toLowerCase().replace(/\s+/g, "-"), title, done };
}

function day(date: string, e: Partial<DailyEntry> = {}): DailyEntry {
  return {
    date,
    keystone: e.keystone ?? "Keystone",
    keystoneProtected: e.keystoneProtected,
    notDoing: e.notDoing ?? "",
    priorities: e.priorities ?? [],
    leverage: e.leverage,
    compoundingAction: e.compoundingAction,
    energy: e.energy,
    note: e.note,
  };
}

// --- lastN -----------------------------------------------------------------

describe("lastN", () => {
  it("returns the trailing window and is total on edges", () => {
    expect(lastN([1, 2, 3, 4], 2)).toEqual([3, 4]);
    expect(lastN([1, 2], 5)).toEqual([1, 2]);
    expect(lastN([1, 2], 0)).toEqual([]);
    expect(lastN([], 3)).toEqual([]);
  });
});

// --- isMeaningfulEntry ------------------------------------------------------

describe("isMeaningfulEntry", () => {
  it("is false for a blank entry", () => {
    expect(isMeaningfulEntry(day("d", { keystone: "" }))).toBe(false);
  });

  it("is true once a keystone is set", () => {
    expect(isMeaningfulEntry(day("d", { keystone: "Ship the deck" }))).toBe(true);
  });

  it("is true for any priority/trade-off/compounding/leverage/energy/note", () => {
    expect(isMeaningfulEntry(day("d", { keystone: "", priorities: [pri("a")] }))).toBe(true);
    expect(isMeaningfulEntry(day("d", { keystone: "", notDoing: "Declining a call" }))).toBe(true);
    expect(isMeaningfulEntry(day("d", { keystone: "", compoundingAction: "Read 20 pages" }))).toBe(true);
    expect(isMeaningfulEntry(day("d", { keystone: "", leverage: { kind: "reusable_ip" } }))).toBe(true);
    expect(isMeaningfulEntry(day("d", { keystone: "", energy: 3 }))).toBe(true);
    expect(isMeaningfulEntry(day("d", { keystone: "", note: "context" }))).toBe(true);
  });

  it("is false for a stray keystone-protected toggle with no keystone", () => {
    expect(isMeaningfulEntry(day("d", { keystone: "", keystoneProtected: false }))).toBe(false);
    expect(isMeaningfulEntry(day("d", { keystone: "", keystoneProtected: true }))).toBe(false);
  });
});

// --- keystoneProtection ----------------------------------------------------

describe("keystoneProtection", () => {
  it("counts protected vs answered, ignoring unanswered days", () => {
    const entries = [
      day("2026-06-20", { keystoneProtected: true }),
      day("2026-06-21", { keystoneProtected: false }),
      day("2026-06-22", { keystoneProtected: true }),
      day("2026-06-23", { keystoneProtected: undefined }), // today, not answered
    ];
    expect(keystoneProtection(entries, 7)).toEqual({
      protected: 2,
      answered: 3,
      window: 4,
    });
  });

  it("is total on empty input", () => {
    expect(keystoneProtection([], 7)).toEqual({
      protected: 0,
      answered: 0,
      window: 0,
    });
  });
});

// --- topPrioritySlip -------------------------------------------------------

describe("topPrioritySlip", () => {
  it("finds the longest unbroken undone run by title", () => {
    const entries = [
      day("d1", { priorities: [pri("Deck"), pri("Email", true)] }),
      day("d2", { priorities: [pri("Deck"), pri("Email", true)] }),
      day("d3", { priorities: [pri("Deck")] }),
    ];
    expect(topPrioritySlip(entries)).toEqual({ title: "Deck", days: 3 });
  });

  it("resets the streak when the priority is completed", () => {
    const entries = [
      day("d1", { priorities: [pri("Deck")] }),
      day("d2", { priorities: [pri("Deck", true)] }), // done -> reset
      day("d3", { priorities: [pri("Deck")] }),
    ];
    // best run is only 1 day each -> below the 2-day slip threshold
    expect(topPrioritySlip(entries)).toBeNull();
  });

  it("returns null when nothing slips", () => {
    const entries = [day("d1", { priorities: [pri("Deck", true)] })];
    expect(topPrioritySlip(entries)).toBeNull();
  });
});

// --- tradeOffNamingRate ----------------------------------------------------

describe("tradeOffNamingRate", () => {
  it("counts days where the trade-off was made explicit", () => {
    const entries = [
      day("d1", { notDoing: "Saying yes to the steerco rehearsal" }),
      day("d2", { notDoing: "   " }), // blank
      day("d3", { notDoing: "Inbox zero" }),
    ];
    expect(tradeOffNamingRate(entries, 7)).toEqual({ named: 2, total: 3 });
  });
});

// --- compoundingNeglectDays ------------------------------------------------

describe("compoundingNeglectDays", () => {
  it("counts trailing days with no compounding action", () => {
    const entries = [
      day("d1", { compoundingAction: "Read RM pricing paper" }),
      day("d2", {}),
      day("d3", {}),
    ];
    expect(compoundingNeglectDays(entries)).toBe(2);
  });

  it("returns 0 when the latest day has one", () => {
    const entries = [day("d1", {}), day("d2", { compoundingAction: "Wrote 200 words" })];
    expect(compoundingNeglectDays(entries)).toBe(0);
  });

  it("is total on empty input", () => {
    expect(compoundingNeglectDays([])).toBe(0);
  });
});

// --- plannedVsCompleted ----------------------------------------------------

describe("plannedVsCompleted", () => {
  it("sums raw planned and completed counts (no ratio/score)", () => {
    const entries = [
      day("d1", { priorities: [pri("a", true), pri("b")] }),
      day("d2", { priorities: [pri("c", true), pri("d", true)] }),
    ];
    expect(plannedVsCompleted(entries, 7)).toEqual({
      planned: 4,
      completed: 3,
      window: 2,
    });
  });
});
