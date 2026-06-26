# Critique log — how the concept was sharpened

Purpose: record the adversarial review that turned the initial Momentum OS concept into
the shipped scope, so future work doesn't quietly re-introduce what was deliberately cut.

The initial concept was attacked by a **4-lens critique panel** (independent reviewers,
distinct lenses) plus an **evidence auditor**. The four lenses converged — independently —
on the same core failures, which is why the resulting cuts are high-confidence, not taste.

## The panel

| Lens | Brief | Verdict |
|---|---|---|
| Behavioral-systems | adherence, friction, Goodhart/score-corruption, tone-as-nagging | needs-major-revision |
| Product / PM | differentiation vs incumbents, form factor, vanity metric, falsifiability | needs-major-revision |
| Target-user (consultant) | would a slammed consultant actually use it; executive-leverage value | needs-major-revision |
| Feasibility / evidence | over-engineering, data-model creep, health-advice boundary, unlabeled claims | needs-major-revision |

## Convergent findings → decisions

1. **The momentum score is a Goodhart/surrogation trap (fatal/high, all 4 lenses).**
   A single self-derived scalar handed to a competitive, analytical user gets gamed and
   becomes the goal. → **Cut the score entirely** (ADR-0002). Replace with raw,
   non-aggregated facts (`lib/signals.ts`).
2. **No forcing function to open it (fatal).** A localStorage web tab with no cue
   contradicts the product's own premise that intention is unreliable. → **Designed
   retrieval cue** in onboarding (home-screen + habit anchor + calendar block); honesty
   that we have no push (ADR-0006, PRD §3).
3. **The "thin tracks" leaked back into the daily ritual as ~6 mandatory fields.** →
   **Daily ritual reduced** to keystone + explicit trade-off + ≤3 plain priorities, with
   everything else optional; the four tracks become weekly-interrogated signals (ADR-0003).
4. **The real differentiator isn't tone or AI — it's longitudinal self-confrontation.**
   Hardcoded "opinionated" copy becomes wallpaper by week one. → **Confront with the
   user's own un-editable record** + **weekly commitment carry-forward** (ADR-0004).
5. **Energy/training crosses a health-advice boundary.** → **Tracking only**, optional
   one-tap context, never a recommendation or a gate (ADR-0005).
6. **localStorage is too volatile for the "compounding ledger" promise.** → **One-tap
   export** (JSON/Markdown) so a cleared cache can't destroy the ledger (ADR-0006).
7. **The "7-day improvement" claim is true-by-construction.** → Re-labeled a **Product
   hypothesis** with pre-registered success/kill criteria and a paper baseline (ADR-0009).
8. **Opinionated defaults asserted as science.** → Every default (cap, prompts, windows)
   is an **editable, labeled preference** (ADR-0010).

The panel also raised the **cheaper-test challenge**: the thesis can be tested as a paper/
Notes template in 7 days at ~1% of the cost. We accept it and recommend running that
baseline in parallel; we still build because the buildable differentiator (confrontation,
carry-forward, export) is what paper cannot do, and the repo is a deliberate asset.

## Evidence audit (claims the product may lean on)

See `EVIDENCE_POLICY.md` for the full table and sources. Headlines:

- Implementation intentions / if-then planning improve goal attainment — **well-supported**
  (Gollwitzer & Sheeran 2006, d≈0.65; smaller in some domains).
- Goodhart's law / surrogation — **well-supported** (phrasing is Strathern 1997, not
  Goodhart's literal 1975 wording; surrogation: Choi/Hecht/Tayler). Basis for the score cut.
- Task-switching costs — **well-supported** (Rubinstein, Meyer & Evans 2001); avoid the
  loose "23 min / 40%" figures.
- Spacing / retrieval practice — **well-supported**; justifies a *future* learning module.
- Gamified streak apps can backfire for *some* users — **supported as "can backfire", not
  "fails on average"**; do not overclaim.
- Weekly structured reflection changes behavior — **MIXED**; the strong study (Di Stefano
  et al., HBS 2014) is end-of-day reflection during skill acquisition, not weekly goal
  review. Hence the thesis is a **hypothesis**, and we avoid vendor stats.

> This log is a snapshot. When a future change touches a cut item, update the relevant ADR
> and note it here.
