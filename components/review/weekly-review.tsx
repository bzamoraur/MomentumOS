"use client";

import * as React from "react";
import type { WeeklyOutcome } from "@/lib/types";
import { toISODate, formatLongDate } from "@/lib/date";
import {
  createLocalStorageRepository,
  emptyState,
  entriesAscending,
  setCommitment,
  closeWeek,
  type MomentumState,
  type LoadResult,
  type MomentumRepository,
} from "@/lib/repository";
import {
  startOfWeek,
  previousWeekStart,
  entriesForWeek,
  findCommitment,
  weekToClose,
} from "@/lib/week";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SelfRecordStrip } from "@/components/deck/self-record-strip";
import { ExportButtons } from "@/components/deck/export-buttons";

const OUTCOMES: WeeklyOutcome[] = ["kept", "partial", "missed"];

/**
 * The Weekly Confrontation (PR3b). Closes the oldest unreviewed elapsed week with
 * an explicit, once-only verdict, shows that week's facts kept SEPARATE from the
 * self-reported grade, and lets the user set an OPTIONAL commitment for this week.
 * See DECISIONS.md ADR-0012.
 */
export function WeeklyReview() {
  const [mounted, setMounted] = React.useState(false);
  const [today, setToday] = React.useState("");
  const [state, setState] = React.useState<MomentumState>(() => emptyState());
  const [loadStatus, setLoadStatus] = React.useState<LoadResult["status"]>("empty");
  const [saveOk, setSaveOk] = React.useState(true);
  const repoRef = React.useRef<MomentumRepository | null>(null);
  const corruptRawRef = React.useRef("");

  // Grade in progress — local until the explicit "Close the week" commit.
  const [grade, setGrade] = React.useState<WeeklyOutcome | null>(null);
  const [why, setWhy] = React.useState("");
  // Local draft for the free-text commitment; persistence is a side effect.
  const [commitmentDraft, setCommitmentDraft] = React.useState("");

  React.useEffect(() => {
    const repo = createLocalStorageRepository(window.localStorage);
    repoRef.current = repo;
    const t = toISODate(new Date());
    setToday(t);
    const res = repo.load();
    setLoadStatus(res.status);
    if (res.status === "corrupt") {
      corruptRawRef.current = res.raw;
    } else {
      const tw = startOfWeek(t, res.state.preferences.weekStartsOn);
      setCommitmentDraft(findCommitment(res.state.commitments, tw)?.commitment ?? "");
    }
    setState(res.state);
    setMounted(true);
  }, []);

  const recovery = loadStatus === "corrupt";

  function persist(next: MomentumState) {
    setState(next);
    const repo = repoRef.current;
    if (repo && !recovery) setSaveOk(repo.save(next).ok);
  }

  if (!mounted) return <ReviewSkeleton />;

  if (recovery) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-danger">Recovery mode</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <p className="leading-relaxed text-muted-foreground">
            Your saved data couldn&apos;t be read. Export your backup, then start
            fresh from the deck.
          </p>
          <ExportButtons rawOverride={corruptRawRef.current} />
        </CardContent>
      </Card>
    );
  }

  const { weekStartsOn } = state.preferences;
  const entries = entriesAscending(state);
  const thisWeek = startOfWeek(today, weekStartsOn);
  const closeable = weekToClose(state.commitments, state.reviews, today);
  // "Carry forward" anchors to the calendar-prior week (not necessarily the week
  // being closed) — literally "keep last week's commitment" (ADR-0012).
  const priorCommitment =
    findCommitment(state.commitments, previousWeekStart(thisWeek))?.commitment ?? null;

  function changeCommitment(text: string) {
    setCommitmentDraft(text);
    setThisWeekCommitment(text);
  }

  function closeTheWeek() {
    if (!closeable || !grade) return;
    const now = toISODate(new Date()); // re-derive at submit (midnight edge, ADR-0012)
    persist(
      closeWeek(
        state,
        {
          weekOf: closeable,
          outcome: grade,
          outcomeNote: why.trim() || undefined,
          reviewedOn: now,
        },
        now,
      ),
    );
    setGrade(null);
    setWhy("");
  }

  function setThisWeekCommitment(text: string) {
    const t = text.trim();
    persist(
      t
        ? setCommitment(state, { weekOf: thisWeek, commitment: t })
        : { ...state, commitments: state.commitments.filter((c) => c.weekOf !== thisWeek) },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {closeable ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-muted-foreground">Close last week</CardTitle>
              <p className="text-xs text-muted-foreground">
                Week of {formatLongDate(closeable)}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Your commitment was</p>
                <p className="text-base font-medium leading-snug">
                  {findCommitment(state.commitments, closeable)?.commitment ??
                    "— no commitment was set for that week"}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground">
                  Did you keep it? Your call — the facts below don&apos;t decide this.
                </span>
                <div className="flex gap-2">
                  {OUTCOMES.map((o) => (
                    <GradeButton
                      key={o}
                      outcome={o}
                      active={grade === o}
                      onClick={() => setGrade(grade === o ? null : o)}
                    />
                  ))}
                </div>
                <Input
                  value={why}
                  placeholder="Why? (one line)"
                  onChange={(e) => setWhy(e.target.value)}
                />
                <Button onClick={closeTheWeek} disabled={!grade}>
                  Close the week
                </Button>
                <p className="text-xs text-muted-foreground">
                  Recorded once, and can&apos;t be edited later — that&apos;s the point.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-1.5">
            <span className="px-1 text-xs text-muted-foreground">
              What that week actually showed (facts, not a grade):
            </span>
            <SelfRecordStrip
              entries={entriesForWeek(entries, closeable)}
              caption="that week"
              note="Facts from the week you're closing — they don't grade your commitment; you do."
            />
          </div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground">Nothing to close</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {state.reviews.length
                ? "You're caught up. The next review unlocks once the current week has fully elapsed."
                : "Your first weekly review unlocks after a full week has passed with a commitment set. Set one below."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* This week's commitment — optional by design */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">This week&apos;s commitment</CardTitle>
          <p className="text-xs text-muted-foreground">
            Week of {formatLongDate(thisWeek)}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Input
            value={commitmentDraft}
            placeholder="One behavioral change (optional)"
            onChange={(e) => changeCommitment(e.target.value)}
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Optional. Keep last week&apos;s, set a new one, or leave it blank — a forced
            weekly commitment is just theater.
          </p>
          {priorCommitment && priorCommitment !== commitmentDraft ? (
            <Button
              variant="outline"
              size="sm"
              className="self-start"
              onClick={() => changeCommitment(priorCommitment)}
            >
              Carry forward last week&apos;s
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <ExportButtons state={state} />
        {!saveOk ? (
          <Badge variant="warning">Not saving — storage unavailable</Badge>
        ) : null}
      </div>
    </div>
  );
}

function GradeButton({
  outcome,
  active,
  onClick,
}: {
  outcome: WeeklyOutcome;
  active: boolean;
  onClick: () => void;
}) {
  const tone =
    outcome === "kept" ? "success" : outcome === "missed" ? "danger" : "warning";
  const activeCls =
    tone === "success"
      ? "border-transparent bg-success/15 text-success"
      : tone === "danger"
        ? "border-transparent bg-danger/15 text-danger"
        : "border-transparent bg-warning/15 text-warning";
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-8 flex-1 items-center justify-center rounded-md border px-3 text-xs font-medium capitalize transition-colors ${
        active ? activeCls : "border-border text-muted-foreground hover:bg-muted"
      }`}
    >
      {outcome}
    </button>
  );
}

function ReviewSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4" aria-hidden>
      {[0, 1].map((i) => (
        <div key={i} className="h-40 rounded-xl border border-border bg-card" />
      ))}
    </div>
  );
}
