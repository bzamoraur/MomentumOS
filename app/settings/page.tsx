import Link from "next/link";
import { PreferencesForm } from "@/components/settings/preferences-form";

export default function SettingsPage() {
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
        <h1 className="text-2xl font-semibold tracking-tight">Preferences</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Every default here is a stance, not science — edit it to fit how you
          actually work. Changes save to this device.
        </p>
      </header>

      <PreferencesForm />
    </main>
  );
}
