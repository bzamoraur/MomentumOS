# Security & Privacy

Purpose: define what data Momentum OS is allowed to hold, where it lives, and the one boundary it never crosses.

This is a local-first, single-user, no-backend app. Most "security" here is really data hygiene and discipline about what gets written down. The threat model is small; the discipline is not optional.

## 1. Data classification

Momentum OS handles exactly one class of data: **personal, NON-sensitive, self-reported intent and reflection.** Examples that belong here: a keystone sentence ("ship the onboarding slice"), a named trade-off, ≤3 plain priority titles, an optional one-line compounding action, an optional 1–5 energy tap, an optional leverage note.

That is the ceiling. Anything that raises the consequence of a leak does not belong in this product.

### DO-NOT-STORE list

Applies to **all three surfaces**: source in the repo, `/mock-data` seeds, and (later, PR2) `localStorage`. Do not write any of the following into a keystone, priority, note, compounding action, leverage note, or commitment:

- Real client, customer, or employer names; project codenames under NDA; deal terms.
- Financial data: account numbers, balances, salary, invoices, revenue figures.
- Health data: diagnoses, medications, symptoms, lab values, weights, HRV, sleep stages. (The energy tap is a 1–5 self-rating only — not a health record.)
- Confidential or proprietary material: passwords, API keys, tokens, secrets, internal docs.
- PII of any third party: names, emails, phone numbers, addresses of other people.
- Anything you would not paste into a plain-text file synced nowhere and exported on a whim.

Reasoned inference: the cheapest way to keep a tool safe is to keep it boring. The differentiator is longitudinal confrontation with your own decisions — that works on abstracted, non-sensitive phrasing ("the irreversible call I dodged") just as well as on named specifics, and far more safely.

## 2. Local-first posture

Verified fact (from the architecture in the brief, §7/§12): no accounts, no auth, no backend, no database, no sync.

- **Nothing leaves the device.** All persistence (PR2 onward) is `localStorage`. There is no server to send data to.
- **No third-party analytics.** No telemetry SDK, no tag manager, no pixel.
- **Next.js telemetry is disabled.** It is turned off explicitly (`next telemetry disable` / `NEXT_TELEMETRY_DISABLED=1`) so the build/dev toolchain phones home with nothing. Noted here because "disabled by default" is not something to assume — it is set.

Open question: a future optional sync/backup (the repository seam in §12 exists partly for this). If it is ever built, it changes this posture and must get its own threat model and consent flow. Out of scope today.

## 3. The hard boundary: tracking, never advice

Verified fact (brief §6 loop 3, §7 non-goals, §15 principle 9): Momentum OS issues **no medical, training, nutrition, or sleep advice — ever.**

The energy field and any future training tap are **tracking and self-reported context only.** The system never interprets them, never recommends, never warns, never infers a condition. A neglect fact ("no compounding action logged in 5 days") is an arithmetic statement about the user's own log, not a judgment and not health guidance. This boundary is a product decision and a liability seam; do not erode it with a "helpful" suggestion in copy, a tooltip, or a derived signal.

## 4. Export

Reasoned inference from brief §7: export (JSON + Markdown) is **user-initiated and stays local.** It is a download triggered by the user, written to their own filesystem. It uploads nothing. Once exported, the file is the user's responsibility — the DO-NOT-STORE list is also why an exported ledger is safe to keep around.

## 5. Mock-data rules

`/mock-data` is **fictional only.** Seed entries must read like plausible personal entries while naming no real person, employer, client, or confidential thing. Treat the seed file as if it will be committed publicly — it is. If a mock keystone could be mistaken for a real NDA'd project, rewrite it.

## 6. Threat notes (local-first, single-user)

Small surface, but two real failure modes:

- **Shared / borrowed device.** `localStorage` is readable by anyone with access to that browser profile. Momentum OS has no lock screen and is not the place for a secret. The DO-NOT-STORE list is the mitigation: if nothing sensitive is in there, a shared device is a privacy nuisance, not a breach.
- **Cache loss = data loss.** Clearing site data, switching browsers, or a wiped profile destroys the ledger. There is no server copy. Mitigation is **export** (§4): the brief calls cache loss a catastrophic quit trigger and export the antidote. The product should make export easy and remind the user it is the only backup.

Personal preference: an occasional exported snapshot, kept by the user wherever they keep notes, is the right durability story for a tool this size. Don't build a backend to solve a discipline problem.

## 7. If sensitive data is ever genuinely needed

Default answer: **don't.** Re-read §1 and abstract the entry instead.

If a real use case ever demands it (Open question, explicitly out of scope), the answer is a **separate, private, encrypted store** with its own access control — not stretching `localStorage` and not relaxing the DO-NOT-STORE list. That is a different product surface with a different threat model. It is not built, not planned, and not on the roadmap here.
