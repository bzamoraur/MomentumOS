import { today } from "@/mock-data/history";
import { LEVERAGE_LABELS } from "@/lib/types";
import { daysBetween } from "@/lib/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/** Read-only render of today's plan (slice 1). Interactivity arrives in PR2. */
export function DailyDeck() {
  const e = today;

  return (
    <div className="flex flex-col gap-4">
      {/* Keystone — the one thing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">
            Keystone — the one thing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold leading-snug">{e.keystone}</p>
          <div className="mt-3">
            {e.keystoneProtected === undefined ? (
              <Badge variant="outline">End-of-day check pending</Badge>
            ) : e.keystoneProtected ? (
              <Badge variant="success">Protected</Badge>
            ) : (
              <Badge variant="danger">Not protected</Badge>
            )}
          </div>
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
          {e.notDoing ? (
            <p className="text-sm leading-relaxed">{e.notDoing}</p>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No trade-off named today.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Priorities (plain — no tags, no points) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-muted-foreground">
            <span>Priorities</span>
            <span className="text-xs font-normal">max 3 · a preference, not a law</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5">
          {e.priorities.map((p) => {
            const carried = p.carriedFromDate
              ? daysBetween(p.carriedFromDate, e.date)
              : 0;
            return (
              <div key={p.id} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={
                    p.done
                      ? "grid size-5 place-items-center rounded-md bg-success/20 text-xs text-success"
                      : "size-5 rounded-md border border-border"
                  }
                >
                  {p.done ? "✓" : ""}
                </span>
                <span
                  className={
                    p.done
                      ? "text-sm text-muted-foreground line-through"
                      : "text-sm"
                  }
                >
                  {p.title}
                </span>
                {carried > 0 && !p.done ? (
                  <Badge variant="warning" className="ml-auto shrink-0">
                    carried {carried}d
                  </Badge>
                ) : null}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Optional context: leverage / compounding / energy */}
      <Card>
        <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
          <Meta
            label={e.leverage ? LEVERAGE_LABELS[e.leverage.kind] : "Leverage capture"}
            value={e.leverage?.note ?? (e.leverage ? "captured" : "—")}
          />
          <Meta label="Compounding action" value={e.compoundingAction ?? "—"} />
          <Meta
            label="Energy (context only)"
            value={e.energy ? `${e.energy}/5` : "—"}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm leading-snug">{value}</span>
    </div>
  );
}
