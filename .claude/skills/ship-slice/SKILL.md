---
name: ship-slice
description: >
  How to ship a vertical slice in Momentum OS: small, tested, mobile-reviewable, and
  honest. Use when implementing any feature/PR in this repo so the work stays inside the
  scope, quality, and evidence discipline defined in CLAUDE.md.
---

# Ship a vertical slice

A disciplined path from idea to a draft PR the owner can approve from a phone.

## 1. Frame (before code)
- State the problem in one sentence.
- State the SMALLEST slice that delivers real value.
- State what you are deliberately NOT building in this slice.
- If the slice is non-obvious or "obviously good", run the `product-critic` subagent
  and address its fatal/high objections before continuing.

## 2. Check scope
- Is this inside `PRD.md` non-goals? If it's a non-goal, stop — it belongs in
  `BACKLOG.md` with a rationale, or needs an ADR.
- One reviewable concern only. If it mixes infra + docs + feature, split it.

## 3. Build brain-first
- Put pure logic in `lib/` (deterministic, total). Write tests FIRST; cover empty and
  partial input and the boundary the function claims.
- Keep components in `components/` thin and presentational; server components by default.
- No score. No health advice. Every opinionated default is a labeled, editable preference.

## 4. Verify the gate (never skip)
- `pnpm run typecheck && pnpm run test && pnpm run build` (i.e. `pnpm run check`) green.
- `pnpm run lint` green.
- If the change renders UI you cannot see, verify the prerendered HTML
  (`.next/server/app/index.html`) contains the expected content/values.
- Run the `code-reviewer` subagent on the diff.

## 5. Record + commit
- If you made an important choice, append an ADR to `DECISIONS.md`.
- Commit one logical concern with a clear message. Branch per the repo's branch rule.

## 6. PR (mobile-friendly)
- Open a DRAFT PR. Body: what changed, why, the gate result, screenshots/HTML evidence,
  and an explicit "what this does NOT do yet".
- Keep the diff small enough to review on a phone. If it isn't, that's a smell — split.
