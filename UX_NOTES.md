# UX Notes

> Purpose: the interaction and visual decisions behind Momentum OS, and why they follow from the brief — a weekly decision-accountability instrument with a frictionless daily input. The differentiator is longitudinal self-confrontation by your own un-editable record, not a score, not tone, not AI.

## The daily ritual (sub-60s, tap-first)

The daily input is a means, not the product. It exists to feed the Weekly Confrontation an honest objective trace. If it costs more than ~60s it stops being filled, and the trace rots (Reasoned inference). So the morning ritual is tap-first: declare, don't compose.

Field order, top to bottom (maps directly to `DailyEntry` in `lib/types.ts`):

1. **Keystone** — the one thing. Required. Single short line. This is the only field that defines a "logged" day.
2. **Not doing** — the explicit trade-off, and why. Required in spirit (the forcing function), text-optional in mechanics. Justified by implementation-intention / if-then evidence (Verified fact; Gollwitzer & Sheeran 2006, d≈0.65 — see brief §11).
3. **Priorities** — 0..3, plain titles, tap to mark done at end of day. Cap of 3 is a labeled, editable preference (`Preferences.maxPriorities`), not a law.
4. **Leverage capture** — optional, one rotating prompt (irreversible decision / senior time on junior work / reusable IP). One tap or one line.
5. **Compounding action** — optional, single free-text line.
6. **Energy** — optional, one tap (1–5). Context the user interprets. Never a gate, never read back as advice.
7. **Note** — optional, one line.

Optional fields render but never block. The end-of-day pass adds exactly two interactions: mark priorities done, and answer the keystone-protected binary (`keystoneProtected`). That binary is the single most important datum the signals engine consumes; everything else is texture.

Open question: whether morning and end-of-day should be one screen with a state change or two distinct entry points. Defer until interactivity (PR2) exposes the real friction.

## The instrument aesthetic

A command deck, not a dashboard. A cockpit you read under load, not a feed you browse. Visual rules, all already encoded in `app/globals.css`:

- **Dark, high-contrast.** Background `--background: #0a0c10`, foreground `--foreground: #e7eaf0`. Cards sit one step up (`--card: #11141b`), muted surfaces one more (`--muted: #171b24`). Hairline borders `--border: #222838`.
- **Single column, mobile-first.** The ritual happens on a phone, one-handed, before the day starts. No multi-pane layout. Wider viewports get more whitespace, not more columns.
- **Accent used sparingly.** `--accent: #3b82f6` carries focus and the few interactive affordances. `--success / --warning / --danger` exist as tokens but are NOT the language of the self-record strip (see below).
- **Type does the work.** System sans (`--font-sans`), antialiased, legibility-tuned. Hierarchy by size and weight, not by decoration.

## The self-record strip — the product core

This strip is the emotional center. It is the only place the buildable differentiator lives: your own history, derived and shown back, that you cannot retroactively flatter.

It renders plain facts from `lib/signals.ts` over the user's real trace:

- "Keystone protected 3 of last 7 days" (`keystoneProtection`)
- "Top priority 'X' has slipped 4 days" (`topPrioritySlip`)
- "No compounding action logged in 5 days" (`compoundingNeglectDays`)
- "Named the trade-off 5 of 7 days" (`tradeOffNamingRate`)
- "Planned 18, completed 11 this week" (`plannedVsCompleted`) — raw counts, never a ratio, never a score

Design constraints, non-negotiable:

- **Facts, not judgment.** Copy states the count and the noun. It does not say "you failed" or "great streak." The confrontation comes from the number being undeniably yours (Product principle 2).
- **No color-coded scolding.** A slip is not painted red, protection is not painted green. Color-coding a fact re-introduces the score and the reward we cut (Reasoned inference — Goodhart/surrogation, brief §3). The strip is monochrome on muted surface; the figures carry weight, not the palette.
- **No aggregate.** There is no `Score` type by design (`lib/types.ts` header). Five separate facts that have nothing to maximize, not one number to game.

## Graceful re-entry and the minimum viable day

Skipping is the base case, not the failure case. A weekly instrument used by ambitious people under load will have gaps. The product must be MORE useful on the worst day, not silently punitive (Product principle 4).

- **Re-entry copy is diagnosis, not judgment.** On return after a gap, lead with what the trace shows ("4 days unlogged; keystone protected 1 of last 3 answered") and a single low-friction next action. No guilt copy, no broken-streak shaming.
- **Minimum viable day.** On a brutal day the ritual collapses to two taps: name the keystone, and (end of day) did I protect it? Everything else hides. This preserves the one signal the weekly review most needs and keeps the trace continuous. A two-tap day still counts as logged.

## The seeded-demo-data decision

Slice 1 renders from a 14-day mock history in `/mock-data` and is read-only and static. Deliberate (brief §10):

- **Determinism.** A static seed makes the page identical on every load, so typecheck + signals unit tests + build are the whole quality gate. No clock-dependent or input-dependent rendering to make tests flaky.
- **The differentiator is visible on day one.** Longitudinal confrontation needs history to exist. Seeding 14 days shows the self-record strip working immediately, before any persistence is built — proving the information architecture and the signals engine, not a dashboard.
- **Real "today" + interactivity are PR2.** Live entry, localStorage behind a repository seam, and export come next. Splitting them keeps PR1 risk low (pure functions + presentational render) and isolates state — the actual risk — in its own PR.

## Accessibility baseline

Slice 1 (read-only) establishes the floor; the rest lands with interactivity.

- **Semantic landmarks.** `header` / `main` / `section` with real headings, not `div` soup. The self-record strip is a labeled region, read in DOM order.
- **Contrast.** The token pair `#e7eaf0` on `#0a0c10` clears WCAG AA for body text; muted foreground `#8a93a6` is reserved for non-essential context, never load-bearing facts (Reasoned inference — verify exact ratios in the a11y pass).
- **Decorative marks `aria-hidden`.** Any glyph or rule that is pure ornament is hidden from assistive tech so the fact text reads cleanly.
- **Focus states arrive with interactivity.** Visible focus rings (`--ring: #3b82f6`), keyboard-reachable taps, and hit targets sized for thumb use are PR2 work, when there is something to focus. Tracked, not forgotten.

## Deferred UX

Trend charts, weekly-review screen, preferences UI, onboarding cue setup (PWA / home-screen + habit anchor), export affordance, animation, light theme. Each earns its place in a later PR or stays cut (Product principle 8). None of them are the daily ritual or the self-record strip, which are the only two things slice 1 must get right.
