"use client";

import * as React from "react";
import type { DailyEntry, Priority, LeverageKind } from "@/lib/types";
import { LEVERAGE_LABELS } from "@/lib/types";
import { formatLongDate, toISODate } from "@/lib/date";
import {
  createLocalStorageRepository,
  emptyState,
  entriesAscending,
  updateEntry,
  type MomentumState,
  type LoadResult,
  type MomentumRepository,
} from "@/lib/repository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelfRecordStrip } from "@/components/deck/self-record-strip";
import { ExportButtons } from "@/components/deck/export-buttons";

function blankEntry(date: string): DailyEntry {
  return { date, keystone: "", notDoing: "", priorities: [] };
}

/** Unique id without requiring a secure context (crypto.randomUUID throws on plain HTTP). */
function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `p-${Math.random().toString(36).slice(2)}`;
}

/**
 * The real, persistent Daily Command Deck. Empty-first (no seeded fiction),
 * autosaves invisibly to localStorage, and fails safe into a read-only recovery
 * state if the stored data can't be read. See DECISIONS.md ADR-0011.
 */
export function InteractiveDeck() {
  const [mounted, setMounted] = React.useState(false);
  const [today, setToday] = React.useState("");
  const [state, setState] = React.useState<MomentumState>(() => emptyState());
  const [loadStatus, setLoadStatus] =
    React.useState<LoadResult["status"]>("empty");
  const [saveOk, setSaveOk] = React.useState(true);
  const repoRef = React.useRef<MomentumRepository | null>(null);
  const corruptRawRef = React.useRef("");

  React.useEffect(() => {
    const repo = createLocalStorageRepository(window.localStorage);
    repoRef.current = repo;
    const t = toISODate(new Date());
    setToday(t);

    const res = repo.load();
    setLoadStatus(res.status);
    if (res.status === "corrupt") {
      corruptRawRef.current = res.raw;
      setState(res.state);
    } else {
      const s = res.state;
      // Ensure a working entry for today exists, but DO NOT persist it until the
      // user actually edits something (empty-first).
      setState(
        s.entries[t] ? s : { ...s, entries: { ...s.entries, [t]: blankEntry(t) } },
      );
    }
    setMounted(true);
  }, []);

  const recovery = loadStatus === "corrupt";
  const todayEntry = state.entries[today] ?? blankEntry(today);

  function persist(next: MomentumState) {
    setState(next);
    const repo = repoRef.current;
    if (repo && !recovery) setSaveOk(repo.save(next).ok);
  }

  function patchToday(patch: Partial<DailyEntry>) {
    if (recovery) return;
    const updated: DailyEntry = { ...todayEntry, ...patch, date: today };
    persist(updateEntry(state, today, updated, today));
  }

  function addPriority(title: string) {
    const t = title.trim();
    if (!t || todayEntry.priorities.length >= state.preferences.maxPriorities) return;
    const p: Priority = { id: newId(), title: t, done: false };
    patchToday({ priorities: [...todayEntry.priorities, p] });
  }

  function togglePriority(id: string) {
    patchToday({
      priorities: todayEntry.priorities.map((p) =>
        p.id === id ? { ...p, done: !p.done } : p,
      ),
    });
  }

  function removePriority(id: string) {
    patchToday({ priorities: todayEntry.priorities.filter((p) => p.id !== id) });
  }

  if (!mounted) return <DeckSkeleton />;

  if (recovery) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-danger">Recovery mode</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <p className="leading-relaxed text-muted-foreground">
            Your saved data couldn&apos;t be read, so the deck is read-only to avoid
            overwriting it. The original data has been backed up on this device.
            Export it before starting fresh.
          </p>
          <ExportButtons rawOverride={corruptRawRef.current} />
        </CardContent>
      </Card>
    );
  }

  const atCap = todayEntry.priorities.length >= state.preferences.maxPriorities;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{formatLongDate(today)}</p>

      {/* Keystone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">
            Keystone — the one thing
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input
            value={todayEntry.keystone}
            placeholder="What is the one thing that defines today?"
            onChange={(e) => patchToday({ keystone: e.target.value })}
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">End of day:</span>
            <Toggle
              active={todayEntry.keystoneProtected === true}
              onClick={() =>
                patchToday({
                  keystoneProtected:
                    todayEntry.keystoneProtected === true ? undefined : true,
                })
              }
            >
              Protected
            </Toggle>
            <Toggle
              active={todayEntry.keystoneProtected === false}
              danger
              onClick={() =>
                patchToday({
                  keystoneProtected:
                    todayEntry.keystoneProtected === false ? undefined : false,
                })
              }
            >
              Not protected
            </Toggle>
          </div>
          {todayEntry.priorities.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Minimum: a keystone and the end-of-day check. That&apos;s a real entry.
            </p>
          ) : null}
        </CardContent>
      </Card>

      {/* Explicit trade-off */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">
            What I am NOT doing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={todayEntry.notDoing}
            placeholder="Name the trade-off — and why"
            onChange={(e) => patchToday({ notDoing: e.target.value })}
          />
        </CardContent>
      </Card>

      {/* Priorities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-muted-foreground">
            <span>Priorities</span>
            <span className="text-xs font-normal">
              max {state.preferences.maxPriorities} · a preference, not a law
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5">
          {todayEntry.priorities.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <button
                aria-label={p.done ? "Mark not done" : "Mark done"}
                onClick={() => togglePriority(p.id)}
                className={
                  p.done
                    ? "grid size-5 shrink-0 place-items-center rounded-md bg-success/20 text-xs text-success"
                    : "size-5 shrink-0 rounded-md border border-border"
                }
              >
                {p.done ? "✓" : ""}
              </button>
              <span
                className={
                  p.done ? "text-sm text-muted-foreground line-through" : "text-sm"
                }
              >
                {p.title}
              </span>
              <button
                aria-label="Remove priority"
                onClick={() => removePriority(p.id)}
                className="ml-auto text-muted-foreground hover:text-danger"
              >
                ✕
              </button>
            </div>
          ))}
          {atCap ? (
            <p className="text-xs text-muted-foreground">
              At your cap of {state.preferences.maxPriorities}. Constraint is the point.
            </p>
          ) : (
            <AddPriority onAdd={addPriority} />
          )}
        </CardContent>
      </Card>

      {/* Optional context */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Leverage capture (optional)</label>
            <select
              value={todayEntry.leverage?.kind ?? ""}
              onChange={(e) =>
                patchToday({
                  leverage: e.target.value
                    ? { kind: e.target.value as LeverageKind, note: todayEntry.leverage?.note }
                    : undefined,
                })
              }
              className="h-9 rounded-md border border-border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">—</option>
              {(todayEntry.leverage &&
              !state.preferences.leveragePrompts.includes(todayEntry.leverage.kind)
                ? [...state.preferences.leveragePrompts, todayEntry.leverage.kind]
                : state.preferences.leveragePrompts
              ).map((k) => (
                <option key={k} value={k}>
                  {LEVERAGE_LABELS[k]}
                </option>
              ))}
            </select>
            {todayEntry.leverage ? (
              <Input
                value={todayEntry.leverage.note ?? ""}
                placeholder="Note (optional)"
                onChange={(e) =>
                  patchToday({
                    leverage: { kind: todayEntry.leverage!.kind, note: e.target.value },
                  })
                }
              />
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Compounding action (optional)</label>
            <Input
              value={todayEntry.compoundingAction ?? ""}
              placeholder="One learning / project / writing action"
              onChange={(e) =>
                patchToday({ compoundingAction: e.target.value || undefined })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">
              Energy (context only — never advice)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <Toggle
                  key={n}
                  active={todayEntry.energy === n}
                  onClick={() =>
                    patchToday({
                      energy:
                        todayEntry.energy === n
                          ? undefined
                          : (n as 1 | 2 | 3 | 4 | 5),
                    })
                  }
                >
                  {String(n)}
                </Toggle>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Note (optional)</label>
            <Input
              value={todayEntry.note ?? ""}
              placeholder="One line of context"
              onChange={(e) => patchToday({ note: e.target.value || undefined })}
            />
          </div>
        </CardContent>
      </Card>

      <SelfRecordStrip entries={entriesAscending(state)} />

      <div className="flex items-center justify-between gap-3">
        <ExportButtons state={state} />
        {!saveOk ? (
          <Badge variant="warning">Not saving — storage unavailable</Badge>
        ) : null}
      </div>
    </div>
  );
}

function Toggle({
  active,
  danger,
  onClick,
  children,
}: {
  active: boolean;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const base =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-3 text-xs font-medium transition-colors";
  const cls = active
    ? danger
      ? "border-transparent bg-danger/15 text-danger"
      : "border-transparent bg-success/15 text-success"
    : "border-border text-muted-foreground hover:bg-muted";
  return (
    <button onClick={onClick} className={`${base} ${cls}`}>
      {children}
    </button>
  );
}

function AddPriority({ onAdd }: { onAdd: (title: string) => void }) {
  const [value, setValue] = React.useState("");
  function submit() {
    onAdd(value);
    setValue("");
  }
  return (
    <div className="flex gap-2">
      <Input
        value={value}
        placeholder="Add a priority"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />
      <Button variant="outline" size="sm" onClick={submit}>
        Add
      </Button>
    </div>
  );
}

function DeckSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-28 rounded-xl border border-border bg-card" />
      ))}
    </div>
  );
}
