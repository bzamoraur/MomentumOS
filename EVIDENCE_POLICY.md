# Evidence & veracity policy

Purpose: keep Momentum OS honest. This product is *about* honesty; if its own claims are
invented, the whole thing is fraudulent. This policy is binding on code comments, UI copy,
docs, and chat.

## The classification (label every non-trivial claim)

| Label | Meaning | Obligation |
|---|---|---|
| **Verified fact** | Supported by a real, retrievable source | Cite it |
| **Reasoned inference** | A defensible deduction from facts | Show the reasoning |
| **Product hypothesis** | A bet we are testing | Label it; define how it's tested |
| **Personal preference** | A taste/stance | Label it; make it editable where it drives behavior |
| **Open question** | Unknown | Say "unknown"; propose how to verify |

## Hard rules

1. Never present invented research, benchmarks, behavioral science, productivity, or
   medical claims as fact. Fabricating a citation is the worst failure mode in this repo.
2. If you cannot verify a "fact", downgrade it to inference/hypothesis/open-question, or
   run the `evidence-auditor` subagent.
3. **Health boundary:** no medical, training, nutrition, or sleep advice. Track and reflect
   only. (Reasoned inference: out of scope and a liability for a personal tracking tool.)
4. UI microcopy counts. "You protected your keystone 3 of 6 days" is a fact derived from the
   user's data (fine). "You're winning this week" is a judgment dressed as fact (not fine).

## Audited claim set (from the setup-session evidence audit)

These are claims the product may lean on, with the **exact caveats** to use. Verified via
real sources; where verification was partial it is marked. Do not over-state beyond this.

1. **Implementation intentions / if-then planning improve goal attainment.**
   *Status: Verified fact (with calibration caveat).* Gollwitzer & Sheeran (2006)
   meta-analysis, d≈0.65; domain-specific follow-ups report smaller effects. Use to justify
   "name what you're NOT doing" and explicit commitment — not to promise a specific lift.
2. **Goodhart's law / surrogation: a measure that becomes a target stops being a good
   measure; people substitute the metric for the goal.**
   *Status: Verified fact.* Goodhart (1975); the popular phrasing is Strathern (1997);
   surrogation studied experimentally by Choi, Hecht & Tayler. This is the basis for
   cutting the score (ADR-0002).
3. **Task-switching imposes measurable cognitive/time costs.**
   *Status: Verified fact.* Rubinstein, Meyer & Evans (2001); APA summary. **Do not** quote
   the loose viral figures ("23 minutes", "40%") as precise. Justifies the single keystone.
4. **Spacing / retrieval practice beats massed study for long-term retention.**
   *Status: Verified fact.* Decades of replication; multiple meta-analyses. Justifies a
   *future* learning module — which is deferred (separate product).
5. **Gamified streak/tracking apps can backfire for some users.**
   *Status: Verified fact, narrow.* Habitica field research (Diefenbach & Müllner et al.;
   JMIR Serious Games). It supports a "**can** backfire for some" claim — **not** "fails on
   average". Net effect is design-dependent. Do not over-claim.
6. **Brief structured weekly reflection changes behavior / improves goal progress.**
   *Status: Product hypothesis (evidence is MIXED for our use).* The strong primary study
   (Di Stefano, Gino, Pisano & Staats, HBS 2014; ~23% on a training test) concerns
   **end-of-day reflection during skill acquisition**, not weekly goal review — so applying
   it to a weekly cadence is an extrapolation. **Do not** cite "42% / 22.8% / Dominican
   University" vendor stats; they are not rigorous. This is exactly why the core thesis is
   labeled a hypothesis (ADR-0009).

## Sources (as retrieved during the audit)

- Gollwitzer & Sheeran (2006), *Implementation Intentions and Goal Achievement: A
  Meta-Analysis* — researchgate.net/publication/37367696
- *Goodhart's law* overview — en.wikipedia.org/wiki/Goodhart%27s_law (note: fetched via
  secondary summaries; primary page returned 403 in-session); surrogation — Choi/Hecht/Tayler.
- Rubinstein, Meyer & Evans (2001), *Executive Control of Cognitive Processes in Task
  Switching* — pubmed.ncbi.nlm.nih.gov/11518143 ; APA *Multitasking: Switching costs*.
- Spacing/retrieval meta-analyses — e.g. Springer *Int. J. STEM Education* (2024);
  *Educational Psychology Review* spacing review.
- Diefenbach & Müllner et al., *Counterproductive effects of gamification (Habitica)* —
  Int. J. Human-Computer Studies; JMIR Serious Games (2024).
- Di Stefano, Gino, Pisano & Staats (2014), *Learning by Thinking* — SSRN 2414478; HBS.

> Maintenance: when you add a claim to the product, add it here with a label and (if a
> fact) a source. When you cut one, note it. The `evidence-auditor` subagent can refresh
> or extend this set.
