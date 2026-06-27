/**
 * Momentum OS — domain types.
 *
 * Design note: there is deliberately NO `Score` type. A single self-derived
 * scalar handed to a competitive, analytical user is a Goodhart/surrogation trap
 * (the user optimizes the number instead of the behavior). The product confronts
 * the user with raw facts derived from their own history instead. See DECISIONS.md.
 */

/** ISO calendar date, 'YYYY-MM-DD'. */
export type ISODate = string;

/** The one consultant-leverage capture that justifies the persona. Optional. */
export type LeverageKind =
  | "irreversible_decision"
  | "senior_time_on_junior_work"
  | "reusable_ip";

export interface Priority {
  id: string;
  title: string;
  /** Set at end of day. */
  done: boolean;
  /** Present when this priority was rolled over from a previous day (slippage signal). */
  carriedFromDate?: ISODate;
}

export interface DailyEntry {
  date: ISODate;
  /** The ONE thing that defines the day. */
  keystone: string;
  /** End-of-day binary. `undefined` means "not answered yet" (e.g. today). */
  keystoneProtected?: boolean;
  /** Explicit trade-off: what you are deliberately NOT doing, and why. */
  notDoing: string;
  /** 0..maxPriorities (default cap 3, an editable preference — not a law). */
  priorities: Priority[];
  /** Optional consultant-leverage capture. */
  leverage?: { kind: LeverageKind; note?: string };
  /** Single optional free-text compounding action (learning/project/writing). */
  compoundingAction?: string;
  /** Optional one-tap energy context ONLY. Never a gate, never a recommendation. */
  energy?: 1 | 2 | 3 | 4 | 5;
  /** Optional one-line note. */
  note?: string;
}

export type WeeklyOutcome = "kept" | "missed" | "partial";

/** A forward behavioral commitment, authored when a week opens. */
export interface WeeklyCommitment {
  /** Week start date. */
  weekOf: ISODate;
  /** The ONE behavioral change committed to for the week. */
  commitment: string;
}

/**
 * The append-once verdict on a completed week, authored when the week is closed.
 * Kept separate from WeeklyCommitment so the grade can't be silently re-edited
 * (retroactive self-flattery). See DECISIONS.md ADR-0012.
 */
export interface WeeklyReview {
  /** The week being graded. */
  weekOf: ISODate;
  outcome: WeeklyOutcome;
  /** The "why" behind the grade — the diagnosis is the point. */
  outcomeNote?: string;
  /** When the review was recorded. */
  reviewedOn: ISODate;
}

export interface Preferences {
  /** Default 3 — labeled a preference, editable by the user. */
  maxPriorities: number;
  weekStartsOn: "monday" | "sunday";
  /** Which leverage prompts rotate in the daily capture. */
  leveragePrompts: LeverageKind[];
}

/** Human-readable labels for leverage prompts (UI copy lives with the type). */
export const LEVERAGE_LABELS: Record<LeverageKind, string> = {
  irreversible_decision: "Biggest irreversible decision today",
  senior_time_on_junior_work: "Senior time spent on junior work?",
  reusable_ip: "Reusable IP captured",
};
