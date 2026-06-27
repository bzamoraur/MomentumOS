import Link from "next/link";
import { mockHistory, today } from "@/mock-data/history";
import { formatLongDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { DailyDeck } from "@/components/deck/daily-deck";
import { SelfRecordStrip } from "@/components/deck/self-record-strip";

/**
 * A read-only SAMPLE week, rendered from fictional seed data. This is never
 * written to the store — it exists so a new user can see what their own record
 * will look like after logging real days, without seeding fiction into the
 * confrontation ledger. See DECISIONS.md ADR-0011.
 */
export default function PreviewPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-4 py-8 sm:max-w-lg">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Momentum OS
          </span>
          <Badge variant="warning">Sample — not your data</Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {formatLongDate(today.date)}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A seeded sample week, so you can see what your record looks like after
          logging real days. This is never saved.{" "}
          <Link
            href="/"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Back to today
          </Link>
          .
        </p>
      </header>

      <DailyDeck entry={today} />
      <SelfRecordStrip entries={mockHistory} />
    </main>
  );
}
