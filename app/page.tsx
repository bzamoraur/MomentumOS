import Link from "next/link";
import { InteractiveDeck } from "@/components/deck/interactive-deck";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-4 py-8 sm:max-w-lg">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Momentum OS
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/review"
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Weekly review
            </Link>
            <Link
              href="/settings"
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Settings
            </Link>
            <Link
              href="/preview"
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Sample
            </Link>
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Decide the day, then face your own record. One keystone, one explicit
          trade-off — no score to game. Your entries stay on this device.
        </p>
      </header>

      <InteractiveDeck />

      <footer className="mt-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
        Your ledger starts empty and lives only in this browser — export it any
        time. The Weekly Confrontation and commitment carry-forward arrive next.
        See <span className="font-mono text-foreground">PRD.md</span>.
      </footer>
    </main>
  );
}
