# Quality Bar

> Purpose: the non-negotiable bar every change clears before it merges. Coherent with SPEC_BRIEF §12–16.

## Definition of Done

A change is done when ALL hold:

- The quality gate (`pnpm run check`) and `pnpm run lint` are green locally.
- New or changed pure domain logic in `lib/` has tests written first (TDD) and passing.
- The diff carries exactly one reviewable concern (see Diff discipline).
- UI strings and docs respect EVIDENCE_POLICY: no unlabeled non-trivial claims, no invented benchmarks.
- No health/training/sleep/nutrition prescription is introduced, anywhere (HARD boundary, SPEC_BRIEF §6.3, §14).
- Every opinionated default is surfaced and labeled a preference, not asserted as fact.
- Accessibility baseline (below) holds for any touched UI.
- The PR checklist is filled.

## Quality gate

The single command, defined in `package.json`:

```
pnpm run check   # = pnpm run typecheck && pnpm run test && pnpm run build
```

Plus `pnpm run lint` (ESLint). All four — typecheck, test, build, lint — must be green before commit.
The gate is the contract: do not merge red, do not skip with `--no-verify`. (Reasoned inference: a setup PR that ships its own gate red teaches the team the gate is optional.)

## Testing expectations

- **Pure domain logic in `lib/` is TDD'd.** `lib/signals.ts` and `lib/types.ts` are framework-free. Write the failing test first.
- **Functions must be total.** Every signal handles empty arrays, single entries, and missing optional fields (`keystoneProtected`, `compoundingAction`, `energy`) without throwing. Cover the empty/partial cases explicitly — they are the realistic ones (skipping is the base case, SPEC_BRIEF §4).
- **Determinism.** Same input, same output. No clocks, no randomness, no I/O inside `lib/`. Tests assert exact values, not ranges.
- **Components stay thin.** Slice 1 components are presentational and read-only; they receive computed facts as props and render them. No business logic, no signal computation in the component layer.
- **Interaction tests land with interactivity.** Slice 1 ships no render/interaction tests because there is no interactivity yet (Product hypothesis: testing static markup adds churn, not signal). When PR2 introduces state and inputs, add render and interaction tests in the same PR as the behavior.

## Diff discipline (mobile-review first)

Reviews happen on a phone. Optimize for that.

- **One reviewable concern per PR.** Signals engine, a UI slice, and a doc edit are three PRs, not one.
- **Flag oversized diffs.** If a PR cannot be reviewed on a phone in one sitting, say so in the description and split it. A large mechanical change (rename, move) goes in its own PR, isolated from logic.
- **Logical commits.** Each commit is one coherent step with a message that states intent, not mechanics. No "wip", no "fix" without context. Group by concern so a reviewer can read the history top to bottom.

## Accessibility baseline

- Semantic HTML first; ARIA only where semantics are insufficient.
- All interactive elements reachable and operable by keyboard; visible focus state.
- Color is never the sole carrier of meaning; text contrast meets WCAG AA.
- The daily input must read cleanly on a phone (SPEC_BRIEF §10) — the primary device.

## Honesty / evidence checks in review

A reviewer rejects a change that:

- States a non-trivial claim in UI copy or docs without a label (Verified fact / Reasoned inference / Product hypothesis / Personal preference / Open question).
- Cites a benchmark, stat, or study not supported by SPEC_BRIEF §11 (e.g. "23 minutes", "42%", "Dominican").
- Introduces ANY health/training recommendation. Tracking only. No exceptions.
- Reintroduces a momentum score or any aggregate scalar (cut by all four lenses, SPEC_BRIEF §3).
- Presents a threshold or default as judgment rather than as a visible, editable preference.
- Leads with accusatory tone instead of neutral-specific facts (confrontation by data, not by tone).

## PR checklist

- [ ] `pnpm run check` green (typecheck + test + build).
- [ ] `pnpm run lint` green.
- [ ] New/changed `lib/` logic is TDD'd and total over empty/partial input.
- [ ] Components touched stay thin; interaction tests added if interactivity landed.
- [ ] One reviewable concern; diff reviewable on a phone; commits are logical.
- [ ] Accessibility baseline holds for touched UI.
- [ ] No health/training prescription; no score; no unlabeled claim; no unsupported stat.
- [ ] Every opinionated default labeled an editable preference.
