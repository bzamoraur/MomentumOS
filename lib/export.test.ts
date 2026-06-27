import { describe, it, expect } from "vitest";
import { emptyState } from "./repository";
import { toJSON, toMarkdown } from "./export";

function seeded() {
  const s = emptyState();
  s.entries["2026-06-25"] = {
    date: "2026-06-25",
    keystone: "Finish the deck",
    keystoneProtected: true,
    notDoing: "Declining a same-day call",
    priorities: [
      { id: "a", title: "Narrative pass", done: true },
      { id: "b", title: "Review model", done: false },
    ],
    leverage: { kind: "reusable_ip", note: "Templatized decision log" },
    compoundingAction: "Read 20 pages",
    energy: 3,
  };
  return s;
}

describe("toJSON", () => {
  it("produces parseable, round-trippable JSON", () => {
    const s = seeded();
    const parsed = JSON.parse(toJSON(s));
    expect(parsed.entries["2026-06-25"].keystone).toBe("Finish the deck");
  });
});

describe("toMarkdown", () => {
  it("renders the day, keystone, trade-off, and priority checkboxes", () => {
    const md = toMarkdown(seeded());
    expect(md).toContain("## 2026-06-25");
    expect(md).toContain("Keystone: Finish the deck — protected");
    expect(md).toContain("- [x] Narrative pass");
    expect(md).toContain("- [ ] Review model");
    expect(md).toContain("Reusable IP captured: Templatized decision log");
  });

  it("is total on an empty ledger", () => {
    expect(toMarkdown(emptyState())).toContain("Entries: 0");
  });
});
