# Momentum OS

A weekly decision-accountability instrument with a deliberately frictionless daily input.

## What it is

You declare one keystone and one explicit trade-off each day in under a minute. Once a
week the system confronts you with your own un-editable record — last week's single
behavioral commitment (kept / missed / partial) and plain facts derived from your daily
trace — so you cannot retroactively flatter yourself. The differentiator is
**longitudinal self-confrontation**, not a number and not a tone (label: Product
hypothesis — the narrow, falsifiable thesis is in `PRD.md`).

What it is **NOT**: not a habit tracker, not a Notion dashboard, not a motivational app,
and deliberately **not a momentum score**. A single self-derived scalar was cut after a
four-lens critique as a Goodhart/surrogation trap — a competitive analytical user
optimizes the number instead of the behavior (label: Reasoned inference; see
`DECISIONS.md` ADR-0002). Health and training are **tracking only**; the system
issues no medical, training, sleep, or nutrition advice, ever.

## Status

**MVP slice 1: read-only Daily Command Deck rendered from seeded mock history.**
Verified green: typecheck + unit tests (signals engine) + build all pass (label: Verified
fact — run `pnpm run check` to reproduce). No interactivity, no persistence, no weekly
review UI yet; those are later PRs (see `BACKLOG.md`). The slice exists
to prove the honest information architecture and the signals engine against a 14-day
seed, so the longitudinal confrontation is visible on day one.

## The honest cheaper-test note

The thesis can be tested for 7 days as a paper or Notes template at roughly 1% of the
cost of writing this app, and you should (label: Reasoned inference; see `PRD.md`,
cheaper-test note). We build the repo anyway because the buildable differentiator —
longitudinal confrontation, commitment carry-forward, and one-tap export — is exactly
what paper cannot do past a week, and because a serious, disciplined, compounding repo is
itself a deliberate asset. Recommendation: build the narrow honest slice **and** run a
paper baseline in parallel. This is "both", not complacency.

## Quickstart

Requires **Node 22+** and **pnpm**.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm run check    # typecheck + test + build (the gate)
```

`pnpm run check` is the single command that must stay green. Individual scripts:
`pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run lint`.

## Run it on your phone

No backend, no env vars — deploy from the repo in ~2 minutes:

1. At **vercel.com**, sign in with GitHub → **Add New… → Project** → import this repo.
2. Leave defaults (Vercel auto-detects Next.js + pnpm) and **Deploy**.
3. Open the resulting URL on your phone → **Share → Add to Home Screen**.

It is installable as a PWA (standalone display, app icon, dark theme color), so the
home-screen launch is the intended daily cue — we have no push by design. Your entries
live only in that browser's `localStorage`; use **Export** for a portable copy.

## Repo map

| Path           | What lives there                                                      |
| -------------- | -------------------------------------------------------------------- |
| `app/`         | Next.js App Router pages/layouts; server components compose the Deck. |
| `components/`  | Presentational primitives (hand-placed, no shadcn CLI dependency).   |
| `lib/`         | Framework-free domain logic: `types.ts`, `signals.ts`. Fully tested. |
| `mock-data/`   | JSON seed history (14-day trace) that feeds slice 1.                 |
| `tests/`       | Vitest unit tests; the signals engine is the primary test surface.   |
| `docs/`        | Supplementary: the canonical brief and the critique log.             |
| `.claude/`     | Agent optimization layer (CLAUDE.md, subagents, skills, hook).       |

## Docs index

The 13 root docs are the product/engineering spec; `docs/` holds supplementary
material. Everything is coherent with `docs/SPEC_BRIEF.md` (the single source of truth).

| Doc                            | One-line description                                            |
| ------------------------------ | -------------------------------------------------------------- |
| `CLAUDE.md`                    | How any AI agent must behave in this repo.                     |
| `PROJECT_CHARTER.md`           | Mission, target user, thesis, success/kill criteria, baseline. |
| `PRD.md`                       | MVP: user stories, acceptance criteria, non-goals, DoD.        |
| `PRODUCT_PRINCIPLES.md`        | The ten principles (constraint, confrontation, no score).      |
| `ARCHITECTURE.md`              | Simplest-serious stack, data flow, the one repository seam.    |
| `DATA_MODEL.md`                | Entities mirroring `lib/types.ts`; why no `Score` exists.      |
| `UX_NOTES.md`                  | The ritual, the instrument aesthetic, graceful re-entry.       |
| `QUALITY_BAR.md`               | Definition of Done and the quality gate.                       |
| `EVIDENCE_POLICY.md`           | The veracity protocol + audited claims with their caveats.     |
| `SECURITY_AND_PRIVACY.md`      | Local-first stance; the hard no-health-advice boundary.        |
| `DECISIONS.md`                 | ADRs, including the cut-the-score decision (ADR-0002).         |
| `BACKLOG.md`                   | PR-sized roadmap (PR1 read-only → PR5 polish) + parking lot.   |
| `docs/SPEC_BRIEF.md`           | Canonical brief; every other doc must agree with it.           |
| `docs/CRITIQUE_LOG.md`         | The 4-lens critique + evidence audit that shaped the cuts.     |

## Stack

Next.js 15.5 (App Router) · TypeScript (strict) · Tailwind v4 · Vitest. No DB, no auth, no
server, no state library, no momentum score.
