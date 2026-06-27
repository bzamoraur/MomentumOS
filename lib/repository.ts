/**
 * Persistence seam for Momentum OS (PR2).
 *
 * The `MomentumRepository` interface is the only forward-looking indirection in
 * the project (ADR-0006). It is designed to FAIL SAFE: on corrupt data it never
 * silently wipes the ledger — it reports `corrupt`, archives the raw blob
 * write-once, and lets the UI enter a read-only recovery state (ADR-0011).
 *
 * The serialize/deserialize/update logic is pure and unit-tested; the localStorage
 * binding is a thin, non-throwing wrapper.
 */

import type {
  DailyEntry,
  WeeklyCommitment,
  WeeklyReview,
  Preferences,
} from "./types";
import { daysBetween } from "./date";

export const SCHEMA_VERSION = 2;
export const STORAGE_KEY = "momentum-os:v1";
export const BACKUP_KEY = "momentum-os:v1:corrupt-backup";

export const DEFAULT_PREFERENCES: Preferences = {
  maxPriorities: 3,
  weekStartsOn: "monday",
  leveragePrompts: [
    "irreversible_decision",
    "senior_time_on_junior_work",
    "reusable_ip",
  ],
};

export interface MomentumState {
  schemaVersion: number;
  /** Keyed by ISODate ('YYYY-MM-DD'). */
  entries: Record<string, DailyEntry>;
  commitments: WeeklyCommitment[];
  reviews: WeeklyReview[];
  preferences: Preferences;
}

export function emptyState(
  preferences: Preferences = DEFAULT_PREFERENCES,
): MomentumState {
  return {
    schemaVersion: SCHEMA_VERSION,
    entries: {},
    commitments: [],
    reviews: [],
    preferences,
  };
}

export type LoadResult =
  | { status: "ok"; state: MomentumState }
  | { status: "empty"; state: MomentumState }
  | { status: "corrupt"; state: MomentumState; raw: string };

export function serialize(state: MomentumState): string {
  return JSON.stringify(state);
}

/**
 * Total parse: null/blank -> empty; unparseable or shape-invalid -> corrupt (with
 * the raw blob preserved for recovery). A MISSING schemaVersion is treated as
 * corrupt-recover, never assumed to be the current version.
 */
export function deserialize(raw: string | null | undefined): LoadResult {
  if (raw == null || raw.trim() === "") {
    return { status: "empty", state: emptyState() };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { status: "corrupt", state: emptyState(), raw };
  }
  if (isV2(parsed)) {
    return { status: "ok", state: parsed };
  }
  // Migrate a valid v1 blob forward so existing users are never dropped into
  // recovery by a schema bump (ADR-0012).
  if (isV1(parsed)) {
    return { status: "ok", state: migrateV1toV2(parsed) };
  }
  return { status: "corrupt", state: emptyState(), raw };
}

/** Shared shape checks common to every version. */
function hasCoreShape(s: Record<string, unknown>): boolean {
  if (typeof s.entries !== "object" || s.entries === null) return false;
  if (!Array.isArray(s.commitments)) return false;
  if (typeof s.preferences !== "object" || s.preferences === null) return false;
  return true;
}

function isV2(v: unknown): v is MomentumState {
  if (typeof v !== "object" || v === null) return false;
  const s = v as Record<string, unknown>;
  return s.schemaVersion === 2 && hasCoreShape(s) && Array.isArray(s.reviews);
}

/** v1 had no `reviews` array and no current entity changes otherwise. */
function isV1(v: unknown): boolean {
  if (typeof v !== "object" || v === null) return false;
  const s = v as Record<string, unknown>;
  return s.schemaVersion === 1 && hasCoreShape(s);
}

function migrateV1toV2(v: unknown): MomentumState {
  const s = v as MomentumState;
  // v1 had no UI path that persisted a commitment (commitments were always [] in
  // a real store), so there is no v1 `outcome`/`outcomeNote` to lift into a review.
  return { ...s, schemaVersion: 2, reviews: [] };
}

/**
 * Update one day's entry. Enforces the immutability invariant: a date earlier
 * than `today` cannot be modified — the historical record is structural, not
 * a UI convention (ADR-0011).
 */
export function updateEntry(
  state: MomentumState,
  date: string,
  entry: DailyEntry,
  today: string,
): MomentumState {
  if (date < today) {
    throw new Error(
      `Refusing to modify a past entry (${date} < ${today}); the record is immutable.`,
    );
  }
  return { ...state, entries: { ...state.entries, [date]: entry } };
}

/** Entries sorted ascending by date — the shape `lib/signals.ts` expects. */
export function entriesAscending(state: MomentumState): DailyEntry[] {
  return Object.values(state.entries).sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0,
  );
}

/** Set (or replace) the forward commitment for a week. Forward-looking, so editable. */
export function setCommitment(
  state: MomentumState,
  commitment: WeeklyCommitment,
): MomentumState {
  const others = state.commitments.filter((c) => c.weekOf !== commitment.weekOf);
  return {
    ...state,
    commitments: [...others, commitment].sort((a, b) =>
      a.weekOf < b.weekOf ? -1 : 1,
    ),
  };
}

/**
 * Close a week with an append-once review. Refuses to grade a week that has not
 * fully elapsed, and refuses a SECOND review for a week — the verdict on past
 * behavior is immutable, not a UI convention (ADR-0012).
 */
export function closeWeek(
  state: MomentumState,
  review: WeeklyReview,
  today: string,
): MomentumState {
  if (daysBetween(review.weekOf, today) < 7) {
    throw new Error(
      `Refusing to close week ${review.weekOf}: it has not fully elapsed as of ${today}.`,
    );
  }
  if (state.reviews.some((r) => r.weekOf === review.weekOf)) {
    throw new Error(
      `Refusing to re-grade week ${review.weekOf}: a review already exists (immutable).`,
    );
  }
  return { ...state, reviews: [...state.reviews, review] };
}

export interface MomentumRepository {
  load(): LoadResult;
  save(state: MomentumState): { ok: boolean };
}

/** In-memory repository for tests and SSR. */
export function createInMemoryRepository(
  initial?: MomentumState,
): MomentumRepository {
  let blob: string | null = initial ? serialize(initial) : null;
  return {
    load: () => deserialize(blob),
    save: (state) => {
      blob = serialize(state);
      return { ok: true };
    },
  };
}

/** Minimal storage surface (so tests can pass a fake). */
export type WebStorage = Pick<Storage, "getItem" | "setItem">;

/**
 * localStorage-backed repository. Non-throwing: a read failure degrades to empty,
 * a write failure (quota/private-mode) returns `{ ok: false }` for the UI to
 * surface. On corrupt data it backs up the raw blob WRITE-ONCE before returning.
 */
export function createLocalStorageRepository(
  storage: WebStorage,
  key: string = STORAGE_KEY,
  backupKey: string = BACKUP_KEY,
): MomentumRepository {
  return {
    load() {
      let raw: string | null = null;
      try {
        raw = storage.getItem(key);
      } catch {
        return { status: "empty", state: emptyState() };
      }
      const result = deserialize(raw);
      if (result.status === "corrupt") {
        try {
          // write-once: never overwrite an existing backup
          if (storage.getItem(backupKey) == null) {
            storage.setItem(backupKey, result.raw);
          }
        } catch {
          /* backup is best-effort; never throw into the caller */
        }
      }
      return result;
    },
    save(state) {
      try {
        storage.setItem(key, serialize(state));
        return { ok: true };
      } catch {
        return { ok: false };
      }
    },
  };
}
