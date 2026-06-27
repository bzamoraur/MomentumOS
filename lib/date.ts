/** Deterministic, timezone-safe date helpers (no wall-clock dependency). */

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function toUTC(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** "2026-06-26" -> "Friday, 26 June 2026". */
export function formatLongDate(iso: string): string {
  const dt = toUTC(iso);
  return `${WEEKDAYS[dt.getUTCDay()]}, ${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
}

/** Whole days from `a` to `b` (b - a). Negative if b precedes a. */
export function daysBetween(a: string, b: string): number {
  return Math.round((toUTC(b).getTime() - toUTC(a).getTime()) / 86_400_000);
}

/**
 * Local-calendar ISO date ('YYYY-MM-DD') for a given moment.
 * Uses LOCAL components, never UTC — `toISOString().slice(0,10)` is the classic
 * bug that rolls the date over in the evening in negative-offset timezones.
 */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
