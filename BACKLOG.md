# Backlog

> Purpose: the shipping roadmap (PR1..PR5), the deliberately-deferred parking lot (each with the principle that deferred it), and the honest open questions. Coherent with `SPEC_BRIEF.md`.

## 1. Roadmap (PR1..PR5)

Source: brief §13. PR boundaries are deliberately small. The thesis (brief §1) is a *Product hypothesis*; nothing here pretends otherwise.

| Branch | Objective | Key files | Risk |
|---|---|---|---|
| **PR1** `claude/momentum-os-setup-ak60ge` *(done — this PR)* | Repo skeleton + 13 docs + `.claude` layer + mock seed + signals engine (TDD) + Slice 1 read-only Daily Command Deck rendered from 14-day mock history. | `lib/types.ts`, `lib/signals.ts`, `lib/signals.test.ts`, `mock-data/`, `app/page.tsx`, `components/` | Low |
| **PR2** | Interactivity + `localStorage` repository behind a small interface + one-tap export (JSON + Markdown). | `lib/repository.ts` (new), `app/page.tsx`, daily-input components | Medium — first stateful surface; client/server boundary and rehydration. |
| **PR3** | Weekly Confrontation + commitment carry-forward (last week's ONE commitment at the top, graded kept/missed/partial + why). The heart. | `lib/weekly.ts` (new), `WeeklyCommitment` flows, signals consumed read-only | Medium — the differentiating loop; correctness of carry-forward and grading. |
| **PR4** | Editable preferences (3-priority cap, leverage prompts, week start) surfaced as labeled preferences + onboarding cue setup (PWA/home-screen + habit-anchor copy). | `Preferences` UI, onboarding copy, PWA manifest | Low |
| **PR5** *(optional)* | Polish: empty/return states (graceful re-entry, "minimum viable day"), a11y pass. | return-state components, a11y | Low |

## 2. Parking lot (deliberately deferred)

Each item is deferred *on principle*, not for lack of time. The deferring critique/principle is named. None of these enter MVP (brief §7 non-goals).

- **Composite "momentum score."** Deferred — and not merely postponed. A single self-derived scalar is the vanity metric we reject; a competitive analytical user games it. *(Goodhart / surrogation; brief §3, ADR-0002.)* Reconsider **only if an EXTERNAL, non-self-reported validation source ever justifies aggregation** — never from self-entered data alone.
- **Structured Learning / Leverage / Project daily tracks.** Deferred. Separate structured daily modules re-create the "6 modules, none good" problem. *(Constraint over capture; brief §3.)* Collapsed to one optional `compoundingAction` field; earn tracks back only after proven repeated use.
- **AI-generated weekly questions.** Deferred. The differentiator is the user's own un-editable record, NOT AI. *(Confrontation by data, not tone; brief §0, §7.)*
- **Calendar / wearable / Todoist integrations.** Deferred. Each adds a sync surface, a dependency, and (for wearables) a health-inference seam we refuse. *(Track, never prescribe; no health advice; brief §7.)* The onboarding *cue* is a manual habit-anchor instead.
- **Trend charts.** Deferred. A chart invites optimizing the line; raw non-aggregated facts have nothing to maximize. *(No single score / no surrogate; brief §3, §7.)*
- **Multi-project board.** Deferred. One personal project, honestly visible, beats a board that becomes its own busywork. *(Constraint over capture; brief §6 loop 6.)*
- **Auth / DB / sync.** Deferred. Local-first; nothing leaves the device. Export covers portability; the repository seam (PR2) keeps a future backend a drop-in without building it now. *(Anti-overengineering; brief §12, §14.)*
- **Notifications / push.** Deferred. We do not have push and will not pretend to. *(Designed retrieval cue instead of fake notifications; brief §4.)* See Open question below.
- **Energy/training as a required field, planning gate, or recommendation.** Deferred — permanently as advice. Energy stays optional one-tap context the user interprets. *(HARD boundary: tracking only, no medical/training/nutrition/sleep advice; brief §3, §6 loop 3, §14.)*
- **Spaced-repetition / structured skill tree.** Deferred. Evidence supports spacing/retrieval (brief §11), but it is a separate product, not this instrument. *(Every feature earns its place; brief §6 loop 4.)*
- **Separate `rootCause` field in the weekly review.** Deferred (PR3). `outcomeNote` ("why") already captures the diagnosis; a second prose field bloats a ~15-min ritual. *(Constraint over capture; product-critic on PR3, ADR-0012.)* Add back only if the pilot shows users want to separate "why the week went that way" from the verdict.

## 3. Open questions

These are unresolved. They are tracked, not hand-waved.

- **(Open question) Retrieval without push.** We cannot send notifications, so adherence depends on a self-installed cue (home-screen PWA + habit anchor + calendar block, brief §4). Unknown whether a designed manual cue produces enough return rate to test the thesis. Needs measurement in the pilot.
- **(Open question) Detecting gaming.** A competitive analytical user can perform the ritual without behavior change (e.g. trivially-true keystones, always naming a token trade-off). We have no robust operational definition of "gaming" yet, nor a pre-registered detector. Required before the pilot's kill criterion (brief §4, §6 loop 2).
- **(Open question) Weekly-cadence reflection evidence gap.** The reflection evidence (Di Stefano et al., HBS 2014) is END-OF-DAY reflection during skill acquisition, not WEEKLY goal review (brief §11). Generalizing to weekly cadence is an extrapolation; "weekly review changes behavior" remains a *Product hypothesis*, not a verified fact. Open question: is weekly the right cadence at all, vs. end-of-day?

## 4. Phase 2 wishlist (parked — revisit only after the 7-day pilot)

Source: the owner's Phase 2 "Personal Control Tower" vision. Captured so nothing is lost.
**None of these is to be built before the thin MVP is pilot-tested** (`PROJECT_CHARTER`).
Verdicts are from the senior review; re-evaluate each against real adherence/friction data.

**Decision rule:** a wish re-enters scope only with (a) pilot evidence that the thin loop
is actually adhered to, and (b) an ADR explaining why it does not dilute the instrument or
cross a boundary. Engines belong in a **separate companion app**, not inside the instrument.

- **AI curated feed + "why it matters" TL;DRs** — *Separate product.* Needs an ingest
  pipeline + LLM + integrations and makes AI the author of your insights, contradicting the
  differentiator (your own un-editable record, ADR-0004). (Product hypothesis.)
- **Weekly "So What?" synthesis** — *Adopt thin, post-pilot.* Of your OWN week, inside the
  Weekly Confrontation — not of the news. (Reasoned inference.)
- **One-click capture → personal-project / idea ledger** — *Best near-term fit.* Frictionless
  capture serving the Personal-Project loop (loop 6); strengthens the instrument rather than
  diluting it. First candidate after the pilot. (Preference + hypothesis.)
- **Training engine (progressive overload / variation / strength prediction)** — *Declined as
  prescription — HARD boundary.* No medical/training advice, ever (EVIDENCE_POLICY, ADR-0005).
  Only downgrade path: a plain self-entered training LOG (facts, no coaching), likely a
  separate app.
- **Small-talk drills / freestyle "engine"** — *Separate products.* Practice tools, not
  accountability; inside the instrument they are the "6 modules, none good" trap. As thin
  ledger inputs ("practiced 10 min today") they fit the existing compounding field. (Reasoned inference.)
- **Voice capture + local Whisper scoring** — *Defer, separate + heavy.* Web-audio + model
  hosting + delivery scoring (Goodhart). A different product. (Open question.)
- **Cross-module synergies / real-time "Control Tower"** — *Reframe.* Threads connect in the
  weekly review, not a live cockpit; one cross-cutting question beats an engine. (Preference.)
- **Calendar-driven workout adjustment; calendar / Notion / wearable integrations** —
  *Declined for MVP+.* External dependencies and (wearables) a health-inference seam; breaks
  the local-first stance. (Stated boundary.)
- **Pop-science claims to NOT encode as fact:** "shock the CNS", "neuroplasticity via
  freestyle", "micro-dose behavioral conditioning", "1% better", "volume velocity".
  (Label: unverified — cite credible evidence or omit; never assert as fact.)
