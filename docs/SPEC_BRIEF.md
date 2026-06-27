# Momentum OS — Canonical Spec Brief (v2, post-critique)

> This is the single source of truth. All repo docs must be coherent with this.
> It is the synthesis of a 4-lens adversarial critique panel + an evidence audit.
> Voice: senior, specific, non-complacent, honest. No hype. Label every claim.

## 0. One-line definition
Momentum OS is a **weekly decision-accountability instrument with a deliberately
frictionless daily input**. Its differentiator is **longitudinal self-confrontation**
— it shows you your own un-editable record so you cannot retroactively flatter
yourself — NOT an opinionated tone, NOT a score, NOT AI.

## 1. Narrow, falsifiable thesis (label: Product hypothesis)
"Confronting yourself with last week's explicit commitment, and with the objective
trace of your own daily entries, changes this week's behavior more than a to-do list
or a journal does." Everything beyond this is hypothesis or deferred. This claim must
be testable, with a baseline and a pre-registered kill criterion.

## 2. Problem statement (label: Reasoned inference)
Ambitious high-performers don't fail from lack of tasks or tools. They fail from:
(1) intention–execution gap (strategy decays into reactive busywork);
(2) no forcing function for trade-offs (everything feels important);
(3) no compounding (learning/training/writing/projects get sporadic attention; no
honest ledger; no reflection that changes behavior);
(4) reflection theater (reviews that feel good and change nothing).
Incumbents (Todoist, Notion, Apple Reminders, paper) capture tasks but never confront
the user with the gap between what they said mattered and what they actually did.

## 3. What the critique forced us to CHALLENGE / CUT (with lens attribution)
- **CUT the composite "momentum score"** (all 4 lenses; behavioral+product = fatal).
  A single self-derived scalar is gameable by a competitive analytical user and
  structurally IS the vanity metric we reject (Goodhart/surrogation). Replace with
  raw, non-aggregated factual signals that have nothing to maximize.
- **CUT energy/training as a daily required field or planning gate** (all 4 lenses;
  feasibility = health-advice liability seam). Keep only as OPTIONAL one-tap context
  the user interprets. The system issues NO health/training recommendation, ever.
- **CUT Learning / Leverage / Project as separate structured DAILY tracks** (all 4).
  They re-create the "6 modules, none good" problem in disguise. Collapse to at most
  ONE optional "compounding action" field daily; earn structured tracks back only
  after proven repeated use.
- **CUT the automated flagging/nagging engine with arbitrary thresholds presented as
  judgment** (feasibility, behavioral). Replace with neutral factual derivations;
  any threshold is visible and labeled as an editable preference, not science.
- **CUT accusatory copy as the lead** ("where did I lie to myself") (behavioral).
  The confrontation must come from the DATA, not the tone. Neutral-but-specific first.
- **CUT the grandiose "personal operating system / everything-app" framing** (product).
  Narrow to the decision-accountability instrument. Keep the "OS" as a north-star name
  only, not a scope license.

## 4. What the critique forced us to ADD
- **Commitment carry-forward** (target-user, behavioral): last week's ONE behavioral
  commitment reappears at the TOP of this week's review — kept / missed / partial +
  why. This loop closure is THE differentiating feature.
- **Longitudinal confrontation signals** (all): plain facts derived from the user's
  own history — keystone protection rate, top-priority slippage streak, trade-off
  naming rate, compounding neglect days, planned-vs-completed trend. Raw facts. No
  aggregate score.
- **Consultant-leverage capture** (target-user): the ONE daily field that justifies
  the persona — rotating among "biggest irreversible decision today" / "senior time
  on junior work? (y/n)" / "reusable IP captured?". Optional.
- **One-tap export (JSON + Markdown)** (target-user): the ledger must survive a
  cleared cache. Removes the catastrophic data-loss quit trigger.
- **Graceful re-entry path** (behavioral, target-user): skipping is the base case. On
  return, open with diagnosis-not-judgment. A "minimum viable day" path (keystone +
  did-I-protect-it) for brutal weeks. The product must be MORE useful on the worst days.
- **Pre-registered success / kill criterion + baseline** (product, feasibility): define
  before the pilot what "it worked" means in observable terms, and what gaming looks
  like. Label the thesis a hypothesis.
- **Designed retrieval cue** (all; we cannot push): onboarding asks the user to (a)
  add to home screen (PWA) and (b) anchor the ritual to an existing habit + a recurring
  calendar block. We design the cue honestly instead of pretending we have notifications.
- **Every opinionated default surfaced as an editable PREFERENCE** (feasibility): the
  3-priority cap, the leverage prompts, the question set. Visible = honest.

## 5. The cheaper-test challenge (must be stated honestly)
Several critics: the THESIS can be tested for 7 days as a paper/Notes template at ~1%
of the cost before writing Next.js. This is correct and we state it plainly. We still
build the repo because (a) the user explicitly wants a serious, disciplined, compounding
ASSET and potential consulting accelerator, and (b) the buildable differentiator
(longitudinal confrontation, carry-forward, export) is exactly what paper cannot do past
a week. Recommendation: build the narrow honest slice AND run a paper baseline in
parallel this week. This is "both", not complacency.

## 6. Operating model — six loops (keep the user's vocabulary; be honest about MVP)
For EACH loop: Purpose / Input / User action / Output / Frequency / Success metric /
Bad behavior prevented / MVP includes / Deferred.

**Honest summary:** the MVP implements essentially ONE core loop — the Weekly
Confrontation — fed by a thin Daily Commitment input. The other four are present only as
OPTIONAL, un-scored ledger signals the weekly review interrogates. They are NOT daily
modules in MVP.

1. **Daily Focus Loop** (CORE, MVP)
   - Purpose: force one keystone + explicit trade-off under constraint.
   - Input: today's intent.
   - Action: name keystone; name what you're NOT doing (and why); ≤3 priorities;
     optional leverage capture; (end of day) did I protect the keystone?
   - Output: today's commitment record + the factual self-record strip.
   - Frequency: daily, <60s, tap-first.
   - Success metric: opened & keystone declared ≥6/7 days unprompted (pilot).
   - Prevents: reactive busywork, infinite to-do lists, silent over-commitment.
   - MVP: yes (slice 1 read-only from mock; slice 2 interactive+persistent).
   - Deferred: tags/score, energy-as-gate, multiple tracks.

2. **Weekly Review Loop** (CORE, MVP — the heart)
   - Purpose: confront planned-vs-actual; carry last week's commitment forward.
   - Input: the week's daily entries (objective trace) + last week's commitment.
   - Action: grade last commitment (kept/missed/partial+why); read the factual signals;
     name ONE root cause; write exactly ONE behavioral commitment for next week.
   - Output: one carried-forward commitment; an exportable weekly artifact.
   - Frequency: weekly (~15 min).
   - Success metric: ≥3 of the weekly commitments are actually kept the following week
     (verified against the daily trace), across the pilot.
   - Prevents: reflection theater; resolution amnesia.
   - MVP: yes (slice 3). Deferred: AI-generated questions, trend charts.

3. **Training & Energy Loop** (TRACK, thin)
   - Purpose: lightweight context, not coaching.
   - Input: optional one-tap energy (1–5) + trained? (y/n).
   - Action: one tap. Output: a context chip + a neglect fact in weekly review.
   - Frequency: optional daily. Success metric: n/a (context only).
   - Prevents: planning against a fantasy self — but only as self-interpreted context.
   - MVP: optional field only. Deferred: ANY recommendation, wearable/HRV, load models.
   - HARD BOUNDARY: no medical/training/nutrition/sleep advice. Tracking only.

4. **Learning & Skill Compounding Loop** (TRACK, thin)
   - Purpose: keep a faithful ledger of compounding actions.
   - Input: optional "one compounding action today".
   - Action: one line. Output: neglect-days fact in weekly review.
   - Frequency: opportunistic. Success metric: weekly review confronts neglect honestly.
   - Prevents: the asset quietly going to zero with no reckoning.
   - MVP: collapsed into the single optional compounding field. Deferred: spaced-
     repetition engine, structured skill tree (evidence supports SR — see §11 — but it
     is a separate product; defer).

5. **Professional Leverage Loop** (TRACK, thin)
   - Purpose: make scarce senior judgment visible.
   - Input: rotating optional capture (irreversible decision / senior-time-on-junior-
     work / reusable IP).
   - Action: one tap/line. Output: a weekly "where did senior time go" reflection prompt.
   - Frequency: opportunistic. Success metric: at least weekly, one leverage capture.
   - Prevents: senior time leaking to reversible, low-leverage, delegable work.
   - MVP: the single consultant-leverage daily field. Deferred: client/portfolio views.

6. **Personal Project Momentum Loop** (TRACK, thin)
   - Purpose: keep one personal project honestly visible.
   - Input: optional "next action" on one named project.
   - Action: one line. Output: "untouched N days" fact in weekly review.
   - Frequency: opportunistic. Success metric: untouched-streak surfaced, not hidden.
   - Prevents: the project dying silently while being called "important".
   - MVP: representable via the compounding field. Deferred: multi-project board.

## 7. MVP scope
**In:** Daily Command Deck (keystone, explicit trade-off, ≤3 plain priorities, optional
leverage capture, optional compounding action, optional energy context, end-of-day
keystone-protected binary); the factual self-record strip (derived signals, NO score);
Weekly Confrontation (carry-forward + one new commitment); local persistence
(localStorage) + one-tap export; editable preferences; onboarding cue setup.
**Out (non-goals):** accounts/auth, any backend DB, sync, notifications/push, calendar/
wearable/Todoist integrations, AI generation, multi-user, native app, a momentum score,
streaks-as-reward, automated nagging thresholds-as-judgment, ANY health/training advice,
trend charts, multi-project boards.

## 8. Data model (final TypeScript — the code is the source; docs mirror it)
```ts
type ISODate = string; // 'YYYY-MM-DD'

type LeverageKind = 'irreversible_decision' | 'senior_time_on_junior_work' | 'reusable_ip';

interface Priority {
  id: string;
  title: string;
  done: boolean;            // set at end of day
  carriedFromDate?: ISODate; // present if rolled over (slippage signal)
}

interface DailyEntry {
  date: ISODate;
  keystone: string;                 // the ONE thing
  keystoneProtected?: boolean;      // end-of-day binary; undefined = not yet answered
  notDoing: string;                 // explicit trade-off (and why)
  priorities: Priority[];           // 0..maxPriorities (default cap 3, editable pref)
  leverage?: { kind: LeverageKind; note?: string };
  compoundingAction?: string;       // single optional free-text
  energy?: 1 | 2 | 3 | 4 | 5;       // optional context ONLY, never a gate
  note?: string;                    // optional one-line
}

interface WeeklyCommitment {
  weekOf: ISODate;                  // week start (Monday)
  commitment: string;               // the ONE behavioral change
  outcome?: 'kept' | 'missed' | 'partial';
  outcomeNote?: string;
}

interface Preferences {
  maxPriorities: number;            // default 3 — labeled a preference, editable
  weekStartsOn: 'monday' | 'sunday';
  leveragePrompts: LeverageKind[];  // which prompts rotate
}
```
No `Score` entity exists, by design. Signals are DERIVED, never stored.

## 9. Signals engine (pure functions over DailyEntry[] — the brain; TDD this)
Located in `lib/signals.ts`. Every function returns a plain fact, never a judgment,
never an aggregate score. Examples (names are contractual):
- `keystoneProtection(entries, windowDays)` -> { protected: number; answered: number; window: number }
- `topPrioritySlip(entries)` -> { title: string; days: number } | null  // longest run a carried priority stayed undone
- `tradeOffNamingRate(entries, windowDays)` -> { named: number; total: number }
- `compoundingNeglectDays(entries)` -> number  // days since last compoundingAction
- `plannedVsCompleted(entries, windowDays)` -> { planned: number; completed: number } // raw, not scored
Each is pure, deterministic, total (handles empty array, undefined fields). These are
the unit-test surface.

## 10. First vertical slice (revised — instantiate the differentiator, not the dashboard)
**Slice 1 = "Daily Command Deck + factual self-record strip", rendered from mock seed
history, read-only.** It proves the honest information architecture and the signals
engine (TDD) on day one using seeded history so the longitudinal confrontation is
visible immediately. NO score, NO health inference, NO nagging.
- Branch: `claude/momentum-os-setup-ak60ge` (this setup PR).
- Shows: today's date; keystone; "Not doing: …"; ≤3 plain priorities with done state;
  optional leverage capture; optional compounding action; an energy context chip; and
  the **self-record strip** computed by `lib/signals.ts` from a 14-day mock history
  (e.g., "Keystone protected 3 of last 7 days", "Top priority 'X' has slipped 4 days",
  "Compounding action: none logged in 5 days").
- Not yet: interactivity, localStorage, export, weekly review, preferences UI,
  onboarding. Those are later PRs.
- Quality: typecheck + unit tests (signals) + build all green; reads cleanly on mobile.

## 11. Evidence findings (from the audit — use with these exact caveats)
- Implementation intentions / if-then planning (Gollwitzer & Sheeran 2006, d≈0.65):
  **well-supported**; domain follow-ups smaller. Justifies "name what you're NOT doing"
  and explicit commitment framing.
- Goodhart's law / surrogation: **well-supported**; popular phrasing is Strathern (1997),
  not Goodhart's literal 1975 wording; surrogation studied by Choi/Hecht/Tayler.
  Justifies cutting the score.
- Task-switching costs (Rubinstein, Meyer & Evans 2001; APA): **well-supported**. Avoid
  the loose "23 minutes"/"40%" figures. Justifies single-keystone focus.
- Spacing / retrieval practice: **well-supported**. Justifies a future learning module;
  deferred (separate product).
- Gamified streak apps can backfire for SOME users (Habitica research, ICHS/JMIR):
  **supported as a "can backfire" claim, NOT "fails on average"**. Do not overclaim.
- Brief structured reflection improves performance (Di Stefano et al., HBS 2014, ~23% on
  a training test): **MIXED for our use** — that study is END-OF-DAY reflection during
  skill acquisition, not WEEKLY goal review. Generalizing to weekly cadence is an
  extrapolation. Do NOT cite "42%/22.8%/Dominican" vendor stats. So: weekly-review-
  changes-behavior is a **Product hypothesis**, not a verified fact.

## 12. Architecture (simplest serious)
Next.js 15.5 (App Router) + TypeScript (strict) + Tailwind v4 + shadcn/ui-style
components (hand-placed primitives, no CLI dependency) + Vitest. Mock JSON seed data in
`/mock-data`. No DB, no auth, no server. Pure domain logic in `/lib` (framework-free,
fully tested). Components in `/components` (presentational). Persistence (later) =
localStorage behind a small repository interface so a future backend is a drop-in.
Data flow: mock-data -> lib/signals (pure) -> server components -> presentational
components. Anti-overengineering: no state library, no DB/ORM, no score, no design
system build, no premature abstraction; a repository seam is the ONLY forward-looking
indirection and it earns its place (export + future sync).

## 13. Implementation plan (PR-sized)
- PR1 (this one): repo skeleton + 13 docs + .claude optimization layer + mock data +
  signals engine (TDD) + Slice 1 read-only Daily Command Deck. Risk: low.
- PR2: interactivity + localStorage repository + one-tap export. Risk: medium (state).
- PR3: Weekly Confrontation + commitment carry-forward. Risk: medium (the heart).
- PR4: preferences (editable defaults) + onboarding cue setup (PWA/home-screen + habit
  anchor copy). Risk: low.
- PR5 (optional): polish, empty/return states (graceful re-entry), a11y pass. Risk: low.

## 14. Security & privacy stance
Personal, non-sensitive data only. No health/financial/client/employer/confidential data
in the repo or mock data. Local-first; nothing leaves the device. Next.js telemetry
disabled. Export is user-initiated. No third-party analytics. HARD boundary: no medical
advice. See SECURITY_AND_PRIVACY.md.

## 15. Product principles (distilled)
1. Constraint over capture. 2. Confrontation by data, not by tone. 3. No single score.
4. Survive the worst day (design the comeback, not the streak). 5. Earn the right to
challenge by first being accurately specific. 6. Every default is a labeled, editable
preference. 7. Honesty over motivation. 8. Every feature earns its place or is cut.
9. Track, never prescribe (esp. health). 10. The ledger must be portable (export).

## 16. Voice/tone guide for all docs
Senior, terse, specific, non-complacent. Use the evidence labels (Verified fact /
Reasoned inference / Product hypothesis / Personal preference / Open question) on
non-trivial claims. No marketing adjectives. Prefer concrete examples over abstractions.
Each doc opens with a one-line purpose and stays under ~2 screens unless structurally
required (PRD, DATA_MODEL longer is OK).
