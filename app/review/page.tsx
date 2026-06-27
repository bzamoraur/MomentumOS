import Link from "next/link";
import { WeeklyReview } from "@/components/review/weekly-review";

export default function ReviewPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-4 py-8 sm:max-w-lg">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Momentum OS
          </span>
          <Link
            href="/"
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Back to today
          </Link>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Weekly confrontation</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Close last week against your own record, then commit — or don&apos;t. The
          grade is yours to make; the facts are just the facts.
        </p>
      </header>

      <WeeklyReview />

      <footer className="mt-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
        Verdicts are recorded once and can&apos;t be re-edited. Everything stays on this
        device — export any time from the deck.
      </footer>
    </main>
  );
}
