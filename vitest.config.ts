import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    // Default to node for fast, deterministic pure-logic tests. Component tests
    // opt into jsdom per-file via a `@vitest-environment jsdom` docblock.
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: [
      "tests/**/*.test.{ts,tsx}",
      "lib/**/*.test.ts",
      "components/**/*.test.tsx",
    ],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
