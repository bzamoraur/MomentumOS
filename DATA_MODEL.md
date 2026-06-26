# Data Model

Purpose: document the domain types in `lib/types.ts` field-by-field, explain why derived signals are never stored, and state the persistence stance — so docs and code stay in lockstep.

> The code is the source of truth. This file mirrors `lib/types.ts` and `lib/signals.ts`. If they disagree, the code wins and this file is the bug.

## Scalars

- `ISODate` — `type ISODate = string` (`'YYYY-MM-DD'`). Why: a calendar day is the unit of a daily entry and the join key for week boundaries; a plain string keeps mock data, export, and future storage trivially serializable.
- `LeverageKind` — union `'irreversible_decision' | 'senior_time_on_junior_work' | 'reusable_ip'`. Why: the three rotating consultant-leverage prompts (Reasoned inference: this is the field that justifies the senior-IC persona). `LEVERAGE_LABELS` (a `Record<LeverageKind, string>`) holds the human-readable UI copy beside the type so labels can't drift from the enum.

## Entity: `Priority`

One planned item under a day. 0..`maxPriorities` per `DailyEntry` (default cap 3).

| Field | Type | Meaning / why it exists |
|---|---|---|
| `id` | `string` | Stable identity for React keys and for matching across edits. |
| `title` | `string` | What the item is. Signals match priorities by normalized title (trim + lowercase), so title doubles as the slippage key. |
| `done` | `boolean` | Set at end of day. Feeds `plannedVsCompleted` and gates slippage. |
| `carriedFromDate?` | `ISODate` | Present only when this priority rolled over from a previous day. Why: it is the explicit slippage marker — a thing you keep re-planning and not doing. |

## Entity: `DailyEntry`

The frictionless daily input. One per day; the array of these is the objective trace the weekly review interrogates.

| Field | Type | Meaning / why it exists |
|---|---|---|
| `date` | `ISODate` | The day this entry is for. Primary key. |
| `keystone` | `string` | The ONE thing that defines the day. Why: single-keystone focus is the core constraint (Verified fact: task-switching carries a measurable cost — Rubinstein, Meyer & Evans 2001). |
| `keystoneProtected?` | `boolean` | End-of-day binary. `undefined` = not answered yet (e.g. today). Why: the cheapest honest measure of whether intent survived the day; `undefined` is distinct from `false` so "unanswered" is never miscounted as "failed". |
| `notDoing` | `string` | The explicit trade-off — what you are deliberately NOT doing, and why. Why: implementation-intention / if-then framing has real support (Verified fact: Gollwitzer & Sheeran 2006, d≈0.65). |
| `priorities` | `Priority[]` | 0..`maxPriorities` plain priorities. No tags, no score. Why: a forcing function for fewer commitments. |
| `leverage?` | `{ kind: LeverageKind; note?: string }` | Optional consultant-leverage capture. Why: makes scarce senior judgment visible without adding a required field. |
| `compoundingAction?` | `string` | Single optional free-text: one learning/project/writing action. Why: the deliberately collapsed stand-in for four separate "tracks" we cut. |
| `energy?` | `1 \| 2 \| 3 \| 4 \| 5` | Optional one-tap context ONLY. Why: lets the user interpret their own day. HARD BOUNDARY: never a gate, never input to any recommendation. Tracking, never advice. |
| `note?` | `string` | Optional one-line free note. Escape hatch for context the schema doesn't model. |

## Entity: `WeeklyCommitment`

The carry-forward loop — the differentiating feature. One per week.

| Field | Type | Meaning / why it exists |
|---|---|---|
| `weekOf` | `ISODate` | Week start date. Anchors the commitment to a week and to the daily trace that grades it. |
| `commitment` | `string` | The ONE behavioral change committed for the week. Why: exactly one keeps the loop falsifiable. |
| `outcome?` | `'kept' \| 'missed' \| 'partial'` | Graded next week against the daily trace. `undefined` = not yet graded. |
| `outcomeNote?` | `string` | The "why" behind the grade. Why: the root-cause reflection is the point; the grade alone is reflection theater. |

## Entity: `Preferences`

Every opinionated default, surfaced as an editable preference (visible = honest).

| Field | Type | Meaning / why it exists |
|---|---|---|
| `maxPriorities` | `number` | Default 3, editable. The priority cap is a labeled preference, not a law. |
| `weekStartsOn` | `'monday' \| 'sunday'` | Defines week boundaries for `weekOf` and windowed signals. |
| `leveragePrompts` | `LeverageKind[]` | Which leverage prompts rotate in the daily capture, and in what order. |

## Why there is no `Score` entity

There is deliberately no `Score` type, and there never will be.

A single self-derived scalar handed to a competitive, analytical user is a Goodhart / surrogation trap: the user optimizes the number instead of the behavior, and the number quietly becomes the goal it was meant to measure. (Verified fact: Goodhart's law / surrogation is well-supported — the popular phrasing is Strathern 1997; surrogation studied by Choi, Hecht & Tayler. Note: not Goodhart's literal 1975 wording.) The composite "momentum score" was cut after a 4-lens critique for exactly this reason. The product confronts the user with raw, non-aggregated facts from their own history — facts that have nothing to maximize — instead of a vanity metric. See `DECISIONS.md` (ADR-0002) and the design note atop `lib/types.ts`.

## Signals are derived, never stored

All confrontation facts are computed on read by `lib/signals.ts`. Nothing below is a persisted field. Every function is pure, deterministic, and total (handles an empty array and missing fields), takes `DailyEntry[]` sorted ascending by date, and returns a plain fact — never a judgment, never an aggregate score.

- `lastN<T>(items, n) -> T[]` — the most-recent window helper. Internal building block.
- `keystoneProtection(entries, windowDays=7) -> { protected, answered, window }` — how often the keystone was protected, separating answered days from window size so unanswered ≠ failed.
- `topPrioritySlip(entries) -> { title, days } | null` — the priority undone for the longest unbroken run; `null` unless a slip reached ≥2 consecutive days. Matches by normalized title.
- `tradeOffNamingRate(entries, windowDays=7) -> { named, total }` — how often you actually named what you were NOT doing.
- `compoundingNeglectDays(entries) -> number` — consecutive most-recent days with no compounding action; `0` means the latest day has one. No threshold, no judgment.
- `plannedVsCompleted(entries, windowDays=7) -> { planned, completed, window }` — raw counts over the window. NOT a ratio, NOT a score; the reader interprets.

Why derive instead of store: stored aggregates rot when source entries change, and a stored number is one rename away from becoming a `Score`. Pure functions over the trace stay correct by construction and remain the unit-test surface (TDD).

## Persistence stance

- **Now:** fictional JSON seed data in `/mock-data`. No DB, no auth, no server. The first slice renders the Daily Command Deck and the self-record strip from seeded history, read-only.
- **Next:** `localStorage` behind a small repository interface (e.g. `load()` / `save()` / `export()`), so a future backend is a drop-in and not a rewrite. The repository seam is the only forward-looking indirection in the project, and it earns its place via export + possible future sync.
- **Durability:** one-tap export (JSON + Markdown), user-initiated. The ledger must survive a cleared cache — losing the record is the catastrophic quit trigger.
- **Schema versioning (Open question):** when an enum (`LeverageKind`, `outcome`) or a default (`maxPriorities`, `weekStartsOn`) changes, persisted and exported data needs a `schemaVersion` tag plus a migration step. Not implemented in MVP; flagged here so the first localStorage write doesn't ship without it.

## Data sensitivity

All mock data is fictional and non-sensitive. No health, financial, client, employer, or confidential data lives in the repo, the mock data, or any entity above. Local-first: nothing leaves the device. The `energy` field is self-reported context, not a health record, and the system issues no medical, training, nutrition, or sleep advice. See `SECURITY_AND_PRIVACY.md`.
