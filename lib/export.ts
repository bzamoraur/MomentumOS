/**
 * Pure export of the ledger to portable formats. The ledger must survive a
 * cleared cache (the catastrophic quit trigger), so export is user-initiated and
 * deterministic. No wall-clock, no side effects — the Blob download lives in the UI.
 */

import { LEVERAGE_LABELS } from "./types";
import { entriesAscending, type MomentumState } from "./repository";

export function toJSON(state: MomentumState): string {
  return JSON.stringify(state, null, 2);
}

export function toMarkdown(state: MomentumState): string {
  const entries = entriesAscending(state);
  const out: string[] = ["# Momentum OS — export", "", `Entries: ${entries.length}`, ""];

  for (const e of entries) {
    out.push(`## ${e.date}`);
    const protectedTag =
      e.keystoneProtected === undefined
        ? ""
        : e.keystoneProtected
          ? " — protected"
          : " — not protected";
    out.push(`- Keystone: ${e.keystone || "—"}${protectedTag}`);
    out.push(`- Not doing: ${e.notDoing || "—"}`);
    if (e.priorities.length) {
      out.push("- Priorities:");
      for (const p of e.priorities) out.push(`  - [${p.done ? "x" : " "}] ${p.title}`);
    }
    if (e.leverage) {
      out.push(`- ${LEVERAGE_LABELS[e.leverage.kind]}: ${e.leverage.note ?? "captured"}`);
    }
    if (e.compoundingAction) out.push(`- Compounding: ${e.compoundingAction}`);
    if (e.energy) out.push(`- Energy (context only): ${e.energy}/5`);
    if (e.note) out.push(`- Note: ${e.note}`);
    out.push("");
  }

  if (state.commitments.length) {
    out.push("## Weekly commitments", "");
    for (const c of state.commitments) out.push(`- ${c.weekOf}: ${c.commitment}`);
    out.push("");
  }

  if (state.reviews.length) {
    out.push("## Weekly reviews", "");
    for (const r of state.reviews) {
      const why = r.outcomeNote ? ` — ${r.outcomeNote}` : "";
      out.push(`- ${r.weekOf}: ${r.outcome}${why}`);
    }
    out.push("");
  }

  return out.join("\n");
}
