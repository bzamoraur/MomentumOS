import { today } from "@/mock-data/history";
import { formatLongDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { DailyDeck } from "@/components/deck/daily-deck";
import { SelfRecordStrip } from "@/components/deck/self-record-strip";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-4 py-8 sm:max-w-lg">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Momentum OS
          </span>
          <Badge variant="outline">Seeded demo data</Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {formatLongDate(today.date)}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Decide the day, then face your own record. One keystone, one explicit
          trade-off — no score to game.
        </p>
      </header>

      <DailyDeck />
      <SelfRecordStrip />

      <footer className="mt-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
        Slice 1 of the MVP — a read-only Daily Command Deck rendered from seeded
        data. Interactivity, local persistence, export, and the Weekly
        Confrontation arrive in later PRs. See{" "}
        <span className="font-mono text-foreground">PRD.md</span>.
      </footer>
    </main>
  );
}
