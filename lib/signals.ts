/**
 * Signals engine — the brain of Momentum OS.
 *
 * Every function is PURE, DETERMINISTIC, and TOTAL (handles empty input and
 * missing fields). Every function returns a plain FACT, never a judgment and
 * never an aggregate score. This is "confrontation by your own data": the
 * product earns the right to challenge by being accurately specific, not by
 * tone. See PRODUCT_PRINCIPLES.md and DECISIONS.md (ADR-0002).
 *
 * Convention: `entries` is sorted ASCENDING by date (oldest first).
 */

import type { DailyEntry } from "./types";

/** Last `n` items (the most recent window). */
export function lastN<T>(items: readonly T[], n: number): T[] {
  if (n <= 0) return [];
  return items.slice(Math.max(0, items.length - n));
}

const norm = (s: string | undefined): string => (s ?? "").trim().toLowerCase();
const hasText = (s: string | undefined): boolean => norm(s).length > 0;

/**
 * Whether a day carries a real decision. Used to keep blank, unpersisted working
 * entries (the deck seeds an empty entry for "today" on mount) out of the record
 * and the signals. A lone keystone-protected toggle with no keystone is a stray
 * tap, not an entry — so it does NOT count.
 */
export function isMeaningfulEntry(e: DailyEntry): boolean {
  return (
    hasText(e.keystone) ||
    e.priorities.length > 0 ||
    hasText(e.notDoing) ||
    hasText(e.compoundingAction) ||
    e.leverage !== undefined ||
    e.energy !== undefined ||
    hasText(e.note)
  );
}

export interface KeystoneProtection {
  /** Days the keystone was protected. */
  protected: number;
  /** Days the end-of-day question was actually answered. */
  answered: number;
  /** Size of the window actually present. */
  window: number;
}

/** How often you protected the one thing that mattered, over the recent window. */
export function keystoneProtection(
  entries: DailyEntry[],
  windowDays = 7,
): KeystoneProtection {
  const w = lastN(entries, windowDays);
  let prot = 0;
  let answered = 0;
  for (const e of w) {
    if (e.keystoneProtected !== undefined) {
      answered++;
      if (e.keystoneProtected) prot++;
    }
  }
  return { protected: prot, answered, window: w.length };
}

export interface PrioritySlip {
  title: string;
  /** Consecutive days this priority has been carried undone. */
  days: number;
}

/**
 * The priority that has gone undone for the longest unbroken run of days.
 * Returns null unless a priority has slipped on at least 2 consecutive days.
 * Matching is by normalized title (trim + lowercase).
 */
export function topPrioritySlip(entries: DailyEntry[]): PrioritySlip | null {
  let prev = new Map<string, { title: string; streak: number }>();
  let best: PrioritySlip | null = null;

  for (const e of entries) {
    const curr = new Map<string, { title: string; streak: number }>();
    for (const p of e.priorities) {
      if (p.done) continue;
      const key = norm(p.title);
      if (!key) continue;
      const streak = (prev.get(key)?.streak ?? 0) + 1;
      curr.set(key, { title: p.title, streak });
      if (!best || streak > best.days) best = { title: p.title, days: streak };
    }
    prev = curr;
  }

  return best && best.days >= 2 ? best : null;
}

export interface NamingRate {
  named: number;
  total: number;
}

/** How often you made the trade-off explicit (named what you were NOT doing). */
export function tradeOffNamingRate(
  entries: DailyEntry[],
  windowDays = 7,
): NamingRate {
  const w = lastN(entries, windowDays);
  let named = 0;
  for (const e of w) if (hasText(e.notDoing)) named++;
  return { named, total: w.length };
}

/**
 * Consecutive most-recent days with no compounding action logged.
 * 0 means the latest day has one. Plain fact; no threshold, no judgment.
 */
export function compoundingNeglectDays(entries: DailyEntry[]): number {
  let days = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (hasText(entries[i].compoundingAction)) break;
    days++;
  }
  return days;
}

export interface PlannedVsCompleted {
  planned: number;
  completed: number;
  window: number;
}

/** Raw planned-vs-completed priority counts over the window. NOT a ratio/score. */
export function plannedVsCompleted(
  entries: DailyEntry[],
  windowDays = 7,
): PlannedVsCompleted {
  const w = lastN(entries, windowDays);
  let planned = 0;
  let completed = 0;
  for (const e of w) {
    planned += e.priorities.length;
    for (const p of e.priorities) if (p.done) completed++;
  }
  return { planned, completed, window: w.length };
}
