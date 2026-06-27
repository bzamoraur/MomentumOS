# Project Charter — Momentum OS

> Purpose: fix the scope, the falsifiable bet, and the pre-registered pass/kill rules so we cannot move the goalposts after the pilot.

## Mission
A weekly decision-accountability instrument that confronts you with the gap between what you said mattered and what you actually did — using your own un-editable record, not a score.

## Target user
The ambitious operator who already has tasks and tools and still drifts: a consultant or founder-operator whose scarce asset is senior judgment, who must make explicit trade-offs daily and protect one keystone. First user is the owner (b.zamora.urunuela@gmail.com) — a sample of one, dogfooding. *(Reasoned inference; the persona is a hypothesis until a second user runs the pilot — Open question.)*

## The thesis (Product hypothesis)
Confronting yourself with last week's explicit commitment, and with the objective trace of your own daily entries, changes this week's behavior more than a to-do list or a journal does. This is a bet, not a finding. The HBS reflection evidence is end-of-day skill-acquisition, not weekly goal review; generalizing it to our cadence is an extrapolation. Everything beyond this sentence is hypothesis or deferred.

## Pre-registered success criteria (7-day pilot)
Declared before the pilot. All three must hold:
1. **Adherence.** Opened and keystone declared on **≥6 of 7 days, unprompted** (we have no push; the retrieval cue is home-screen + habit anchor). *(Verified fact: notifications are out of MVP scope.)*
2. **Loop closure follows.** In the week **after** a weekly commitment is written, **≥3 of the committed behaviors are actually kept**, verified against the daily trace — not self-reported.
3. **Felt confrontation.** At least one daily/weekly signal (e.g. keystone protected 3/7, top priority slipped 4 days) prompts a written root cause the user says they would not have surfaced from a to-do list. *(Personal preference: judged by the owner; weak by design for n=1.)*

## Kill / pivot criteria (pre-registered)
- **Adherence floor.** Opened <4 of 7 days unprompted → the frictionless input is not frictionless enough, or the cue failed. Fix the input/cue before anything else.
- **Reflection theater.** Weekly review completed but **0 of the next week's commitments kept** across two cycles → the loop does not change behavior. The core thesis is failing; stop building features and re-test the loop itself.
- **Gaming, defined.** "Gamed" = inputs optimized to make signals look good rather than to reflect reality: trivially-true keystones ("be awake"), `notDoing` left blank or boilerplate to dodge the trade-off, priorities marked done without being done, energy/leverage padded. *(Reasoned inference: with no score there is little to maximize — but the user can still self-flatter.)*
- **Response to gaming.** Do **not** add anti-gaming scoring or nags (that rebuilds the Goodhart trap we cut). Surface the raw fact neutrally and let the un-editable longitudinal record do the confronting. If gaming persists, the instrument is wrong for this user — record it as a kill signal, not a copy problem.

## Baseline requirement
The thesis is testable for ~1% of the build cost as a paper/Notes template. So run a **paper/Notes counterfactual week in parallel** (or immediately prior) against the same success criteria. Without that baseline, any pilot result is uninterpretable — we would not know the app beat a sheet of paper. *(Reasoned inference; non-negotiable for honesty.)* We build the repo anyway because the buildable differentiator — longitudinal confrontation, commitment carry-forward, export — is exactly what paper cannot sustain past a week.

## Scope boundaries
**In (charter level):** one daily input (keystone + explicit trade-off + ≤3 priorities + optional leverage/compounding/energy + end-of-day keystone binary); the factual self-record strip (derived, never stored, never aggregated); the Weekly Confrontation with one carried-forward commitment; local persistence + one-tap export; editable preferences; an onboarding retrieval cue.
**Out (non-goals):** any momentum score, accounts/auth, backend DB, sync, push/notifications, integrations (calendar/wearable/Todoist), AI generation, multi-user, native app, streaks-as-reward, threshold-nags-as-judgment, trend charts, and **any** health/training/nutrition/sleep advice (tracking only).

## Operating constraints
- **Mobile-first.** Daily input is tap-first and completable in <60s.
- **Local-first.** localStorage behind a repository interface; nothing leaves the device; export is user-initiated.
- **No DB / auth / integrations / AB in MVP.** A repository seam is the only forward-looking indirection, and it earns its place (export + future sync).
- **Small PRs.** Ship vertical slices; every PR keeps typecheck + unit tests + build green.
- **No medical advice — ever.** Health and training are tracking only. *(Verified fact: hard product boundary, see brief §14.)*

## Links
- Product requirements: [PRD.md](./PRD.md)
- Principles: [PRODUCT_PRINCIPLES.md](./PRODUCT_PRINCIPLES.md)
- Decisions / ADRs: [DECISIONS.md](./DECISIONS.md)
