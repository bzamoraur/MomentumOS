import {
  keystoneProtection,
  topPrioritySlip,
  tradeOffNamingRate,
  compoundingNeglectDays,
  plannedVsCompleted,
} from "@/lib/signals";
import { mockHistory } from "@/mock-data/history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WINDOW = 7;

/**
 * The differentiator: confrontation by your own data. Plain facts derived from
 * the user's own history — deliberately NOT aggregated into a score, because a
 * single number invites gaming (Goodhart/surrogation). See DECISIONS.md ADR-0002.
 */
export function SelfRecordStrip() {
  const ks = keystoneProtection(mockHistory, WINDOW);
  const slip = topPrioritySlip(mockHistory);
  const naming = tradeOffNamingRate(mockHistory, WINDOW);
  const neglect = compoundingNeglectDays(mockHistory);
  const pvc = plannedVsCompleted(mockHistory, WINDOW);

  const facts: { label: string; value: string }[] = [
    {
      label: "Keystone protected",
      value: ks.answered
        ? `${ks.protected} of ${ks.answered} days you answered`
        : "no end-of-day answers yet",
    },
    {
      label: "Priorities completed",
      value: `${pvc.completed} of ${pvc.planned} planned`,
    },
    {
      label: "Trade-off named",
      value: `${naming.named} of ${naming.total} days`,
    },
    {
      label: "Longest slip",
      value: slip
        ? `“${slip.title}” — ${slip.days} days running`
        : "none carried 2+ days",
    },
    {
      label: "Compounding action",
      value:
        neglect === 0
          ? "logged today"
          : `none in ${neglect} day${neglect === 1 ? "" : "s"}`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your own record</span>
          <span className="text-xs font-normal text-muted-foreground">
            last {WINDOW} days
          </span>
        </CardTitle>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Facts from your own entries. No score, nothing to optimize — you decide
          what they mean.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-border">
          {facts.map((f) => (
            <div
              key={f.label}
              className="flex items-baseline justify-between gap-4 bg-muted/40 px-4 py-3"
            >
              <span className="text-sm text-muted-foreground">{f.label}</span>
              <span className="text-right text-sm font-medium tabular-nums">
                {f.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
