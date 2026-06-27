# PRD — Momentum OS (MVP)

Purpose: define what the MVP is, precisely enough to build and to know when it's done.
This reflects the post-critique scope (see DECISIONS.md). Where the original concept was
cut, the cut is intentional.

## 1. Thesis (the thing we are testing)

> **Product hypothesis.** Confronting yourself with last week's explicit commitment, and
> with the objective trace of your own daily entries, changes this week's behavior more
> than a to-do list or a journal does.

Everything in this PRD serves that hypothesis. The differentiator is **longitudinal
self-confrontation**, not a score, not tone, not AI (ADR-0004).

## 2. Who it's for

Primary: the owner — an ambitious business consultant, time-poor during client weeks,
analytical and competitive (so: allergic to vanity metrics he can game). Secondary
(later, unvalidated): other ambitious professionals. **Product hypothesis** that it
generalizes.

## 3. MVP scope

### In
- **Daily Command Deck** (sub-60s, tap-first): one **keystone**; an explicit **trade-off**
  ("what I am NOT doing, and why"); up to 3 plain **priorities** (no tags, no points);
  optional **leverage capture** (rotating consultant prompt); optional **compounding
  action**; optional one-tap **energy** as context only; end-of-day **keystone-protected**
  binary.
- **Self-record strip**: facts derived from the user's own history (keystone protection,
  longest priority slip, trade-off naming rate, compounding neglect, planned-vs-completed).
  No aggregate score.
- **Weekly Confrontation**: last week's single commitment carried forward (kept/missed/
  partial + why); read the signals; name one root cause; write exactly one new commitment.
- **Local persistence** (localStorage behind a repository interface) + **one-tap export**
  (JSON/Markdown).
- **Preferences**: the opinionated defaults (priority cap, prompts, windows) are editable
  and labeled as preferences.
- **Onboarding cue setup**: copy guiding the user to add-to-home-screen and anchor the
  ritual to an existing habit + a recurring calendar block (we have no push).

### Non-goals (explicit — do not build in MVP)
Accounts/auth · any backend DB · sync · notifications/push · calendar/wearable/Todoist
integrations · AI generation · multi-user · native app · **a momentum score** ·
streaks-as-reward · automated nagging thresholds presented as judgment · **any
health/training advice** · trend charts · multi-project boards.

## 4. User stories + acceptance criteria

> Format: **As the user, I want … so that …** — followed by testable acceptance criteria.

**US-1 — Decide the day under constraint.**
*I want to declare one keystone and what I'm explicitly not doing, so that I commit to
leverage instead of reacting.*
- AC1: The deck shows exactly one keystone field and one "not doing" field.
- AC2: Priorities are capped at a preference (default 3) and the cap is visibly labeled a
  preference, not a rule.
- AC3: No tags, points, or score appear anywhere on the deck.

**US-2 — Be confronted by my own record.**
*I want to see plain facts from my own history, so that I can't retroactively flatter myself.*
- AC1: The strip shows keystone-protection, longest slip, trade-off-naming rate,
  compounding neglect, and planned-vs-completed — each as a fact, not a judgment.
- AC2: No value is aggregated into a single score or ranking.
- AC3: Each signal is computed by a pure, tested function in `lib/signals.ts` and is total
  over empty/partial history.
- AC4 (slice 1, met): values render correctly from seed data (verified: "3 of 6", "5 days
  running", "5 of 7", "7 of 14", "none in 5 days").

**US-3 — Close last week's loop (the heart).**
*I want last week's commitment shown back with a kept/missed verdict, so the review changes
next week instead of generating resolutions I forget.*
- AC1: The weekly view opens with last week's single commitment and a kept/missed/partial
  control + reason. The verdict is append-once (immutable; see ADR-0012).
- AC2: The review may produce **at most one** new commitment — keep-the-same / set-new /
  none, honestly labeled. Never a list, never a required field (a mandatory weekly
  commitment manufactures reflection theater once real insights run out).
- AC3: Reflection prompts are neutral-but-specific; no accusatory copy. The grade is
  self-report; the signals are an independent check and must not be implied to substantiate it.

**US-4 — Survive the worst day.**
*I want a sub-30s "minimum viable day" (keystone + did-I-protect-it) and a non-scolding
re-entry after skipping, so the tool is useful exactly when I'm slammed.*
- AC1: A minimum path requires only keystone + protected-binary, and the UI affirms that
  minimum is a legitimate entry (not a cop-out).
- AC2: Returning after missed days opens with **diagnosis, never a guilt/streak-broken
  message** — implemented as the *absence* of any inactivity/streak banner: the deck opens
  to today (silence at top) and the self-record strip below is the diagnosis. A day-counter
  banner was deliberately rejected (it re-imports loss-aversion; see ADR-0014).

**US-5 — Keep my data, and keep it mine.**
*I want one-tap export and a local-only store, so a cleared cache can't destroy my ledger
and nothing leaves my device.*
- AC1: Export produces JSON and Markdown of all entries + commitments.
- AC2: No network calls leave the device; no analytics; Next telemetry disabled.

**US-6 — Trust the system's opinions.**
*I want every default (cap, prompts, windows) editable and labeled a preference, so I know
it's a stance, not science.*
- AC1: Preferences are editable and persisted.
- AC2: Each is labeled as a preference in the UI.

## 5. Data model
See `DATA_MODEL.md` (mirrors `lib/types.ts`). Note: **no `Score` entity exists by design**;
signals are derived, never stored.

## 6. UX flow
See `UX_NOTES.md`. Summary: open → (morning) declare keystone + trade-off + ≤3 priorities
(+ optional captures) → (end of day) answer keystone-protected → (weekly) Confrontation:
grade last commitment → read signals → one root cause → one new commitment → export.

## 7. Quality bar & Definition of Done
See `QUALITY_BAR.md`. A change is DONE when: it serves the thesis; `pnpm run check` and
`pnpm run lint` are green; pure logic is TDD'd and total; the diff is one reviewable
concern; docs/ADRs are updated; no score, no health advice, no unlabeled opinionated
default slipped in; and a draft PR documents what it does and does NOT do.

## 8. Success / kill criteria (pilot)
See `PROJECT_CHARTER.md`. The MVP is validated only against pre-registered, observable
criteria and a paper baseline — not against feelings.

## 9. Build order
PR1 (this PR): skeleton + docs + `.claude` layer + signals engine (TDD) + slice 1
(read-only deck + strip). PR2: interactivity + localStorage repository + export. PR3:
Weekly Confrontation + carry-forward. PR4: preferences + onboarding cue. PR5: re-entry/
minimum-day polish + a11y. See `BACKLOG.md`.
