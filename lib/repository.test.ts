import { describe, it, expect } from "vitest";
import type { DailyEntry } from "./types";
import {
  SCHEMA_VERSION,
  emptyState,
  serialize,
  deserialize,
  updateEntry,
  entriesAscending,
  createInMemoryRepository,
  createLocalStorageRepository,
  type MomentumState,
  type WebStorage,
} from "./repository";

function entry(date: string, over: Partial<DailyEntry> = {}): DailyEntry {
  return { date, keystone: "K", notDoing: "", priorities: [], ...over };
}

/** A fake Storage; optionally throws on write to simulate quota/private-mode. */
function fakeStorage(opts: { throwOnSet?: boolean } = {}): WebStorage & {
  map: Map<string, string>;
} {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k) => (map.has(k) ? map.get(k)! : null),
    setItem: (k, v) => {
      if (opts.throwOnSet) throw new Error("QuotaExceededError");
      map.set(k, v);
    },
  };
}

describe("serialize / deserialize", () => {
  it("round-trips a valid state as ok", () => {
    const s = emptyState();
    s.entries["2026-06-26"] = entry("2026-06-26", { keystone: "Ship" });
    const result = deserialize(serialize(s));
    expect(result.status).toBe("ok");
    expect(result.state.entries["2026-06-26"].keystone).toBe("Ship");
  });

  it("treats null/blank as empty (not corrupt)", () => {
    expect(deserialize(null).status).toBe("empty");
    expect(deserialize("   ").status).toBe("empty");
  });

  it("treats unparseable data as corrupt and preserves the raw blob", () => {
    const r = deserialize("{not json");
    expect(r.status).toBe("corrupt");
    if (r.status === "corrupt") expect(r.raw).toBe("{not json");
  });

  it("treats a MISSING schemaVersion as corrupt-recover, not as current", () => {
    const r = deserialize(JSON.stringify({ entries: {}, commitments: [], preferences: {} }));
    expect(r.status).toBe("corrupt");
  });

  it("treats an older schemaVersion as corrupt-recover", () => {
    const r = deserialize(
      JSON.stringify({ schemaVersion: 0, entries: {}, commitments: [], preferences: {} }),
    );
    expect(r.status).toBe("corrupt");
  });
});

describe("updateEntry (immutability invariant)", () => {
  it("updates today's entry", () => {
    const s = emptyState();
    const next = updateEntry(s, "2026-06-26", entry("2026-06-26", { keystone: "X" }), "2026-06-26");
    expect(next.entries["2026-06-26"].keystone).toBe("X");
    expect(s.entries["2026-06-26"]).toBeUndefined(); // immutable update
  });

  it("refuses to modify a past day", () => {
    const s = emptyState();
    expect(() =>
      updateEntry(s, "2026-06-20", entry("2026-06-20"), "2026-06-26"),
    ).toThrow(/immutable/);
  });
});

describe("entriesAscending", () => {
  it("sorts entries oldest-first for the signals engine", () => {
    const s = emptyState();
    s.entries["2026-06-26"] = entry("2026-06-26");
    s.entries["2026-06-24"] = entry("2026-06-24");
    s.entries["2026-06-25"] = entry("2026-06-25");
    expect(entriesAscending(s).map((e) => e.date)).toEqual([
      "2026-06-24",
      "2026-06-25",
      "2026-06-26",
    ]);
  });
});

describe("createInMemoryRepository", () => {
  it("starts empty and round-trips a save", () => {
    const repo = createInMemoryRepository();
    expect(repo.load().status).toBe("empty");
    const s = emptyState();
    s.entries["2026-06-26"] = entry("2026-06-26", { keystone: "Y" });
    repo.save(s);
    const r = repo.load();
    expect(r.status).toBe("ok");
    expect(r.state.entries["2026-06-26"].keystone).toBe("Y");
  });
});

describe("createLocalStorageRepository", () => {
  it("loads empty from a blank store and round-trips a save", () => {
    const storage = fakeStorage();
    const repo = createLocalStorageRepository(storage);
    expect(repo.load().status).toBe("empty");
    const s = emptyState();
    s.entries["2026-06-26"] = entry("2026-06-26", { keystone: "Z" });
    expect(repo.save(s)).toEqual({ ok: true });
    expect(repo.load().state.entries["2026-06-26"].keystone).toBe("Z");
  });

  it("backs up a corrupt blob WRITE-ONCE and never overwrites it", () => {
    const storage = fakeStorage();
    storage.map.set("momentum-os:v1", "{corrupt");
    const repo = createLocalStorageRepository(storage);

    expect(repo.load().status).toBe("corrupt");
    expect(storage.map.get("momentum-os:v1:corrupt-backup")).toBe("{corrupt");

    // a second corrupt load must NOT overwrite the existing backup
    storage.map.set("momentum-os:v1", "{different-corrupt");
    repo.load();
    expect(storage.map.get("momentum-os:v1:corrupt-backup")).toBe("{corrupt");
  });

  it("returns { ok: false } when the store rejects a write (quota/private mode)", () => {
    const repo = createLocalStorageRepository(fakeStorage({ throwOnSet: true }));
    expect(repo.save(emptyState())).toEqual({ ok: false });
  });
});

describe("emptyState", () => {
  it("has the current schema version and empty collections", () => {
    const s: MomentumState = emptyState();
    expect(s.schemaVersion).toBe(SCHEMA_VERSION);
    expect(Object.keys(s.entries)).toHaveLength(0);
    expect(s.commitments).toHaveLength(0);
    expect(s.preferences.maxPriorities).toBe(3);
  });
});
