# Product Principles

Purpose: the ten non-negotiable rules that decide what Momentum OS builds, cuts, and refuses. Derived from the canonical brief (§15) and the 4-lens critique that preceded it.

These are operating constraints, not aspirations. When a feature conflicts with a principle, the feature loses. Claims below carry an evidence label.

---

**1. Constraint over capture.**
One keystone, one explicit trade-off, ≤3 priorities. The value is in what you are forced to leave out, not in what you can record. Capture tools already exist (Todoist, Notion, paper); they never confront the gap between stated and actual. (Reasoned inference; single-keystone focus supported by task-switching-cost literature — Verified fact, brief §11.)

**2. Confrontation by data, not by tone.**
The product earns the right to challenge by being accurately specific about your own record — not by an opinionated or accusatory voice. Lead neutral-but-specific. (Critique finding: behavioral lens cut accusatory copy — Verified fact, brief §3.)
- How we apply this: signals (`lib/signals.ts`) return plain facts ("Keystone protected 3 of last 7 days"), never adjectives or verdicts.

**3. No single score.**
There is no momentum score and no `Score` type. A self-derived scalar handed to a competitive, analytical user is the vanity metric we reject; they would optimize the number instead of the behavior. (Critique finding: all 4 lenses, Goodhart/surrogation — well-supported, brief §3 / §11.)
- How we apply this: signals are raw, non-aggregated, and have nothing to maximize. Surrogation is the failure mode we are designing against, not toward.

**4. Survive the worst day — design the comeback, not the streak.**
Skipping is the base case. The product must be MORE useful on a brutal week, not punitive. No streak-as-reward. On return, open with diagnosis, not judgment. (Critique finding: behavioral/target-user — Verified fact, brief §4. Streak apps can backfire for SOME users — supported as "can backfire," NOT "fails on average"; do not overclaim, brief §11.)
- How we apply this: a "minimum viable day" path (keystone + did-I-protect-it) exists for brutal weeks; re-entry copy is diagnostic.

**5. Earn the right to challenge by first being accurately specific.**
Before the system surfaces a pattern, it must state the underlying facts plainly enough that the user cannot dispute them. Specificity is the permission to confront. (Reasoned inference, from principle 2.)

**6. Every default is a labeled, editable preference.**
The 3-priority cap, the leverage prompts, the question set — every opinionated default is visible AND editable, labeled as a preference, never as science. (Critique finding: feasibility lens — Verified fact, brief §3 / §4.)
- How we apply this: `maxPriorities` defaults to 3 and is typed as a `Preference`; its docstring states it is "an editable preference — not a law."

**7. Honesty over motivation.**
We do not manufacture motivation with rewards, encouragement, or inflated stats. An un-editable record that is occasionally unflattering beats a motivating one that lies. We cite no vendor benchmarks. (Personal preference, codified; weekly-review-changes-behavior is a Product hypothesis, not verified — brief §11.)

**8. Every feature earns its place or is cut.**
Six loops, but the MVP ships essentially ONE core loop (Weekly Confrontation, fed by a thin daily input). The other tracks are optional, un-scored ledger signals — not daily modules. Structured tracks are earned back only after proven repeated use. (Critique finding: product lens cut the "6 modules, none good" trap — Verified fact, brief §3 / §6.)

**9. Track, never prescribe — especially health.**
Energy and training are TRACKING ONLY: optional one-tap context the user interprets. The system issues NO medical, training, nutrition, or sleep recommendation, ever. This is a hard boundary, not a default. (Critique finding: all 4 lenses, health-advice liability seam — Verified fact, brief §3 / §6 / §14.)
- How we apply this: `energy` is typed "Optional context ONLY. Never a gate, never a recommendation." No signal consumes it to advise.

**10. The ledger must be portable.**
The record is the asset; it must survive a cleared cache. One-tap export (JSON + Markdown), user-initiated, nothing leaves the device otherwise. Removes the catastrophic data-loss quit trigger. (Critique finding: target-user lens — Verified fact, brief §3 / §4.)
- How we apply this: persistence sits behind a repository seam so export today and a future backend are drop-ins, not rewrites.

---

Open question: whether longitudinal self-confrontation changes behavior more than a to-do list or journal. That is the falsifiable thesis (Product hypothesis, brief §1) and carries a pre-registered kill criterion. These principles hold regardless of the outcome; the feature set does not.
