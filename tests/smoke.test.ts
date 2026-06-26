import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("toolchain smoke", () => {
  it("resolves the @ alias and merges class names", () => {
    expect(cn("p-2", "text-sm")).toBe("p-2 text-sm");
  });

  it("lets later Tailwind classes win conflicts", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
