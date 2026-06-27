---
name: loop-spec
description: >
  Template + guardrails for specifying or revising a Momentum OS "loop" (Daily Focus,
  Weekly Review, or a thin compounding-asset track) before building it. Use when adding
  or reworking any loop so it earns its place and avoids the "6 modules, none good" trap.
---

# Specify a loop

Momentum OS is built from a few high-leverage loops, NOT random modules. The MVP is
essentially ONE core loop (the Weekly Confrontation) fed by a thin daily input, with the
compounding tracks present only as optional, un-scored ledger signals. Keep it that way
unless an ADR says otherwise.

## Fill this out fully — vague answers mean the loop isn't ready

- **Purpose** — the one job. If it overlaps an existing loop, merge instead of adding.
- **Input** — what data it consumes (prefer data already captured).
- **User action** — the exact interaction. Daily actions must be sub-60s, tap-first.
- **Output** — what the user gets back. Must be a fact or a decision, never a score.
- **Frequency** — daily / weekly / opportunistic. Daily is expensive; justify it.
- **Success metric** — observable, falsifiable. "Feels good" is not a metric.
- **Bad behavior it prevents** — the failure mode it guards against.
- **MVP includes** — the thinnest honest version.
- **Deferred** — everything else, with a one-line reason.

## Guardrails (reject the spec if it violates these)
- No new daily REQUIRED field unless it survives the "brutal client week at 11pm" test.
- No aggregate score, ranking, or streak-as-reward (Goodhart/surrogation — see DECISIONS).
- No health/training/nutrition/sleep recommendation. Tracking and self-reported context only.
- Confrontation comes from the user's own data, not from scolding copy.
- Every threshold/default is visible and labeled a preference, not presented as science.
- The loop must be MORE useful (or gracefully skippable) on the worst day, not just the calm one.

## Then
Hand the completed spec to `ship-slice`. If the loop is contentious, run `product-critic`
first.
