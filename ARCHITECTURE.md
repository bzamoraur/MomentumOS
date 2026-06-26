# Architecture

> How Momentum OS is built and why — the simplest structure that still takes the product seriously.

For *what* the product is and why the score was cut, see `SPEC_BRIEF.md` and `DECISIONS.md`. This file covers the technical shape only.

## Stack + rationale

- **Next.js 15.5 (App Router)** — `package.json` pins `next@15.5.19`. Server Components are the default; the daily deck and the signals strip render on the server from static data with no client JS shipped for read-only views. *Reasoned inference:* a local-first, no-auth, no-backend instrument has almost no need for a client framework runtime on first paint, so the App Router's server-first default is a fit, not overhead.
- **TypeScript (strict)** — the data model (`lib/types.ts`) is the contract. Strict mode is non-negotiable: the entire differentiator is an *un-editable, faithful* record, and `tsc` is the cheapest guard against silently dropping or mistyping a field. *Verified fact:* `pnpm run typecheck` runs `tsc --noEmit` as a gate.
- **Tailwind v4** — `@tailwindcss/postcss@4`. Styling lives next to markup; no separate CSS architecture to maintain for a single-surface app. *Personal preference.*
- **shadcn-style hand-placed primitives** — we use `class-variance-authority`, `clsx`, and `tailwind-merge` (the shadcn idiom) but **did NOT run the shadcn CLI**. *Reasoned inference:* the CLI is a scaffolding convenience that adds a `components.json`, a registry coupling, and a pile of primitives we have not earned the need for. We hand-place the two or three primitives we actually use. The cost of copying a button by hand is trivial; the cost of an unused generated design system is permanent drag. See *Anti-overengineering* below.
- **Vitest 4** — `pnpm run test` runs `vitest run`. Chosen over Jest: native ESM (`"type": "module"`), zero extra transform config, fast watch. The unit-test surface is the pure signals engine, which needs no DOM.

## Diagram (text)

```
  mock-data/*.json            <- seeded 14-day history (no real user data)
        |
        v
  lib/signals.ts  (pure)      <- DailyEntry[] -> plain facts. No I/O, no React.
  lib/types.ts                   Deterministic, total, no aggregate score.
        |
        v
  app/  (Server Components)    <- import data + call signals, compose the page
        |
        v
  components/ (presentational) <- given props, render. No data fetching, no signals.
        |
        v
        UI  (mobile-first, read-only in Slice 1)

  one direction only:  data -> domain -> server -> presentational -> screen
```

## Major components

- **`lib/` — framework-free pure domain.** `lib/types.ts` is the single TypeScript contract (note: *no `Score` type, by design*). `lib/signals.ts` is the brain: `keystoneProtection`, `topPrioritySlip`, `tradeOffNamingRate`, `compoundingNeglectDays`, `plannedVsCompleted`. Every function is pure, deterministic, and total (handles empty input and missing fields). No React import, no I/O — it is portable and testable in isolation.
- **`mock-data/` — seeded history.** Static JSON conforming to `DailyEntry[]`. It exists so the longitudinal confrontation (e.g. "keystone protected 3 of last 7 days") is visible on day one without any persistence layer. *Hard boundary:* no real, health, financial, or client data lives here (`SECURITY_AND_PRIVACY.md`).
- **`app/` — Server Components.** The composition layer. Reads `mock-data`, calls `lib/signals`, passes computed facts down as props. Owns routing and data assembly; owns no presentation logic worth duplicating.
- **`components/` — presentational.** Pure render given props. No data fetching, no signal computation, no persistence. This keeps the confrontation logic in one tested place and the components dumb and swappable.

## Data flow (one direction)

`mock-data` → `lib/signals` (pure) → `app/` server components → `components/` presentational → screen.

Data flows down, never up. Signals are **derived at read time, never stored** — there is no place to persist or game an aggregate. *Reasoned inference:* a strictly unidirectional flow with a pure middle is the cheapest way to keep the record faithful: the only thing that can change a fact is the underlying entries.

## Testing approach

- **Pure logic via Vitest, TDD.** `lib/signals.ts` is the unit-test surface and the place where correctness actually matters (a wrong slip-streak count discredits the whole instrument). Each function's contract — empty array, undefined fields, window boundaries — is a test case. *Verified fact:* the functions are written to be total specifically so these tests are exhaustive and fast.
- **Build + typecheck + lint as gates.** `pnpm run check` = `typecheck && test && build`. `pnpm run lint` = `eslint .`. Green-on-all is the merge bar for every PR.
- **No jsdom yet.** *Reasoned inference:* Slice 1 is read-only Server Components with no interactive behavior, so a component-DOM harness would test the framework, not our logic. We add jsdom (or Playwright) when PR2 introduces interactivity and a localStorage repository — i.e. when there is stateful behavior worth asserting. Adding it now would be testing nothing.

## Future extension path

The one deliberate seam is a **Repository interface** for persistence — the single forward-looking indirection in the codebase.

1. **Now-ish (PR2):** a `localStorage`-backed repository implementing a small interface (read/write `DailyEntry`, `WeeklyCommitment`, `Preferences`). Server components and signals are unaffected — they consume the same shapes.
2. **Later (optional):** a sync/backend implementation drops in behind the *same* interface. No call site changes. This is why the seam earns its place rather than being premature: it is the difference between "export your ledger" working forever and a rewrite.
3. **Export** (PR2): one-tap JSON + Markdown so the ledger survives a cleared cache. A read of the repository, serialized.
4. **The Weekly Confrontation** (PR3, the heart): consumes `WeeklyCommitment` + the daily trace via the same one-directional flow; carry-forward closes the loop.
5. **Preferences** (PR4): `maxPriorities`, `weekStartsOn`, `leveragePrompts` — every opinionated default surfaced as an editable preference, persisted through the repository.

## Anti-overengineering decisions

Each line below is a thing we deliberately did **not** build, and the trigger that would change that.

- **No state library** (Redux/Zustand/etc.). Slice 1 is read-only server-rendered. Earn it back only if client state outgrows React's own primitives.
- **No DB / ORM.** Local-first, single user, no server. Mock JSON now; `localStorage` behind the repository seam next. A DB only appears behind the existing interface, if sync is ever built.
- **No momentum score / no aggregate scalar.** *Cut after a 4-lens critique (Goodhart/surrogation):* a self-derived number is the vanity metric we reject. Signals stay raw and non-aggregated. There is intentionally no `Score` type to even hold one. See `DECISIONS.md`.
- **No design-system build.** shadcn idiom by hand, no CLI, no `components.json`, no registry, no generated primitives we don't use.
- **No premature abstraction.** Tracks (training, learning, leverage, project) are optional un-scored fields, not modules. No health/training advice path exists — *tracking only, by hard boundary*. We earn structured tracks back only after proven repeated use.
- **The repository seam is the ONLY forward-looking indirection.** It earns its place because two concrete, near-term needs — export and optional sync — both depend on persistence being swappable, and retrofitting that across read sites later is the expensive path. One justified seam; nothing else speculative.

*Open question:* whether PR2's interactivity warrants Playwright over jsdom — decide when the first stateful surface lands, not before.
