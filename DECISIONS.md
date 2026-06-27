# Decision log (ADRs)

Append-only record of important, non-obvious choices. Each entry: context · decision ·
status · consequences · source. Update this in the same PR that makes the choice.
Format is lightweight on purpose (mobile-reviewable).

---

## ADR-0001 — Stack: Next.js 15.5 + TS strict + Tailwind v4 + Vitest; shadcn-style, no CLI
**Context.** Need the simplest *serious* stack that builds deterministically in a
web/mobile session and matches the preferred stack.
**Decision.** Next.js 15.5 (App Router), TypeScript strict, Tailwind v4
(`@tailwindcss/postcss`, CSS-variable theme), Vitest for unit tests. We use shadcn/ui's
*component model* (hand-placed primitives in `components/ui` using `cva` + `cn`) but do
**not** run the shadcn CLI, to keep the diff small and the build deterministic.
**Status.** Accepted (verified: install + typecheck + 15 tests + build all green).
**Consequences.** No Radix runtime until an interactive primitive needs it. We pinned
Next 15.5 over 16 to avoid churn on a build the owner can't debug locally.
**Source.** Toolchain de-risking in the setup session.

## ADR-0002 — No momentum score (cut the headline feature)
**Context.** The original concept centered a single "momentum score". A 4-lens
adversarial critique (behavioral, product, target-user, feasibility) flagged it as
**fatal/high** on every lens.
**Decision.** Ship **no aggregate score** in the MVP. Replace it with raw, non-aggregated
facts derived from the user's own history (`lib/signals.ts`) — nothing to maximize.
**Status.** Accepted.
**Consequences.** Goodhart/surrogation risk removed (a competitive, analytical user can't
farm a number). The "honesty" positioning becomes structural, not rhetorical. A score may
only return if an *external* validation ever justifies it (see BACKLOG parking lot).
**Source.** Critique panel (unanimous); Goodhart/surrogation is **Verified fact**
(Strathern's phrasing; Choi/Hecht/Tayler on surrogation) — see EVIDENCE_POLICY.

## ADR-0003 — Loop model: one core loop + thin daily input, not six modules
**Context.** The brief proposed six co-equal loops; risk = "6 modules, none good".
**Decision.** MVP implements essentially ONE core loop — the **Weekly Confrontation** —
fed by a **thin daily input**. Training/Energy, Learning, Leverage, Project exist only as
**optional, un-scored ledger signals** the weekly review interrogates, not daily modules.
**Status.** Accepted (all four critics agreed, and pushed it further than the draft).
**Consequences.** The daily ritual stays sub-60s. The four "tracks" must not leak back in
as required daily fields (the critique's main caveat). Full tracks are deferred.
**Source.** Critique panel `loop_reframe_verdict` (4/4 agree).

## ADR-0004 — Differentiator = longitudinal self-confrontation (not tone, not AI)
**Context.** The claimed moat ("quality of questions / honesty of feedback") is the part
the MVP can't deliver without AI; hardcoded heuristics become wallpaper by week one.
**Decision.** The differentiator is **confronting the user with their own un-editable
record** — keystone protection, priority slippage, trade-off naming, compounding neglect,
planned-vs-completed — plus weekly **commitment carry-forward**. Facts, not scolding.
**Status.** Accepted; partially shipped (the self-record strip in slice 1). Carry-forward
arrives with the Weekly Confrontation (PR3).
**Consequences.** This is buildable without AI and is what journals/Todoist/Notion don't
do. Tone leads neutral; the data carries the challenge.
**Source.** Critique panel (product + target-user lenses).

## ADR-0005 — Health/training is tracking-only (no advice)
**Context.** "Energy-aware planning" risked crossing into behavioral-health inference.
**Decision.** Energy is an **optional one-tap self-reported context** only. The system
issues **no** medical/training/nutrition/sleep recommendation and never gates planning on it.
**Status.** Accepted (hard boundary).
**Consequences.** Removes the liability seam and a likely abandonment vector. Wearables/HRV/
load models are out of scope, permanently, unless revisited with proper grounding.
**Source.** Critique panel (feasibility lens).

## ADR-0006 — Local-first; no DB/auth/integrations in MVP; repository seam for later
**Context.** MVP must avoid premature infrastructure but not paint us into a corner.
**Decision.** Mock data now; persistence later via **localStorage behind a small repository
interface**; one-tap **export** (JSON/Markdown) for durability. No backend, auth, sync,
notifications, or third-party integrations in the MVP.
**Status.** Accepted.
**Consequences.** The repository interface is the *only* forward-looking indirection and it
earns its place (export + a future optional sync are drop-ins). localStorage volatility is
mitigated by export (a critique-flagged quit trigger).
**Source.** Brief §12/§14; critique (target-user lens on data loss).

## ADR-0007 — Slice 1 renders read-only from seeded static data
**Context.** First slice must be small, mobile-reviewable, and deterministic to build.
**Decision.** Slice 1 is a **read-only** Daily Command Deck + self-record strip rendered
from `mock-data/history.ts`, with no wall-clock dependency (no `Date.now()`), so the build
is fully static and the signals are reproducible. Interactivity + real "today" + persistence
land in PR2.
**Status.** Accepted (shipped, verified).
**Consequences.** The deck shows a "Seeded demo data" badge for honesty. Lets us prove the
information architecture and the signals engine on day one.
**Source.** Setup session; QUALITY_BAR determinism rule.

## ADR-0008 — Defer Superpowers; bake its disciplines into the repo
**Context.** Asked to evaluate the `obra/superpowers` plugin. It is **not installed** in
this environment, there is no plugin marketplace configured, and `/plugin` is an interactive
command not available to a headless remote agent — so self-installing it here is not possible.
**Decision.** **Defer** Superpowers. Instead, encode the disciplines we actually want
(brainstorm → critique → plan → TDD → review, decision logging, scope control) directly as
`CLAUDE.md` + `.claude/agents` subagents + `.claude/skills`.
**Status.** Accepted; revisit on desktop where plugin install is interactive.
**Consequences.** ~80% of the benefit, zero install/telemetry risk, fully mobile-friendly,
and version-controlled in the repo.
**Source.** Environment inspection in the setup session.

## ADR-0009 — The product thesis is a hypothesis with pre-registered success/kill criteria
**Context.** The "7-day life improvement" claim was true-by-construction (unfalsifiable).
**Decision.** Treat the core thesis as a **Product hypothesis**, with pre-registered,
observable success and kill criteria and a paper/Notes **baseline week** (see
PROJECT_CHARTER). Also recommend running that cheap paper test in parallel.
**Status.** Accepted.
**Consequences.** We can actually tell whether week 2 is worth building, instead of
collecting feelings (the "reflection theater" the product condemns).
**Source.** Critique panel (product + feasibility lenses).

## ADR-0010 — Every opinionated default is an editable, labeled preference
**Context.** Defaults (3-priority cap, leverage prompts, signal windows, question set) are
stances, not science, and an analytical user will (rightly) distrust them if hidden.
**Decision.** Surface opinionated defaults as **editable preferences**, visibly labeled as
preferences. The 3-priority cap is shown in the UI as "a preference, not a law".
**Status.** Accepted; preferences UI lands in PR4.
**Consequences.** This is what makes the "honesty" positioning real rather than asserted.
**Source.** Critique panel (feasibility lens).

## ADR-0011 — Persistence & state model (PR2): empty-first, fail-safe, invisible
**Context.** PR2 makes the deck interactive and persistent (localStorage). The
`product-critic` subagent flagged three thesis-level risks in the naive design.
**Decision.**
- **Empty-first store.** Never write seed/mock data into the real ledger — a
  confrontation instrument seeded with fictional days is a lie (contradicts ADR-0004).
  The real store starts empty; the seeded sample moves to a clearly-labeled,
  **non-persisted** `/preview` route.
- **Fail-safe recovery.** `deserialize` returns a typed `LoadResult`
  (`ok | empty | corrupt`). On corrupt/unparseable data the app enters a **read-only
  recovery state**: it archives the raw blob **write-once** to a backup key, offers
  export, and **never auto-wipes**. Autosave is disabled until a clean load or an
  explicit user "start fresh". `save()` is non-throwing (quota/private-mode safe) and
  surfaces a "not saving" state instead of throwing into React.
- **Past-day immutability invariant.** The repository rejects writes addressed to a date
  earlier than "today". Today is editable; the historical record is structurally
  un-editable — the claim made real, ahead of multi-day navigation.
- **Invisible persistence.** No "saved ✓" toast, no streak of green checks — that is the
  dopamine-dashboard the product rejects (principles 4, 7). The record confronts; it does
  not congratulate.
- **`toISODate(d)` uses LOCAL calendar components** (not UTC `toISOString`) so "today"
  is correct in the user's timezone; tested near midnight and across a DST boundary.
- **Missing `schemaVersion` is treated as corrupt-recover**, not assumed v1.
**Status.** Accepted (PR2).
**Consequences.** PR2 is larger than a single concern; the persistence layer and the
interactive layer are both tested (lib unit tests + jsdom interaction tests added in this
PR — a small, deliberately-flagged test-harness addition). Weekly review, preferences UI,
multi-day navigation, and onboarding remain deferred (PR3+).
**Accepted limitation (Open question):** "today" is read once on mount; a session left
open across midnight keeps writing to the prior day. Acceptable for a single-session daily
ritual in the MVP; revisit when multi-day navigation lands.
**Source.** `product-critic` subagent on the PR2 state model; `code-reviewer` on the diff.
