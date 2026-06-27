"use client";

import * as React from "react";
import type { LeverageKind, Preferences } from "@/lib/types";
import { LEVERAGE_LABELS, LEVERAGE_KINDS } from "@/lib/types";
import {
  createLocalStorageRepository,
  emptyState,
  setPreferences,
  type MomentumState,
  type LoadResult,
  type MomentumRepository,
} from "@/lib/repository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MIN_PRIORITIES = 1;
const MAX_PRIORITIES = 5;

/** Edits the labeled defaults (ADR-0010). Autosaves invisibly, like the deck. */
export function PreferencesForm() {
  const [mounted, setMounted] = React.useState(false);
  const [state, setState] = React.useState<MomentumState>(() => emptyState());
  const [loadStatus, setLoadStatus] = React.useState<LoadResult["status"]>("empty");
  const [saveOk, setSaveOk] = React.useState(true);
  const repoRef = React.useRef<MomentumRepository | null>(null);

  React.useEffect(() => {
    const repo = createLocalStorageRepository(window.localStorage);
    repoRef.current = repo;
    const res = repo.load();
    setLoadStatus(res.status);
    setState(res.state);
    setMounted(true);
  }, []);

  const recovery = loadStatus === "corrupt";
  const prefs = state.preferences;

  function update(patch: Partial<Preferences>) {
    if (recovery) return;
    const next = setPreferences(state, { ...prefs, ...patch });
    setState(next);
    const repo = repoRef.current;
    if (repo) setSaveOk(repo.save(next).ok);
  }

  function toggleLeverage(kind: LeverageKind) {
    const has = prefs.leveragePrompts.includes(kind);
    // keep canonical order; add or remove the toggled kind
    const next = LEVERAGE_KINDS.filter((k) =>
      k === kind ? !has : prefs.leveragePrompts.includes(k),
    );
    update({ leveragePrompts: next });
  }

  if (!mounted) return <FormSkeleton />;

  if (recovery) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-danger">Recovery mode</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your saved data couldn&apos;t be read. Open the deck to export your backup
            before changing settings.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Daily priority cap</CardTitle>
          <p className="text-xs text-muted-foreground">
            A preference, not a law — the constraint is the point.
          </p>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            aria-label="Decrease cap"
            disabled={prefs.maxPriorities <= MIN_PRIORITIES}
            onClick={() =>
              update({ maxPriorities: Math.max(MIN_PRIORITIES, prefs.maxPriorities - 1) })
            }
          >
            −
          </Button>
          <span className="w-6 text-center text-lg font-semibold tabular-nums">
            {prefs.maxPriorities}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Increase cap"
            disabled={prefs.maxPriorities >= MAX_PRIORITIES}
            onClick={() =>
              update({ maxPriorities: Math.min(MAX_PRIORITIES, prefs.maxPriorities + 1) })
            }
          >
            +
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Week starts on</CardTitle>
          <p className="text-xs text-muted-foreground">
            Affects how future weeks are grouped; past entries keep their week.
          </p>
        </CardHeader>
        <CardContent className="flex gap-2">
          {(["monday", "sunday"] as const).map((d) => (
            <button
              key={d}
              onClick={() => update({ weekStartsOn: d })}
              aria-pressed={prefs.weekStartsOn === d}
              className={`inline-flex h-8 flex-1 items-center justify-center rounded-md border px-3 text-xs font-medium capitalize transition-colors ${
                prefs.weekStartsOn === d
                  ? "border-transparent bg-accent/15 text-accent"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {d}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Leverage prompts</CardTitle>
          <p className="text-xs text-muted-foreground">
            Which consultant captures appear in the daily deck.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {LEVERAGE_KINDS.map((k) => {
            const on = prefs.leveragePrompts.includes(k);
            return (
              <button
                key={k}
                onClick={() => toggleLeverage(k)}
                aria-pressed={on}
                className={`flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-muted ${
                  on ? "" : "text-muted-foreground"
                }`}
              >
                <span>{LEVERAGE_LABELS[k]}</span>
                <span className={on ? "text-accent" : "text-muted-foreground"}>
                  {on ? "On" : "Off"}
                </span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {!saveOk ? (
        <Badge variant="warning">Not saving — storage unavailable</Badge>
      ) : null}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-28 rounded-xl border border-border bg-card" />
      ))}
    </div>
  );
}
