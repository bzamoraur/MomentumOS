// Extends Vitest's `expect` with jest-dom matchers (toBeInTheDocument, etc.) and
// unmounts React trees between tests. Harmless for node-env tests (cleanup is a
// no-op when nothing was rendered); required for the jsdom component tests.
import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
