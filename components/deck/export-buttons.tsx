"use client";

import { Button } from "@/components/ui/button";
import { toJSON, toMarkdown } from "@/lib/export";
import type { MomentumState } from "@/lib/repository";

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * User-initiated export so the ledger survives a cleared cache. In recovery mode
 * (`rawOverride`), exports the archived raw blob instead of the parsed state.
 */
export function ExportButtons({
  state,
  rawOverride,
}: {
  state?: MomentumState;
  rawOverride?: string;
}) {
  if (rawOverride !== undefined) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          download("momentum-os-backup.json", rawOverride, "application/json")
        }
      >
        Export backup
      </Button>
    );
  }
  if (!state) return null;
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => download("momentum-os.json", toJSON(state), "application/json")}
      >
        Export JSON
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => download("momentum-os.md", toMarkdown(state), "text/markdown")}
      >
        Export Markdown
      </Button>
    </div>
  );
}
