/**
 * Pure week-boundary logic for the Weekly Confrontation (PR3).
 *
 * A "week boundary" is an event, but "today" is a continuum — so the review is
 * anchored to the oldest *unreviewed elapsed* week, never to today's week
 * (ADR-0012). All functions are pure and total.
 */

import type { DailyEntry, WeeklyCommitment, WeeklyReview } from "./types";
import { addDays, weekdayUTC, daysBetween } from "./date";

export type WeekStart = "monday" | "sunday";

/** The start date of the week containing `date`. */
export function startOfWeek(date: string, weekStartsOn: WeekStart): string {
  const wd = weekdayUTC(date); // 0 = Sun … 6 = Sat
  const offset = weekStartsOn === "monday" ? (wd + 6) % 7 : wd;
  return addDays(date, -offset);
}

/** The start of the week immediately before `weekOf`. */
export function previousWeekStart(weekOf: string): string {
  return addDays(weekOf, -7);
}

/** The last day (inclusive) of the week starting at `weekOf`. */
export function endOfWeek(weekOf: string): string {
  return addDays(weekOf, 6);
}

/** Entries whose date falls within [weekOf, weekOf+6]. */
export function entriesForWeek(
  entries: DailyEntry[],
  weekOf: string,
): DailyEntry[] {
  const end = endOfWeek(weekOf);
  return entries.filter((e) => e.date >= weekOf && e.date <= end);
}

/** A week is reviewable once it has fully elapsed: today is on/after weekOf+7. */
export function isWeekReviewable(weekOf: string, today: string): boolean {
  return daysBetween(weekOf, today) >= 7;
}

export function findCommitment(
  commitments: WeeklyCommitment[],
  weekOf: string,
): WeeklyCommitment | null {
  return commitments.find((c) => c.weekOf === weekOf) ?? null;
}

export function findReview(
  reviews: WeeklyReview[],
  weekOf: string,
): WeeklyReview | null {
  return reviews.find((r) => r.weekOf === weekOf) ?? null;
}

/**
 * The oldest week that has a commitment, has fully elapsed, and has not yet been
 * reviewed — the single closeable week. Returns null when there is nothing to
 * close (the graceful, no-guilt-backlog case). Older un-reviewed weeks are left
 * without an outcome rather than demanded from memory.
 */
export function weekToClose(
  commitments: WeeklyCommitment[],
  reviews: WeeklyReview[],
  today: string,
): string | null {
  const candidates = commitments
    .map((c) => c.weekOf)
    .filter((weekOf) => isWeekReviewable(weekOf, today) && !findReview(reviews, weekOf))
    .sort();
  return candidates[0] ?? null;
}
